"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Download, FileText } from "lucide-react";

import { cn } from "@/lib/utils";
import { getContent } from "@/lib/data";
import { useI18n } from "@/lib/i18n/provider";
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
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isTopbar = variant === "topbar";

  return (
    /* The topbar variant deliberately has no positioning context of its own:
       its menu is anchored to the top bar's right-hand group instead, so the
       248px panel lines up with the bar's right edge rather than with a button
       that sits mid-screen — anchoring it here pushed the menu off the left
       edge of the viewport on phones (≤414px). */
    <div ref={rootRef} className={cn(!isTopbar && "relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        data-analytics-event="cv_menu_open"
        data-analytics-prop-placement={variant}
        aria-expanded={open}
        aria-label={isTopbar ? ui.cv.open : undefined}
        className={cn(
          "inline-flex items-center gap-1.5 font-medium transition-colors",
          isTopbar
            ? "h-[30px] rounded-md border border-[var(--accent-text)] px-2 text-[13px] text-[var(--accent-text)] hover:bg-[color-mix(in_srgb,var(--accent-o)_10%,transparent)]"
            : "rounded-lg bg-primary px-4 py-2.5 text-[14px] text-primary-foreground shadow-sm hover:brightness-95",
        )}
      >
        <Download size={isTopbar ? 15 : 17} strokeWidth={2} />
        <span className={isTopbar ? "hidden sm:inline" : undefined}>
          {ui.cv.button}
        </span>
        <span className={isTopbar ? "hidden md:inline" : undefined}>
          {ui.cv.buttonSuffix}
        </span>
        <ChevronDown
          size={isTopbar ? 14 : 16}
          strokeWidth={2}
          className={cn("transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          className={cn(
            "absolute z-50 mt-2 w-[248px] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] p-1.5 shadow-[rgba(15,15,15,0.16)_0px_8px_28px]",
            isTopbar ? "top-full right-0" : "left-0",
          )}
        >
          <div className="px-2 pt-1 pb-1.5 text-[11px] font-semibold tracking-[0.04em] text-notion-gray uppercase">
            {ui.cv.menuTitle}
          </div>
          {cvFiles.map((f) => (
            <a
              key={f.href}
              href={f.href}
              download
              data-analytics-event="cv_download"
              data-analytics-prop-cv-lang={f.href.includes("_DE") ? "de" : "en"}
              data-analytics-prop-placement={variant}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-[var(--surface-hover)]"
            >
              {/* The flag sits on the menu background directly — no tile behind
                  it; the hairline is the flag's own edge, not a frame. */}
              <Flag
                src={f.flag}
                className="h-5 w-auto shrink-0 rounded-[3px] shadow-[0_0_0_1px_var(--border-strong)]"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-semibold text-notion-text">
                  {f.label}
                </span>
                <span className="block text-[12px] text-notion-gray">{f.sub}</span>
              </span>
              <FileText size={16} className="shrink-0 text-notion-gray" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
