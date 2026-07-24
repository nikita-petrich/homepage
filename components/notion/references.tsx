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

/* Outbound, verifiable-source tag (LinkedIn / Malt). */
function SourceTag({ source }: { source: Reference["sources"][number] }) {
  const s = referenceSources[source];
  return (
    <a
      href={s.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Referenz auf ${s.label} ansehen`}
      className="inline-flex items-center gap-1 rounded-[4px] bg-[#f1f0ee] px-[7px] py-px text-[12px] font-medium text-[#4a473f] transition-colors hover:bg-[rgba(55,53,47,0.1)]"
    >
      {s.label}
      <ExternalLink size={11} strokeWidth={2} className="opacity-70" />
    </a>
  );
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
            <div className="text-[15px] font-semibold text-notion-text">
              {r.name}
            </div>
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
            <SourceTag key={s} source={s} />
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
