import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { certificateCount, getContent } from "@/lib/data";
import { isLocale, localePath } from "@/lib/i18n/config";
import { format } from "@/lib/i18n/text";
import { getUi } from "@/lib/i18n/ui";
import { pageMetadata } from "@/lib/metadata";
import { CertificateGallery } from "@/components/notion/certificates";
import { NotionTopBar } from "@/components/notion/topbar";

/* Permanent, shareable overview of every certificate — the URL to hand out in
   applications and profiles. The home page links here from its certificates
   section; each card opens the certificate's detail dialog. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const ui = getUi(locale);
  return pageMetadata({
    locale,
    // The "· Nikita Petrich" suffix comes from the root layout's title.template.
    title: ui.certificates.pageTitle,
    description: format(ui.certificates.pageDescription, {
      count: certificateCount,
    }),
    path: "/certificates",
  });
}

export default async function CertificatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const ui = getUi(locale);
  const { certificates } = getContent(locale);

  return (
    <div className="min-h-screen bg-[var(--notion-bg)]">
      <NotionTopBar />
      <main className="mx-auto max-w-[980px] px-6 pt-10 pb-24 sm:px-8">
        <Link
          href={localePath(locale)}
          className="inline-flex items-center gap-1.5 py-[3px] text-[13px] font-medium text-notion-gray transition-colors hover:text-notion-text"
        >
          <ArrowLeft size={14} strokeWidth={2} />
          {ui.topbar.home}
        </Link>

        <h1 className="mt-4 text-[1.75rem] leading-[1.25] font-semibold tracking-[-0.01em]">
          {ui.certificates.pageTitle}
        </h1>
        <p className="mt-3 max-w-[680px] text-[15px] leading-[1.65] text-notion-gray">
          {ui.certificates.pageIntro}
        </p>

        <div className="mt-7">
          <CertificateGallery certificates={certificates} />
        </div>
      </main>
    </div>
  );
}
