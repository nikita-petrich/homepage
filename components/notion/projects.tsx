"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Quote } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Project, ProjectMeta, Reference } from "@/lib/data";
import { localePath } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { format } from "@/lib/i18n/text";
import { useSearchTracking } from "@/lib/analytics/use-search-tracking";

import { DatabaseToolbar, type GalleryView } from "./database-toolbar";
import { AccentTag, SkillTag } from "./blocks";
import { CompanyLine } from "./company-line";
import { GitCodeMotif, bannerBg } from "./cover-banner";
import { EmptyState, GalleryGrid, TableShell, useGallery } from "./gallery";
import { IntentLink } from "./intent-link";
import { ModalLink } from "./modal-nav";
import { ModalShell } from "./modal-shell";

const stripe = "var(--stripe)";

function ProjectCover({
  project,
  className,
  captionClass,
  numBadge = false,
  preload = false,
}: {
  project: Project;
  className?: string;
  captionClass?: string;
  numBadge?: boolean;
  /** Set on the detail view, where the cover is the LCP element above the
      fold. The gallery cards stay lazy — they sit far below it. Next 16
      deprecated `priority` in favour of `preload`, which only emits the
      <link rel=preload>; the request priority is a separate prop now. */
  preload?: boolean;
}) {
  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      style={{ backgroundImage: stripe }}
    >
      {project.cover ? (
        <Image
          src={project.cover}
          alt={project.caption}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px"
          preload={preload}
          fetchPriority={preload ? "high" : undefined}
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-3">
          <span className={cn("text-center font-mono text-[var(--banner-caption)]", captionClass)}>
            {project.caption}
          </span>
        </div>
      )}
      {numBadge && (
        <div className="absolute top-2 left-2 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[var(--notion-text)] text-[12px] font-semibold text-[var(--notion-bg)] shadow-sm">
          {project.num}
        </div>
      )}
    </div>
  );
}

/* The meta values are part of the search surface: role, methodology, team size
   and location are shown on every project but would otherwise be
   unsearchable, so a query like "Scrum" or "Remote" would find nothing. */
const metaValues = (m: ProjectMeta) =>
  Array.isArray(m.value) ? m.value : [m.value];

const projectSearchText = (p: Project) =>
  `${p.name} ${p.subtitle} ${p.cat} ${p.desc} ${p.tech.join(" ")} ${p.meta
    .flatMap(metaValues)
    .join(" ")}`;
const projectSortKey = (p: Project) => p.sort;

/* Table view: same row target/analytics as the gallery cards, laid out as a
   CSS grid so cells stay simple <Link> children (no <a> inside <table>). */
const PROJECT_COLS =
  "grid-cols-[minmax(190px,2fr)_minmax(120px,1fr)_minmax(130px,1.1fr)]";

function ProjectTable({ projects: rows }: { projects: Project[] }) {
  const { locale, ui } = useI18n();
  return (
    <TableShell>
      <div className="min-w-[480px]">
        <div
          className={cn(
            "grid gap-3 border-b border-[var(--hairline)] px-3 py-2 text-[12px] font-medium text-notion-gray",
            PROJECT_COLS,
          )}
        >
          <div>{ui.projects.colName}</div>
          <div>{ui.projects.colCompany}</div>
          <div>{ui.projects.colCategory}</div>
        </div>
        {rows.map((p) => (
          <IntentLink
            key={p.num}
            href={localePath(locale, `/projects/${p.slug}`)}
            scroll={false}
            data-analytics-event="project_open"
            data-analytics-prop-slug={p.slug}
            data-analytics-prop-source="table"
            className={cn(
              "grid items-center gap-3 border-b border-[var(--hairline-faint)] px-3 py-2.5 text-[13px] transition-colors last:border-0 hover:bg-[var(--surface-hover-soft)]",
              PROJECT_COLS,
            )}
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--notion-text)] text-[11px] font-semibold text-[var(--notion-bg)]">
                {p.num}
              </span>
              <div className="min-w-0">
                <div className="truncate font-medium">{p.name}</div>
                <div className="truncate text-[12px] text-notion-gray">
                  {p.subtitle}
                </div>
              </div>
            </div>
            <div className="truncate text-notion-gray">{p.company ?? "—"}</div>
            <div className="min-w-0">
              <AccentTag label={p.cat} />
            </div>
          </IntentLink>
        ))}
      </div>
    </TableShell>
  );
}

