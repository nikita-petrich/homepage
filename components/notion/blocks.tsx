import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { FactItem, InfoItem, Language, RichLine } from "@/lib/data";

import { CactusOrangeIcon } from "./icons";

/* ------------------------------------------------------------------ */
/*  Section: a Notion heading followed by a full-width divider block.   */
/* ------------------------------------------------------------------ */

export function Section({
  title,
  level = "h1",
  id,
  className,
  children,
}: {
  title: string;
  level?: "h1" | "h2";
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const Heading = level;
  const headingClass =
    level === "h1"
      ? "text-[1.75rem] font-semibold leading-[1.25] tracking-[-0.01em]"
      : "text-[1.375rem] font-semibold leading-[1.25] tracking-[-0.01em]";

  return (
    <section id={id} className={cn("min-w-0 scroll-mt-20", className)}>
      <Heading className={headingClass}>{title}</Heading>
      <Separator className="mt-[7px] mb-[14px] bg-[var(--notion-divider)]" />
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Rich text — preserves bold spans from the source callout.           */
/* ------------------------------------------------------------------ */

export function RichText({ lines }: { lines: RichLine[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <p key={i} className={i < lines.length - 1 ? "mb-[10px]" : undefined}>
          {line.map((span, j) =>
            span.b ? (
              <strong key={j} className="font-semibold">
                {span.t}
              </strong>
            ) : (
              <span key={j}>{span.t}</span>
            ),
          )}
        </p>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Callout — white rounded block with a thin border + cactus icon.     */
/* ------------------------------------------------------------------ */

export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-[10px] border border-[rgba(55,53,47,0.16)] bg-white px-4 py-4">
      <div className="mt-[1px] shrink-0">
        <CactusOrangeIcon size={24} />
      </div>
      <div className="text-[15px] leading-[1.65]">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Info line — emoji + bold text (contact list).                       */
/* ------------------------------------------------------------------ */

export function InfoLine({ item }: { item: InfoItem }) {
  const isExternal = item.href?.startsWith("http");
  return (
    <div className="flex items-start gap-[8px] py-[3px] text-[15px] leading-[1.5]">
      <span className="shrink-0 leading-[1.5]" aria-hidden>
        {item.icon}
      </span>
      {item.href ? (
        <a
          href={item.href}
          className="font-semibold break-words hover:underline"
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noreferrer" : undefined}
        >
          {item.text}
        </a>
      ) : (
        <span className="font-semibold break-words">{item.text}</span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Key-facts line — small uppercase label over a bold value.           */
/* ------------------------------------------------------------------ */

export function FactLine({ item }: { item: FactItem }) {
  return (
    <div className="text-[15px] leading-[1.4]">
      <div className="text-[12px] tracking-[0.04em] text-notion-gray uppercase">
        {item.label}
      </div>
      <div className="font-semibold">{item.value}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Language line — flag + language, muted proficiency note.            */
/* ------------------------------------------------------------------ */

export function LangLine({ item }: { item: Language }) {
  return (
    <div className="flex items-start gap-[8px] py-[3px] text-[15px] leading-[1.5]">
      <span className="shrink-0" aria-hidden>
        {item.icon}
      </span>
      <span>
        <span className="font-semibold">{item.text}</span>
        <span className="text-notion-gray"> — {item.sub}</span>
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Pills.                                                              */
/*  AccentTag — warm brown chip (focus areas, ways of working, card).   */
/*  SkillTag   — neutral chip (skill items, project technologies).      */
/* ------------------------------------------------------------------ */

export function AccentTag({
  label,
  size = "sm",
}: {
  label: string;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={cn(
        "rounded-[3px] bg-[#ece3d3] leading-[1.4] text-[#6f5b3e]",
        size === "md" ? "px-[9px] py-[3px] text-[13px]" : "px-2 py-[2px] text-[12px]",
      )}
    >
      {label}
    </span>
  );
}

export function SkillTag({ label }: { label: string }) {
  return (
    <span className="rounded-[3px] bg-[#f1f0ee] px-[7px] py-px text-[12px] leading-[18px] text-[#4a473f]">
      {label}
    </span>
  );
}
