"use client";

import { useRouter } from "next/navigation";

import type { Project } from "@/lib/data";
import { ProjectModal } from "@/components/notion/projects";

/* Client wrapper for the standalone project page. There is no modal history
   entry to pop here (the page was loaded directly), so closing navigates to
   the home page rather than calling router.back(). */
export function StandaloneProjectDialog({ project }: { project: Project }) {
  const router = useRouter();
  return <ProjectModal project={project} onClose={() => router.push("/")} />;
}
