#!/usr/bin/env python3
"""Build the German CV PDF: base design + appended "Referenzen" page.

Pipeline
--------
1. Render lib/references.json into a print-ready HTML page (references_page.py).
2. Print that HTML to PDF with headless Chromium (real, clickable hyperlinks).
3. Recompress oversized cover images in the base design (>240 DPI -> 200 DPI).
4. Append the references page and restamp every footer to "Seite X / N".
5. Write the result to public/cv/CV_Nikita_Petrich_DE.pdf.

The base at scripts/cv/base/CV_Nikita_Petrich_DE.pdf is the author's authoritative
10-page design *without* references; regenerate that file (Chrome "Save as PDF")
whenever the design itself changes, then re-run this script.

Requirements: Python `pymupdf`, and a Chromium/Chrome binary. The binary is found
via $CHROMIUM, $CHROME, $PLAYWRIGHT_BROWSERS_PATH, or the system PATH.
"""
from __future__ import annotations

import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import fitz  # pymupdf

from references_page import build_html

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
BASE = HERE / "base" / "CV_Nikita_Petrich_DE.pdf"
OUT = ROOT / "public" / "cv" / "CV_Nikita_Petrich_DE.pdf"

# Footer geometry, measured from the source design.
RIGHT = 568.5
FOOT_BASELINE = 780.0
FOOT_SIZE = 7.0
FOOT_COLOR = (0xA3 / 255, 0xA3 / 255, 0x8F / 255)


def find_chromium() -> str:
    for env in ("CHROMIUM", "CHROME", "CHROME_BIN"):
        p = os.environ.get(env)
        if p and Path(p).exists():
            return p
    pw = os.environ.get("PLAYWRIGHT_BROWSERS_PATH")
    if pw:
        cand = Path(pw) / "chromium"
        if cand.exists():
            return str(cand)
        hits = sorted(Path(pw).glob("chromium-*/chrome-linux/chrome"))
        if hits:
            return str(hits[-1])
    for name in ("chromium", "chromium-browser", "google-chrome", "chrome"):
        found = shutil.which(name)
        if found:
            return found
    sys.exit("No Chromium/Chrome binary found. Set $CHROMIUM to its path.")


def print_html_to_pdf(html_path: Path, pdf_path: Path) -> None:
    chrome = find_chromium()
    subprocess.run(
        [
            chrome, "--headless", "--no-sandbox", "--disable-gpu",
            "--hide-scrollbars", "--run-all-compositor-stages-before-draw",
            "--virtual-time-budget=5000", "--no-pdf-header-footer",
            f"--print-to-pdf={pdf_path}", html_path.as_uri(),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    if not pdf_path.exists():
        sys.exit("Chromium did not produce a PDF.")


def main() -> None:
    if not BASE.exists():
        sys.exit(f"Base design not found: {BASE}")

    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        html_path = tmp / "referenzen.html"
        refs_pdf = tmp / "referenzen.pdf"
        html_path.write_text(build_html(), encoding="utf-8")
        print_html_to_pdf(html_path, refs_pdf)

        doc = fitz.open(BASE)
        # Idempotent: already-optimised bases (<=240 DPI) are left untouched.
        doc.rewrite_images(dpi_threshold=240, dpi_target=200, quality=82)
        doc.insert_pdf(fitz.open(refs_pdf))
        total = doc.page_count

        for i, page in enumerate(doc):
            # Redact (not just cover) any existing "Seite X / N" so the stale
            # total is gone from the text layer too. The rect stays below the
            # footer rule at y=768, leaving it intact.
            page.add_redact_annot(fitz.Rect(470, 770.5, 575, 784), fill=(1, 1, 1))
            page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE)
            label = f"Seite {i + 1} / {total}"
            w = fitz.get_text_length(label, fontname="helv", fontsize=FOOT_SIZE)
            page.insert_text(
                (RIGHT - w, FOOT_BASELINE), label,
                fontname="helv", fontsize=FOOT_SIZE, color=FOOT_COLOR,
            )

        OUT.parent.mkdir(parents=True, exist_ok=True)
        doc.save(OUT, garbage=4, deflate=True, clean=True)
        size_mb = OUT.stat().st_size / 1e6
        print(f"wrote {OUT.relative_to(ROOT)} — {total} pages, {size_mb:.2f} MB")


if __name__ == "__main__":
    main()
