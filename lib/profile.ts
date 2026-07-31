/* The handful of profile facts that are the same in every language.
 *
 * Kept apart from lib/content/* so client components (the top bar, the 404
 * page) can use them without pulling the whole content tree — projects,
 * certificates and testimonials — into the browser bundle. */

import type { Locale } from "@/lib/i18n/config";

export const profileName = "Nikita Petrich";
export const profileRole = "Senior Full-Stack & AI Engineer";

/* Scheduling links are localized: each language points at its own booking
   page so the visitor lands in the right one. */
export const bookingUrls: Record<Locale, string> = {
  de: "https://calendar.notion.so/meet/petrichnikita/erstgespraech-30-min",
  en: "https://calendar.notion.so/meet/petrichnikita/initial-consultation-30-min",
};

export function bookingUrlFor(locale: Locale): string {
  return bookingUrls[locale];
}

/** Default (German) booking URL — used where no locale is at hand. */
export const bookingUrl = bookingUrls.de;

export const siteUrl = "https://sequenz.io";
/** Primary brand colour; mirrors `--primary` in app/globals.css. */
export const accentColor = "#ff9900";
