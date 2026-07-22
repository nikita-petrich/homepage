"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronsRight,
  ListFilter,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type FilterProp = { label: string; icon: React.ReactNode };

type Props = {
  viewLabel: string;
  viewIcon: React.ReactNode;
  sortProp: string;
  sortPropIcon: React.ReactNode;
  sortDirLabel: string;
  onToggleSortDir: () => void;
  query: string;
  onQueryChange: (q: string) => void;
  filterProps: FilterProp[];
};

/* Interactive inline-database toolbar: view tab + filter / sort / search. */
export function DatabaseToolbar({
  viewLabel,
  viewIcon,
  sortProp,
  sortPropIcon,
  sortDirLabel,
  onToggleSortDir,
  query,
  onQueryChange,
  filterProps,
}: Props) {
  const [open, setOpen] = useState<null | "filter" | "sort">(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  return (
    <div className="group mb-2 flex items-center justify-between gap-2">
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
              className="w-[140px] bg-transparent text-[14px] text-notion-text placeholder:text-notion-gray focus:outline-none sm:w-[190px]"
            />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onQueryChange("");
                setSearchOpen(false);
              }}
              aria-label="Close search"
              className="shrink-0 rounded p-0.5 hover:bg-[rgba(55,53,47,0.06)]"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              aria-label="Expand"
              className="rounded p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-[rgba(55,53,47,0.06)]"
            >
              <ChevronsRight size={16} strokeWidth={1.9} />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setOpen(open === "filter" ? null : "filter")}
                aria-label="Filter"
                className={cn(
                  "rounded p-1 hover:bg-[rgba(55,53,47,0.06)]",
                  open === "filter" && "bg-[rgba(55,53,47,0.08)]",
                )}
              >
                <ListFilter size={16} strokeWidth={1.9} />
              </button>
              {open === "filter" && (
                <FilterPopover props={filterProps} onClose={() => setOpen(null)} />
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setOpen(open === "sort" ? null : "sort")}
                aria-label="Sort"
                className={cn(
                  "rounded p-1 text-[#2383e2] hover:bg-[rgba(55,53,47,0.06)]",
                  open === "sort" && "bg-[rgba(35,131,226,0.1)]",
                )}
              >
                <ArrowUpDown size={16} strokeWidth={1.9} />
              </button>
              {open === "sort" && (
                <SortPopover
                  prop={sortProp}
                  propIcon={sortPropIcon}
                  dirLabel={sortDirLabel}
                  onToggleDir={onToggleSortDir}
                  onClose={() => setOpen(null)}
                />
              )}
            </div>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="rounded p-1 hover:bg-[rgba(55,53,47,0.06)]"
            >
              <Search size={16} strokeWidth={1.9} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function FilterPopover({
  props,
  onClose,
}: {
  props: FilterProp[];
  onClose: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-full right-0 z-50 mt-1 w-[248px] rounded-lg border border-[rgba(55,53,47,0.12)] bg-white p-1.5 text-notion-text shadow-[rgba(15,15,15,0.14)_0px_6px_22px]">
        <div className="mb-1 rounded-[6px] border border-[#2383e2] px-2.5 py-1.5 text-[13px] text-notion-gray">
          Filter by...
        </div>
        {props.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={onClose}
            className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-[14px] hover:bg-[rgba(55,53,47,0.06)]"
          >
            <span className="flex h-4 w-4 items-center justify-center text-notion-gray">
              {p.icon}
            </span>
            {p.label}
          </button>
        ))}
      </div>
    </>
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
            <ChevronDown size={13} className="text-notion-gray" />
          </div>
          <button
            type="button"
            onClick={onToggleDir}
            className="inline-flex flex-1 items-center justify-between gap-1.5 rounded-md border border-[rgba(55,53,47,0.16)] px-2 py-[5px] text-[13px] transition-colors hover:bg-[rgba(55,53,47,0.04)]"
          >
            {dirLabel}
            <ChevronDown size={13} className="text-notion-gray" />
          </button>
        </div>
        <div className="mt-1 border-t border-[rgba(55,53,47,0.09)] pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[14px] text-notion-gray hover:bg-[rgba(55,53,47,0.06)]"
          >
            <Plus size={15} /> Add sort
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[14px] text-notion-gray hover:bg-[rgba(55,53,47,0.06)]"
          >
            <Trash2 size={15} /> Delete sort
          </button>
        </div>
      </div>
    </>
  );
}
