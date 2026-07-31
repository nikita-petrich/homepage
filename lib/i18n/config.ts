/* Locale configuration — the single source of truth for which languages exist,
 * how they are detected and how a path is built for one of them.
 *
 * Deliberately free of any dependency (no React, no next/*), because proxy.ts
 * imports it and runs before rendering.
 */

export const locales = ["de", "en"] as const;

export type Locale = (typeof locales)[number];

/* Fallback when the visitor's language cannot be determined. English, so a
   visitor whose browser announces neither German nor English still gets a page
   they can read. */
export const defaultLocale: Locale = "en";

/* Remembers an explicit choice from the language switcher. `NEXT_LOCALE` is the
   conventional name and is what the switcher writes. */
export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const localeMeta: Record<
  Locale,
  {
    /** Native name, as shown in the language menu. */
    label: string;
    /** Two-letter code on the switcher button. */
    short: string;
    /** `lang` attribute of <html>. */
    htmlLang: string;
    /** BCP-47-ish value for og:locale. */
    ogLocale: string;
    flag: string;
  }
> = {
  de: {
    label: "Deutsch",
    short: "DE",
    htmlLang: "de",
    ogLocale: "de_DE",
    flag: "/assets/flags/de.svg",
  },
  en: {
    label: "English",
    short: "EN",
    htmlLang: "en",
    ogLocale: "en_GB",
    flag: "/assets/flags/gb.svg",
  },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/* Absolute site path for `path` in `locale`. Every locale is prefixed
   (/de/…, /en/…), so no language is the silent default and every page has one
   canonical address per language.

   localePath("de", "/")               → "/de"
   localePath("en", "/projects/aitoi") → "/en/projects/aitoi" */
export function localePath(locale: Locale, path = "/"): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}

/* Splits "/en/projects/aitoi" into { locale: "en", path: "/projects/aitoi" }.
   Returns locale `null` for a path that carries no locale prefix. */
export function splitLocalePath(pathname: string): {
  locale: Locale | null;
  path: string;
} {
  const [, first = "", ...rest] = pathname.split("/");
  if (!isLocale(first)) return { locale: null, path: pathname || "/" };
  const path = rest.length ? `/${rest.join("/")}` : "/";
  return { locale: first, path };
}

/* Picks the best supported locale from an Accept-Language header.
 *
 * Parses the quality values by hand rather than pulling in negotiator +
 * intl-localematcher: with two locales the full matcher buys nothing, and the
 * proxy stays dependency-free. Region subtags are matched on their primary
 * language ("de-AT" and "de-CH" are German), and the highest q-value wins. */
export function matchLocale(acceptLanguage: string | null): Locale | null {
  if (!acceptLanguage) return null;

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag = "", ...params] = part.trim().split(";");
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith("q="))
        ?.slice(2);
      const quality = q === undefined ? 1 : Number.parseFloat(q);
      return {
        language: tag.trim().toLowerCase().split("-")[0] ?? "",
        quality: Number.isFinite(quality) ? quality : 0,
      };
    })
    .filter((entry) => entry.language && entry.quality > 0)
    .sort((a, b) => b.quality - a.quality);

  for (const { language } of ranked) {
    if (isLocale(language)) return language;
    // "*" means "anything is fine" — take the fallback rather than guessing.
    if (language === "*") return defaultLocale;
  }
  return null;
}
