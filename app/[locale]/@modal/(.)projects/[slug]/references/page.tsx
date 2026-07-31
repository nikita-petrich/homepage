import { notFound } from "next/navigation";

import {
  findProject,
  projectSlugsWithReferences,
  referencesForProject,
} from "@/lib/data";
import { isLocale } from "@/lib/i18n/config";

import { InterceptedProjectReferencesDialog } from "./dialog";

export function generateStaticParams() {
  return projectSlugsWithReferences.map((slug) => ({ slug }));
}

/* Intercepts the "view all N" link in the project dialog and shows the listing
   as a modal; a hard load or refresh falls through to the standalone page. */
export default async function InterceptedProjectReferencesPage({
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
    <InterceptedProjectReferencesDialog
      project={project}
      references={projectRefs}
    />
  );
}
