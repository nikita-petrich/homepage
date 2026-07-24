import { cn } from "@/lib/utils";
import { profile } from "@/lib/data";

export const bannerBg =
  "linear-gradient(100deg, #ecefe8 0%, #f5f3ee 58%, #f1eee7 100%)";

export function GitCodeMotif({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-[0.75em] font-mono leading-none", className)}>
      <div className="text-[#3f9142]">
        <span className="text-[#3f9142]/70">+ </span>
        ai.integrate(llm, rag)
      </div>
      <div className="text-[#3f9142]">
        <span className="text-[#3f9142]/70">+ </span>
        secure.eu().gdpr()
      </div>
      <div className="text-[#c0553d]">
        <span className="text-[#c0553d]/70">- </span>
        legacy.manual()
      </div>
      <div className="pl-[1.6em] text-[#a7a399]">git commit -m &quot;prod&quot;</div>
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

export function CoverBanner() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ backgroundImage: bannerBg }}
    >
      <div className="absolute inset-y-0 left-0 w-[5px] bg-[var(--accent-o)]" />

      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-[clamp(20px,4vw,72px)] px-[clamp(28px,6vw,110px)] py-[clamp(5px,0.85vw,13px)]">
        <GitCodeMotif className="hidden shrink-0 text-[clamp(11px,1.05vw,18px)] sm:flex" />

        <div className="flex min-w-0 flex-col items-end text-right">
          <div className="text-[clamp(11px,1vw,17px)] font-semibold tracking-[0.18em] text-[var(--accent-o)] uppercase">
            Freiberuflich · Remote · Munich
          </div>

          <h2 className="mt-[0.16em] text-[clamp(22px,3.2vw,55px)] leading-[1.04] font-bold tracking-[-0.02em] text-[#2b2925]">
            {profile.name}
          </h2>

          <div className="mt-[0.12em] text-[clamp(12px,1.3vw,23px)] leading-tight font-semibold text-[#3a382f]">
            {profile.role}
          </div>

          <div className="mt-[clamp(5px,0.7vw,10px)] flex flex-wrap justify-end gap-[clamp(6px,0.65vw,12px)]">
            {bannerTags.map((t) => (
              <span
                key={t}
                className="rounded-[5px] bg-[#ece3d3] px-[0.7em] py-[0.32em] text-[clamp(11px,1.15vw,20px)] whitespace-nowrap text-[#6f5b3e]"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-[clamp(6px,0.75vw,12px)] text-[clamp(13px,1.15vw,21px)] font-bold text-[#2b2925]">
            https://sequenz.io
          </div>
          <div className="mt-[0.2em] text-[clamp(12px,1vw,18px)] text-[#9b978d]">
            n.petrich@sequenz.io
          </div>
        </div>
      </div>
    </div>
  );
}
