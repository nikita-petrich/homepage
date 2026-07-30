import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { CookieBanner } from "@/components/notion/cookie-banner";
import { Footer } from "@/components/notion/footer";
import { PersonJsonLd } from "@/components/notion/json-ld";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const siteDescription =
  "Freiberuflicher Senior Full-Stack & AI Engineer mit Schwerpunkt LLM-Integration, RAG und KI-gestützter Automatisierung. Über 7 Jahre Erfahrung in LegalTech, HealthTech, E-Commerce, EdTech und Logistik.";

export const metadata: Metadata = {
  metadataBase: new URL("https://sequenz.io"),
  title: {
    default: "Nikita Petrich — Senior Full-Stack & AI Engineer",
    template: "%s · Nikita Petrich",
  },
  description: siteDescription,
  // Subpages set their own canonical via lib/metadata.ts; this covers "/".
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "/",
    siteName: "Nikita Petrich",
    title: "Nikita Petrich — Senior Full-Stack & AI Engineer",
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "Nikita Petrich — Senior Full-Stack & AI Engineer",
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${inter.variable} antialiased`}>
      <body>
        <PersonJsonLd />
        {children}
        <Footer />
        {modal}
        <CookieBanner />
        <AnalyticsProvider />
      </body>
    </html>
  );
}
