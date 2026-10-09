import type { Listing, PriceRange, TimeSlot } from "@/data/types";
import { formatEur } from "./format";

/**
 * HINTA-ARVIOLASKURIN LOGIIKKA
 *
 * Periaatteet:
 * 1. Lasketaan vain julkaistuista hinnoista. Puuttuvaa hintaa ei arvioida.
 * 2. Kiinteä päivystysmaksu sisältää ilmoitetut tunnit – niiden päälle ei lisätä
 *    tuntihintaa. Vain ylimenevät tunnit lisätään.
 * 3. "Alkaen"-hinnoilla arvion yläraja on avoin (max = null).
 * 4. Ristiriitaiset lähteet näytetään vaihteluvälinä.
 */

export type WorkHours = 1 | 2 | 3 | 4;
export const WORK_HOURS: readonly WorkHours[] = [1, 2, 3, 4] as const;

export interface EstimateInput {
  hours: WorkHours;
  slot: TimeSlot;
  includeCallOut: boolean;
  /** Käyttäjän oma tarvikearvio euroina; 0 = ei mukana */
  materials: number;
}

/** max = null tarkoittaa avointa ylärajaa ("alkaen"). */
export interface Amount {
  min: number;
  max: number | null;
}

export interface ProviderEstimate {
  listingId: string;
  name: string;
  kind: Listing["kind"];
  status: "ok" | "no-data";
  /** Selitys, miksi arviota ei voi laskea */
  noDataReason?: string;
  billedHours?: number;
  labour?: Amount;
  labourExplanation?: string;
  callOut?: Amount;
  materials: number;
  total?: Amount;
  /** Maksut, joita arvio ei sisällä */
  excluded: string[];
  /** Arvioon vaikuttavat huomiot */
  notes: string[];
}

const add = (a: Amount, b: Amount): Amount => ({
  min: a.min + b.min,
  max: a.max === null || b.max === null ? null : a.max + b.max,
});

const fromRange = (r: PriceRange): Amount => ({ min: r.min, max: r.max });

function billedHoursFor(listing: Listing, hours: number): number {
  return listing.billing.roundUpToStartedHour ? Math.ceil(hours) : hours;
}

