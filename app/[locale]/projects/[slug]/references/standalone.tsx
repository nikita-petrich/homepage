"use client";

import { useRouter } from "next/navigation";

import type { Project, Reference } from "@/lib/data";
import { ProjectReferencesModal } from "@/components/notion/references";
import { localePath } from "@/lib/i18n/config";
import { useLocale } from "@/lib/i18n/provider";

/* Hard load / refresh of /projects/<slug>/references: there is no history to
   go back to, so closing follows the URL hierarchy up to the project. */
export function StandaloneProjectReferencesDialog({
  project,
  references,
}: {
  project: Project;
  references: Reference[];
}) {
  const router = useRouter();
  const locale = useLocale();
  return (
    <ProjectReferencesModal
      project={project}
      references={references}
      onClose={() => router.push(localePath(locale, `/projects/${project.slug}`))}
    />
  );
}
