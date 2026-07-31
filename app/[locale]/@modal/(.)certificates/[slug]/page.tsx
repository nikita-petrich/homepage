import { notFound } from "next/navigation";

import { certificateSlugs, findCertificate } from "@/lib/data";
import { isLocale } from "@/lib/i18n/config";

import { InterceptedCertificateDialog } from "./dialog";

export function generateStaticParams() {
  return certificateSlugs.map((slug) => ({ slug }));
}

/* Intercepts a card click on the home page or the certificates overview and
   shows the certificate as a modal; a hard load or refresh falls through to the
   standalone page. */
export default async function InterceptedCertificatePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const certificate = findCertificate(locale, slug);
  if (!certificate) notFound();

  return <InterceptedCertificateDialog certificate={certificate} />;
}
