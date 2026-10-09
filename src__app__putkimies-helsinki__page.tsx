import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { PageHeader } from "@/components/PageHeader";
import { ServiceGrid } from "@/components/ServiceGrid";
import { ButtonLink, Container } from "@/components/ui";
import { services } from "@/content/services";
import { activeCompanies } from "@/data/companies";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Putkimies Helsinki – näin löydät putkiliikkeen ja vertailet hintoja",
  description:
    "Etsitkö putkimiestä Helsingistä? Lue, miten kerrostalo, huoltoyhtiö ja HSY vaikuttavat putkitöihin, vertaile putkiliikkeiden hintoja ja pyydä tarjous.",
  path: "/putkimies-helsinki",
});

export default function HelsinkiPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Putkimies Helsingissä", href: "/putkimies-helsinki" }]}
        title="Putkimies Helsingissä"
        lead="Helsingissä suurin osa kodeista on kerrostaloissa, ja se vaikuttaa siihen, kenelle putkityö kuuluu ja kenen kanssa siitä sovitaan. Tältä sivulta löydät helsinkiläisen ohjeet putkimiehen tilaamiseen."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/putkiliikkeiden-vertailu">Vertaile putkiliikkeitä</ButtonLink>
          <ButtonLink href="/tarjouspyynto" variant="secondary">Pyydä tarjous</ButtonLink>
        </div>
      </PageHeader>

      <Container className="mt-14">
        <div className="prose-fi max-w-[68ch] text-[1.06rem]">
          <h2>Kerrostalossa: huoltoyhtiö ensin</h2>
          <p>
            Asunto-osakeyhtiössä taloyhtiö vastaa yleensä yhteisistä vesi- ja viemäriputkista, osakas asunnon
            sisäisistä varusteista, kuten hanoista ja kodinkoneiden liitännöistä. Rajanveto riippuu
            asunto-osakeyhtiölaista ja yhtiöjärjestyksestä, joten epäselvissä tilanteissa kannattaa kysyä
            isännöitsijältä tai huoltoyhtiöltä ennen putkimiehen tilaamista.
          </p>
          <p>
            Vuototilanteessa soita ensin huoltoyhtiön päivystykseen. Huoltoyhtiö tuntee kiinteistön, osaa sulkea
            veden oikeasta paikasta ja tietää, kuka korjauksen tilaa. Jos tilaat itse työn, joka kuuluu
            taloyhtiölle, kustannusten korvaamisesta voi tulla erimielisyyttä.
          </p>

          <h2>Omakotitalossa ja rivitalossa</h2>
          <p>
            Omakotitalossa omistaja vastaa koko kiinteistön putkistosta, ja putkimiehen voi tilata suoraan.
            Rivitaloissa vastuunjako riippuu siitä, onko talo asunto-osakeyhtiö vai kiinteistöyhtiö – tarkista
            yhtiöjärjestys.
          </p>

          <h2>Vesikatko vai vika omassa putkistossa?</h2>
          <p>
            Helsingissä vesihuollosta vastaa HSY (Helsingin seudun ympäristöpalvelut). Jos vesi on poikki koko
            talosta tai naapurustosta, tarkista ensin HSY:n häiriötiedotteet ennen kuin tilaat putkimiehen.
            Vika omassa putkistossa näkyy yleensä vain yhdessä asunnossa tai vesipisteessä.
          </p>

          <h2>Pysäköinti ja kulkuyhteydet</h2>
          <p>
            Kantakaupungissa huoltoauton pysäköinti voi olla hankalaa. Kerro tarjouspyynnössä, onko talon pihassa
            huoltopaikka, ja kysy yritykseltä, laskutetaanko pysäköintimaksut erikseen.
          </p>

          <h2>Putkiliikkeet vertailussa</h2>
          <p>
            Vertailussa on tällä hetkellä {activeCompanies.length} pääkaupunkiseudulla toimivaa yritystä. Näet niiden
            julkaisemat hinnat ja palvelualueet <Link href="/putkiliikkeiden-vertailu">vertailusivulta</Link> ja voit laskea saman
            työn hinta-arvion <Link href="/putkimiehen-hinnat#laskuri">laskurilla</Link>.
          </p>
        </div>

        <section aria-labelledby="hki-palvelut" className="mt-16">
          <h2 id="hki-palvelut" className="text-3xl">Putkityöt Helsingissä</h2>
          <div className="mt-6">
            <ServiceGrid items={services} />
          </div>
        </section>
      </Container>
      <CtaBand />
    </>
  );
}
