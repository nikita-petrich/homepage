"use client";

import { useRouter } from "next/navigation";

import type { Certificate } from "@/lib/data";
import { CertificateModal } from "@/components/notion/certificates";
import { InterceptedModal } from "@/components/notion/modal-nav";

export function InterceptedCertificateDialog({
  certificate,
}: {
  certificate: Certificate;
}) {
  const router = useRouter();
  return (
    <InterceptedModal>
      <CertificateModal certificate={certificate} onClose={() => router.back()} />
    </InterceptedModal>
  );
}
