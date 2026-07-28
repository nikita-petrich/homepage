"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpDown, ChevronDown, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  viewLabel: string;
  viewIcon: React.ReactNode;
  sortProp: string;
  sortPropIcon: React.ReactNode;
  sortDirLabel: string;
  onToggleSortDir: () => void;
  query: string;
  onQueryChange: (q: string) => void;
};

/* Notion-style toolbar above each gallery: view label, sort popover and an
   expandable search field. Only real controls — every element does what it
   announces. */
export function DatabaseToolbar({
  viewLabel,
  viewIcon,
  sortProp,
  sortPropIcon,
  sortDirLabel,
  onToggleSortDir,
  query,
  onQueryChange,
}: Props) {
  const [sortOpen, setSortOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <div className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[#f1f1ef] px-2 py-[5px] text-[14px] font-medium">
        <span className="flex h-4 w-4 items-center justify-center">{viewIcon}</span>
        {viewLabel}
      </div>

      <div className="flex items-center gap-0.5 text-notion-gray">
        {searchOpen ? (
          <div className="flex items-center gap-1.5 rounded-md px-1">
            <Search size={16} strokeWidth={1.9} className="shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onBlur={() => {
                if (!query) setSearchOpen(false);
              }}
              placeholder="Suchen…"
              aria-label={`${viewLabel} durchsuchen`}
              className="w-[140px] bg-transparent text-[14px] text-notion-text placeholder:text-notion-gray focus:outline-none sm:w-[190px]"
            />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onQueryChange("");
                setSearchOpen(false);
              }}
              aria-label="Suche schließen"
              className="shrink-0 cursor-pointer rounded p-0.5 hover:bg-[rgba(55,53,47,0.06)]"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <div className="relative">
              <button
                type="button"
                onClick={() => setSortOpen((v) => !v)}
                aria-label="Sortierung"
                aria-haspopup="true"
                aria-expanded={sortOpen}
                className={cn(
                  "cursor-pointer rounded p-1 text-[#2383e2] hover:bg-[rgba(55,53,47,0.06)]",
                  sortOpen && "bg-[rgba(35,131,226,0.1)]",
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
              aria-label="Suchen"
              className="cursor-pointer rounded p-1 hover:bg-[rgba(55,53,47,0.06)]"
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
      <div className="absolute top-full right-0 z-50 mt-1 w-[300px] rounded-lg border border-[rgba(55,53,47,0.12)] bg-white p-1.5 text-notion-text shadow-[rgba(15,15,15,0.14)_0px_6px_22px]">
        <div className="flex items-center gap-1.5 p-1">
          <div className="inline-flex items-center gap-1.5 rounded-md border border-[rgba(55,53,47,0.16)] px-2 py-[5px] text-[13px] font-medium">
            <span className="flex h-4 w-4 items-center justify-center text-notion-gray">
              {propIcon}
            </span>
            {prop}
          </div>
          <button
            type="button"
            onClick={onToggleDir}
            className="inline-flex flex-1 cursor-pointer items-center justify-between gap-1.5 rounded-md border border-[rgba(55,53,47,0.16)] px-2 py-[5px] text-[13px] transition-colors hover:bg-[rgba(55,53,47,0.04)]"
          >
            {dirLabel}
            <ChevronDown size={13} className="text-notion-gray" />
          </button>
        </div>
      </div>
    </>
  );
}
