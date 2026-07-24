# CV builder — Referenzen addendum

Generates `public/cv/CV_Nikita_Petrich_DE.pdf` by taking the authoritative CV
design and appending a **Referenzen** (testimonials) page whose entries link
back to the matching cards on the website (`sequenz.io/#referenz-<slug>`).

The references themselves live in [`lib/references.json`](../../lib/references.json) —
the **single source** the website (`components/notion/references.tsx`) and this
CV page both read, so they never drift.

## Layout

```
scripts/cv/
├─ build_cv.py            # orchestrator (run this)
├─ references_page.py     # renders lib/references.json -> print-ready HTML
├─ base/
│  └─ CV_Nikita_Petrich_DE.pdf   # authoritative 10-page design, WITHOUT references
└─ fonts/
   ├─ inter-latin-normal.woff2   # embedded so the page matches the CV typeface
   └─ inter-latin-italic.woff2
```

## Build

```bash
pip install pymupdf                 # once
python3 scripts/cv/build_cv.py      # -> public/cv/CV_Nikita_Petrich_DE.pdf
```

Needs a Chromium/Chrome binary (found via `$CHROMIUM`, `$CHROME`,
`$PLAYWRIGHT_BROWSERS_PATH`, or `PATH`) to print the HTML to PDF with real,
clickable hyperlinks.

What it does:

1. Render `lib/references.json` to a self-contained HTML page (`references_page.py`).
2. Print it to PDF with headless Chromium.
3. Recompress oversized cover images in the base (>240 DPI → 200 DPI, ~20 MB → ~4 MB).
4. Append the references page and restamp every footer to `Seite X / N`.

## Editing content

- **Reference text, sources, order** → edit `lib/references.json`, re-run the build.
  This updates the website automatically and the CV on the next build.
- **The design itself** (pages 1–10) → re-export the source design to
  `base/CV_Nikita_Petrich_DE.pdf` (Chrome → *Save as PDF*, Letter), then re-run.
  The page geometry constants in `references_page.py` / `build_cv.py`
  (margins, header/footer y-positions) were measured from this design; adjust
  them if the design’s margins change.
