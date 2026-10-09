import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/ui";
import { activeListings, latestVerification } from "@/data/companies";
import { formatDateFi } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";
import { getOperator } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Tietoa sivustosta – näin vertailu ja hintojen tarkistus toimivat",
  description:
    "HelsinkiPutkimies.fi on riippumaton vertailupalvelu. Lue, miten yritykset valitaan, miten hinnat tarkistetaan ja miten kaupallinen yhteistyö merkitään.",
  path: "/tietoa-sivustosta",
});

export default function AboutPage() {
  const op = getOperator();
  const sponsored = activeListings.filter((l) => l.sponsored);

  return (
    <>
      <PageHeader
        crumbs={[{ name: "Tietoa sivustosta", href: "/tietoa-sivustosta" }]}
        title="Tietoa sivustosta"
        lead="HelsinkiPutkimies.fi on riippumaton tieto- ja vertailupalvelu. Emme ole putkiliike, emme työllistä putkiasentajia emmekä tee putkitöitä."
      />
      <Container className="mt-12">
        <div className="prose-fi max-w-[68ch] text-[1.06rem]">
          <h2>Mitä sivusto tekee</h2>
          <p>
            Kokoamme helsinkiläisten putkiliikkeiden itse julkaisemat hinnat yhteen, kerromme mistä putkitöiden
            kustannukset muodostuvat ja autamme laatimaan selkeän tarjouspyynnön. Sovit työstä, hinnasta ja
            aikataulusta aina suoraan valitsemasi yrityksen kanssa.
          </p>

          <h2>Miten yritykset valitaan</h2>
          <ul>
            <li>Yritys toimii Helsingissä tai pääkaupunkiseudulla ja sillä on omat verkkosivut.</li>
            <li>Yrityksen olemassaolo voidaan todentaa julkisista lähteistä, esimerkiksi Y-tunnuksen perusteella.</li>
            <li>Ehdolla olevia yrityksiä, joiden tietoja ei ole voitu varmistaa, ei näytetä vertailussa.</li>
          </ul>
          <p>
            Vertailu ei ole kattava luettelo kaikista Helsingin putkiliikkeistä. Yritysten järjestys määräytyy
            käyttäjän valitseman lajittelun mukaan, oletuksena arkipäivän tuntihinnan mukaan.
          </p>

          <h2>Miten hinnat tarkistetaan</h2>
          <ul>
            <li>Hinnat kirjataan vain yrityksen omalta verkkosivulta tai hinnastosta. Lähde näkyy jokaisen rivin kohdalla.</li>
            <li>Jokaiselle yritykselle merkitään päivä, jolloin tiedot on viimeksi tarkistettu. Viimeisin tarkistus: {formatDateFi(latestVerification)}.</li>
            <li>Jos yritys ei julkaise hintaa, näytämme <em>Pyydä tarjous</em> – emme arvioi hintaa yrityksen puolesta.</li>
            <li>Jos yrityksen omat lähteet ovat ristiriidassa, näytämme molemmat luvut vaihteluvälinä ja merkinnän ristiriidasta.</li>
            <li>Markkinahinta (Remppatori) on merkitty erikseen suuntaa-antavaksi, eikä se ole minkään yrityksen tarjous.</li>
          </ul>
          <p>
            Emme nimeä yritystä halvimmaksi tai parhaaksi, koska julkaistut hinnat eivät ole täysin
            vertailukelpoisia: yritykset määrittelevät aikarajat, minimiveloitukset ja lisämaksut eri tavoin.
          </p>

          <h2>Kaupallinen yhteistyö</h2>
          {sponsored.length === 0 ? (
            <p>
              Mikään vertailun yritys ei ole maksanut näkyvyydestään, emmekä saa välityspalkkioita. Jos kaupallista
              yhteistyötä tulee, se merkitään selvästi kyseisen yrityksen kohdalle tekstillä
              <em> Kaupallinen yhteistyö</em>, eikä se vaikuta hintatietoihin.
            </p>
          ) : (
            <p>
              Seuraavat vertailun rivit ovat kaupallista yhteistyötä, ja ne on merkitty vertailussa:{" "}
              {sponsored.map((s) => s.name).join(", ")}. Yhteistyö ei vaikuta hintatietoihin.
            </p>
          )}

          <h2 id="yhteys">Yhteystiedot ja korjaukset</h2>
          <p>
            Huomasitko vanhentuneen hinnan, tai haluatko yrityksesi mukaan vertailuun? Lähetä viesti ylläpitäjälle
            {op.email ? <> osoitteeseen <a href={`mailto:${op.email}`}>{op.email}</a></> : null}. Tarkistamme
            muutokset yrityksen omasta lähteestä ennen päivitystä.
          </p>
          {op.name ? (
            <p>
              Sivuston ylläpitäjä: {op.name}
              {op.businessId ? `, Y-tunnus ${op.businessId}` : ""}.
            </p>
          ) : null}
          <p>
            Henkilötietojen käsittelystä kerrotaan <Link href="/tietosuojaseloste">tietosuojaselosteessa</Link>.
          </p>
        </div>
      </Container>
    </>
  );
}
