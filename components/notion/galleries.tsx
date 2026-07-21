import Image from "next/image";
import { LayoutGrid } from "lucide-react";

import { Card } from "@/components/ui/card";
import { projects, skills } from "@/lib/data";

import { SkillBar, Tag, ViewTab } from "./blocks";

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

/* Projects — Notion gallery view ("Case Studies"), large cards with covers. */
export function ProjectGallery() {
  return (
    <>
      <ViewTab label="Case Studies" icon={<LayoutGrid size={15} strokeWidth={2} />} />
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]">
        {projects.map((p) => (
          <Card
            key={p.name}
            style={cardShadow}
            className="h-full gap-0 overflow-hidden rounded-lg border-0 bg-white p-0 py-0 shadow-none transition-colors hover:bg-[rgba(55,53,47,0.03)]"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--notion-placeholder)]">
              <Image
                src={p.cover}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-[7px] p-[10px]">
              <div className="flex items-center gap-1.5">
                <Image
                  src={p.icon}
                  alt=""
                  width={18}
                  height={18}
                  className="h-[18px] w-[18px] shrink-0 object-contain"
                />
                <span className="text-[15px] leading-[1.3] font-semibold">
                  {p.name}
                </span>
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
    </>
  );
}

/* Skills — Notion gallery view ("My Skills"), small cards with app icons. */
export function SkillsGallery() {
  return (
    <>
      <ViewTab
        label="My Skills"
        icon={
          <Image
            src="/assets/tab-myskills.png"
            alt=""
            width={16}
            height={16}
            className="h-4 w-4 object-contain"
          />
        }
      />
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(170px,1fr))]">
        {skills.map((s) => (
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
    </>
  );
}
