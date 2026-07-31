import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { projects } from "@/lib/data";
import { pageMetadata } from "@/lib/metadata";

import { StandaloneProjectDialog } from "./standalone";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  // The "· Nikita Petrich" suffix comes from the root layout's title.template.
  return pageMetadata({
    title: `${project.name} — ${project.subtitle}`,
    description: project.desc,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return <StandaloneProjectDialog project={project} />;
}
