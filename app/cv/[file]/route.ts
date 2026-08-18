import type { NextRequest } from "next/server";

import { cvFiles } from "@/lib/content/profile";

/* Server-side CV proxy.
 *
 * The two CVs live in a public Google Drive folder and used to be committed a
 * second time under public/cv/ — the same bytes maintained in two places. This
 * route drops the copy in the repo: it fetches the PDF from Drive at request
 * time and streams it back under this site's own domain, so replacing the file
 * in Drive updates the download with no redeploy.
 *
 * Serving it here rather than linking straight to Drive keeps three things a
 * direct Drive link would cost:
 *   - the download stays first-party — no visitor ever connects to Google, so
 *     the site's deliberately google-free privacy posture (and the privacy
 *     policy that promises it) holds;
 *   - the URL and the saved filename stay ours (/cv/CV-German.pdf), so every
 *     already-published link keeps working and the file lands named as before;
 *   - the same-origin Content-Security-Policy needs no exception.
 *
 * The Drive id for each file comes from cvFiles (lib/content/profile.ts), the
 * one place the CVs are described, so the allowlist here cannot drift from the
 * links the menu renders: a new language is a single entry there. */
const DRIVE_IDS = new Map(
  cvFiles.map((f) => [f.href.split("/").pop() as string, f.driveId] as const),
);

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ file: string }> },
) {
  const { file } = await ctx.params;
  const driveId = DRIVE_IDS.get(file);
  /* Only the exact filenames from cvFiles get past here, so `file` is a known
     literal below — no header-injection surface in the disposition. */
  if (!driveId) return new Response(null, { status: 404 });

  /* no-store: the whole point of the proxy is that a new file in Drive shows
     up here without a rebuild, so the origin always reads the current one.
     Downstream caching is the Cache-Control below. fetch follows Drive's 303
     to drive.usercontent.google.com by itself. */
  const upstream = await fetch(
    `https://drive.google.com/uc?export=download&id=${driveId}`,
    { cache: "no-store", redirect: "follow" },
  );

  /* Drive returns a small public file as the bytes directly (as
     application/octet-stream). Anything else — a permissions change, a deleted
     file, or the HTML "can't scan for viruses" page Drive serves for very large
     files — must not be handed back mislabelled as a PDF. */
  const upstreamType = upstream.headers.get("content-type") ?? "";
  if (!upstream.ok || upstreamType.includes("text/html")) {
    return new Response(null, { status: 502 });
  }

  const headers = new Headers({
    "content-type": "application/pdf",
    /* Derived from the request, so the saved name cannot drift from the URL. */
    "content-disposition": `attachment; filename="${file}"`,
    /* A CV changes rarely, so serve it fresh for an hour and then stale for a
       day while it refreshes in the background — an edit in Drive still reaches
       visitors within the hour, and no download waits on a Drive round trip. */
    "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
  });
  /* Forward the length when Drive gives one, so the browser can show download
     progress; the body is streamed through unchanged, so it still matches. */
  const length = upstream.headers.get("content-length");
  if (length) headers.set("content-length", length);

  return new Response(upstream.body, { status: 200, headers });
}
