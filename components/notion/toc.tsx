"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import type { TocItem } from "@/lib/data";
import { useUi } from "@/lib/i18n/provider";
import { track } from "@/lib/analytics/track";

export function TableOfContents({ items }: { items: TocItem[] }) {
  const ui = useUi();
  const [active, setActive] = useState<string>(items[0]?.id ?? "");
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      let current = items[0]?.id ?? "";
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= 130) current = item.id;
      }
      setActive(current);
    };

    /* Coalesced to one measurement per frame. `measure` reads the box of every
       section, which forces layout, and scroll fires far more often than the
       page paints — during a smooth or fling scroll that was a full layout pass
       per event for no extra fidelity. */
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  /* A hover flyout, so it is only rendered where hovering exists: on a touch
     tablet the dots were permanently visible but the panel could never be
     opened. `lg` also keeps the open panel out of the 960px text column, which
     it covered by ~190px at the md breakpoint. */
  return (
    <div
      className="fixed top-1/2 right-0 z-40 hidden -translate-y-1/2 lg:pointer-fine:block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      /* Focus anywhere inside opens the panel — except on the toggle itself.
         Opening there too made the button undo its own purpose: tabbing to it
         opened the panel, so the Enter that a keyboard visitor presses next
         toggled it straight back shut. The control announces `aria-expanded`
         and has to behave like it, so focus lands on a closed panel and the
         press is what opens it. Everything past the button — the entries
         themselves — still opens on focus, which is what keeps the panel up
         while tabbing through them. */
      onFocusCapture={(e) => {
        // React types a bubbled focus target as the div it is declared on.
        if ((e.target as Node) !== toggleRef.current) setOpen(true);
      }}
      onBlurCapture={(e) => {
        // Close only when focus leaves the whole widget (keyboard access).
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="sr-only focus:not-sr-only focus:absolute focus:top-1/2 focus:right-2 focus:z-50 focus:-translate-y-1/2 focus:rounded-md focus:bg-[var(--surface)] focus:px-2 focus:py-1 focus:text-[12px] focus:shadow-md"
      >
        {ui.common.toc}
      </button>
      <nav
        className={cn(
          /* Named properties rather than `transition-all`: the panel only ever
             changes opacity, offset and visibility, and `all` additionally put
             every inherited colour and its box-shadow on the main thread.
             The offset is `translate`, not `transform` — Tailwind v4 compiles
             translate-x-* to the standalone property, which `transform` in a
             transition list does not cover. */
          "absolute top-1/2 right-2 min-w-[190px] -translate-y-1/2 rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] p-1.5 shadow-[rgba(15,15,15,0.08)_0px_4px_16px] transition-[opacity,translate,visibility] duration-150",
          open
            ? "visible translate-x-0 opacity-100"
            : "invisible translate-x-1 opacity-0",
        )}
        aria-label={ui.common.toc}
      >
        {/* Real anchors, not buttons: every section gets a shareable URL
            (/#projects), can be copied, middle-clicked or opened in a new tab,
            and deep links keep working without JavaScript. The scroll offset
            under the sticky top bar comes from `scroll-mt-20` on each Section,
            the easing from `scroll-smooth` on <html>.

            next/link rather than a bare <a>: a browser-native hash navigation
            writes a history entry the router knows nothing about, and on the
            way back Next then keeps the current tree — which still holds an
            open @modal slot, so a project dialog opened from "#projects" could
            never be closed again. Link routes the click through the router, so
            the entry carries its FlightRouterState and the slot resets. */}
        {items.map((item) => (
          <Link
            key={item.id}
            href={`#${item.id}`}
            /* Same as the section headings in ./blocks.tsx: a hash resolves to
               the tree that is already here, so the prefetch is a request for
               the current page. */
            prefetch={false}
            onClick={() => track("toc_navigate", { section_id: item.id })}
            aria-current={active === item.id ? "location" : undefined}
            className={cn(
              "block w-full truncate rounded-md px-2 py-[5px] text-left text-[13px] leading-[1.3] transition-colors hover:bg-[var(--surface-hover)]",
              item.level === 2 && "pl-4",
              active === item.id
                ? "font-medium text-notion-text"
                : "text-notion-gray",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div
        aria-hidden
        className={cn(
          "flex flex-col items-end gap-[9px] py-3 pr-[14px] pl-7 transition-opacity duration-150",
          open ? "opacity-0" : "opacity-100",
        )}
      >
        {items.map((item) => (
          <span
            key={item.id}
            /* One fixed width scaled from the right edge, rather than an
               animated `width`. Both read identically (15px active, 12px at
               scale 0.8) but a scale is composited, where a width transition
               relaid out the whole widget on every frame — twelve of them, on
               every scroll that moved the active section. The transition names
               `scale`: Tailwind v4 compiles scale-x-* to the standalone
               property rather than to `transform`. */
            className={cn(
              "h-[2px] w-[15px] origin-right rounded-full transition-[scale] duration-200",
              active === item.id
                ? "scale-x-100 bg-notion-text"
                : "scale-x-[0.8] bg-[var(--border)]",
            )}
          />
        ))}
      </div>
    </div>
  );
}
