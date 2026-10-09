import { test } from "node:test";
import assert from "node:assert/strict";
import { listings } from "../src/data/companies";
import { estimateForListing, estimateAll, type EstimateInput } from "../src/lib/pricing";
import { formatEur, formatRange } from "../src/lib/format";

const byId = (id: string) => {
  const l = listings.find((x) => x.id === id);
  if (!l) throw new Error(`missing ${id}`);
  return l;
};

const input = (over: Partial<EstimateInput> = {}): EstimateInput => ({
  hours: 2,
  slot: "weekday",
  includeCallOut: true,
  materials: 0,
  ...over,
});

test("KH-Suomi: weekday 2 h + conflicting call-out gives a range", () => {
  const r = estimateForListing(byId("kh-suomi-putki"), input());
  assert.equal(r.status, "ok");
  assert.deepEqual(r.labour, { min: 140, max: 140 });
  assert.deepEqual(r.callOut, { min: 20, max: 25 });
  assert.deepEqual(r.total, { min: 160, max: 165 });
});

test("KH-Suomi: evening uses the published evening hourly rate", () => {
  const r = estimateForListing(byId("kh-suomi-putki"), input({ slot: "evening", hours: 3 }));
  assert.deepEqual(r.labour, { min: 420, max: 420 });
});

test("Arina: 1 h weekday job is billed at the 2 h minimum", () => {
  const r = estimateForListing(byId("putkihuolto-arina"), input({ hours: 1 }));
  assert.equal(r.billedHours, 2);
  assert.deepEqual(r.labour, { min: 150, max: 150 });
  assert.deepEqual(r.total, { min: 184, max: 184 });
});

test("Arina: evening fixed fee includes 2 h – hourly rate not added on top", () => {
  const two = estimateForListing(byId("putkihuolto-arina"), input({ slot: "evening", hours: 2, includeCallOut: false }));
  assert.deepEqual(two.labour, { min: 499, max: 499 });
  const one = estimateForListing(byId("putkihuolto-arina"), input({ slot: "evening", hours: 1, includeCallOut: false }));
  assert.deepEqual(one.labour, { min: 499, max: 499 });
});

test("Arina: evening 4 h = fee + 2 extra hours at 138 €/h", () => {
  const r = estimateForListing(byId("putkihuolto-arina"), input({ slot: "evening", hours: 4, includeCallOut: false }));
  assert.deepEqual(r.labour, { min: 499 + 2 * 138, max: 499 + 2 * 138 });
});

test("Arina: weekend and holiday are 'alkaen' prices (open-ended max)", () => {
  for (const slot of ["weekend", "holiday"] as const) {
    const r = estimateForListing(byId("putkihuolto-arina"), input({ slot, hours: 3 }));
    assert.equal(r.labour?.min, 599 + 138);
    assert.equal(r.labour?.max, null);
    assert.equal(r.total?.max, null);
    assert.equal(r.total?.min, 599 + 138 + 34);
  }
});

test("Helsingin Putkimies Oy: no published price → no-data, never estimated", () => {
  const r = estimateForListing(byId("helsingin-putkimies-oy"), input());
  assert.equal(r.status, "no-data");
  assert.equal(r.total, undefined);
  assert.match(r.noDataReason ?? "", /Pyydä tarjous/);
});

test("Benchmark only covers weekday; evening has no data", () => {
  const day = estimateForListing(byId("remppatori-benchmark"), input({ hours: 2 }));
  assert.deepEqual(day.labour, { min: 110, max: 140 });
  assert.equal(day.callOut, undefined);
  assert.ok(day.excluded.some((e) => e.startsWith("Lähtömaksu")));
  const eve = estimateForListing(byId("remppatori-benchmark"), input({ slot: "evening" }));
  assert.equal(eve.status, "no-data");
});

test("Own materials estimate is added to the total", () => {
  const r = estimateForListing(byId("kh-suomi-putki"), input({ materials: 100, includeCallOut: false }));
  assert.deepEqual(r.total, { min: 240, max: 240 });
  assert.ok(!r.excluded.includes("Tarvikkeet ja varaosat"));
});

test("Excluding call-out lists it under excluded charges", () => {
  const r = estimateForListing(byId("putkihuolto-arina"), input({ includeCallOut: false }));
  assert.equal(r.callOut, undefined);
  assert.ok(r.excluded.some((e) => e.includes("34")));
});

test("estimateAll: priced companies first, then benchmark, then no-data", () => {
  const rows = listings.filter((l) => l.listingStatus === "active");
  const r = estimateAll(rows, input());
  assert.deepEqual(
    r.map((x) => x.listingId),
    ["kh-suomi-putki", "putkihuolto-arina", "remppatori-benchmark", "helsingin-putkimies-oy"],
  );
});

test("Candidate listings are never active", () => {
  for (const l of listings.filter((x) => x.lastVerified === null)) {
    assert.notEqual(l.listingStatus, "active", `${l.name} is unverified but active`);
  }
});

test("Euro formatting is Finnish", () => {
  assert.equal(formatEur(70).replace(/\s/g, " "), "70 €");
  assert.equal(formatEur(1.49).replace(/\s/g, " "), "1,49 €");
  assert.equal(formatRange(20, 25).replace(/\s/g, " "), "20–25 €");
  assert.equal(formatRange(599, null).replace(/\s/g, " "), "alkaen 599 €");
});
