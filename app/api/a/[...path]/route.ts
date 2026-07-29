import type { NextRequest } from "next/server";

/* First-party proxy for the self-hosted Umami instance: both the tracker
 * script (/api/a/script.js) and the collect endpoint (/api/a/api/send) are
 * served from this site's own domain — no third-party requests, CSP stays
 * 'self'.
 *
 * The client IP is forwarded so Umami can derive country/region and compute
 * its visitor hash. Umami does not store the address: it resolves geo and
 * device from it and hashes it together with the user agent and a salt that
 * rotates daily, so visitors are not recognisable across days. Withholding
 * the IP is not a privacy win here — it makes every visitor share this
 * container's address, which empties the geo report and collapses all
 * visitors into one.
 *
 * UMAMI_ORIGIN unset (e.g. local dev, preview deployments): the proxy
 * degrades gracefully — the script request gets an empty JS response and
 * collect requests are accepted and dropped.
 */

const UMAMI_ORIGIN = process.env.UMAMI_ORIGIN;
const ALLOWED_PATHS = new Set(["script.js", "api/send"]);

async function proxy(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path } = await ctx.params;
  const target = path.join("/");

  if (!ALLOWED_PATHS.has(target)) {
    return new Response(null, { status: 404 });
  }

  if (!UMAMI_ORIGIN) {
    if (target === "script.js") {
      return new Response("/* analytics disabled */", {
        headers: { "content-type": "application/javascript" },
      });
    }
    return new Response(null, { status: 204 });
  }

  // Pass the request through with its headers intact. An allowlist is the
  // wrong shape here: the tracker carries its own protocol headers
  // (x-umami-website-id, x-umami-hostname) and dropping them makes Umami
  // discard every payload. Only hop-by-hop headers, the rewritten host and
  // cookies are withheld — the site sets no cookies, and the analytics
  // service has no business receiving any.
  const headers = new Headers();
  const DROP = new Set([
    "host",
    "connection",
    "content-length",
    "accept-encoding",
    "cookie",
  ]);
  req.headers.forEach((value, key) => {
    if (!DROP.has(key.toLowerCase())) headers.set(key, value);
  });

  // Set by the reverse proxy in front of this app; x-real-ip is the fallback.
  // Needed for country/region and for a per-visitor (not per-server) hash.
  const clientIp =
    req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip");
  if (clientIp) headers.set("x-forwarded-for", clientIp);

  const res = await fetch(`${UMAMI_ORIGIN}/${target}`, {
    method: req.method,
    headers,
    body: req.method === "POST" ? await req.text() : undefined,
    cache: "no-store",
  });

  return new Response(res.body, {
    status: res.status,
    headers: {
      "content-type":
        res.headers.get("content-type") ?? "application/octet-stream",
      "cache-control":
        target === "script.js" ? "public, max-age=86400" : "no-store",
    },
  });
}

export { proxy as GET, proxy as POST };
