import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DetailPage } from "@/components/notion/detail-page";
import { ReferenceDetail } from "@/components/notion/references";
import { findReference, referenceSlugs } from "@/lib/data";
import { isLocale, localePath } from "@/lib/i18n/config";
import { format } from "@/lib/i18n/text";
import { getUi } from "@/lib/i18n/ui";
import { pageMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return referenceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const reference = findReference(locale, slug);
  if (!reference) return {};

  const ui = getUi(locale);
  // The "· Nikita Petrich" suffix comes from the root layout's title.template.
  return pageMetadata({
    locale,
    title: format(ui.references.dialogLabel, { name: reference.name }),
    description: format(ui.references.metaDescription, {
      name: reference.name,
      role: reference.role,
    }),
    path: `/references/${reference.slug}`,
  });
}

/* Opened directly (shared link, refresh, crawler) the testimonial is a page of
   its own, server-rendered. Clicking a card inside the site still opens the
   dialog — that is the intercepting route in app/[locale]/@modal. */
export default async function ReferencePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const reference = findReference(locale, slug);
  if (!reference) notFound();

  return (
    <DetailPage
      backHref={localePath(locale)}
      backLabel={getUi(locale).topbar.home}
      width="narrow"
    >
      <ReferenceDetail reference={reference} heading="h1" />
    </DetailPage>
  );
}
