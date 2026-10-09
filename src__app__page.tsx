import Link from "next/link";
import { Advice } from "@/components/Advice";
import { ComparisonTable } from "@/components/ComparisonTable";
import { CtaBand } from "@/components/CtaBand";
import { FaqList } from "@/components/FaqList";
import { HowItWorks } from "@/components/HowItWorks";
import { JsonLd } from "@/components/JsonLd";
import { PriceSlip } from "@/components/PriceSlip";
import { ServiceGrid } from "@/components/ServiceGrid";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { generalFaq } from "@/content/faq";
import { services } from "@/content/services";
import { activeListings, latestVerification } from "@/data/companies";
import { formatDateFi } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_URL, getOperator } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Putkimies Helsinki – hinnat, palvelut ja vertailu",
  description:
    "Vertaile helsinkiläisten putkiliikkeiden julkaisemia tuntihintoja, lähtömaksuja ja päivystyshintoja. Laske työn hinta-arvio ja laadi tarjouspyyntö maksutta.",
  path: "/",
});

export default function HomePage() {
  const operator = getOperator();
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "fi",
    description: "Riippumaton putkitöiden hinta- ja vertailupalvelu Helsingissä",
    ...(operator.name ? { publisher: { "@type": "Organization", name: operator.name, url: SITE_URL } } : {}),
  };

  return (
    <>
      <JsonLd data={website} />

      {/* B. Hero */}
      <section className="overflow-hidden bg-mist">
        <Container className="grid items-center gap-12 py-12 sm:py-16 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:py-20">
          <div>
            <h1 className="text-[2.6rem] leading-[1.05] sm:text-[3.6rem]" style={{ fontVariationSettings: '"wdth" 80' }}>
              Putkimies Helsingissä – hinnat, palvelut ja vertailu
            </h1>
            <p className="mt-5 max-w-xl text-lg text-navy-800 sm:text-xl">
              Vertaile helsinkiläisten putkiliikkeiden julkaisemia hintoja, ymmärrä mistä putkityön kustannukset
              muodostuvat ja pyydä tarjous suoraan valitsemaltasi yritykseltä.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/tarjouspyynto">Pyydä tarjous</ButtonLink>
              <ButtonLink href="/putkimiehen-hinnat#laskuri" variant="secondary">Vertaile hintoja</ButtonLink>
            </div>
            <p className="mt-8 max-w-xl border-l-[5px] border-teal-700 pl-4 text-[0.98rem] text-navy-800">
              Olemme riippumaton vertailupalvelu, emme putkiliike. Jokaisen hinnan vieressä on lähde ja
              tarkistuspäivä
              {activeListings.some((l) => l.sponsored)
                ? ", ja kaupallinen yhteistyö on merkitty selvästi."
                : ", eikä yksikään yritys ole maksanut paikastaan vertailussa."}
            </p>
          </div>
          <PriceSlip rows={activeListings} verified={latestVerification} />
        </Container>
      </section>

      {/* C. Palvelut */}
      <section aria-labelledby="palvelut" className="mt-20 sm:mt-24">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading id="palvelut" title="Yleisimmät putkityöt" lead="Jokaiselta sivulta löydät työn hintaan vaikuttavat asiat ja vinkit ennen tilaamista." />
            <Link href="/putkipalvelut" className="font-semibold text-teal-800 underline underline-offset-4 hover:text-navy-900">Kaikki palvelut</Link>
          </div>
          <div className="mt-8">
            <ServiceGrid items={services.slice(0, 9)} />
          </div>
        </Container>
      </section>

      {/* D. Miten palvelu toimii */}
      <section aria-labelledby="miten" className="mt-20 sm:mt-24">
        <Container>
          <SectionHeading id="miten" title="Näin löydät putkimiehen" />
          <HowItWorks />
        </Container>
      </section>

      {/* E–F. Hintakatsaus ja vertailu */}
      <section aria-labelledby="hinnat" className="mt-20 bg-mist py-16 sm:mt-24 sm:py-20">
        <Container>
          <SectionHeading
            id="hinnat"
            title="Putkiliikkeiden hinnat Helsingissä"
            lead={<>Yritysten omilta sivuilta tarkistetut hinnat ({formatDateFi(latestVerification)}) ja suuntaa-antava markkinahinta. Lajittele taulukkoa sarakeotsikoista.</>}
          />
          <div className="mt-8">
            <ComparisonTable rows={activeListings} withFilters caption="Putkiliikkeiden julkaisemat hinnat Helsingissä" />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/putkimiehen-hinnat#laskuri">Laske työn hinta-arvio</ButtonLink>
            <ButtonLink href="/tietoa-sivustosta" variant="secondary">Miten hinnat tarkistetaan</ButtonLink>
          </div>
        </Container>
      </section>

      {/* G. Neuvot */}
      <section aria-labelledby="neuvot" className="mt-20 sm:mt-24">
        <Container>
          <SectionHeading id="neuvot" title="Hyvä tietää ennen kuin tilaat" />
          <div className="mt-10">
            <Advice />
          </div>
        </Container>
      </section>

      {/* H. UKK */}
      <section aria-labelledby="ukk" className="mt-20 sm:mt-24">
        <Container className="grid gap-8 lg:grid-cols-[1fr_2fr]">
          <div>
            <SectionHeading id="ukk" title="Usein kysyttyä" />
            <Link href="/usein-kysytyt-kysymykset" className="mt-4 inline-block font-semibold text-teal-800 underline underline-offset-4">
              Kaikki kysymykset
            </Link>
          </div>
          <FaqList items={generalFaq.slice(0, 5)} />
        </Container>
      </section>

      {/* I. Loppukehotus */}
      <CtaBand />
    </>
  );
}
