"use client";

import Link from "next/link";

import { localePath } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { bookingUrlFor, profileName } from "@/lib/profile";
import { Button } from "@/components/ui/button";

import { CvDownload } from "./cv-download";
import { CodeLogo } from "./icons";
import { LanguageToggle } from "./language-toggle";
import { ThemeToggle } from "./theme-toggle";

/* A client component: three of its four actions are interactive anyway, and
   taking the locale from the context instead of a prop means the 404 page —
   which cannot receive route params — renders the same bar as every other
   page. It deliberately imports lib/profile rather than lib/data, so the
   content tree stays out of the browser bundle. */
export function NotionTopBar() {
  const { locale, ui } = useI18n();

  return (
    <header className="sticky top-0 z-30 flex h-11 items-center justify-between border-b border-[var(--hairline)] bg-[color-mix(in_srgb,var(--surface)_95%,transparent)] px-3 backdrop-blur-sm sm:px-4">
      {/* Below sm the name is dropped entirely rather than truncated: letting it
          shrink squeezed the link below the logo's own 18px, so the (shrink-0)
          logo overlapped the language button and the bar overflowed the
          viewport on a 320px phone. The logo alone still links home. */}
      <Link
        href={localePath(locale)}
        /* On the home page this points at the page it is rendered on, so the
           prefetch re-fetches the current route — 40 KiB of RSC payload, the
           single largest request of the load, for a navigation that would be a
           no-op. Elsewhere it is one link back home, cheap enough to fetch on
           the click. */
        prefetch={false}
        className="-mx-1 flex min-h-[24px] shrink-0 items-center gap-2 px-1 text-[14px] font-medium"
      >
        <CodeLogo size={18} className="shrink-0" />
        {/* Below sm the visible name is gone and the logo is a decorative SVG,
            which left the link with no accessible name at all. The screen-reader
            copy fills that gap and is display:none from sm up, where the visible
            name takes over — so the link is announced once, never twice. */}
        <span className="sr-only sm:hidden">{profileName}</span>
        <span className="hidden truncate sm:inline">{profileName}</span>
      </Link>
      {/* Positioning context for the CV menu, so it aligns with the bar's
          right edge and stays inside the viewport on phones. */}
      <div className="relative flex shrink-0 items-center gap-1.5 sm:gap-2">
        <LanguageToggle />
        <ThemeToggle />
        <CvDownload variant="topbar" />
        <Button asChild size="sm">
          <a
            href={bookingUrlFor(locale)}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics-event="booking_click"
            data-analytics-prop-placement="topbar"
          >
            {/* The full CTA needs ~370px of bar; below that it pushed the whole
                row past the viewport edge. A short label keeps the primary
                action complete (never clipped) on the narrowest phones. */}
            <span className="min-[400px]:hidden">{ui.topbar.bookingShort}</span>
            <span className="hidden min-[400px]:inline">
              {ui.topbar.booking}
            </span>
          </a>
        </Button>
      </div>
    </header>
  );
}
