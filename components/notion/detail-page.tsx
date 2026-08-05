import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";

import { NotionTopBar } from "./topbar";

/* The page frame for a detail route opened directly — a shared link, a refresh,
 * a crawler.
 *
 * The same content is also reachable as a dialog: clicking a card inside the
 * site hits an intercepting route in the @modal slot. That dialog is a Radix
 * portal, and a portal renders nothing on the server — it only exists once
 * React has hydrated. That is fine for the dialog, which by definition opens on
 * top of a page that is already there, but it used to be the standalone page
 * too: every /projects/<slug>, /references/<slug> and /certificates/<slug> was
 * served as a document with a footer and nothing else, and every reader without
 * full JS execution (ATS importers, preview bots, reader modes, "view source")
 * saw exactly that.
 *
 * So the standalone route no longer renders a dialog. It renders the very same
 * detail component in normal document flow, inside this frame — server-rendered
 * markup, in the first response, with a real <main> and a real <h1>. */
export function DetailPage({
  backHref,
  backLabel,
  width = "wide",
  children,
}: {
  backHref: string;
  backLabel: string;
  /** Mirrors the max width its dialog counterpart uses: 720px for projects and
      certificates, 640px for a single testimonial. Static classes, because a
      width assembled at runtime is never emitted by the Tailwind compiler. */
  width?: "wide" | "narrow";
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--notion-bg)]">
      <NotionTopBar />
      <main
        className={cn(
          "mx-auto w-full px-4 pt-6 pb-20 sm:px-6 sm:pt-8",
          width === "narrow" ? "max-w-[672px]" : "max-w-[752px]",
        )}
      >
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 py-[3px] text-[13px] font-medium text-notion-gray transition-colors hover:text-notion-text"
        >
          <ArrowLeft size={14} strokeWidth={2} />
          {backLabel}
        </Link>

        <article
          className="mt-4 overflow-hidden rounded-xl bg-[var(--surface)]"
          style={{ boxShadow: "var(--notion-card-shadow)" }}
        >
          {children}
        </article>
      </main>
    </div>
  );
}
