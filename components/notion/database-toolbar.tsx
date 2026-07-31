"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  LayoutGrid,
  Search,
  Table2,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useUi } from "@/lib/i18n/provider";
import type { Ui } from "@/lib/i18n/ui";

export type GalleryView = "gallery" | "table";

const VIEW_OPTIONS: {
  key: GalleryView;
  label: (ui: Ui) => string;
  icon: React.ReactNode;
}[] = [
  {
    key: "gallery",
    label: (ui) => ui.gallery.view,
    icon: <LayoutGrid size={14} strokeWidth={1.9} />,
  },
  {
    key: "table",
    label: (ui) => ui.gallery.table,
    icon: <Table2 size={14} strokeWidth={1.9} />,
  },
];

type Props = {
  view: GalleryView;
  onViewChange: (view: GalleryView) => void;
  sortProp: string;
  sortPropIcon: React.ReactNode;
  sortDirLabel: string;
  onToggleSortDir: () => void;
  query: string;
  onQueryChange: (q: string) => void;
};

/* Notion-style toolbar above each gallery: view switcher, sort popover and an
   expandable search field. Only real controls — every element does what it
   announces. */
export function DatabaseToolbar({
  view,
  onViewChange,
  sortProp,
  sortPropIcon,
  sortDirLabel,
  onToggleSortDir,
  query,
  onQueryChange,
}: Props) {
  const ui = useUi();
  const [viewOpen, setViewOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const current = VIEW_OPTIONS.find((o) => o.key === view) ?? VIEW_OPTIONS[0]!;

  return (
    /* relative: the sort popover is anchored to the toolbar rather than to its
       (near-viewport-edge) trigger, so a 300px panel stays on screen at 320px. */
    <div className="relative mb-2 flex items-center justify-end gap-2">
      <div className="relative mr-auto">
        <button
          type="button"
          onClick={() => setViewOpen((v) => !v)}
          aria-label={ui.gallery.switchView}
          aria-haspopup="true"
          aria-expanded={viewOpen}
          className={cn(
            "inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md bg-[var(--surface-chip)] px-2 py-[5px] text-[14px] font-medium transition-colors hover:bg-[var(--surface-hover)]",
            viewOpen && "bg-[var(--hairline)]",
          )}
        >
          <span className="flex h-4 w-4 items-center justify-center">{current.icon}</span>
          {current.label(ui)}
          <ChevronDown size={13} className="text-notion-gray" />
        </button>
        {viewOpen && (
          <ViewPopover
            view={view}
            onChange={onViewChange}
            onClose={() => setViewOpen(false)}
          />
        )}
      </div>

      <div
        className={cn(
          "flex items-center gap-0.5 text-notion-gray",
          // While open, the search field takes the leftover width instead of a
          // fixed one — a fixed 140px pushed the view switcher off screen at 320px.
          searchOpen && "min-w-0 flex-1 sm:flex-none",
        )}
      >
        {searchOpen ? (
          <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md px-1 sm:flex-none">
            <Search size={16} strokeWidth={1.9} className="shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onBlur={() => {
                if (!query) setSearchOpen(false);
              }}
              placeholder={ui.gallery.searchPlaceholder}
              aria-label={ui.gallery.searchLabel}
              className="w-full min-w-0 bg-transparent text-[14px] text-notion-text placeholder:text-notion-gray focus:outline-none sm:w-[190px]"
            />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onQueryChange("");
                setSearchOpen(false);
              }}
              aria-label={ui.gallery.closeSearch}
              className="shrink-0 cursor-pointer rounded p-0.5 hover:bg-[var(--surface-hover)]"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            {/* No positioning context here on purpose — SortPopover anchors to
                the toolbar so it cannot overflow the viewport. */}
            <div>
              <button
                type="button"
                onClick={() => setSortOpen((v) => !v)}
                aria-label={ui.gallery.sort}
                aria-haspopup="true"
                aria-expanded={sortOpen}
                className={cn(
                  "cursor-pointer rounded p-1 text-[var(--blue)] hover:bg-[var(--surface-hover)]",
                  sortOpen && "bg-[color-mix(in_srgb,var(--blue)_10%,transparent)]",
                )}
              >
                <ArrowUpDown size={16} strokeWidth={1.9} />
              </button>
              {sortOpen && (
                <SortPopover
                  prop={sortProp}
                  propIcon={sortPropIcon}
                  dirLabel={sortDirLabel}
                  onToggleDir={onToggleSortDir}
                  onClose={() => setSortOpen(false)}
                />
              )}
            </div>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={ui.gallery.search}
              className="cursor-pointer rounded p-1 hover:bg-[var(--surface-hover)]"
            >
              <Search size={16} strokeWidth={1.9} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function SortPopover({
  prop,
  propIcon,
  dirLabel,
  onToggleDir,
  onClose,
}: {
  prop: string;
  propIcon: React.ReactNode;
  dirLabel: string;
  onToggleDir: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-full right-0 z-50 mt-1 w-[300px] max-w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] p-1.5 text-notion-text shadow-[rgba(15,15,15,0.14)_0px_6px_22px]">
        <div className="flex items-center gap-1.5 p-1">
          {/* Not a button: there is only one sort property, so this is a
              plain label (no border/hover) rather than a dead-looking
              control. */}
          <div className="inline-flex items-center gap-1.5 px-1 py-[5px] text-[13px] font-medium text-notion-gray">
            <span className="flex h-4 w-4 items-center justify-center">
              {propIcon}
            </span>
            {prop}
          </div>
          <button
            type="button"
            onClick={onToggleDir}
            className="inline-flex flex-1 cursor-pointer items-center justify-between gap-1.5 rounded-md border border-[var(--border)] px-2 py-[5px] text-[13px] transition-colors hover:bg-[var(--surface-hover-soft)]"
          >
            {dirLabel}
            <ChevronDown size={13} className="text-notion-gray" />
          </button>
        </div>
      </div>
    </>
  );
}

function ViewPopover({
  view,
  onChange,
  onClose,
}: {
  view: GalleryView;
  onChange: (view: GalleryView) => void;
  onClose: () => void;
}) {
  const ui = useUi();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-full left-0 z-50 mt-1 w-[170px] rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] p-1 text-notion-text shadow-[rgba(15,15,15,0.14)_0px_6px_22px]">
        {VIEW_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => {
              onChange(opt.key);
              onClose();
            }}
            className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-[7px] text-[13px] transition-colors hover:bg-[var(--surface-hover)]"
          >
            <span className="flex h-4 w-4 items-center justify-center text-notion-gray">
              {opt.icon}
            </span>
            <span className="flex-1 text-left">{opt.label(ui)}</span>
            {opt.key === view && (
              <Check size={14} className="text-[var(--accent-text)]" />
            )}
          </button>
        ))}
      </div>
    </>
  );
}
