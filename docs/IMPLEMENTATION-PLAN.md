# Implementation plan: legally sound production operation + detailed user tracking

**Basis:** [`AUDIT-REPORT.md`](./AUDIT-REPORT.md) (findings R-/S-/N-/A-/C-…) and [`TRACKING-CONCEPT.md`](./TRACKING-CONCEPT.md) (the full tracking design).
**Working process:** structured via [bradtraversy/ai-blueprint](https://github.com/bradtraversy/ai-blueprint) — see the "Working process with ai-blueprint" section below.

---

## 0. Target picture and guard rails

1. **Legal certainty before features.** An imprint and a privacy policy are a precondition for going live — and for any tracking too (the privacy policy has to describe the tracking *before* it goes live).
2. **"Collect as much as possible" is implemented as a two-tier model.** Maximally detailed click tracking is achievable — but legally only like this:
   - **Tier 1 (all visitors, without consent):** cookieless, anonymous measurement of *every* click/event — nothing stored on the device, no recognition across visits (§ 25 TDDDG does not apply; legal basis Art. 6(1)(f) GDPR). This yields **full click statistics without a single consent click.**
   - **Tier 2 (only after opt-in):** persistent visitor IDs, cross-visit journeys, session replay. Realistically only a fraction of visitors to a portfolio page will consent — tier 2 is a bonus, not the data foundation.
   - A "collect everything without asking" (persistent IDs/fingerprinting without consent) would be clearly unlawful in Germany (§ 25 TDDDG, Art. 5/6 GDPR) and will not be built.
3. **Small, verifiable steps** — every phase ends with a green `pnpm lint && pnpm build` and a commit; the legal features block completion as P1 findings (ai-blueprint gate).

---

## Phase 1 — Legal basis (P0, ~1 day + input from the operator)

> Closes R-01, R-02, R-03 (part 1), R-04. **Without this phase there is no going live.**

| # | Step | Files | Effort |
|---|---|---|---|
| 1.1 | **Footer component** with the links "Impressum · Datenschutz · Cookie-Einstellungen", hooked into `app/layout.tsx` (so it appears on all routes including `/projects/*`, `/references/*`) | `components/notion/footer.tsx`, `app/layout.tsx` | S |
| 1.2 | **Imprint page** in the site design. Mandatory details (freelancer): name, address at which service can be effected, email + phone, VAT ID (if one exists; it does not apply under § 19 UStG), VSBG note. The `robots` meta stays indexable | `app/imprint/page.tsx` | S |
| 1.3 | **Privacy policy page**: controller; hosting/server logs (Art. 6(f), retention period, DPA note on the host); contact; **appointment booking via Notion** (calendar.notion.so, third-country transfer, check DPF status); **references/testimonials** (legal basis, withdrawal); data-subject rights Art. 15–21, 77; a note that "fonts are hosted locally, no connection to Google" | `app/privacy/page.tsx` | M |
| 1.4 | **Decommission the cookie banner** (interim state until phase 2): remove the banner or reduce its text to the truth — no sham toggles. *Alternatively go straight on to phase 2 and make the banner real in one go.* | `components/notion/cookie-banner.tsx`, `app/page.tsx` | S |
| 1.5 | **Obtain/confirm the consents of the 6 referrers** (email is enough) and archive them **outside the repo** (Art. 7(1)). Record the removal process: on withdrawal, delete the entry from `lib/references.json` → the route returns 404; soften the "never change/never remove" comment in `lib/data.ts` | organisational + `lib/data.ts` | M (operator input) |
| 1.6 | **Review the CV PDFs**: the reference quotes/client mentions they contain have to be covered by 1.5 | `public/cv/` | S (operator input) |

**Input needed from the operator:** address, VAT ID/small-business status, host name (for the DPA section), referrer contacts.

---

## Phase 2 — Consent architecture + tracking tier 1 (P0/P1, ~2–3 days)

> Implements [`TRACKING-CONCEPT.md`](./TRACKING-CONCEPT.md) (which holds the full rationale, code sketches and event taxonomy). Closes R-03 (part 2), R-07, A-10.

**Tool decision (recommendation from the concept):** **self-hosted Umami** (Docker + Postgres, e.g. on Hetzner — fits the existing stack). Cookieless by default, visitor hash with a daily rotating salt → usable without consent, no DPA, no third-country assessment, no licence costs, declarative event tracking. Alternatives and criteria: concept, section 2.

| # | Step | Core |
|---|---|---|
| 2.1 | **Consent module** `lib/analytics/consent.ts` | A versioned `ConsentState` object (instead of an `"all"/"none"/"customized"` string), `readConsent()`/`writeConsent()` with schema validation, CustomEvent `np:consent`. Storing it is itself compliant with § 25(2) no. 2 TDDDG |
| 2.2 | **Banner rebuild** `cookie-banner.tsx` | Real persistence of the toggles; **corrected text** ("Diese Website misst die Nutzung cookielos und anonym. Optional: erweiterte Analyse — nur mit Ihrer Einwilligung."); "Ablehnen" stays equally weighted; `aria-label` on the toggles (A-10); the footer link "Cookie-Einstellungen" reopens the banner with pre-filled values (withdrawal, Art. 7(3)) |
| 2.3 | **Set up Umami** | Docker container + Postgres on an EU server; website ID as `NEXT_PUBLIC_UMAMI_ID` |
| 2.4 | **First-party proxy** `app/api/a/[...path]/route.ts` | Script + collect endpoint under our own domain; **deliberately no IP forwarding** (no X-Forwarded-For) → Umami never sees client IPs. Next 16 convention: `RouteContext` helper, awaited `params` |
| 2.5 | **AnalyticsProvider** in `app/layout.tsx` | A small client island; the Umami `<Script>` always loads (tier 1, no consent needed); the tier-2 script is only **rendered** once `analytics: true` (next/script semantics: the strategy controls *when*, rendering controls *whether*) |
| 2.6 | **`track()` utility + instrumentation** | A central `lib/analytics/track.ts`; **declarative** via `data-analytics-event`/`data-analytics-prop-*` attributes plus a global delegated click listener (server components stay server components; `grep data-analytics-event` = the complete instrumentation map). Explicit hooks only for search (debounced), scroll depth, engagement time (`sendBeacon` on `pagehide`) and web vitals (`useReportWebVitals`) |
| 2.7 | **Extend the privacy policy** | A section on the tier-1 measurement (Art. 6(f), no cookies, right to object) — deploy it **before** activating the tracking |

**Event taxonomy (excerpt — the full table with code anchors is in the concept, section 3):**

| Event | Trigger | Properties |
|---|---|---|
| `cv_download` | CV menu entry | `cv_lang: de/en`, `placement: topbar/hero` |
| `booking_click` | "Erstgespräch buchen" | `placement: topbar/intro_callout` |
| `project_open` / `reference_open` / `certificate_open` | cards | `slug`, `source` |
| `skills_search` / `gallery_search` | search fields (debounced) | `query_length`, `result_count`, `matched_categories` — **never the raw query** (PII risk, quasi-identifier) |
| `toc_navigate`, `outbound_click`, `scroll_depth`, `engagement_time`, `web_vitals`, `consent_decision` | see the concept | bucketed, without any personal reference |

**Data minimisation (binding):** no IP storage (the proxy strips them), referrer only as a domain, time/vitals values bucketed, a property allowlist in `track()`, retention periods per the concept (raw events 14 months, access logs 7 days, consent logs 3 years).

---

## Phase 3 — Security hardening & operational readiness (P1, ~1 day)

> Closes S-01…S-05, N-02.

| # | Step | Detail |
|---|---|---|
| 3.1 | **Next update** | `pnpm up next@16.2.11 eslint-config-next@16.2.11` → 9 CVEs closed; then `pnpm build` + smoke test. Take the React/lucide-react patch drift along at the same time |
| 3.2 | **pnpm overrides** in `pnpm-workspace.yaml` | `postcss: '>=8.5.12'`, `sharp: '>=0.35.0'` (**not** fixed along by 16.2.11); `pnpm audit` has to be empty afterwards; check for build regressions (next pins postcss exactly on purpose) |
| 3.3 | **CI + Dependabot** | `.github/workflows/ci.yml` (`pnpm install --frozen-lockfile && pnpm lint && pnpm build`) + `.github/dependabot.yml` (npm, weekly, grouped minor/patch). *The most important structural measure of the audit* |
| 3.4 | **Security headers** in `next.config.ts` via `headers()` | CSP following the "Without Nonces" pattern from the Next 16 docs (static page → **no** nonce setup, that would force dynamic rendering): `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests` + `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a restrictive `Permissions-Policy`. After phase 2, extend the CSP with the Umami proxy paths (it stays 'self' — the advantage of the first-party proxy). HSTS: Vercel sets it automatically; when self-hosting, in the reverse proxy |
| 3.5 | **`poweredByHeader: false`** | one line in `next.config.ts` |
| 3.6 | **Error pages** | `app/not-found.tsx` (German, in the site design, link to the home page), `app/error.tsx` (`unstable_retry`), `app/global-error.tsx` (its own `<html>/<body>`) |

---

## Phase 4 — SEO & acquisition impact (P1, ~1 day)

> Closes N-01, C-02, parts of C-07.

1. `metadataBase` + `openGraph`/`twitter` blocks in `app/layout.tsx`; `title.template` for the slug pages.
2. `app/opengraph-image.tsx` via `ImageResponse` (1200×630, analogous to `icon.tsx`/the CoverBanner design) → link previews on LinkedIn and elsewhere with an image.
3. `app/sitemap.ts` + `app/robots.ts`, generated from `projects`/`references` in `lib/data.ts` (they can never diverge).
4. A JSON-LD `Person`/`ProfessionalService` schema (guide `json-ld.md`).
5. **Fix the profile links** (C-02): enter the real Malt profile URL (already in `references.json`) and the real freelancermap profile URL — right now prospects land on the portals' home pages.
6. Optional: build in the second CV button promised in the README (the "hero" variant exists as dead code) next to the intro callout — a conversion element.

---

## Phase 5 — Performance & accessibility (P2, ~2 days)

> Closes N-03, A-01, A-02, A-04, A-05, A-06, A-08, A-09, A-17.

1. **Images:** drop `images.unoptimized`, move all 6 `<img>` sites to `next/image` with static imports + `sizes` (the covers are then delivered automatically as AVIF/WebP at card size; ~70–80 % saving on the ~944 KB of cover payload).
2. **Extract a ModalShell** (A-04) and solve focus management along the way (A-01): the native `<dialog>`/`showModal()` or Radix Dialog → focus trap, initial focus, focus restoration and ESC in one place. While at it, move the interception routes to server components with `generateStaticParams` (N-04) and `notFound()` for an unknown slug (A-17).
3. **Fix the contrasts** (A-02): accent for text on white ~`#b5651d`, raise `--notion-text-gray`; colour pairs as token pairs in `globals.css`/`@theme` (which solves A-13 along with it).
4. **Gallery hook** `useGallery<T>` + `GalleryGrid`/`EmptyState` (A-05).
5. **Clean up the fake toolbar** (A-06): remove Expand/Add sort/Delete sort, either wire the filter popover to the search for real or drop it; add `aria-expanded`/`aria-haspopup`/ESC.
6. **Heading hierarchy** (A-08): the name as the only `h1`; the TOC openable by keyboard (A-09); German aria-labels (A-11); the CV dropdown without `role="menu"` (A-12).

---

## Phase 6 — Hygiene & polish (P3, ~½ day, parallelisable)

- Delete 19 unused assets (~700 KB, including "LinkedIn Banner-selection.png"); optionally a CI check of public↔code references (C-01, C-11).
- Validate the `references.json` import with Zod, or move it to `.ts` with `satisfies` (A-03); a build assertion for `projectSlug`.
- Tighten ESLint/TS: typescript-eslint strict, jsx-a11y, `noUncheckedIndexedAccess`, a `typecheck` script (A-14).
- Odds and ends: the dead export `referenceHref`, quotation marks, "Munich"→"München", "Eckdaten" into the TOC, render `verifyUrl`, link the project meta, make "15 Monate" dynamic, update the README (A-15–A-16, C-03–C-10).

## Phase 7 — Optional: tracking tier 2 (only on real demand)

PostHog EU cloud (Frankfurt) rendered **exclusively after opt-in**; an in-memory event queue (never localStorage before consent!); a consent-logging endpoint `app/api/consent/route.ts` (a UUID record without IP/UA, 3 years); withdrawal deletes the `ph_*` keys + reloads; a DPA with PostHog and a third-country note in the privacy policy. **Recommendation from the concept:** decide only after 4 weeks of tier-1 data whether it is worth it — for a portfolio page tier 1 delivers nearly all of the insight.

---

## Working process with ai-blueprint

[ai-blueprint](https://github.com/bradtraversy/ai-blueprint) (Brad Traversy; "A repeatable process for coding with AI while being the architect of your project") is not an npm runtime package but a set of Markdown skills/templates that enforces a review-driven AI working process — as a counter-proposal to "vibe coding". Its four core principles: **specification before implementation** (the spec stops for approval), **small reviewed diffs**, **file-based state** (survives any context reset; `/status` replaces lost chat history) and a **findings ledger with authority** (P0/P1 findings block every merge until they are re-reviewed or deliberately accepted).

### Why it fits here

- The **findings ledger + P0/P1 gate** turns this audit report into machine-trackable state with *enforced* follow-through — instead of a to-do list that quietly fizzles out. Entered as P1, the imprint/privacy items block every feature merge until they are fixed **and closed by a re-audit**. That is exactly what is wanted here.
- The **file-based state** suits Claude Code sessions spread over several days.
- The phases of this plan are cleanly feature-sized outcomes in the sense of the `build-plan` template.

### Installing it into this repo

Point of conflict: `CLAUDE.md` (which contains only `@AGENTS.md`) and `AGENTS.md` (which contains the **critical Next 16 note** "This is NOT the Next.js you know") already exist. Strategy: take the blueprint versions, then re-anchor the note.

```bash
git checkout -b chore/ai-blueprint
cp AGENTS.md AGENTS.local.bak.md && cp CLAUDE.md CLAUDE.local.bak.md   # 1. back up
npx create-ai-blueprint@latest --claude                                # 2. install (Claude adapter)
# confirm overwriting AGENTS.md/CLAUDE.md; non-interactive: --force ONLY after a backup
```

3. **Re-integrate the Next 16 note** — in two places: as its own section at the top of the new `AGENTS.md` **and** in `blueprint/context/coding-standards.md` (which the new `CLAUDE.md` loads into every session via an `@` import). Delete the backups, commit everything (recommended: commit the blueprint files so the findings history stays traceable in the repo).

4. **Onboarding for an existing project:**

```
/onboard   # stack detection (pnpm lint, pnpm build; no test runner)
/adopt     # brownfield bootstrap: records the finished portfolio as "shipped" instead of trying to build it
/doctor    # read-only consistency check
/overview  # generates blueprint/context/project-overview.md from the plans
```

### Mapping the audit results into the blueprint

**`blueprint/build-plan.md`** — the phases of this plan as numbered features (completed items are never renumbered):

```markdown
## MVP (existing, recorded via /adopt)
- [x] 1. **Notion résumé page** - layout, projects, skills database, CV download DE/EN

## Legal & tracking
- [ ] 2. **Imprint** - static route /imprint + footer, mandatory details for a freelancer
- [ ] 3. **Privacy policy** - route /privacy, linked from the footer and the cookie banner
- [ ] 4. **Consent gate + tracking tier 1** - real consent state, Umami self-hosted, track() utility
- [ ] 5. **Security hardening** - Next 16.2.11, overrides, CI/Dependabot, headers, error pages
- [ ] 6. **SEO/OG** - metadataBase, opengraph-image, sitemap, robots, profile links
- [ ] 7. **A11y & performance** - ModalShell+focus, contrasts, next/image
```

**`blueprint/context/findings.md`** — the P0/P1 findings from the report in the documented ledger format (`### F-NN [severity] status - title`; severities: P0 = data loss/security, P1 = probable bug/high risk, P2 = maintainability, P3 = cleanup; status: `unverified/open/fixed/closed/accepted/invalid`). Either `/audit full` enters them itself (referencing this report as input) or you do it by hand:

```markdown
### F-01 [P1] open - Missing imprint (R-01)
- Location: app/ (no /imprint route), no footer
- Proposal: feature 2 in the build plan

### F-02 [P1] open - Missing privacy policy (R-02)
### F-03 [P1] open - Cookie banner misleading & non-functional (R-03)
### F-04 [P1] open - next@16.2.10 with 9 known CVEs (S-01)
### F-05 [P2] open - Modal without focus management (A-01)
…
```

The important thing about the gate: a P0/P1 finding fixed via `/implement` stays blocking (`fixed`) until another `/audit` pass sets it to `closed` — no quiet fizzling out.

**The cycle per feature:**

```
/feature        → spec for the next open item (stops for approval)
/implement      → builds in small, approved steps
/check          → proves the success criteria
/audit current  → re-review, sets the associated findings fixed → closed
/complete       → archives, commits, merges (blocks on open P0/P1)
```

In between: `/fix "…"` for the unplanned, `/status` after context resets.

### Limits (an honest assessment)

For a static portfolio with a single developer the full ceremony is noticeable overhead — the loop pays for itself once features stop fitting into a single session. Recommendation: **use the ledger + build plan as a binding scaffold** (the gate enforces the legal topics), run the loop pragmatically, and skip `/tests` (only worthwhile for the consent logic), `/release` and `/autopilot` for now. Re-run `/overview` on every change of plan (`/doctor` checks it).

---

## Order & effort (overview)

| Phase | Content | Effort | Dependency |
|---|---|---|---|
| 1 | Imprint, privacy policy, banner interim, reference consents | ~1 day + operator input | — (**before going live**) |
| 2 | Consent gate, Umami, track(), instrumentation | ~2–3 days | phase 1 (privacy policy first) |
| 3 | Next update, overrides, CI/Dependabot, headers, error pages | ~1 day | — (can run parallel to 1) |
| 4 | Metadata/OG/sitemap, profile links | ~1 day | — |
| 5 | Images, ModalShell+focus, contrasts, dedup, toolbar | ~2 days | sensible after 3 |
| 6 | Assets, validation, lint rules, odds and ends | ~½ day | — |
| 7 | (Optional) PostHog tier 2 + consent logging | ~1 day | phase 2 + 4 weeks of data |

**Total: ~7–9 working days** for phases 1–6; after that the site runs legally sound, hardened, more accessible and SEO-effective — and from phase 2 on it delivers full click statistics for every button, GDPR-compliant and very largely without a consent hurdle.
