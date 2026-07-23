"use client";

import { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

const STORAGE_KEY = "notion-cookie-consent";

type Prefs = { functional: boolean; analytics: boolean; marketing: boolean };

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>({
    functional: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    let shouldShow = true;
    try {
      shouldShow = !localStorage.getItem(STORAGE_KEY);
    } catch {
      shouldShow = true;
    }
    if (!shouldShow) return;
    // Reveal on the next frame, deferring the update out of the effect body.
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const dismiss = (value: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    setVisible(false);
    setCustomize(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-[620px] -translate-x-1/2">
      {customize && (
        <CustomizePanel
          prefs={prefs}
          setPrefs={setPrefs}
          onDone={() => dismiss("customized")}
        />
      )}

      <div className="flex items-center gap-3 rounded-xl bg-[#2a2e30] px-4 py-3 text-[14px] text-white shadow-[rgba(15,15,15,0.28)_0px_8px_28px]">
        <span className="flex-1 text-white/85">
          Diese Website verwendet Cookies, um die Nutzung zu analysieren und die
          Darstellung zu verbessern.
        </span>
        <button
          type="button"
          onClick={() => dismiss("all")}
          className="shrink-0 font-semibold transition-colors hover:text-white/75"
        >
          Alle akzeptieren
        </button>
        <button
          type="button"
          onClick={() => dismiss("none")}
          className="shrink-0 font-semibold transition-colors hover:text-white/75"
        >
          Ablehnen
        </button>
        <button
          type="button"
          onClick={() => setCustomize((v) => !v)}
          aria-label="Cookies anpassen"
          className="shrink-0 rounded p-1 transition-colors hover:bg-white/10"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}

function CustomizePanel({
  prefs,
  setPrefs,
  onDone,
}: {
  prefs: Prefs;
  setPrefs: (updater: (p: Prefs) => Prefs) => void;
  onDone: () => void;
}) {
  const rows: {
    key: keyof Prefs | "necessary";
    title: string;
    desc: string;
    on: boolean;
    disabled?: boolean;
  }[] = [
    {
      key: "necessary",
      title: "Unbedingt erforderlich",
      desc: "Notwendig für den Betrieb der Website. Immer aktiv.",
      on: true,
      disabled: true,
    },
    {
      key: "functional",
      title: "Funktional",
      desc: "Speichert Einstellungen und ermöglicht erweiterte Funktionen.",
      on: prefs.functional,
    },
    {
      key: "analytics",
      title: "Analyse",
      desc: "Hilft, die Nutzung zu messen und die Website zu verbessern.",
      on: prefs.analytics,
    },
    {
      key: "marketing",
      title: "Marketing",
      desc: "Wird für zielgerichtete Werbung verwendet.",
      on: prefs.marketing,
    },
  ];

  return (
    <div className="absolute right-0 bottom-full mb-2 w-[340px] overflow-hidden rounded-xl border border-[rgba(55,53,47,0.12)] bg-white shadow-[rgba(15,15,15,0.2)_0px_12px_34px]">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[15px] font-medium text-notion-text">
          Cookies anpassen
        </span>
        <button
          type="button"
          onClick={onDone}
          className="rounded-md border border-[#2383e2] px-3 py-1 text-[14px] font-medium text-[#2383e2] transition-colors hover:bg-[#2383e2]/5"
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
              onClick={() => {
                if (row.disabled || row.key === "necessary") return;
                const key = row.key;
                setPrefs((p) => ({ ...p, [key]: !p[key] }));
              }}
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
  onClick,
}: {
  on: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={on}
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
