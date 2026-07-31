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
      {/* min-w-0 + truncate: the name yields space to the actions instead of
          forcing them to wrap out of the 44px bar on narrow phones. */}
      <Link
        href={localePath(locale)}
        className="flex min-w-0 items-center gap-2 text-[14px] font-medium"
      >
        <CodeLogo size={18} className="shrink-0" />
        <span className="truncate">{profileName}</span>
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
            {ui.topbar.booking}
          </a>
        </Button>
      </div>
    </header>
  );
}
