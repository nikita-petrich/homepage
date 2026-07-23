"use client";

import { useParams, useRouter } from "next/navigation";

import { projects } from "@/lib/data";
import { ProjectModal } from "@/components/notion/projects";

/* Intercepts /projekte/<slug> on client-side navigation (a card click on the
   home page) and renders the project as a modal overlaying the résumé, without
   leaving the page. Closing pops the history entry via router.back(), which
   also drives browser back/forward. A hard load or refresh bypasses this and
   hits the standalone page at app/projekte/[slug]/page.tsx instead. */
export default function InterceptedProjectDialog() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug) ?? null;

  return <ProjectModal project={project} onClose={() => router.back()} />;
}
