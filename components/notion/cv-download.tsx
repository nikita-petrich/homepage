"use client";

import { Fragment } from "react";
import {
  ChevronDown,
  Download,
  ExternalLink,
  FileText,
  FileType,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { getContent } from "@/lib/data";
import { format } from "@/lib/i18n/text";
import { useI18n } from "@/lib/i18n/provider";
import type { Ui } from "@/lib/i18n/ui";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Flag } from "./icons";

type CvEntry = ReturnType<typeof getContent>["cvFiles"][number];

/* The three ways one CV can leave this site, in the order they are asked for.
 *
 * PDF first: it is the file a recruiter forwards, and the only one whose layout
 * is the designed one. Word second, for the agency that pastes the CV into its
 * own template — Google exports it on request, so it always says what the
 * document says (see app/cv/word/[file]/route.ts). The document itself last,
 * for reading without downloading anything.
 *
 * The first two are same-origin URLs and carry `download`, so they save the
 * file instead of navigating; the third is the only one that leaves for
 * Google, and it is the only one that opens a tab. */
const FORMATS = [
  {
    key: "pdf",
    icon: FileText,
    href: (cv: CvEntry) => cv.pdf,
    text: (ui: Ui) => ui.cv.pdf,
    sub: (ui: Ui) => ui.cv.pdfSub,
    event: "cv_download",
    external: false,
  },
  {
    key: "word",
    icon: FileType,
    href: (cv: CvEntry) => cv.word,
    text: (ui: Ui) => ui.cv.word,
    sub: (ui: Ui) => ui.cv.wordSub,
    event: "cv_download",
    external: false,
  },
  {
    key: "doc",
    icon: ExternalLink,
    href: (cv: CvEntry) => cv.doc,
    text: (ui: Ui) => ui.cv.doc,
    sub: (ui: Ui) => ui.cv.docSub,
    event: "cv_open_doc",
    external: true,
  },
] as const;

export function CvDownload({
  variant = "hero",
  className,
}: {
  /** "closing" is the compact outline button inside the closing CTA card. */
  variant?: "hero" | "topbar" | "closing";
  className?: string;
}) {
  const { locale, ui } = useI18n();
  const cvFiles = getContent(locale).cvFiles;
  const isTopbar = variant === "topbar";
  const isClosing = variant === "closing";
  const isCompact = isTopbar || isClosing;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={isCompact ? "outline" : "default"}
          size={isCompact ? "sm" : "lg"}
          className={cn(
            isCompact ? "h-[30px]" : "text-[15px]",
            /* The button is whitespace-nowrap, so in a narrow container it
               would otherwise grow past its parent instead of being clipped
               to it. */
            "max-w-full",
            className,
          )}
          data-analytics-event="cv_menu_open"
          data-analytics-prop-placement={variant}
        >
          {/* No download glyph in the closing card: a third of that row is
              144px wide, and the German label only clears it once the icon is
              gone. Nothing is lost — the card's own heading names the formats,
              and the chevron still marks the button as the chooser its subline
              promises. */}
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
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={isTopbar ? "end" : "start"}
        className="w-[262px] max-w-[calc(100vw-1.5rem)]"
      >
        <DropdownMenuLabel className="text-[11px] font-semibold tracking-[0.04em] text-muted-foreground uppercase">
          {ui.cv.menuTitle}
        </DropdownMenuLabel>
        {cvFiles.map((cv, index) => (
          <Fragment key={cv.lang}>
            {/* One group per language, so the six entries read as two CVs with
                three formats each rather than as six unrelated files. */}
            {index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center gap-2 py-1.5 text-[13px] font-semibold">
                {/* The flag sits on the menu background directly — the hairline
                    is the flag's own edge, not a frame. */}
                <Flag
                  src={cv.flag}
                  className="h-4 w-auto shrink-0 rounded-[3px] shadow-[0_0_0_1px_var(--border)]"
                />
                {cv.label}
              </DropdownMenuLabel>
              {FORMATS.map((f) => {
                const Icon = f.icon;
                const text = f.text(ui);
                return (
                  <DropdownMenuItem key={f.key} asChild className="gap-2.5 py-1.5">
                    <a
                      href={f.href(cv)}
                      {...(f.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : { download: true })}
                      /* The group heading names the language, but a menu item
                         has to carry it in its own accessible name: assistive
                         technology announces the item, not the heading above
                         it. Leading with the visible text keeps WCAG 2.5.3
                         (Label in Name) intact, same as the certificate
                         links. */
                      aria-label={format(
                        f.external ? ui.cv.itemLabelNewTab : ui.cv.itemLabel,
                        { action: text, cv: cv.label },
                      )}
                      data-analytics-event={f.event}
                      data-analytics-prop-cv-lang={cv.lang}
                      data-analytics-prop-cv-format={f.key}
                      data-analytics-prop-placement={variant}
                    >
                      <Icon className="shrink-0 text-muted-foreground" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium">{text}</span>
                        <span className="block text-xs text-muted-foreground">
                          {f.sub(ui)}
                        </span>
                      </span>
                    </a>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
