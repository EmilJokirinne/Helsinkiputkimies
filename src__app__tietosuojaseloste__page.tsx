import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/ui";
import { configuredChannels } from "@/lib/lead-delivery";
import { buildMetadata } from "@/lib/seo";
import { getOperator } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Tietosuojaseloste ja evästeet | HelsinkiPutkimies.fi",
  description: "Miten HelsinkiPutkimies.fi käsittelee tarjouspyyntölomakkeen henkilötietoja ja mitä evästeitä sivusto käyttää.",
  path: "/tietosuojaseloste",
});

export const dynamic = "force-dynamic";

const UPDATED = "9.10.2026";

export default function PrivacyPage() {
  const op = getOperator();
  const channels = configuredChannels();
  const email = channels.includes("email");
  const webhook = channels.includes("webhook");
  const stored = email || webhook;
  const missingOperator = !op.name || !op.email;

  return (
    <>
      <PageHeader
        crumbs={[{ name: "Tietosuojaseloste", href: "/tietosuojaseloste" }]}
        title="Tietosuojaseloste"
        lead={`EU:n yleisen tietosuoja-asetuksen (2016/679) mukainen seloste. Päivitetty ${UPDATED}.`}
      />
      <Container className="mt-12">
        {missingOperator && process.env.NODE_ENV !== "production" ? (
          <div role="note" className="mb-8 max-w-[68ch] rounded-xl border-2 border-amber-800/40 bg-amber-50 p-4 text-[0.95rem]">
            <strong>Kehittäjälle:</strong> rekisterinpitäjän tiedot puuttuvat. Aseta ympäristömuuttujat
            SITE_OPERATOR_NAME, SITE_OPERATOR_BUSINESS_ID, SITE_OPERATOR_EMAIL ja SITE_OPERATOR_ADDRESS ennen julkaisua.
            Tämä huomautus ei näy tuotannossa.
          </div>
        ) : null}

        <div className="prose-fi max-w-[68ch] text-[1.03rem]">
          <h2>1. Rekisterinpitäjä</h2>
          <p>
            {op.name ?? "Sivuston ylläpitäjä"}
            {op.businessId ? `, Y-tunnus ${op.businessId}` : ""}
            {op.address ? <><br />{op.address}</> : null}
            {op.email ? <><br />Sähköposti: <a href={`mailto:${op.email}`}>{op.email}</a></> : null}
          </p>
          <p>
            HelsinkiPutkimies.fi on riippumaton tieto- ja vertailupalvelu. Ylläpitäjä ei tee putkitöitä eikä toimi
            vertailussa mainittujen yritysten lukuun.
          </p>

          <h2>2. Mitä tietoja käsitellään</h2>
          <p>Tarjouspyyntölomakkeella annat seuraavat tiedot:</p>
          <ul>
            <li>nimi, puhelinnumero ja sähköpostiosoite</li>
            <li>postinumero tai kaupunginosa</li>
            <li>tarvittava putkityö, kuvaus ongelmasta ja toivottu ajankohta</li>
            <li>hyväksyntä tietosuojaselosteeseen{stored ? " ja mahdollinen markkinointilupa" : ""}</li>
          </ul>
          <p>
            Palvelin käsittelee lisäksi teknisiä tietoja, kuten IP-osoitteen, väärinkäytösten ja roskapostin
            estämiseksi. Lomake ei pyydä terveystietoja tai muita erityisiä henkilötietoja – älä kirjoita niitä
            kuvaukseen.
          </p>

          <h2>3. Käsittelyn tarkoitus ja peruste</h2>
          {stored ? (
            <p>
              Tietoja käytetään tarjouspyynnön muotoiluun ja sen vastaanottamiseen ylläpitäjän järjestelmään sekä
              pyyntöön liittyvään yhteydenpitoon. Peruste on suostumuksesi (tietosuoja-asetuksen 6 artiklan 1 kohdan a
              alakohta). Markkinointiviestejä lähetetään vain, jos olet antanut siihen erillisen luvan.
            </p>
          ) : (
            <p>
              Tietoja käytetään ainoastaan tarjouspyyntötekstin muotoiluun selaimessasi näytettäväksi. Niitä ei
              tallenneta palvelimelle eikä lähetetä kenellekään. Peruste on suostumuksesi.
            </p>
          )}

          <h2>4. Tietojen luovutus ja vastaanottajat</h2>
          <p>
            Emme luovuta tai myy tietojasi putkiliikkeille tai muille kolmansille osapuolille. Lähetät valmiin
            tarjouspyynnön itse valitsemallesi yritykselle, jolloin yritys toimii omien tietojensa
            rekisterinpitäjänä.
          </p>
          <p>Teknisinä palveluntarjoajina (henkilötietojen käsittelijöinä) toimivat:</p>
          <ul>
            <li>Vercel Inc. – sivuston ylläpito ja palvelinlokit</li>
            {email ? <li>Resend – tarjouspyyntöjen sähköpostitoimitus ylläpitäjälle</li> : null}
            {webhook ? <li>ylläpitäjän asiakkuudenhallinta- tai integraatiopalvelu, johon pyyntö toimitetaan</li> : null}
          </ul>
          <p>
            Tietoja voidaan käsitellä myös EU:n ja ETA:n ulkopuolella, jolloin siirto perustuu Euroopan komission
            hyväksymiin vakiosopimuslausekkeisiin tai muuhun tietosuoja-asetuksen mukaiseen siirtoperusteeseen.
          </p>

          <h2>5. Säilytysaika</h2>
          {stored ? (
            <p>
              Tarjouspyynnöt poistetaan viimeistään 12 kuukauden kuluttua vastaanottamisesta, ellei asian hoitaminen
              edellytä pidempää säilytystä. Markkinointilupa on voimassa, kunnes perut sen.
            </p>
          ) : (
            <p>Lomakkeen tietoja ei tallenneta, joten niillä ei ole säilytysaikaa. Palvelinlokit säilyvät palveluntarjoajan käytännön mukaisesti.</p>
          )}

          <h2>6. Oikeutesi</h2>
          <p>
            Sinulla on oikeus saada pääsy tietoihisi, oikaista ja poistaa ne, rajoittaa niiden käsittelyä, siirtää ne
            järjestelmästä toiseen sekä peruuttaa suostumuksesi milloin tahansa. Pyynnöt voit lähettää
            rekisterinpitäjälle yllä olevaan osoitteeseen.
          </p>
          <p>
            Voit tehdä valituksen valvontaviranomaiselle, joka Suomessa on tietosuojavaltuutetun toimisto
            (<a href="https://tietosuoja.fi/etusivu" target="_blank" rel="noopener noreferrer">tietosuoja.fi</a>).
          </p>

          <h2 id="evasteet">7. Evästeet</h2>
          <p>
            Sivusto ei käytä analytiikka-, mainos- tai seurantaevästeitä eikä tallenna selaimeesi tunnisteita.
            Fontit ladataan sivuston omalta palvelimelta, eikä sivu lataa sisältöä kolmansien osapuolten
            mainos- tai sosiaalisen median palveluista. Siksi erillistä evästehyväksyntää ei tarvita.
          </p>
          <p>
            Jos sivustolle myöhemmin lisätään analytiikkaa tai muita ei-välttämättömiä evästeitä, ne otetaan käyttöön
            vasta suostumuksesi jälkeen, ja tätä selostetta päivitetään.
          </p>

          <h2>8. Tietoturva</h2>
          <p>
            Yhteys sivustoon on salattu (HTTPS). Lomakkeen tiedot tarkistetaan palvelimella, eikä henkilötietoja
            kirjoiteta palvelimen lokeihin.
          </p>
        </div>
      </Container>
    </>
  );
}
