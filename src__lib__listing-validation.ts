import type { Listing } from "@/data/types";

export interface ListingIssue {
  listingId: string;
  level: "error" | "warning";
  message: string;
}

/** Tiedot vanhenevat tämän ajan jälkeen ja pitää tarkistaa uudelleen. */
export const MAX_AGE_DAYS = 90;

export function daysSince(iso: string, now = new Date()): number {
  return Math.floor((now.getTime() - new Date(`${iso}T00:00:00Z`).getTime()) / 86_400_000);
}

/** Tarkistaa yhden rivin johdonmukaisuuden. Käytetään skriptissä ja testeissä. */
export function validateListing(l: Listing, now = new Date()): ListingIssue[] {
  const issues: ListingIssue[] = [];
  const err = (message: string) => issues.push({ listingId: l.id, level: "error", message });
  const warn = (message: string) => issues.push({ listingId: l.id, level: "warning", message });

  if (l.listingStatus === "active") {
    if (!l.lastVerified) err("Aktiivinen rivi ilman tarkistuspäivää (lastVerified).");
    if (!/^https:\/\//.test(l.websiteUrl)) err("Verkkosivun osoite puuttuu tai ei ole https.");
    if (l.sources.length === 0) err("Lähteet puuttuvat.");
    if (l.lastVerified) {
      const age = daysSince(l.lastVerified, now);
      if (age < 0) err(`Tarkistuspäivä ${l.lastVerified} on tulevaisuudessa.`);
      else if (age > MAX_AGE_DAYS) warn(`Tiedot tarkistettu ${age} päivää sitten – tarkista uudelleen.`);
    }
  }

  for (const [field, value] of [
    ["hourly", l.hourly],
    ["callOut", l.callOut],
    ["emergency", l.emergency],
  ] as const) {
    if (value.status !== "unavailable" && value.value === undefined) err(`${field}: tila ${value.status}, mutta arvo puuttuu.`);
    if (value.status === "unavailable" && value.value !== undefined) err(`${field}: tila unavailable, mutta arvo on annettu.`);
    if (value.status === "conflicting" && !value.note) err(`${field}: ristiriitaiselle tiedolle tarvitaan selitys (note).`);
  }

  const ranges = [
    ...Object.values(l.hourly.value ?? {}),
    ...(l.callOut.value ? [l.callOut.value] : []),
  ];
  for (const r of ranges) if (!r || r.min > r.max || r.min < 0) err(`Virheellinen hintaväli ${JSON.stringify(r)}.`);

  for (const f of l.emergency.value ?? []) {
    if (f.includedHours < 0 || f.extraHourly < 0 || f.amount <= 0) err(`Virheellinen päivystysmaksu (${f.slot}).`);
  }

  if (l.kind === "company" && l.hourly.status === "estimate") err("Yrityksen hintaa ei saa merkitä arvioksi – käytä unavailable.");
  if (l.sponsored && !l.sponsorDisclosure) err("Kaupallinen rivi tarvitsee näkyvän selitteen (sponsorDisclosure).");
  if (l.listingStatus === "candidate") warn("Ehdokas – ei näytetä ennen kuin tiedot on varmistettu.");

  return issues;
}
