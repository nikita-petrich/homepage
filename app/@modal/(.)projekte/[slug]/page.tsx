"use client";

import { useParams, useRouter } from "next/navigation";

import { projects } from "@/lib/data";
import { ProjectModal } from "@/components/notion/projects";

/* Intercepts a card click on the home page and shows the project as a modal;
   a hard load or refresh falls through to the standalone page instead. */
export default function InterceptedProjectDialog() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug) ?? null;

  return <ProjectModal project={project} onClose={() => router.back()} />;
}
