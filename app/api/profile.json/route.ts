import { getAvailability } from "@/lib/availability";
import { FEED_CACHE_CONTROL } from "@/lib/feed-response";
import { profileJson } from "@/lib/profile-feed";

/* The figures the markdown twin carries only as prose: availability, capacity,
   the on-site ceiling, the rate, and the two sentences that quote them. The
   availability is project-pilot's and revalidates every five minutes. */
export const dynamic = "force-static";
export const revalidate = 300;

export async function GET(): Promise<Response> {
  return new Response(JSON.stringify(profileJson(await getAvailability()), null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": FEED_CACHE_CONTROL,
    },
  });
}
