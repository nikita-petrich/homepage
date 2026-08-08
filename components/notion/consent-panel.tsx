"use client";

import { cn } from "@/lib/utils";
import type { Ui } from "@/lib/i18n/ui";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

/* The consent detail panel, behind the banner's "…" button.
 *
 * Its own module because of the Switch: Radix's switch primitive ships on every
 * page for a panel that only opens if someone chooses to change a setting —
 * and the banner itself is in the root layout, so that cost was paid on
 * /imprint and /privacy too. ./cookie-banner.tsx loads this on the click that
 * opens it. There is no placeholder to match here: until that click the panel
 * is not on screen at all. */
export function ConsentPanel({
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
