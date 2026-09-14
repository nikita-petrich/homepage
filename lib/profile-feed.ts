import {
  getContent,
  type Content,
  type IntroLine,
  type Project,
  type RichLine,
} from "./data";
import type { Locale } from "./i18n/config";
import {
  availability,
  bookingUrlFor,
  contactEmail,
  contactPhone,
  profileLocation,
  profileName,
  profileRole,
  rate,
  siteUrl,
  vatId,
} from "./profile";

/* The machine-readable twin of the profile page.
 *
 * Same content, rendered as markdown instead of React. It exists because an
 * agent reading this profile — project-pilot, which judges freelance listings
 * against it and drafts the applications — should not have to parse a styled
 * page, and must never be handed a second, hand-maintained copy that drifts
 * away from the real one. Everything here is derived from `getContent(locale)`,
 * so a change to lib/content/* reaches the twin in the same commit or not at
 * all.
 *
 * Served at /de.md and /en.md, siblings of /de and /en, with /llms.txt as the
 * signpost. The figures a sentence cannot carry precisely — the date available
 * from, the capacity, the hourly rate as a number — are the job of
 * /api/profile.json, not of prose.
 */

const HEADING: Record<Locale, Record<string, string>> = {
  de: {
    about: "Über mich",
    facts: "Eckdaten",
    languages: "Sprachen",
    methods: "Methodik",
    approach: "Arbeitsweise",
    focus: "Schwerpunkt",
    skills: "Skills",
    projects: "Referenzprojekte",
    testimonials: "Referenzen",
    certificates: "Zertifikate",
    profiles: "Profile",
    signature: "Kontakt & Signatur",
    role: "Rolle",
    period: "Zeitraum",
    client: "Kunde",
    tech: "Tech-Stack",
    tasks: "Aufgaben",
    results: "Ergebnis",
    outlook: "Ziel",
    page: "Projektseite",
    booking: "Erstgespräch (30 Min.)",
    source: "Quelle",
  },
  en: {
    about: "About me",
    facts: "Key facts",
    languages: "Languages",
    methods: "Methodology",
    approach: "Ways of working",
    focus: "Focus",
    skills: "Skills",
    projects: "Reference projects",
    testimonials: "Testimonials",
    certificates: "Certificates",
    profiles: "Profiles",
    signature: "Contact & signature",
    role: "Role",
    period: "Period",
    client: "Client",
    tech: "Tech stack",
    tasks: "Responsibilities",
    results: "Outcome",
    outlook: "Target",
    page: "Project page",
    booking: "Intro call (30 min)",
    source: "Source",
  },
};