export function ProjectGallery({ projects }: { projects: Project[] }) {
  const { locale } = useI18n();
  const [view, setView] = useState<GalleryView>("gallery");
  const { query, setQuery, visible } = useGallery(
    projects,
    projectSearchText,
    projectSortKey,
  );

  useSearchTracking("projects", query, visible.length);

  return (
    <>
      <DatabaseToolbar
        view={view}
        onViewChange={setView}
        query={query}
        onQueryChange={setQuery}
      />

      {visible.length === 0 ? (
        <EmptyState />
      ) : view === "table" ? (
        <ProjectTable projects={visible} />
      ) : (
        <GalleryGrid>
          {visible.map((p) => (
            <IntentLink
              key={p.num}
              href={localePath(locale, `/projects/${p.slug}`)}
              scroll={false}
              data-analytics-event="project_open"
              data-analytics-prop-slug={p.slug}
              data-analytics-prop-source="gallery"
              style={{ boxShadow: "var(--notion-card-shadow)" }}
              className="h-full cursor-pointer overflow-hidden rounded-lg bg-[var(--surface)] text-left transition-colors hover:bg-[var(--surface-hover-soft)]"
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
                <div className="text-[13px] leading-[1.4] text-notion-soft">
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
            </IntentLink>
          ))}
        </GalleryGrid>
      )}
    </>
  );
}

/* Meta values that are bare domains/URLs (e.g. "bescheidklar.de",
   "github.com/…") become clickable outbound links instead of dead text. */
