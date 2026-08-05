import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CertificateDetail } from "@/components/notion/certificates";
import { DetailPage } from "@/components/notion/detail-page";
import { certificateSlugs, findCertificate } from "@/lib/data";
import { isLocale, localePath } from "@/lib/i18n/config";
import { format } from "@/lib/i18n/text";
import { getUi } from "@/lib/i18n/ui";
import { pageMetadata } from "@/lib/metadata";

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

/* Opened directly (shared link, refresh, crawler) the certificate is a page of
   its own, server-rendered; the back link follows the URL hierarchy up to the
   overview. Clicking a card inside the site still opens the dialog, via the
   intercepting route in app/[locale]/@modal. */
export default async function CertificatePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const certificate = findCertificate(locale, slug);
  if (!certificate) notFound();

  return (
    <DetailPage
      backHref={localePath(locale, "/certificates")}
      backLabel={getUi(locale).certificates.backToOverview}
    >
      <CertificateDetail certificate={certificate} heading="h1" />
    </DetailPage>
  );
}
