/* The handful of profile facts that are the same in every language.
 *
 * Kept apart from lib/content/* so client components (the top bar, the 404
 * page) can use them without pulling the whole content tree — projects,
 * certificates and testimonials — into the browser bundle. */

import type { Availability } from "@/lib/availability";
import type { Locale } from "@/lib/i18n/config";

export const profileName = "Nikita Petrich";
export const profileRole = "Senior Full-Stack & AI Engineer";

/* Scheduling links are localized: each language points at its own booking
   page so the visitor lands in the right one. */
const bookingUrls: Record<Locale, string> = {
  de: "https://calendar.notion.so/meet/petrichnikita/erstgespraech-30-minuten",
  en: "https://calendar.notion.so/meet/petrichnikita/initial-consultation-30-minutes",
};

export function bookingUrlFor(locale: Locale): string {
  return bookingUrls[locale];
}

/** Default (German) booking URL — used where no locale is at hand. */
export const bookingUrl = bookingUrls.de;

/* Identity values that appear in more than one place — the sidebar, the
   imprint, the machine-readable profile feed and every application signature
   built from it. Kept here so a changed number is changed once. */
export const contactPhone = "+49 15679088678";
export const contactEmail = "n.petrich@sequenz.io";
export const vatId = "DE368159064";

/* The business location an application is signed from. Deliberately not the
   postal address in the imprint (Aresing): that one is a legal requirement,
   this one is where the work happens and where an on-site day starts. */
export const profileLocation: Record<Locale, string> = {
  de: "München, Deutschland",
  en: "Munich, Germany",
};

/* The rate, stated openly. "On request" costs a round trip to find out the
   answer both sides could have had up front, so the figure is public — as a
   starting point, because the scope decides the rest. */
export const rate = {
  hourlyEur: 80,
  dailyEur: 640,
  label: {
    de: "ab 80 €/h · ab 640 €/Tag · projektabhängig",
    en: "from €80/h · from €640/day · project-dependent",
  } as Record<Locale, string>,
};

/* The availability figures as numbers rather than prose. The sidebar renders a
   sentence from them and /api/profile.json publishes them unrounded, because an
   agent filling in a "capacity %" field cannot parse "Vollzeit" reliably and
   must not have to guess.

   From when and in what capacity is project-pilot's to say: lib/availability.ts
   reads it from there. `fallback` is only what the site shows while that source
   cannot be reached or has nothing set, so keep it a value that is safe to show
   for a while. The on-site ceiling and employee leasing stay maintained here. */
export const availability = {
  fallback: { from: null, scope: "full_time", hoursPerWeek: null } as Availability,
  /** Ceiling on presence, whatever a listing asks for. */
  onsiteMaxPercent: 30,
  /** Arbeitnehmerüberlassung — asked for often enough to answer up front. */
  employeeLeasing: true,
};

export const siteUrl = "https://sequenz.io";
/** Primary brand colour; mirrors `--primary` in app/globals.css. */
export const accentColor = "#ff9900";
