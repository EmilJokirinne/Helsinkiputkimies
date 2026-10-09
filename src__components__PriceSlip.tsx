import Link from "next/link";
import type { Listing } from "@/data/types";
import { formatDateFi } from "@/lib/format";
import { callOutText, hourlyText } from "@/lib/listing-display";

/**
 * Etusivun hintalipuke: julkaistut arkipäivän hinnat lähteineen.
 * Kuittia muistuttava muoto viestii, että luvut ovat oikeita, tarkistettuja hintoja.
 */
export function PriceSlip({ rows, verified }: { rows: Listing[]; verified: string | null }) {
  const companies = rows.filter((r) => r.kind === "company");
  const benchmark = rows.find((r) => r.kind === "benchmark");

  return (
    <figure className="animate-slip relative mx-auto w-full max-w-md -rotate-[1.2deg] rounded-[18px] bg-white p-6 shadow-lift ring-1 ring-navy-900/10 sm:p-7">
      {/* Repäisyreuna */}
      <div
        aria-hidden="true"
        className="absolute inset-x-6 -top-[7px] h-[14px] bg-[radial-gradient(circle_at_7px_0,transparent_6px,white_6.5px)] bg-[length:14px_14px] bg-repeat-x"
      />
      <figcaption>
        <p className="text-lg font-bold" style={{ fontVariationSettings: '"wdth" 86' }}>Putkimiehen tuntihinta arkisin</p>
        <p className="text-sm text-navy-600">Yritysten julkaisemat hinnat Helsingissä, sis. alv</p>
      </figcaption>

      <table className="mt-5 w-full text-[0.95rem]">
        <caption className="sr-only">Julkaistut arkipäivän tuntihinnat ja lähtömaksut</caption>
        <thead>
          <tr className="text-left text-xs text-navy-600">
            <th scope="col" className="pb-2 font-medium">Yritys</th>
            <th scope="col" className="pb-2 text-right font-medium">€/h</th>
            <th scope="col" className="pb-2 text-right font-medium">Lähtömaksu</th>
          </tr>
        </thead>
        <tbody className="num [&_td]:whitespace-nowrap">
          {companies.map((c) => {
            const h = hourlyText(c, "weekday");
            const co = callOutText(c);
            return (
              <tr key={c.id} className="border-t border-dashed border-rule">
                <th scope="row" className="py-2.5 pr-2 text-left font-semibold">{c.name}</th>
                <td className="py-2.5 text-right">{h ? h.replace("/h", "") : <span className="text-navy-600">ei julk.</span>}</td>
                <td className="py-2.5 pl-3 text-right">
                  {co ?? <span className="text-navy-600">ei julk.</span>}
                  {c.callOut.status === "conflicting" ? <sup className="text-amber-800">*</sup> : null}
                </td>
              </tr>
            );
          })}
          {benchmark ? (
            <tr className="border-t border-navy-900/70">
              <th scope="row" className="py-2.5 pr-2 text-left font-normal text-navy-700">
                Markkinahinta<span className="block text-xs">suuntaa-antava, Remppatori</span>
              </th>
              <td className="py-2.5 text-right text-navy-700">{hourlyText(benchmark, "weekday")?.replace("/h", "")}</td>
              <td className="py-2.5 pl-3 text-right text-navy-600">–</td>
            </tr>
          ) : null}
        </tbody>
      </table>

      <div className="mt-4 space-y-1 border-t border-dashed border-rule pt-3 text-xs text-navy-600">
        {companies.some((c) => c.callOut.status === "conflicting") ? (
          <p><span className="text-amber-800">*</span> Yrityksen omilla sivuilla on kaksi eri summaa.</p>
        ) : null}
        <p>Hinnat tarkistettu yritysten sivuilta {formatDateFi(verified)}.</p>
      </div>
      <Link href="/putkimiehen-hinnat" className="mt-4 inline-block text-sm font-semibold text-teal-800 underline underline-offset-4 hover:text-navy-900">
        Katso ilta- ja päivystyshinnat
      </Link>
    </figure>
  );
}
