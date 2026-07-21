import { Card } from "@/components/ui/card";
import { projects, skills } from "@/lib/data";

import { SkillBar, Tag } from "./blocks";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

function formatRange(start: string, end?: string) {
  return end ? `${formatDate(start)} → ${formatDate(end)}` : formatDate(start);
}

const cardShadow = { boxShadow: "var(--notion-card-shadow)" } as const;

/* Projects — Notion gallery view ("Case Studies"), large cards. */
export function ProjectGallery() {
  return (
    <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(210px,1fr))]">
      {projects.map((p) => (
        <Card
          key={p.name}
          style={cardShadow}
          className="h-full gap-0 overflow-hidden rounded-lg border-0 bg-white p-0 py-0 shadow-none transition-colors hover:bg-[rgba(55,53,47,0.03)]"
        >
          <div className="flex flex-col gap-[7px] p-[10px]">
            <div className="text-[15px] leading-[1.3] font-semibold">
              {p.name}
            </div>
            <div className="text-[12px] text-notion-gray">
              {formatRange(p.start, p.end)}
            </div>
            <div className="flex flex-wrap gap-[6px]">
              {p.tags.map((t) => (
                <Tag key={t.label} label={t.label} color={t.color} />
              ))}
            </div>
            <p className="text-[13px] leading-[1.45] text-notion-gray">
              {p.description}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* Skills — Notion gallery view ("My Skills"), small cards. */
export function SkillsGallery() {
  return (
    <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(150px,1fr))]">
      {skills.map((s) => (
        <Card
          key={s.name}
          style={cardShadow}
          className="h-full gap-0 overflow-hidden rounded-lg border-0 bg-white p-0 py-0 shadow-none"
        >
          <div className="flex flex-col gap-[10px] p-[10px]">
            <div className="text-[14px] leading-[1.3] font-semibold">
              {s.name}
            </div>
            <div>
              <Tag label={s.type} color="gray" />
            </div>
            <SkillBar level={s.level} />
          </div>
        </Card>
      ))}
    </div>
  );
}
