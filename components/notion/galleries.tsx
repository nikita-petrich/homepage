import Image from "next/image";

import { Card } from "@/components/ui/card";
import { skills } from "@/lib/data";

import { SkillBar, Tag, ViewTab } from "./blocks";

const cardShadow = { boxShadow: "var(--notion-card-shadow)" } as const;

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
