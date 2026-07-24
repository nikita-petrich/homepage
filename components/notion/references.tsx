"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  Calendar,
  CaseSensitive,
  ExternalLink,
  MessagesSquare,
  Quote,
  Tags,
  X,
} from "lucide-react";

import { references, referenceSources, type Reference } from "@/lib/data";

import { DatabaseToolbar } from "./database-toolbar";
import { AccentTag } from "./blocks";
import { bannerBg } from "./cover-banner";

/* Stable, shareable URL for a single testimonial. Mirrors the projects route,
   so a link (e.g. from the PDF CV) opens the full reference dialog. */
export const referenceHref = (r: Reference) => `/referenzen/${r.slug}`;

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
      rel="noreferrer"
      onClick={(e) => e.stopPropagation()}
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
        <span className="text-[10px] font-semibold tracking-[0.14em] text-[#9a8f7c] uppercase">
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
      href={`/referenzen/${r.slug}`}
      scroll={false}
      aria-label={`Referenz von ${r.name} öffnen`}
      style={{ boxShadow: "var(--notion-card-shadow)" }}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-lg bg-white text-left transition-colors hover:bg-[rgba(55,53,47,0.02)]"
    >
      <ReferenceCover reference={r} />
      <div className="flex flex-1 flex-col gap-[6px] p-[11px]">
        <div className="text-[15px] leading-[1.3] font-semibold">{r.name}</div>
        {r.company ? (
          <div className="flex items-center gap-1 text-[12px] font-medium text-[#6f5b3e]">
            <Building2 size={12} strokeWidth={2} className="shrink-0" />
            <span className="line-clamp-1">{r.company}</span>
          </div>
        ) : (
          <div className="line-clamp-1 text-[12px] text-notion-gray">{r.role}</div>
        )}
        <p className="line-clamp-3 text-[13px] leading-[1.5] text-notion-gray">
          {`„${r.quote}"`}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-[6px] pt-1">
          <AccentTag label={r.relation} />
          <span className="rounded-[4px] bg-[#f1f0ee] px-[7px] py-px text-[12px] font-medium text-[#4a473f]">
            {r.project}
          </span>
        </div>
        <div className="flex items-center gap-1.5 pt-0.5 text-[12px] font-medium text-[var(--accent-o)]">
          <ArrowUpRight size={13} strokeWidth={2} />
          Referenz ansehen
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
  reference: Reference | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!r) return;
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
  }, [r, onClose]);

  if (!r) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-[2px] sm:p-6"
      style={{ animation: "np-overlay-in 0.2s ease-out" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Referenz von ${r.name}`}
    >
      <div
        className="relative my-4 h-fit w-full max-w-[640px] overflow-hidden rounded-xl bg-white shadow-[rgba(15,15,15,0.2)_0px_16px_48px] sm:my-8"
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
            <div className="mt-1 text-[13px] leading-[1.45] text-[#4a473f]">
              {r.role}
              {r.company ? (
                <span className="inline-flex items-center gap-1">
                  {" · "}
                  <Building2 size={12} strokeWidth={2} className="inline shrink-0" />
                  {r.company}
                </span>
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
                href={`/projekte/${r.projectSlug}`}
                scroll={false}
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
      </div>
    </div>
  );
}

/* Referenzen — testimonials shown as a card gallery after the projects,
   mirroring their size and behaviour: a clamped preview per card, full text in
   the dialog. Each card has a permanent URL (/referenzen/<slug>). */
export function ReferenceGallery() {
  const [asc, setAsc] = useState(false); // false = newest first (default)
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = references.filter((r) =>
      !q
        ? true
        : (r.name + " " + r.role + " " + (r.company ?? "") + " " + r.project + " " + r.quote)
            .toLowerCase()
            .includes(q),
    );
    return [...list].sort((a, b) => {
      const cmp = a.sort.localeCompare(b.sort);
      return asc ? cmp : -cmp;
    });
  }, [query, asc]);

  return (
    <>
      <DatabaseToolbar
        viewLabel="Empfehlungen"
        viewIcon={<MessagesSquare size={15} strokeWidth={2} />}
        sortProp="Datum"
        sortPropIcon={<Calendar size={14} strokeWidth={1.9} />}
        sortDirLabel={asc ? "Älteste zuerst" : "Neueste zuerst"}
        onToggleSortDir={() => setAsc((v) => !v)}
        query={query}
        onQueryChange={setQuery}
        filterProps={[
          { label: "Name", icon: <CaseSensitive size={16} strokeWidth={1.9} /> },
          { label: "Firma", icon: <Building2 size={15} strokeWidth={1.9} /> },
          { label: "Projekt", icon: <Tags size={15} strokeWidth={1.9} /> },
          { label: "Datum", icon: <Calendar size={15} strokeWidth={1.9} /> },
        ]}
      />

      {visible.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[rgba(55,53,47,0.16)] px-4 py-10 text-center text-[14px] text-notion-gray">
          Keine Treffer.
        </div>
      ) : (
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]">
          {visible.map((r) => (
            <ReferenceCard key={r.slug} reference={r} />
          ))}
        </div>
      )}
    </>
  );
}
