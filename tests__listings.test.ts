import { test } from "node:test";
import assert from "node:assert/strict";
import { listings } from "../src/data/companies";
import { validateListing } from "../src/lib/listing-validation";
import { services } from "../src/content/services";

test("company data has no validation errors", () => {
  const errors = listings.flatMap((l) => validateListing(l, new Date("2026-10-09"))).filter((i) => i.level === "error");
  assert.deepEqual(errors, []);
});

test("validator catches an active listing without verification date", () => {
  const broken = { ...listings[0]!, lastVerified: null };
  assert.ok(validateListing(broken).some((i) => i.level === "error"));
});

test("validator flags stale data after 90 days", () => {
  const issues = validateListing(listings[0]!, new Date("2027-03-01"));
  assert.ok(issues.some((i) => i.level === "warning" && /päivää sitten/.test(i.message)));
});

test("validator rejects sponsored rows without disclosure", () => {
  const sponsored = { ...listings[0]!, sponsored: true };
  assert.ok(validateListing(sponsored).some((i) => /sponsorDisclosure/.test(i.message)));
});

test("every service has distinct content and valid related links", () => {
  const intros = new Set(services.map((s) => s.intro));
  assert.equal(intros.size, services.length);
  const slugs = new Set(services.map((s) => s.slug));
  for (const s of services) {
    assert.ok(s.metaDescription.length <= 160, `${s.slug} meta description too long (${s.metaDescription.length})`);
    assert.ok(s.metaTitle.length <= 70, `${s.slug} title too long (${s.metaTitle.length})`);
    for (const r of s.related) assert.ok(slugs.has(r), `${s.slug} → ${r}`);
  }
});
