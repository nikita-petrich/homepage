import { notFound } from "next/navigation";

/* Any URL below a locale that matches no real route — /de/gibt-es-nicht.
 *
 * Without this catch-all such a URL would match no route at all and be served
 * by app/global-not-found.tsx, which has no locale and therefore always speaks
 * the fallback language. Routing it here instead puts it inside the locale
 * layout, so app/[locale]/not-found.tsx answers in the language of the URL the
 * visitor actually typed. */
export default function CatchAllNotFound(): never {
  notFound();
}
