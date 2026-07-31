import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { certificateSlugs, findCertificate } from "@/lib/data";
import { isLocale } from "@/lib/i18n/config";
import { format } from "@/lib/i18n/text";
import { getUi } from "@/lib/i18n/ui";
import { pageMetadata } from "@/lib/metadata";

import { StandaloneCertificateDialog } from "./standalone";

export function generateStaticParams() {
  return certificateSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const certificate = findCertificate(locale, slug);
  if (!certificate) return {};

  const ui = getUi(locale);
  // The "· Nikita Petrich" suffix comes from the root layout's title.template.
  return pageMetadata({
    locale,
    title: format(ui.certificates.metaTitle, { title: certificate.title }),
    description: certificate.summary,
    path: `/certificates/${certificate.slug}`,
  });
}

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const certificate = findCertificate(locale, slug);
  if (!certificate) notFound();

  return <StandaloneCertificateDialog certificate={certificate} />;
}
