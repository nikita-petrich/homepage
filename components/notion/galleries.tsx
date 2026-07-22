"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { CaseSensitive, Hash, List } from "lucide-react";

import { Card } from "@/components/ui/card";
import { skills } from "@/lib/data";

import { SkillBar, Tag } from "./blocks";
import { DatabaseToolbar } from "./database-toolbar";

const cardShadow = { boxShadow: "var(--notion-card-shadow)" } as const;

/* Skills — Notion gallery view ("My Skills") with a working sort + search. */
export function SkillsGallery() {
  const [asc, setAsc] = useState(false); // false = high → low (default)
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = skills.filter((s) =>
      !q
        ? true
        : s.name.toLowerCase().includes(q) || s.type.toLowerCase().includes(q),
    );
    return [...list].sort((a, b) => (asc ? a.level - b.level : b.level - a.level));
  }, [query, asc]);

  return (
    <>
      <DatabaseToolbar
        viewLabel="My Skills"
        viewIcon={
          <Image
            src="/assets/tab-myskills.png"
            alt=""
            width={16}
            height={16}
            className="h-4 w-4 object-contain"
          />
        }
        sortProp="Skill Level"
        sortPropIcon={<Hash size={14} strokeWidth={1.9} />}
        sortDirLabel={asc ? "Sort low → high" : "Sort high → low"}
        onToggleSortDir={() => setAsc((v) => !v)}
        query={query}
        onQueryChange={setQuery}
        filterProps={[
          { label: "Skill", icon: <CaseSensitive size={16} strokeWidth={1.9} /> },
          { label: "Type", icon: <List size={15} strokeWidth={1.9} /> },
          { label: "Skill Level", icon: <Hash size={15} strokeWidth={1.9} /> },
        ]}
      />

      {visible.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[rgba(55,53,47,0.16)] px-4 py-10 text-center text-[14px] text-notion-gray">
          No results.
        </div>
      ) : (
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(170px,1fr))]">
          {visible.map((s) => (
            <Card
              key={s.name}
              style={cardShadow}
              className="h-full gap-0 overflow-hidden rounded-lg border-0 bg-white p-0 py-0 shadow-none"
            >
              <div className="flex flex-col gap-[10px] p-[11px]">
                <div className="flex items-center gap-2">
                  <Image
                    src={s.icon}
                    alt=""
                    width={20}
                    height={20}
                    className="h-5 w-5 shrink-0 object-contain"
                  />
                  <span className="text-[15px] leading-[1.3] font-semibold">
                    {s.name}
                  </span>
                </div>
                <div>
                  <Tag label={s.type} color="gray" />
                </div>
                <SkillBar level={s.level} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
