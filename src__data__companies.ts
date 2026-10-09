import type { Listing } from "./types";

/**
 * VERTAILUN KESKITETTY TIETOLÄHDE
 *
 * Kaikki hinnat euroina. Päivitä `lastVerified` aina, kun tarkistat hinnat
 * yrityksen omasta lähteestä. Älä arvioi puuttuvaa hintaa – merkitse se
 * `status: "unavailable"`, jolloin sivulla näkyy "Pyydä tarjous".
 *
 * Ohjeet: README.md → "Hintojen päivittäminen".
 * Tarkistus: `npm run verify-listings`.
 */
export const listings: Listing[] = [
  {
    id: "kh-suomi-putki",
    name: "KH-Suomi Putki",
    kind: "company",
    websiteUrl: "https://www.suomiputki.fi/",
    contactUrl: "https://www.suomiputki.fi/yhteystiedot2/",
    listingStatus: "active",
    services: [
      "hanan-vaihto",
      "wc-istuimen-vaihto",
      "vesivuodon-korjaus",
      "viemarin-avaus",
      "pesukoneen-asennus",
      "putkistojen-huolto",
      "paivystava-putkimies",
    ],
    serviceArea: ["Helsinki", "Espoo", "Vantaa", "Kauniainen"],
    hourly: {
      status: "confirmed",
      value: {
        weekday: { min: 70, max: 70 },
        evening: { min: 140, max: 140 },
        weekend: { min: 175, max: 175 },
        holiday: { min: 175, max: 175 },
      },
      note: "Arkisin klo 7–16: 70 €/h. Arkisin klo 16–7: 140 €/h. Viikonloput ja pyhät: 175 €/h.",
    },
    callOut: {
      status: "conflicting",
      value: { min: 20, max: 25 },
      note: "Yrityksen etusivulla huoltoajo on 25 €, hinnastosivulla 20 €. Varmista hinta yritykseltä.",
    },
    emergency: {
      status: "unavailable",
      note: "Ei erillistä kiinteää päivystysmaksua – ilta- ja viikonlopputyöt korotetulla tuntihinnalla.",
    },
    billing: {
      description: "Laskutusjaksoa tai minimiveloitusta ei ole julkaistu.",
    },
    vat: "included",
    otherCharges: ["Tarvikkeet tukkuhinnaston mukaan"],
    notes: ["Hinnat sisältävät arvonlisäveron 25,5 % (yrityksen ilmoitus, vuosi 2026)."],
    sources: [
      { label: "suomiputki.fi – etusivu", url: "https://www.suomiputki.fi/" },
      { label: "suomiputki.fi – hinnasto", url: "https://www.suomiputki.fi/putkityot-hinnasto" },
    ],
    lastVerified: "2026-10-09",
    sponsored: false,
    acceptsForwardedLeads: false,
  },
  {
    id: "putkihuolto-arina",
    name: "Putkihuolto Arina",
    kind: "company",
    websiteUrl: "https://putkihuoltoarina.fi/",
    listingStatus: "active",
    services: [
      "hanan-vaihto",
      "wc-istuimen-vaihto",
      "vesivuodon-korjaus",
      "viemarin-avaus",
      "pesukoneen-asennus",
      "astianpesukoneen-asennus",
      "putkistojen-huolto",
      "putkiremontit",
      "paivystava-putkimies",
    ],
    serviceArea: ["Helsinki", "Espoo", "Vantaa", "muu Uusimaa"],
    hourly: {
      status: "confirmed",
      value: {
        weekday: { min: 75, max: 75 },
      },
      note: "Arkisin ma–pe klo 7–15: 75 €/h. Muina aikoina kiinteä päivystysmaksu.",
    },
    callOut: {
      status: "confirmed",
      value: { min: 34, max: 34 },
      note: "Huoltoauton lähtöveloitus. Hinnastosta ei käy ilmi, veloitetaanko se myös päivystyskäynneillä – laskuri lisää sen varmuuden vuoksi.",
    },
    emergency: {
      status: "confirmed",
      value: [
        {
          slot: "evening",
          amount: 499,
          amountIsFrom: false,
          includedHours: 2,
          extraHourly: 138,
          definition: "arkisin klo 15–7",
        },
        {
          slot: "weekend",
          amount: 599,
          amountIsFrom: true,
          includedHours: 2,
          extraHourly: 138,
          definition: "lauantaisin 599 €, sunnuntaisin alkaen 599 €",
        },
        {
          slot: "holiday",
          amount: 599,
          amountIsFrom: true,
          includedHours: 2,
          extraHourly: 138,
          definition: "arkipyhinä alkaen 599 €",
        },
      ],
      note: "Päivystysmaksu sisältää kaksi tuntia työtä, seuraavat tunnit 138 €/h.",
    },
    billing: {
      minimumHours: 2,
      roundUpToStartedHour: true,
      description: "Alkava tunti laskutetaan. Minimiveloitus kaksi tuntia (150 €) arkipäivän tuntityössä.",
    },
    vat: "included",
    otherCharges: [
      "Kilometrikorvaus 1,49 €/km",
      "Kiireellinen päivätyö (hälytystyö) arkisin klo 7–15: 249 € – hinnastosta ei käy ilmi, sisältääkö maksu työtunteja",
      "Erikoistyökalut käyntikohtaisesti, esim. viemärinavauskone 30–49 €",
      "Tarvikkeet tukkuhinnaston mukaan",
    ],
    notes: ["Hinnat kotitalousasiakkaille, sis. alv 25,5 % (yrityksen ilmoitus)."],
    sources: [{ label: "putkihuoltoarina.fi – hinnasto", url: "https://putkihuoltoarina.fi/hinnasto" }],
    lastVerified: "2026-10-09",
    sponsored: false,
    acceptsForwardedLeads: false,
  },
  {
    id: "helsingin-putkimies-oy",
    name: "Helsingin Putkimies Oy",
    kind: "company",
    businessId: "1843003-3",
    websiteUrl: "https://www.helsinginputkimies.fi/",
    contactUrl: "https://helsinginputkimies.fi/verkkotilauslomake",
    listingStatus: "active",
    services: ["paivystava-putkimies"],
    servicesNote: "Yritys kertoo palvelevansa kaikissa LVI-alan töissä. Tarkista yksittäiset palvelut yritykseltä.",
    serviceArea: null,
    hourly: {
      status: "unavailable",
      note: "Tuntihintaa ei ole julkaistu verkkosivuilla.",
    },
    callOut: {
      status: "unavailable",
      note: "Yritys kertoo veloittavansa huoltoautomaksun, mutta summaa ei ole julkaistu.",
    },
    emergency: {
      status: "unavailable",
      note: "Yritys mainitsee ympärivuorokautisen päivystyksen, mutta hintaa ei ole julkaistu.",
    },
    billing: {
      minimumHours: 1,
      roundUpToStartedHour: true,
      description: "Alkava tunti laskutetaan, minimiveloitus yksi tunti. Matka- ja tarvikehankinta-aika laskutetaan työaikana.",
    },
    vat: "unknown",
    otherCharges: [],
    notes: ["Y-tunnus 1843003-3 (toiminnassa, LVI-asennus)."],
    sources: [
      { label: "helsinginputkimies.fi – etusivu", url: "https://www.helsinginputkimies.fi/" },
      { label: "Yritystiedot (scoris.eu)", url: "https://scoris.eu/company/FI/1843003-3" },
    ],
    lastVerified: "2026-10-09",
    sponsored: false,
    acceptsForwardedLeads: false,
  },
  {
    id: "remppatori-benchmark",
    name: "Remppatori – markkinavertailu",
    kind: "benchmark",
    websiteUrl: "https://remppatori.fi/urakoitsijat/putkiasentaja/helsinki",
    listingStatus: "active",
    services: [],
    servicesNote: "Markkinavertailu, ei yksittäinen yritys.",
    serviceArea: ["Helsinki"],
    hourly: {
      status: "estimate",
      value: { weekday: { min: 55, max: 70 } },
      note: "Suuntaa-antava putkiasentajan tuntihinta Helsingissä Remppatorin mukaan. Ei yksittäisen yrityksen tarjous.",
    },
    callOut: { status: "unavailable", note: "Ei sisällä lähtömaksuja." },
    emergency: { status: "unavailable", note: "Ei päivystyshintoja." },
    billing: {},
    vat: "unknown",
    otherCharges: [],
    notes: ["Lähde ei kerro, sisältääkö hinta arvonlisäveron."],
    sources: [{ label: "remppatori.fi – putkiasentaja Helsinki", url: "https://remppatori.fi/urakoitsijat/putkiasentaja/helsinki" }],
    lastVerified: "2026-10-09",
    sponsored: false,
    acceptsForwardedLeads: false,
  },

  // --- Ehdokkaat: ei näytetä ennen kuin tiedot on varmistettu ---------------
  {
    id: "toolon-putkiliike-oy",
    name: "Töölön Putkiliike Oy",
    kind: "company",
    websiteUrl: "",
    listingStatus: "candidate",
    services: [],
    serviceArea: null,
    hourly: { status: "unavailable" },
    callOut: { status: "unavailable" },
    emergency: { status: "unavailable" },
    billing: {},
    vat: "unknown",
    otherCharges: [],
    notes: ["9.10.2026: yritystä tai sen verkkosivuja ei löytynyt julkisista lähteistä. Varmista YTJ:stä ennen julkaisua."],
    sources: [],
    lastVerified: null,
    sponsored: false,
    acceptsForwardedLeads: false,
  },
  {
    id: "herttoniemen-lvi-huolto-oy",
    name: "Herttoniemen LVI-Huolto Oy",
    kind: "company",
    websiteUrl: "",
    listingStatus: "candidate",
    services: [],
    serviceArea: null,
    hourly: { status: "unavailable" },
    callOut: { status: "unavailable" },
    emergency: { status: "unavailable" },
    billing: {},
    vat: "unknown",
    otherCharges: [],
    notes: ["9.10.2026: yritystä tai sen verkkosivuja ei löytynyt julkisista lähteistä. Varmista YTJ:stä ennen julkaisua."],
    sources: [],
    lastVerified: null,
    sponsored: false,
    acceptsForwardedLeads: false,
  },
];

/** Julkisesti näytettävät rivit. */
export const activeListings = listings.filter((l) => l.listingStatus === "active");
export const activeCompanies = activeListings.filter((l) => l.kind === "company");
export const benchmarks = activeListings.filter((l) => l.kind === "benchmark");

/** Viimeisin tarkistuspäivä näkyville riveille. */
export const latestVerification = activeListings
  .map((l) => l.lastVerified)
  .filter((d): d is string => !!d)
  .sort()
  .at(-1) ?? null;