const DOMAIN_RE = /^[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?$/i;

function MetaValue({ value }: { value: string }) {
  if (!DOMAIN_RE.test(value.trim())) return <>{value}</>;
  const href = `https://${value.trim()}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-analytics-event="outbound_click"
      data-analytics-prop-target-domain={value.trim().split("/")[0] ?? ""}
      data-analytics-prop-link-label="project_meta"
      className="underline underline-offset-2 hover:text-[var(--accent-text)]"
    >
      {value}
    </a>
  );
}

/* Shared by the intercepting modal route and the standalone page, which each
   pass their own onClose. */
export function ProjectModal({
  project,
  references: projectRefs,
  onClose,
}: {
  project: Project;
  /** Testimonials for this project, resolved by the route that renders it. */
  references: Reference[];
  onClose: () => void;
}) {
  const { locale, ui } = useI18n();

  return (
    <ModalShell label={project.name} onClose={onClose}>
      <>
        {project.cover ? (
          <ProjectCover
            project={project}
            className="aspect-[16/8]"
            captionClass="text-[13px]"
            preload
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
          <div className="text-[12px] font-semibold tracking-[0.06em] text-[var(--accent-text)] uppercase">
            {project.cat}
          </div>
          <div className="mt-2 flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--notion-text)] text-[13px] font-semibold text-[var(--notion-bg)]">
              {project.num}
            </span>
            <h2 className="text-[26px] leading-[1.2] font-bold tracking-[-0.01em]">
              {project.name}
            </h2>
          </div>
          <div className="mt-1.5 text-[16px] font-semibold text-notion-soft">
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

          <div className="mt-[18px] grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--border-soft)] bg-[var(--hairline)] sm:grid-cols-3">
            {/* min-w-0: grid items default to min-width:auto, so a long value
                ("Direkte Produktverantwortung") widened its column past the
                container and overflow-hidden clipped the text mid-word on
                phones (≤375px). break-words handles unbreakable tokens. */}
            {project.meta.map((m) => (
              <div
                key={m.label}
                className="min-w-0 bg-[var(--surface-muted)] px-2.5 py-2 sm:px-3.5 sm:py-2.5"
              >
                <div className="text-[10px] font-semibold tracking-[0.06em] text-notion-gray uppercase">
                  {m.label}
                </div>
                {/* A cell with several values stacks them; one value renders
                    exactly as it did before the list case existed. The cells
                    are narrow enough that a value wraps on phones, which would
                    leave its tail sitting flush above the next value and
                    reading as one line — so a multi-value cell hangs its wrapped
                    lines, keeping each value's first line on the left edge. */}
                <div className="mt-1 flex flex-col gap-[3px] text-[13px] leading-[1.35] break-words text-notion-text">
                  {metaValues(m).map((v, _i, all) => (
                    <span
                      key={v}
                      className={cn(all.length > 1 && "pl-2.5 -indent-2.5")}
                    >
                      <MetaValue value={v} />
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <h3 className="mt-6 mb-2.5 text-[12px] font-semibold tracking-[0.04em] text-notion-gray uppercase">
            {ui.projects.responsibilities}
          </h3>
          <ul className="flex flex-col gap-[9px]">
            {project.responsibilities.map((a, i) => (
              <li key={i} className="flex gap-2.5 text-[14px] leading-[1.55]">
                <span className="mt-[8px] h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--notion-text)]" />
                <span>{a}</span>
              </li>
            ))}
          </ul>

          <div className="mt-[22px] rounded-lg border border-[var(--border-soft)] bg-[var(--accent-soft)] p-4">
            <h3 className="mb-2.5 text-[12px] font-semibold tracking-[0.04em] text-[var(--accent-text)] uppercase">
              {ui.projects.results}
            </h3>
            <ul className="flex flex-col gap-2">
              {project.results.map((e, i) => (
                <li key={i} className="flex gap-2.5 text-[14px] leading-[1.5]">
                  <span className="mt-[7px] h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--accent-o)]" />
                  <span className="text-notion-soft">{e}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Targets, where a project has them — outside the accent-coloured
              results panel and in the muted, neutral treatment, so a forecast
              never borrows the visual weight the measured results carry. */}
          {project.outlook && project.outlook.length > 0 && (
            <div className="mt-3 rounded-lg border border-dashed border-[var(--border-soft)] p-4">
              <h3 className="mb-2.5 text-[12px] font-semibold tracking-[0.04em] text-notion-gray uppercase">
                {ui.projects.outlook}
              </h3>
              <ul className="flex flex-col gap-2">
                {project.outlook.map((e, i) => (
                  <li key={i} className="flex gap-2.5 text-[14px] leading-[1.5]">
                    <span className="mt-[7px] h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--notion-divider)]" />
                    <span className="text-notion-gray">{e}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {projectRefs.length > 0 && (
            <>
              <h3 className="mt-6 mb-2.5 text-[12px] font-semibold tracking-[0.04em] text-notion-gray uppercase">
                {projectRefs.length > 1
                  ? ui.projects.references
                  : ui.projects.reference}
              </h3>
              <div className="flex flex-wrap gap-2">
                {projectRefs.map((r) => (
                  <ModalLink
                    key={r.slug}
                    href={localePath(locale, `/references/${r.slug}`)}
                    data-analytics-event="reference_open"
                    data-analytics-prop-slug={r.slug}
                    data-analytics-prop-source="project_modal"
                    aria-label={format(ui.projects.viewReference, {
                      name: r.name,
                    })}
                    className="inline-flex items-center gap-1.5 rounded-md border border-[color-mix(in_srgb,var(--accent-o)_35%,transparent)] bg-[var(--accent-soft)] px-2.5 py-1 text-[13px] font-medium text-[var(--accent-text)] transition-colors hover:bg-[var(--accent-soft-hover)]"
                  >
                    <Quote size={13} strokeWidth={2} className="shrink-0" />
                    <span>{r.name}</span>
                    <ArrowUpRight size={13} strokeWidth={2} className="opacity-70" />
                  </ModalLink>
                ))}
                {/* Every testimonial of this project on one shareable URL —
                    only worth its own link once there is more than one. */}
                {projectRefs.length > 1 && (
                  <ModalLink
                    href={localePath(
                      locale,
                      `/projects/${project.slug}/references`,
                    )}
                    data-analytics-event="project_references_open"
                    data-analytics-prop-slug={project.slug}
                    data-analytics-prop-source="project_modal"
                    aria-label={format(ui.projects.viewAllReferences, {
                      count: projectRefs.length,
                      project: project.name,
                    })}
                    className="inline-flex items-center gap-1.5 rounded-md bg-[var(--surface-chip)] px-2.5 py-1 text-[13px] font-medium text-notion-soft transition-colors hover:bg-[var(--surface-hover-strong)]"
                  >
                    <span>
                      {format(ui.projects.viewAll, {
                        count: projectRefs.length,
                      })}
                    </span>
                    <ArrowUpRight size={13} strokeWidth={2} className="opacity-70" />
                  </ModalLink>
                )}
              </div>
            </>
          )}

          <h3 className="mt-6 mb-2.5 text-[12px] font-semibold tracking-[0.04em] text-notion-gray uppercase">
            {ui.projects.technologies}
          </h3>
          <div className="flex flex-wrap gap-[6px]">
            {project.tech.map((t) => (
              <SkillTag key={t} label={t} />
            ))}
          </div>
        </div>
      </>
    </ModalShell>
  );
}
