import { experienceYears, experienceYearsPlus } from "@/lib/experience";
import { t } from "@/lib/i18n/text";
import { accentColor, bookingUrl, profileName } from "@/lib/profile";

/* Identity, sidebar and hero content. Every visible string carries both
   languages via t(); anything without it (names, URLs, technologies) is
   identical in German and English by nature. */

export type Span = { t: ReturnType<typeof t> | string; b?: boolean };
export type RichLine = Span[];

export const profile = {
  name: profileName,
  /* The freelance status is part of how the role is presented — the neutral
     `profileRole` stays the machine-readable jobTitle in the schema.org markup. */
  role: t(
    "Freiberuflicher Senior Full-Stack & AI Engineer",
    "Freelance Senior Full-Stack & AI Engineer",
  ),
  booking: bookingUrl,
  accent: accentColor,
  /* The guiding principle, quoted under the role in the cover banner the way
     the CV quotes it under the name. The intro spells it out again in full. */
  slogan: t(
    "„Was zweimal manuell passiert, wird automatisiert“",
    "“Anything done manually twice gets automated”",
  ),
};

/* The page count used to be the subtitle here. Ten pages is not a selling
   point — it is a warning — so the line says what the file is instead. */
export const cvFiles = [
  {
    /* `lang` rather than reading the language back out of the file name: the
       menu tags its analytics with it, and a rename should not silently
       relabel every download. */
    lang: "de",
    href: "/cv/CV-German.pdf",
    label: t("CV Deutsch", "CV German"),
    flag: "/assets/flags/de.svg",
    sub: t("PDF · zum Weiterleiten", "PDF · ready to forward"),
  },
  {
    lang: "en",
    href: "/cv/CV-English.pdf",
    label: t("CV Englisch", "CV English"),
    flag: "/assets/flags/gb.svg",
    sub: t("PDF · zum Weiterleiten", "PDF · ready to forward"),
  },
];

export const contact = [
  { icon: "phone", text: "+49 15679088678", href: "tel:+4915679088678" },
  { icon: "mail", text: "n.petrich@sequenz.io", href: "mailto:n.petrich@sequenz.io" },
  { icon: "globe", text: "https://sequenz.io", href: "https://sequenz.io" },
];

/* A fact is one headline value. `details` carries the qualifiers that narrow
   it down ("Remote — but on-site how often?"): they are rendered as a small
   bulleted key/value list under the value, so the 210px sidebar keeps one
   answer per fact instead of three equally loud lines that wrap into each
   other. The type is spelled out rather than inferred so `details` stays
   optional across the array. */
type Fact = {
  label: ReturnType<typeof t>;
  /** Key into FACT_ICONS in components/notion/blocks.tsx. */
  icon: string;
  value: ReturnType<typeof t>;
  details?: { key: ReturnType<typeof t>; value: ReturnType<typeof t> }[];
};

export const facts: Fact[] = [
  {
    label: t("Erfahrung", "Experience"),
    icon: "briefcase",
    /* Derived from the start date (lib/experience.ts), not maintained by hand. */
    value: t(`${experienceYearsPlus} Jahre`, `${experienceYearsPlus} years`),
  },
  {
    label: t("Verfügbar", "Availability"),
    icon: "calendar-check",
    value: t("ab sofort · Vollzeit", "immediately · full time"),
  },
  {
    label: t("Stundensatz", "Rate"),
    icon: "wallet",
    value: t("auf Anfrage", "on request"),
  },
  {
    label: t("Qualifikation", "Qualification"),
    icon: "graduation-cap",
    value: t("IHK-Fachinformatiker (Köln)", "IHK-certified IT specialist (Cologne)"),
  },
  {
    label: t("Einsatzort", "Location"),
    icon: "map-pin",
    value: t("Remote (bevorzugt)", "Remote (preferred)"),
    details: [
      {
        key: t("Vor Ort", "On-site"),
        value: t("München · 1–2 Tage/Woche", "Munich · 1–2 days/week"),
      },
      {
        key: t("Fernreisen", "Long-distance travel"),
        value: t("1–2 Tage/Monat (bei Bedarf)", "1–2 days/month (if needed)"),
      },
    ],
  },
  {
    label: t("Onboarding", "Onboarding"),
    icon: "handshake",
    value: t("Anreise vor Ort (bei Bedarf)", "on-site at the start (if needed)"),
  },
];

