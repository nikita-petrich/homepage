import { profileJson } from "@/lib/profile-feed";

/* The figures the markdown twin carries only as prose: availability, capacity,
   the on-site ceiling, the rate, and the two sentences that quote them. */
export const dynamic = "force-static";

export function GET(): Response {
  return new Response(JSON.stringify(profileJson(), null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
