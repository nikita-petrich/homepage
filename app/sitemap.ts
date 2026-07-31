import type { MetadataRoute } from "next";

import {
  certificateSlugs,
  projectSlugs,
  projectSlugsWithReferences,
  referenceSlugs,
} from "@/lib/data";
import { localePath, locales } from "@/lib/i18n/config";
import { alternateLanguages } from "@/lib/metadata";

/* Generated from lib/content/* so the sitemap can never diverge from the
   actually existing slug routes. Every page is listed once per language, with
   hreflang alternates tying the two together. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://sequenz.io";

  const pages: {
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }[] = [
    { path: "/", changeFrequency: "monthly", priority: 1 },
    ...projectSlugs.map((slug) => ({
      path: `/projects/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...projectSlugsWithReferences.map((slug) => ({
      path: `/projects/${slug}/references`,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    ...referenceSlugs.map((slug) => ({
      path: `/references/${slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    { path: "/certificates", changeFrequency: "monthly", priority: 0.6 },
    ...certificateSlugs.map((slug) => ({
      path: `/certificates/${slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    { path: "/imprint", changeFrequency: "yearly", priority: 0.1 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.1 },
  ];

  return pages.flatMap((page) => {
    const languages = Object.fromEntries(
      Object.entries(alternateLanguages(page.path)).map(([lang, path]) => [
        lang,
        `${base}${path}`,
      ]),
    );

    return locales.map((locale) => ({
      url: `${base}${localePath(locale, page.path)}`,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: { languages },
    }));
  });
}
