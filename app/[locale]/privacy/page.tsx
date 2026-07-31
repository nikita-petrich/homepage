import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalPage, TranslationNote } from "@/components/notion/legal";
import { isLocale, localePath } from "@/lib/i18n/config";
import { getUi } from "@/lib/i18n/ui";
import { pageMetadata } from "@/lib/metadata";

import { PrivacyDe } from "./de";
import { PrivacyEn } from "./en";

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
    title: ui.legal.privacyTitle,
    description: ui.legal.privacyDescription,
    path: "/privacy",
  });
}

/* NOTE: The "Hosting" section names the hosting provider and its DPA — keep it
   in step with the actual deployment. */
export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const ui = getUi(locale);

  return (
    <LegalPage title={ui.legal.privacyTitle}>
      {/* The German version is the binding one; the English page says so. */}
      {locale === "en" ? (
        <>
          <TranslationNote
            note={ui.legal.translationNote}
            linkLabel={ui.legal.translationLink}
            href={localePath("de", "/privacy")}
          />
          <PrivacyEn />
        </>
      ) : (
        <PrivacyDe />
      )}
    </LegalPage>
  );
}
