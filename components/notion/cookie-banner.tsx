"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  OPEN_CONSENT_EVENT,
  readConsent,
  writeConsent,
} from "@/lib/analytics/consent";
import { track } from "@/lib/analytics/track";
import { localePath } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import type { Ui } from "@/lib/i18n/ui";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

/* Privacy banner. This site tracks cookieless and anonymous (stage 1, no
   consent required — see lib/analytics/consent.ts), so this banner INFORMS
   and offers an opt-out; it does not beg for consent it doesn't need. It
   re-opens via the footer's "Datenschutz-Einstellungen" button so a choice
   can be changed at any time. */
export function CookieBanner() {
  const { locale, ui } = useI18n();
  const [visible, setVisible] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [statistics, setStatistics] = useState(true);

  useEffect(() => {
    // Defer state updates to the next frame, out of the effect body.
    const id = requestAnimationFrame(() => {
      const stored = readConsent();
      if (!stored) {
        setVisible(true);
        track("consent_banner_shown");
      } else {
        setStatistics(stored.statistics);
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // Footer "Datenschutz-Einstellungen" re-opens the banner with the stored
  // choice pre-filled (withdrawal must be as easy as the original decision).
  useEffect(() => {
    const onOpen = () => {
      const stored = readConsent();
      setStatistics(stored ? stored.statistics : true);
      setVisible(true);
      setCustomize(true);
    };
    window.addEventListener(OPEN_CONSENT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, onOpen);
  }, []);

  const save = (stats: boolean, decision: string) => {
    const before = readConsent()?.statistics !== false;
    if (stats) {
      track("consent_decision", { decision });
    }
    writeConsent({ statistics: stats });
    setVisible(false);
    setCustomize(false);
    // The Umami script may already be running with auto-tracking; a reload is
    // the only reliable way to stop it after an opt-out.
    if (before && !stats && window.umami) {
      window.location.reload();
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-[620px] -translate-x-1/2">
      {customize && (
        <CustomizePanel
          ui={ui}
          statistics={statistics}
          onToggleStatistics={() => setStatistics((v) => !v)}
          onDone={() => save(statistics, "customized")}
        />
      )}

      {/* A high-contrast toast (foreground/background tokens) so it reads as a
          system surface in both themes. min-h on the actions meets the 24px
          minimum target size (WCAG 2.2 SC 2.5.8). */}
      <div className="flex flex-col gap-2 rounded-xl bg-foreground px-4 py-3 text-[14px] text-background shadow-lg sm:flex-row sm:items-center sm:gap-3">
        <span className="flex-1 text-background/80">
          {ui.consent.text}{" "}
          <Link
            href={localePath(locale, "/privacy")}
            className="underline underline-offset-2 hover:text-background"
          >
            {ui.consent.details}
          </Link>
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => save(true, "ok")}
            className="inline-flex min-h-[24px] shrink-0 cursor-pointer items-center px-1 font-semibold transition-colors hover:text-background/70"
          >
            {ui.consent.ok}
          </button>
          <button
            type="button"
            onClick={() => save(false, "opt_out")}
            className="inline-flex min-h-[24px] shrink-0 cursor-pointer items-center font-semibold transition-colors hover:text-background/70"
          >
            {ui.consent.decline}
          </button>
          <button
            type="button"
            onClick={() => setCustomize((v) => !v)}
            aria-label={ui.consent.customize}
            aria-expanded={customize}
            className="ml-auto shrink-0 cursor-pointer rounded p-1 transition-colors hover:bg-background/15 sm:ml-0"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function CustomizePanel({
  ui,
  statistics,
  onToggleStatistics,
  onDone,
}: {
  ui: Ui;
  statistics: boolean;
  onToggleStatistics: () => void;
  onDone: () => void;
}) {
  const rows = [
    {
      key: "necessary",
      title: ui.consent.necessaryTitle,
      desc: ui.consent.necessaryDesc,
      on: true,
      disabled: true,
      onToggle: undefined as (() => void) | undefined,
    },
    {
      key: "statistics",
      title: ui.consent.statisticsTitle,
      desc: ui.consent.statisticsDesc,
      on: statistics,
      disabled: false,
      onToggle: onToggleStatistics,
    },
  ];

  return (
    /* w-full + max-w: a fixed 340px overflowed the banner's own
       calc(100%-1.5rem) width on a 320px screen and ran off the left edge. */
    <div className="absolute right-0 bottom-full mb-2 w-full max-w-[340px] overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-lg">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[15px] font-medium">{ui.consent.settings}</span>
        <Button variant="outline" size="sm" onClick={onDone}>
          {ui.consent.done}
        </Button>
      </div>

      <div className="max-h-[320px] overflow-y-auto">
        {rows.map((row, i) => (
          <div
            key={row.key}
            className={cn(
              "flex items-start justify-between gap-3 px-4 py-3",
              i === 0 && "bg-muted",
            )}
          >
            <div className="min-w-0">
              <div className="text-[14px] font-medium">{row.title}</div>
              <div className="mt-0.5 text-[13px] leading-[1.4] text-muted-foreground">
                {row.desc}
              </div>
            </div>
            <Switch
              checked={row.on}
              disabled={row.disabled}
              onCheckedChange={row.onToggle ? () => row.onToggle!() : undefined}
              aria-label={row.title}
              className="mt-1"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
