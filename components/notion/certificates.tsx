"use client";

import { useState } from "react";
import { Award, Calendar, ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils";
import { certificates, type Certificate } from "@/lib/data";
import { useSearchTracking } from "@/lib/analytics/use-search-tracking";

import { DatabaseToolbar, type GalleryView } from "./database-toolbar";
import { AccentTag } from "./blocks";
import { bannerBg } from "./cover-banner";
import { EmptyState, GalleryGrid, TableShell, useGallery } from "./gallery";

/* Permanent, shareable link for a certificate: the self-hosted PDF at
   /certificates/<slug>.pdf, or an official external URL when not yet hosted. */
export const certHref = (c: Certificate) =>
  c.externalUrl ?? `/certificates/${c.slug}.pdf`;

/* Per-platform pill styling (Notion select colours). */
const issuerPill: Record<Certificate["issuer"], string> = {
  Scrimba: "bg-[var(--pill-green)] text-[#2a6b3a]",
  "Code with Mosh": "bg-[var(--pill-blue)] text-[#24618a]",
  Udemy: "bg-[var(--pill-purple)] text-[#6b4a86]",
};

/* Certificate "cover" — a branded band mirroring the projects placeholder:
   warm banner background, left accent bar, platform badge and an award mark. */
function CertificateCover({ cert }: { cert: Certificate }) {
  return (
    <div
      className="relative aspect-[16/9] w-full overflow-hidden"
      style={{ backgroundImage: bannerBg }}
    >
      <div className="absolute inset-y-0 left-0 w-[5px] bg-[var(--accent-o)]" />

      <span
        className={cn(
          "absolute top-2 left-[13px] rounded-[4px] px-[7px] py-[2px] text-[11px] font-semibold",
          issuerPill[cert.issuer],
        )}
      >
        {cert.issuer}
      </span>

      <span className="absolute top-2 right-2 text-notion-gray opacity-70 transition-opacity group-hover:opacity-100">
        <ExternalLink size={15} strokeWidth={2} />
      </span>

      <div className="flex h-full flex-col items-center justify-center gap-1.5 px-3 text-center">
        <Award size={30} strokeWidth={1.6} className="text-[var(--accent-o)]" />
        <span className="text-[10px] font-semibold tracking-[0.14em] text-[#6b614e] uppercase">
          Zertifikat
        </span>
      </div>
    </div>
  );
}

/* Certificates — "Nachweise" gallery. Each card opens the certificate PDF in a
   new tab via its permanent URL (/certificates/<slug>.pdf); the slug never
   changes, so a shared link stays valid forever. */
const certificateSearchText = (c: Certificate) =>
  `${c.title} ${c.issuer} ${c.cat} ${c.tags.join(" ")}`;
const certificateSortKey = (c: Certificate) => c.sort;

/* Table view: same target (PDF/external, new tab) and analytics as the
   gallery cards. */
const CERTIFICATE_COLS =
  "grid-cols-[minmax(190px,2fr)_minmax(130px,1fr)_minmax(130px,1.1fr)_28px]";

function CertificateTable({ certificates: rows }: { certificates: Certificate[] }) {
  return (
    <TableShell>
      <div className="min-w-[500px]">
        <div
          className={cn(
            "grid gap-3 border-b border-[rgba(55,53,47,0.09)] px-3 py-2 text-[12px] font-medium text-notion-gray",
            CERTIFICATE_COLS,
          )}
        >
          <div>Titel</div>
          <div>Aussteller</div>
          <div>Kategorie</div>
          <div />
        </div>
        {rows.map((c) => (
          <a
            key={c.slug}
            href={certHref(c)}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics-event="certificate_open"
            data-analytics-prop-slug={c.slug}
            data-analytics-prop-issuer={c.issuer}
            data-analytics-prop-target={c.externalUrl ? "external" : "pdf"}
            aria-label={`Zertifikat „${c.title}“ (${c.issuer}) öffnen`}
            className={cn(
              "grid items-center gap-3 border-b border-[rgba(55,53,47,0.06)] px-3 py-2.5 text-[13px] transition-colors last:border-0 hover:bg-[rgba(55,53,47,0.02)]",
              CERTIFICATE_COLS,
            )}
          >
            <div className="truncate font-medium">{c.title}</div>
            <div className="min-w-0">
              <span
                className={cn(
                  "rounded-[4px] px-[7px] py-[2px] text-[11px] font-semibold",
                  issuerPill[c.issuer],
                )}
              >
                {c.issuer}
              </span>
            </div>
            <div className="min-w-0">
              <AccentTag label={c.cat} />
            </div>
            <ExternalLink
              size={14}
              strokeWidth={2}
              className="text-notion-gray"
            />
          </a>
        ))}
      </div>
    </TableShell>
  );
}

export function CertificateGallery() {
  const [view, setView] = useState<GalleryView>("gallery");
  const { query, setQuery, sortDirLabel, toggleSort, visible } = useGallery(
    certificates,
    certificateSearchText,
    certificateSortKey,
  );

  useSearchTracking("certificates", query, visible.length);

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
        <CertificateTable certificates={visible} />
      ) : (
        <GalleryGrid>
          {visible.map((c) => (
            <a
              key={c.slug}
              href={certHref(c)}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-event="certificate_open"
              data-analytics-prop-slug={c.slug}
              data-analytics-prop-issuer={c.issuer}
              data-analytics-prop-target={c.externalUrl ? "external" : "pdf"}
              aria-label={`Zertifikat „${c.title}“ (${c.issuer}) öffnen`}
              style={{ boxShadow: "var(--notion-card-shadow)" }}
              className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-lg bg-white text-left transition-colors hover:bg-[rgba(55,53,47,0.02)]"
            >
              <CertificateCover cert={c} />
              <div className="flex flex-1 flex-col gap-[7px] p-[11px]">
                <div className="text-[15px] leading-[1.3] font-semibold">
                  {c.title}
                </div>
                <div className="text-[12px] text-notion-gray">
                  {c.date}
                  {c.detail ? ` · ${c.detail}` : ""}
                </div>
                <div className="mt-auto flex flex-wrap items-center gap-[6px] pt-0.5">
                  <AccentTag label={c.cat} />
                  {c.tags
                    .filter((t) => t !== c.cat)
                    .map((t) => (
                      <AccentTag key={t} label={t} />
                    ))}
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[12px] font-medium text-[var(--accent-text)]">
                  <span className="flex items-center gap-1.5">
                    <ExternalLink size={13} strokeWidth={2} />
                    {c.externalUrl ? `Auf ${c.issuer} ansehen` : "PDF ansehen"}
                  </span>
                  {c.verifyUrl && !c.externalUrl ? (
                    <span
                      role="link"
                      tabIndex={0}
                      aria-label={`Zertifikat auf ${c.issuer} verifizieren`}
                      data-analytics-event="certificate_verify_click"
                      data-analytics-prop-slug={c.slug}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(c.verifyUrl, "_blank", "noopener,noreferrer");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                          window.open(c.verifyUrl, "_blank", "noopener,noreferrer");
                        }
                      }}
                      className="relative z-[1] cursor-pointer hover:underline"
                    >
                      Verifizieren
                    </span>
                  ) : null}
                </div>
              </div>
            </a>
          ))}
        </GalleryGrid>
      )}
    </>
  );
}
