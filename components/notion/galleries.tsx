"use client";

import { useMemo, useState } from "react";
import { Search, Star } from "lucide-react";

import { skills } from "@/lib/data";

import { SkillTag } from "./blocks";

const cardShadow = { boxShadow: "var(--notion-card-shadow)" } as const;

export function SkillsGallery() {
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
  }, [query]);

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[#f1f1ef] px-2 py-[5px] text-[14px] font-medium">
          <Star size={15} strokeWidth={1.9} className="text-notion-gray" />
          Meine Skills
        </div>
        <div className="flex items-center gap-1.5 px-1 text-notion-gray">
          <Search size={16} strokeWidth={1.9} className="shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Skill suchen…"
            aria-label="Skill suchen"
            className="w-[130px] bg-transparent text-[14px] text-notion-text placeholder:text-notion-gray focus:outline-none sm:w-[170px]"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[rgba(55,53,47,0.16)] px-4 py-10 text-center text-[14px] text-notion-gray">
          Keine Treffer.
        </div>
      ) : (
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
          {visible.map((cat) => (
            <div
              key={cat.num}
              style={cardShadow}
              className="h-full overflow-hidden rounded-lg bg-white"
            >
              <div className="flex flex-col gap-[11px] p-[13px]">
                <div className="flex items-center gap-[9px]">
                  <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md bg-[var(--accent-o)] text-[11px] font-bold text-white">
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
        </div>
      )}
    </>
  );
}
