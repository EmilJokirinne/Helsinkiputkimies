import Link from "next/link";
import { ComparisonTable } from "@/components/ComparisonTable";
import { CtaBand } from "@/components/CtaBand";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/ui";
import { serviceBySlug } from "@/content/services";
import { activeCompanies, activeListings } from "@/data/companies";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Putkiliikkeiden vertailu Helsinki – hinnat, palvelut ja alueet",
  description:
    "Vertaile helsinkiläisiä putkiliikkeitä: julkaistut tuntihinnat, lähtömaksut, päivystys, palvelut ja palvelualueet. Hae ja suodata palvelun mukaan.",
  path: "/putkiliikkeiden-vertailu",
});

export default function ComparisonPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Putkiliikkeiden vertailu", href: "/putkiliikkeiden-vertailu" }]}
        title="Putkiliikkeiden vertailu Helsingissä"
        lead={`Vertailussa on ${activeCompanies.length} helsinkiläistä putkiliikettä ja yksi markkinahintavertailu. Hae yritystä tai aluetta ja rajaa tulokset tarvitsemasi palvelun mukaan.`}
      />
      <Container className="mt-12">
        <h2 className="sr-only">Yritykset ja hinnat</h2>
        <ComparisonTable rows={activeListings} withFilters caption="Putkiliikkeiden vertailu: hinnat, lähteet ja tarkistuspäivät" />

        <section aria-labelledby="palvelualueet" className="mt-16">
          <h2 id="palvelualueet" className="text-3xl">Palvelut ja palvelualueet</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {activeCompanies.map((c) => (
              <div key={c.id} className="rounded-2xl border border-rule bg-white p-5">
                <h3 className="text-lg">{c.name}</h3>
                {c.businessId ? <p className="text-sm text-navy-600">Y-tunnus {c.businessId}</p> : null}
                <p className="mt-3 text-sm font-semibold">Palvelualue</p>
                <p className="text-[0.95rem] text-navy-800">{c.serviceArea?.join(", ") ?? "Ei ilmoitettu verkkosivuilla"}</p>
                <p className="mt-3 text-sm font-semibold">Palvelut yrityksen oman ilmoituksen mukaan</p>
                {c.servicesNote ? <p className="text-[0.95rem] text-navy-800">{c.servicesNote}</p> : null}
                {!c.servicesNote && c.services.length > 0 ? (
                  <ul className="mt-1 flex flex-wrap gap-1.5">
                    {c.services.map((slug) => {
                      const s = serviceBySlug(slug);
                      return s ? (
                        <li key={slug}>
                          <Link href={s.href} className="inline-block rounded-full bg-mist px-2.5 py-1 text-sm text-navy-800 hover:bg-teal-50 hover:text-teal-800">
                            {s.shortName}
                          </Link>
                        </li>
                      ) : null;
                    })}
                  </ul>
                ) : null}
                {c.notes.length > 0 ? <p className="mt-3 text-sm text-navy-600">{c.notes.join(" ")}</p> : null}
                <a href={c.contactUrl ?? c.websiteUrl} target="_blank" rel="noopener noreferrer nofollow" className="mt-4 inline-block font-semibold text-teal-800 underline underline-offset-4">
                  Ota yhteyttä yritykseen<span className="sr-only"> (avautuu uuteen välilehteen)</span>
                </a>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="valinta" className="prose-fi mt-16 max-w-[68ch] text-[1.06rem]">
          <h2 id="valinta">Miten yritykset valitaan vertailuun</h2>
          <p>
            Vertailuun otetaan Helsingissä toimivia putkiliikkeitä, joiden toiminta ja verkkosivut voidaan todentaa
            julkisista lähteistä. Hinnat kirjataan vain yrityksen omalta sivulta, ja jokaiselle tiedolle merkitään
            lähde ja tarkistuspäivä. Jos yritys ei julkaise hintojaan, näytämme kohdassa <em>Pyydä tarjous</em>.
          </p>
          <p>
            Yritykset eivät maksa näkyvyydestään. Jos vertailuun joskus tulee kaupallista yhteistyötä, se merkitään
            selvästi rivin kohdalle. Lisätietoa <Link href="/tietoa-sivustosta">sivustosta ja hintojen tarkistamisesta</Link>.
          </p>
          <p>
            Huomasitko vanhentuneen hinnan tai haluatko yrityksesi mukaan vertailuun? Kerro siitä ylläpitäjälle
            <Link href="/tietoa-sivustosta#yhteys"> yhteystietojen kautta</Link>.
          </p>
        </section>
      </Container>
      <CtaBand />
    </>
  );
}
