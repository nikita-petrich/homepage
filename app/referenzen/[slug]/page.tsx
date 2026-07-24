import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { references } from "@/lib/data";

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
  return {
    title: `Referenz von ${reference.name} · Nikita Petrich`,
    description: `${reference.name} (${reference.role}) über die Zusammenarbeit mit Nikita Petrich.`,
  };
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
