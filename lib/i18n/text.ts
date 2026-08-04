import type { Locale } from "./config";

/* Bilingual strings, kept side by side in the source.
 *
 * Content and UI copy are written once, with both languages in the same place:
 *
 *   name: t("Zertifikate", "Certificates")
 *
 * `localize()` then walks a whole content tree and replaces every marker with
 * the string for one locale, so components keep receiving plain objects with
 * plain strings and never have to know a locale exists. Keeping the two
 * languages adjacent (instead of in two mirrored files) is what stops them
 * from drifting apart when content is edited.
 *
 * The `__i18n` brand makes the marker unambiguous at runtime — a plain
 * `{ de, en }` object could just as well be real data (a lookup table keyed by
 * language, say), and would then be silently collapsed to a string. */
export type I18nText = {
  readonly __i18n: "text";
  readonly de: string;
  readonly en: string;
};

export function t(de: string, en: string): I18nText {
  return { __i18n: "text", de, en };
}

/* The same value with every I18nText leaf replaced by a string: the shape a
   component sees. Distributes over unions, maps arrays element-wise and keeps
   optional properties optional. */
export type Localized<T> = T extends I18nText
  ? string
  : T extends readonly (infer Item)[]
    ? Localized<Item>[]
    : T extends object
      ? { [K in keyof T]: Localized<T[K]> }
      : T;

function isI18nText(value: unknown): value is I18nText {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { __i18n?: unknown }).__i18n === "text"
  );
}

function localize<T>(value: T, locale: Locale): Localized<T> {
  if (isI18nText(value)) return value[locale] as Localized<T>;

  if (Array.isArray(value)) {
    return value.map((item) => localize(item, locale)) as Localized<T>;
  }

  if (typeof value === "object" && value !== null) {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      out[key] = localize(item, locale);
    }
    return out as Localized<T>;
  }

  return value as Localized<T>;
}

/* Localises once per locale and keeps the result — the content tree is static,
   so every page of a build shares the same two objects. */
export function localizedMemo<T>(source: T): (locale: Locale) => Localized<T> {
  const cache = new Map<Locale, Localized<T>>();
  return (locale) => {
    const cached = cache.get(locale);
    if (cached) return cached;
    const value = localize(source, locale);
    cache.set(locale, value);
    return value;
  };
}

/* Fills {placeholders} in a localised string:
   format("Alle {count} ansehen", { count: 3 }) → "Alle 3 ansehen" */
export function format(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
