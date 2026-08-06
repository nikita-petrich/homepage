import type { Locale } from "@/lib/i18n/config";

/* Where the CV actually lives.
 *
 * Three shapes of one document, because the three people who ask for a CV want
 * different things: the designed PDF to forward, a Word file to paste into an
 * agency template, and the document itself to read without downloading
 * anything.
 *
 * Only the PDF is a file in this repository. The Word version is not stored at
 * all — it is Google's own export of the document, fetched when the visitor
 * clicks (app/cv/word/[file]/route.ts), so it cannot fall behind the document
 * the way a committed copy would. `docId` is therefore the one thing to change
 * when a CV moves to a new document; nothing else names it.
 *
 * Both documents sit in a Drive folder shared with "anyone with the link" —
 * that, and nothing else, is what makes the export reachable without
 * credentials. If that sharing is ever revoked, the Word route answers 502 and
 * the Google Docs link asks for access; the PDF is served from here and is
 * unaffected. */

export type CvDoc = {
  /** Id of the Google Doc the CV is written in. */
  docId: string;
  /** The designed original, served straight from public/. */
  pdf: string;
  /** Base name both downloads arrive under, so the formats are named alike. */
  fileName: string;
};

/* Keyed by the language of the CV — which happens to be the same pair as the
   site's locales, so a missing language is a type error rather than a menu
   entry that silently disappears. */
export const cvDocs: Record<Locale, CvDoc> = {
  de: {
    docId: "1T6lx_w0x7x8KQlPA_537rrpfuXe-lkW7J21SLvdQlVU",
    pdf: "/cv/CV_Nikita_Petrich_DE.pdf",
    fileName: "CV_Nikita_Petrich_DE",
  },
  en: {
    docId: "1ZPDFpeDf6KLa_uGU6iw0mfdvrhEGSK8Vkq_8lAlPJtA",
    pdf: "/cv/CV_Nikita_Petrich_EN.pdf",
    fileName: "CV_Nikita_Petrich_EN",
  },
};

/** The Word download — this site's own address, not Google's. */
export function cvWordPath(cv: CvDoc): string {
  return `/cv/word/${cv.fileName}.docx`;
}

/** The document itself. Link-shared read-only, so this opens as a preview. */
export function cvDocUrl(cv: CvDoc): string {
  return `https://docs.google.com/document/d/${cv.docId}/edit?usp=sharing`;
}

/** What the Word route fetches: Google's DOCX conversion of the document. */
export function cvExportUrl(cv: CvDoc): string {
  return `https://docs.google.com/document/d/${cv.docId}/export?format=docx`;
}

/** The CV a /cv/word/<file> request asks for, or nothing if the name is made up. */
export function cvByWordFile(file: string): CvDoc | undefined {
  return Object.values(cvDocs).find((cv) => `${cv.fileName}.docx` === file);
}
