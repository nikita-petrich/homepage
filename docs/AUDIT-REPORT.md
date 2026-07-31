# Audit report: security, code quality, architecture & GDPR

**Project:** nikita-petrich/homepage · Next.js 16.2.10 (App Router, TypeScript, Turbopack), React 19.2.4, Tailwind CSS v4
**As of:** 2026-07-24
**Occasion:** the website is to be used productively for freelance work.

> **Note:** this report is a technical analysis and is no substitute for legal advice. The legal assessments (GDPR, DDG, TDDDG, UWG) describe the customary, well-documented legal situation for commercial German websites.

---

## 1. Management summary

For a project of this size the codebase is **technically sound** (lint and typecheck clean, production build clean, correct parallel/intercepting routes, no XSS vectors, no secrets in the repo, fonts self-hosted). **In its current form it is not, however, suitable for production use as a business website** — the most serious problems are legal, not technical:

| # | Top risk | Severity |
|---|---|---|
| 1 | **No imprint** (§ 5 DDG) — actionable by warning letter, fine of up to €50,000 possible | 🔴 Critical |
| 2 | **No privacy policy** (Art. 13 GDPR) — actionable by warning letter | 🔴 Critical |
| 3 | **The cookie banner is a dummy**: claims analytics cookies that do not exist; the user's choice is discarded and evaluated nowhere (misleading, § 5 UWG / Art. 5 GDPR) | 🟠 High |
| 4 | **References name six third parties by their real names** — consent documented nowhere | 🟡 Medium |
| 5 | **Next.js 16.2.10 with 9 known CVEs** — patch 16.2.11 available (only exploitable to a limited degree in this concrete setup) | 🟡 Medium |
| 6 | **No CI, no Dependabot/Renovate** — the structural cause of risk 5 | 🟡 Medium |
| 7 | **Modal dialogs without focus management, WCAG contrast violations** — partly unusable for keyboard/screen-reader users | 🟠 High |
| 8 | **No OG/SEO metadata, no sitemap** — link previews (LinkedIn!) without an image, a disadvantage for acquisition | 🟠 High |

**Findings overview (after verification):** 2 critical · 7 high · 21 medium · 23 low · 24 notes/positive findings — consolidated in this report into ~45 distinct findings.

**On the desired tracking:** detailed event tracking ("every button click") is feasible — but "collect as much as possible about the users" collides head-on with the GDPR (data-minimisation principle, Art. 5(1)(c)) and § 25 TDDDG (consent requirement for device access). The legally safe maximum build-out is a **two-tier model**: cookieless, anonymous measurement of *all* interactions without consent (tier 1) plus optional, consent-based profiling/session replay (tier 2). Details: [`TRACKING-CONCEPT.md`](./TRACKING-CONCEPT.md), implementation: [`IMPLEMENTATION-PLAN.md`](./IMPLEMENTATION-PLAN.md).

---

## 2. Methodology

- **Multi-agent audit** across 6 dimensions (security, Next.js 16 best practices, architecture/quality, GDPR/law, dependencies/repo hygiene, content/assets), each with a full code read-through.
- **Framework statements were checked against the version-exact Next.js 16 docs** (`node_modules/next/dist/docs/`), not against training knowledge — as required by the project rule in `AGENTS.md`.
- **Tools:** `pnpm audit`, `pnpm outdated`, `pnpm lint`, `tsc --noEmit`, production build, systematic asset-reference reconciliation, WCAG contrast calculation.
- **Adversarial verification:** every finding was meant to be refuted by a separate reviewing agent. The security dimension and parts of the best-practices dimension were fully verified (severity corrections are incorporated, e.g. Next CVEs high→medium because the attack surface is unreachable). For some of the remaining findings the automated verification dropped out (API limit); the critical and high findings among them were re-checked manually against the code and confirmed (imprint/privacy policy missing, cookie-banner behaviour, modal focus, TOC hover, type assertion in `lib/data.ts:538`).

**Severity scale:** 🔴 critical (legal/production risk, fix immediately) · 🟠 high · 🟡 medium · 🔵 low · ⚪ note/info · ✅ positive finding.