export function estimateForListing(listing: Listing, input: EstimateInput): ProviderEstimate {
  const base: ProviderEstimate = {
    listingId: listing.id,
    name: listing.name,
    kind: listing.kind,
    status: "no-data",
    materials: input.materials,
    excluded: [],
    notes: [],
  };

  // --- Työn osuus --------------------------------------------------------
  const fee =
    listing.emergency.status === "confirmed"
      ? listing.emergency.value?.find((f) => f.slot === input.slot)
      : undefined;

  let labour: Amount | undefined;
  let labourExplanation: string | undefined;
  let billedHours: number | undefined;

  if (fee) {
    billedHours = billedHoursFor(listing, input.hours);
    const extraHours = Math.max(0, billedHours - fee.includedHours);
    const min = fee.amount + extraHours * fee.extraHourly;
    labour = { min, max: fee.amountIsFrom ? null : min };
    labourExplanation =
      `Päivystysmaksu ${fee.amountIsFrom ? "alkaen " : ""}${formatEur(fee.amount)} (sis. ${fee.includedHours} h)` +
      (extraHours > 0 ? ` + ${extraHours} h × ${formatEur(fee.extraHourly)}/h` : "");
    base.notes.push(`Päivystysaika yrityksen hinnastossa: ${fee.definition}.`);
    if (billedHours < fee.includedHours) {
      base.notes.push(
        `Päivystysmaksu sisältää ${fee.includedHours} h työtä, joten lyhyempikin käynti maksaa saman verran.`,
      );
    }
  } else {
    const rate = listing.hourly.status !== "unavailable" ? listing.hourly.value?.[input.slot] : undefined;
    if (rate) {
      const rounded = billedHoursFor(listing, input.hours);
      billedHours = Math.max(rounded, listing.billing.minimumHours ?? 0);
      labour = { min: rate.min * billedHours, max: rate.max * billedHours };
      const rateText = rate.min === rate.max ? formatEur(rate.min) : `${rate.min}–${formatEur(rate.max)}`;
      labourExplanation = `${billedHours} h × ${rateText}/h`;
      if (billedHours > input.hours) {
        base.notes.push(
          `Yrityksen minimiveloitus on ${listing.billing.minimumHours} h, joten arvio laskee ${billedHours} h.`,
        );
      }
    }
  }

  if (!labour) {
    const reason =
      listing.kind === "benchmark"
        ? "Markkinavertailussa ei ole hintatietoa tälle ajankohdalle."
        : listing.hourly.status === "unavailable" && listing.emergency.status === "unavailable"
          ? "Yritys ei ole julkaissut hintojaan. Pyydä tarjous suoraan yritykseltä."
          : "Yritys ei ole julkaissut hintaa tälle ajankohdalle. Pyydä tarjous suoraan yritykseltä.";
    return { ...base, noDataReason: reason };
  }

  // --- Lähtömaksu --------------------------------------------------------
  let callOut: Amount | undefined;
  const callOutValue = listing.callOut.status !== "unavailable" ? listing.callOut.value : undefined;
  if (input.includeCallOut) {
    if (callOutValue) {
      callOut = fromRange(callOutValue);
      if (listing.callOut.status === "conflicting" && listing.callOut.note) base.notes.push(listing.callOut.note);
      if (fee && listing.callOut.note?.includes("päivystys")) base.notes.push(listing.callOut.note);
    } else {
      base.excluded.push(
        listing.kind === "benchmark"
          ? "Lähtömaksu – markkinavertailu sisältää vain tuntihinnan"
          : "Lähtömaksu – yritys ei ole julkaissut sen suuruutta",
      );
    }
  } else if (callOutValue) {
    const v = callOutValue;
    base.excluded.push(
      `Lähtömaksu ${v.min === v.max ? formatEur(v.min) : `${v.min}–${formatEur(v.max)}`} (jätit sen pois arviosta)`,
    );
  }

  // --- Yhteensä ----------------------------------------------------------
  let total: Amount = labour;
  if (callOut) total = add(total, callOut);
  const isMaterials = (c: string) => c.startsWith("Tarvikkeet");
  const companyMaterialsNote = listing.otherCharges.some(isMaterials);
  if (input.materials > 0) total = add(total, { min: input.materials, max: input.materials });
  else if (!companyMaterialsNote) base.excluded.push("Tarvikkeet ja varaosat");

  // Kun käyttäjä on lisännyt oman tarvikearvion, yrityksen tarvikemaininta ei ole enää "puuttuva" kulu.
  base.excluded.push(...listing.otherCharges.filter((c) => !(input.materials > 0 && isMaterials(c))));
  if (listing.vat === "unknown") base.notes.push("Lähde ei kerro, sisältääkö hinta arvonlisäveron.");
  if (listing.hourly.status === "estimate") base.notes.push("Suuntaa-antava markkinahinta, ei yrityksen tarjous.");

  return {
    ...base,
    status: "ok",
    billedHours,
    labour,
    labourExplanation,
    callOut,
    total,
  };
}

/** Laskee arvion kaikille riveille. Lasketut ensin pienimmän arvion mukaan. */
export function estimateAll(rows: Listing[], input: EstimateInput): ProviderEstimate[] {
  const results = rows.map((l) => estimateForListing(l, input));
  return results.sort((a, b) => {
    if (a.status !== b.status) return a.status === "ok" ? -1 : 1;
    if (a.kind !== b.kind) return a.kind === "company" ? -1 : 1;
    return (a.total?.min ?? 0) - (b.total?.min ?? 0);
  });
}

/** Pienin julkaistu arkipäivän tuntihinta (vain vahvistetut yritykset). */
export function weekdayHourly(listing: Listing): PriceRange | undefined {
  if (listing.hourly.status === "unavailable") return undefined;
  return listing.hourly.value?.weekday;
}
