"use client";

import { useParams, useRouter } from "next/navigation";

import { references } from "@/lib/data";
import { ReferenceModal } from "@/components/notion/references";

/* Intercepts a reference card click on the home page and shows the testimonial
   as a modal; a hard load or refresh falls through to the standalone page. */
export default function InterceptedReferenceDialog() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const reference = references.find((r) => r.slug === slug) ?? null;

  return <ReferenceModal reference={reference} onClose={() => router.back()} />;
}
