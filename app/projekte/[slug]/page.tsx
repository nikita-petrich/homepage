import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { projects } from "@/lib/data";

import { StandaloneProjectDialog } from "./standalone";

/* Pre-render one static page per project so every /projekte/<slug> is a real,
   crawlable URL. New projects are picked up automatically from lib/data.ts. */
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
  return {
    title: `${project.name} — ${project.subtitle} · Nikita Petrich`,
    description: project.desc,
  };
}

/* Standalone project page — served on a hard load / refresh / shared link,
   when the modal interception does not run. */
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
