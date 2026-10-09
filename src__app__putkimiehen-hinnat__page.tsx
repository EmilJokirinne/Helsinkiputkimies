import Link from "next/link";
import { ComparisonTable } from "@/components/ComparisonTable";
import { CtaBand } from "@/components/CtaBand";
import { PageHeader } from "@/components/PageHeader";
import { PriceCalculator } from "@/components/PriceCalculator";
import { Container } from "@/components/ui";
import { activeListings, latestVerification } from "@/data/companies";
import { formatDateFi } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Putkimiehen hinnat Helsingissä – tuntihinta, hinnasto ja laskuri",
  description:
    "Putkimiehen tuntihinta ja hinnasto Helsingissä: vertaa yritysten julkaisemia tunti-, lähtö- ja päivystyshintoja lähteineen ja laske työn hinta-arvio.",
  path: "/putkimiehen-hinnat",
});

export default function PricesPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Putkimiehen hinnat", href: "/putkimiehen-hinnat" }]}
        title="Putkimiehen hinnat Helsingissä"
        lead={
          <>
            Kokosimme putkiliikkeiden omilla sivuillaan julkaisemat hinnat yhteen. Jokaisen hinnan lähde ja
            tarkistuspäivä on näkyvissä. Viimeisin tarkistus {formatDateFi(latestVerification)}.
          </>
        }
      />

      <section aria-labelledby="hintavertailu" className="mt-14">
        <Container>
          <h2 id="hintavertailu" className="text-3xl">Julkaistut hinnat</h2>
          <p className="mt-2 max-w-2xl text-navy-700">
            Lajittele taulukko tuntihinnan, lähtömaksun tai nimen mukaan. Jos yritys ei ole julkaissut hintaa,
            näytämme kohdassa tekstin <em>Pyydä tarjous</em> emmekä arvioi hintaa sen puolesta.
          </p>
          <div className="mt-6">
            <ComparisonTable rows={activeListings} caption="Putkiliikkeiden julkaisemat hinnat, lajiteltava" />
          </div>
        </Container>
      </section>

      <section id="laskuri" aria-labelledby="laskuri-otsikko" className="mt-20 scroll-mt-24">
        <Container>
          <h2 id="laskuri-otsikko" className="text-3xl">Hinta-arviolaskuri</h2>
          <p className="mt-2 max-w-2xl text-navy-700">
            Valitse työaika ja ajankohta, niin laskuri arvioi saman työn hinnan jokaiselle yritykselle sen
            julkaisemien hintojen ja laskutussääntöjen mukaan. Kiinteä päivystysmaksu lasketaan sen sisältämine
            tunteineen – tuntihintaa ei lisätä niiden päälle.
          </p>
          <div className="mt-8">
            <PriceCalculator rows={activeListings} />
          </div>
        </Container>
      </section>

      <section aria-labelledby="hinnan-muodostuminen" className="mt-20">
        <Container className="prose-fi max-w-[68ch] text-[1.06rem]">
          <h2 id="hinnan-muodostuminen">Näin putkityön hinta muodostuu</h2>
          <p>Putkimiehen lasku koostuu yleensä neljästä osasta:</p>
          <ul>
            <li><strong>Työ.</strong> Tuntihinta kerrottuna työajalla. Monet laskuttavat jokaisen alkavan tunnin, ja osalla on minimiveloitus.</li>
            <li><strong>Lähtö- tai huoltoautomaksu.</strong> Kiinteä maksu jokaisesta käynnistä. Lisäksi voidaan veloittaa kilometrikorvausta.</li>
            <li><strong>Tarvikkeet.</strong> Osat ja materiaalit, usein tukkuhinnaston mukaan.</li>
            <li><strong>Erikoislaitteet.</strong> Esimerkiksi viemärinavauskone tai viemärin kuvaus voidaan veloittaa käyntikohtaisesti.</li>
          </ul>
          <p>
            Ilta-, yö-, viikonloppu- ja pyhäkäynnit hinnoitellaan joko korotetulla tuntihinnalla tai kiinteällä
            päivystysmaksulla. Lue lisää <Link href="/paivystava-putkimies">päivystyshinnoista</Link>.
          </p>
          <h3>Kotitalousvähennys</h3>
          <p>
            Työn osuudesta voi saada kotitalousvähennystä. Verohallinnon mukaan vuonna 2026 vähennys on 35 % työn
            osuudesta, enintään 1 600 € henkilöä kohden, ja omavastuu on 150 € vuodessa. Hallitus on esittänyt
            väliaikaista korotusta vuosille 2026–2027, joten tarkista ajantasaiset ehdot{" "}
            <a href="https://www.vero.fi/henkiloasiakkaat/vahennykset/kotitalousvahennys/kotitalousvahennyksen-maara" target="_blank" rel="noopener noreferrer">Verohallinnon sivuilta</a>.
            Tieto tarkistettu 9.10.2026.
          </p>
          <h3>Vertailukelpoisuus</h3>
          <p>
            Yritykset määrittelevät ajankohdat eri tavoin: yhdellä arkipäivän hinta on voimassa klo 7–16, toisella
            klo 7–15. Remppatorin markkinahinta on suuntaa-antava, eikä lähde kerro, sisältääkö se arvonlisäveron.
            Siksi emme nimeä yhtäkään yritystä halvimmaksi – vertaa aina tarjouksia samasta työstä.
          </p>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
