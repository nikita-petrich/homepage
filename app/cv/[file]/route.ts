import type { NextRequest } from "next/server";

import { cvDriveFolderId, cvFiles } from "@/lib/content/profile";

/* Server-side CV proxy, matched by filename.
 *
 * The CVs live in a public Google Drive folder (cvDriveFolderId). Rather than
 * pin a file id per language — which Drive mints anew every time a file is
 * re-uploaded, so keeping it stable means the "manage versions" dance — this
 * resolves the current file by *name* on each request: drop a CV-German.pdf
 * into the folder and /cv/CV-German.pdf serves it, whatever its id.
 *
 * Drive offers no credential-free way to list a public folder through its API,
 * so the listing comes from the folder's embeddedfolderview page — the same
 * list Drive renders when a public folder is embedded. That page is not a
 * documented API; if Google ever changes its shape the parse below stops
 * finding entries and the route answers 502 (never the wrong file), which is
 * the signal to revisit this. The download itself is the ordinary
 * uc?export=download endpoint.
 *
 * Everything else is as before: the same /cv/<name>.pdf URLs, a first-party
 * stream so no visitor ever connects to Google, our filename, its own
 * Cache-Control. */

/* The names this route will serve: the basenames of the cvFiles hrefs, so the
   allowlist cannot drift from the links the menu renders. Any other name is
   refused before a single Drive request goes out. */
const ALLOWED_NAMES = new Set(
  cvFiles.map((f) => f.href.split("/").pop() as string),
);

/* name → file id, read from the embeddedfolderview listing. Each file is a
   `<div class="flip-entry" id="entry-<id>"> … <div class="flip-entry-title">
   <name></div>`; splitting on the entry container scopes each id to its own
   title, so a malformed entry drops out instead of stealing the next one's. */
function parseFolder(html: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const chunk of html.split('class="flip-entry"').slice(1)) {
    const id = chunk.match(/id="entry-([A-Za-z0-9_-]+)"/)?.[1];
    const name = chunk.match(/class="flip-entry-title">([^<]+)</)?.[1];
    // First listed wins, so a duplicate name resolves deterministically.
    if (id && name && !map.has(name)) map.set(name, id);
  }
  return map;
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ file: string }> },
) {
  const { file } = await ctx.params;
  /* Allowlisted below before it reaches any header, so `file` is a known
     literal in the disposition — no injection surface. */
  if (!ALLOWED_NAMES.has(file)) return new Response(null, { status: 404 });

  /* Resolve the current id by name. no-store: the whole point is that a freshly
     uploaded file is picked up without a rebuild. */
  const listing = await fetch(
    `https://drive.google.com/embeddedfolderview?id=${cvDriveFolderId}`,
    { cache: "no-store" },
  );
  if (!listing.ok) return new Response(null, { status: 502 });
  const folder = parseFolder(await listing.text());
  /* An empty parse means the listing page changed shape, not that the folder is
     empty — surface that as 502 so it is noticed, not as a silent 404. */
  if (folder.size === 0) return new Response(null, { status: 502 });
  const driveId = folder.get(file);
  /* Allowlisted but not in the folder right now — not uploaded yet, or misnamed. */
  if (!driveId) return new Response(null, { status: 404 });

  const upstream = await fetch(
    `https://drive.google.com/uc?export=download&id=${driveId}`,
    { cache: "no-store", redirect: "follow" },
  );
  /* A small public file comes back as the bytes directly. Anything else — a
     permissions change, a race with a delete, the HTML "can't scan for viruses"
     page Drive serves for very large files — must not be handed back as a PDF. */
  const upstreamType = upstream.headers.get("content-type") ?? "";
  if (!upstream.ok || upstreamType.includes("text/html")) {
    return new Response(null, { status: 502 });
  }

  const headers = new Headers({
    "content-type": "application/pdf",
    /* Derived from the request, so the saved name cannot drift from the URL. */
    "content-disposition": `attachment; filename="${file}"`,
    /* A CV changes rarely, so serve it fresh for an hour and then stale for a
       day while it refreshes in the background — a new upload still reaches
       visitors within the hour, and no download waits on a Drive round trip. */
    "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
  });
  const length = upstream.headers.get("content-length");
  if (length) headers.set("content-length", length);

  return new Response(upstream.body, { status: 200, headers });
}
