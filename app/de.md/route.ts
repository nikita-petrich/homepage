import { markdownResponse } from "@/lib/feed-response";

/* The German profile page as markdown, a sibling of /de — see
   lib/profile-feed.ts for why it exists and /llms.txt for the signpost. */
export const dynamic = "force-static";

export function GET(): Response {
  return markdownResponse("de");
}
