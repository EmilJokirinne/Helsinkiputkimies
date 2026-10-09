import Link from "next/link";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/ui";
import { activeCompanies } from "@/data/companies";
import { isOperatorDeliveryEnabled } from "@/lib/lead-delivery";
import { JOB_OPTIONS } from "@/lib/lead-schema";
import { buildMetadata } from "@/lib/seo";
import { getOperator } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Pyydä tarjous putkityöstä Helsingissä – tarjouspyyntö ja yhteystiedot",
  description:
    "Laadi maksutta selkeä tarjouspyyntö putkityöstä ja lähetä se suoraan valitsemallesi putkiliikkeelle. Putkimies tarjous Helsinki.",
  path: "/tarjouspyynto",
});

// Luetaan ympäristömuuttujat pyynnön aikana, jotta lomakkeen teksti vastaa todellista toimitustapaa.
export const dynamic = "force-dynamic";

export default async function EnquiryPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const tyo = typeof sp.tyo === "string" && JOB_OPTIONS.some((o) => o.value === sp.tyo) ? sp.tyo : "";
  const operator = getOperator();
  const companies = activeCompanies.map((c) => ({ id: c.id, name: c.name, url: c.contactUrl ?? c.websiteUrl }));

  return (
    <>
      <PageHeader
        crumbs={[{ name: "Tarjouspyyntö", href: "/tarjouspyynto" }]}
        title="Pyydä tarjous putkityöstä"
        lead="Kerro, mitä tarvitset, niin muotoilemme tiedoista tarjouspyynnön, jonka voit lähettää suoraan valitsemallesi putkiliikkeelle. Sopimus työstä tehdään aina sinun ja yrityksen välillä."
      />
      <Container className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
        <div className="max-w-2xl">
          <EnquiryForm operatorDelivery={isOperatorDeliveryEnabled()} companies={companies} defaultJob={tyo} />
        </div>
        <aside className="space-y-6">
          <section aria-labelledby="hata" className="rounded-2xl border-2 border-amber-800/30 bg-amber-50 p-5">
            <h2 id="hata" className="text-lg">Vesivuoto juuri nyt?</h2>
            <p className="mt-2 text-[0.95rem]">
              Sulje vesi pääsulusta. Kerrostalossa soita taloyhtiön huoltoyhtiön päivystykseen. Lue{" "}
              <Link href="/putkipalvelut/vesivuodon-korjaus" className="font-semibold underline">ohjeet vesivuodon varalle</Link>{" "}
              ja <Link href="/paivystava-putkimies" className="font-semibold underline">päivystyshinnat</Link>.
            </p>
          </section>
          <section aria-labelledby="yhteys" className="rounded-2xl bg-mist p-5">
            <h2 id="yhteys" className="text-lg">Yhteystiedot</h2>
            <p className="mt-2 text-[0.95rem] text-navy-800">
              HelsinkiPutkimies.fi ei tee putkitöitä. Kysymykset sivuston sisällöstä tai vertailun hinnoista voit
              lähettää ylläpitäjälle.
            </p>
            {operator.email ? (
              <p className="mt-3 text-[0.95rem]">
                <a href={`mailto:${operator.email}`} className="font-semibold text-teal-800 underline">{operator.email}</a>
              </p>
            ) : null}
            {operator.name ? <p className="mt-1 text-sm text-navy-700">{operator.name}{operator.businessId ? `, Y-tunnus ${operator.businessId}` : ""}</p> : null}
          </section>
          <section aria-labelledby="miten-tiedot" className="rounded-2xl border border-rule p-5">
            <h2 id="miten-tiedot" className="text-lg">Mitä tiedoillesi tapahtuu</h2>
            <p className="mt-2 text-[0.95rem] text-navy-800">
              {isOperatorDeliveryEnabled()
                ? "Kopio pyynnöstä toimitetaan sivuston ylläpitäjälle. Emme välitä tietojasi putkiliikkeille – lähetät pyynnön yritykselle itse."
                : "Tietoja käytetään vain tarjouspyynnön muotoiluun. Niitä ei tallenneta eikä välitetä putkiliikkeille – lähetät pyynnön yritykselle itse."}{" "}
              <Link href="/tietosuojaseloste" className="font-semibold text-teal-800 underline">Tietosuojaseloste</Link>
            </p>
          </section>
        </aside>
      </Container>
    </>
  );
}
