import { markdownResponse } from "@/lib/feed-response";

/* The English profile page as markdown, a sibling of /en. */
export const dynamic = "force-static";
/* The availability in it is live (lib/availability.ts). */
export const revalidate = 300;

export function GET(): Promise<Response> {
  return markdownResponse("en");
}
