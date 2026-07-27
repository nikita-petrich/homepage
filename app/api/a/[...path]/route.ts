import type { NextRequest } from "next/server";

/* First-party proxy for the self-hosted Umami instance: both the tracker
 * script (/api/a/script.js) and the collect endpoint (/api/a/api/send) are
 * served from this site's own domain — no third-party requests, CSP stays
 * 'self'.
 *
 * Privacy by design: the visitor's IP address is deliberately NOT forwarded
 * (no X-Forwarded-For), so the analytics server only ever sees this server's
 * IP and cannot store or hash client IPs.
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

  const headers: Record<string, string> = {};
  const contentType = req.headers.get("content-type");
  const userAgent = req.headers.get("user-agent");
  if (contentType) headers["content-type"] = contentType;
  // The user agent feeds Umami's aggregate browser/OS statistics.
  if (userAgent) headers["user-agent"] = userAgent;

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
