import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import {
    AccentTag,
    Callout,
    FactLine,
    InfoLine,
    LangLine,
    IntroLines,
    Section,
} from "@/components/notion/blocks";
import { domainOf } from "@/lib/analytics/track";
import { CertificateGallery } from "@/components/notion/certificates";
import { ClosingCta } from "@/components/notion/closing-cta";
import { CoverBanner } from "@/components/notion/cover-banner";
import { CodeLogo } from "@/components/notion/icons";
import { IntentLink } from "@/components/notion/intent-link";
import { SkillsGallery } from "@/components/notion/galleries";
import { ProjectGallery } from "@/components/notion/projects";
import { ReferenceGallery } from "@/components/notion/references";
import { TableOfContents } from "@/components/notion/toc";
import { NotionTopBar } from "@/components/notion/topbar";
import { bookingUrlFor, getContent } from "@/lib/data";
import { isLocale, localePath } from "@/lib/i18n/config";
import { getUi } from "@/lib/i18n/ui";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const ui = getUi(locale);
  const {
    approach,
    certificates,
    contact,
    facts,
    focus,
    intro,
    languages,
    methods,
    profileLinks,
    projects,
    references,
    sections,
    skills,
  } = getContent(locale);

  return (
    <div className="min-h-screen bg-[var(--notion-bg)]">
      <NotionTopBar />

      <CoverBanner locale={locale} />

      <main className="mx-auto max-w-[960px] px-6 pb-28 sm:px-12">
        <div className="relative z-10 -mt-[34px] mb-2 w-fit drop-shadow-[0_2px_6px_rgba(0,0,0,0.12)]">
          <CodeLogo size={66} />
        </div>

        <div className="grid grid-cols-1 gap-x-[42px] gap-y-10 md:grid-cols-[210px_minmax(0,1fr)]">
          <aside className="flex min-w-0 flex-col gap-8">
            {/* Full-bleed within the content column on a phone, 210px wide in
                the sidebar from md up — the 1:1.1 ratio holds either way.

                This portrait is the LCP element. `preload` replaces the
                deprecated `priority` in Next 16 and emits the <link rel=preload>;
                fetchPriority is now a separate prop, and without it neither the
                preload nor the <img> carries fetchpriority=high — so the browser
                still queues the page's largest paint at default priority. */}
            <div className="relative aspect-[1/1.1] w-full overflow-hidden rounded-[8px] bg-[var(--surface-chip)]">
              <Image
                src="/assets/profile.jpg"
                alt="Nikita Petrich"
                fill
                sizes="(max-width: 767px) 100vw, 210px"
                preload
                fetchPriority="high"
                className="object-cover object-top"
              />
            </div>

            <Section title={ui.sections.contact} size="h3" id="contact">
              <div className="flex flex-col">
                {contact.map((item) => (
                  <InfoLine key={item.text} item={item} />
                ))}
              </div>
            </Section>

            <Section title={ui.sections.facts} size="h3" id="facts">
              <div className="flex flex-col gap-2.5">
                {facts.map((item) => (
                  <FactLine key={item.label} item={item} />
                ))}
              </div>
            </Section>

            <Section title={ui.sections.profiles} size="h3" id="profiles">
              <div className="flex flex-wrap gap-1.5">
                {profileLinks.map((p) => (
                  <Badge
                    key={p.label}
                    asChild
                    variant="secondary"
                    className="gap-1 px-2.5 py-1 text-[12px] font-medium"
                  >
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-analytics-event="outbound_click"
                      data-analytics-prop-link-label={p.label}
                      data-analytics-prop-target-domain={domainOf(p.href)}
                    >
                      {p.label}
                      <ArrowUpRight className="opacity-60" />
                    </a>
                  </Badge>
                ))}
              </div>
            </Section>

            <Section title={ui.sections.methods} size="h3" id="methods">
              <div className="flex flex-wrap gap-1.5">
                {methods.map((m) => (
                  <AccentTag key={m} label={m} />
                ))}
              </div>
            </Section>

            <Section title={ui.sections.languages} size="h3" id="languages">
              <div className="flex flex-col">
                {languages.map((item) => (
                  <LangLine key={item.text} item={item} locale={locale} />
                ))}
              </div>
            </Section>

            <Section title={ui.sections.approach} size="h3" id="approach">
              <div className="flex flex-wrap gap-1.5">
                {approach.map((a) => (
                  <AccentTag key={a} label={a} />
                ))}
              </div>
            </Section>
          </aside>

          <div className="flex min-w-0 flex-col gap-10">
            {/* The callout's own Info icon is the only one in the block now —
                the intro lines dropped their per-line icons. */}
            <Callout>
              <IntroLines lines={intro} />
              <p className="mt-3 font-semibold text-[var(--accent-text)]">
                {ui.home.ctaQuestion}
              </p>
              <a
                href={bookingUrlFor(locale)}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-event="booking_click"
                data-analytics-prop-placement="hero"
                className="mt-4 inline-flex w-fit items-center rounded-lg bg-primary px-4 py-2.5 text-[14px] font-medium text-primary-foreground shadow-sm transition-colors hover:brightness-95"
              >
                {ui.home.ctaButton}
              </a>
            </Callout>

            <Section title={ui.sections.focus} level="h2" id="focus">
              <div className="flex flex-wrap gap-1.5">
                {focus.map((t) => (
                  <AccentTag key={t} label={t} size="md" />
                ))}
              </div>
            </Section>

            <Section title={ui.sections.projects} level="h2" id="projects">
              <ProjectGallery projects={projects} />
            </Section>

            <Section title={ui.sections.references} level="h2" id="references">
              <p className="mb-4 text-[14px] leading-[1.6] text-notion-gray">
                {ui.home.referencesIntro}
              </p>
              <ReferenceGallery references={references} />
            </Section>

            <Section title={ui.sections.skills} level="h2" id="skills">
              <SkillsGallery skills={skills} />
            </Section>

            <Section title={ui.sections.certificates} level="h2" id="certificates">
              <p className="mb-4 text-[14px] leading-[1.6] text-notion-gray">
                {ui.home.certificatesIntro}{" "}
                <IntentLink
                  href={localePath(locale, "/certificates")}
                  data-analytics-event="certificates_overview_open"
                  data-analytics-prop-source="home_section"
                  className="font-medium text-[var(--accent-text)] underline underline-offset-2"
                >
                  {ui.home.certificatesLink}
                </IntentLink>
                .
              </p>
              <CertificateGallery certificates={certificates} />
            </Section>

            {/* The page used to end here, with its only CTA nine projects and
                eight testimonials further up. */}
            <ClosingCta locale={locale} />
          </div>
        </div>
      </main>

      <TableOfContents items={sections} />
    </div>
  );
}
