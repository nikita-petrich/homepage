import { cvByWordFile, cvExportUrl } from "@/lib/cv";

/* The CV as a Word file.
 *
 * Nothing is stored under this route: the .docx is Google's own export of the
 * document the CV is written in, fetched at the moment the visitor clicks. That
 * is the point — there is no second copy that could go stale, and no step the
 * visitor has to perform ("open the doc, then File → Download → Word").
 *
 * The export is fetched here instead of linking docs.google.com in the menu, so
 * that downloading stays a first-party request. The visitor's browser never
 * contacts Google — which is what the privacy page says about merely using the
 * site — and the CSP stays 'self'. Following the "open in Google Docs" link is
 * the one deliberate exception, and it is the visitor's own click.
 *
 * The path lives under /cv/word/ rather than /cv/, so it cannot collide with
 * the PDFs served from public/cv, and it ends in .docx so proxy.ts leaves it
 * alone: the file has no language of its own beyond the one in its name.
 *
 * See node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md */

const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ file: string }> },
) {
  const { file } = await ctx.params;

  /* An allowlist, not a pass-through: only the two names in lib/cv.ts resolve,
     so this route can never be pointed at another document. */
  const cv = cvByWordFile(file);
  if (!cv) return new Response(null, { status: 404 });

  let upstream: Response;
  try {
    upstream = await fetch(cvExportUrl(cv), { cache: "no-store" });
  } catch {
    return new Response("CV export unavailable", { status: 502 });
  }

  /* Google answers with a redirect to a sign-in page — not an error — when a
     document stops being link-shared, so a non-2xx or an HTML body both mean
     "no file". Either way the PDF and the document link in the menu are
     unaffected; only this one entry fails. */
  if (!upstream.ok || !upstream.body) {
    return new Response("CV export unavailable", { status: 502 });
  }

  return new Response(upstream.body, {
    headers: {
      "content-type": DOCX_MIME,
      /* The name from lib/cv.ts, not the requested one: it is the same string —
         the allowlist above matched it — but taking it from our own data keeps
         request input out of a response header. Google's own name for the
         export ("CV-German.docx") would not match the PDF next to it. */
      "content-disposition": `attachment; filename="${cv.fileName}.docx"`,
      /* Ten minutes: a reload or a second click does not go to Google again,
         and an edited CV is still out within the quarter hour. */
      "cache-control": "public, max-age=600",
    },
  });
}
