import Image from "next/image";

import { NotionTopBar } from "@/components/notion/topbar";
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
    <div className="min-h-screen bg-white">
      <NotionTopBar />

      {/* Cover image (full-bleed) */}
      <div className="relative h-[clamp(140px,15.5vw,240px)] w-full overflow-hidden">
        <Image
          src={profile.cover}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Page body */}
      <main className="mx-auto max-w-[960px] px-6 pb-28 sm:px-12">
        {/* Page icon, overlapping the cover */}
        <div className="relative z-10 -mt-[34px] mb-2 w-fit">
          <CloudyOrangeIcon size={66} />
        </div>

        <h1 className="mb-8 text-[40px] leading-[1.15] font-bold tracking-[-0.02em]">
          {profile.name}
        </h1>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-x-[42px] gap-y-10 md:grid-cols-[210px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="flex flex-col gap-8">
            <div className="overflow-hidden rounded-[8px]">
              <Image
                src={profile.photo}
                alt={profile.photoAlt}
                width={384}
                height={488}
                priority
                className="h-auto w-full object-cover"
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
          <div className="flex min-w-0 flex-col gap-10">
            <Callout>
              <RichText lines={intro} />
            </Callout>

            <Section title="Work History" level="h1">
              <div className="flex flex-col gap-6">
                {work.map((entry) => (
                  <ResumeItem key={entry.title} entry={entry} />
                ))}
              </div>
            </Section>

            <Section title="Education" level="h1">
              <div className="flex flex-col gap-6">
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
    </div>
  );
}