export const languages = [
  {
    flag: "/assets/flags/de.svg",
    text: t("Deutsch", "German"),
    sub: t("Nativ", "Native"),
  },
  {
    flag: "/assets/flags/gb.svg",
    text: t("Englisch", "English"),
    /* Three things in ~45 characters: the competency, that the level is
       assessed rather than self-declared, and the field evidence. The full
       version — meetings, presentations, negotiations — spelled the syllabus
       out and wrapped to five underlined lines in the 210px sidebar, against
       this component's own warning; it is one click away on the certificate.
       "US-Projekt" earns its place over the syllabus: five months of
       English-only work with a New York client outweighs a course outline. */
    sub: t(
      "Business English · B2 zertifiziert · US-Projekt",
      "Business English · B2 certified · US engagement",
    ),
    href: "/certificates/english-radar-business-english",
  },
];

export const approach = [
  t("ergebnisorientiert", "results-driven"),
  t("eigenverantwortlich & zuverlässig", "self-directed & dependable"),
  t("autonome, asynchrone Arbeitsweise", "autonomous, asynchronous working style"),
  t("klare Kommunikation (DE/EN)", "clear communication (DE/EN)"),
];

/* Methods actually used in the projects (see each project's "Methodik" and
   tech list), mirrored from the "Vorgehen & Methodik" skill category so the
   sidebar and the skills database never claim different things.

   Only what the heading promises: process models, plus Requirements
   Engineering, which category 12 files here too. Code reviews and CI/CD used
   to sit in this list and do not belong under "Methodik" — the first is an
   engineering practice, the second reads as a pipeline. Both stay on the page
   elsewhere: CI/CD in the focus tags and the skills database, code reviews in
   the skills database. */
export const methods = ["Scrum", "Scrumban", "Kanban", "Requirements Engineering"];

export const profileLinks = [
  { label: "Website", href: "https://sequenz.io" },
  { label: "LinkedIn", href: "https://linkedin.com/in/nikita-petrich" },
  { label: "GitHub", href: "https://github.com/nikita-petrich" },
  { label: "freelancermap", href: "https://www.freelancermap.de/profil/nikita-petrich" },
  { label: "Malt", href: "https://www.malt.de/profile/nikitapetrich" },
];

/* The "about" block. Five paragraphs: positioning, the guiding principle with
   the proof numbers behind it, how that principle applies to the development
   itself, the way of working, and the track record. Bold marks what a skimming
   reader should come away with — the role, the principle, the savings and the
   scale figures. The closing question and the booking button under the callout
   carry the CTA, so the text itself stops after the track record. */
export type IntroLine = { spans: RichLine };

