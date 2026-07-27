"use client";

import { Building2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { domainOf, track } from "@/lib/analytics/track";

/* Company name with a building icon. When `href` is set the name is a link to
   the company website. Inside a clickable card (`inCard`) it renders as a
   role="link" span that opens the site in a new tab while suppressing the
   card's own navigation — a nested <a> would be invalid there. */
export function CompanyLine({
  name,
  href,
  inCard = false,
  className,
}: {
  name: string;
  href?: string;
  inCard?: boolean;
  className?: string;
}) {
  const base = cn(
    "inline-flex w-fit items-center gap-1 font-medium text-[#6f5b3e]",
    className,
  );
  const content = (
    <>
      <Building2 size={12} strokeWidth={2} className="shrink-0" />
      <span className="line-clamp-1">{name}</span>
    </>
  );

  if (!href) return <span className={base}>{content}</span>;

  if (inCard) {
    const open = () => {
      track("outbound_click", { target_domain: domainOf(href), link_label: name });
      window.open(href, "_blank", "noopener,noreferrer");
    };
    return (
      <span
        role="link"
        tabIndex={0}
        aria-label={`Website von ${name} öffnen`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          open();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            open();
          }
        }}
        className={cn(base, "relative z-[1] cursor-pointer hover:underline")}
      >
        {content}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-analytics-event="outbound_click"
      data-analytics-prop-target-domain={domainOf(href)}
      data-analytics-prop-link-label={name}
      className={cn(base, "hover:underline")}
    >
      {content}
    </a>
  );
}
