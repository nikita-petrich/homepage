# Nikita Petrich — Homepage

A Notion-style résumé homepage for **Nikita Petrich**, Senior Full-Stack & AI
Engineer, built with **Next.js 16**, **Tailwind CSS v4** and **shadcn/ui**.
The site is fully bilingual (German and English) and ships a light and a dark
theme.

The page mirrors a published Notion layout: a sticky top bar, a full-width
cover, the page icon overlapping it, the title, and a two-column body — a
sidebar (photo, contact, key facts, languages, ways of working, profiles) and a
main column with an about callout, focus areas, projects,
testimonials, a searchable skills database and certificates. Legal pages
(`/imprint`, `/privacy`) and a privacy banner make the site fit for
production use in Germany.

## Languages and theme

Every page exists in German and English under its own URL — `/de/…` and
`/en/…`. A request without a language prefix is sent to one of them by
`proxy.ts`, which decides in this order:

1. the `NEXT_LOCALE` cookie — an explicit choice from the language switcher,
2. the browser's `Accept-Language` header,
3. **English** as the fallback when neither says anything usable.

The redirect is a temporary one (307), because the target depends on who is
asking. Every previously published address therefore keeps working:
`/certificates/<slug>` still leads to that certificate, and
`/certificates/<slug>.pdf` is served unchanged — files under `public/` are
excluded from the language routing.

Both languages are written side by side in the source (`t("…", "…")`, see
`lib/i18n/text.ts`), so a content edit cannot silently leave one language
behind. Interface strings live in `lib/i18n/ui.ts`, page content in
`lib/content/*`.

Top-right in the top bar sit the two switches: a language menu (German /
English, the current one marked) and a light/dark toggle. The theme is applied
before the first paint by a small inline script and stored in `localStorage`
under `np-theme`; every colour in the UI comes from a CSS variable that has a
light and a dark value (`app/globals.css`).

Two exceptions to "everything in both languages", both deliberate:

- **Testimonials** are shown in the language they were written in, with a
  translation in the other one, marked as such and linking to the source.
- **Course syllabi** keep the courses' own English lesson titles — that is what
  makes them verifiable against the course page. Everything the site says about
  a certificate (summary, scope, outcomes) exists in both languages.

The legal pages are governed by German law, so the German version is the
binding one; the English version says so and links to it.

## CV download

The top bar, the intro callout and the closing call to action each expose a
**CV herunterladen** / **CV download** button. Its menu holds both languages,
each in the three shapes the CV exists in:

| Entry             | Where it comes from                                            |
| ----------------- | -------------------------------------------------------------- |
| PDF               | `public/cv/CV_Nikita_Petrich_{DE,EN}.pdf` — the designed original |
| Word (`.docx`)    | `/cv/word/CV_Nikita_Petrich_{DE,EN}.docx` — exported from the Google Doc on request |
| Google Docs       | the document itself, opened read-only in a new tab              |

The Word file is **not** committed. `app/cv/word/[file]/route.ts` fetches
Google's own DOCX export of the document when the visitor clicks, so it can
never say something different from the document — and it is fetched
server-side, so the visitor's browser never talks to Google (the privacy page
spells this out; the "open in Google Docs" link is the one deliberate
exception, and it takes a click).

Everything language-independent — the two document ids, the file names, the
Google URLs — lives in `lib/cv.ts`. Publishing a CV from a new document means
changing `docId` there and nothing else. Both documents must stay in a Drive
folder shared with *anyone with the link*: that is what lets the export work
without credentials. If that sharing is revoked the Word entry answers 502 and
the PDF keeps working.

The PDF and the Google Doc are two renderings of one CV, but they are not
generated from one another: the PDF comes from the designed layout and is
committed here (its URL is permanent, so a CV forwarded a year ago still
resolves), the document carries the same content as a plain, ATS-readable
document. A new version of the CV therefore has to land in both — replace the
PDF in `public/cv/`, update the Google Doc, and the Word download follows the
document on its own.

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router, TypeScript, Turbopack)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) primitives
- Notion's colours captured as CSS variables in `app/globals.css` (light and
  dark)
- Language routing via `proxy.ts` (the Next 16 name for the middleware
  convention) — no i18n library
