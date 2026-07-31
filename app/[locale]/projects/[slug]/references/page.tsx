import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  findProject,
  projectSlugsWithReferences,
  referencesForProject,
} from "@/lib/data";
import { isLocale } from "@/lib/i18n/config";
import { format } from "@/lib/i18n/text";
import { getUi } from "@/lib/i18n/ui";
import { pageMetadata } from "@/lib/metadata";

import { StandaloneProjectReferencesDialog } from "./standalone";

/* Only projects that actually have a reference get a prerendered route; every
   other slug 404s via notFound() below. */
export function generateStaticParams() {
  return projectSlugsWithReferences.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const project = findProject(locale, slug);
  const projectRefs = referencesForProject(locale, slug);
  if (!project || projectRefs.length === 0) return {};

  const ui = getUi(locale);
  const count =
    projectRefs.length === 1
      ? ui.references.countOne
      : format(ui.references.countMany, { count: projectRefs.length });

  // The "· Nikita Petrich" suffix comes from the root layout's title.template.
  return pageMetadata({
    locale,
    title: format(ui.references.projectMetaTitle, { project: project.name }),
    description: format(ui.references.projectMetaDescription, {
      count,
      project: project.name,
      subtitle: project.subtitle,
      names: projectRefs.map((r) => r.name).join(", "),
    }),
    path: `/projects/${project.slug}/references`,
  });
}

export default async function ProjectReferencesPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const project = findProject(locale, slug);
  const projectRefs = referencesForProject(locale, slug);
  if (!project || projectRefs.length === 0) notFound();

  return (
    <StandaloneProjectReferencesDialog
      project={project}
      references={projectRefs}
    />
  );
}
