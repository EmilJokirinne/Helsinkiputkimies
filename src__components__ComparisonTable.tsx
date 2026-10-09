"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ExternalLink, Search } from "lucide-react";
import type { Listing } from "@/data/types";
import { services } from "@/content/services";
import { formatDateFi } from "@/lib/format";
import {
  REQUEST_QUOTE,
  callOutText,
  hourlyText,
  offHoursText,
  sortValueCallOut,
  sortValueHourly,
  vatText,
} from "@/lib/listing-display";
import { StatusBadge } from "./StatusBadge";

type SortKey = "name" | "hourly" | "callOut";
type SortDir = "asc" | "desc";

interface Props {
  rows: Listing[];
  /** Hakukenttä ja suodattimet (vertailusivu) */
  withFilters?: boolean;
  caption: string;
}

function Missing() {
  return (
    <Link href="/tarjouspyynto" className="font-medium text-teal-800 underline underline-offset-2 hover:text-navy-900">
      {REQUEST_QUOTE}
    </Link>
  );
}

function Value({ text }: { text: string | null }) {
  return text ? <span className="num">{text}</span> : <Missing />;
}

export function ComparisonTable({ rows, withFilters = false, caption }: Props) {
  const [query, setQuery] = useState("");
  const [service, setService] = useState("");
  const [onlyPriced, setOnlyPriced] = useState(false);
  const [showBenchmark, setShowBenchmark] = useState(true);
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: "hourly", dir: "asc" });
  const searchId = useId();
  const serviceId = useId();
  const resultId = useId();

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("fi");
    const filtered = rows.filter((l) => {
      if (!showBenchmark && l.kind === "benchmark") return false;
      if (onlyPriced && l.hourly.status === "unavailable") return false;
      if (q && !`${l.name} ${(l.serviceArea ?? []).join(" ")}`.toLocaleLowerCase("fi").includes(q)) return false;
      if (service) {
        if (l.kind === "benchmark") return false;
        // Yritys ilman eriteltyä palvelulistaa näytetään, koska palvelua ei voi sulkea pois.
        if (!l.services.includes(service as Listing["services"][number]) && !l.servicesNote) return false;
      }
      return true;
    });
    const dir = sort.dir === "asc" ? 1 : -1;
    return filtered.sort((a, b) => {
      // Markkinavertailu on viiterivi: aina yritysten jälkeen.
      if (a.kind !== b.kind) return a.kind === "benchmark" ? 1 : -1;
      if (sort.key === "name") return a.name.localeCompare(b.name, "fi") * dir;
      const va = sort.key === "hourly" ? sortValueHourly(a) : sortValueCallOut(a);
      const vb = sort.key === "hourly" ? sortValueHourly(b) : sortValueCallOut(b);
      // Puuttuvat hinnat aina listan loppuun suunnasta riippumatta.
      if (!Number.isFinite(va) && !Number.isFinite(vb)) return a.name.localeCompare(b.name, "fi");
      if (!Number.isFinite(va)) return 1;
      if (!Number.isFinite(vb)) return -1;
      return (va - vb) * dir;
    });
  }, [rows, query, service, onlyPriced, showBenchmark, sort]);

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

  const ariaSort = (key: SortKey) =>
    sort.key === key ? (sort.dir === "asc" ? "ascending" : "descending") : "none";

  const SortButton = ({ k, label }: { k: SortKey; label: string }) => {
    const Icon = sort.key !== k ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
    return (
      <button
        type="button"
        onClick={() => toggleSort(k)}
        className="inline-flex items-center gap-1.5 rounded px-1 py-0.5 text-left font-semibold hover:text-teal-800"
      >
        {label}
        <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span className="sr-only">, lajittele</span>
      </button>
    );
  };

  const reset = () => {
    setQuery("");
    setService("");
    setOnlyPriced(false);
    setShowBenchmark(true);
  };

  return (
    <div>
      {withFilters ? (
        <div className="mb-6 grid gap-4 rounded-2xl border border-rule bg-white p-4 sm:p-5 md:grid-cols-[1.3fr_1fr] lg:grid-cols-[1.3fr_1fr_auto]">
          <div>
            <label htmlFor={searchId} className="text-sm font-semibold">Hae yritystä tai aluetta</label>
            <div className="relative mt-1.5">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-500" aria-hidden="true" />
              <input
                id={searchId}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Esim. Espoo tai Arina"
                className="h-11 w-full rounded-[10px] border border-rule bg-white pl-9 pr-3 text-base placeholder:text-navy-500 focus:border-teal-700"
              />
            </div>
          </div>
          <div>
            <label htmlFor={serviceId} className="text-sm font-semibold">Palvelu</label>
            <select
              id={serviceId}
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-[10px] border border-rule bg-white px-3 text-base focus:border-teal-700"
            >
              <option value="">Kaikki palvelut</option>
              {services.map((s) => (
                <option key={s.slug} value={s.slug}>{s.shortName}</option>
              ))}
            </select>
          </div>
          <fieldset className="flex flex-col justify-end gap-2 text-[0.95rem] md:col-span-2 md:flex-row md:gap-6 lg:col-span-1 lg:flex-col lg:gap-2">
            <legend className="sr-only">Rajaukset</legend>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={onlyPriced} onChange={(e) => setOnlyPriced(e.target.checked)} className="h-4 w-4 accent-teal-700" />
              Vain julkaistut hinnat
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={showBenchmark} onChange={(e) => setShowBenchmark(e.target.checked)} className="h-4 w-4 accent-teal-700" />
              Näytä markkinavertailu
            </label>
          </fieldset>
        </div>
      ) : null}

      <p id={resultId} className="sr-only" aria-live="polite">
        {visible.length} riviä näkyvissä
      </p>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-rule bg-white p-8 text-center">
          <p className="font-semibold">Hakuehdoilla ei löytynyt yrityksiä.</p>
          <p className="mt-1 text-navy-700">Kokeile toista hakusanaa tai palvelua.</p>
          <button type="button" onClick={reset} className="mt-4 font-semibold text-teal-800 underline underline-offset-4">
            Tyhjennä rajaukset
          </button>
        </div>
      ) : (
        <>
          {/* Työpöytä: taulukko */}
          <div className="hidden overflow-hidden rounded-2xl border border-rule bg-white shadow-soft md:block">
            <table className="w-full border-collapse text-left text-[0.95rem]">
              <caption className="sr-only">{caption}</caption>
              <thead className="bg-mist text-sm text-navy-800">
                <tr>
                  <th scope="col" aria-sort={ariaSort("name")} className="px-4 py-3"><SortButton k="name" label="Yritys" /></th>
                  <th scope="col" aria-sort={ariaSort("hourly")} className="px-4 py-3"><SortButton k="hourly" label="Tuntihinta arkisin" /></th>
                  <th scope="col" aria-sort={ariaSort("callOut")} className="px-4 py-3"><SortButton k="callOut" label="Lähtömaksu" /></th>
                  <th scope="col" className="px-4 py-3 font-semibold">Ilta, viikonloppu ja pyhät</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Alv</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Lähde ja tarkistus</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((l) => (
                  <tr key={l.id} className={`border-t border-rule align-top ${l.kind === "benchmark" ? "bg-mist/50" : ""}`}>
                    <th scope="row" className="px-4 py-4 font-semibold">
                      <a href={l.websiteUrl} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 hover:text-teal-800 hover:underline">
                        {l.name}
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="sr-only"> – verkkosivut (avautuu uuteen välilehteen)</span>
                      </a>
                      {l.kind === "benchmark" ? <p className="mt-1 text-xs font-normal text-navy-600">Ei yritys – suuntaa-antava markkinahinta</p> : null}
                      {l.sponsored ? <p className="mt-1 text-xs font-semibold text-amber-800">Kaupallinen yhteistyö{l.sponsorDisclosure ? `: ${l.sponsorDisclosure}` : ""}</p> : null}
                    </th>
                    <td className="px-4 py-4">
                      <Value text={hourlyText(l, "weekday")} />
                      {l.hourly.status === "estimate" ? <div className="mt-1"><StatusBadge status="estimate" /></div> : null}
                    </td>
                    <td className="px-4 py-4">
                      <Value text={callOutText(l)} />
                      {l.callOut.status === "conflicting" ? (
                        <div className="mt-1"><StatusBadge status="conflicting" title={l.callOut.note} /></div>
                      ) : null}
                    </td>
                    <td className="px-4 py-4 text-navy-800">
                      {offHoursText(l) ?? (l.kind === "benchmark" ? <span className="text-navy-600">Ei tietoa</span> : <Missing />)}
                    </td>
                    <td className="px-4 py-4 text-navy-800">{vatText(l)}</td>
                    <td className="px-4 py-4 text-sm">
                      <ul className="space-y-1">
                        {l.sources.map((s) => (
                          <li key={s.url}>
                            <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="text-teal-800 underline underline-offset-2 hover:text-navy-900">
                              {s.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-1.5 text-navy-600">Tarkistettu {formatDateFi(l.lastVerified)}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobiili: kortit (ei vaakavieritystä) */}
          <div className="space-y-4 md:hidden">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-navy-700">{visible.length} riviä</span>
              <label className="inline-flex items-center gap-2">
                <span className="font-semibold">Järjestä</span>
                <select
                  value={`${sort.key}-${sort.dir}`}
                  onChange={(e) => {
                    const [key, dir] = e.target.value.split("-") as [SortKey, SortDir];
                    setSort({ key, dir });
                  }}
                  className="h-10 rounded-[10px] border border-rule bg-white px-2"
                >
                  <option value="hourly-asc">Tuntihinta, pienin ensin</option>
                  <option value="hourly-desc">Tuntihinta, suurin ensin</option>
                  <option value="callOut-asc">Lähtömaksu, pienin ensin</option>
                  <option value="name-asc">Nimi A–Ö</option>
                </select>
              </label>
            </div>
            {visible.map((l) => (
              <article key={l.id} className={`rounded-2xl border border-rule p-4 shadow-soft ${l.kind === "benchmark" ? "bg-mist" : "bg-white"}`}>
                <h3 className="text-lg">{l.name}</h3>
                {l.kind === "benchmark" ? <p className="text-sm text-navy-600">Ei yritys – suuntaa-antava markkinahinta</p> : null}
                {l.sponsored ? <p className="text-sm font-semibold text-amber-800">Kaupallinen yhteistyö</p> : null}
                <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[0.95rem]">
                  <dt className="text-navy-600">Arkisin</dt>
                  <dd className="font-semibold"><Value text={hourlyText(l, "weekday")} /></dd>
                  <dt className="text-navy-600">Lähtömaksu</dt>
                  <dd>
                    <Value text={callOutText(l)} />
                    {l.callOut.status === "conflicting" ? <span className="ml-2 inline-block"><StatusBadge status="conflicting" /></span> : null}
                  </dd>
                  <dt className="text-navy-600">Muut ajat</dt>
                  <dd>{offHoursText(l) ?? (l.kind === "benchmark" ? "Ei tietoa" : <Missing />)}</dd>
                  <dt className="text-navy-600">Alv</dt>
                  <dd>{vatText(l)}</dd>
                  <dt className="text-navy-600">Tarkistettu</dt>
                  <dd>{formatDateFi(l.lastVerified)}</dd>
                </dl>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  <a href={l.websiteUrl} target="_blank" rel="noopener noreferrer nofollow" className="font-semibold text-teal-800 underline underline-offset-2">
                    {l.kind === "benchmark" ? "Avaa lähde" : "Yrityksen verkkosivut"}
                    <span className="sr-only"> (avautuu uuteen välilehteen)</span>
                  </a>
                  {l.sources.filter((s) => s.url !== l.websiteUrl).map((s) => (
                    <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="text-teal-800 underline underline-offset-2">
                      {s.label}
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </>
      )}
      <p className="mt-4 max-w-3xl text-sm text-navy-700">
        Lopullinen hinta riippuu työn laajuudesta, tarvikkeista ja yrityksen ehdoista. Pyydä aina kirjallinen
        tarjous tai hinta-arvio ennen työn aloittamista.
      </p>
    </div>
  );
}
