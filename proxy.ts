import { NextResponse, type NextRequest } from "next/server";

import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  defaultLocale,
  isLocale,
  localePath,
  matchLocale,
} from "@/lib/i18n/config";

/* Locale routing.
 *
 * Every page lives under a locale prefix (/de/…, /en/…), so each language has
 * exactly one canonical address and neither is the silent default. A request
 * without a prefix is sent to the visitor's language, determined in this
 * order:
 *
 *   1. the NEXT_LOCALE cookie — an explicit choice from the language switcher,
 *   2. the Accept-Language header sent by the browser,
 *   3. English, as the fallback when neither says anything usable.
 *
 * The redirect is temporary (307) on purpose: the target depends on who is
 * asking, so it must never be cached as a permanent move. The unprefixed URLs
 * therefore keep working — every link, PDF and search result that points at
 * /certificates/<slug> still lands on that certificate.
 *
 * See node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
 * (the `middleware` convention was renamed to `proxy` in Next 16). */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const [, first = ""] = pathname.split("/");
  if (isLocale(first)) {
    /* Keep the cookie in step with the URL, so following a shared /en/… link
       and then navigating on stays in that language. */
    const response = NextResponse.next();
    if (request.cookies.get(LOCALE_COOKIE)?.value !== first) {
      response.cookies.set(LOCALE_COOKIE, first, {
        path: "/",
        maxAge: LOCALE_COOKIE_MAX_AGE,
        sameSite: "lax",
      });
    }
    return response;
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookieLocale)
    ? cookieLocale
    : (matchLocale(request.headers.get("accept-language")) ?? defaultLocale);

  const url = request.nextUrl.clone();
  url.pathname = localePath(locale, pathname);
  url.search = search;
  return NextResponse.redirect(url, 307);
}

export const config = {
  /* Pages only. Excluded are Next's own assets, the analytics proxy, the
     generated metadata routes (icon, social card, robots, sitemap) and
     everything served straight from /public — certificate PDFs, CVs and images
     must stay reachable at their own permanent URLs, which carry no locale.
     Files under /public are recognised by their extension. */
  matcher: [
    "/((?!_next/|api/|icon|opengraph-image|robots\\.txt|sitemap\\.xml|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
