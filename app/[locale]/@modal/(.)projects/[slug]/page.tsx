import { notFound } from "next/navigation";

import { findProject, projectSlugs, referencesForProject } from "@/lib/data";
import { isLocale } from "@/lib/i18n/config";

import { InterceptedProjectDialog } from "./dialog";

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

/* Intercepts a card click on the home page and shows the project as a modal;
   a hard load or refresh falls through to the standalone page instead. */
export default async function InterceptedProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const project = findProject(locale, slug);
  if (!project) notFound();

  return (
    <InterceptedProjectDialog
      project={project}
      references={referencesForProject(locale, slug)}
    />
  );
}
