import { ArrowUpRight, CalendarCheck, Send } from "lucide-react";

import { bookingUrlFor, getContent } from "@/lib/data";
import { getUi } from "@/lib/i18n/ui";
import type { Locale } from "@/lib/i18n/config";

import { CvDownload } from "./cv-download";

/* The closing call to action.
 *
 * The hero callout used to hold the page's only CTA. Everything that makes the
 * case — nine projects, eight testimonials, the skills database, the
 * certificates — sits *below* it, so the visitor who was finally convinced had
 * to scroll back past all of it to act. This block catches them where the
 * reading actually ends.
 *
 * Three routes, because the three kinds of visitor who get this far want
 * different things: a client with a firm project books the call, an agency
 * recruiter sourcing for a client sends a spec and asks for a rate, and the
 * one who has to convince someone else needs the CV as a forwardable file.
 */

/* A mailto with the four fields an answer depends on already in the body.
   Without them the first reply is a list of questions; with them it can be an
   actual answer. Newlines have to survive the URL, hence encodeURIComponent on
   both parts rather than a template string. */
function briefHref(email: string, subject: string, body: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

export function ClosingCta({ locale }: { locale: Locale }) {
  const ui = getUi(locale);
  const { contact } = getContent(locale);

  const email =
    contact.find((c) => c.href?.startsWith("mailto:"))?.href.slice(7) ?? "";

  const card =
    "group flex min-w-0 flex-col gap-1 rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-4 py-3.5 shadow-sm transition-colors hover:bg-[var(--surface-hover)]";
  const cardTitle =
    "flex items-center gap-2 text-[14px] font-semibold text-[var(--foreground)]";
  const cardSub = "text-[12.5px] leading-[1.45] text-notion-gray";

  return (
    <section
      id="contact-cta"
      className="scroll-mt-20 rounded-[12px] border border-[var(--border-soft)] bg-[var(--surface-muted)] px-5 py-6 sm:px-7"
    >
      <h2 className="text-[1.375rem] leading-[1.25] font-semibold tracking-[-0.01em]">
        {ui.home.closingTitle}
      </h2>
      <p className="mt-1.5 max-w-[62ch] text-[14px] leading-[1.6] text-notion-soft">
        {ui.home.closingLead}
      </p>

      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        <a
          href={bookingUrlFor(locale)}
          target="_blank"
          rel="noopener noreferrer"
          data-analytics-event="booking_click"
          data-analytics-prop-placement="closing"
          className={card}
        >
          <span className={cardTitle}>
            <CalendarCheck size={16} strokeWidth={2} className="shrink-0 text-[var(--accent-text)]" />
            <span className="min-w-0 flex-1">{ui.home.closingCall}</span>
            <ArrowUpRight size={14} strokeWidth={2} className="shrink-0 opacity-50" />
          </span>
          <span className={cardSub}>{ui.home.closingCallSub}</span>
        </a>

        <a
          href={briefHref(
            email,
            ui.home.closingBriefSubject,
            ui.home.closingBriefBody,
          )}
          data-analytics-event="project_brief_click"
          data-analytics-prop-placement="closing"
          className={card}
        >
          <span className={cardTitle}>
            <Send size={16} strokeWidth={2} className="shrink-0 text-[var(--accent-text)]" />
            <span className="min-w-0 flex-1">{ui.home.closingBrief}</span>
          </span>
          <span className={cardSub}>{ui.home.closingBriefSub}</span>
        </a>

        {/* The CV is the artefact a recruiter forwards, so it gets equal weight
            here instead of living only behind the top-bar menu. */}
        <div className={card}>
          <span className={cardTitle}>
            <span className="min-w-0 flex-1">{ui.home.closingCv}</span>
          </span>
          <span className={cardSub}>{ui.home.closingCvSub}</span>
          <CvDownload variant="closing" className="mt-2 w-fit" />
        </div>
      </div>
    </section>
  );
}
