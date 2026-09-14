import type { MetadataRoute } from "next";

/* `/api/` used to be disallowed wholesale. That also shut out anything the site
   publishes *as data* under it — the profile feed project-pilot reads to draft
   applications — so the rule now names the one path that genuinely has no
   business being crawled: the Umami proxy (app/api/a), an unauthenticated
   collect endpoint and a tracker script, neither of them content. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/a/",
    },
    sitemap: "https://sequenz.io/sitemap.xml",
  };
}
