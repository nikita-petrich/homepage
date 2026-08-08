"use client";

import { useCallback, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";
import { Button } from "@/components/ui/button";

import { CvButtonFace, type CvVariant } from "./cv-button-face";

/* The CV button sits in the top bar of every page, and until a visitor asks
 * for it there is nothing behind it but a two-item menu. Radix's dropdown —
 * menu, popper, portal, focus scope, dismissable layer — is ~32 KiB of that
 * page's JavaScript, and Lighthouse measured 99.7% of the chunk unused on
 * first load. On /imprint, a page of plain text, it was most of what the main
 * thread had to compile: 920 ms of total blocking time for a button nobody had
 * pressed yet.
 *
 * So the button starts as what it looks like — a <Button> — and the real menu
 * is fetched on the first sign of intent: hover or keyboard focus start the
 * import, a press starts it and asks for the menu open.
 *
 * Three details make the swap honest, and each was a bug first.
 *
 * The import is driven from here and the resolved component is held in state,
 * rather than going through next/dynamic. Both fetch the same chunk; the
 * difference is what happens in between. next/dynamic renders its (empty)
 * loading state as soon as it is asked for, so the button vanished for the
 * couple of hundred milliseconds the fetch took — and a visitor who had tabbed
 * onto it lost their focus to <body> along with the element holding it, so the
 * Enter they pressed next did nothing. Keeping the placeholder until the module
 * is in hand makes the exchange a single commit: one button, then the other.
 *
 * `onPointerDown`, not `onClick`, records a press. Focus arrives between
 * pointerdown and click, so with focus starting the load, a fast chunk could
 * swap the button out before the browser dispatched the click; the handler
 * never ran and the menu needed a second press to open.
 *
 * `open` is controlled from here rather than passed as the menu's
 * `defaultOpen`. A press can land before, during or after the chunk does, and
 * `defaultOpen` is only read on mount — a controlled prop is read on every
 * render, so the press lands whenever it happens.
 *
 * Nothing here is server-rendered: the placeholder is what the document should
 * contain. Both render the same <Button> with the same CvButtonFace inside, so
 * the swap changes no pixels. */
type CvMenuComponent = typeof import("./cv-menu").CvMenu;

export function CvDownload({
  variant = "hero",
  className,
}: {
  variant?: CvVariant;
  className?: string;
}) {
  const { ui } = useI18n();
  const [Menu, setMenu] = useState<CvMenuComponent | null>(null);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const started = useRef(false);

  const load = useCallback(() => {
    if (started.current) return;
    started.current = true;
    // Stored through an updater: the value is itself a function component, and
    // a bare setState would call it instead of storing it.
    void import("./cv-menu").then((m) => setMenu(() => m.CvMenu));
  }, []);

  const press = useCallback(() => {
    setOpen(true);
    load();
  }, [load]);

  if (Menu) {
    return (
      <Menu
        variant={variant}
        className={className}
        open={open}
        onOpenChange={setOpen}
        takeFocus={focused}
      />
    );
  }

  return (
    <Button
      variant={variant === "hero" ? "default" : "outline"}
      size={variant === "hero" ? "lg" : "sm"}
      className={cn(
        variant === "hero" ? "text-[15px]" : "h-[30px]",
        /* The button is whitespace-nowrap, so in a narrow container it would
           otherwise grow past its parent instead of being clipped to it. */
        "max-w-full",
        className,
      )}
      /* aria-haspopup/expanded say what this button is before Radix is here to
         say it — a screen reader that reaches it while the chunk is in flight
         is told it opens a menu, not that it is a plain button. */
      aria-haspopup="menu"
      aria-expanded={false}
      data-analytics-event="cv_menu_open"
      data-analytics-prop-placement={variant}
      onPointerEnter={load}
      onFocus={() => {
        setFocused(true);
        load();
      }}
      onBlur={() => setFocused(false)}
      onPointerDown={press}
      onKeyDown={(e) => {
        // What Radix's own trigger answers to, so the keyboard path matches.
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          press();
        }
      }}
    >
      <CvButtonFace variant={variant} ui={ui} />
    </Button>
  );
}
