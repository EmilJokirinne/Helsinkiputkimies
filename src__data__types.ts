import type { ServiceSlug } from "@/content/services";

/** Ajankohta, jolle hinta-arvio lasketaan. */
export type TimeSlot = "weekday" | "evening" | "weekend" | "holiday";

export const TIME_SLOTS: readonly TimeSlot[] = ["weekday", "evening", "weekend", "holiday"] as const;

export const TIME_SLOT_LABELS: Record<TimeSlot, string> = {
  weekday: "Arkipäivä",
  evening: "Arki-ilta tai -yö",
  weekend: "Viikonloppu",
  holiday: "Arkipyhä",
};

/**
 * Tiedon luotettavuus:
 * - confirmed:   tarkistettu yrityksen omasta julkisesta lähteestä
 * - conflicting: yrityksen omat lähteet antavat eri lukuja (näytetään vaihteluvälinä)
 * - estimate:    suuntaa-antava arvio tai markkinavertailu, ei yrityksen hinta
 * - unavailable: yritys ei ole julkaissut tietoa → "Pyydä tarjous"
 */
export type DataStatus = "confirmed" | "conflicting" | "estimate" | "unavailable";

/** Hinta euroina. Yksittäisellä hinnalla min === max. */
export interface PriceRange {
  min: number;
  max: number;
}

export interface Priced<T> {
  status: DataStatus;
  value?: T;
  /** Näkyvä lisätieto, esim. ristiriidan selitys */
  note?: string;
}

/**
 * Kiinteä päivystysmaksu, joka sisältää tietyn määrän työtunteja.
 * Laskuri ei lisää tuntihintaa näiden tuntien päälle.
 */
export interface FixedEmergencyFee {
  slot: TimeSlot;
  /** Maksu euroina */
  amount: number;
  /** true = hinnastossa "alkaen", todellinen hinta voi olla suurempi */
  amountIsFrom: boolean;
  /** Montako työtuntia maksu sisältää */
  includedHours: number;
  /** Seuraavien tuntien hinta €/h */
  extraHourly: number;
  /** Ajankohdan määritelmä yrityksen hinnastossa, esim. "arkisin klo 15–7" */
  definition: string;
}

export interface BillingRules {
  /** Pienin laskutettava työaika tunteina, jos julkaistu */
  minimumHours?: number;
  /** Laskutetaanko jokainen alkava tunti */
  roundUpToStartedHour?: boolean;
  /** Vapaamuotoinen kuvaus, joka näytetään taulukossa */
  description?: string;
}

export type VatStatus = "included" | "excluded" | "unknown";

export type ListingStatus =
  /** Näytetään vertailussa */
  | "active"
  /** Ehdolla, mutta tietoja ei ole vielä varmistettu – ei näytetä julkisesti */
  | "candidate"
  /** Poistettu näkyvistä (esim. toiminta loppunut) */
  | "hidden";

export interface Source {
  label: string;
  url: string;
}

export interface Listing {
  id: string;
  name: string;
  kind: "company" | "benchmark";
  /** Y-tunnus, jos tarkistettu */
  businessId?: string;
  websiteUrl: string;
  /** Yrityksen oma yhteydenotto- tai tarjouspyyntösivu, jos tarkistettu */
  contactUrl?: string;
  listingStatus: ListingStatus;
  /** Palvelut, jotka yritys itse mainitsee sivuillaan */
  services: ServiceSlug[];
  /** Jos palveluita ei ole eritelty, selitys näytetään tässä */
  servicesNote?: string;
  /** Palvelualue yrityksen oman ilmoituksen mukaan; null = ei ilmoitettu */
  serviceArea: string[] | null;
  /** Tuntihinnat ajankohdittain (€/h, sis. alv jos vat = included) */
  hourly: Priced<Partial<Record<TimeSlot, PriceRange>>>;
  /** Lähtö-, huoltoauto- tai käyntimaksu */
  callOut: Priced<PriceRange>;
  /** Kiinteät päivystysmaksut */
  emergency: Priced<FixedEmergencyFee[]>;
  billing: BillingRules;
  vat: VatStatus;
  /** Muut julkaistut maksut, joita laskuri ei laske mukaan */
  otherCharges: string[];
  /** Huomiot, jotka näytetään vertailussa ja laskurissa */
  notes: string[];
  sources: Source[];
  /** ISO-päivä (YYYY-MM-DD), jolloin tiedot viimeksi tarkistettiin lähteestä */
  lastVerified: string | null;
  /** Maksettu tai kaupallinen näkyvyys – näytetään aina selkeästi */
  sponsored: boolean;
  sponsorDisclosure?: string;
  /**
   * Onko yrityksen kanssa sovittu tarjouspyyntöjen välittämisestä.
   * Kun false, sivusto ei välitä käyttäjän tietoja yritykselle.
   */
  acceptsForwardedLeads: boolean;
}
