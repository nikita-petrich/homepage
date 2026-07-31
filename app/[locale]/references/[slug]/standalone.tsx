"use client";

import { useRouter } from "next/navigation";

import type { Reference } from "@/lib/data";
import { ReferenceModal } from "@/components/notion/references";
import { localePath } from "@/lib/i18n/config";
import { useLocale } from "@/lib/i18n/provider";

export function StandaloneReferenceDialog({ reference }: { reference: Reference }) {
  const router = useRouter();
  const locale = useLocale();
  return (
    <ReferenceModal
      reference={reference}
      onClose={() => router.push(localePath(locale))}
    />
  );
}
