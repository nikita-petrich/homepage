# Nikita Petrich — Homepage

A Notion-style résumé homepage for **Nikita Petrich**, Senior Full-Stack & AI
Engineer, built with **Next.js 16**, **Tailwind CSS v4** and **shadcn/ui**.

The page mirrors a published Notion layout: a sticky top bar, a full-width
cover, the page icon overlapping it, the title, and a two-column body — a
sidebar (photo, contact, key facts, languages, ways of working, profiles) and a
main column with an about callout, focus areas, project case studies,
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
  projekte/[slug]/      Standalone case-study dialogs (SSG)
    referenzen/         All testimonials of one project on one URL (SSG)
  referenzen/[slug]/    Standalone testimonial dialogs (SSG)
  @modal/               Intercepting modal routes for both (SSG)
  api/a/[...path]/      First-party Umami proxy (strips client IPs)
components/
  analytics/            AnalyticsProvider (script gate, click/scroll/vitals)
  notion/
    blocks.tsx          Section, Callout, RichText, InfoLine, FactLine, LangLine, tags
    cover-banner.tsx    Cover with git-diff motif + name (h1)
    topbar.tsx          Sticky top bar (name, CV download, booking CTA)
    cv-download.tsx     "CV herunterladen" menu (topbar + hero variant)
    projects.tsx        Case-study gallery + detail dialog
    references.tsx      Testimonials gallery + detail dialog
    certificates.tsx    Certificates gallery (PDF / external / verify links)
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
  zertifikate/          Certificate PDFs
  assets/               Photos, avatar, flags, project covers
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
