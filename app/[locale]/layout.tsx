import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { notFound } from "next/navigation";
import Script from "next/script";

import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { CookieBanner } from "@/components/notion/cookie-banner";
import { Footer } from "@/components/notion/footer";
import { PersonJsonLd } from "@/components/notion/json-ld";
import { ThemeSync } from "@/components/notion/theme-sync";
import { getContent } from "@/lib/data";
import { isLocale, localeMeta, localePath, locales } from "@/lib/i18n/config";
import { I18nProvider } from "@/lib/i18n/provider";
import { getUi } from "@/lib/i18n/ui";
import { alternateLanguages, ogImageFor, siteName } from "@/lib/metadata";
import { themeInitScript } from "@/lib/theme";

import "../globals.css";

/* The root layout lives under [locale] so <html lang> and every string on the
   page follow the route — the pattern the bundled guide describes for
   internationalisation (node_modules/next/dist/docs/01-app/02-guides/internationalization.md).
   Both locales are prerendered; a request without a locale prefix is sent to
   one of them by proxy.ts. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const { siteDescription, profile } = getContent(locale);
  const title = `${profile.name} — ${profile.role}`;

  return {
    metadataBase: new URL("https://sequenz.io"),
    title: {
      default: title,
      template: `%s · ${siteName}`,
    },
    description: siteDescription,
    /* Subpages set their own canonical via lib/metadata.ts; this covers the
       start page of each language. */
    alternates: {
      canonical: localePath(locale),
      languages: alternateLanguages("/"),
    },
    openGraph: {
      type: "website",
      locale: localeMeta[locale].ogLocale,
      url: localePath(locale),
      siteName,
      title,
      description: siteDescription,
      images: [ogImageFor(locale)],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: siteDescription,
      images: [ogImageFor(locale)],
    },
  };
}

export default async function RootLayout({
  children,
  modal,
  params,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    /* `motion-safe:scroll-smooth` eases the in-page jumps of the table of
       contents (and any /#section deep link) while respecting
       prefers-reduced-motion. `data-scroll-behavior="smooth"` is required on
       top: since Next 16 the router no longer neutralises smooth scrolling
       during route transitions on its own, so without it opening or closing a
       project modal would animate the page instead of switching instantly
       (see node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md,
       "Scroll Behavior Override"). */
    <html
      lang={localeMeta[locale].htmlLang}
      data-scroll-behavior="smooth"
      className={`${GeistSans.variable} ${GeistMono.variable} antialiased motion-safe:scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        {/* Applies the stored theme before the first paint — see lib/theme.ts.
            next/script `beforeInteractive` inlines it into the initial <head>
            (so no theme flash) without the raw-<script> client-render warning.
            suppressHydrationWarning above covers the class it adds to <html>. */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body>
        <I18nProvider locale={locale} ui={getUi(locale)}>
          <ThemeSync />
          <PersonJsonLd locale={locale} />
          {children}
          <Footer />
          {modal}
          <CookieBanner />
          <AnalyticsProvider />
        </I18nProvider>
      </body>
    </html>
  );
}
