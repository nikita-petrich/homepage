"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Calendar,
  ExternalLink,
  Quote,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  references,
  referenceSources,
  type Project,
  type Reference,
} from "@/lib/data";
import { useSearchTracking } from "@/lib/analytics/use-search-tracking";

import { DatabaseToolbar, type GalleryView } from "./database-toolbar";
import { AccentTag } from "./blocks";
import { CompanyLine } from "./company-line";
import { bannerBg } from "./cover-banner";
import { EmptyState, GalleryGrid, TableShell, useGallery } from "./gallery";
import { ModalShell } from "./modal-shell";

/* Two-letter monogram for the recommender avatar (e.g. "Suraj Kakar" → "SK"). */
function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/* Outbound, verifiable-source tag (LinkedIn / Malt → Nikita's own profiles). */
function SourceTag({ source }: { source: Reference["sources"][number] }) {
  const s = referenceSources[source];
  return (
    <a
      href={s.href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      data-analytics-event="reference_source_click"
      data-analytics-prop-source={s.label}
      aria-label={`Referenz auf ${s.label} ansehen`}
      className="inline-flex items-center gap-1 rounded-[4px] bg-[#f1f0ee] px-[7px] py-px text-[12px] font-medium text-[#4a473f] transition-colors hover:bg-[rgba(55,53,47,0.1)]"
    >
      {s.label}
      <ExternalLink size={11} strokeWidth={2} className="opacity-70" />
    </a>
  );
}

/* Branded card cover, mirroring the certificate/project placeholders: warm
   banner, left accent bar, a quote mark and the verifiable-source labels. */
function ReferenceCover({ reference: r }: { reference: Reference }) {
  return (
    <div
      className="relative aspect-[16/9] w-full overflow-hidden"
      style={{ backgroundImage: bannerBg }}
    >
      <div className="absolute inset-y-0 left-0 w-[5px] bg-[var(--accent-o)]" />

      <span className="absolute top-2 right-2 flex flex-wrap justify-end gap-1">
        {r.sources.map((s) => (
          <span
            key={s}
            className="rounded-[4px] bg-white/70 px-[6px] py-px text-[10px] font-semibold text-[#6f5b3e]"
          >
            {referenceSources[s].label}
          </span>
        ))}
      </span>

      <div className="flex h-full flex-col items-center justify-center gap-1.5 px-3 text-center">
        <Quote size={28} strokeWidth={1.7} className="text-[var(--accent-o)]" />
        <span className="text-[10px] font-semibold tracking-[0.14em] text-[#6b614e] uppercase">
          Empfehlung
        </span>
      </div>
    </div>
  );
}

/* Compact card in the gallery grid — same footprint as the project cards.
   The quote is clamped to a preview; the full text lives in the dialog. */
function ReferenceCard({ reference: r }: { reference: Reference }) {
  return (
    <Link
      href={`/references/${r.slug}`}
      scroll={false}
      data-analytics-event="reference_open"
      data-analytics-prop-slug={r.slug}
      data-analytics-prop-source="gallery"
      aria-label={`Referenz von ${r.name} öffnen`}
      style={{ boxShadow: "var(--notion-card-shadow)" }}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-lg bg-white text-left transition-colors hover:bg-[rgba(55,53,47,0.02)]"
    >
      <ReferenceCover reference={r} />
      <div className="flex flex-1 flex-col gap-[6px] p-[11px]">
        <div className="text-[15px] leading-[1.3] font-semibold">{r.name}</div>
        {r.company ? (
          <CompanyLine
            name={r.company}
            href={r.companyUrl}
            inCard
            className="text-[12px]"
          />
        ) : (
          <div className="line-clamp-1 text-[12px] text-notion-gray">{r.role}</div>
        )}
        <p className="line-clamp-3 text-[13px] leading-[1.5] text-notion-gray">
          {`„${r.quote}“`}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-[6px] pt-1">
          <AccentTag label={r.relation} />
          <span className="rounded-[4px] bg-[#f1f0ee] px-[7px] py-px text-[12px] font-medium text-[#4a473f]">
            {r.project}
          </span>
        </div>
      </div>
    </Link>
  );
}

/* Full-content dialog, shared by the intercepting modal route and the
   standalone page (each passes its own onClose). Mirrors ProjectModal. */
export function ReferenceModal({
  reference: r,
  onClose,
}: {
  reference: Reference;
  onClose: () => void;
}) {
  return (
    <ModalShell
      label={`Referenz von ${r.name}`}
      onClose={onClose}
      maxWidthClass="max-w-[640px]"
    >
      <>
        <div
          className="relative flex items-center gap-4 overflow-hidden px-6 py-6 sm:px-8"
          style={{ backgroundImage: bannerBg }}
        >
          <div className="absolute inset-y-0 left-0 w-[5px] bg-[var(--accent-o)]" />
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#ece3d3] text-[18px] font-semibold text-[#6f5b3e]">
            {initials(r.name)}
          </span>
          <div className="min-w-0">
            <h2 className="text-[20px] leading-[1.2] font-bold tracking-[-0.01em]">
              {r.name}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-1 text-[13px] leading-[1.45] text-[#4a473f]">
              <span>{r.role}</span>
              {r.company ? (
                <>
                  <span aria-hidden>·</span>
                  <CompanyLine
                    name={r.company}
                    href={r.companyUrl}
                    className="text-[13px]"
                  />
                </>
              ) : null}
            </div>
          </div>
        </div>

        <div className="px-6 py-7 sm:px-8">
          <Quote
            size={26}
            strokeWidth={1.8}
            className="mb-3 text-[var(--accent-o)]"
            aria-hidden
          />
          <blockquote className="text-[15px] leading-[1.7] whitespace-pre-line text-[#37352f]">
            {r.quote}
          </blockquote>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-[rgba(55,53,47,0.09)] pt-4">
            <AccentTag label={r.relation} />
            {r.projectSlug ? (
              <Link
                href={`/projects/${r.projectSlug}`}
                scroll={false}
                data-analytics-event="project_open"
                data-analytics-prop-slug={r.projectSlug}
                data-analytics-prop-source="reference_modal"
                className="inline-flex items-center gap-1 rounded-[4px] bg-[#f1f0ee] px-[7px] py-px text-[12px] font-medium text-[#4a473f] transition-colors hover:bg-[rgba(55,53,47,0.1)]"
              >
                {r.project}
                <ArrowUpRight size={12} strokeWidth={2} className="opacity-70" />
              </Link>
            ) : (
              <span className="text-[12px] text-notion-gray">{r.project}</span>
            )}
            <span className="ml-auto flex items-center gap-1.5">
              <span className="text-[12px] text-notion-gray">Quelle:</span>
              {r.sources.map((s) => (
                <SourceTag key={s} source={s} />
              ))}
            </span>
          </div>
        </div>
      </>
    </ModalShell>
  );
}

/* One full testimonial inside the per-project listing — same content as the
   single-reference dialog, stacked instead of standalone, and each still
   linking to its own permanent URL. */
function ReferenceEntry({ reference: r }: { reference: Reference }) {
  return (
    <li className="rounded-lg border border-[rgba(55,53,47,0.1)] bg-[#faf9f7] p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ece3d3] text-[15px] font-semibold text-[#6f5b3e]">
          {initials(r.name)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[15px] leading-[1.3] font-semibold">{r.name}</div>
          <div className="mt-0.5 flex flex-wrap items-center gap-1 text-[12px] leading-[1.45] text-notion-gray">
            <span>{r.role}</span>
            {r.company ? (
              <>
                <span aria-hidden>·</span>
                <CompanyLine
                  name={r.company}
                  href={r.companyUrl}
                  className="text-[12px]"
                />
              </>
            ) : null}
          </div>
        </div>
        <AccentTag label={r.relation} />
      </div>

      <blockquote className="mt-3 text-[14px] leading-[1.65] whitespace-pre-line text-[#37352f]">
        {`„${r.quote}“`}
      </blockquote>

      <div className="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-[rgba(55,53,47,0.09)] pt-3">
        <Link
          href={`/references/${r.slug}`}
          scroll={false}
          data-analytics-event="reference_open"
          data-analytics-prop-slug={r.slug}
          data-analytics-prop-source="project_references"
          aria-label={`Referenz von ${r.name} einzeln öffnen`}
          className="inline-flex items-center gap-1 rounded-[4px] bg-[#f1f0ee] px-[7px] py-px text-[12px] font-medium text-[#4a473f] transition-colors hover:bg-[rgba(55,53,47,0.1)]"
        >
          Einzelansicht
          <ArrowUpRight size={12} strokeWidth={2} className="opacity-70" />
        </Link>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="text-[12px] text-notion-gray">Quelle:</span>
          {r.sources.map((s) => (
            <SourceTag key={s} source={s} />
          ))}
        </span>
      </div>
    </li>
  );
}

/* All references for one project on a single permanent URL
   (/projects/<slug>/references) — shareable in an application or proposal
   without the reader having to open one dialog per testimonial. Shared by the
   intercepting modal route and the standalone page, which pass their own
   onClose. */
export function ProjectReferencesModal({
  project,
  references: projectRefs,
  onClose,
}: {
  project: Project;
  references: Reference[];
  onClose: () => void;
}) {
  const count =
    projectRefs.length === 1 ? "1 Referenz" : `${projectRefs.length} Referenzen`;

  return (
    <ModalShell label={`Referenzen zu ${project.name}`} onClose={onClose}>
      <>
        <div
          className="relative overflow-hidden px-6 py-6 sm:px-8"
          style={{ backgroundImage: bannerBg }}
        >
          <div className="absolute inset-y-0 left-0 w-[5px] bg-[var(--accent-o)]" />
          <div className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.06em] text-[var(--accent-text)] uppercase">
            <Quote size={14} strokeWidth={2} aria-hidden />
            Referenzen
          </div>
          <h2 className="mt-2 text-[22px] leading-[1.2] font-bold tracking-[-0.01em]">
            {project.name}
          </h2>
          <div className="mt-1 text-[13px] leading-[1.45] text-[#4a473f]">
            {project.subtitle} · {count}
          </div>
        </div>

        <div className="px-6 py-7 sm:px-8">
          <ul className="flex flex-col gap-3.5">
            {projectRefs.map((r) => (
              <ReferenceEntry key={r.slug} reference={r} />
            ))}
          </ul>

          <div className="mt-6 border-t border-[rgba(55,53,47,0.09)] pt-4">
            <Link
              href={`/projects/${project.slug}`}
              scroll={false}
              data-analytics-event="project_open"
              data-analytics-prop-slug={project.slug}
              data-analytics-prop-source="project_references"
              className="inline-flex items-center gap-1.5 rounded-md border border-[rgba(225,133,46,0.35)] bg-[#faf6f0] px-2.5 py-1 text-[13px] font-medium text-[var(--accent-text)] transition-colors hover:bg-[#f6ede1]"
            >
              Zum Projekt
              <ArrowUpRight size={13} strokeWidth={2} className="opacity-70" />
            </Link>
          </div>
        </div>
      </>
    </ModalShell>
  );
}

/* Referenzen — testimonials shown as a card gallery after the projects,
   mirroring their size and behaviour: a clamped preview per card, full text in
   the dialog. Each card has a permanent URL (/references/<slug>). */
const referenceSearchText = (r: Reference) =>
  `${r.name} ${r.role} ${r.company ?? ""} ${r.project} ${r.quote}`;
const referenceSortKey = (r: Reference) => r.sort;

/* Table view: same row target/analytics as the gallery cards. */
const REFERENCE_COLS =
  "grid-cols-[minmax(170px,1.6fr)_minmax(140px,1.2fr)_minmax(120px,1fr)]";

function ReferenceTable({ references: rows }: { references: Reference[] }) {
  return (
    <TableShell>
      <div className="min-w-[460px]">
        <div
          className={cn(
            "grid gap-3 border-b border-[rgba(55,53,47,0.09)] px-3 py-2 text-[12px] font-medium text-notion-gray",
            REFERENCE_COLS,
          )}
        >
          <div>Name</div>
          <div>Firma</div>
          <div>Bezug</div>
        </div>
        {rows.map((r) => (
          <Link
            key={r.slug}
            href={`/references/${r.slug}`}
            scroll={false}
            data-analytics-event="reference_open"
            data-analytics-prop-slug={r.slug}
            data-analytics-prop-source="table"
            aria-label={`Referenz von ${r.name} öffnen`}
            className={cn(
              "grid items-center gap-3 border-b border-[rgba(55,53,47,0.06)] px-3 py-2.5 text-[13px] transition-colors last:border-0 hover:bg-[rgba(55,53,47,0.02)]",
              REFERENCE_COLS,
            )}
          >
            <div className="truncate font-medium">{r.name}</div>
            <div className="truncate text-notion-gray">{r.company ?? "—"}</div>
            <div className="min-w-0">
              <AccentTag label={r.relation} />
            </div>
          </Link>
        ))}
      </div>
    </TableShell>
  );
}

export function ReferenceGallery() {
  const [view, setView] = useState<GalleryView>("gallery");
  const { query, setQuery, sortDirLabel, toggleSort, visible } = useGallery(
    references,
    referenceSearchText,
    referenceSortKey,
  );

  useSearchTracking("references", query, visible.length);

  return (
    <>
      <DatabaseToolbar
        view={view}
        onViewChange={setView}
        sortProp="Datum"
        sortPropIcon={<Calendar size={14} strokeWidth={1.9} />}
        sortDirLabel={sortDirLabel}
        onToggleSortDir={toggleSort}
        query={query}
        onQueryChange={setQuery}
      />

      {visible.length === 0 ? (
        <EmptyState />
      ) : view === "table" ? (
        <ReferenceTable references={visible} />
      ) : (
        <GalleryGrid>
          {visible.map((r) => (
            <ReferenceCard key={r.slug} reference={r} />
          ))}
        </GalleryGrid>
      )}
    </>
  );
}
