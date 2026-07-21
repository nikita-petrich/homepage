"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { LayoutGrid, X } from "lucide-react";

import { Card } from "@/components/ui/card";
import { projects, type Project } from "@/lib/data";

import { Tag, ViewTab } from "./blocks";

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

/* Projects — "Case Studies" gallery; each card opens a detail popup. */
export function ProjectGallery() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <>
      <ViewTab label="Case Studies" icon={<LayoutGrid size={15} strokeWidth={2} />} />
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]">
        {projects.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => setSelected(p)}
            className="h-full cursor-pointer text-left"
          >
            <Card
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
          </button>
        ))}
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-[2px] sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.name}
    >
      <div
        className="relative my-4 h-fit w-full max-w-[720px] overflow-hidden rounded-xl bg-white shadow-[rgba(15,15,15,0.2)_0px_16px_48px] sm:my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 rounded-md bg-white/85 p-1.5 text-notion-gray backdrop-blur transition-colors hover:bg-white hover:text-notion-text"
        >
          <X size={18} />
        </button>

        <div className="relative aspect-[16/8] w-full bg-[var(--notion-placeholder)]">
          <Image
            src={project.cover}
            alt=""
            fill
            sizes="720px"
            className="object-cover"
          />
        </div>

        <div className="px-6 py-7 sm:px-10 sm:py-9">
          <div className="flex items-center gap-2">
            <Image
              src={project.icon}
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 shrink-0 object-contain"
            />
            <h2 className="text-[26px] leading-[1.2] font-bold tracking-[-0.01em]">
              {project.name}
            </h2>
          </div>

          <div className="mt-2 text-[13px] text-notion-gray">
            {formatRange(project.start, project.end)}
          </div>

          <div className="mt-3 flex flex-wrap gap-[6px]">
            {project.tags.map((t) => (
              <Tag key={t.label} label={t.label} color={t.color} />
            ))}
          </div>

          <div className="mt-6 space-y-4 text-[15px] leading-[1.7]">
            {project.details.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <h3 className="mt-7 mb-3 text-[12px] font-semibold tracking-[0.04em] text-notion-gray uppercase">
            Highlights
          </h3>
          <ul className="space-y-2">
            {project.highlights.map((h, i) => (
              <li key={i} className="flex gap-2.5 text-[14px] leading-[1.5]">
                <span className="mt-[7px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#37352f]" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
