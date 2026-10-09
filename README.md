# HelsinkiPutkimies.fi

Independent Finnish-language plumbing price and comparison site for Helsinki.
Next.js (App Router) · TypeScript · Tailwind CSS v4 · Lucide icons · Zod.

The site is an **information and comparison service, not a plumbing company**. It does
not employ plumbers, does not forward enquiries to companies, and no listing is paid.
All copy states this; keep it true if the business model changes (see *Changing the
business model* below).

---

## Setup

Requirements: Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local      # fill in the operator details
npm run dev                     # http://localhost:3000
```

Other scripts:

| Command | What it does |
|---|---|
| `npm run build` | Production build (also type-checks) |
| `npm run typecheck` | TypeScript only |
| `npm test` | Unit tests: calculator, enquiry API, data validation (28 tests) |
| `npm run verify-listings` | Checks company data for errors and stale prices |
| `npm run verify-listings -- --online` | Also checks that every source URL responds |

If you received the flat zip (all files at the root, folder names encoded as `__` in file
names), nothing extra is needed: `restore.mjs` runs automatically before `dev`, `build`,
`test` and `typecheck` and moves the files back into their folders. It does nothing when
the folders already exist.

No lockfile is included (see *Verification status*). The first `npm install` creates
`package-lock.json`; commit it.

## Deploying to Vercel

1. Push the project to a Git repository and import it in Vercel. Framework preset: Next.js.
2. Add the environment variables from `.env.example` (Settings → Environment Variables).
   `SITE_OPERATOR_*` are required before going public: the privacy notice must name the
   controller.
3. Domains: add `helsinkiputkimies.fi` and `www.helsinkiputkimies.fi`, and set www to
   redirect to the apex domain (canonical URLs use the apex).
4. Deploy, then submit `https://helsinkiputkimies.fi/sitemap.xml` in Google Search Console.

## Project structure

```
src/
  app/                        Routes (one folder per page)
    page.tsx                  Etusivu
    putkimies-helsinki/       Putkimies Helsingissä
    putkimiehen-hinnat/       Hinnat + hinta-arviolaskuri (#laskuri)
    putkiliikkeiden-vertailu/ Searchable/filterable comparison
    putkipalvelut/            Services index + [slug] (9 service pages)
    paivystava-putkimies/     Emergency page (10th service page)
    usein-kysytyt-kysymykset/ FAQ (only page with FAQPage schema)
    tarjouspyynto/            Enquiry form + contact
    tietosuojaseloste/        Privacy notice incl. cookies
    tietoa-sivustosta/        How listings are chosen and prices verified
    api/tarjouspyynto/        Enquiry POST endpoint
    sitemap.ts, robots.ts
  data/
    companies.ts              ← ALL company and price data lives here
    types.ts                  Data model
  content/
    services.ts               Service page content (Finnish)
    faq.ts                    General FAQ
  lib/
    pricing.ts                Calculator logic
    lead-schema.ts            Form validation (shared by browser and server)
    lead-handler.ts           Spam checks, rate limit, validation
    lead-delivery.ts          ← integration point for email / CRM / database
    listing-validation.ts     Data checks used by tests and the verify script
  components/                 UI
scripts/verify-listings.ts
tests/
```

## Updating prices (Hintojen päivittäminen)

All prices are in `src/data/companies.ts`. Every page, the calculator, the FAQ answer
about hourly rates and the sitemap read from that file, so one edit updates the site.

1. Open the company's own price page (listed in `sources`).
2. Update the values. Each price field has a `status`:
   - `confirmed`: read from the company's own site.
   - `conflicting`: the company's own pages disagree. Enter a `{ min, max }` range and
     explain in `note`. (Example: KH-Suomi Putki's homepage says 25 € service fee, its
     price list says 20 €.)
   - `estimate`: market benchmarks only. **Never** use for a company.
   - `unavailable`: not published. The site then shows *Pyydä tarjous*. Do not guess.
3. Fixed emergency fees go in `emergency.value` with `includedHours` and `extraHourly`.
   The calculator never adds the hourly rate on top of included hours. Use
   `amountIsFrom: true` for *alkaen* prices.
4. Set `lastVerified` to today (`YYYY-MM-DD`).
5. Run `npm run verify-listings && npm test` before deploying.

The verify script warns when data is older than 90 days (`MAX_AGE_DAYS` in
`src/lib/listing-validation.ts`). It fails on structural errors such as an active row
without a verification date, a sponsored row without a disclosure, or a price marked
confirmed with no value. It can be run in CI.

### Adding a company

Add an entry with `listingStatus: "candidate"` first. It is not shown publicly. Switch to
`"active"` only after confirming the company exists (e.g. Y-tunnus in YTJ) and recording
its sources and `lastVerified`.

### Current data (verified 9 October 2026)

| Listing | Status | Notes |
|---|---|---|
| KH-Suomi Putki | active | 70 €/h weekdays; evening 140 €/h; weekend and holidays 175 €/h; service fee 20 € or 25 € (sources conflict); incl. VAT 25.5 % |
| Putkihuolto Arina | active | 75 €/h weekdays, 2 h minimum; call-out 34 €; evening 499 € incl. 2 h; Sat 599 €; Sun/holidays from 599 €; extra hours 138 €/h; 1.49 €/km |
| Helsingin Putkimies Oy | active | Y-tunnus 1843003-3; no prices published, so "Pyydä tarjous" |
| Remppatori benchmark | active | 55–70 €/h indicative; VAT status not stated |
| Töölön Putkiliike Oy | candidate | Not found in public sources. Verify before activating |
| Herttoniemen LVI-Huolto Oy | candidate | Not found in public sources. Verify before activating |

