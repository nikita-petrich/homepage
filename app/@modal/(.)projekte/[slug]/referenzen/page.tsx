import { notFound } from "next/navigation";

import {
  projects,
  projectsWithReferences,
  referencesForProject,
} from "@/lib/data";

import { InterceptedProjectReferencesDialog } from "./dialog";

export function generateStaticParams() {
  return projectsWithReferences.map((p) => ({ slug: p.slug }));
}

/* Intercepts the "Alle N ansehen" link in the project dialog and shows the
   listing as a modal; a hard load or refresh falls through to the standalone
   page. */
export default async function InterceptedProjectReferencesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  const projectRefs = referencesForProject(slug);
  if (!project || projectRefs.length === 0) notFound();

  return (
    <InterceptedProjectReferencesDialog
      project={project}
      references={projectRefs}
    />
  );
}
