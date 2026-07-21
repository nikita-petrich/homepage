# Maya Zhang — Notion résumé replica

A pixel-faithful 1:1 rebuild of the "Maya Zhang" Notion page, implemented as a
standalone web app with **Next.js**, **Tailwind CSS** and **shadcn/ui**.

The layout mirrors the source Notion page exactly: the published-site top bar,
a full-width cover, the page icon overlapping it, the title, and a two-column
body (photo / contact / interests / languages sidebar and a main column with an
intro callout, work history, education, plus the *Projects* and *Skills*
database galleries with their view toolbars).

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router, TypeScript)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) primitives (`Card`, `Badge`, `Separator`,
  `Avatar`)
- Notion's own light-theme colours (`#37352f` text, callout grays, select-pill
  colours) captured as CSS variables in `app/globals.css`.

## Project structure

```
app/
  layout.tsx            Root layout, Inter font, metadata
  page.tsx              Page composition (icon, title, two columns)
  globals.css           Notion + shadcn design tokens
components/
  ui/                   shadcn/ui primitives
  notion/
    icons.tsx           Hand-drawn stand-ins for Notion's illustrated icons
    blocks.tsx          Section, Callout, RichText, InfoLine, ResumeItem, Tag, SkillBar
    galleries.tsx       Projects & Skills gallery views
lib/
  data.ts               All page content (typed)
  utils.ts              cn() helper
public/assets/          Company / school logos
```

## Getting started

```bash
pnpm install
pnpm dev         # http://localhost:3000
```

Build for production:

```bash
pnpm build && pnpm start
```

## Notes on assets

All bitmap assets live in `public/assets/` and are served locally (the app is
fully self-contained):

- **Cover, profile photo, project covers and app/skill icons** were captured
  from the source page and cropped to size.
- **Illustrated icons** — Notion's `cloudy_orange` page icon and
  `cactus_orange` callout icon are recreated as inline SVGs in the matching
  tint (`components/notion/icons.tsx`).
- **Top-bar / toolbar glyphs** use [lucide-react](https://lucide.dev/).
