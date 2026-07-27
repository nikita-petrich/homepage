"use client";

import { Award, Calendar, ExternalLink, GraduationCap } from "lucide-react";

import { cn } from "@/lib/utils";
import { certificates, type Certificate } from "@/lib/data";
import { useSearchTracking } from "@/lib/analytics/use-search-tracking";

import { DatabaseToolbar } from "./database-toolbar";
import { AccentTag } from "./blocks";
import { bannerBg } from "./cover-banner";
import { EmptyState, GalleryGrid, useGallery } from "./gallery";

/* Permanent, shareable link for a certificate: the self-hosted PDF at
   /zertifikate/<slug>.pdf, or an official external URL when not yet hosted. */
export const certHref = (c: Certificate) =>
  c.externalUrl ?? `/zertifikate/${c.slug}.pdf`;

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
   new tab via its permanent URL (/zertifikate/<slug>.pdf); the slug never
   changes, so a shared link stays valid forever. */
const certificateSearchText = (c: Certificate) =>
  `${c.title} ${c.issuer} ${c.cat} ${c.tags.join(" ")}`;
const certificateSortKey = (c: Certificate) => c.sort;

export function CertificateGallery() {
  const { query, setQuery, sortDirLabel, toggleSort, visible } = useGallery(
    certificates,
    certificateSearchText,
    certificateSortKey,
  );

  useSearchTracking("certificates", query, visible.length);

  return (
    <>
      <DatabaseToolbar
        viewLabel="Nachweise"
        viewIcon={<GraduationCap size={15} strokeWidth={2} />}
        sortProp="Datum"
        sortPropIcon={<Calendar size={14} strokeWidth={1.9} />}
        sortDirLabel={sortDirLabel}
        onToggleSortDir={toggleSort}
        query={query}
        onQueryChange={setQuery}
      />

      {visible.length === 0 ? (
        <EmptyState />
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
                <div className="flex items-center gap-1.5 pt-1 text-[12px] font-medium text-[var(--accent-text)]">
                  <ExternalLink size={13} strokeWidth={2} />
                  {c.externalUrl ? `Auf ${c.issuer} ansehen` : "PDF ansehen"}
                </div>
              </div>
            </a>
          ))}
        </GalleryGrid>
      )}
    </>
  );
}
