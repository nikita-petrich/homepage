import type { Locale } from "./i18n/config";
import { localizedMemo, type I18nText, type Localized } from "./i18n/text";

import { certificates } from "./content/certificates";
import {
  approach,
  contact,
  cvFiles,
  facts,
  focus,
  intro,
  languages,
  methods,
  profile,
  profileLinks,
  sections,
  siteDescription,
} from "./content/profile";
import { projects } from "./content/projects";
import { references, referenceSources } from "./content/references";
import { skills } from "./content/skills";

import type { CertificateSectionSource, CertificateSource } from "./content/certificates";
import type { ProjectSource } from "./content/projects";
import type { ReferenceSourceEntry } from "./content/references";
import type { SkillCategorySource } from "./content/skills";
import type {
  IntroLine as IntroLineSource,
  RichLine as RichLineSource,
  Span as SpanSource,
} from "./content/profile";

/* The page content, assembled from lib/content/* and resolved for one locale.
 *
 * Every string in lib/content/* is authored in German and English side by side
 * (see lib/i18n/text.ts). `getContent(locale)` walks that tree once per locale
 * and hands components plain objects with plain strings, so nothing below this
 * file has to know that two languages exist. */

export type { ReferenceSource } from "./content/references";

export type Span = Localized<SpanSource>;
export type RichLine = Localized<RichLineSource>;
export type IntroLine = Localized<IntroLineSource>;
export type Project = Localized<ProjectSource>;
export type ProjectMeta = Project["meta"][number];
export type Certificate = Localized<CertificateSource>;
export type CertificateSection = Localized<CertificateSectionSource>;
export type SkillCategory = Localized<SkillCategorySource>;
export type Reference = Localized<ReferenceSourceEntry>;
export type InfoItem = Content["contact"][number];
export type FactItem = Content["facts"][number];
export type Language = Content["languages"][number];
export type ProfileLink = Content["profileLinks"][number];
export type CvFile = Content["cvFiles"][number];
export type TocItem = Content["sections"][number];

/* Locale-independent: names, URLs. */
export { referenceSources };
export { bookingUrl, bookingUrlFor, profileName, profileRole } from "./profile";

/* ---- derived project skills ---------------------------------------------
   What a project was about (LegalTech, IoT) and how it was run (Scrum) is
   authored in `cat`, `cardTags` and the meta grid — not in its `tech` list.
   Read literally, that left "LegalTech" belonging to no project at all, even
   though four of them are, and made a search for "Scrum" find no project that
   ran it. Those fields are folded into the tech list below so a project states
   its own domain and method, instead of the reader having to combine three
   parts of the page.

   Deliberately not derived from: `role`. Roles, languages and location are the
   one category the skills taxonomy marks `subjectMatter: false`, and they are
   not something a project demonstrates — "Remote" or "München" as a technology
   tag would be nonsense. Excluding the category (rather than naming the meta
   cells to skip) also keeps a later meta cell from quietly leaking one in. */

type Term = I18nText | string;

const germanTerm = (value: Term): string =>
  typeof value === "string" ? value : value.de;

const skillByTerm = new Map<string, Term>(
  skills
    .filter((c) => c.subjectMatter !== false)
    .flatMap((c) =>
      c.items.map((item) => [germanTerm(item).toLowerCase(), item] as const),
    ),
);

/* Display copy is not a skill list: "KI · RAG", "Handel & Kfz-Gewerbe" and
   "3 Personen · Frontend, Embedded/Hardware" each read as several fragments,
   only some of which name a skill. A value is therefore matched whole first —
   "shadcn/ui" must not be split into two halves — and only otherwise by its
   parts; a fragment the taxonomy does not know is dropped rather than becoming
   a tag no skill category accounts for.

   Matching runs on the German side and returns the taxonomy's own entry, so
   the English wording is the one skills.ts defines rather than the display
   label's ("LegalTech / notary services" → the entry that renders as
   "Notary services"). */
const TERM_SEPARATORS = /[/·&]/;

function skillsIn(value: Term): Term[] {
  const text = germanTerm(value).trim();
  const whole = skillByTerm.get(text.toLowerCase());
  if (whole) return [whole];
  return text
    .split(TERM_SEPARATORS)
    .map((part) => skillByTerm.get(part.trim().toLowerCase()))
    .filter((skill): skill is Term => skill !== undefined);
}

const metaTerms = (m: ProjectSource["meta"][number]): Term[] =>
  Array.isArray(m.value) ? m.value : [m.value];

/* The curated list keeps its order and leads; derived terms follow, each one
   listed once. */
function withDerivedSkills(project: ProjectSource): ProjectSource {
  const seen = new Set(project.tech.map(germanTerm));
  const derived = [
    project.cat,
    ...project.cardTags,
    ...project.meta.flatMap(metaTerms),
  ]
    .flatMap(skillsIn)
    .filter((term) => {
      const key = germanTerm(term);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  return derived.length
    ? { ...project, tech: [...project.tech, ...derived] }
    : project;
}

const projectsWithSkills = projects.map(withDerivedSkills);

const content = {
  profile,
  siteDescription,
  cvFiles,
  contact,
  facts,
  languages,
  approach,
  methods,
  profileLinks,
  intro,
  focus,
  sections,
  projects: projectsWithSkills,
  skills,
  certificates,
  references,
};

export type Content = Localized<typeof content>;

export const getContent = localizedMemo(content);

/* ---- slug helpers -------------------------------------------------------
   Route generation (generateStaticParams, sitemap) only needs slugs, which are
   the same in every language. */

export const projectSlugs = projects.map((p) => p.slug);
export const referenceSlugs = references.map((r) => r.slug);
export const certificateSlugs = certificates.map((c) => c.slug);

/* All published references for one project, in the order of references.json
   (newest first). One source for the project dialog, the per-project
   listing route (/projects/<slug>/references) and the sitemap. */
export function referencesForProject(
  locale: Locale,
  projectSlug: string,
): Reference[] {
  return getContent(locale).references.filter(
    (r) => r.projectSlug === projectSlug,
  );
}

/* Projects with at least one reference — exactly the projects for which
   /projects/<slug>/references exists. Projects without one have no route:
   an empty listing would be a thin page with nothing to show. */
export const projectSlugsWithReferences = projects
  .filter((p) => references.some((r) => r.projectSlug === p.slug))
  .map((p) => p.slug);

export function findProject(locale: Locale, slug: string): Project | undefined {
  return getContent(locale).projects.find((p) => p.slug === slug);
}

export function findReference(
  locale: Locale,
  slug: string,
): Reference | undefined {
  return getContent(locale).references.find((r) => r.slug === slug);
}

export function findCertificate(
  locale: Locale,
  slug: string,
): Certificate | undefined {
  return getContent(locale).certificates.find((c) => c.slug === slug);
}

export const certificateCount = certificates.length;
