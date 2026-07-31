import { cn } from "@/lib/utils";
import { getContent, profileName, profileRole } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";

/* The warm banner behind the cover, the certificate/reference covers and the
   project placeholder. A CSS variable, so it can differ per theme. */
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
];

export function CoverBanner({ locale }: { locale: Locale }) {
  const { profile } = getContent(locale);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ backgroundImage: bannerBg }}
    >
      <div className="absolute inset-y-0 left-0 w-[5px] bg-[var(--accent-o)]" />

      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-[clamp(20px,4vw,72px)] px-[clamp(28px,6vw,110px)] py-[clamp(28px,2.85vw,41px)]">
        <GitCodeMotif className="hidden shrink-0 text-[clamp(11px,1.05vw,18px)] sm:flex" />

        <div className="flex min-w-0 flex-col items-end text-right">
          <div className="text-[clamp(11px,1vw,17px)] font-semibold tracking-[0.18em] text-[var(--accent-text)] uppercase">
            {profile.tagline}
          </div>

          <h1 className="mt-[0.16em] text-[clamp(22px,3.2vw,55px)] leading-[1.04] font-bold tracking-[-0.02em] text-[var(--banner-text)]">
            {profileName}
          </h1>

          <div className="mt-[0.12em] text-[clamp(12px,1.3vw,23px)] leading-tight font-semibold text-[var(--banner-text-soft)]">
            {profileRole}
          </div>

          <div className="mt-[clamp(5px,0.7vw,10px)] flex flex-wrap justify-end gap-[clamp(6px,0.65vw,12px)]">
            {bannerTags.map((t) => (
              <span
                key={t}
                className="rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-[0.7em] py-[0.32em] text-[clamp(11px,1.15vw,20px)] whitespace-nowrap text-[var(--banner-text)] shadow-sm"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-[clamp(6px,0.75vw,12px)] text-[clamp(13px,1.15vw,21px)] font-bold text-[var(--banner-text)]">
            https://sequenz.io
          </div>
          <div className="mt-[0.2em] text-[clamp(12px,1vw,18px)] text-[var(--banner-meta)]">
            n.petrich@sequenz.io
          </div>
        </div>
      </div>
    </div>
  );
}
