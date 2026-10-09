/**
 * Sivuston perustiedot. Ylläpitäjän tiedot luetaan ympäristömuuttujista,
 * jotta niitä ei keksitä koodiin. Täydennä ne ennen julkaisua (.env.example).
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://helsinkiputkimies.fi").replace(/\/$/, "");

export const SITE_NAME = "HelsinkiPutkimies.fi";

export const SITE_TAGLINE = "Riippumaton putkitöiden hinta- ja vertailupalvelu Helsingissä";

export interface Operator {
  name: string | null;
  businessId: string | null;
  email: string | null;
  address: string | null;
}

export function getOperator(): Operator {
  const v = (k: string) => (process.env[k]?.trim() ? process.env[k]!.trim() : null);
  return {
    name: v("SITE_OPERATOR_NAME"),
    businessId: v("SITE_OPERATOR_BUSINESS_ID"),
    email: v("SITE_OPERATOR_EMAIL"),
    address: v("SITE_OPERATOR_ADDRESS"),
  };
}

export const absoluteUrl = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
