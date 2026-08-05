"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* A <Link> that prefetches on intent (hover, touch, keyboard focus) instead of
 * on entering the viewport.
 *
 * The home page lists nine projects, nine testimonials and nine certificates,
 * every card a link into an intercepting route. Next prefetches links as they
 * scroll into view, and because each card route is intercepted the router asks
 * for it several times over — 117 RSC requests, 549 KiB, for 28 distinct
 * routes. On a normal viewport they trickle in during a scroll to the bottom;
 * anything that shows the whole page at once (a tall window, printing, and
 * notably Lighthouse's full-page screenshot, which resizes the viewport to the
 * full ~12,500px document height) fires all of them in one burst.
 *
 * The prefetch is issued through the router rather than by flipping `prefetch`
 * back to `null` on hover, which is the shorter pattern the bundled guide shows
 * under "Hover-triggered prefetch": by the time intent is shown the card is
 * long since inside the viewport, so Link's IntersectionObserver has already
 * fired and never fires again — the prefetch simply never happens. This is the
 * guide's "Manual prefetch" instead
 * (node_modules/next/dist/docs/01-app/02-guides/prefetching.md), which asks for
 * the route outright. Navigation still feels instant: the payload is fetched on
 * the way to the click, not for cards nobody looks at. */
export function IntentLink({
  onMouseEnter,
  onFocus,
  onTouchStart,
  ...props
}: React.ComponentProps<typeof Link>) {
  const router = useRouter();
  const prefetched = useRef(false);
  const { href } = props;

  const prefetch = useCallback(() => {
    if (prefetched.current || typeof href !== "string") return;
    prefetched.current = true;
    router.prefetch(href);
  }, [router, href]);

  return (
    <Link
      {...props}
      prefetch={false}
      onMouseEnter={(e) => {
        prefetch();
        onMouseEnter?.(e);
      }}
      onFocus={(e) => {
        prefetch();
        onFocus?.(e);
      }}
      onTouchStart={(e) => {
        prefetch();
        onTouchStart?.(e);
      }}
    />
  );
}
