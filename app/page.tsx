import Image from "next/image";

import { CloudyOrangeIcon } from "@/components/notion/icons";
import {
  Callout,
  InfoLine,
  ResumeItem,
  RichText,
  Section,
} from "@/components/notion/blocks";
import { ProjectGallery, SkillsGallery } from "@/components/notion/galleries";
import {
  contact,
  education,
  interests,
  intro,
  languages,
  profile,
  work,
} from "@/lib/data";

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-[900px] px-5 py-14 sm:px-10 sm:py-16">
      {/* Page icon + title (Notion page chrome) */}
      <CloudyOrangeIcon size={70} className="mb-3 -ml-[3px]" />
      <h1 className="mb-9 text-[40px] leading-[1.15] font-bold tracking-[-0.02em]">
        {profile.name}
      </h1>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-[15.25rem_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside className="flex flex-col gap-7">
          <div className="w-full overflow-hidden rounded-[6px] bg-[var(--notion-placeholder)]">
            <Image
              src={profile.photo}
              alt={profile.photoAlt}
              width={1000}
              height={720}
              priority
              unoptimized
              className="block h-auto w-full"
            />
          </div>

          <Section title="Contact" level="h2">
            <div className="flex flex-col">
              {contact.map((item) => (
                <InfoLine key={item.text} item={item} />
              ))}
            </div>
          </Section>

          <Section title="Interests" level="h2">
            <div className="flex flex-col">
              {interests.map((item) => (
                <InfoLine key={item.text} item={item} />
              ))}
            </div>
          </Section>

          <Section title="Languages" level="h2">
            <div className="flex flex-col">
              {languages.map((item) => (
                <InfoLine key={item.text} item={item} />
              ))}
            </div>
          </Section>
        </aside>

        {/* Main column */}
        <div className="flex min-w-0 flex-col gap-9">
          <Callout>
            <RichText lines={intro} />
          </Callout>

          <Section title="Work History" level="h1">
            <div className="flex flex-col gap-5">
              {work.map((entry) => (
                <ResumeItem key={entry.title} entry={entry} />
              ))}
            </div>
          </Section>

          <Section title="Education" level="h1">
            <div className="flex flex-col gap-5">
              {education.map((entry) => (
                <ResumeItem key={entry.title} entry={entry} />
              ))}
            </div>
          </Section>

          <Section title="Projects" level="h1">
            <ProjectGallery />
          </Section>

          <Section title="Skills" level="h1">
            <SkillsGallery />
          </Section>
        </div>
      </div>
    </main>
  );
}
