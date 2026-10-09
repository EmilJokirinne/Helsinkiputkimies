import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { jobLabel, timingLabel, type LeadInput } from "./lead-schema";

/**
 * TARJOUSPYYNTÖJEN TOIMITUS – INTEGRAATIOPISTE
 *
 * Toimitustavat otetaan käyttöön ympäristömuuttujilla (.env.example):
 *  - Sähköposti Resendin kautta:  RESEND_API_KEY, LEAD_TO_EMAIL, LEAD_FROM_EMAIL
 *  - Webhook (CRM, Make, Zapier):  LEAD_WEBHOOK_URL (+ valinnainen LEAD_WEBHOOK_SECRET)
 *  - Paikallinen kehitystila:      ei asetuksia + NODE_ENV !== "production"
 *                                  → kirjoitetaan tiedostoon .data/leads.jsonl
 *
 * Tuotannossa ilman asetuksia pyyntöä ei tallenneta eikä lähetetä minnekään,
 * ja käyttäjälle kerrotaan tämä rehellisesti.
 *
 * Uuden toimitustavan (esim. tietokanta) voi lisätä `deliverLead`-funktioon.
 */

export type DeliveryChannel = "email" | "webhook" | "dev-file";

export interface DeliveryResult {
  /** Toimitettiinko pyyntö ylläpitäjälle (sähköposti tai webhook onnistui) */
  delivered: boolean;
  /** Tallennettiinko pyyntö vain paikallisesti kehitystilassa */
  devStored: boolean;
  channels: DeliveryChannel[];
}

const env = (k: string) => process.env[k]?.trim() || undefined;

export function configuredChannels(): DeliveryChannel[] {
  const out: DeliveryChannel[] = [];
  if (env("RESEND_API_KEY") && env("LEAD_TO_EMAIL") && env("LEAD_FROM_EMAIL")) out.push("email");
  if (env("LEAD_WEBHOOK_URL")) out.push("webhook");
  if (out.length === 0 && process.env.NODE_ENV !== "production") out.push("dev-file");
  return out;
}

/** true, kun pyyntö toimitetaan oikeasti sivuston ylläpitäjälle. */
export function isOperatorDeliveryEnabled(): boolean {
  return configuredChannels().some((c) => c === "email" || c === "webhook");
}

export interface LeadRecord extends LeadInput {
  id: string;
  receivedAt: string;
}

/** Valmis viesti, jonka käyttäjä voi lähettää suoraan valitsemalleen yritykselle. */
export function buildEnquiryText(lead: LeadInput): string {
  return [
    "Hei,",
    "",
    `pyydän tarjousta putkityöstä: ${jobLabel(lead.job)}.`,
    "",
    `Kohde: ${lead.area}`,
    `Toivottu ajankohta: ${timingLabel(lead.timing)}`,
    "",
    "Kuvaus:",
    lead.description,
    "",
    "Pyydän tarjouksessa erittelemään työn, lähtö- tai matkakulut, tarvikkeet ja arvonlisäveron.",
    "",
    "Ystävällisin terveisin",
    lead.name,
    lead.phone,
    lead.email,
  ].join("\n");
}

function operatorEmailText(lead: LeadRecord): string {
  return [
    `Uusi tarjouspyyntö (${lead.id})`,
    `Vastaanotettu: ${lead.receivedAt}`,
    "",
    `Nimi: ${lead.name}`,
    `Puhelin: ${lead.phone}`,
    `Sähköposti: ${lead.email}`,
    `Alue: ${lead.area}`,
    `Työ: ${jobLabel(lead.job)}`,
    `Ajankohta: ${timingLabel(lead.timing)}`,
    `Markkinointilupa: ${lead.marketing ? "kyllä" : "ei"}`,
    "",
    "Kuvaus:",
    lead.description,
  ].join("\n");
}

async function sendEmail(lead: LeadRecord): Promise<boolean> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env("LEAD_FROM_EMAIL"),
      to: [env("LEAD_TO_EMAIL")],
      reply_to: lead.email,
      subject: `Tarjouspyyntö: ${jobLabel(lead.job)} – ${lead.area}`,
      text: operatorEmailText(lead),
    }),
    signal: AbortSignal.timeout(10_000),
  });
  return res.ok;
}

async function sendWebhook(lead: LeadRecord): Promise<boolean> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const secret = env("LEAD_WEBHOOK_SECRET");
  if (secret) headers.Authorization = `Bearer ${secret}`;
  const res = await fetch(env("LEAD_WEBHOOK_URL")!, {
    method: "POST",
    headers,
    body: JSON.stringify({ type: "plumbing_enquiry", ...lead }),
    signal: AbortSignal.timeout(10_000),
  });
  return res.ok;
}

async function writeDevFile(lead: LeadRecord): Promise<boolean> {
  const dir = path.join(process.cwd(), ".data");
  await mkdir(dir, { recursive: true });
  await appendFile(path.join(dir, "leads.jsonl"), `${JSON.stringify(lead)}\n`, "utf8");
  return true;
}

export async function deliverLead(lead: LeadInput): Promise<DeliveryResult> {
  const record: LeadRecord = {
    ...lead,
    id: crypto.randomUUID(),
    receivedAt: new Date().toISOString(),
  };
  const channels = configuredChannels();
  const succeeded: DeliveryChannel[] = [];

  for (const channel of channels) {
    try {
      const ok =
        channel === "email"
          ? await sendEmail(record)
          : channel === "webhook"
            ? await sendWebhook(record)
            : await writeDevFile(record);
      if (ok) succeeded.push(channel);
      // Henkilötietoja ei kirjoiteta lokiin – vain kanava ja tunniste.
      else console.error(`[lead] delivery failed via ${channel} (${record.id})`);
    } catch {
      console.error(`[lead] delivery error via ${channel} (${record.id})`);
    }
  }

  return {
    delivered: succeeded.includes("email") || succeeded.includes("webhook"),
    devStored: succeeded.includes("dev-file"),
    channels: succeeded,
  };
}
