import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { findReference, referenceSlugs } from "@/lib/data";
import { isLocale } from "@/lib/i18n/config";
import { format } from "@/lib/i18n/text";
import { getUi } from "@/lib/i18n/ui";
import { pageMetadata } from "@/lib/metadata";

import { StandaloneReferenceDialog } from "./standalone";

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

export default async function ReferencePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const reference = findReference(locale, slug);
  if (!reference) notFound();

  return <StandaloneReferenceDialog reference={reference} />;
}
