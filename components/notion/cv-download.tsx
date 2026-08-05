"use client";

import { ChevronDown, Download, FileText } from "lucide-react";

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

export function CvDownload({
  variant = "hero",
  className,
}: {
  /** "closing" is the compact outline button inside the closing CTA card. */
  variant?: "hero" | "topbar" | "closing";
  className?: string;
}) {
  const { locale, ui } = useI18n();
  const cvFiles = getContent(locale).cvFiles;
  const isTopbar = variant === "topbar";
  const isClosing = variant === "closing";
  const isCompact = isTopbar || isClosing;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={isCompact ? "outline" : "default"}
          size={isCompact ? "sm" : "lg"}
          className={cn(
            isCompact ? "h-[30px]" : "text-[15px]",
            /* The button is whitespace-nowrap, so in a narrow container it
               would otherwise grow past its parent instead of being clipped
               to it. */
            "max-w-full",
            className,
          )}
          data-analytics-event="cv_menu_open"
          data-analytics-prop-placement={variant}
        >
          {/* No download glyph in the closing card: a third of that row is
              144px wide, and the German label only clears it once the icon is
              gone. Nothing is lost — the card's own heading is "CV als PDF",
              and the chevron still marks the button as the language chooser
              its subline promises. */}
          {!isClosing && <Download strokeWidth={2} />}
          {isClosing ? (
            <span className="min-w-0 truncate">{ui.cv.buttonShort}</span>
          ) : (
            <>
              {/* In the topbar the label collapses with the viewport, but it
                  stays in the accessibility tree rather than being replaced by
                  an aria-label: a name that reads "CV-Download öffnen" while
                  the button says "CV herunterladen" is a WCAG 2.5.3 (Label in
                  Name) failure, and leaves voice control with nothing to
                  say. */}
              <span className={isTopbar ? "sr-only sm:not-sr-only" : undefined}>
                {ui.cv.button}
              </span>
              <span className={isTopbar ? "sr-only md:not-sr-only" : undefined}>
                {ui.cv.buttonSuffix}
              </span>
            </>
          )}
          <ChevronDown strokeWidth={2} className="opacity-70" />
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
              data-analytics-prop-cv-lang={f.href.includes("_DE") ? "de" : "en"}
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
