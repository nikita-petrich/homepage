"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";

import { useUi } from "@/lib/i18n/provider";
import { format } from "@/lib/i18n/text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { VIEW_OPTIONS, type GalleryView } from "./view-options";

export type { GalleryView };

/* The switcher's dropdown is loaded on intent, not on page load — the same
 * trade ./cv-download.tsx makes, and it matters more here: the home page
 * renders three of these toolbars (projects, testimonials, certificates), all
 * sharing the one Radix dropdown chunk, and the overwhelming majority of
 * visitors read the gallery view they are given without ever opening the
 * switcher. Hover and focus start the import ahead of the press; the press
 * itself starts it and asks for the menu open. See ./cv-download.tsx for why
 * the import is driven by hand rather than through next/dynamic, why the press
 * is `onPointerDown`, and why `open` is controlled from here. */
type ViewMenuComponent = typeof import("./view-menu").ViewMenu;

type Props = {
  view: GalleryView;
  onViewChange: (view: GalleryView) => void;
  query: string;
  onQueryChange: (q: string) => void;
};

/* Notion-style toolbar above each gallery: view switcher (dropdown menu) and an
   expandable search field — both on shadcn primitives. There is no sort control:
   every gallery has exactly one sensible order (newest first), so the popover
   only ever offered a direction toggle nobody needed. */
export function DatabaseToolbar({
  view,
  onViewChange,
  query,
  onQueryChange,
}: Props) {
  const ui = useUi();
  const [searchOpen, setSearchOpen] = useState(false);
  const [Menu, setMenu] = useState<ViewMenuComponent | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuFocused, setMenuFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuStarted = useRef(false);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const loadMenu = useCallback(() => {
    if (menuStarted.current) return;
    menuStarted.current = true;
    void import("./view-menu").then((m) => setMenu(() => m.ViewMenu));
  }, []);

  const pressMenu = useCallback(() => {
    setMenuOpen(true);
    loadMenu();
  }, [loadMenu]);

  const current = VIEW_OPTIONS.find((o) => o.key === view) ?? VIEW_OPTIONS[0]!;

  return (
    <div className="mb-2 flex items-center justify-end gap-1">
      <div className="mr-auto">
        {Menu ? (
          <Menu
            view={view}
            onViewChange={onViewChange}
            open={menuOpen}
            onOpenChange={setMenuOpen}
            takeFocus={menuFocused}
          />
        ) : (
          <Button
            variant="secondary"
            size="sm"
            className="gap-1.5"
            aria-label={format(ui.gallery.switchView, {
              view: current.label(ui),
            })}
            /* Announced as the menu button it is about to become, so the few
               hundred milliseconds before the module lands are not a different
               control to assistive technology. */
            aria-haspopup="menu"
            aria-expanded={false}
            onPointerEnter={loadMenu}
            onFocus={() => {
              setMenuFocused(true);
              loadMenu();
            }}
            onBlur={() => setMenuFocused(false)}
            onPointerDown={pressMenu}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                pressMenu();
              }
            }}
          >
            <span className="flex h-4 w-4 items-center justify-center">
              {current.icon}
            </span>
            {current.label(ui)}
            <ChevronDown className="text-muted-foreground" />
          </Button>
        )}
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
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground"
          onClick={() => setSearchOpen(true)}
          aria-label={ui.gallery.search}
        >
          <Search />
        </Button>
      )}
    </div>
  );
}
