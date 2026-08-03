"use client";

import { useRouter } from "next/navigation";

import type { Project, Reference } from "@/lib/data";
import { InterceptedModal } from "@/components/notion/modal-nav";
import { ProjectReferencesModal } from "@/components/notion/references";

export function InterceptedProjectReferencesDialog({
  project,
  references,
}: {
  project: Project;
  references: Reference[];
}) {
  const router = useRouter();
  return (
    <InterceptedModal>
      <ProjectReferencesModal
        project={project}
        references={references}
        onClose={() => router.back()}
      />
    </InterceptedModal>
  );
}
