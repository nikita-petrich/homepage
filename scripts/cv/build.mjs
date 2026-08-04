#!/usr/bin/env node
/* Renders the CV PDFs from scripts/cv/content.mjs.
 *
 *   node scripts/cv/build.mjs            → public/cv/CV_Nikita_Petrich_{DE,EN}.pdf
 *   node scripts/cv/build.mjs --html     → keep the intermediate HTML for a look
 *
 * Chromium is the renderer (the same engine the previous PDFs were printed
 * with), driven headless over the CLI so the script needs no extra dependency.
 * Fonts and images are inlined as data URIs, so the HTML is self-contained and
 * the print run never has to resolve a file path. */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { cv } from "./content.mjs";
import { renderCv } from "./template.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const out = join(root, "public/cv");
const tmp = join(root, ".cv-build");

const FILES = { de: "CV_Nikita_Petrich_DE.pdf", en: "CV_Nikita_Petrich_EN.pdf" };

function dataUri(path, mime) {
  return `data:${mime};base64,${readFileSync(path).toString("base64")}`;
}

/** Chromium ships in the Playwright browser pool in CI and in this container. */
function chromium() {
  const fromEnv = process.env.CHROME_PATH;
  if (fromEnv && existsSync(fromEnv)) return fromEnv;

  const pool = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  if (existsSync(pool)) {
    for (const entry of readdirSync(pool)) {
      const candidate = join(pool, entry, "chrome-linux/chrome");
      if (entry.startsWith("chromium-") && existsSync(candidate)) return candidate;
    }
  }
  for (const candidate of ["/usr/bin/chromium", "/usr/bin/google-chrome"]) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error("No Chromium found — set CHROME_PATH to a Chrome/Chromium binary.");
}

const fontDir = join(root, "node_modules/geist/dist/fonts/geist-sans");
const assets = {
  fonts: {
    regular: dataUri(join(fontDir, "Geist-Regular.woff2"), "font/woff2"),
    medium: dataUri(join(fontDir, "Geist-Medium.woff2"), "font/woff2"),
    semibold: dataUri(join(fontDir, "Geist-SemiBold.woff2"), "font/woff2"),
    bold: dataUri(join(fontDir, "Geist-Bold.woff2"), "font/woff2"),
  },
  profile: dataUri(join(root, "public/assets/profile.jpg"), "image/jpeg"),
  covers: Object.fromEntries(
    readdirSync(join(root, "public/assets/projects")).map((file) => [
      file,
      dataUri(join(root, "public/assets/projects", file), "image/jpeg"),
    ]),
  ),
};

const keepHtml = process.argv.includes("--html");

mkdirSync(out, { recursive: true });
mkdirSync(tmp, { recursive: true });

for (const [locale, file] of Object.entries(FILES)) {
  const html = renderCv(cv[locale], assets);
  const htmlPath = join(tmp, `cv-${locale}.html`);
  writeFileSync(htmlPath, html);

  execFileSync(
    chromium(),
    [
      "--headless",
      "--no-sandbox",
      "--disable-gpu",
      "--font-render-hinting=none",
      "--virtual-time-budget=4000",
      "--run-all-compositor-stages-before-draw",
      "--no-pdf-header-footer",
      `--print-to-pdf=${join(out, file)}`,
      `file://${htmlPath}`,
    ],
    { stdio: ["ignore", "ignore", "pipe"] },
  );
  console.log(`✓ public/cv/${file}`);
}

if (!keepHtml) rmSync(tmp, { recursive: true, force: true });
else console.log(`  HTML kept in ${tmp}`);
