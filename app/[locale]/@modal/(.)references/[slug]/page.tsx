import { notFound } from "next/navigation";

import { findReference, referenceSlugs } from "@/lib/data";
import { isLocale } from "@/lib/i18n/config";

import { InterceptedReferenceDialog } from "./dialog";

export function generateStaticParams() {
  return referenceSlugs.map((slug) => ({ slug }));
}

/* Intercepts a testimonial card click and shows it as a modal; a hard load or
   refresh falls through to the standalone page instead. */
export default async function InterceptedReferencePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const reference = findReference(locale, slug);
  if (!reference) notFound();

  return <InterceptedReferenceDialog reference={reference} />;
}
