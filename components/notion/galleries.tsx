"use client";

import { useMemo, useState } from "react";
import { Search, Star } from "lucide-react";

import type { SkillCategory, SkillKind } from "@/lib/data";
import { useUi } from "@/lib/i18n/provider";
import { useSearchTracking } from "@/lib/analytics/use-search-tracking";

import { SkillTag } from "./blocks";
import { EmptyState, GalleryGrid } from "./gallery";

const cardShadow = { boxShadow: "var(--notion-card-shadow)" } as const;

/* Order of the group headings — hard skills first, because that is what the
   section is looked at for; the profile card last, since it is context rather
   than a skill. */
const KINDS: SkillKind[] = ["hard", "soft", "profile"];

export function SkillsGallery({ skills }: { skills: SkillCategory[] }) {
  const ui = useUi();
  const [query, setQuery] = useState("");

  /* Categories per group, filtered by the search. A query matching a group
     heading ("soft skills") keeps that whole group — the heading is on screen,
     so typing it has to find something. Empty groups drop out entirely, which
     is why the headings never stand alone above nothing. */
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return KINDS.map((kind) => {
      const label = ui.skills.groups[kind];
      const all = skills.filter((c) => (c.kind ?? "hard") === kind);
      if (!q || label.toLowerCase().includes(q)) {
        return { kind, label, categories: all };
      }
      const categories = all
        .map((c) => ({
          ...c,
          items: c.items.filter((i) => i.toLowerCase().includes(q)),
        }))
        .filter((c) => c.name.toLowerCase().includes(q) || c.items.length > 0);
      return { kind, label, categories };
    }).filter((g) => g.categories.length > 0);
  }, [query, skills, ui]);

  const resultCount = groups.reduce((n, g) => n + g.categories.length, 0);

  useSearchTracking("skills", query, resultCount);

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
            className="w-[130px] bg-transparent py-[2px] text-[14px] text-notion-text placeholder:text-notion-gray focus:outline-none sm:w-[170px]"
          />
        </div>
      </div>

      {groups.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-6">
          {groups.map((group) => (
            <div key={group.kind} className="flex flex-col gap-2.5">
              {/* Inside the "Skills & Technologien" <h2>, so h3 — the group
                  headings are the section's only subheadings. The count is the
                  Notion database-group marker, not a claim about coverage. */}
              <h3 className="flex items-baseline gap-2 text-[15px] leading-[1.3] font-semibold">
                {group.label}
                <span className="text-[13px] font-normal text-notion-gray">
                  {group.categories.length}
                </span>
              </h3>
              <GalleryGrid wide>
                {group.categories.map((cat) => (
                  <div
                    key={cat.num}
                    style={cardShadow}
                    className="np-defer-card h-full overflow-hidden rounded-lg bg-[var(--surface)]"
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
            </div>
          ))}
        </div>
      )}
    </>
  );
}