## Enquiry form

The form (`/tarjouspyynto`) validates in the browser and again on the server with the
same Zod schema, and all messages are in Finnish.

**What happens on submit depends on configuration, and the UI says which:**

| Configuration | Behaviour | Button / success text |
|---|---|---|
| Nothing configured, production | Nothing stored or sent. The user gets a formatted enquiry to copy and send to the company they choose. | "Laadi tarjouspyyntö" / "Tarjouspyyntösi on valmis" |
| Nothing configured, `npm run dev` | Same, plus the enquiry is written to `.data/leads.jsonl` (git-ignored) so you can test the pipeline. A notice says it was not sent. | same + "Kehitystila" notice |
| `RESEND_API_KEY` + `LEAD_TO_EMAIL` + `LEAD_FROM_EMAIL` | A copy is emailed to the operator (plain text, reply-to = user). | "Lähetä tarjouspyyntö" / "Tarjouspyyntö lähetetty" |
| `LEAD_WEBHOOK_URL` (+ `LEAD_WEBHOOK_SECRET`) | JSON POST to your CRM, Make, Zapier or API. | same as above |

"Lähetetty" is shown only when the email or webhook call actually succeeds. The optional
marketing consent checkbox appears only when enquiries are delivered to the operator,
since otherwise nothing is stored to market to. The privacy notice adapts to the
configured channels.

To add a database or another CRM, add a channel in `deliverLead()` in
`src/lib/lead-delivery.ts`.

**Spam protection:** hidden honeypot field, minimum 3-second fill time, same-origin check,
20 kB body limit, and 5 requests per 10 minutes per IP. The rate limiter is in-memory and
per server instance; for stricter limits add a Vercel Firewall rule or an Upstash Redis
limiter in `src/lib/rate-limit.ts`. Personal data is never written to server logs.

**Photo attachments are not implemented.** Doing this securely needs file storage,
virus/type checks and a retention policy. The success screen tells users to attach photos
when they send the enquiry to the company.

### Changing the business model

If you later forward enquiries to plumbers:

1. Sign agreements with them and set `acceptsForwardedLeads: true` on those listings.
2. Add a company selector and a **separate, explicit consent** to share data with that
   company to the form.
3. Update the privacy notice (recipients, legal basis), the form text, and the
   "Tietoa sivustosta" page.
4. If any arrangement is paid, set `sponsored: true` with a `sponsorDisclosure`. The
   label is then shown in every table and the site-wide "no paid listings" statements
   change automatically.

## SEO

- Unique Finnish title, description, canonical and Open Graph tags per page (`src/lib/seo.ts`).
- `sitemap.xml` and `robots.txt` (the API is disallowed).
- BreadcrumbList on all subpages and WebSite on the home page.
- FAQPage only on the FAQ page.
- **No LocalBusiness or Service schema**, by design: the operator does not provide plumbing
  services and has no verified address. Add `Organization` details through the
  `SITE_OPERATOR_*` variables.
- Redirects for common short URLs (`/hinnat`, `/vertailu`, `/ukk`, `/yhteystiedot`) are in
  `next.config.ts`.

## Cookies and analytics

No cookies, analytics or third-party scripts. Fonts are self-hosted by `next/font`, so no
consent banner is needed. If you add analytics, add a consent mechanism first and update
section 7 of the privacy notice.

## Images

The hero uses the live price slip instead of a stock photo. No licensed plumbing
photography was available, and a generic stock photo implies a business the site isn't.
To add photos, place licensed files in `public/images/`, render them with `next/image`
and Finnish `alt` text, and note the licence in this README.

## Before going live

- [ ] Fill in `SITE_OPERATOR_NAME`, `SITE_OPERATOR_BUSINESS_ID`, `SITE_OPERATOR_EMAIL` and
      `SITE_OPERATOR_ADDRESS`. This is legally required for the privacy notice.
- [ ] Re-verify all prices and update `lastVerified`, then run `npm run verify-listings -- --online`.
- [ ] Verify or remove the two candidate companies.
- [ ] Decide on enquiry delivery (none / Resend / webhook) and set credentials.
- [ ] Run `npm install && npm run build && npm test` and commit the lockfile.
- [ ] Consider telling the listed companies that they appear in the comparison.

## Verification status

This project was written in an environment where the npm registry was blocked, so
`npm install` and `next build` could **not** be run there. The following was verified
instead:

- **28 unit tests pass**: calculator maths for every provider and time slot, enquiry API
  (validation, honeypot, timing, origin, rate limit, body size, dev/production/webhook
  delivery), and data validation.
- **Strict TypeScript check passes** (`strict`, `noUnusedLocals`) for all project code,
  using local React and Next type stubs.
- **Every page was rendered** with React 19.2 and Tailwind CSS 4.3 through a test harness
  and checked in Chromium at 360 px and 1440 px. All 19 routes (including the 10 service
  pages) return 200, unknown routes return 404, and there is no horizontal scrolling, no
  hydration or console errors, exactly one H1 per page, no skipped heading levels, unique
  titles and descriptions, and all internal links and anchors resolve.
- **Interactive flows were tested in the browser**: calculator results, form validation
  and success, table search/filter/sort/empty state, mobile menu, skip link.

Package versions use caret ranges (`next ^16`, `react ^19.2`, `tailwindcss ^4.1`,
`lucide-react ^0.544`, `zod ^3.25`). Run `npm run build` once after installing. If it
reports anything, it will most likely be a framework-version detail rather than
application logic.
