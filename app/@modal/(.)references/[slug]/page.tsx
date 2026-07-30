import { notFound } from "next/navigation";

import { references } from "@/lib/data";

import { InterceptedReferenceDialog } from "./dialog";

export function generateStaticParams() {
  return references.map((r) => ({ slug: r.slug }));
}

/* Intercepts a card click on the home page and shows the reference as a
   modal; a hard load or refresh falls through to the standalone page. */
export default async function InterceptedReferencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const reference = references.find((r) => r.slug === slug);
  if (!reference) notFound();

  return <InterceptedReferenceDialog reference={reference} />;
}
