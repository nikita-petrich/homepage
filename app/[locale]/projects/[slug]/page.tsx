import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DetailPage } from "@/components/notion/detail-page";
import { ProjectDetail } from "@/components/notion/projects";
import { findProject, projectSlugs, referencesForProject } from "@/lib/data";
import { isLocale, localePath } from "@/lib/i18n/config";
import { getUi } from "@/lib/i18n/ui";
import { pageMetadata } from "@/lib/metadata";

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

/* Opened directly (shared link, refresh, crawler) the project is a page of its
   own, server-rendered — responsibilities, results and stack included. Clicking
   a card inside the site still opens the dialog, via the intercepting route in
   app/[locale]/@modal. */
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
    <DetailPage
      backHref={localePath(locale)}
      backLabel={getUi(locale).topbar.home}
    >
      <ProjectDetail
        project={project}
        references={referencesForProject(locale, slug)}
        heading="h1"
      />
    </DetailPage>
  );
}
