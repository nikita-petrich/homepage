import { markdownResponse } from "@/lib/feed-response";

/* The English profile page as markdown, a sibling of /en. */
export const dynamic = "force-static";

export function GET(): Response {
  return markdownResponse("en");
}
