import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { handleLeadRequest, type LeadResponse } from "../src/lib/lead-handler";
import { configuredChannels } from "../src/lib/lead-delivery";

const NOW = 1_800_000_000_000;
let ipCounter = 0;

const valid = {
  name: "Matti Meikäläinen",
  phone: "040 123 4567",
  email: "matti@example.com",
  area: "00530",
  job: "hanan-vaihto",
  description: "Keittiön hana tippuu jatkuvasti, vaikka se on kiinni.",
  timing: "viikon-sisalla",
  privacy: true,
  marketing: false,
  website: "",
  startedAt: NOW - 60_000,
};

function req(body: unknown, headers: Record<string, string> = {}) {
  ipCounter += 1;
  return new Request("http://localhost:3000/api/tarjouspyynto", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      host: "localhost:3000",
      "x-forwarded-for": `10.0.0.${ipCounter}`,
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

async function call(body: unknown, headers?: Record<string, string>) {
  const res = await handleLeadRequest(req(body, headers), NOW);
  return { status: res.status, data: (await res.json()) as LeadResponse };
}

let cwd: string;
beforeEach(async () => {
  for (const k of ["RESEND_API_KEY", "LEAD_TO_EMAIL", "LEAD_FROM_EMAIL", "LEAD_WEBHOOK_URL"]) delete process.env[k];
  cwd = await mkdtemp(path.join(os.tmpdir(), "lead-"));
  process.chdir(cwd);
});

test("valid enquiry in dev mode is stored locally, not reported as delivered", async () => {
  (process.env as Record<string, string>).NODE_ENV = "development";
  const { status, data } = await call(valid);
  assert.equal(status, 200);
  assert.ok(data.ok);
  if (data.ok) {
    assert.equal(data.delivered, false);
    assert.equal(data.devStored, true);
    assert.match(data.enquiryText, /Hanan vaihto/);
  }
  const file = await readFile(path.join(cwd, ".data", "leads.jsonl"), "utf8");
  assert.equal(file.trim().split("\n").length, 1);
  assert.match(file, /matti@example.com/);
  await rm(cwd, { recursive: true, force: true });
});

test("production without credentials: nothing stored, not delivered", async () => {
  (process.env as Record<string, string>).NODE_ENV = "production";
  assert.deepEqual(configuredChannels(), []);
  const { data } = await call(valid);
  assert.ok(data.ok);
  if (data.ok) {
    assert.equal(data.delivered, false);
    assert.equal(data.devStored, false);
  }
  (process.env as Record<string, string>).NODE_ENV = "development";
});

test("webhook delivery reports delivered=true only when the webhook succeeds", async () => {
  process.env.LEAD_WEBHOOK_URL = "https://hooks.example.test/lead";
  const realFetch = globalThis.fetch;
  let sent: unknown;
  globalThis.fetch = (async (_url: string, init: RequestInit) => {
    sent = JSON.parse(String(init.body));
    return new Response("{}", { status: 200 });
  }) as typeof fetch;
  const ok = await call(valid);
  assert.ok(ok.data.ok && ok.data.delivered);
  assert.equal((sent as { email: string }).email, "matti@example.com");

  globalThis.fetch = (async () => new Response("err", { status: 500 })) as typeof fetch;
  const fail = await call(valid);
  assert.ok(fail.data.ok && !fail.data.delivered);
  globalThis.fetch = realFetch;
});

test("field validation returns Finnish messages per field", async () => {
  const { status, data } = await call({ ...valid, email: "ei-osoite", phone: "123", privacy: false, area: "!" });
  assert.equal(status, 400);
  assert.ok(!data.ok);
  if (!data.ok) {
    assert.equal(data.fieldErrors?.email, "Tarkista sähköpostiosoite.");
    assert.match(data.fieldErrors?.phone ?? "", /puhelinnumero/);
    assert.match(data.fieldErrors?.privacy ?? "", /tietosuojaseloste/);
    assert.match(data.fieldErrors?.area ?? "", /postinumero/);
  }
});

test("accepts district names and +358 numbers", async () => {
  const { status } = await call({ ...valid, area: "Etu-Töölö", phone: "+358 40 123 4567" });
  assert.equal(status, 200);
});

test("honeypot filled → fake success, nothing stored", async () => {
  const { data } = await call({ ...valid, website: "http://spam" });
  assert.ok(data.ok && !data.delivered && !data.devStored);
});

test("submitted too fast → rejected", async () => {
  const { status } = await call({ ...valid, startedAt: NOW - 500 });
  assert.equal(status, 400);
});

test("cross-origin request → 403", async () => {
  const { status } = await call(valid, { origin: "https://evil.example" });
  assert.equal(status, 403);
});

test("rate limit after 5 requests from the same IP", async () => {
  const statuses: number[] = [];
  for (let i = 0; i < 6; i++) {
    const res = await handleLeadRequest(req({ ...valid, website: "x" }, { "x-forwarded-for": "10.9.9.9" }), NOW);
    statuses.push(res.status);
  }
  assert.deepEqual(statuses, [200, 200, 200, 200, 200, 429]);
});

test("non-JSON and oversized bodies are rejected", async () => {
  const r1 = await handleLeadRequest(
    new Request("http://localhost/api", { method: "POST", headers: { "content-type": "text/plain" }, body: "x" }),
    NOW,
  );
  assert.equal(r1.status, 415);
  const { status } = await call({ ...valid, description: "a".repeat(25_000) });
  assert.equal(status, 413);
});
