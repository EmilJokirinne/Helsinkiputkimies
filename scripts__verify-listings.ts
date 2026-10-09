/**
 * Vertailun tarkistustyökalu.
 *
 *   npm run verify-listings              # johdonmukaisuus + vanhentuneet tiedot
 *   npm run verify-listings -- --online  # lisäksi tarkistaa, että lähde-URLit vastaavat
 *
 * Palauttaa virhekoodin 1, jos löytyy virheitä (sopii CI:hin ennen julkaisua).
 * Hintojen sisältöä skripti ei voi tarkistaa – se tehdään käsin yrityksen sivulta
 * (ks. README → "Hintojen päivittäminen").
 */
import { listings } from "../src/data/companies";
import { MAX_AGE_DAYS, daysSince, validateListing } from "../src/lib/listing-validation";

const online = process.argv.includes("--online");

async function checkUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(15_000) });
    return res.ok ? `OK ${res.status}` : `VIRHE ${res.status}`;
  } catch (e) {
    return `VIRHE ${(e as Error).message}`;
  }
}

async function main() {
  let errors = 0;
  console.log(`Vertailun tarkistus – ${listings.length} riviä, enimmäisikä ${MAX_AGE_DAYS} päivää\n`);

  for (const l of listings) {
    const issues = validateListing(l);
    const age = l.lastVerified ? `${daysSince(l.lastVerified)} pv sitten (${l.lastVerified})` : "ei tarkistettu";
    console.log(`■ ${l.name} [${l.listingStatus}] – tarkistettu ${age}`);
    for (const i of issues) {
      console.log(`   ${i.level === "error" ? "✗ VIRHE" : "! huom."}  ${i.message}`);
      if (i.level === "error") errors++;
    }
    if (online && l.listingStatus === "active") {
      for (const s of l.sources) console.log(`   ↳ ${s.url}: ${await checkUrl(s.url)}`);
    }
    if (l.listingStatus === "active") {
      console.log("   Tarkista käsin: tuntihinnat, lähtömaksu, päivystyshinnat, alv-maininta, laskutussäännöt.");
    }
    console.log("");
  }

  console.log(errors === 0 ? "Ei virheitä." : `${errors} virhettä – korjaa src/data/companies.ts.`);
  process.exit(errors === 0 ? 0 : 1);
}

void main();
