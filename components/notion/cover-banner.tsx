import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";
import { getContent, profileName, profileRole } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";

/* The warm light band behind the certificate/reference covers and the project
   placeholder. A CSS variable, so it can differ per theme. (The main cover
   banner below has its own split code/content layout.) */
export const bannerBg = "var(--banner-bg)";

export function GitCodeMotif({ className }: { className?: string }) {
  return (
    // Decorative "code diff" art — hidden from assistive technology.
    <div
      aria-hidden
      className={cn("flex flex-col gap-[0.75em] font-mono leading-none", className)}
    >
      <div className="text-[var(--diff-add)]">
        <span className="text-[color-mix(in_srgb,var(--diff-add)_70%,transparent)]">
          +{" "}
        </span>
        ai.integrate(llm, rag)
      </div>
      <div className="text-[var(--diff-add)]">
        <span className="text-[color-mix(in_srgb,var(--diff-add)_70%,transparent)]">
          +{" "}
        </span>
        secure.eu().gdpr()
      </div>
      <div className="text-[var(--diff-del)]">
        <span className="text-[color-mix(in_srgb,var(--diff-del)_70%,transparent)]">
          -{" "}
        </span>
        legacy.manual()
      </div>
      <div className="pl-[1.6em] text-[var(--banner-meta)]">
        git commit -m &quot;prod&quot;
      </div>
    </div>
  );
}

const bannerTags = [
  "LLM-Integration",
  "RAG",
  "Agentic Coding",
  "TypeScript",
  "Python",
  "Clean Architecture",
  "Next.js",
  "DSGVO-konform",
];

/* Colours for the always-dark code panel, injected as local overrides of the
   diff/meta tokens so GitCodeMotif renders green "+" / amber "-" / grey lines
   on black regardless of the page theme. */
const codePanelStyle = {
  background: "var(--banner-code-bg)",
  "--diff-add": "var(--banner-code-add)",
  "--diff-del": "var(--banner-code-accent)",
  "--banner-meta": "var(--banner-code-meta)",
} as CSSProperties;

export function CoverBanner({ locale }: { locale: Locale }) {
  const { profile } = getContent(locale);

  return (
    /* Full-bleed Notion-style cover: edge to edge, no rounding or shadow. The
       amber code-logo tile in app/[locale]/page.tsx overlaps its bottom edge,
       the way a Notion page icon sits on the cover image. */
    <div className="flex w-full border-t-[3px] border-b border-t-[var(--primary)] border-b-[var(--border-strong)]">
      {/* Left — dark terminal-style code strip, hidden on narrow screens. */}
      <div
        className="relative hidden shrink-0 basis-[37%] flex-col justify-center px-[clamp(20px,3.2vw,64px)] py-[clamp(22px,2.6vw,34px)] sm:flex"
        style={codePanelStyle}
      >
        <GitCodeMotif className="text-[clamp(11px,1.15vw,15px)]" />
      </div>

      {/* Right — content panel. It carries the warm banner band rather than the
          card colour, which is the same white as the page in light mode and
          made the full-bleed cover blend into the body. The inner stack is
          capped and pushed right so the tag row wraps into even rows on wide
          screens. */}
      <div
        className="flex min-w-0 flex-1 flex-col items-end justify-center gap-[clamp(7px,0.9vw,12px)] px-[clamp(22px,4vw,80px)] py-[clamp(22px,3vw,34px)] text-right [&>*]:max-w-[620px]"
        style={{ backgroundImage: bannerBg }}
      >
        <div className="text-[clamp(10px,1vw,13px)] font-bold tracking-[0.12em] text-[var(--primary)] uppercase">
          {profile.tagline}
        </div>

        <h1 className="text-[clamp(23px,3.4vw,44px)] leading-[1.1] font-bold tracking-[-0.01em] text-[var(--foreground)]">
          {profileName}
        </h1>

        <div className="text-[clamp(13px,1.5vw,20px)] font-medium text-[var(--banner-text-soft)]">
          {profileRole}
        </div>

        <div className="mt-[2px] flex flex-wrap justify-end gap-[7px]">
          {bannerTags.map((tag) => (
            <span
              key={tag}
              /* Card-coloured chips, so they read as raised on the band. */
              className="rounded-[8px] border border-[var(--border)] bg-[var(--card)] px-[13px] py-[6px] text-[clamp(11px,1.2vw,14px)] font-medium whitespace-nowrap text-[var(--foreground)] shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-[3px] text-[clamp(13px,1.4vw,18px)] font-bold text-[var(--foreground)]">
          https://sequenz.io
        </div>
        <div className="text-[clamp(11px,1.2vw,15px)] text-[var(--banner-meta)]">
          n.petrich@sequenz.io
        </div>
      </div>
    </div>
  );
}
