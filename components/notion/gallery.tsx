"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { useUi } from "@/lib/i18n/provider";

/* Shared search state for the three card galleries (projects, references,
   certificates): case-insensitive substring filter over a per-item search
   text. The order is fixed — newest first by a stable sort key — so there is
   no sort control to drive; only the query is state. */
export function useGallery<T>(
  items: readonly T[],
  searchText: (item: T) => string,
  sortKey: (item: T) => string,
) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = items.filter(
      (item) => !q || searchText(item).toLowerCase().includes(q),
    );
    return [...list].sort((a, b) => -sortKey(a).localeCompare(sortKey(b)));
    // searchText/sortKey are module-level constants at every call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, query]);

  return { query, setQuery, visible };
}

export function EmptyState() {
  const ui = useUi();
  return (
    <div className="rounded-lg border border-dashed border-[var(--border)] px-4 py-10 text-center text-[14px] text-notion-gray">
      {ui.gallery.empty}
    </div>
  );
}

/* Table-view wrapper shared by the card galleries: rounded card shadow,
   horizontal scroll on narrow viewports instead of squeezing columns. */
export function TableShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{ boxShadow: "var(--notion-card-shadow)" }}
      className="overflow-hidden rounded-lg bg-[var(--surface)]"
    >
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

/* What a card cover is actually laid out at, for the `sizes` of every image
   inside a GalleryGrid. The browser picks the variant it downloads from this
   string alone — it resolves `sizes` long before it knows the box — so an
   overstated width costs bytes on every card and an understated one costs
   sharpness.
   The grid is repeat(auto-fill, minmax(240px, 1fr)) with a 16px gap, and the
   column it sits in differs per page: on the home page the galleries are in
   the right-hand column beside the 210px sidebar (612px at desktop → two
   columns of 298px), on /certificates the full 980px page (916px → three
   columns of 295px). Both land near 300px, so one string covers them; the
   steps below track the points where the column count changes and never
   understate either layout.

   The narrowest step is the content column, not the viewport, for the same
   reason the portrait in app/[locale]/page.tsx spells its own out: below `sm`
   both pages give <main> 24px of padding a side, so a card on a 412px phone is
   364px wide, not 412. Claiming the full viewport rounded every tile up one
   srcset step — 750w files for a box that needs 640w — which Lighthouse
   measured as 70 KiB of overshoot across a certificates gallery. Writing it as
   calc() also keeps the small variants reachable: next/image floors the ladder
   at deviceSizes[0] × the smallest bare vw figure in the string, so a plain
   `100vw` would leave nothing below 640w to choose from either. */
export const CARD_COVER_SIZES =
  "(max-width: 543px) calc(100vw - 3rem), (max-width: 767px) 50vw, (max-width: 847px) 60vw, 300px";

export function GalleryGrid({
  wide = false,
  children,
}: {
  /** 280px min column (skills) instead of the default 240px (cards). */
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid gap-4",
        wide
          ? "[grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]"
          : "[grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]",
      )}
    >
      {children}
    </div>
  );
}