/** One rich-text line with its bold runs carried over as markdown. */
function richLine(spans: RichLine): string {
  return spans
    .map((span) => (span.b ? `**${span.t.trim()}**` : span.t))
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

function intro(lines: IntroLine[]): string[] {
  return lines.map((line) => richLine(line.spans));
}

function factLines(facts: Content["facts"]): string[] {
  return facts.map((fact) => {
    const details = (fact.details ?? [])
      .map((detail) => `${detail.key}: ${detail.value}`)
      .join(" · ");
    return `- **${fact.label}:** ${fact.value}${details ? ` (${details})` : ""}`;
  });
}

function projectBlock(project: Project, locale: Locale): string[] {
  const h = HEADING[locale];
  const lines = [
    `### ${project.num} · ${project.name} — ${project.subtitle}`,
    "",
    `- **${h.period}:** ${project.dateRange}`,
    `- **${h.role}:** ${project.role}`,
  ];
  if (project.company) lines.push(`- **${h.client}:** ${project.company}`);
  for (const cell of project.meta) {
    const value = Array.isArray(cell.value) ? cell.value.join(" · ") : cell.value;
    lines.push(`- **${cell.label}:** ${value}`);
  }
  lines.push(`- **${h.tech}:** ${project.tech.join(", ")}`);
  lines.push(`- **${h.page}:** ${siteUrl}/${locale}/projects/${project.slug}`);
  lines.push("", project.desc, "");
  lines.push(`**${h.tasks}**`, "");
  lines.push(...project.responsibilities.map((item) => `- ${item}`));
  lines.push("", `**${h.results}**`, "");
  lines.push(...project.results.map((item) => `- ${item}`));
  if (project.outlook?.length) {
    lines.push("", `**${h.outlook}**`, "");
    lines.push(...project.outlook.map((item) => `- ${item}`));
  }
  return lines;
}

/* The values an application's signature block is built from. They are the same
   in both languages except the booking link and the location line, so they are
   listed as labelled pairs rather than woven into prose: a generator copying
   them must not have to guess where a value ends. */
function signature(locale: Locale): string[] {
  return [
    `- **Name:** ${profileName}`,
    `- **Title:** ${profileRole}`,
    `- **Phone:** ${contactPhone}`,
    `- **Email:** ${contactEmail}`,
    `- **Web:** ${siteUrl}`,
    `- **Booking:** ${bookingUrlFor(locale)}`,
    `- **Location:** ${profileLocation[locale]}`,
    `- **VAT ID:** ${vatId}`,
  ];
}

export function profileMarkdown(locale: Locale): string {
  const content = getContent(locale);
  const h = HEADING[locale];
  const lines: string[] = [
    `# ${content.profile.name} — ${content.profile.role}`,
    "",
    content.profile.slogan,
    "",
    `${h.source}: ${siteUrl}/${locale}`,
    "",
    `## ${h.about}`,
    "",
    ...intro(content.intro).flatMap((paragraph) => [paragraph, ""]),
    `## ${h.facts}`,
    "",
    ...factLines(content.facts),
    "",
    `## ${h.languages}`,
    "",
    ...content.languages.map((language) => `- **${language.text}:** ${language.sub}`),
    "",
    `## ${h.methods}`,
    "",
    content.methods.join(" · "),
    "",
    `## ${h.approach}`,
    "",
    ...content.approach.map((item) => `- ${item}`),
    "",
    `## ${h.focus}`,
    "",
    content.focus.join(" · "),
    "",
    `## ${h.skills}`,
    "",
  ];

  for (const category of content.skills) {
    lines.push(`### ${category.num} · ${category.name}`, "", category.items.join(", "), "");
  }

  lines.push(`## ${h.projects}`, "");
  for (const project of content.projects) {
    lines.push(...projectBlock(project, locale), "");
  }

  lines.push(`## ${h.testimonials}`, "");
  for (const reference of content.references) {
    const who = [reference.name, reference.role, reference.company]
      .filter(Boolean)
      .join(" · ");
    lines.push(`- **${who}** (${reference.project}): „${reference.short}“`);
  }

  lines.push("", `## ${h.certificates}`, "");
  for (const certificate of content.certificates) {
    lines.push(
      `- ${certificate.title} — ${certificate.issuer}, ${certificate.date}` +
        (certificate.detail ? ` (${certificate.detail})` : ""),
    );
  }

  lines.push("", `## ${h.profiles}`, "");
  for (const link of content.profileLinks) {
    lines.push(`- ${link.label}: ${link.href}`);
  }

  lines.push("", `## ${h.signature}`, "", ...signature(locale), "");

  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`;
}

/* The facts prose carries imprecisely.
 *
 * A sentence can say "immediately, full time, remote with occasional on-site";
 * it cannot be read back as a number by anything that has to fill in a
 * "capacity %" field or compare a rate against a budget. This is that half of
 * the profile: figures, dates and the two ready-made sentences that quote them,
 * so a generator never has to assemble one and get the units wrong.
 */
export type ProfileFeed = ReturnType<typeof profileJson>;

export function profileJson() {
  return {
    name: profileName,
    role: profileRole,
    site: siteUrl,
    markdown: {
      de: `${siteUrl}/de.md`,
      en: `${siteUrl}/en.md`,
    },
    availability: {
      from: availability.from,
      capacity_percent: availability.capacityPercent,
      onsite_max_percent: availability.onsiteMaxPercent,
      employee_leasing: availability.employeeLeasing,
    },
    rate: {
      currency: "EUR",
      /* "from", never "fixed": the scope decides the rest, and a figure read as
         a fixed price is worse than no figure at all. */
      basis: "from",
      hourly: rate.hourlyEur,
      daily: rate.dailyEur,
      label: rate.label,
    },
    languages: [
      { code: "de", level: "native" },
      { code: "en", level: "B2" },
    ],
    contact: {
      email: contactEmail,
      phone: contactPhone,
      web: siteUrl,
      booking: { de: bookingUrlFor("de"), en: bookingUrlFor("en") },
    },
    location: profileLocation,
    vat_id: vatId,
    sentences: {
      availability: {
        de:
          `Der Projektstart wäre ab sofort in Vollzeit (${availability.capacityPercent} %, ` +
          `davon maximal ${availability.onsiteMaxPercent} % vor Ort) möglich.`,
        en:
          `I would be available to start immediately, working full-time ` +
          `(${availability.capacityPercent} %, of which at most ` +
          `${availability.onsiteMaxPercent} % on-site).`,
      },
      rate: {
        de:
          `Mein Honorar beginnt bei ${rate.hourlyEur} € pro Stunde bzw. ` +
          `${rate.dailyEur} € pro Tag und hängt vom konkreten Projektzuschnitt ab.`,
        en:
          `My rate starts at €${rate.hourlyEur} per hour or €${rate.dailyEur} per day, ` +
          `depending on the scope of the project.`,
      },
    },
  };
}
