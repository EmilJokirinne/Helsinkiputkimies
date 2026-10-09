import { z } from "zod";
import { services } from "@/content/services";

/** Lomakkeen palveluvalinnat: palvelut + "muu" */
export const JOB_OPTIONS = [
  ...services.map((s) => ({ value: s.slug as string, label: s.shortName })),
  { value: "muu", label: "Muu putkityö" },
] as const;

export const TIMING_OPTIONS = [
  { value: "kiireellinen", label: "Mahdollisimman pian" },
  { value: "viikon-sisalla", label: "Tämän viikon aikana" },
  { value: "kuukauden-sisalla", label: "Kuukauden sisällä" },
  { value: "joustava", label: "Ajankohta on joustava" },
] as const;

const jobValues = JOB_OPTIONS.map((o) => o.value) as [string, ...string[]];
const timingValues = TIMING_OPTIONS.map((o) => o.value) as [string, ...string[]];

/** Suomalainen puhelinnumero: +358… tai 0…, välilyönnit ja väliviivat sallittu */
const PHONE_RE = /^(\+358|00358|0)[1-9][0-9]{4,11}$/;
const isFinnishPhone = (v: string) => PHONE_RE.test(v.replace(/[\s()-]/g, ""));
/** Postinumero (5 numeroa) tai kaupunginosan nimi */
const AREA_RE = /^(\d{5}|[A-Za-zÅÄÖåäöÉé][A-Za-zÅÄÖåäöÉé\s.-]{1,59})$/;

const trimmed = (max: number) => z.string().trim().max(max, `Enintään ${max} merkkiä.`);

export const leadSchema = z.object({
  name: trimmed(100).min(2, "Kirjoita nimesi."),
  phone: trimmed(25)
    .min(1, "Kirjoita puhelinnumerosi.")
    .refine(isFinnishPhone,"Tarkista puhelinnumero, esim. 040 123 4567."),
  email: trimmed(254).min(1, "Kirjoita sähköpostiosoitteesi.").email("Tarkista sähköpostiosoite."),
  area: trimmed(60)
    .min(1, "Kirjoita postinumero tai kaupunginosa.")
    .refine((v) => AREA_RE.test(v), "Kirjoita postinumero (esim. 00100) tai kaupunginosa (esim. Kallio)."),
  job: z.enum(jobValues, { errorMap: () => ({ message: "Valitse tarvittava putkityö." }) }),
  description: trimmed(2000).min(10, "Kuvaa ongelmaa vähintään muutamalla sanalla."),
  timing: z.enum(timingValues, { errorMap: () => ({ message: "Valitse toivottu ajankohta." }) }),
  privacy: z.literal(true, { errorMap: () => ({ message: "Hyväksy tietosuojaseloste lähettääksesi pyynnön." }) }),
  marketing: z.boolean().default(false),
});

export type LeadInput = z.infer<typeof leadSchema>;

/** Roskapostisuojauksen kentät, jotka eivät kuulu itse pyyntöön. */
export const spamFieldsSchema = z.object({
  /** Piilokenttä – ihminen jättää tyhjäksi */
  website: z.string().max(200).optional().default(""),
  /** Lomakkeen avaamisaika (ms epochista) */
  startedAt: z.number().int().nonnegative(),
});

export type FieldErrors = Partial<Record<keyof LeadInput, string>>;

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof LeadInput | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

export const jobLabel = (v: string) => JOB_OPTIONS.find((o) => o.value === v)?.label ?? v;
export const timingLabel = (v: string) => TIMING_OPTIONS.find((o) => o.value === v)?.label ?? v;
