"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { useUi } from "@/lib/i18n/provider";
import {
  applyTheme,
  currentTheme,
  subscribeToTheme,
  type Theme,
} from "@/lib/theme";

/* Light/dark switch for the top bar.
 *
 * The theme itself is applied before the first paint by the inline script in
 * the layout; this button only reads and flips it. It reads through
 * useSyncExternalStore — the same pattern the analytics provider uses for the
 * consent state — so the server render has no opinion ("pending") and the icon
 * appears once the client knows which theme is active. That avoids both a
 * hydration mismatch and a flash of the wrong icon. */
export function ThemeToggle({ className }: { className?: string }) {
  const ui = useUi();
  const theme = useSyncExternalStore(
    subscribeToTheme,
    currentTheme,
    () => null,
  );

  const next: Theme = theme === "dark" ? "light" : "dark";
  const label = next === "dark" ? ui.theme.toDark : ui.theme.toLight;

  return (
    <button
      type="button"
      onClick={() => applyTheme(next)}
      aria-label={label}
      title={label}
      data-analytics-event="theme_switch"
      data-analytics-prop-theme={next}
      className={cn(
        "inline-flex h-[30px] w-[30px] shrink-0 cursor-pointer items-center justify-center rounded-md border border-[var(--border-strong)] text-notion-gray transition-colors hover:bg-[var(--surface-hover)] hover:text-notion-text",
        className,
      )}
    >
      {theme === null ? null : theme === "dark" ? (
        <Sun size={16} strokeWidth={2} />
      ) : (
        <Moon size={16} strokeWidth={2} />
      )}
    </button>
  );
}
