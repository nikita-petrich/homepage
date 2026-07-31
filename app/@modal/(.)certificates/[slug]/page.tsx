import { notFound } from "next/navigation";

import { certificates } from "@/lib/data";

import { InterceptedCertificateDialog } from "./dialog";

export function generateStaticParams() {
  return certificates.map((c) => ({ slug: c.slug }));
}

/* Intercepts a card click on the home page or the certificates overview and
   shows the certificate as a modal; a hard load or refresh falls through to the
   standalone page. */
export default async function InterceptedCertificatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const certificate = certificates.find((c) => c.slug === slug);
  if (!certificate) notFound();

  return <InterceptedCertificateDialog certificate={certificate} />;
}
