import { profileMarkdown } from "./profile-feed";
import type { Locale } from "./i18n/config";

/* One response shape for the markdown twins, so /de.md and /en.md cannot drift
   apart in anything but their locale.

   Cached like the page itself: the content is compiled into the build, so a new
   profile means a new deployment either way. `s-maxage` lets the edge hold it;
   `stale-while-revalidate` means a reader never waits on a revalidation. */
export function markdownResponse(locale: Locale): Response {
  return new Response(profileMarkdown(locale), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
