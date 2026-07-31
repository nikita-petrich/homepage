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
    /* Centred to the same 960px column as the page body, so the amber code-logo
       tile that overlaps the bottom-left (app/[locale]/page.tsx) lands on the
       corner of the card — a split "code panel / content" layout. */
    <div className="mx-auto max-w-[960px] px-6 pt-5 sm:px-12 sm:pt-6">
      <div className="flex overflow-hidden rounded-[12px] shadow-[var(--notion-card-shadow)]">
        {/* Left — dark terminal-style code strip, hidden on narrow screens. */}
        <div
          className="relative hidden shrink-0 basis-[37%] flex-col justify-center px-[clamp(20px,2.4vw,28px)] py-[clamp(22px,2.6vw,30px)] sm:flex"
          style={codePanelStyle}
        >
          <GitCodeMotif className="text-[clamp(11px,1.15vw,13px)]" />
        </div>

        {/* Right — content panel with the amber top rule. */}
        <div className="flex min-w-0 flex-1 flex-col items-end justify-center gap-[clamp(7px,0.9vw,11px)] border-t-[3px] border-[var(--primary)] bg-[var(--card)] px-[clamp(22px,3vw,34px)] py-[clamp(22px,3vw,32px)] text-right">
          <div className="text-[clamp(10px,1vw,11px)] font-bold tracking-[0.12em] text-[var(--primary)] uppercase">
            {profile.tagline}
          </div>

          <h1 className="text-[clamp(23px,3.4vw,36px)] leading-[1.1] font-bold tracking-[-0.01em] text-[var(--foreground)]">
            {profileName}
          </h1>

          <div className="text-[clamp(13px,1.5vw,17px)] font-medium text-[var(--banner-text-soft)]">
            {profileRole}
          </div>

          <div className="mt-[2px] flex flex-wrap justify-end gap-[7px]">
            {bannerTags.map((tag) => (
              <span
                key={tag}
                className="rounded-[8px] border border-[var(--border)] bg-[var(--secondary)] px-[13px] py-[6px] text-[clamp(11px,1.2vw,12.5px)] font-medium whitespace-nowrap text-[var(--secondary-foreground)] shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-[3px] text-[clamp(13px,1.4vw,15px)] font-bold text-[var(--foreground)]">
            https://sequenz.io
          </div>
          <div className="text-[clamp(11px,1.2vw,13px)] text-[var(--banner-meta)]">
            n.petrich@sequenz.io
          </div>
        </div>
      </div>
    </div>
  );
}