---

## 3. Law & GDPR

### R-01 🔴 No imprint (§ 5 DDG)

**Finding:** there is no `/imprint` route, no footer, not a single hit for "Impressum" anywhere in the source. Route inventory: only `/`, `/projects/[slug]`, `/references/[slug]` (`app/page.tsx:155-157` ends without a footer). The site is unambiguously commercial (hourly rate "80 €/h" in `lib/data.ts:32`, CTA "Erstgespräch buchen") — so the imprint obligation applies. A missing imprint is a regulatory offence (fine of up to €50,000, § 33 DDG) and a classic reason for a warning letter. Particularly unfortunate: the site advertises itself as "DSGVO-konform" and "DSGVO by Design" (`lib/data.ts:90-92, 394`).

**Recommendation:** create `app/imprint/page.tsx` and link it from **every** page "easily recognisable, directly accessible and constantly available" (footer in the root layout, so the slug routes are covered too). Mandatory details for a freelancer (sole trader, not chamber-regulated):

1. Full first and last name
2. Address at which service can be effected (street, number, postcode, town — no PO box)
3. A means of rapid electronic contact: email **and** one further channel (e.g. phone) — both are already in `lib/data.ts:22-23`
4. VAT ID under § 27a UStG, if one exists (it does not apply under the small-business rule, § 19 UStG)
5. No chamber/professional-law details needed ("Fachinformatiker" is not a regulated title), no commercial-register details
6. Recommended: statement on (non-)participation in consumer arbitration (§ 36 VSBG) — dispensable for pure B2B

*Effort: S (the page) — the address has to come from the operator.*

### R-02 🔴 No privacy policy (Art. 13 GDPR)

**Finding:** neither a `/privacy` route nor any link to one. Even without analytics the website processes personal data that has to be disclosed: server logs/hosting (IP addresses), contact taken up (`mailto:`/`tel:`), the redirect to appointment booking at **Notion** (`calendar.notion.so`, a US provider — the prospect enters name/email there), and the cookie banner's localStorage entry. That the banner actively claims "analytics" without anyone stating who the controller is aggravates the transparency violation (Art. 5(1)(a), Art. 12 f. GDPR).

