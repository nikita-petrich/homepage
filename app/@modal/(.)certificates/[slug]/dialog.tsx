"use client";

import { useRouter } from "next/navigation";

import type { Certificate } from "@/lib/data";
import { CertificateModal } from "@/components/notion/certificates";

export function InterceptedCertificateDialog({
  certificate,
}: {
  certificate: Certificate;
}) {
  const router = useRouter();
  return (
    <CertificateModal certificate={certificate} onClose={() => router.back()} />
  );
}
