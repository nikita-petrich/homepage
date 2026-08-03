"use client";

import { useRouter } from "next/navigation";

import type { Reference } from "@/lib/data";
import { InterceptedModal } from "@/components/notion/modal-nav";
import { ReferenceModal } from "@/components/notion/references";

export function InterceptedReferenceDialog({
  reference,
}: {
  reference: Reference;
}) {
  const router = useRouter();
  return (
    <InterceptedModal>
      <ReferenceModal reference={reference} onClose={() => router.back()} />
    </InterceptedModal>
  );
}
