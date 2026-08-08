"use client";

import { ChevronDown, Download } from "lucide-react";

import type { Ui } from "@/lib/i18n/ui";

/** "closing" is the compact outline button inside the closing CTA card. */
export type CvVariant = "hero" | "topbar" | "closing";

/* The contents of the CV button, shared by the placeholder in
 * ./cv-download.tsx and the real dropdown trigger in ./cv-menu.tsx. Both render
 * this, so the moment the menu module arrives and takes over the button, not a
 * pixel moves. */
export function CvButtonFace({ variant, ui }: { variant: CvVariant; ui: Ui }) {
  const isTopbar = variant === "topbar";
  const isClosing = variant === "closing";

  return (
    <>
      {/* No download glyph in the closing card: a third of that row is
          144px wide, and the German label only clears it once the icon is
          gone. Nothing is lost — the card's own heading is "CV als PDF",
          and the chevron still marks the button as the language chooser
          its subline promises. */}
      {!isClosing && <Download strokeWidth={2} />}
      {isClosing ? (
        <span className="min-w-0 truncate">{ui.cv.buttonShort}</span>
      ) : (
        <>
          {/* In the topbar the label collapses with the viewport, but it
              stays in the accessibility tree rather than being replaced by
              an aria-label: a name that reads "CV-Download öffnen" while
              the button says "CV herunterladen" is a WCAG 2.5.3 (Label in
              Name) failure, and leaves voice control with nothing to
              say. */}
          <span className={isTopbar ? "sr-only sm:not-sr-only" : undefined}>
            {ui.cv.button}
          </span>
          <span className={isTopbar ? "sr-only md:not-sr-only" : undefined}>
            {ui.cv.buttonSuffix}
          </span>
        </>
      )}
      <ChevronDown strokeWidth={2} className="opacity-70" />
    </>
  );
}
