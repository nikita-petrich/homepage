"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpDown, ChevronDown, LayoutGrid, Search, Table2, X } from "lucide-react";

import { useUi } from "@/lib/i18n/provider";
import type { Ui } from "@/lib/i18n/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

/* Notion-style toolbar above each gallery: view switcher (dropdown menu), sort
   popover and an expandable search field — all on shadcn primitives. */
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
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const current = VIEW_OPTIONS.find((o) => o.key === view) ?? VIEW_OPTIONS[0]!;

  return (
    <div className="mb-2 flex items-center justify-end gap-1">
      <div className="mr-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className="gap-1.5"
              aria-label={ui.gallery.switchView}
            >
              <span className="flex h-4 w-4 items-center justify-center">
                {current.icon}
              </span>
              {current.label(ui)}
              <ChevronDown className="text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[170px]">
            <DropdownMenuRadioGroup
              value={view}
              onValueChange={(v) => onViewChange(v as GalleryView)}
            >
              {VIEW_OPTIONS.map((opt) => (
                <DropdownMenuRadioItem key={opt.key} value={opt.key} className="gap-2">
                  <span className="flex h-4 w-4 items-center justify-center text-muted-foreground">
                    {opt.icon}
                  </span>
                  {opt.label(ui)}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {searchOpen ? (
        <div className="flex min-w-0 flex-1 items-center gap-1 sm:flex-none">
          <div className="relative min-w-0 flex-1 sm:w-[220px] sm:flex-none">
            <Search
              size={15}
              strokeWidth={1.9}
              className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onBlur={() => {
                if (!query) setSearchOpen(false);
              }}
              placeholder={ui.gallery.searchPlaceholder}
              aria-label={ui.gallery.searchLabel}
              className="h-8 pl-8"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              onQueryChange("");
              setSearchOpen(false);
            }}
            aria-label={ui.gallery.closeSearch}
          >
            <X />
          </Button>
        </div>
      ) : (
        <>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground"
                aria-label={ui.gallery.sort}
              >
                <ArrowUpDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[300px] p-1.5">
              <div className="flex items-center gap-1.5 p-1">
                {/* Not a button: there is only one sort property, so this is a
                    plain label rather than a dead-looking control. */}
                <div className="inline-flex items-center gap-1.5 px-1 py-[5px] text-[13px] font-medium text-muted-foreground">
                  <span className="flex h-4 w-4 items-center justify-center">
                    {sortPropIcon}
                  </span>
                  {sortProp}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onToggleSortDir}
                  className="h-8 flex-1 justify-between gap-1.5 font-normal"
                >
                  {sortDirLabel}
                  <ChevronDown className="text-muted-foreground" />
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground"
            onClick={() => setSearchOpen(true)}
            aria-label={ui.gallery.search}
          >
            <Search />
          </Button>
        </>
      )}
    </div>
  );
}
