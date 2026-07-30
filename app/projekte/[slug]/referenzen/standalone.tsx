"use client";

import { useRouter } from "next/navigation";

import type { Project, Reference } from "@/lib/data";
import { ProjectReferencesModal } from "@/components/notion/references";

/* Hard load / refresh of /projekte/<slug>/referenzen: there is no history to
   go back to, so closing follows the URL hierarchy up to the case study. */
export function StandaloneProjectReferencesDialog({
  project,
  references,
}: {
  project: Project;
  references: Reference[];
}) {
  const router = useRouter();
  return (
    <ProjectReferencesModal
      project={project}
      references={references}
      onClose={() => router.push(`/projekte/${project.slug}`)}
    />
  );
}
