#!/usr/bin/env python3
"""Render the CV's "Referenzen" addendum as one self-contained HTML page.

The page reuses the exact geometry and design tokens measured from the existing
CV (Letter 8.5x11in, L/R margin 43.5pt, header rule y=61.5pt, footer rule
y=768pt; header 7.4pt #7A7A7A with #C9622A links; card bg #FAF7F2 / border
#ECE7E0; accent #C9622A) so the appended page reads as native. Content comes
from lib/references.json — the same source the website renders — so both stay in
sync. Inter is embedded (data URI) since it is not a system font.
"""
from __future__ import annotations

import base64
import html
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent  # repo root
SITE = "https://sequenz.io"


def _b64(path: Path) -> str:
    return base64.b64encode(path.read_bytes()).decode()


def _esc(s: str) -> str:
    return html.escape(s, quote=True)


def _initials(name: str) -> str:
    parts = name.split()
    return (parts[0][0] + (parts[1][0] if len(parts) > 1 else "")).upper()


def build_html() -> str:
    data = json.loads((ROOT / "lib" / "references.json").read_text(encoding="utf-8"))
    sources = data["sources"]
    refs = sorted(data["references"], key=lambda r: r["sort"], reverse=True)

    font_normal = _b64(HERE / "fonts" / "inter-latin-normal.woff2")
    font_italic = _b64(HERE / "fonts" / "inter-latin-italic.woff2")

    def source_tags(names: list[str]) -> str:
        out = []
        for n in names:
            meta = sources[n]
            out.append(
                f'<a class="src" href="{_esc(meta["href"])}">{_esc(meta["label"])}'
                f'<span class="ext">&#8599;</span></a>'
            )
        return "".join(out)

    cards = []
    for r in refs:
        anchor = f'{SITE}/#referenz-{r["slug"]}'
        company = f' &middot; {_esc(r["company"])}' if r.get("company") else ""
        cards.append(f'''
      <article class="ref">
        <div class="rhead">
          <div class="who">
            <span class="ava">{_esc(_initials(r["name"]))}</span>
            <div>
              <div class="name">{_esc(r["name"])}</div>
              <div class="role">{_esc(r["role"])}{company}</div>
            </div>
          </div>
          <div class="tags">
            <span class="tag">{_esc(r["relation"])}</span>
            <span class="tag">{_esc(r["project"])}</span>
          </div>
        </div>
        <blockquote class="quote"><span class="qm">&#8220;</span>{_esc(r["short"])}<span class="qm">&#8221;</span></blockquote>
        <div class="rfoot">
          <span class="quelle">Quelle: {source_tags(r["sources"])}</span>
          <a class="cta" href="{_esc(anchor)}">Vollständige Referenz auf sequenz.io ansehen <span class="ext">&#8599;</span></a>
        </div>
      </article>''')

    cards_html = "\n".join(cards)

    return f'''<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<style>
@font-face{{font-family:'Inter';font-style:normal;font-weight:100 900;font-display:block;src:url(data:font/woff2;base64,{font_normal}) format('woff2');}}
@font-face{{font-family:'Inter';font-style:italic;font-weight:100 900;font-display:block;src:url(data:font/woff2;base64,{font_italic}) format('woff2');}}
@page{{size:8.5in 11in;margin:0;}}
*{{margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
html{{font-family:'Inter',Arial,sans-serif;color:#2B2B2B;-webkit-font-smoothing:antialiased;}}

.page{{position:relative;width:8.5in;height:11in;overflow:hidden;}}
.header .stand{{position:absolute;top:16pt;right:43.5pt;font-style:italic;font-size:6.8pt;color:#A3A398;letter-spacing:.01em;}}
.header .l1{{position:absolute;top:27.5pt;left:43.5pt;right:43.5pt;text-align:center;font-size:7.4pt;color:#7A7A7A;}}
.header .l2{{position:absolute;top:37.8pt;left:43.5pt;right:43.5pt;text-align:center;font-size:7.4pt;color:#7A7A7A;}}
.header .rule{{position:absolute;top:61.5pt;left:43.5pt;right:43.5pt;height:.8pt;background:#ECE7E0;}}
.header a{{color:#C9622A;text-decoration:none;}}
.footer .rule{{position:absolute;top:768pt;left:43.5pt;right:43.5pt;height:.8pt;background:#ECE7E0;}}

.content{{position:absolute;top:74pt;left:43.5pt;right:43.5pt;bottom:32pt;}}
.title{{font-size:13.5pt;font-weight:700;color:#161616;letter-spacing:-.01em;line-height:1.15;}}
.subtitle{{font-size:7.7pt;color:#8A8A8A;margin-top:2.5pt;}}
.subtitle a{{color:#C9622A;text-decoration:none;}}
.list{{margin-top:9pt;}}

.ref{{break-inside:avoid;background:#FAF7F2;border:.7pt solid #ECE7E0;border-radius:6pt;padding:7.5pt 10pt 7pt;margin-bottom:6.5pt;}}
.rhead{{display:flex;justify-content:space-between;align-items:flex-start;gap:10pt;}}
.who{{display:flex;align-items:center;gap:7pt;min-width:0;}}
.ava{{flex:0 0 auto;width:19pt;height:19pt;border-radius:50%;background:#F0E8DD;color:#6F5B3E;font-size:7.4pt;font-weight:700;display:flex;align-items:center;justify-content:center;}}
.name{{font-size:9pt;font-weight:700;color:#161616;line-height:1.2;}}
.role{{font-size:6.9pt;color:#7A7A7A;line-height:1.3;margin-top:.5pt;}}
.tags{{display:flex;flex-wrap:wrap;gap:4pt;justify-content:flex-end;max-width:54%;}}
.tag{{background:#F0E8DD;color:#6F5B3E;font-size:6.4pt;font-weight:600;padding:1.5pt 5pt;border-radius:3pt;white-space:nowrap;}}
.quote{{margin-top:5.5pt;font-size:7.9pt;line-height:1.5;color:#2B2B2B;}}
.qm{{color:#C9622A;font-weight:700;}}
.rfoot{{margin-top:5.5pt;padding-top:5pt;border-top:.7pt solid #ECE7E0;display:flex;justify-content:space-between;align-items:center;gap:10pt;flex-wrap:wrap;}}
.quelle{{font-size:6.8pt;color:#7A7A7A;display:inline-flex;align-items:center;gap:4pt;}}
.src{{color:#4A473F;background:#EFEEEC;font-size:6.7pt;font-weight:600;padding:1pt 5pt;border-radius:3pt;text-decoration:none;display:inline-flex;align-items:center;gap:2pt;}}
.cta{{color:#C9622A;font-size:6.9pt;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:3pt;}}
.ext{{font-size:.86em;opacity:.85;}}
</style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="stand">Stand: Juli 2026</div>
      <div class="l1">Nikita Petrich &middot; Senior Full-Stack &amp; AI Engineer</div>
      <div class="l2">München, Deutschland &middot; +49 15679088678 &middot; <a href="mailto:n.petrich@sequenz.io">n.petrich@sequenz.io</a> &middot; <a href="https://sequenz.io">sequenz.io</a> &middot; <a href="https://linkedin.com/in/nikita-petrich">linkedin.com/in/nikita-petrich</a></div>
      <div class="rule"></div>
    </div>
    <div class="footer"><div class="rule"></div></div>

    <div class="content">
      <h1 class="title">Referenzen</h1>
      <div class="subtitle">Empfehlungen von Kund:innen und Kolleg:innen &middot; jede Referenz ist online nachprüfbar unter <a href="{SITE}/#referenzen">sequenz.io/#referenzen</a></div>
      <div class="list">
{cards_html}
      </div>
    </div>
  </div>
</body>
</html>'''


if __name__ == "__main__":
    import sys

    out = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / "referenzen.html"
    out.write_text(build_html(), encoding="utf-8")
    print("wrote", out)
