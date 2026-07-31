"use client";

import { useMemo, useState } from "react";
import { Search, Star } from "lucide-react";

import type { SkillCategory } from "@/lib/data";
import { useUi } from "@/lib/i18n/provider";
import { useSearchTracking } from "@/lib/analytics/use-search-tracking";

import { SkillTag } from "./blocks";
import { EmptyState, GalleryGrid } from "./gallery";

const cardShadow = { boxShadow: "var(--notion-card-shadow)" } as const;

export function SkillsGallery({ skills }: { skills: SkillCategory[] }) {
  const ui = useUi();
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return skills;
    return skills
      .map((c) => ({
        ...c,
        items: c.items.filter((i) => i.toLowerCase().includes(q)),
      }))
      .filter((c) => c.name.toLowerCase().includes(q) || c.items.length > 0);
  }, [query, skills]);

  useSearchTracking("skills", query, visible.length);

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[var(--surface-chip)] px-2 py-[5px] text-[14px] font-medium">
          <Star size={15} strokeWidth={1.9} className="text-notion-gray" />
          {ui.skills.title}
        </div>
        <div className="flex items-center gap-1.5 px-1 text-notion-gray">
          <Search size={16} strokeWidth={1.9} className="shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={ui.skills.searchPlaceholder}
            aria-label={ui.skills.searchLabel}
            className="w-[130px] bg-transparent text-[14px] text-notion-text placeholder:text-notion-gray focus:outline-none sm:w-[170px]"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState />
      ) : (
        <GalleryGrid wide>
          {visible.map((cat) => (
            <div
              key={cat.num}
              style={cardShadow}
              className="h-full overflow-hidden rounded-lg bg-[var(--surface)]"
            >
              <div className="flex flex-col gap-[11px] p-[13px]">
                <div className="flex items-center gap-[9px]">
                  <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md bg-primary text-[11px] font-bold text-primary-foreground">
                    {cat.num}
                  </span>
                  <span className="text-[15px] leading-[1.3] font-semibold">
                    {cat.name}
                  </span>
                </div>
                <div className="flex flex-wrap gap-[6px]">
                  {cat.items.map((sk) => (
                    <SkillTag key={sk} label={sk} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </GalleryGrid>
      )}
    </>
  );
}
