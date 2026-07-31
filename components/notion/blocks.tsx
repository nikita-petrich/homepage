import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { FactItem, InfoItem, Language, RichLine } from "@/lib/data";

import { CactusOrangeIcon, Flag } from "./icons";

/* The page's single h1 is the name in the cover banner; main sections are h2,
   sidebar sections h3. Visual sizes are independent of the semantic level. */
export function Section({
  title,
  level = "h2",
  id,
  className,
  children,
}: {
  title: string;
  level?: "h2" | "h3";
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const Heading = level;
  const headingClass =
    level === "h2"
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

export function InfoLine({ item }: { item: InfoItem }) {
  const isExternal = item.href?.startsWith("http");
  const contactType = item.href?.startsWith("tel:")
    ? "phone"
    : item.href?.startsWith("mailto:")
      ? "email"
      : "website";
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
          rel={isExternal ? "noopener noreferrer" : undefined}
          data-analytics-event="contact_click"
          data-analytics-prop-type={contactType}
        >
          {item.text}
        </a>
      ) : (
        <span className="font-semibold break-words">{item.text}</span>
      )}
    </div>
  );
}

export function FactLine({ item }: { item: FactItem }) {
  return (
    <div className="text-[15px] leading-[1.4]">
      <div className="text-[12px] tracking-[0.04em] text-notion-gray uppercase">
        {item.label}
      </div>
      {Array.isArray(item.value) ? (
        <div className="flex flex-col gap-[2px] font-semibold">
          {item.value.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
      ) : (
        <div className="font-semibold">{item.value}</div>
      )}
    </div>
  );
}

export function LangLine({ item }: { item: Language }) {
  return (
    <div className="flex items-start gap-[8px] py-[4px] text-[15px] leading-[1.4]">
      {/* SVG flags are served as-is — the optimizer adds nothing for vectors. */}
      <Flag
        src={item.flag}
        className="mt-[4px] h-[15px] w-auto shrink-0 rounded-[3px] shadow-[0_0_0_1px_rgba(55,53,47,0.12)]"
      />
      {/* Level on its own line: "Englisch — B2 · US/EU-Remote" wrapped mid-
          phrase in the 210px sidebar and read like one broken sentence. */}
      <span className="min-w-0">
        <span className="block font-semibold">{item.text}</span>
        <span className="block text-[13px] text-notion-gray">{item.sub}</span>
      </span>
    </div>
  );
}

export function AccentTag({
  label,
  size = "sm",
}: {
  label: string;
  size?: "sm" | "md";
}) {
  return (
    <Badge
      variant="accent"
      className={cn(
        "whitespace-normal",
        size === "md" ? "px-[9px] py-[3px] text-[13px]" : "text-[12px]",
      )}
    >
      {label}
    </Badge>
  );
}

export function SkillTag({ label }: { label: string }) {
  return (
    <Badge variant="skill" className="px-[7px] py-px text-[12px] whitespace-normal">
      {label}
    </Badge>
  );
}
