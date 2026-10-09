import { leadSchema, spamFieldsSchema, toFieldErrors } from "./lead-schema";
import { buildEnquiryText, deliverLead } from "./lead-delivery";
import { rateLimit } from "./rate-limit";

/** Pienin aika lomakkeen avaamisesta lähettämiseen (botit lähettävät heti). */
const MIN_FILL_MS = 3000;
const MAX_BODY_BYTES = 20_000;

export interface LeadResponseOk {
  ok: true;
  delivered: boolean;
  devStored: boolean;
  enquiryText: string;
}

export interface LeadResponseError {
  ok: false;
  error: string;
  fieldErrors?: Record<string, string>;
}

export type LeadResponse = LeadResponseOk | LeadResponseError;

const json = (body: LeadResponse, status: number) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return fwd || req.headers.get("x-real-ip") || "unknown";
}

function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // osa selaimista ei lähetä Originia samalle alkuperälle
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function handleLeadRequest(req: Request, now = Date.now()): Promise<Response> {
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return json({ ok: false, error: "Virheellinen pyyntö." }, 415);
  }
  if (!sameOrigin(req)) {
    return json({ ok: false, error: "Pyyntö hylättiin." }, 403);
  }
  if (!rateLimit(clientKey(req), 5, 10 * 60 * 1000, now)) {
    return json(
      { ok: false, error: "Liian monta pyyntöä lyhyessä ajassa. Yritä uudelleen hetken kuluttua." },
      429,
    );
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return json({ ok: false, error: "Viesti on liian pitkä." }, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "Virheellinen pyyntö." }, 400);
  }

  const spam = spamFieldsSchema.safeParse(body);
  if (!spam.success) {
    return json({ ok: false, error: "Lomakkeen tiedot puuttuvat. Lataa sivu uudelleen ja yritä uudestaan." }, 400);
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return json(
      { ok: false, error: "Tarkista lomakkeen tiedot.", fieldErrors: toFieldErrors(parsed.error) },
      400,
    );
  }

  const enquiryText = buildEnquiryText(parsed.data);

  // Piilokenttä täytetty → todennäköisesti botti. Ei tallenneta mitään.
  if (spam.data.website.trim() !== "") {
    return json({ ok: true, delivered: false, devStored: false, enquiryText }, 200);
  }
  if (now - spam.data.startedAt < MIN_FILL_MS) {
    return json(
      { ok: false, error: "Lomake lähetettiin liian nopeasti. Odota hetki ja yritä uudelleen." },
      400,
    );
  }

  const result = await deliverLead(parsed.data);
  return json({ ok: true, delivered: result.delivered, devStored: result.devStored, enquiryText }, 200);
}
