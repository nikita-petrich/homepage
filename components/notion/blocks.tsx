import {
  Briefcase,
  CalendarCheck,
  Globe,
  GraduationCap,
  Handshake,
  Info,
  Mail,
  MapPin,
  Phone,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { FactItem, InfoItem, Language, RichLine } from "@/lib/data";

import { Flag } from "./icons";

/* Eckdaten icons, keyed by the string on each fact. Icons can't live in the
   localized content tree — the per-locale walk in lib/i18n/text.ts would mangle
   the component objects — so the content stores a key and it maps here. */
const FACT_ICONS: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  "calendar-check": CalendarCheck,
  wallet: Wallet,
  "graduation-cap": GraduationCap,
  "map-pin": MapPin,
  handshake: Handshake,
};

/* Contact icons — same lucide treatment as the Eckdaten (fact) icons. */
const CONTACT_ICONS: Record<string, LucideIcon> = {
  phone: Phone,
  mail: Mail,
  globe: Globe,
};

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
      <Heading className={headingClass}>
        {/* A section with an id is a shareable URL: the heading itself is the
            anchor (plain <a href="#id">, so it works without JavaScript, can be
            copied or middle-clicked, and pins the hash in the address bar). The
            "#" marker only shows on hover/keyboard focus. The scroll offset
            under the sticky top bar comes from `scroll-mt-20` above. */}
        {id ? (
          <a
            href={`#${id}`}
            className="group/anchor inline-flex items-baseline gap-1.5"
          >
            <span className="underline-offset-[6px] group-hover/anchor:underline">
              {title}
            </span>
            <span
              aria-hidden
              className="text-[0.65em] font-normal text-notion-gray opacity-0 transition-opacity group-hover/anchor:opacity-100 group-focus-visible/anchor:opacity-100"
            >
              #
            </span>
          </a>
        ) : (
          title
        )}
      </Heading>
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
    <div className="flex gap-3 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
      {/* Same treatment as the sidebar contact/fact icons: 15px lucide glyph in
          muted grey, nudged down to sit on the first line's centre. */}
      <div className="mt-[5px] shrink-0">
        <Info
          size={15}
          strokeWidth={2}
          className="text-notion-gray opacity-80"
          aria-hidden
        />
      </div>
      <div className="text-[15px] leading-[1.65]">{children}</div>
    </div>
  );
}

export function InfoLine({ item }: { item: InfoItem }) {
  const Icon = CONTACT_ICONS[item.icon];
  const isExternal = item.href?.startsWith("http");
  const contactType = item.href?.startsWith("tel:")
    ? "phone"
    : item.href?.startsWith("mailto:")
      ? "email"
      : "website";
  return (
    <div className="flex items-center gap-2 py-[3px] text-[15px] leading-[1.5]">
      {Icon ? (
        <Icon
          size={15}
          strokeWidth={2}
          className="shrink-0 text-notion-gray opacity-80"
          aria-hidden
        />
      ) : null}
      {item.href ? (
        <a
          href={item.href}
          /* inline-block + py: the bare 15px/1.5 line box was 23px high, just
             under the 24px minimum target size (WCAG 2.2 SC 2.5.8) — the same
             treatment the footer links already get. */
          className="inline-block py-px font-semibold break-words hover:underline"
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
  const Icon = FACT_ICONS[item.icon];
  return (
    <div className="text-[15px] leading-[1.4]">
      <div className="flex items-center gap-1.5 text-[12px] tracking-[0.04em] text-notion-gray uppercase">
        {Icon ? (
          <Icon size={15} strokeWidth={2} className="shrink-0 opacity-80" />
        ) : null}
        {item.label}
      </div>
      <div className="font-semibold">{item.value}</div>
      {/* Qualifiers under the headline value. The flex row puts the dot in its
          own gutter, so a wrapping detail stays indented under its own text
          instead of running back to the margin and reading like the next fact.
          The value itself never breaks: "München · 1–2 Tage/Woche" is 137px in
          the 200px sidebar column and only overflowed because of the "Vor Ort:"
          prefix, so the line now breaks after the label and keeps the value —
          one statement — together. */}
      {item.details?.length ? (
        <ul className="mt-[3px] flex flex-col gap-[3px]">
          {item.details.map((detail) => (
            <li key={detail.key} className="flex gap-[7px] text-[13px] leading-[1.35]">
              <span
                aria-hidden
                className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-full bg-notion-gray opacity-70"
              />
              <span className="min-w-0">
                <span className="text-notion-gray">{detail.key}: </span>
                <span className="font-medium whitespace-nowrap">
                  {detail.value}
                </span>
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function LangLine({ item }: { item: Language }) {
  return (
    <div className="flex items-start gap-[8px] py-[4px] text-[15px] leading-[1.4]">
      {/* SVG flags are served as-is — the optimizer adds nothing for vectors. */}
      <Flag
        src={item.flag}
        className="mt-[4px] h-[15px] w-auto shrink-0 rounded-[3px] shadow-[0_0_0_1px_var(--border-strong)]"
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
      variant="secondary"
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
    <Badge variant="outline" className="px-[7px] py-px text-[12px] whitespace-normal">
      {label}
    </Badge>
  );
}
