"use client";

import { useRouter } from "next/navigation";

import type { Project, Reference } from "@/lib/data";
import { InterceptedModal } from "@/components/notion/modal-nav";
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
    <InterceptedModal>
      <ProjectModal
        project={project}
        references={references}
        onClose={() => router.back()}
      />
    </InterceptedModal>
  );
}
