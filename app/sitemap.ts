import type { MetadataRoute } from "next";

import { projects, projectsWithReferences, references } from "@/lib/data";

/* Generated from lib/data.ts so the sitemap can never diverge from the
   actually existing slug routes. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://sequenz.io";

  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    ...projects.map((p) => ({
      url: `${base}/projekte/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...projectsWithReferences.map((p) => ({
      url: `${base}/projekte/${p.slug}/referenzen`,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    ...references.map((r) => ({
      url: `${base}/referenzen/${r.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    { url: `${base}/impressum`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${base}/datenschutz`, changeFrequency: "yearly", priority: 0.1 },
  ];
}
