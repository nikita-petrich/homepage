"use client";

import { useLayoutEffect, useRef } from "react";
import { FileText } from "lucide-react";

import { cn } from "@/lib/utils";
import { getContent } from "@/lib/data";
import { useI18n } from "@/lib/i18n/provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Flag } from "./icons";

import { CvButtonFace, type CvVariant } from "./cv-button-face";

/* The CV menu proper: the Radix dropdown, its content, and the two download
 * links. Split into its own module so that the ~32 KiB of dropdown/popper/
 * portal machinery is a chunk of its own — ./cv-download.tsx loads it on the
 * first sign of interest instead of on every page load. The trigger it renders
 * is the same <Button> with the same face as the placeholder, so swapping one
 * for the other changes no pixels. */
export function CvMenu({
  variant = "hero",
  className,
  open,
  onOpenChange,
  takeFocus = false,
}: {
  variant?: CvVariant;
  className?: string;
  /* Controlled by ./cv-download.tsx rather than left to `defaultOpen`: the
     press that opens this menu happens before the module exists, so "open" can
     be decided before, during or after this component mounts. A controlled
     prop is read on every render, so it lands whenever it arrives. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The placeholder held focus when it armed this import — see below. */
  takeFocus?: boolean;
}) {
  const { locale, ui } = useI18n();
  const cvFiles = getContent(locale).cvFiles;
  const isTopbar = variant === "topbar";
  const triggerRef = useRef<HTMLButtonElement>(null);

  /* Focus does not survive the swap. A keyboard visitor tabs onto the
     placeholder, that focus arms this import, and the button they were standing
     on is replaced by this one — a different DOM node, so the browser drops the
     focus to <body> and their next Enter goes nowhere. Taking it back puts them
     on the trigger they think they are on.

     Layout effect, not effect: it runs before the browser paints, so the focus
     ring never visibly leaves the button. And only when the menu is not
     opening — if it is, Radix is about to move focus into the menu itself and
     must not be fought over it. */
  useLayoutEffect(() => {
    if (takeFocus && !open) triggerRef.current?.focus();
    // Mount only: this is about the one swap, not about later renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          ref={triggerRef}
          variant={variant === "hero" ? "default" : "outline"}
          size={variant === "hero" ? "lg" : "sm"}
          className={cn(
            variant === "hero" ? "text-[15px]" : "h-[30px]",
            /* The button is whitespace-nowrap, so in a narrow container it
               would otherwise grow past its parent instead of being clipped
               to it. */
            "max-w-full",
            className,
          )}
          data-analytics-event="cv_menu_open"
          data-analytics-prop-placement={variant}
        >
          <CvButtonFace variant={variant} ui={ui} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={isTopbar ? "end" : "start"}
        className="w-[248px] max-w-[calc(100vw-1.5rem)]"
      >
        <DropdownMenuLabel className="text-[11px] font-semibold tracking-[0.04em] text-muted-foreground uppercase">
          {ui.cv.menuTitle}
        </DropdownMenuLabel>
        {cvFiles.map((f) => (
          <DropdownMenuItem key={f.href} asChild className="gap-2.5 py-2">
            <a
              href={f.href}
              download
              data-analytics-event="cv_download"
              data-analytics-prop-cv-lang={f.lang}
              data-analytics-prop-placement={variant}
            >
              {/* The flag sits on the menu background directly — the hairline is
                  the flag's own edge, not a frame. */}
              <Flag
                src={f.flag}
                className="h-5 w-auto shrink-0 rounded-[3px] shadow-[0_0_0_1px_var(--border)]"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{f.label}</span>
                <span className="block text-xs text-muted-foreground">
                  {f.sub}
                </span>
              </span>
              <FileText className="shrink-0 text-muted-foreground" />
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
