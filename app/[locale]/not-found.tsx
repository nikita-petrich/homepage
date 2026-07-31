"use client";

import Link from "next/link";

import { NotionTopBar } from "@/components/notion/topbar";
import { localePath } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";

/* not-found.js takes no props (see the bundled reference
   node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/not-found.md),
   so the locale cannot come from the route params here. It comes from the
   context the locale layout provides instead — this page renders inside that
   layout, so /de/... 404s in German and /en/... in English. */
export default function NotFound() {
  const { locale, ui } = useI18n();

  return (
    <div className="min-h-screen bg-[var(--notion-bg)]">
      <NotionTopBar />
      <main className="mx-auto flex max-w-[720px] flex-col items-start gap-4 px-6 pt-20 pb-24 sm:px-8">
        <div className="text-[13px] font-semibold tracking-[0.06em] text-[var(--accent-text)] uppercase">
          {ui.notFound.label}
        </div>
        <h1 className="text-[1.75rem] leading-[1.25] font-semibold tracking-[-0.01em]">
          {ui.notFound.title}
        </h1>
        <p className="text-[15px] leading-[1.65] text-notion-gray">
          {ui.notFound.text}
        </p>
        <Link
          href={localePath(locale)}
          className="rounded-md bg-primary px-4 py-2 text-[14px] font-medium text-primary-foreground shadow-sm transition-colors hover:brightness-95"
        >
          {ui.topbar.home}
        </Link>
      </main>
    </div>
  );
}
