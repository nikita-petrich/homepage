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
  variant?: "hero" | "topbar";
  className?: string;
}) {
  const { locale, ui } = useI18n();
  const cvFiles = getContent(locale).cvFiles;
  const isTopbar = variant === "topbar";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={isTopbar ? "outline" : "default"}
          size={isTopbar ? "sm" : "lg"}
          className={cn(isTopbar ? "h-[30px]" : "text-[15px]", className)}
          data-analytics-event="cv_menu_open"
          data-analytics-prop-placement={variant}
          aria-label={isTopbar ? ui.cv.open : undefined}
        >
          <Download strokeWidth={2} />
          <span className={isTopbar ? "hidden sm:inline" : undefined}>
            {ui.cv.button}
          </span>
          <span className={isTopbar ? "hidden md:inline" : undefined}>
            {ui.cv.buttonSuffix}
          </span>
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
