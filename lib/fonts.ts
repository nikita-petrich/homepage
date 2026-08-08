import localFont from "next/font/local";

/* Geist Mono, declared here rather than imported from `geist/font/mono`.
 *
 * The packaged export is `localFont({...})` with the `preload` default, so it
 * emits `<link rel=preload as=font>` into every document — 70 KiB fetched at
 * the highest priority the browser has, ahead of the portrait that is the
 * page's LCP element.
 *
 * Nothing on a phone renders it. The only two places that ask for `font-mono`
 * are the cover banner's code panel, which is `hidden` below the `sm`
 * breakpoint (components/notion/cover-banner.tsx), and the caption of a project
 * card that has no cover image (components/notion/projects.tsx). At Lighthouse's
 * 412px mobile viewport the first is display:none and the second is a fallback
 * that most cards never reach — so the font was 70 KiB of critical-path
 * bandwidth spent on glyphs that are never painted.
 *
 * `preload: false` leaves the @font-face in the stylesheet: the browser still
 * fetches it, but only once layout finds an element that actually uses it, and
 * at the priority such a late discovery deserves. Desktop paints the code panel
 * in the fallback mono stack for one swap. That stack (declared below and in
 * `--font-mono`, app/globals.css) is all system fonts, so the swap costs no
 * fetch — and the panel is a fixed-percentage flex column of `leading-none`
 * lines, so different glyph widths reflow nothing outside it.
 *
 * Everything else matches geist/font/mono's own configuration, so the CSS
 * variable and the fallback chain are unchanged. */
export const GeistMono = localFont({
  src: "../node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  adjustFontFallback: false,
  fallback: [
    "ui-monospace",
    "SFMono-Regular",
    "Roboto Mono",
    "Menlo",
    "Monaco",
    "Liberation Mono",
    "DejaVu Sans Mono",
    "Courier New",
    "monospace",
  ],
  weight: "100 900",
  preload: false,
});
