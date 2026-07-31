import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { defaultLocale, localeMeta, localePath } from "@/lib/i18n/config";
import { getUi } from "@/lib/i18n/ui";
import { themeInitScript } from "@/lib/theme";

import "./globals.css";

/* 404 for URLs that match no route at all. The root layout of this app lives
   under a dynamic segment (app/[locale]/layout.tsx), so there is no layout to
   compose a global 404 from — which is exactly the case this file convention
   exists for (see the bundled reference
   node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/not-found.md).
   It therefore brings its own document, styles and theme script.

   A URL without a locale prefix never reaches this page: proxy.ts sends it to
   one of the languages first. What lands here is a locale-prefixed path with
   nothing behind it, so the page is rendered in the fallback language. */

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const ui = getUi(defaultLocale);

export const metadata: Metadata = {
  title: `${ui.notFound.metaTitle} · Nikita Petrich`,
  description: ui.notFound.text,
};

export default function GlobalNotFound() {
  return (
    <html
      lang={localeMeta[defaultLocale].htmlLang}
      className={`${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <main className="mx-auto flex min-h-screen max-w-[720px] flex-col items-start justify-center gap-4 px-6 sm:px-8">
          <div className="text-[13px] font-semibold tracking-[0.06em] text-[var(--accent-text)] uppercase">
            {ui.notFound.label}
          </div>
          <h1 className="text-[1.75rem] leading-[1.25] font-semibold tracking-[-0.01em]">
            {ui.notFound.title}
          </h1>
          <p className="text-[15px] leading-[1.65] text-notion-gray">
            {ui.notFound.text}
          </p>
          <a
            href={localePath(defaultLocale)}
            className="rounded-md bg-primary px-4 py-2 text-[14px] font-medium text-primary-foreground shadow-sm transition-colors hover:brightness-95"
          >
            {ui.topbar.home}
          </a>
        </main>
      </body>
    </html>
  );
}
