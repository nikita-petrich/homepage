import { notFound } from "next/navigation";

import { projects } from "@/lib/data";

import { InterceptedProjectDialog } from "./dialog";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

/* Intercepts a card click on the home page and shows the project as a modal;
   a hard load or refresh falls through to the standalone page instead. */
export default async function InterceptedProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return <InterceptedProjectDialog project={project} />;
}
