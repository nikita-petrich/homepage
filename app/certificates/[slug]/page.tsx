import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { certificates } from "@/lib/data";

import { StandaloneCertificateDialog } from "./standalone";

export function generateStaticParams() {
  return certificates.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const certificate = certificates.find((c) => c.slug === slug);
  if (!certificate) return {};
  // The "· Nikita Petrich" suffix comes from the root layout's title.template.
  return {
    title: `${certificate.title} — Zertifikat`,
    description: certificate.summary,
    alternates: { canonical: `/certificates/${certificate.slug}` },
  };
}

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const certificate = certificates.find((c) => c.slug === slug);
  if (!certificate) notFound();

  return <StandaloneCertificateDialog certificate={certificate} />;
}
