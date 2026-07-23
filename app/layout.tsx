import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nikita Petrich — Senior Full-Stack & AI Engineer",
  description:
    "Freiberuflicher Senior Full-Stack & AI Engineer mit Schwerpunkt LLM-Integration, RAG und KI-gestützter Automatisierung. Über 7 Jahre Erfahrung in LegalTech, HealthTech, E-Commerce, EdTech und Logistik.",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  /** @modal parallel-route slot — renders intercepted project dialogs. */
  modal: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${inter.variable} antialiased`}>
      <body>
        {children}
        {modal}
      </body>
    </html>
  );
}
