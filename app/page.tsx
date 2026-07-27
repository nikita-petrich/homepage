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
          <img
            src="/assets/avatar.png"
            alt="Avatar"
            className="h-[66px] w-[66px] object-contain"
          />
        </div>

        <div className="grid grid-cols-1 gap-x-[42px] gap-y-10 md:grid-cols-[210px_minmax(0,1fr)]">
          <aside className="flex min-w-0 flex-col gap-8">
            <div className="aspect-[1/1.1] w-full overflow-hidden rounded-[8px] bg-[#eceded]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/profile.jpg"
                alt="Nikita Petrich"
                className="h-full w-full object-cover object-top"
              />
            </div>

            <Section title="Kontakt" level="h2" id="kontakt">
              <div className="flex flex-col">
                {contact.map((item) => (
                  <InfoLine key={item.text} item={item} />
                ))}
              </div>
            </Section>

            <Section title="Eckdaten" level="h2" id="eckdaten">
              <div className="flex flex-col gap-2.5">
                {eckdaten.map((item) => (
                  <FactLine key={item.label} item={item} />
                ))}
              </div>
            </Section>

            <Section title="Sprachen" level="h2" id="sprachen">
              <div className="flex flex-col">
                {languages.map((item) => (
                  <LangLine key={item.text} item={item} />
                ))}
              </div>
            </Section>

            <Section title="Arbeitsweise" level="h2" id="arbeitsweise">
              <div className="flex flex-wrap gap-1.5">
                {arbeitsweise.map((a) => (
                  <AccentTag key={a} label={a} />
                ))}
              </div>
            </Section>

            <Section title="Profile" level="h2">
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
                    className="text-[14px] font-semibold text-[var(--accent-o)] hover:underline"
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
              <p className="mt-3 font-semibold text-[var(--accent-o)]">
                Sie planen ein KI-Vorhaben oder ein Produkt, das zuverlässig
                laufen muss?{" "}
                <a
                  href={profile.booking}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-analytics-event="booking_click"
                  data-analytics-prop-placement="intro_callout"
                  className="underline underline-offset-2"
                >
                  Buchen Sie ein kostenloses Erstgespräch.
                </a>
              </p>
            </Callout>

            <Section title="Schwerpunkt" level="h1" id="schwerpunkt">
              <div className="flex flex-wrap gap-1.5">
                {schwerpunkt.map((t) => (
                  <AccentTag key={t} label={t} size="md" />
                ))}
              </div>
            </Section>

            <Section title="Projekte" level="h1" id="projekte">
              <ProjectGallery />
            </Section>

            <Section title="Referenzen" level="h1" id="referenzen">
              <p className="mb-4 text-[14px] leading-[1.6] text-notion-gray">
                Was Kund:innen und Kolleg:innen über die Zusammenarbeit sagen.
                Jede Empfehlung ist über ihre Quelle (LinkedIn / Malt)
                nachprüfbar.
              </p>
              <ReferenceGallery />
            </Section>

            <Section title="Skills & Fähigkeiten" level="h1" id="skills">
              <SkillsGallery />
            </Section>

            <Section title="Zertifikate" level="h1" id="zertifikate">
              <CertificateGallery />
            </Section>
          </div>
        </div>
      </main>

      <TableOfContents items={sections} />
    </div>
  );
}
