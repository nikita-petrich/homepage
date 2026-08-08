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

/* Ceiling on a collect payload. A real one is a few hundred bytes: the event
   name and a handful of scalar properties. The endpoint is unauthenticated by
   nature — anything on the internet may POST to it — so the body is read with
   a bound rather than buffered in full at the sender's discretion. */
const MAX_BODY_BYTES = 16 * 1024;

/* Headers that must not reach Umami.

   Hop-by-hop headers (`connection`, `content-length`, `accept-encoding`)
   describe this connection, not the forwarded one, and `host` is rewritten by
   fetch. The rest are withheld on purpose: the site sets no cookies and sends
   no credentials, so the analytics service has no business receiving either.

   The remaining headers pass through unchanged. An allowlist is the wrong
   shape here — the tracker carries its own protocol headers
   (x-umami-website-id, x-umami-hostname) and dropping them makes Umami discard
   every payload. */
const DROP_HEADERS = new Set([
  "host",
  "connection",
  "content-length",
  "accept-encoding",
  "cookie",
  "authorization",
  "proxy-authorization",
  /* Rebuilt below from the trusted hop only, so a caller cannot dictate them. */
  "x-forwarded-for",
  "x-real-ip",
  "forwarded",
]);

/* The address of the peer that actually reached the reverse proxy.

   `x-forwarded-for` is a chain, and nginx appends rather than replaces
   (`$proxy_add_x_forwarded_for`): a visitor who sends the header themselves
   ends up first in the list, with their real address appended behind it. Umami
   reads the *first* entry, so passing the chain through verbatim would let any
   caller choose the country their hits are counted in and the visitor hash
   they are grouped under. The last entry is the one the trusted proxy wrote,
   so that is the only one taken. `x-real-ip` — a single value the proxy sets
   itself — is the fallback for setups that do not send a chain. */
function clientIpOf(req: NextRequest): string | null {
  const chain = req.headers.get("x-forwarded-for");
  if (chain) {
    const hops = chain
      .split(",")
      .map((hop) => hop.trim())
      .filter(Boolean);
    const last = hops.at(-1);
    if (last) return last;
  }
  return req.headers.get("x-real-ip");
}

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

  let body: string | undefined;
  if (req.method === "POST") {
    const declared = Number(req.headers.get("content-length"));
    if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
      return new Response(null, { status: 413 });
    }
    body = await req.text();
    /* content-length is a claim; the string that arrived is the fact. */
    if (body.length > MAX_BODY_BYTES) {
      return new Response(null, { status: 413 });
    }
  }

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (!DROP_HEADERS.has(key.toLowerCase())) headers.set(key, value);
  });

  // Needed for country/region and for a per-visitor (not per-server) hash.
  const clientIp = clientIpOf(req);
  if (clientIp) headers.set("x-forwarded-for", clientIp);

  const res = await fetch(`${UMAMI_ORIGIN}/${target}`, {
    method: req.method,
    headers,
    body,
    cache: "no-store",
  });

  return new Response(res.body, {
    status: res.status,
    headers: {
      "content-type":
        res.headers.get("content-type") ?? "application/octet-stream",
      /* The tracker is versioned with the Umami instance, not with this build,
         so the day-long lifetime stays — but `stale-while-revalidate` keeps the
         expiry off the critical path: the day-old copy is used immediately and
         refreshed in the background instead of blocking the first hit after
         midnight on a round trip to the analytics host. */
      "cache-control":
        target === "script.js"
          ? "public, max-age=86400, stale-while-revalidate=604800"
          : "no-store",
    },
  });
}

export { proxy as GET, proxy as POST };