export const intro: IntroLine[] = [
  {
    spans: [
      { t: t("Ich bin ", "I am a ") },
      {
        t: t(
          "freiberuflicher Senior Full-Stack & AI Engineer",
          "freelance Senior Full-Stack & AI Engineer",
        ),
        b: true,
      },
      { t: t(" mit Schwerpunkt auf ", " focused on ") },
      {
        t: t(
          "KI: LLM-Integration, RAG und KI-gestützter Automatisierung",
          "AI: LLM integration, RAG and AI-assisted automation",
        ),
        b: true,
      },
      { t: t(" – von der Architektur bis zum ", " – from architecture through to ") },
      { t: t("stabilen Produktivbetrieb", "stable production operation"), b: true },
      { t: "." },
    ],
  },
  {
    spans: [
      /* Label and principle are one bold run: the markdown marks both, and two
         adjacent <strong>s would render identically anyway. */
      {
        t: t(
          "Mein Leitsatz: Was zweimal manuell passiert, wird automatisiert.",
          "My guiding principle: anything done manually twice gets automated.",
        ),
        b: true,
      },
      {
        t: t(
          " Das gilt für die Prozesse meiner Kunden genauso wie für meine eigene Arbeit. In der ",
          " That applies to my clients' processes just as much as to my own work. In ",
        ),
      },
      { t: t("Logistik", "logistics"), b: true },
      {
        t: t(
          " spart ein von mir entwickeltes Tourverwaltungssystem bis zu ",
          ", a route management system I built saves up to ",
        ),
      },
      {
        t: t(
          "1.000 Stunden pro Mitarbeiter und Jahr",
          "1,000 hours per employee per year",
        ),
        b: true,
      },
      {
        t: t(
          " durch automatisierte Dokumentenprozesse, im ",
          " through automated document processes; in ",
        ),
      },
      { t: t("Handel", "retail"), b: true },
      { t: t(" bis zu ", ", up to ") },
      {
        t: t(
          "40 Stunden Verwaltungsaufwand pro Monat",
          "40 hours of administrative work per month",
        ),
        b: true,
      },
      { t: t(", im ", "; at a ") },
      { t: t("Notariat", "notary's office"), b: true },
      {
        t: t(
          " sinken telefonische Rückfragen der Mandanten um bis zu ",
          ", clients' phone enquiries drop by up to ",
        ),
      },
      { t: "70 %", b: true },
      { t: "." },
    ],
  },
  {
    spans: [
      {
        t: t(
          "Auch meine Entwicklung folgt diesem Prinzip: Ich arbeite mit ",
          "My own development follows the same principle: I work with ",
        ),
      },
      {
        t: t(
          "modernen Agentic-Coding- und AI-Engineering-Workflows",
          "modern agentic coding and AI engineering workflows",
        ),
        b: true,
      },
      { t: t(" – ", " – ") },
      {
        t: t(
          "spezifikationsgetrieben, KI-gestützt und mit automatisierten Tests und Reviews",
          "spec-driven, AI-assisted and with automated tests and reviews",
        ),
        b: true,
      },
      { t: t(". Das ermöglicht ", ". That gives me ") },
      {
        t: t(
          "hohe Umsetzungsgeschwindigkeit bei gleichbleibender Qualität",
          "high delivery speed at consistent quality",
        ),
        b: true,
      },
      { t: t(", ohne Kompromisse bei ", ", with no compromise on ") },
      {
        t: t(
          "Wartbarkeit, Nachvollziehbarkeit und Stabilität",
          "maintainability, traceability and stability",
        ),
        b: true,
      },
      { t: "." },
    ],
  },
  {
    spans: [
      { t: t("Ich arbeite ", "I work ") },
      {
        t: t(
          "eigenverantwortlich, remote und asynchron",
          "independently, remotely and asynchronously",
        ),
        b: true,
      },
      {
        t: t(
          ". Ein klares Ziel genügt – den Weg dorthin strukturiere ich selbst. ",
          ". A clear goal is enough – I structure the path there myself. ",
        ),
      },
      {
        t: t(
          "Entscheidungen dokumentiere ich, Code kommt getestet und review-fähig",
          "I document decisions, code arrives tested and ready for review",
        ),
        b: true,
      },
      {
        t: t(
          ", und technische Risiken spreche ich früh an. Kommunikation auf ",
          ", and I raise technical risks early. Communication in ",
        ),
      },
      { t: t("Deutsch und Englisch", "German and English"), b: true },
      { t: "." },
    ],
  },
  {
    spans: [
      { t: t("Über ", "More than ") },
      {
        t: t(
          `${experienceYears} Jahre Erfahrung`,
          `${experienceYears} years of experience`,
        ),
        b: true,
      },
      { t: t(" in ", " in ") },
      {
        t: t(
          "LegalTech, HealthTech, E-Commerce, EdTech und Logistik",
          "LegalTech, HealthTech, e-commerce, EdTech and logistics",
        ),
        b: true,
      },
      { t: t(" – sowohl als Teil eines ", " – both as part of a ") },
      {
        t: t("20-köpfigen Engineering-Teams", "20-strong engineering team"),
        b: true,
      },
      { t: t(" an einer ", " on an ") },
      {
        t: t(
          "KI-gestützten LegalTech-Plattform mit über 3.000 Kunden",
          "AI-assisted LegalTech platform with more than 3,000 customers",
        ),
        b: true,
      },
      { t: t(" als auch als ", " and as the ") },
      {
        t: t(
          "alleiniger Entwickler mit Verantwortung für Architektur, Betrieb und Weiterentwicklung",
          "sole developer responsible for architecture, operations and further development",
        ),
        b: true,
      },
      { t: "." },
    ],
  },
];

