"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { Calculator, CircleAlert, ExternalLink } from "lucide-react";
import type { Listing, TimeSlot } from "@/data/types";
import { TIME_SLOTS, TIME_SLOT_LABELS } from "@/data/types";
import { WORK_HOURS, estimateAll, type Amount, type WorkHours } from "@/lib/pricing";
import { formatDateFi, formatRange } from "@/lib/format";

const amountText = (a: Amount) => formatRange(a.min, a.max);

const SLOT_HINT: Record<TimeSlot, string> = {
  weekday: "ma–pe virka-aikaan",
  evening: "arkisin iltaisin ja öisin",
  weekend: "la–su",
  holiday: "esim. helatorstai",
};

export function PriceCalculator({ rows }: { rows: Listing[] }) {
  const [hours, setHours] = useState<WorkHours>(2);
  const [slot, setSlot] = useState<TimeSlot>("weekday");
  const [includeCallOut, setIncludeCallOut] = useState(true);
  const [withMaterials, setWithMaterials] = useState(false);
  const [materialsInput, setMaterialsInput] = useState("");
  const materialsId = useId();

  const materialsValue = Number(materialsInput.replace(",", "."));
  const materialsInvalid = withMaterials && materialsInput !== "" && (!Number.isFinite(materialsValue) || materialsValue < 0 || materialsValue > 100_000);
  const materials = withMaterials && !materialsInvalid && materialsInput !== "" ? Math.round(materialsValue) : 0;

  const results = useMemo(
    () => estimateAll(rows, { hours, slot, includeCallOut, materials }),
    [rows, hours, slot, includeCallOut, materials],
  );
  const priced = results.filter((r) => r.status === "ok");
  const lastVerified = rows.map((r) => r.lastVerified).filter(Boolean).sort().at(-1) ?? null;

  const segment =
    "flex min-h-11 cursor-pointer items-center justify-center rounded-[9px] border border-transparent px-3 text-[0.95rem] font-semibold text-navy-800 has-[:checked]:border-navy-900 has-[:checked]:bg-navy-900 has-[:checked]:text-white has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-teal-600 hover:bg-white";

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_1fr] lg:gap-8">
      <form className="h-fit rounded-2xl bg-mist p-5 sm:p-6 lg:sticky lg:top-24" onSubmit={(e) => e.preventDefault()} aria-label="Hinta-arvion valinnat">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-teal-700" aria-hidden="true" />
          <h3 className="text-xl">Työn tiedot</h3>
        </div>

        <fieldset className="mt-5">
          <legend className="text-sm font-semibold">Arvioitu työaika</legend>
          <div className="mt-2 grid grid-cols-4 gap-1 rounded-[11px] border border-rule bg-mist p-1">
            {WORK_HOURS.map((h) => (
              <label key={h} className={segment}>
                <input type="radio" name="hours" value={h} checked={hours === h} onChange={() => setHours(h)} className="sr-only" />
                {h} h
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-5">
          <legend className="text-sm font-semibold">Ajankohta</legend>
          <div className="mt-2 grid grid-cols-2 gap-1 rounded-[11px] border border-rule bg-mist p-1">
            {TIME_SLOTS.map((s) => (
              <label key={s} className={`${segment} flex-col py-1.5 leading-tight`}>
                <input type="radio" name="slot" value={s} checked={slot === s} onChange={() => setSlot(s)} className="sr-only" />
                {TIME_SLOT_LABELS[s]}
                <span className="text-xs font-normal opacity-80">{SLOT_HINT[s]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-5 space-y-3 text-[0.95rem]">
          <label className="flex items-start gap-2.5">
            <input type="checkbox" checked={includeCallOut} onChange={(e) => setIncludeCallOut(e.target.checked)} className="mt-1 h-4 w-4 accent-teal-700" />
            <span>Lisää lähtö- tai huoltoautomaksu, jos yritys on julkaissut sen</span>
          </label>
          <label className="flex items-start gap-2.5">
            <input type="checkbox" checked={withMaterials} onChange={(e) => setWithMaterials(e.target.checked)} className="mt-1 h-4 w-4 accent-teal-700" />
            <span>Lisää oma arvio tarvikkeista</span>
          </label>
          {withMaterials ? (
            <div className="pl-6">
              <label htmlFor={materialsId} className="text-sm font-semibold">Tarvikkeet yhteensä (€)</label>
              <input
                id={materialsId}
                inputMode="decimal"
                value={materialsInput}
                onChange={(e) => setMaterialsInput(e.target.value)}
                placeholder="esim. 150"
                aria-invalid={materialsInvalid || undefined}
                aria-describedby={materialsInvalid ? `${materialsId}-err` : undefined}
                className="mt-1 h-11 w-full rounded-[10px] border border-rule bg-white px-3 text-base aria-[invalid=true]:border-danger"
              />
              {materialsInvalid ? (
                <p id={`${materialsId}-err`} className="mt-1 text-sm text-danger">Kirjoita summa numeroina, esim. 150.</p>
              ) : null}
            </div>
          ) : null}
        </div>
      </form>

      <div>
        <div className="flex items-start gap-3 rounded-2xl border-2 border-amber-800/30 bg-amber-50 p-4 text-[0.95rem] text-navy-900">
          <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" aria-hidden="true" />
          <p>
            <strong>Tämä on hinta-arvio, ei sitova tarjous.</strong> Arvio perustuu yritysten julkaisemiin hintoihin
            (tarkistettu {formatDateFi(lastVerified)}). Todellinen hinta riippuu työstä, tarvikkeista ja yrityksen ehdoista.
          </p>
        </div>

        <p className="mt-5 text-navy-700" aria-live="polite">
          {priced.length > 0
            ? `${TIME_SLOT_LABELS[slot]}, ${hours} h työtä: ${priced.length} vertailukelpoista arviota.`
            : `${TIME_SLOT_LABELS[slot]}: yksikään vertailun yritys ei ole julkaissut hintaa tälle ajankohdalle.`}
        </p>

        <ul className="mt-4 space-y-4">
          {results.map((r) => {
            const listing = rows.find((l) => l.id === r.listingId)!;
            return (
              <li key={r.listingId} className={`rounded-2xl border border-rule p-5 ${r.kind === "benchmark" ? "bg-mist" : "bg-white shadow-soft"}`}>
                <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
                  <div>
                    <h3 className="text-lg">{r.name}</h3>
                    {r.kind === "benchmark" ? <p className="text-sm text-navy-600">Markkinavertailu – ei yrityksen hinta</p> : null}
                  </div>
                  {r.status === "ok" && r.total ? (
                    <div className="text-right">
                      <p className="text-sm text-navy-600">Arvio yhteensä</p>
                      <p className="num text-[1.9rem] font-bold leading-none text-navy-900" style={{ fontVariationSettings: '"wdth" 86' }}>
                        {amountText(r.total)}
                      </p>
                    </div>
                  ) : null}
                </div>

                {r.status === "ok" ? (
                  <>
                    <dl className="mt-4 grid gap-x-6 gap-y-1.5 border-t border-rule pt-4 text-[0.95rem] sm:grid-cols-[auto_1fr]">
                      <dt className="text-navy-600">Työ</dt>
                      <dd className="num">
                        {r.labour ? amountText(r.labour) : "–"}
                        {r.labourExplanation ? <span className="text-navy-600"> ({r.labourExplanation})</span> : null}
                      </dd>
                      <dt className="text-navy-600">Lähtömaksu</dt>
                      <dd className="num">{r.callOut ? amountText(r.callOut) : "ei mukana"}</dd>
                      {r.materials > 0 ? (
                        <>
                          <dt className="text-navy-600">Tarvikkeet (oma arvio)</dt>
                          <dd className="num">{formatRange(r.materials, r.materials)}</dd>
                        </>
                      ) : null}
                    </dl>
                    {r.notes.length > 0 ? (
                      <ul className="mt-3 space-y-1 text-sm text-navy-700">
                        {r.notes.map((n) => <li key={n}>{n}</li>)}
                      </ul>
                    ) : null}
                    {r.excluded.length > 0 ? (
                      <details className="group mt-3 text-sm">
                        <summary className="cursor-pointer font-semibold text-navy-800 hover:text-teal-800">
                          Ei sisälly arvioon ({r.excluded.length})
                        </summary>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-navy-700">
                          {r.excluded.map((x) => <li key={x}>{x}</li>)}
                        </ul>
                      </details>
                    ) : null}
                  </>
                ) : (
                  <p className="mt-2 text-[0.95rem] text-navy-700">{r.noDataReason}</p>
                )}

                {r.kind === "company" ? (
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                    <a href={listing.contactUrl ?? listing.websiteUrl} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 font-semibold text-teal-800 underline underline-offset-2 hover:text-navy-900">
                      Pyydä tarjous yritykseltä
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only"> (avautuu uuteen välilehteen)</span>
                    </a>
                    {listing.sources[0] ? (
                      <a href={listing.sources.at(-1)!.url} target="_blank" rel="noopener noreferrer nofollow" className="text-navy-700 underline underline-offset-2 hover:text-navy-900">
                        Hinnaston lähde
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>

        <p className="mt-6 text-[0.95rem] text-navy-700">
          Etkö löydä sopivaa? Voit myös{" "}
          <Link href="/tarjouspyynto" className="font-semibold text-teal-800 underline underline-offset-2">laatia tarjouspyynnön</Link>{" "}
          ja lähettää sen haluamallesi yritykselle.
        </p>
      </div>
    </div>
  );
}
