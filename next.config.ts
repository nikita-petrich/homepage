import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/* CSP without nonces (see the bundled guide
   node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md):
   the site is fully static — a nonce-based CSP would force dynamic rendering.
   'unsafe-inline' for styles is required by the inline style props used for
   gradients/animations; analytics stays 'self' thanks to the /api/a proxy. */
const csp = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim();

const nextConfig: NextConfig = {
  // Self-contained build for the Docker image (deploy/docker-compose.yml).
  output: "standalone",
  poweredByHeader: false,
  experimental: {
    /* The root layout sits under a dynamic segment (app/[locale]/layout.tsx),
       so a URL that matches no route has no layout to render a 404 in. This
       flag enables app/global-not-found.tsx, which brings its own document —
       the case the convention is documented for. */
    globalNotFound: true,
  },
  async redirects() {
    return [
      // www → apex, so the site has exactly one canonical URL (matches
      // metadataBase and avoids duplicate content in search engines).
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.sequenz.io" }],
        destination: "https://sequenz.io/:path*",
        permanent: true,
      },
      // Legacy German URLs → English paths. Keeps links alive that were shared
      // before the rename (PDF CVs, bookmarks, search-engine indexes). The
      // nested project-references rule must precede /projekte/:path* so its
      // second segment is translated too — redirects match top to bottom.
      {
        source: "/projekte/:slug/referenzen",
        destination: "/projects/:slug/references",
        permanent: true,
      },
      { source: "/projekte/:path*", destination: "/projects/:path*", permanent: true },
      { source: "/referenzen/:path*", destination: "/references/:path*", permanent: true },
      { source: "/zertifikate/:path*", destination: "/certificates/:path*", permanent: true },
      { source: "/impressum", destination: "/imprint", permanent: true },
      { source: "/datenschutz", destination: "/privacy", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          // Self-hosted (netcup) — no platform sets HSTS for us.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
