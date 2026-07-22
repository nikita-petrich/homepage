import {
    AccentTag,
    Callout,
    FactLine,
    InfoLine,
    LangLine,
    RichText,
    Section,
} from "@/components/notion/blocks";
import { CookieBanner } from "@/components/notion/cookie-banner";
import { SkillsGallery } from "@/components/notion/galleries";
import { ProjectGallery } from "@/components/notion/projects";
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

      {/* Cover band (gradient, full-bleed) */}
      <div className="h-[clamp(140px,15.5vw,220px)] w-full bg-[linear-gradient(180deg,#dcdddf_0%,#c9cacc_100%)]" />

      {/* Page body */}
      <main className="mx-auto max-w-[960px] px-6 pb-28 sm:px-12">
        {/* Page icon, overlapping the cover */}
        <div className="relative z-10 -mt-[34px] mb-2 w-fit drop-shadow-[0_2px_6px_rgba(0,0,0,0.12)]">
          <img
            src="/assets/CV%20-%20Optimierte%20Lesbarkeit-selection%20(1).png"
            alt="Avatar"
            className="h-[66px] w-[66px] object-contain"
          />
        </div>

        <h1 className="text-[40px] leading-[1.15] font-bold tracking-[-0.02em]">
          {profile.name}
        </h1>
        <div className="mt-1.5 mb-6 text-[18px] font-semibold text-[var(--accent-o)]">
          {profile.role}
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-x-[42px] gap-y-10 md:grid-cols-[210px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="flex min-w-0 flex-col gap-8">
            {/* Profile photo */}
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
                    rel="noreferrer"
                    className="text-[14px] font-semibold text-[var(--accent-o)] hover:underline"
                  >
                    {p.label}
                  </a>
                ))}
              </div>
            </Section>
          </aside>

          {/* Main column */}
          <div className="flex min-w-0 flex-col gap-10">
            <Callout>
              <RichText lines={intro} />
              <p className="mt-3 font-semibold text-[var(--accent-o)]">
                Sie planen ein KI-Vorhaben oder ein Produkt, das zuverlässig
                laufen muss?{" "}
                <a
                  href={profile.calendly}
                  target="_blank"
                  rel="noreferrer"
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

            <Section title="Skills & Fähigkeiten" level="h1" id="skills">
              <SkillsGallery />
            </Section>
          </div>
        </div>
      </main>

      <TableOfContents items={sections} />
      <CookieBanner />
    </div>
  );
}
