"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Download, FileText } from "lucide-react";

import { cn } from "@/lib/utils";
import { cvFiles } from "@/lib/data";

/**
 * "CV herunterladen" button that opens a small menu to pick the language
 * (Deutsch / English) — both served as PDF from /public/cv.
 *
 * variant "hero"    — prominent, accent-outlined pill used in the page header.
 * variant "topbar"  — compact solid button that sits in the sticky top bar.
 */
export function CvDownload({
  variant = "hero",
  className,
}: {
  variant?: "hero" | "topbar";
  className?: string;
}) {
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
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          "inline-flex items-center gap-1.5 font-medium transition-colors",
          isTopbar
            ? "rounded-md border border-[var(--accent-o)] px-2.5 py-1.5 text-[13px] text-[var(--accent-o)] hover:bg-[color-mix(in_srgb,var(--accent-o)_10%,transparent)]"
            : "rounded-lg bg-[var(--accent-o)] px-4 py-2.5 text-[14px] text-white shadow-sm hover:brightness-95",
        )}
      >
        <Download size={isTopbar ? 15 : 17} strokeWidth={2} />
        <span className={isTopbar ? "hidden sm:inline" : undefined}>CV</span>
        <span className={isTopbar ? "hidden md:inline" : undefined}>
          {isTopbar ? " herunterladen" : " herunterladen"}
        </span>
        <ChevronDown
          size={isTopbar ? 14 : 16}
          strokeWidth={2}
          className={cn("transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            "absolute z-50 mt-2 w-[248px] overflow-hidden rounded-xl border border-[rgba(55,53,47,0.12)] bg-white p-1.5 shadow-[rgba(15,15,15,0.16)_0px_8px_28px]",
            isTopbar ? "right-0" : "left-0",
          )}
        >
          <div className="px-2 pt-1 pb-1.5 text-[11px] font-semibold tracking-[0.04em] text-notion-gray uppercase">
            Lebenslauf als PDF
          </div>
          {cvFiles.map((f) => (
            <a
              key={f.href}
              href={f.href}
              download
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-[rgba(55,53,47,0.06)]"
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[18px]"
                style={{ background: "color-mix(in srgb, var(--accent-o) 12%, transparent)" }}
                aria-hidden
              >
                {f.flag}
              </span>
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
