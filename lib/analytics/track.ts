/* Central funnel for all analytics events (stage 1: cookieless Umami).
 *
 * No component ever talks to a vendor SDK directly — everything goes through
 * track(). Only scalar properties are accepted (data minimisation: no free
 * text, no nested objects). Events fired before the Umami script has loaded
 * are buffered in a small in-memory queue and flushed on script load; the
 * queue is never persisted to storage (§ 25 TDDDG).
 */

import { statisticsAllowed } from "./consent";

export type EventProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: { track: (name: string, props?: EventProps) => void };
  }
}

const pending: Array<{ name: string; props?: EventProps }> = [];
const MAX_PENDING = 50;

export function track(name: string, props?: EventProps) {
  if (typeof window === "undefined") return;
  if (!statisticsAllowed()) return;

  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", name, props ?? {});
  }

  if (window.umami) {
    window.umami.track(name, props);
  } else if (pending.length < MAX_PENDING) {
    pending.push({ name, props });
  }
}

/* Called from the analytics provider once the Umami script has loaded. */
export function flushPending() {
  if (!window.umami || !statisticsAllowed()) {
    pending.length = 0;
    return;
  }
  while (pending.length) {
    const e = pending.shift();
    if (e) window.umami.track(e.name, e.props);
  }
}

/* "https://www.linkedin.com/in/x" → "linkedin.com" (domain only — never full
   URLs, they can carry query parameters). */
export function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "invalid";
  }
}
