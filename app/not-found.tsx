import Link from "next/link";
import type { Metadata } from "next";

import { NotionTopBar } from "@/components/notion/topbar";

export const metadata: Metadata = {
  title: "Seite nicht gefunden",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <NotionTopBar />
      <main className="mx-auto flex max-w-[720px] flex-col items-start gap-4 px-6 pt-20 pb-24 sm:px-8">
        <div className="text-[13px] font-semibold tracking-[0.06em] text-[var(--accent-o)] uppercase">
          Fehler 404
        </div>
        <h1 className="text-[1.75rem] leading-[1.25] font-semibold tracking-[-0.01em]">
          Diese Seite gibt es nicht (mehr).
        </h1>
        <p className="text-[15px] leading-[1.65] text-notion-gray">
          Die aufgerufene Adresse existiert nicht oder wurde entfernt.
        </p>
        <Link
          href="/"
          className="rounded-md bg-[var(--accent-o)] px-4 py-2 text-[14px] font-medium text-white shadow-sm transition-colors hover:brightness-95"
        >
          Zur Startseite
        </Link>
      </main>
    </div>
  );
}
