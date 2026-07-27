"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import type { TocItem } from "@/lib/data";
import { track } from "@/lib/analytics/track";

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      let current = items[0]?.id ?? "";
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= 130) current = item.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    track("toc_navigate", { section_id: id });
    const y = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div
      className="fixed top-1/2 right-0 z-40 hidden -translate-y-1/2 md:block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <nav
        className={cn(
          "absolute top-1/2 right-2 min-w-[190px] -translate-y-1/2 rounded-lg border border-[rgba(55,53,47,0.12)] bg-white p-1.5 shadow-[rgba(15,15,15,0.08)_0px_4px_16px] transition-all duration-150",
          open
            ? "visible translate-x-0 opacity-100"
            : "invisible translate-x-1 opacity-0",
        )}
        aria-label="Table of contents"
      >
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => scrollTo(item.id)}
            className={cn(
              "block w-full truncate rounded-md px-2 py-[5px] text-left text-[13px] leading-[1.3] transition-colors hover:bg-[rgba(55,53,47,0.06)]",
              item.level === 2 && "pl-4",
              active === item.id
                ? "font-medium text-notion-text"
                : "text-notion-gray",
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div
        className={cn(
          "flex flex-col items-end gap-[9px] py-3 pr-[14px] pl-7 transition-opacity duration-150",
          open ? "opacity-0" : "opacity-100",
        )}
      >
        {items.map((item) => (
          <span
            key={item.id}
            className={cn(
              "h-[2px] rounded-full transition-all duration-200",
              active === item.id
                ? "w-[15px] bg-notion-text"
                : "w-3 bg-[rgba(55,53,47,0.18)]",
            )}
          />
        ))}
      </div>
    </div>
  );
}
