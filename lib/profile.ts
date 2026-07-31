/* The handful of profile facts that are the same in every language.
 *
 * Kept apart from lib/content/* so client components (the top bar, the 404
 * page) can use them without pulling the whole content tree — projects,
 * certificates and testimonials — into the browser bundle. */

export const profileName = "Nikita Petrich";
export const profileRole = "Senior Full-Stack & AI Engineer";
export const bookingUrl =
  "https://calendar.notion.so/meet/petrichnikita/erstgespraech-30-min";
export const siteUrl = "https://sequenz.io";
/** Primary brand colour; mirrors `--primary` in app/globals.css. */
export const accentColor = "#ff9900";