- Optional cookieless analytics: self-hosted [Umami](https://umami.is/) behind
  a first-party proxy

## Project structure

```
proxy.ts                Language routing: cookie → Accept-Language → English
app/
  globals.css           Design tokens (light + dark) + popup animations
  icon.tsx              Generated favicon
  sitemap.ts            Sitemap from the slugs, both languages + hreflang
  robots.ts             Robots rules
  global-error.tsx      Error boundary that replaces the root layout
  global-not-found.tsx  404 for URLs that match no route at all
  api/a/[...path]/      First-party Umami proxy (strips client IPs)
  cv/word/[file]/       CV as Word — Google's DOCX export, fetched server-side
  [locale]/             Everything below exists as /de/… and /en/…
    layout.tsx          Root layout: metadata (OG/Twitter, hreflang), theme
                        script, i18n provider, footer, banner, analytics
    page.tsx            Page composition (icon, title, two columns)
    opengraph-image.tsx Generated social-share card (one per language)
    not-found.tsx       Branded 404 in the language of the URL
    error.tsx           Error boundary
    [...rest]/          Catch-all so an unknown /de/… 404s in German
    imprint/            Provider identification (§ 5 DDG) — de.tsx / en.tsx
    privacy/            Privacy policy (Art. 13 GDPR) — de.tsx / en.tsx
    projects/[slug]/    Standalone project dialogs (SSG)
      references/       All testimonials of one project on one URL (SSG)
    references/[slug]/  Standalone testimonial dialogs (SSG)
    certificates/       Certificates overview — the shareable URL
      [slug]/           Standalone certificate dialogs (SSG)
    @modal/             Intercepting modal routes for all three (SSG)
components/
  analytics/            AnalyticsProvider (script gate, click/scroll/vitals)
  notion/
    blocks.tsx          Section, Callout, RichText, InfoLine, FactLine, LangLine, tags
    cover-banner.tsx    Cover with git-diff motif + name (h1)
    topbar.tsx          Sticky top bar (name, language, theme, CV, booking)
    language-toggle.tsx German/English menu (real links, remembers the choice)
    theme-toggle.tsx    Light/dark switch
    theme-sync.tsx      Re-applies the theme where the inline script cannot run
    cv-download.tsx     "CV herunterladen" menu — PDF / Word / Google Docs, DE + EN
    projects.tsx        Project gallery + detail dialog
    references.tsx      Testimonials gallery + detail dialog
    certificates.tsx    Certificates gallery + detail dialog (scope, syllabus, PDF)
    galleries.tsx       Skills database (searchable category cards)
    gallery.tsx         Shared useGallery hook, EmptyState, GalleryGrid
    modal-shell.tsx     Native <dialog> scaffolding (focus trap, ESC)
    database-toolbar.tsx Search + sort toolbar
    toc.tsx             Floating table of contents (keyboard accessible)
    footer.tsx          Legal links + privacy settings
    cookie-banner.tsx   Privacy banner (informs, opt-out; no fake consent)
    legal.tsx           Shared shell for the legal pages
lib/
  data.ts               Content assembled and resolved for one locale
  profile.ts            Name, role, booking URL — language-independent
  cv.ts                 CV document ids, file names, Google Docs URLs
  theme.ts              Theme storage, the pre-paint script, sync helpers
  i18n/
    config.ts           Locales, cookie, path helpers, Accept-Language match
    text.ts             t() / localize() — both languages in one source tree
    ui.ts               Every interface string, German and English
    provider.tsx        Locale + strings for the client components
    cookie.ts           Remembers an explicit language choice
  content/
    profile.ts          Identity, sidebar, intro, focus, TOC
    projects.ts         The nine reference projects
    skills.ts           Skill taxonomy (22 categories: hard, soft, profile)
    certificates.ts     Certificates incl. syllabi
    references.ts       Testimonials + translations, validated at build
    terms.ts            Shared translations of technology/skill terms
  references.json       Testimonials (shared with the PDF CV)
  analytics/            consent.ts, track.ts, use-search-tracking.ts
public/
  cv/                   CV PDFs (DE / EN). The Word files are not here — see "CV download"
  certificates/         Certificate PDFs (/certificates/<slug>.pdf, permanent)
  assets/               Photos, flags, project covers
    certificates/       Pre-rendered certificate previews (generated)
scripts/
  certificate-previews.mjs      PDF first page → WebP page + tile crop
  certificate-image-to-pdf.mjs  Certificate image → PDF container
  lib/png.mjs                   Minimal PNG reader shared by both
```

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build && pnpm start
pnpm lint && pnpm typecheck
```

## Analytics (optional)

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_UMAMI_WEBSITE_ID` and
`UMAMI_ORIGIN` to enable the cookieless stage-1 measurement. Without these
variables the site runs with analytics fully disabled.

## Deployment

Every push to `main` builds the Docker image (standalone Next.js output),
pushes it to GHCR and restarts the stack (website + Umami + Postgres) on the
VPS via SSH. One-time setup, reverse-proxy targets and required GitHub
secrets/variables: [`deploy/README.md`](./deploy/README.md).

## Content

All page copy lives in `lib/content/*` (contact, key facts, languages, focus,
projects, certificates and skills), each string with its German and its English
wording next to each other:

```ts
{ label: t("Erfahrung", "Experience"), value: t("7+ Jahre", "7+ years") }
```

Testimonials live in `lib/references.json` — the file the PDF CV shares — and
their translations in `lib/content/references.ts`; both are validated at build
time, including a check that the original wording still matches the JSON. The
CV PDFs are produced separately and committed under `public/cv/`; the Word and
Google Docs versions come from the documents named in `lib/cv.ts` (see
"CV download").

Technology and skill terms are translated once in `lib/content/terms.ts` and
reused by the projects, the skills database and the schema.org markup, so a
term reads the same everywhere.

### Profile photo

The sidebar photo is `public/assets/profile.jpg`. Replace that file to change
the photo (it is rendered via `next/image` in a `1 / 1.1` frame). The same file
is read at build time by `app/[locale]/opengraph-image.tsx` and drawn into the
social-share card in the same frame, so one replacement covers both.

### Social-share card

`app/[locale]/opengraph-image.tsx` draws the 1200×630 preview that Slack,
LinkedIn, WhatsApp and iMessage show for a shared link — profile photo, name,
role, the guiding principle from `lib/content/profile.ts` and the first three
entries of its `focus` list, one card per language, in the cover banner's
order. Everything on it comes from the content tree, so editing the role, the
slogan or the focus order changes the card on the next build; nothing has to be
redrawn by hand.

The card is prerendered at build time, and its URL carries a content hash, so a
changed card gets a new `og:image` URL. Chat clients still cache the preview
they fetched first: in Slack a link keeps its old card until that cache expires
(roughly 30 minutes), so check a change with a fresh URL — `?x=1` appended is
enough — rather than by reposting the same link.

### Project cover images

Each project supports an optional `cover` image (see the `Project` type in
`lib/data.ts`). When set to a path under `/public`, the card and dialog show
that image (responsive via `next/image`); otherwise a striped placeholder with
the caption is rendered.

### Certificates

Certificates live at three stable URLs, none of which may ever change once
published:

- `/certificates` — overview of all certificates
- `/certificates/<slug>` — detail dialog with the full scope (opens as a modal
  from a card, renders standalone on a hard load)
- `/certificates/<slug>.pdf` — the certificate document itself, served straight
  from `public/certificates`

The first two now live under a language prefix (`/de/certificates/<slug>`,
`/en/certificates/<slug>`); the unprefixed address still resolves and is sent
to the visitor's language. The PDF URL is untouched by the language routing.

The detail dialog is filled from the `Certificate` type in `lib/data.ts`:
`summary` (what the course covered), `facts` (scope grid), `outcomes`
(competencies) and `curriculum` (syllabus, one collapsible block per chapter).
`curriculumNote` explains the listing whenever it is not the course's own
chapter structure. Certificates that are not self-hosted set `externalUrl`
instead of a PDF and show a branded placeholder instead of a preview.

To add a certificate:

1. Commit the PDF as `public/certificates/<slug>.pdf`.

   Only have the certificate as an image, say a screenshot of the issuer's
   certificate page? Wrap it in a PDF first. The pixels are embedded unchanged
   (verified as a pixel-identical round-trip), so the result is a container
   around the original document rather than a re-typeset copy:

   ```bash
   node scripts/certificate-image-to-pdf.mjs bild.png <slug>
   ```

2. Generate the two previews — the whole first page for the dialog, plus a crop
   to the tile's 4/3 for the gallery. Needs `poppler-utils` and `webp`
   installed (`pdftoppm`, `cwebp`); the output is committed, so the website
   build itself needs neither:

   ```bash
   node scripts/certificate-previews.mjs
   ```

3. Add the entry to `certificates` in `lib/data.ts`, including
   `preview: "/assets/certificates/<slug>.webp"` and
   `tilePreview: "/assets/certificates/<slug>-tile.webp"`.

The slug drives the routes, the PDF URL and both preview filenames, so they all
stay in sync by construction.

Why two crops: a tile filled edge to edge has to be cropped, but the dialog
should show the document complete. The tile crop is found by edge energy rather
than by trimming a uniform border — Scrimba prints onto a full-bleed A4
gradient where the text sits in a band in the middle and there is no border to
trim, so measuring where the ink actually is keeps the name, course title and
hours in frame while the page's empty colour and its footer fall outside it.
