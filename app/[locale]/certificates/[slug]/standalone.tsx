"use client";

import { useRouter } from "next/navigation";

import type { Certificate } from "@/lib/data";
import { CertificateModal } from "@/components/notion/certificates";
import { localePath } from "@/lib/i18n/config";
import { useLocale } from "@/lib/i18n/provider";

/* Hard load or refresh of /certificates/<slug>: closing returns to the
   certificates overview instead of the home page. */
export function StandaloneCertificateDialog({
  certificate,
}: {
  certificate: Certificate;
}) {
  const router = useRouter();
  const locale = useLocale();
  return (
    <CertificateModal
      certificate={certificate}
      onClose={() => router.push(localePath(locale, "/certificates"))}
    />
  );
}
