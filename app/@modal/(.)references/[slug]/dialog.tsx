"use client";

import { useRouter } from "next/navigation";

import type { Reference } from "@/lib/data";
import { ReferenceModal } from "@/components/notion/references";

export function InterceptedReferenceDialog({
  reference,
}: {
  reference: Reference;
}) {
  const router = useRouter();
  return <ReferenceModal reference={reference} onClose={() => router.back()} />;
}
