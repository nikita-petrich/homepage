# Nikita Petrich — Homepage

A Notion-style résumé homepage for **Nikita Petrich**, Senior Full-Stack & AI
Engineer, built with **Next.js 16**, **Tailwind CSS v4** and **shadcn/ui**.

The page mirrors a published Notion layout: a sticky top bar, a full-width
cover, the page icon overlapping it, the title, and a two-column body — a
sidebar (photo, contact, key facts, languages, ways of working, profiles) and a
main column with an about callout, focus areas, projects,
testimonials, a searchable skills database and certificates. Legal pages
(`/impressum`, `/datenschutz`) and a privacy banner make the site fit for
production use in Germany.

## CV download

The top bar and the intro callout each expose a **CV herunterladen** button
that opens a menu to download the CV as a PDF in two languages:

- 🇩🇪 `public/cv/CV_Nikita_Petrich_DE.pdf`
- 🇬🇧 `public/cv/CV_Nikita_Petrich_EN.pdf`

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router, TypeScript, Turbopack)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) primitives
- Notion's light-theme colours captured as CSS variables in `app/globals.css`
- Optional cookieless analytics: self-hosted [Umami](https://umami.is/) behind
  a first-party proxy (see `docs/TRACKING-KONZEPT.md`)

## Project structure

```
app/
  layout.tsx            Root layout: metadata (OG/Twitter), footer, banner, analytics
  page.tsx              Page composition (icon, title, two columns)
  globals.css           Design tokens + popup animations
  icon.tsx              Generated favicon
  opengraph-image.tsx   Generated social-share card
  sitemap.ts            Sitemap from lib/data.ts slugs
  robots.ts             Robots rules
  not-found.tsx         Branded German 404
  error.tsx             Error boundary (+ global-error.tsx)
  impressum/            Anbieterkennzeichnung (§ 5 DDG)
  datenschutz/          Datenschutzerklärung (Art. 13 DSGVO)
  projekte/[slug]/      Standalone project dialogs (SSG)
    referenzen/         All testimonials of one project on one URL (SSG)
  referenzen/[slug]/    Standalone testimonial dialogs (SSG)
  zertifikate/          Certificates overview — the shareable /zertifikate URL
    [slug]/             Standalone certificate dialogs (SSG)
  @modal/               Intercepting modal routes for all three (SSG)
  api/a/[...path]/      First-party Umami proxy (strips client IPs)
components/
  analytics/            AnalyticsProvider (script gate, click/scroll/vitals)
  notion/
    blocks.tsx          Section, Callout, RichText, InfoLine, FactLine, LangLine, tags
    cover-banner.tsx    Cover with git-diff motif + name (h1)
    topbar.tsx          Sticky top bar (name, CV download, booking CTA)
    cv-download.tsx     "CV herunterladen" menu (topbar + hero variant)
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
  data.ts               All page content (typed, references validated at build)
  references.json       Testimonials (shared with the PDF CV)
  analytics/            consent.ts, track.ts, use-search-tracking.ts
docs/
  AUDIT-REPORT.md       Security/GDPR/quality audit (2026-07)
  UMSETZUNGSPLAN.md     Remediation & tracking plan
  TRACKING-KONZEPT.md   Analytics design (two-tier, GDPR)
public/
  cv/                   Downloadable CV PDFs (DE / EN)
  zertifikate/          Certificate PDFs (/zertifikate/<slug>.pdf, permanent)
  assets/               Photos, flags, project covers
    zertifikate/        Pre-rendered certificate previews (generated)
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
variables the site runs with analytics fully disabled. Details and the legal
rationale: `docs/TRACKING-KONZEPT.md`.

## Deployment

Every push to `main` builds the Docker image (standalone Next.js output),
pushes it to GHCR and restarts the stack (website + Umami + Postgres) on the
VPS via SSH. One-time setup, reverse-proxy targets and required GitHub
secrets/variables: [`deploy/README.md`](./deploy/README.md).

## Content

All page copy lives in `lib/data.ts` (contact, key facts, languages, focus,
projects, certificates and skills); testimonials live in
`lib/references.json` and are validated at build time. The CV PDFs are
generated separately and committed under `public/cv/`.

### Profile photo

The sidebar photo is `public/assets/profile.jpg`. Replace that file to change
the photo (it is rendered via `next/image` in a `1 / 1.1` frame).

### Project cover images

Each project supports an optional `cover` image (see the `Project` type in
`lib/data.ts`). When set to a path under `/public`, the card and dialog show
that image (responsive via `next/image`); otherwise a striped placeholder with
the caption is rendered.

### Certificates

Certificates live at three stable URLs, none of which may ever change once
published:

- `/zertifikate` — overview of all certificates
- `/zertifikate/<slug>` — detail dialog with the full scope (opens as a modal
  from a card, renders standalone on a hard load)
- `/zertifikate/<slug>.pdf` — the certificate document itself, served straight
  from `public/zertifikate`

The detail dialog is filled from the `Certificate` type in `lib/data.ts`:
`summary` (what the course covered), `facts` (scope grid), `outcomes`
(competencies) and `curriculum` (syllabus, one collapsible block per chapter).
`curriculumNote` explains the listing whenever it is not the course's own
chapter structure. Certificates that are not self-hosted set `externalUrl`
instead of a PDF and show a branded placeholder instead of a preview.

To add a certificate:

1. Commit the PDF as `public/zertifikate/<slug>.pdf`.

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
   `preview: "/assets/zertifikate/<slug>.webp"` and
   `tilePreview: "/assets/zertifikate/<slug>-tile.webp"`.

The slug drives the routes, the PDF URL and both preview filenames, so they all
stay in sync by construction.

Why two crops: a tile filled edge to edge has to be cropped, but the dialog
should show the document complete. The tile crop is found by edge energy rather
than by trimming a uniform border — Scrimba prints onto a full-bleed A4
gradient where the text sits in a band in the middle and there is no border to
trim, so measuring where the ink actually is keeps the name, course title and
hours in frame while the page's empty colour and its footer fall outside it.
