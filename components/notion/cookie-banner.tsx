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

/* Privacy banner. This site tracks cookieless and anonymous (stage 1, no
   consent required — see lib/analytics/consent.ts), so this banner INFORMS
   and offers an opt-out; it does not beg for consent it doesn't need. It
   re-opens via the footer's "Datenschutz-Einstellungen" button so a choice
   can be changed at any time. */
export function CookieBanner() {
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
          statistics={statistics}
          onToggleStatistics={() => setStatistics((v) => !v)}
          onDone={() => save(statistics, "customized")}
        />
      )}

      <div className="flex items-center gap-3 rounded-xl bg-[#2a2e30] px-4 py-3 text-[14px] text-white shadow-[rgba(15,15,15,0.28)_0px_8px_28px]">
        <span className="flex-1 text-white/85">
          Diese Website misst die Nutzung cookielos und anonym — ohne Cookies
          und ohne Wiedererkennung.{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-2 hover:text-white"
          >
            Details
          </Link>
        </span>
        <button
          type="button"
          onClick={() => save(true, "ok")}
          className="shrink-0 cursor-pointer font-semibold transition-colors hover:text-white/75"
        >
          OK
        </button>
        <button
          type="button"
          onClick={() => save(false, "opt_out")}
          className="shrink-0 cursor-pointer font-semibold transition-colors hover:text-white/75"
        >
          Ablehnen
        </button>
        <button
          type="button"
          onClick={() => setCustomize((v) => !v)}
          aria-label="Datenschutz-Einstellungen anpassen"
          aria-expanded={customize}
          className="shrink-0 cursor-pointer rounded p-1 transition-colors hover:bg-white/10"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}

function CustomizePanel({
  statistics,
  onToggleStatistics,
  onDone,
}: {
  statistics: boolean;
  onToggleStatistics: () => void;
  onDone: () => void;
}) {
  const rows = [
    {
      key: "necessary",
      title: "Unbedingt erforderlich",
      desc: "Speichert ausschließlich Ihre hier getroffene Entscheidung. Immer aktiv.",
      on: true,
      disabled: true,
      onToggle: undefined as (() => void) | undefined,
    },
    {
      key: "statistics",
      title: "Anonyme Statistik",
      desc: "Cookielose, anonyme Messung von Seitenaufrufen und Klicks — ohne Wiedererkennung, ohne Speicherung auf Ihrem Gerät. Kann hier jederzeit deaktiviert werden.",
      on: statistics,
      disabled: false,
      onToggle: onToggleStatistics,
    },
  ];

  return (
    <div className="absolute right-0 bottom-full mb-2 w-[340px] overflow-hidden rounded-xl border border-[rgba(55,53,47,0.12)] bg-white shadow-[rgba(15,15,15,0.2)_0px_12px_34px]">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[15px] font-medium text-notion-text">
          Datenschutz-Einstellungen
        </span>
        <button
          type="button"
          onClick={onDone}
          className="cursor-pointer rounded-md border border-[#2383e2] px-3 py-1 text-[14px] font-medium text-[#2383e2] transition-colors hover:bg-[#2383e2]/5"
        >
          Fertig
        </button>
      </div>

      <div className="max-h-[320px] overflow-y-auto">
        {rows.map((row, i) => (
          <div
            key={row.key}
            className={cn(
              "flex items-start justify-between gap-3 px-4 py-3",
              i === 0 && "bg-[#f7f6f5]",
            )}
          >
            <div className="min-w-0">
              <div className="text-[14px] font-medium text-notion-text">
                {row.title}
              </div>
              <div className="mt-0.5 text-[13px] leading-[1.4] text-notion-gray">
                {row.desc}
              </div>
            </div>
            <Toggle
              on={row.on}
              disabled={row.disabled}
              label={row.title}
              onClick={row.onToggle}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function Toggle({
  on,
  disabled,
  label,
  onClick,
}: {
  on: boolean;
  disabled?: boolean;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      onClick={onClick}
      disabled={disabled}
      aria-checked={on}
      aria-label={label}
      className={cn(
        "relative mt-1 h-[18px] w-[30px] shrink-0 rounded-full transition-colors",
        on ? "bg-[#2383e2]" : "bg-[rgba(55,53,47,0.22)]",
        disabled ? "cursor-default opacity-70" : "cursor-pointer",
      )}
    >
      <span
        className={cn(
          "absolute top-[2px] h-[14px] w-[14px] rounded-full bg-white shadow-sm transition-all",
          on ? "left-[14px]" : "left-[2px]",
        )}
      />
    </button>
  );
}
