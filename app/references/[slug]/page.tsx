import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { references } from "@/lib/data";
import { pageMetadata } from "@/lib/metadata";

import { StandaloneReferenceDialog } from "./standalone";

export function generateStaticParams() {
  return references.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const reference = references.find((r) => r.slug === slug);
  if (!reference) return {};
  // The "· Nikita Petrich" suffix comes from the root layout's title.template.
  return pageMetadata({
    title: `Referenz von ${reference.name}`,
    description: `${reference.name} (${reference.role}) über die Zusammenarbeit mit Nikita Petrich.`,
    path: `/references/${reference.slug}`,
  });
}

export default async function ReferencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const reference = references.find((r) => r.slug === slug);
  if (!reference) notFound();

  return <StandaloneReferenceDialog reference={reference} />;
}
