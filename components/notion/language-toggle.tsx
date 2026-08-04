"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  localeMeta,
  localePath,
  locales,
  splitLocalePath,
  type Locale,
} from "@/lib/i18n/config";
import { rememberLocale } from "@/lib/i18n/cookie";
import { useI18n } from "@/lib/i18n/provider";
import { format } from "@/lib/i18n/text";

import { Flag } from "./icons";

/* Language switcher for the top bar.
 *
 * Every entry is a real link to the same page in the other language
 * (/de/projects/x ↔ /en/projects/x), so a language can be opened in a new tab,
 * copied or bookmarked, and the switch works without JavaScript. The choice is
 * additionally remembered in a cookie, which is what lets an unprefixed URL
 * (a shared /certificates/<slug> link) land in the language the visitor picked
 * — see proxy.ts. */
export function LanguageToggle({ className }: { className?: string }) {
  const { locale, ui } = useI18n();
  const pathname = usePathname();
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

  /* The path without its locale prefix — the same page in another language. */
  const { path } = splitLocalePath(pathname);

  const choose = (next: Locale) => {
    rememberLocale(next);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={format(ui.language.switchLabelFor, {
          code: localeMeta[locale].short,
        })}
        title={ui.language.switchLabel}
        data-analytics-event="language_menu_open"
        className={cn(
          "inline-flex h-[30px] shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-[var(--border-strong)] px-2 text-[13px] font-medium transition-colors hover:bg-[var(--surface-hover)]",
          open && "bg-[var(--surface-hover)]",
        )}
      >
        <Languages size={16} strokeWidth={2} className="text-notion-gray" />
        {localeMeta[locale].short}
      </button>

      {open && (
        <div
          role="menu"
          aria-label={ui.language.menuLabel}
          className="absolute top-full right-0 z-50 mt-2 w-[180px] overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] p-1.5 shadow-[rgba(15,15,15,0.16)_0px_8px_28px]"
        >
          {locales.map((code) => {
            const meta = localeMeta[code];
            const current = code === locale;
            return (
              <Link
                key={code}
                href={localePath(code, path)}
                hrefLang={meta.htmlLang}
                lang={meta.htmlLang}
                role="menuitem"
                aria-current={current ? "true" : undefined}
                onClick={() => choose(code)}
                data-analytics-event="language_switch"
                data-analytics-prop-locale={code}
                className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-[14px] transition-colors hover:bg-[var(--surface-hover)]"
              >
                {/* The dot marks the active language; it keeps its space when
                    inactive so both rows line up. */}
                <span
                  aria-hidden
                  className={cn(
                    "h-[6px] w-[6px] shrink-0 rounded-full",
                    current ? "bg-notion-text" : "bg-transparent",
                  )}
                />
                <Flag
                  src={meta.flag}
                  className="h-4 w-auto shrink-0 rounded-[3px] shadow-[0_0_0_1px_var(--border-strong)]"
                />
                <span className={cn("min-w-0 flex-1", current && "font-semibold")}>
                  {meta.label}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
