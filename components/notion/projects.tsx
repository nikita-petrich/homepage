"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlignLeft, ArrowUpRight, Calendar, CaseSensitive, LayoutGrid, Quote, Tags, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { projects, references, type Project } from "@/lib/data";
import { useSearchTracking } from "@/lib/analytics/use-search-tracking";

import { DatabaseToolbar } from "./database-toolbar";
import { AccentTag, SkillTag } from "./blocks";
import { CompanyLine } from "./company-line";
import { GitCodeMotif, bannerBg } from "./cover-banner";

const stripe =
  "repeating-linear-gradient(135deg,#f2efe9 0 10px,#eae6dd 10px 20px)";

function ProjectCover({
  project,
  className,
  captionClass,
  numBadge = false,
}: {
  project: Project;
  className?: string;
  captionClass?: string;
  numBadge?: boolean;
}) {
  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      style={{ backgroundImage: stripe }}
    >
      {project.cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.cover}
          alt={project.caption}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-3">
          <span className={cn("text-center font-mono text-[#9a8f7c]", captionClass)}>
            {project.caption}
          </span>
        </div>
      )}
      {numBadge && (
        <div className="absolute top-2 left-2 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#37352f] text-[12px] font-semibold text-white shadow-sm">
          {project.num}
        </div>
      )}
    </div>
  );
}

