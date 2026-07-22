import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { InfoItem, PillColor, ResumeEntry, RichLine } from "@/lib/data";

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
        <span key={i}>
          {line.map((span, j) =>
            span.b ? (
              <strong key={j} className="font-semibold">
                {span.t}
              </strong>
            ) : (
              <span key={j}>{span.t}</span>
            ),
          )}
          {i < lines.length - 1 && <br />}
        </span>
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
      <div className="text-[15px] leading-[1.6]">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Info line — emoji + bold text (contact / interests / languages).    */
/* ------------------------------------------------------------------ */

export function InfoLine({ item }: { item: InfoItem }) {
  const isExternal = item.href?.startsWith("http");
  return (
    <div className="flex items-start gap-[7px] py-[3px] text-[15px] leading-[1.5]">
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
/*  Resume entry — logo column + title / date / description.            */
/* ------------------------------------------------------------------ */

export function ResumeItem({ entry }: { entry: ResumeEntry }) {
  return (
    <div className="grid grid-cols-[88px_minmax(0,1fr)] items-start gap-x-4">
      <div className="pt-[4px]">
        <Image
          src={entry.logo}
          alt={entry.logoAlt}
          width={entry.logoWidth}
          height={entry.logoHeight}
          className="h-auto w-full object-contain object-left-top"
          style={{ maxWidth: entry.logoMax }}
        />
      </div>
      <div className="min-w-0">
        <div className="text-[16px] font-semibold leading-[1.4]">
          {entry.title}
        </div>
        <div className="mt-[2px] text-[14px] text-notion-gray italic">
          {entry.date}
        </div>
        <p className="mt-[8px] text-[14px] leading-[1.55] text-notion-gray">
          {entry.description}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Notion select / multi-select pill.                                  */
/* ------------------------------------------------------------------ */

const PILL_BG: Record<PillColor, string> = {
  default: "var(--pill-default)",
  gray: "var(--pill-gray)",
  brown: "var(--pill-brown)",
  orange: "var(--pill-orange)",
  yellow: "var(--pill-yellow)",
  green: "var(--pill-green)",
  blue: "var(--pill-blue)",
  purple: "var(--pill-purple)",
  pink: "var(--pill-pink)",
  red: "var(--pill-red)",
};

export function Tag({
  label,
  color = "default",
}: {
  label: string;
  color?: PillColor;
}) {
  return (
    <Badge
      className="h-[18px] rounded-[3px] border-0 px-[7px] py-0 text-[12px] leading-[18px] font-normal"
      style={{ backgroundColor: PILL_BG[color], color: "var(--pill-text)" }}
    >
      {label}
    </Badge>
  );
}

/* ------------------------------------------------------------------ */
/*  Skill level bar (Notion "bar" number format, value hidden).         */
/* ------------------------------------------------------------------ */

export function SkillBar({ level }: { level: number }) {
  return (
    <div className="h-[6px] w-full overflow-hidden rounded-full bg-[rgba(55,53,47,0.1)]">
      <div
        className="h-full rounded-full bg-[#37352f]"
        style={{ width: `${Math.round(level * 100)}%` }}
      />
    </div>
  );
}

