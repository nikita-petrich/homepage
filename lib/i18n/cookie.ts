import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, type Locale } from "./config";

/* Remembers an explicit language choice in the browser.
 *
 * proxy.ts reads this cookie to send an unprefixed URL — a shared
 * /certificates/<slug> link, say — to the language the visitor picked. It is
 * strictly necessary for that choice (§ 25 Abs. 2 Nr. 2 TDDDG), carries no
 * identifier, and is declared in the privacy policy.
 *
 * The proxy sets the same cookie on the response to a prefixed URL; writing it
 * here as well means the preference is in place immediately, before any
 * further request goes out. */
export function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${LOCALE_COOKIE_MAX_AGE};samesite=lax`;
}
