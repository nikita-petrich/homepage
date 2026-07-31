import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalPage, TranslationNote } from "@/components/notion/legal";
import { isLocale, localePath } from "@/lib/i18n/config";
import { getUi } from "@/lib/i18n/ui";
import { pageMetadata } from "@/lib/metadata";

import { ImprintDe } from "./de";
import { ImprintEn } from "./en";

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
    title: ui.legal.imprintTitle,
    description: ui.legal.imprintDescription,
    path: "/imprint",
  });
}

export default async function ImprintPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const ui = getUi(locale);

  return (
    <LegalPage title={ui.legal.imprintTitle}>
      {/* German law governs this notice, so the German wording is the binding
          one and the English page says so. */}
      {locale === "en" ? (
        <>
          <TranslationNote
            note={ui.legal.translationNote}
            linkLabel={ui.legal.translationLink}
            href={localePath("de", "/imprint")}
          />
          <ImprintEn />
        </>
      ) : (
        <ImprintDe />
      )}
    </LegalPage>
  );
}
