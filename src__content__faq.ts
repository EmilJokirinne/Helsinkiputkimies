import type { FaqItem } from "./services";
import { activeCompanies, benchmarks } from "@/data/companies";
import { formatRange } from "@/lib/format";

function hourlySpan(): string {
  const rates = activeCompanies
    .filter((c) => c.hourly.status === "confirmed")
    .map((c) => c.hourly.value?.weekday)
    .filter((r): r is { min: number; max: number } => !!r);
  if (rates.length === 0) return "";
  const min = Math.min(...rates.map((r) => r.min));
  const max = Math.max(...rates.map((r) => r.max));
  const bm = benchmarks[0]?.hourly.value?.weekday;
  return `Vertailussamme mukana olevien yritysten julkaisemat arkipäivän tuntihinnat ovat ${formatRange(min, max)} (sis. alv)${bm ? `, ja Remppatorin suuntaa-antava markkinahinta on ${formatRange(bm.min, bm.max, "/h")}` : ""}. `;
}

/**
 * Yleiset kysymykset. Hinnat luetaan data/companies.ts-tiedostosta – älä kirjoita hintoja
 * käsin tähän tekstiin.
 */
export const generalFaq: FaqItem[] = [
  {
    q: "Paljonko putkimies maksaa tunnilta Helsingissä?",
    a: `${hourlySpan()}Ilta-, viikonloppu- ja pyhätyöt maksavat selvästi enemmän. Ajantasaiset hinnat lähteineen näet hintasivulta.`,
  },
  {
    q: "Mikä on lähtö- tai huoltoautomaksu?",
    a: "Monet putkiliikkeet veloittavat jokaisesta käynnistä kiinteän maksun, joka kattaa auton, työkalut ja matkan. Se lisätään tuntityön päälle. Osa yrityksistä veloittaa lisäksi kilometrikorvausta tai erikoislaitteiden käytöstä.",
  },
  {
    q: "Laskutetaanko jokainen alkava tunti?",
    a: "Monet yritykset laskuttavat alkavan tunnin ja niillä voi olla minimiveloitus, esimerkiksi yksi tai kaksi tuntia. Lyhytkin käynti voi siis maksaa saman verran kuin pidempi. Kysy laskutustapa ennen työn tilaamista.",
  },
  {
    q: "Saako putkitöistä kotitalousvähennystä?",
    a: "Saa. Verohallinnon mukaan vuonna 2026 vähennys on 35 % työn osuudesta, enintään 1 600 € henkilöä kohden, ja omavastuu on 150 € vuodessa. Hallitus on esittänyt vähennykseen väliaikaista korotusta vuosille 2026–2027, joten tarkista ajantasainen tieto vero.fi-sivustolta. Pyydä yritykseltä lasku, jossa työn osuus on eritelty.",
  },
  {
    q: "Kenelle soitan, kun kerrostalossa on vesivuoto?",
    a: "Sulje ensin vesi, jos voit. Soita sitten taloyhtiön huoltoyhtiön päivystykseen – numero löytyy yleensä porraskäytävän ilmoitustaululta. Huoltoyhtiö tuntee kiinteistön ja tietää, kuuluuko korjaus taloyhtiölle vai osakkaalle.",
  },
  {
    q: "Tarvitseeko putkityöstä ilmoittaa taloyhtiölle?",
    a: "Asunto-osakeyhtiössä osakkaan on ilmoitettava taloyhtiölle muutostöistä, jotka voivat vaikuttaa yhtiön rakenteisiin tai järjestelmiin, kuten vesi- ja viemärijärjestelmään. Moni taloyhtiö pyytää ilmoituksen myös vesikalusteiden vaihdosta. Tarkista käytäntö isännöitsijältä ennen työn aloittamista.",
  },
  {
    q: "Mitä tarjouksessa pitäisi lukea?",
    a: "Hyvä tarjous kertoo työn sisällön, arvioidun työajan tai kiinteän hinnan, lähtö- ja matkakulut, tarvikkeet, arvonlisäveron ja sen, miten mahdolliset lisätyöt hinnoitellaan. Kun tarjoukset on eritelty samalla tavalla, niitä on helppo verrata.",
  },
  {
    q: "Onko HelsinkiPutkimies.fi putkiliike?",
    a: "Ei ole. HelsinkiPutkimies.fi on riippumaton tieto- ja vertailupalvelu. Emme tee putkitöitä, emmekä saa korvausta vertailussa mukana olevilta yrityksiltä. Sovit työstä aina suoraan valitsemasi yrityksen kanssa.",
  },
];
