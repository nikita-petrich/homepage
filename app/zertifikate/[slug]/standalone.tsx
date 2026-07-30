"use client";

import { useRouter } from "next/navigation";

import type { Certificate } from "@/lib/data";
import { CertificateModal } from "@/components/notion/certificates";

/* Hard load or refresh of /zertifikate/<slug>: closing returns to the
   certificates overview instead of the home page. */
export function StandaloneCertificateDialog({
  certificate,
}: {
  certificate: Certificate;
}) {
  const router = useRouter();
  return (
    <CertificateModal
      certificate={certificate}
      onClose={() => router.push("/zertifikate")}
    />
  );
}
