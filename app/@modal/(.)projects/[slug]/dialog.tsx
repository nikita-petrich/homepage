"use client";

import { useRouter } from "next/navigation";

import type { Project } from "@/lib/data";
import { ProjectModal } from "@/components/notion/projects";

export function InterceptedProjectDialog({ project }: { project: Project }) {
  const router = useRouter();
  return <ProjectModal project={project} onClose={() => router.back()} />;
}
