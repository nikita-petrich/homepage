# Nikita Petrich — Homepage

A Notion-style résumé homepage for **Nikita Petrich**, Senior Full-Stack & AI
Engineer, built with **Next.js**, **Tailwind CSS** and **shadcn/ui**.

The page mirrors a published Notion layout: a sticky top bar, a full-width
cover, the page icon overlapping it, the title, and a two-column body — a
sidebar (photo, contact, key facts, languages, ways of working, profiles) and a
main column with an about callout, focus areas, project case studies and a
skills database with search / sort.

## CV download

The top bar and the page header each expose a **CV herunterladen** button that
opens a menu to download the CV as a PDF in two languages:

- 🇩🇪 `public/cv/CV_Nikita_Petrich_DE.pdf`
- 🇬🇧 `public/cv/CV_Nikita_Petrich_EN.pdf`

Both are 10-page, letter-size documents (header + project overview, a skills
page, and one page per project). They are static assets served from `/public`.

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router, TypeScript, Turbopack)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) primitives
- Notion's light-theme colours captured as CSS variables in `app/globals.css`

## Project structure

```
app/
  layout.tsx            Root layout, Inter font, metadata
  page.tsx              Page composition (icon, title, two columns)
  globals.css           Design tokens + popup animations
components/
  ui/                   shadcn/ui primitives
  notion/
    icons.tsx           Page + callout icons
    blocks.tsx          Section, Callout, RichText, InfoLine, FactLine, LangLine, tags
    cv-download.tsx     "CV herunterladen" language menu (DE / EN PDF)
    topbar.tsx          Sticky top bar (name, CV download, "book a call")
    projects.tsx        Case-study gallery + detail popups
    galleries.tsx       Skills database (searchable category cards)
    toc.tsx             Floating table of contents
    cookie-banner.tsx   Cookie-consent bar
lib/
  data.ts               All page content (typed)
  utils.ts              cn() helper
public/
  cv/                   Downloadable CV PDFs (DE / EN)
```

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build && pnpm start
```

## Content

All page copy lives in `lib/data.ts` (contact, key facts, languages, focus,
projects and skills). The CV PDFs are generated separately and committed under
`public/cv/`.

### Profile photo

The sidebar photo is `public/assets/profile.jpg`. Replace that file to change
the photo (it is rendered `object-cover` in a `1 / 1.1` frame).

### Project cover images

Each project supports an optional `cover` image (see the `Project` type in
`lib/data.ts`). When set to a path under `/public`, the card and popup show that
image; otherwise a striped placeholder with the caption is rendered.
