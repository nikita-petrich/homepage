import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { findProject, projectSlugs, referencesForProject } from "@/lib/data";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/metadata";

import { StandaloneProjectDialog } from "./standalone";

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const project = findProject(locale, slug);
  if (!project) return {};
  // The "· Nikita Petrich" suffix comes from the root layout's title.template.
  return pageMetadata({
    locale,
    title: `${project.name} — ${project.subtitle}`,
    description: project.desc,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const project = findProject(locale, slug);
  if (!project) notFound();

  return (
    <StandaloneProjectDialog
      project={project}
      references={referencesForProject(locale, slug)}
    />
  );
}
