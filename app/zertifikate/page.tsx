import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { certificates } from "@/lib/data";
import { CertificateGallery } from "@/components/notion/certificates";
import { NotionTopBar } from "@/components/notion/topbar";

/* Permanent, shareable overview of every certificate — the URL to hand out in
   applications and profiles. The home page links here from its "Zertifikate"
   section; each card opens the certificate's detail dialog. */
const description = `Alle ${certificates.length} Weiterbildungs-Zertifikate von Nikita Petrich mit Umfang, Kursaufbau und dem Zertifikat als PDF — von Scrimba, Code with Mosh und Udemy.`;

export const metadata: Metadata = {
  // The "· Nikita Petrich" suffix comes from the root layout's title.template.
  title: "Zertifikate",
  description,
  alternates: { canonical: "/zertifikate" },
  openGraph: {
    url: "/zertifikate",
    title: "Zertifikate · Nikita Petrich",
    description,
  },
};

export default function CertificatesPage() {
  return (
    <div className="min-h-screen bg-white">
      <NotionTopBar />
      <main className="mx-auto max-w-[980px] px-6 pt-10 pb-24 sm:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-notion-gray transition-colors hover:text-notion-text"
        >
          <ArrowLeft size={14} strokeWidth={2} />
          Zur Startseite
        </Link>

        <h1 className="mt-4 text-[1.75rem] leading-[1.25] font-semibold tracking-[-0.01em]">
          Zertifikate
        </h1>
        <p className="mt-3 max-w-[680px] text-[15px] leading-[1.65] text-notion-gray">
          Abgeschlossene Weiterbildungen mit dem jeweiligen Zertifikat als PDF.
          Ein Klick auf eine Karte zeigt den vollständigen Umfang — Eckdaten,
          Inhalte und den Kursaufbau bis zur einzelnen Lektion; das Zertifikat
          selbst öffnet sich in einem neuen Tab.
        </p>

        <div className="mt-7">
          <CertificateGallery />
        </div>
      </main>
    </div>
  );
}
