"use client";

import { useRouter } from "next/navigation";

import type { Project, Reference } from "@/lib/data";
import { ProjectModal } from "@/components/notion/projects";
import { localePath } from "@/lib/i18n/config";
import { useLocale } from "@/lib/i18n/provider";

export function StandaloneProjectDialog({
  project,
  references,
}: {
  project: Project;
  references: Reference[];
}) {
  const router = useRouter();
  const locale = useLocale();
  return (
    <ProjectModal
      project={project}
      references={references}
      onClose={() => router.push(localePath(locale))}
    />
  );
}
