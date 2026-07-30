import Image from "next/image";

import {
    AccentTag,
    Callout,
    FactLine,
    InfoLine,
    LangLine,
    RichText,
    Section,
} from "@/components/notion/blocks";
import { domainOf } from "@/lib/analytics/track";
import { CertificateGallery } from "@/components/notion/certificates";
import { CoverBanner } from "@/components/notion/cover-banner";
import { CodeLogo } from "@/components/notion/icons";
import { SkillsGallery } from "@/components/notion/galleries";
import { ProjectGallery } from "@/components/notion/projects";
import { ReferenceGallery } from "@/components/notion/references";
import { TableOfContents } from "@/components/notion/toc";
import { NotionTopBar } from "@/components/notion/topbar";
import {
    arbeitsweise,
    contact,
    eckdaten,
    intro,
    languages,
    profile,
    profileLinks,
    schwerpunkt,
    sections,
} from "@/lib/data";

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <NotionTopBar />

      <CoverBanner />

      <main className="mx-auto max-w-[960px] px-6 pb-28 sm:px-12">
        <div className="relative z-10 -mt-[34px] mb-2 w-fit drop-shadow-[0_2px_6px_rgba(0,0,0,0.12)]">
          <CodeLogo size={66} />
        </div>

        <div className="grid grid-cols-1 gap-x-[42px] gap-y-10 md:grid-cols-[210px_minmax(0,1fr)]">
          <aside className="flex min-w-0 flex-col gap-8">
            <div className="relative aspect-[1/1.1] w-full overflow-hidden rounded-[8px] bg-[#eceded]">
              <Image
                src="/assets/profile.jpg"
                alt="Nikita Petrich"
                fill
                sizes="(max-width: 768px) 100vw, 210px"
                priority
                className="object-cover object-top"
              />
            </div>

            <Section title="Kontakt" level="h3" id="kontakt">
              <div className="flex flex-col">
                {contact.map((item) => (
                  <InfoLine key={item.text} item={item} />
                ))}
              </div>
            </Section>

            <Section title="Eckdaten" level="h3" id="eckdaten">
              <div className="flex flex-col gap-2.5">
                {eckdaten.map((item) => (
                  <FactLine key={item.label} item={item} />
                ))}
              </div>
            </Section>

            <Section title="Sprachen" level="h3" id="sprachen">
              <div className="flex flex-col">
                {languages.map((item) => (
                  <LangLine key={item.text} item={item} />
                ))}
              </div>
            </Section>

            <Section title="Arbeitsweise" level="h3" id="arbeitsweise">
              <div className="flex flex-wrap gap-1.5">
                {arbeitsweise.map((a) => (
                  <AccentTag key={a} label={a} />
                ))}
              </div>
            </Section>

            <Section title="Profile" level="h3">
              <div className="flex flex-wrap gap-x-3.5 gap-y-1.5">
                {profileLinks.map((p) => (
                  <a
                    key={p.label}
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-analytics-event="outbound_click"
                    data-analytics-prop-link-label={p.label}
                    data-analytics-prop-target-domain={domainOf(p.href)}
                    className="text-[14px] font-semibold text-[var(--accent-text)] hover:underline"
                  >
                    {p.label}
                  </a>
                ))}
              </div>
            </Section>
          </aside>

          <div className="flex min-w-0 flex-col gap-10">
            <Callout>
              <RichText lines={intro} />
              <p className="mt-3 font-semibold text-[var(--accent-text)]">
                Sie planen ein KI-Vorhaben oder ein Produkt, das zuverlässig
                laufen muss?
              </p>
              <a
                href={profile.booking}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-event="booking_click"
                data-analytics-prop-placement="hero"
                className="mt-4 inline-flex w-fit items-center rounded-lg bg-primary px-4 py-2.5 text-[14px] font-medium text-primary-foreground shadow-sm transition-colors hover:brightness-95"
              >
                Erstgespräch buchen
              </a>
            </Callout>

            <Section title="Schwerpunkt" level="h2" id="schwerpunkt">
              <div className="flex flex-wrap gap-1.5">
                {schwerpunkt.map((t) => (
                  <AccentTag key={t} label={t} size="md" />
                ))}
              </div>
            </Section>

            <Section title="Projekte" level="h2" id="projekte">
              <ProjectGallery />
            </Section>

            <Section title="Referenzen" level="h2" id="referenzen">
              <p className="mb-4 text-[14px] leading-[1.6] text-notion-gray">
                Was Kund:innen und Projektbeteiligte über die Zusammenarbeit
                sagen. Jede Empfehlung ist über ihre Quelle (LinkedIn / Malt)
                nachprüfbar.
              </p>
              <ReferenceGallery />
            </Section>

            <Section title="Skills & Fähigkeiten" level="h2" id="skills">
              <SkillsGallery />
            </Section>

            <Section title="Zertifikate" level="h2" id="zertifikate">
              <CertificateGallery />
            </Section>
          </div>
        </div>
      </main>

      <TableOfContents items={sections} />
    </div>
  );
}