export function ProjectGallery() {
  const [asc, setAsc] = useState(false); // false = newest first
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = projects.filter((p) =>
      !q
        ? true
        : (
            p.name +
            " " +
            p.subtitle +
            " " +
            p.cat +
            " " +
            p.desc +
            " " +
            p.tech.join(" ")
          )
            .toLowerCase()
            .includes(q),
    );
    return [...list].sort((a, b) => {
      const cmp = a.sort.localeCompare(b.sort);
      return asc ? cmp : -cmp;
    });
  }, [query, asc]);

  useSearchTracking("projects", query, visible.length);

  return (
    <>
      <DatabaseToolbar
        viewLabel="Case Studies"
        viewIcon={<LayoutGrid size={15} strokeWidth={2} />}
        sortProp="Datum"
        sortPropIcon={<Calendar size={14} strokeWidth={1.9} />}
        sortDirLabel={asc ? "Älteste zuerst" : "Neueste zuerst"}
        onToggleSortDir={() => setAsc((v) => !v)}
        query={query}
        onQueryChange={setQuery}
        filterProps={[
          { label: "Name", icon: <CaseSensitive size={16} strokeWidth={1.9} /> },
          { label: "Datum", icon: <Calendar size={15} strokeWidth={1.9} /> },
          { label: "Beschreibung", icon: <AlignLeft size={15} strokeWidth={1.9} /> },
          { label: "Tags", icon: <Tags size={15} strokeWidth={1.9} /> },
        ]}
      />

      {visible.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[rgba(55,53,47,0.16)] px-4 py-10 text-center text-[14px] text-notion-gray">
          Keine Treffer.
        </div>
      ) : (
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]">
          {visible.map((p) => (
            <Link
              key={p.num}
              href={`/projekte/${p.slug}`}
              scroll={false}
              data-analytics-event="project_open"
              data-analytics-prop-slug={p.slug}
              data-analytics-prop-source="gallery"
              style={{ boxShadow: "var(--notion-card-shadow)" }}
              className="h-full cursor-pointer overflow-hidden rounded-lg bg-white text-left transition-colors hover:bg-[rgba(55,53,47,0.02)]"
            >
              <ProjectCover
                project={p}
                className="aspect-[16/9]"
                captionClass="text-[11px] leading-[1.4]"
                numBadge
              />
              <div className="flex flex-col gap-[6px] p-[11px]">
                <div className="text-[15px] leading-[1.3] font-semibold">
                  {p.name}
                </div>
                <div className="text-[13px] leading-[1.4] text-[#4a473f]">
                  {p.subtitle}
                </div>
                {p.company ? (
                  <CompanyLine
                    name={p.company}
                    href={p.companyUrl}
                    inCard
                    className="text-[12px]"
                  />
                ) : null}
                <div className="text-[12px] text-notion-gray">{p.dateRange}</div>
                <div className="mt-auto flex flex-wrap gap-[6px] pt-0.5">
                  {p.cardTags.map((t) => (
                    <AccentTag key={t} label={t} />
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

/* Shared by the intercepting modal route and the standalone page, which each
   pass their own onClose. */
export function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  // Escape to close + lock body scroll while the modal is open.
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

  const projectRefs = references.filter((r) => r.projectSlug === project.slug);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-[2px] sm:p-6"
      style={{ animation: "np-overlay-in 0.2s ease-out" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.name}
    >
      <div
        className="relative my-4 h-fit w-full max-w-[720px] overflow-hidden rounded-xl bg-white shadow-[rgba(15,15,15,0.2)_0px_16px_48px] sm:my-8"
        style={{ animation: "np-modal-in 0.28s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Schließen"
          className="absolute top-3 right-3 z-10 rounded-md bg-white/85 p-1.5 text-notion-gray backdrop-blur transition-colors hover:bg-white hover:text-notion-text"
        >
          <X size={18} />
        </button>

        {project.cover ? (
          <ProjectCover
            project={project}
            className="aspect-[16/8]"
            captionClass="text-[13px]"
          />
        ) : (
          <div
            className="relative flex aspect-[16/8] w-full items-center overflow-hidden px-8 sm:px-12"
            style={{ backgroundImage: bannerBg }}
          >
            <div className="absolute inset-y-0 left-0 w-[5px] bg-[var(--accent-o)]" />
            <GitCodeMotif className="text-[clamp(13px,2.6vw,20px)]" />
          </div>
        )}

        <div className="px-6 py-7 sm:px-10 sm:py-9">
          <div className="text-[12px] font-semibold tracking-[0.06em] text-[var(--accent-o)] uppercase">
            {project.cat}
          </div>
          <div className="mt-2 flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#37352f] text-[13px] font-semibold text-white">
              {project.num}
            </span>
            <h2 className="text-[26px] leading-[1.2] font-bold tracking-[-0.01em]">
              {project.name}
            </h2>
          </div>
          <div className="mt-1.5 text-[16px] font-semibold text-[#4a473f]">
            {project.subtitle}
          </div>
          {project.company ? (
            <CompanyLine
              name={project.company}
              href={project.companyUrl}
              className="mt-1.5 text-[13px]"
            />
          ) : null}
          <div className="mt-2 text-[13px] text-notion-gray">
            {project.dateRange} · {project.role}
          </div>

          <div className="mt-[18px] grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[rgba(55,53,47,0.1)] bg-[rgba(55,53,47,0.09)] sm:grid-cols-3">
            {project.meta.map((m) => (
              <div key={m.label} className="bg-[#faf9f7] px-3.5 py-2.5">
                <div className="text-[10px] font-semibold tracking-[0.06em] text-notion-gray uppercase">
                  {m.label}
                </div>
                <div className="mt-1 text-[13px] leading-[1.35] text-[#37352f]">
                  {m.value}
                </div>
              </div>
            ))}
          </div>

          <h3 className="mt-6 mb-2.5 text-[12px] font-semibold tracking-[0.04em] text-notion-gray uppercase">
            Aufgaben
          </h3>
          <ul className="flex flex-col gap-[9px]">
            {project.aufgaben.map((a, i) => (
              <li key={i} className="flex gap-2.5 text-[14px] leading-[1.55]">
                <span className="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#37352f]" />
                <span>{a}</span>
              </li>
            ))}
          </ul>

          <div className="mt-[22px] rounded-lg border border-[rgba(55,53,47,0.1)] bg-[#faf6f0] p-4">
            <h3 className="mb-2.5 text-[12px] font-semibold tracking-[0.04em] text-[var(--accent-o)] uppercase">
              Ergebnis
            </h3>
            <ul className="flex flex-col gap-2">
              {project.ergebnis.map((e, i) => (
                <li key={i} className="flex gap-2.5 text-[14px] leading-[1.5]">
                  <span className="mt-[7px] h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--accent-o)]" />
                  <span className="text-[#4a473f]">{e}</span>
                </li>
              ))}
            </ul>
          </div>

          {projectRefs.length > 0 && (
            <>
              <h3 className="mt-6 mb-2.5 text-[12px] font-semibold tracking-[0.04em] text-notion-gray uppercase">
                {projectRefs.length > 1 ? "Referenzen" : "Referenz"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {projectRefs.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/referenzen/${r.slug}`}
                    scroll={false}
                    data-analytics-event="reference_open"
                    data-analytics-prop-slug={r.slug}
                    data-analytics-prop-source="project_modal"
                    aria-label={`Referenz von ${r.name} ansehen`}
                    className="inline-flex items-center gap-1.5 rounded-md border border-[rgba(225,133,46,0.35)] bg-[#faf6f0] px-2.5 py-1 text-[13px] font-medium text-[var(--accent-o)] transition-colors hover:bg-[#f6ede1]"
                  >
                    <Quote size={13} strokeWidth={2} className="shrink-0" />
                    <span>{r.name}</span>
                    <ArrowUpRight size={13} strokeWidth={2} className="opacity-70" />
                  </Link>
                ))}
              </div>
            </>
          )}

          <h3 className="mt-6 mb-2.5 text-[12px] font-semibold tracking-[0.04em] text-notion-gray uppercase">
            Technologien
          </h3>
          <div className="flex flex-wrap gap-[6px]">
            {project.tech.map((t) => (
              <SkillTag key={t} label={t} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
