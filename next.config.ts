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
