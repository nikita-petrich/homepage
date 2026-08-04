import type { Locale } from "./i18n/config";
import { localizedMemo, type Localized } from "./i18n/text";

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
  projects,
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
