const eurWhole = new Intl.NumberFormat("fi-FI", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const eurCents = new Intl.NumberFormat("fi-FI", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** 70 → "70 €", 1.49 → "1,49 €" (suomalainen muotoilu). */
export function formatEur(value: number): string {
  return Number.isInteger(value) ? eurWhole.format(value) : eurCents.format(value);
}

/** Vaihteluväli: {20,25} → "20–25 €", {70,70} → "70 €". max=null → "alkaen 599 €". */
export function formatRange(min: number, max: number | null, suffix = ""): string {
  if (max === null) return `alkaen ${formatEur(min)}${suffix}`;
  if (min === max) return `${formatEur(min)}${suffix}`;
  // "20–25 €": numerot ilman toistuvaa valuuttamerkkiä
  const num = new Intl.NumberFormat("fi-FI", { maximumFractionDigits: 2 });
  return `${num.format(min)}–${formatEur(max)}${suffix}`;
}

/** "2026-10-09" → "9.10.2026" */
export function formatDateFi(iso: string | null): string {
  if (!iso) return "ei tarkistettu";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d}.${m}.${y}`;
}
