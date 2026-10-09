import type { DataStatus, Listing, TimeSlot } from "@/data/types";
import { formatEur, formatRange } from "./format";

export const REQUEST_QUOTE = "Pyydä tarjous";

export function hourlyText(l: Listing, slot: TimeSlot): string | null {
  if (l.hourly.status === "unavailable") return null;
  const r = l.hourly.value?.[slot];
  return r ? formatRange(r.min, r.max, "/h") : null;
}

/** Arki-illan, viikonlopun ja pyhän hinnat yhtenä tekstinä. */
export function offHoursText(l: Listing): string | null {
  const parts: string[] = [];
  const fees = l.emergency.status === "confirmed" ? l.emergency.value ?? [] : [];
  const labels: Record<Exclude<TimeSlot, "weekday">, string> = {
    evening: "ilta",
    weekend: "vkl",
    holiday: "pyhä",
  };
  for (const slot of ["evening", "weekend", "holiday"] as const) {
    const fee = fees.find((f) => f.slot === slot);
    if (fee) {
      parts.push(`${labels[slot]} ${fee.amountIsFrom ? "alk. " : ""}${formatEur(fee.amount)} (sis. ${fee.includedHours} h)`);
      continue;
    }
    const h = hourlyText(l, slot);
    if (h) parts.push(`${labels[slot]} ${h}`);
  }
  return parts.length ? parts.join(", ") : null;
}

export function callOutText(l: Listing): string | null {
  if (l.callOut.status === "unavailable" || !l.callOut.value) return null;
  return formatRange(l.callOut.value.min, l.callOut.value.max);
}

export function emergencyText(l: Listing): string | null {
  if (l.emergency.status !== "confirmed" || !l.emergency.value?.length) return null;
  const min = Math.min(...l.emergency.value.map((f) => f.amount));
  const anyFrom = l.emergency.value.some((f) => f.amountIsFrom);
  const max = Math.max(...l.emergency.value.map((f) => f.amount));
  const span = min === max ? formatEur(min) : `${min}–${formatEur(max)}`;
  return `${span}${anyFrom ? " tai enemmän" : ""}, sis. ${l.emergency.value[0]!.includedHours} h`;
}

export function vatText(l: Listing): string {
  switch (l.vat) {
    case "included":
      return "Sis. alv";
    case "excluded":
      return "Alv 0 %";
    default:
      return "Ei ilmoitettu";
  }
}

export const STATUS_LABEL: Record<DataStatus, string> = {
  confirmed: "Tarkistettu",
  conflicting: "Lähteet ristiriidassa",
  estimate: "Suuntaa-antava",
  unavailable: "Ei julkaistu",
};

/** Lajitteluarvo: pienin arkipäivän tuntihinta, puuttuva viimeisenä. */
export function sortValueHourly(l: Listing): number {
  if (l.hourly.status === "unavailable") return Number.POSITIVE_INFINITY;
  return l.hourly.value?.weekday?.min ?? Number.POSITIVE_INFINITY;
}

export function sortValueCallOut(l: Listing): number {
  if (l.callOut.status === "unavailable" || !l.callOut.value) return Number.POSITIVE_INFINITY;
  return l.callOut.value.min;
}
