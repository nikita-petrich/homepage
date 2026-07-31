"use client";

import { useRouter } from "next/navigation";

import type { Project, Reference } from "@/lib/data";
import { ProjectModal } from "@/components/notion/projects";

export function InterceptedProjectDialog({
  project,
  references,
}: {
  project: Project;
  references: Reference[];
}) {
  const router = useRouter();
  return (
    <ProjectModal
      project={project}
      references={references}
      onClose={() => router.back()}
    />
  );
}