**Recommendation:** `app/privacy/page.tsx` with at least: controller (= imprint data); hosting/server logs (legal basis Art. 6(1)(f), retention period, DPA with the host); contact; appointment booking via Notion including a third-country transfer note (EU-US Data Privacy Framework — check Notion's certification); references/testimonials (see R-04); data-subject rights (Art. 15–21, 77). Extend accordingly once tracking is introduced (the mandatory contents are in `TRACKING-CONCEPT.md`, section 6). *Effort: M.*

### R-03 🟠 Cookie banner: misleading and non-functional

**Finding (`components/notion/cookie-banner.tsx`):**
- The text claims: "Diese Website verwendet Cookies, um die Nutzung zu analysieren…" (l. 57–59). **Factually wrong:** there is no `document.cookie` anywhere in the repo, no analytics script, no third-party embeds (verified by grepping for `gtag|plausible|matomo|umami|posthog|sendBeacon|<script|iframe`).
- The granular preferences (functional/analytics/marketing) from the "Anpassen" panel are **never stored**: `dismiss()` only writes the string `"all"/"none"/"customized"` (l. 34–42), the `prefs` object is discarded (l. 52).
- **No code reads the consent value** — "Alle akzeptieren" and "Ablehnen" lead to identical behaviour.
- **No way to withdraw:** after the first decision the banner never reappears; there is no "Cookie-Einstellungen" link (Art. 7(3) GDPR requires withdrawal to be as easy as giving consent — relevant as soon as real tracking arrives).

A consent banner with no processing behind it is (a) a misleading commercial practice carrying UWG warning-letter risk, (b) a transparency violation and (c) a dark-pattern anti-pattern. **Positive:** "Ablehnen" sits with equal weight next to "Alle akzeptieren" (a first level in line with the DSK guidance) — that is preserved in the rebuild.

**Recommendation:** either remove the banner while no tracking is running — or (recommended, since tracking is wanted) rebuild it straight into a real consent gate (plan, phase 2). *Effort: S (remove) / M (rebuild).*

### R-04 🟡 References: real names of third parties without a documented legal basis

**Finding:** `lib/references.json` contains the name, position, company and detailed quotes of **six identifiable people** (Suraj Kakar, Daniel Kmiotek, Harry Diwert, Ahmed Buraa Hameed, Behdad Tabrizi, Serghei Granici). These are served under permanent URLs `/references/<slug>` and actively lifted into SEO metadata (`app/references/[slug]/page.tsx:21-22` sets `Referenz von ${name}` as the `<title>` — the names become indexable by search engines). The quotes come from LinkedIn/Malt; **republishing them on one's own commercial website is a processing operation in its own right** that needs its own legal basis (where a name is used for advertising, consent is the safe route). No consent documentation is discernible in the repo. Making it worse: the code comment "the slug is a permanent route and must never change once published" (`lib/data.ts:512`) enshrines permanent retrievability — which collides with the right to erasure/withdrawal (Art. 17, Art. 7(3)). **Positive:** the hospital client is deliberately anonymised.

**Recommendation:** (1) obtain or have confirmed an explicit, documented consent from all six referrers and archive it outside the repo (duty of proof, Art. 7(1)). (2) A "Referenzen" section in the privacy policy. (3) Define a removal process (on withdrawal: delete the entry, the route returns 404/410 — soften the "never remove" comment). (4) Check whether names in `<title>`/description are covered by the consent. *Effort: M (organisational).*

### R-05 ⚪ Review the CV PDFs for content

`public/cv/*.pdf` (~1 MB each, 10 pages) are freely retrievable. One's own data: unproblematic. Reference quotes/client mentions they contain must be covered by the same consents as the website references; on withdrawal the PDFs have to be regenerated as well.

### R-06 ⚪ Own contact data in plain text

Phone and email are in the HTML in machine-readable form (`lib/data.ts:22-23`) — not a legal violation (it is needed for the imprint anyway), but it exposes them to spam/scraping. A deliberate trade-off: for acquisition, reachability usually matters more; consider light obfuscation if spam becomes a problem.

### R-07 ⚪ Classification of the planned tracking (§ 25 TDDDG)

§ 25(1) TDDDG requires consent for **any** storage on or reading from the terminal device that is not strictly necessary — regardless of whether the data is personal. Detailed click tracking is nevertheless largely possible **without consent** if nothing is stored on the device and nobody is recognised across visits (cookieless, aggregated measurement; legal basis Art. 6(1)(f)). Persistent IDs, session replay and cross-visit profiles, by contrast, mandatorily require consent. → two-tier model in `TRACKING-CONCEPT.md`.

### R-08 ✅ Positive findings, law

- **No embedded third-party resources at runtime** — all external URLs are plain outbound links (Notion booking, LinkedIn, GitHub, Malt, freelancermap, sequenz.io).
- **The Inter font is self-hosted via `next/font`** — no Google Fonts problem (the well-known Munich Regional Court constellation is avoided; confirmed by `13-fonts.md`: "no requests are sent to Google by the browser").

---

## 4. Security

### S-01 🟡 Next.js 16.2.10 with 9 known vulnerabilities — patch available *(verified)*

`pnpm audit` reports nine advisories for `next@16.2.10` (4× high, 5× moderate), all patched in **16.2.11**: SSRF in Server Actions (GHSA-89xv-2m56-2m9x), SSRF in rewrites (GHSA-p9j2-gv94-2wf4), middleware/proxy bypass (GHSA-6gpp-xcg3-4w24), DoS in the App Router (GHSA-m99w-x7hq-7vfj), cache confusion (GHSA-68g3-v927-f742, GHSA-4633-3j49-mh5q), server-function endpoint disclosure (GHSA-955p-x3mx-jcvp), unbounded server-action payloads (GHSA-4c39-4ccg-62r3), DoS image optimization (GHSA-q8wf-6r8g-63ch).

**Verified assessment:** none of the four high advisories is concretely exploitable here (no `middleware.ts`/`proxy.ts`, no server actions, no rewrites, image optimizer disabled). What stays genuinely relevant are the moderate advisories, above all cache confusion when running via `next start`. Severity therefore **medium** — but the fix is trivial: `pnpm up next@16.2.11 eslint-config-next@16.2.11`. *Effort: S.*

### S-02 🟡 Vulnerable transitive dependencies: postcss 8.4.31, sharp 0.34.5 *(verified)*

Both come in transitively via `next` and are **not fixed by 16.2.11 either** (verified: 16.2.11 still pins postcss 8.4.31 / sharp ^0.34.5). postcss < 8.5.12: arbitrary file read (high, GHSA-6g55-p6wh-862q) + XSS (moderate) — primarily a build-time risk; sharp < 0.35.0: libvips CVEs (high, GHSA-f88m-g3jw-g9cj) — unused at runtime (`images.unoptimized: true`). **Recommendation:** pnpm overrides (`postcss >= 8.5.12`, `sharp >= 0.35.0`) in `pnpm-workspace.yaml`, then verify with `pnpm install && pnpm build`. *Effort: S.*

### S-03 🟡 No CI, no Dependabot/Renovate

`.github/` does not exist — no CI workflow, no automated dependency maintenance. That the site sat on a Next with 9 patched CVEs is the direct consequence. **The most important structural measure of this audit for long-term operation:** `.github/dependabot.yml` (npm, weekly, grouped updates) + `.github/workflows/ci.yml` (`pnpm install --frozen-lockfile && pnpm lint && pnpm build`). *Effort: M.*

### S-04 🔵 No security headers configured *(verified)*

`next.config.ts` only sets `images.unoptimized` — no `headers()` function, no CSP anywhere, no `frame-ancestors`/X-Frame-Options (clickjacking), no X-Content-Type-Options, Referrer-Policy or Permissions-Policy. The site is entirely static with no user input, so this is defence in depth only (severity after verification: low) — but the headers are practically free. The version's own docs (`content-security-policy.md`, section "Without Nonces") recommend setting the CSP for static pages directly via `headers()`; a nonce CSP would be wrong (it forces dynamic rendering). The concrete header set is in the implementation plan. **HSTS** is deployment-dependent (Vercel sets it automatically; when self-hosting, set it in the reverse proxy). *Effort: S–M.*

### S-05 🔵 `X-Powered-By` not disabled *(verified)*

Without `poweredByHeader: false` every response gives away the framework. One line in `next.config.ts`. *Effort: S.*

### S-06 ⚪ Minor points *(verified)*

- The localStorage consent value is read without schema validation — no injection risk (it is only used as truthy/falsy), but validate it against an allowlist / a versioned schema when rebuilding consent.
- External links use `rel="noreferrer"` throughout (which implies `noopener`) — functionally correct; optionally spell out `"noopener noreferrer"` explicitly.

### S-07 ✅ Positive findings, security *(verified)*

- **No XSS vectors:** no `dangerouslySetInnerHTML`/`innerHTML`/`eval`; favicon from hardcoded JSX; static data only.
- **No secrets in the repo** — not in the Git history either; `.gitignore` covers `.env*`/`*.pem`.
- **Client/server boundaries conform** to the Next 16 data-security guide (all data is public by design).
- **`pnpm-workspace.yaml` uses `allowBuilds` correctly** — effective supply-chain protection (build scripts only for 5 explicitly approved packages).

---

## 5. Next.js 16 best practices & SEO

### N-01 🟠 Metadata incomplete: no metadataBase, no Open Graph, no robots/sitemap *(verified)*

`app/layout.tsx:11-15` defines only `title` + `description`. Missing are: `metadataBase` (needed for absolute OG URLs/canonicals), `openGraph`/`twitter` blocks, `app/opengraph-image.tsx`, `app/robots.ts`, `app/sitemap.ts`, `manifest`, `apple-icon`. **Consequence for an acquisition page:** sharing on LinkedIn/WhatsApp/Slack produces **no preview card**; search engines get no sitemap for the 14 SSG subpages. The `production-checklist.md` explicitly demands OG images and sitemap/robots. **Recommendation:** `metadataBase` pointing at the production domain, OG/Twitter fields, `opengraph-image.tsx` (via `ImageResponse`, as in `icon.tsx`), `sitemap.ts` + `robots.ts` generated from the `lib/data.ts` slugs, optionally a JSON-LD `Person` schema (`json-ld.md`). *Effort: M.*

### N-02 🟡 No custom error pages *(verified)*

`notFound()` is called correctly, but without `app/not-found.tsx` the **English** Next default 404 appears on an otherwise fully designed German page; without `error.tsx`/`global-error.tsx` every rendering error ends in the default error screen. Next 16 specifics: `error.tsx` with `unstable_retry`, `global-error.tsx` with its own `<html>/<body>` tags. *Effort: S.*

### N-03 🟡 Images entirely unoptimised: `images.unoptimized: true` + `<img>` throughout *(verified)*

All 6 image sites use `<img>` (in 2 cases the ESLint rule is suppressed deliberately); `next/image` is imported nowhere. The 8 project covers (1280 px, ~944 KB in total, e.g. `dino.jpg` at 212 KB) are delivered at full size without srcset/WebP/AVIF for cards that are ~240–350 px wide. On top of that `images.unoptimized: true` is set **without `output: 'export'` being configured** — the only legitimate reason for that option does not apply (and a static export would not be possible anyway because of the intercepting routes). A direct LCP/Core-Web-Vitals/SEO disadvantage. **Recommendation:** drop `unoptimized`, move to `next/image` with static imports + `sizes` (which supplies width/height/blur automatically); alternatively at least pre-scale the covers to ~640 px WebP (−70–80 %). *Effort: M.*

### N-04 🔵 Intercepting routes are rendered dynamically

The modal routes (`app/@modal/(.)projects/[slug]/page.tsx`, likewise for references) are client components using `useParams` — they cannot export `generateStaticParams` and are rendered as "Dynamic" (every modal opening = on-demand rendering). As a server component with `generateStaticParams` plus a small client wrapper they would be prerendered — and the `notFound()` case (see A-17) would be solved along the way. *Effort: M.*

### N-05 ✅ Positive findings, Next.js

- **SSG correct:** both `[slug]` routes with `generateStaticParams`, `params` awaited correctly (Next 16 convention); 18 statically prerendered pages, build free of errors and warnings.
- **Font setup conforms to the docs** (variable font, `display: swap`, CSS variable).
- **Parallel/intercepting route conventions implemented exactly right** (`@modal` + `default.tsx`, `(.)` intercepts).

---

## 6. Architecture, code quality & accessibility

### A-01 🟠 Modal dialogs without focus management

`ProjectModal`/`ReferenceModal` set `role="dialog"` + `aria-modal="true"` and handle ESC/scroll lock — but: **no initial focus, no focus trap, no focus restoration** on close (verified: not a single `.focus()` call). Tab wanders unimpeded into the background that `aria-modal` has hidden. This violates WCAG 2.1.2/2.4.3; for keyboard/screen-reader users it is effectively unusable. **Recommendation:** a shared `ModalShell` using the native `<dialog>`/`showModal()` (focus trap, ESC, restoration for free) or Radix Dialog (consistent with the shadcn/ui stack). *Effort: M — solve together with A-04.*

### A-02 🟠 WCAG contrast violations in the accent colour and secondary text

Calculated contrasts (AA threshold 4.5:1 for normal text): accent orange `#e1852e` on white **2.76:1** — which affects precisely the conversion elements ("Erstgespräch buchen" button, CV button, profile links); `#9a8f7c` on the banner background 2.78:1 at 10 px; `#a7a399` 2.27:1; `text-notion-gray #787774` 4.48:1 (just under AA, over large areas). **Recommendation:** darken the text-on-white accent to ~`#b5651d` (≈4.6:1), use the light orange only for fills/large text; keep colour pairs as token pairs centrally in `globals.css`. *Effort: M.*

### A-03 🟡 `references.json` via a double type assertion without validation

`lib/data.ts:538`: `referencesData.references as Reference[]` — TypeScript checks nothing. A typo in the JSON (e.g. `"Linkedin"` instead of `"LinkedIn"`) compiles but crashes at runtime while rendering (`referenceSources[source].href`). `projectSlug` is not checked against existing project slugs. **Recommendation:** move the JSON to `.ts` with `satisfies Reference[]`, or (if it has to stay JSON because of the PDF CV sync) validate it with Zod on import → errors surface in the build, not at runtime. *Effort: S.*

### A-04 🟡 Modal scaffolding fully duplicated

ESC handler, scroll lock, overlay and close button are character-for-character identical in `projects.tsx:166-178` and `references.tsx:133-145`; the four slug/standalone pages are structurally identical copies. Every change (e.g. the focus trap from A-01) would have to be made 2–4 times. → a `ModalShell` component + generic `findBySlug`/metadata helpers (~80 lines less). *Effort: M.*

### A-05 🟡 Gallery logic duplicated three times

An identical search/sort `useMemo` in `projects.tsx`, `references.tsx` and `certificates.tsx`; the "Keine Treffer." empty state 4×; the grid template 3×. → a `useGallery<T>` hook + `GalleryGrid`/`EmptyState`. *Effort: M.*

### A-06 🟡 Non-functional fake controls in the DatabaseToolbar

An "Expand" button without `onClick`, a filter popover with dummy entries ("Filter by..."), "Add sort"/"Delete sort" that only close the popover. Elements that are reachable and announced to assistive-technology users but have no effect; misleading for mouse users too — and the page is a showcase. On top of that `aria-expanded`/`aria-haspopup` and ESC handling are missing; the search field has no `aria-label`. **Recommendation:** remove the fake elements or make them functional. *Effort: M.*

### A-07 🟡 The entire page content is in the client bundle

All galleries are `"use client"` and import the **complete** data arrays — the whole content (including all project full texts and reference quotes) is delivered a second time as JS on top of the server HTML. Modal-only fields (`aufgaben`/`ergebnis`/`meta`) sit in the gallery bundle unnecessarily. Not a must at this page size, but the docs recommend client components only for interactive leaves. *Effort: L (optional).*

### A-08 🟡 Inverted heading hierarchy

The name is an `h2` (CoverBanner) while five subsections each get their own `h1`; sidebar `h2`s appear before the first `h1`. Misleading for screen-reader navigation, suboptimal for SEO. → the name as the only `h1`, sections as `h2`/`h3` (visual sizes stay unchanged via classes). *Effort: S.*

### A-09 🟡 Table of contents reachable by mouse hover only

`toc.tsx:38-42`: opening only via `onMouseEnter`; while closed the nav is `invisible` → the buttons are not focusable, so there is **no keyboard access**. On top of that an English `aria-label` ("Table of contents") on a `lang="de"` page. → `onFocus`/`:focus-within` or a real toggle button with `aria-expanded`. *Effort: S.*

### A-10 🟡 Cookie toggles without an accessible name

The switches in the "Cookies anpassen" panel have `aria-pressed` but no label — screen readers only say "switch pressed/not pressed" without naming the category. → `aria-label={row.title}` or `role="switch"` + `aria-labelledby`. *Effort: S (as part of the banner rebuild).*

### A-11 – A-17 🔵 Further points

| ID | Finding | Fix |
|---|---|---|
| A-11 | English aria-labels/UI texts ("Close search", "Filter by...", "Add sort") on a German page | Translate into German |
| A-12 | The CV dropdown declares `role="menu"` without the ARIA menu keyboard pattern (no arrow keys) | Remove the menu roles — a disclosure with `aria-expanded` is enough |
| A-13 | 75 hardcoded hex/rgba values across 10+ files despite existing CSS tokens | Centralise the palette in `@theme` (Tailwind v4) |
| A-14 | Minimal ESLint/TS configuration (no typescript-eslint strict, no jsx-a11y, no `noUncheckedIndexedAccess`) | Tighten now — tsc currently runs clean, which is the cheapest moment |
| A-15 | Dead export `referenceHref` (documented, used nowhere; URLs are built inline) | Use it consistently or delete it |
| A-16 | The quote preview opens with „ and closes with a straight `"` instead of " | Fix the typography |
| A-17 | Interception routes simply render nothing for an unknown slug (the URL changes, no modal, no 404) | Call `notFound()` — or do the N-04 refactoring |

### A-18 ✅ Positive finding

`pnpm lint` (0 errors, 4 no-img warnings) and `tsc --noEmit` run cleanly; the basic architecture (routing, data handling, component split) is appropriate for the size of the project.

---

## 7. Content, assets & repo hygiene

| ID | Severity | Finding | Recommendation |
|---|---|---|---|
| C-01 | 🔵 | **19 unused template assets (~700 KB)** in `public/assets/` get deployed along with everything else, among them "LinkedIn Banner-selection.png" (406 KB, space in the filename), `cover.jpg` (109 KB — the visible cover is CSS), 7 `skill-*.png`, `proj-*.jpg` | Delete them all; convention: lowercase, hyphen-separated filenames |
| C-02 | 🟡 | **The freelancermap and Malt links point at the portal home pages** instead of the profile (`lib/data.ts:57-58`) — prospects end up nowhere. The correct Malt profile URL already exists in `references.json` | Enter the real profile URLs or remove the links |
| C-03 | 🔵 | The `verifyUrl` of the Angular certificate is never rendered (the render logic only uses `externalUrl`) | Render it as a second link or remove the field |
| C-04 | 🔵 | Reference quotes contradict the project data: XU period "05/2020–02/2023" vs. quote "from July 2021 to February 2023"; the quote names the company "deroso" | Put the periods in context; make `relation`/`company` more precise (do not alter the original quotes) |
| C-05 | 🔵 | The static "04/2025 – heute · **15 Monate**" goes stale every month (since July 2026: 16) | Drop the month count or compute it from `sort` |
| C-06 | 🔵 | Runtime deps with patch drift (react 19.2.4→19.2.8 pinned exactly), dev tooling a major version behind | Bundle it with the Next update; raise the dev tooling separately and deliberately |
| C-07 | 🔵 | README out of date: describes a second CV button that does not exist, structure section without `references.tsx`, `certificates.tsx`, slug routes etc. | Update the README; build in the "hero" variant of `CvDownload` (a conversion element!) or remove it as dead code |
| C-08 | ⚪ | Language mix: "Munich" in the cover vs. "München" in the key facts | Unify |
| C-09 | ⚪ | The "Eckdaten" section has an anchor ID but is missing from the TOC — of all things the hourly rate/availability | Add `{ id: "eckdaten", … }` to `sections` |
| C-10 | ⚪ | The project meta "Website"/"Code" (e.g. `github.com/nikita-petrich/accounting-os`) is plain text, not clickable | Render them as links; verify that the GitHub repo exists |
| C-11 | ✅ | **No broken references:** all 22 `public/` files referenced in the code exist (including `assets/flags/` and every certificate and CV PDF) | Optionally guard this with a CI test |
| C-12 | ✅ | `.gitignore` complete; no build artefacts/`.env` in the index; no LICENSE (defensible for a `private: true` portfolio) | Keep as is |

---

## 8. Consolidated priority list

**P0 — before or immediately alongside going live (legal risk):**
R-01 imprint · R-02 privacy policy · R-03 cookie banner (remove or make real) · R-04 obtain reference consents

**P1 — short term (security & acquisition impact):**
S-01 Next update 16.2.11 · S-02 pnpm overrides · S-03 CI + Dependabot · N-01 metadata/OG/sitemap · A-01 modal focus · A-02 contrasts · N-02 error pages · C-02 profile links

**P2 — medium term (quality & performance):**
N-03 image optimisation · S-04/S-05 security headers + poweredByHeader · A-03 data validation · A-04/A-05 deduplication · A-06 fake toolbar · A-08/A-09/A-10 a11y · C-01 asset cleanup

**P3 — ongoing/optional:**
A-07 client/server split · N-04 intercepting-route prerendering · A-11–A-17 · C-03–C-10 · tracking tier 2

The concrete, step-by-step work plan including the tracking rollout and the ai-blueprint process is in [`IMPLEMENTATION-PLAN.md`](./IMPLEMENTATION-PLAN.md).