/* The chips in the cover banner — the first technical claim a visitor reads,
   above the fold and before the sidebar. They used to be plain strings living
   in the component, which left the English hero opening with the untranslated
   "DSGVO-konform"; they are localised content like everything else now.

   Deliberately a short list, and deliberately not the same list as `focus`
   below: the banner has one row of space, so it carries the specialism and the
   two stack halves, and `focus` carries the full picture. */
export const bannerTags = [
  /* Translated, like the same term two blocks down in `focus` — the German
     spelling was left standing in the hero's very first chip. */
  t("LLM-Integration", "LLM integration"),
  "RAG",
  t("KI-Engineering", "AI engineering"),
  "Agentic Coding",
  "TypeScript",
  "Python",
  "Backend (NestJS · Node.js · FastAPI)",
  "Frontend (Next.js · React · Angular)",
  "Clean Architecture",
  t("DSGVO-konform", "GDPR-compliant"),
];

export const focus = [
  t("LLM-Integration", "LLM integration"),
  "RAG",
  t("KI-gestützte Automatisierung", "AI-assisted automation"),
  "Agentic Coding / AI-Engineering",
  "TypeScript",
  "Python",
  "Backend (NestJS · Node.js · FastAPI)",
  "Frontend (Next.js · React · Angular)",
  "PostgreSQL",
  "Clean Architecture",
  "Microservices",
  "CI/CD",
  "Docker",
  t("DSGVO-konforme KI-Architektur", "GDPR-compliant AI architecture"),
];

/* Headings for the floating table-of-contents navigation. */
export const sections = [
  { id: "contact", label: t("Kontakt", "Contact"), level: 2 as const },
  { id: "facts", label: t("Eckdaten", "Key facts"), level: 2 as const },
  /* Both of these render on the page and were missing from this list, so the
     navigation skipped them. "Profile" matters most: the platform links
     (LinkedIn, GitHub, freelancermap, Malt) are the fastest route from here to
     somewhere a recruiter can already message him. */
  { id: "profiles", label: t("Profile", "Profiles"), level: 2 as const },
  { id: "methods", label: t("Methodik", "Methodology"), level: 2 as const },
  { id: "languages", label: t("Sprachen", "Languages"), level: 2 as const },
  { id: "approach", label: t("Arbeitsweise", "Ways of working"), level: 2 as const },
  { id: "focus", label: t("Schwerpunkt", "Focus"), level: 1 as const },
  { id: "projects", label: t("Projekte", "Projects"), level: 1 as const },
  { id: "references", label: t("Referenzen", "Testimonials"), level: 1 as const },
  { id: "skills", label: t("Skills", "Skills"), level: 1 as const },
  { id: "certificates", label: t("Zertifikate", "Certificates"), level: 1 as const },
  {
    id: "contact-cta",
    label: t("Zusammenarbeit", "Working together"),
    level: 1 as const,
  },
];

/* Description of the site itself — metadata, social card, JSON-LD. */
export const siteDescription = t(
  `Freiberuflicher Senior Full-Stack & AI Engineer mit Schwerpunkt LLM-Integration, RAG und KI-gestützter Automatisierung. Über ${experienceYears} Jahre Erfahrung in LegalTech, HealthTech, E-Commerce, EdTech und Logistik.`,
  `Freelance Senior Full-Stack & AI Engineer focused on LLM integration, RAG and AI-assisted automation. More than ${experienceYears} years of experience in LegalTech, HealthTech, e-commerce, EdTech and logistics.`,
);
