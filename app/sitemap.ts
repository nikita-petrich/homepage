import type { MetadataRoute } from "next";

import {
  certificates,
  projects,
  projectsWithReferences,
  references,
} from "@/lib/data";

/* Generated from lib/data.ts so the sitemap can never diverge from the
   actually existing slug routes. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://sequenz.io";

  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    ...projects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...projectsWithReferences.map((p) => ({
      url: `${base}/projects/${p.slug}/references`,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    ...references.map((r) => ({
      url: `${base}/references/${r.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    { url: `${base}/certificates`, changeFrequency: "monthly", priority: 0.6 },
    ...certificates.map((c) => ({
      url: `${base}/certificates/${c.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    { url: `${base}/imprint`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.1 },
  ];
}
