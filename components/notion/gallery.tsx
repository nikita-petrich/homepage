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
