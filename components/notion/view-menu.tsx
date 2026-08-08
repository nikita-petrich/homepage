"use client";

import { useLayoutEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

import { useUi } from "@/lib/i18n/provider";
import { format } from "@/lib/i18n/text";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { VIEW_OPTIONS, type GalleryView } from "./view-options";

/* The gallery/table switcher proper. Its own module for the same reason as
 * ./cv-menu.tsx: this is where the Radix dropdown is imported, so this is the
 * chunk that only a visitor who reaches for the switcher has to download.
 * ./database-toolbar.tsx renders a matching plain button until then. */
export function ViewMenu({
  view,
  onViewChange,
  open,
  onOpenChange,
  takeFocus = false,
}: {
  view: GalleryView;
  onViewChange: (view: GalleryView) => void;
  /* Controlled for the same reason as ./cv-menu.tsx. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** See ./cv-menu.tsx — focus does not survive the swap. */
  takeFocus?: boolean;
}) {
  const ui = useUi();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const current = VIEW_OPTIONS.find((o) => o.key === view) ?? VIEW_OPTIONS[0]!;

  useLayoutEffect(() => {
    if (takeFocus && !open) triggerRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          ref={triggerRef}
          variant="secondary"
          size="sm"
          className="gap-1.5"
          aria-label={format(ui.gallery.switchView, { view: current.label(ui) })}
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
  );
}
