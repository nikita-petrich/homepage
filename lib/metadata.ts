import type { Metadata } from "next";

import {
  defaultLocale,
  localeMeta,
  localePath,
  locales,
  type Locale,
} from "./i18n/config";

export const siteName = "Nikita Petrich";

/* The shared social card rendered by app/[locale]/opengraph-image.tsx, which
   imports these constants so alt text and dimensions live in one place.

   Next attaches a file-convention `opengraph-image` automatically only while a
   route does not declare `openGraph` itself. Every page below builds its own
   block, so the image has to be carried along explicitly — otherwise the
   project, reference and legal pages would share with no preview image at
   all. */
export const ogImageAlt = "Nikita Petrich — Senior Full-Stack & AI Engineer";
export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

/* One card per language: the tagline on it is translated. */
export function ogImageFor(locale: Locale) {
  return {
    url: `${localePath(locale)}/opengraph-image`,
    ...ogImageSize,
    alt: ogImageAlt,
    type: ogImageContentType,
  };
}

/* hreflang map for one page: every language plus x-default, which points at
   the fallback language — the same one proxy.ts falls back to when a visitor's
   browser announces neither German nor English. */
export function alternateLanguages(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[localeMeta[locale].htmlLang] = localePath(locale, path);
  }
  languages["x-default"] = localePath(defaultLocale, path);
  return languages;
}

/* Next.js inherits a parent's *entire* `openGraph` object whenever a route does
   not define one itself (see the bundled reference
   node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md,
   section "Inheriting fields"). Setting only `title`/`description` on a page is
   therefore not enough: every subpage would keep advertising the start page's
   og:url, og:title and og:description, so a shared /projects/<slug> or
   /references/<slug> link previews as the homepage — which defeats the whole
   point of the permanent slug routes.

   Every route builds its own Open Graph block here instead, together with the
   canonical URL that makes its slug the authoritative address for that
   content, and the hreflang alternates that tie the two languages of a page
   together. Paths are resolved against `metadataBase` from the root layout. */
export function pageMetadata({
  locale,
  title,
  description,
  path,
}: {
  locale: Locale;
  /** Page title without the site suffix — `title.template` adds it. */
  title: string;
  description: string;
  /** Site path without the locale prefix, e.g. "/projects/manifest-os". */
  path: string;
}): Metadata {
  /* `title.template` only applies to <title>, not to og:title/twitter:title,
     so the suffix is applied explicitly for the share cards. */
  const shareTitle = `${title} · ${siteName}`;
  const url = localePath(locale, path);
  const ogImage = ogImageFor(locale);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: alternateLanguages(path),
    },
    openGraph: {
      type: "website",
      locale: localeMeta[locale].ogLocale,
      siteName,
      url,
      title: shareTitle,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [ogImage],
    },
  };
}
