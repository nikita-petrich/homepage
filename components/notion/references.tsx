"use client";

import { useMemo, useState } from "react";
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
} from "lucide-react";

import { references, referenceSources, type Reference } from "@/lib/data";

import { DatabaseToolbar } from "./database-toolbar";
import { AccentTag } from "./blocks";

/* Permanent, shareable link to a single testimonial: /#referenz-<slug>. The
   slug never changes, so a link from the PDF CV stays valid forever. */
export const referenceHref = (r: Reference) => `/#referenz-${r.slug}`;

/* Two-letter monogram for the recommender avatar (e.g. "Suraj Kakar" → "SK"). */
function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/* LinkedIn brand glyph (lucide dropped its brand icons). */
function LinkedinGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 110-4.14 2.07 2.07 0 010 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

/* Outbound, verifiable-source tag. The LinkedIn tag points at the recommender's
   own profile when known, otherwise at Nikita's collected recommendations. */
function SourceTag({ label, href }: { label: string; href: string }) {
  const isLinkedin = label === "LinkedIn";
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`${label}-Profil öffnen`}
      className="inline-flex items-center gap-1 rounded-[4px] bg-[#f1f0ee] px-[7px] py-px text-[12px] font-medium text-[#4a473f] transition-colors hover:bg-[rgba(55,53,47,0.1)]"
    >
      {isLinkedin ? (
        <LinkedinGlyph className="h-[11px] w-[11px] text-[#0a66c2]" />
      ) : null}
      {label}
      <ExternalLink size={11} strokeWidth={2} className="opacity-70" />
    </a>
  );
}

/* LinkedIn tag → the recommender's profile if we have it, else Nikita's. */
function sourceHref(r: Reference, source: Reference["sources"][number]) {
  if (source === "LinkedIn" && r.linkedin) return r.linkedin;
  return referenceSources[source].href;
}

function ReferenceCard({ reference: r }: { reference: Reference }) {
  return (
    <article
      id={`referenz-${r.slug}`}
      className="np-ref-card scroll-mt-24 rounded-xl border border-[rgba(55,53,47,0.12)] bg-white p-5 sm:p-6"
      style={{ boxShadow: "var(--notion-card-shadow)" }}
    >
      <Quote
        size={22}
        strokeWidth={2}
        className="mb-2.5 text-[var(--accent-o)]"
        aria-hidden
      />

      <blockquote className="text-[15px] leading-[1.65] text-[#37352f]">
        {r.quote}
      </blockquote>

      <div className="mt-4 flex flex-col gap-3 border-t border-[rgba(55,53,47,0.09)] pt-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ece3d3] text-[13px] font-semibold text-[#6f5b3e]"
            aria-hidden
          >
            {initials(r.name)}
          </span>
          <div className="min-w-0">
            {r.linkedin ? (
              <a
                href={r.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label={`LinkedIn-Profil von ${r.name} öffnen`}
                className="group/name inline-flex items-center gap-1 text-[15px] font-semibold text-notion-text transition-colors hover:text-[#0a66c2]"
              >
                {r.name}
                <LinkedinGlyph className="h-[13px] w-[13px] text-[#0a66c2] opacity-0 transition-opacity group-hover/name:opacity-100" />
              </a>
            ) : (
              <div className="text-[15px] font-semibold text-notion-text">
                {r.name}
              </div>
            )}
            <div className="text-[13px] leading-[1.4] text-notion-gray">
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
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5">
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
            <SourceTag
              key={s}
              label={referenceSources[s].label}
              href={sourceHref(r, s)}
            />
          ))}
        </span>
      </div>
    </article>
  );
}

/* Referenzen — client testimonials shown after the projects gallery. Each card
   carries a permanent anchor (#referenz-<slug>) for deep links from the CV, and
   links back out to the source (LinkedIn / Malt) where it can be verified. */
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
        <div className="flex flex-col gap-4">
          {visible.map((r) => (
            <ReferenceCard key={r.slug} reference={r} />
          ))}
        </div>
      )}
    </>
  );
}
