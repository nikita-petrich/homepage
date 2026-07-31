import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  projects,
  projectsWithReferences,
  referencesForProject,
} from "@/lib/data";
import { pageMetadata } from "@/lib/metadata";

import { StandaloneProjectReferencesDialog } from "./standalone";

/* Only projects that actually have a reference get a prerendered route; every
   other slug 404s via notFound() below. */
export function generateStaticParams() {
  return projectsWithReferences.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  const projectRefs = referencesForProject(slug);
  if (!project || projectRefs.length === 0) return {};
  // The "· Nikita Petrich" suffix comes from the root layout's title.template.
  return pageMetadata({
    title: `Referenzen — ${project.name}`,
    description: `${projectRefs.length === 1 ? "Referenz" : `Alle ${projectRefs.length} Referenzen`} zum Projekt ${project.name} (${project.subtitle}): ${projectRefs
      .map((r) => r.name)
      .join(", ")}.`,
    path: `/projects/${project.slug}/references`,
  });
}

export default async function ProjectReferencesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  const projectRefs = referencesForProject(slug);
  if (!project || projectRefs.length === 0) notFound();

  return (
    <StandaloneProjectReferencesDialog
      project={project}
      references={projectRefs}
    />
  );
}
