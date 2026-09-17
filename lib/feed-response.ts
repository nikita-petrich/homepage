import { getAvailability } from "./availability";
import { profileMarkdown } from "./profile-feed";
import type { Locale } from "./i18n/config";

/* One response shape for the markdown twins, so /de.md and /en.md cannot drift
   apart in anything but their locale.

   Cached like the page itself: most of the content is compiled into the build,
   but the availability is project-pilot's and revalidates every five minutes,
   so the edge may hold a copy no longer than that. `stale-while-revalidate`
   means a reader never waits on a revalidation. */
export const FEED_CACHE_CONTROL = "public, s-maxage=300, stale-while-revalidate=3600";

export async function markdownResponse(locale: Locale): Promise<Response> {
  return new Response(profileMarkdown(locale, await getAvailability()), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": FEED_CACHE_CONTROL,
    },
  });
}
