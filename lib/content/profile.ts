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
  /* Tagline above the name in the cover banner and on the social card. */
  tagline: t("Freiberuflich · Remote · München", "Freelance · Remote · Munich"),
};

export const cvFiles = [
  {
    href: "/cv/CV_Nikita_Petrich_DE.pdf",
    label: t("CV Deutsch", "CV German"),
    flag: "/assets/flags/de.svg",
    sub: t("PDF · 10 Seiten", "PDF · 10 pages"),
  },
  {
    href: "/cv/CV_Nikita_Petrich_EN.pdf",
    label: t("CV Englisch", "CV English"),
    flag: "/assets/flags/gb.svg",
    sub: t("PDF · 10 Seiten", "PDF · 10 pages"),
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
    value: t("7+ Jahre", "7+ years"),
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
    sub: t("B2 · US/EU-Remote", "B2 · US/EU remote"),
  },
];

export const approach = [
  t("ergebnisorientiert", "results-driven"),
  t("eigenverantwortlich & zuverlässig", "self-directed & dependable"),
  t("autonome, asynchrone Arbeitsweise", "autonomous, asynchronous working style"),
  t("klare Kommunikation (DE/EN)", "clear communication (DE/EN)"),
];

/* Methods actually used in the projects (see each project's "Methodik"),
   mirrored from the "Methodik & Zusammenarbeit" skill category so the
   sidebar and the skills database never claim different things. */
export const methods = [
  "Scrum",
  "Scrumban",
  "Kanban",
  t("Code Reviews", "Code reviews"),
  "Requirements Engineering",
];

export const profileLinks = [
  { label: "Website", href: "https://sequenz.io" },
  { label: "LinkedIn", href: "https://linkedin.com/in/nikita-petrich" },
  { label: "GitHub", href: "https://github.com/nikita-petrich" },
  { label: "freelancermap", href: "https://www.freelancermap.de/profil/nikita-petrich" },
  { label: "Malt", href: "https://www.malt.de/profile/nikitapetrich" },
];

/* Bold marks the proof points (the guiding principle, the concrete numbers and
   the lead technologies), matching how the rest of the page emphasises facts. */
export const intro: RichLine[] = [
  [
    {
      t: t(
        "Ich bin freiberuflicher Senior Full-Stack & AI Engineer mit Schwerpunkt auf KI: ",
        "I'm a freelance Senior Full-Stack & AI Engineer focused on AI: ",
      ),
    },
    {
      t: t(
        "LLM-Integration, RAG und KI-gestützte Automatisierung",
        "LLM integration, RAG and AI-driven automation",
      ),
      b: true,
    },
    {
      t: t(
        " – von der Architektur bis zum stabilen Produktivbetrieb.",
        " – from architecture all the way to stable production.",
      ),
    },
  ],
  [
    { t: t("Mein Leitsatz: ", "My guiding principle: ") },
    {
      t: t(
        "Was zweimal manuell passiert, wird automatisiert.",
        "anything done manually twice gets automated.",
      ),
      b: true,
    },
    {
      t: t(
        " Das gilt für die Prozesse meiner Kunden genauso wie für meine eigene Arbeit. In der Logistik spart ein von mir gebautes Tourverwaltungssystem ",
        " That applies to my clients' processes as much as to my own work. In logistics, a route management system I built saves ",
      ),
    },
    { t: t("bis zu 1.000 Stunden pro Jahr", "up to 1,000 hours a year"), b: true },
    {
      t: t(
        " durch automatisierte Dokumentenprozesse, im Handel ",
        " through automated document workflows; in retail, ",
      ),
    },
    {
      t: t(
        "bis zu 40 Stunden Verwaltungsarbeit pro Monat",
        "up to 40 hours of admin work per month",
      ),
      b: true,
    },
    {
      t: t(
        ", im Notariat sinken die telefonischen Rückfragen der Mandanten um ",
        "; at a notary's office, client phone enquiries dropped by ",
      ),
    },
    { t: t("bis zu 70 %", "up to 70%"), b: true },
    { t: "." },
  ],
  [
    {
      t: t(
        "Dieselbe Konsequenz wende ich auf die Entwicklung selbst an: Ich arbeite durchgängig mit ",
        "I apply the same logic to development itself. I work consistently with ",
      ),
    },
    {
      t: t(
        "Agentic-Coding- und AI-Engineering-Workflows",
        "agentic coding and AI engineering workflows",
      ),
      b: true,
    },
    {
      t: t(
        " (Claude Code, Cursor, Code Rabbit, MCP) – spezifikationsgetrieben, mit KI-gestützter Testgenerierung und agentischen Review-Prozessen. Das ist keine Spielerei, sondern der Grund für außergewöhnliches Tempo bei gleichbleibender Qualität: Eine vollständige Cross-Platform-App ",
        " (Claude Code, Cursor, Code Rabbit, MCP) – spec-driven, with AI-assisted test generation and agentic review processes. This isn't a gimmick, it's the reason for unusual speed at consistent quality: a complete cross-platform app built and handed over ",
      ),
    },
    {
      t: t("innerhalb von rund zwei Monaten", "in roughly two months"),
      b: true,
    },
    {
      t: t(
        " entwickelt und übergeben – als alleiniger Entwickler.",
        " – as the sole developer.",
      ),
    },
  ],
  [
    { t: t("Wie ich arbeite: ", "How I work: ") },
    {
      t: t(
        "eigenverantwortlich, remote und asynchron",
        "independently, remote and asynchronously",
      ),
      b: true,
    },
    {
      t: t(
        ". Ich brauche keine tägliche Steuerung, sondern ein klares Ziel – den Weg dorthin schneide ich selbst zu und melde mich, bevor etwas ins Rutschen kommt. Entscheidungen dokumentiere ich, Code kommt getestet und review-fähig, und ich sage früh, wenn eine Anforderung technisch teurer wird als gedacht. Kommunikation auf Deutsch und Englisch.",
        ". I don't need daily direction, just a clear goal – I'll figure out the path there myself and speak up before anything slips. I document decisions, ship tested and review-ready code, and flag early when a requirement turns out to be technically more expensive than expected. I communicate in German and English.",
      ),
    },
  ],
  [
    { t: t("Technisch: ", "Technically: ") },
    { t: t("TypeScript und Python", "TypeScript and Python"), b: true },
    {
      t: t(
        ", Backend mit NestJS, Node.js und FastAPI, Frontend mit Next.js, React und Angular, dazu PostgreSQL, Docker, CI/CD und Cloud auf Azure oder GCP. Clean Architecture und Microservices sind Standard, ",
        ", backends with NestJS, Node.js and FastAPI, frontends with Next.js, React and Angular, plus PostgreSQL, Docker, CI/CD and cloud on Azure or GCP. Clean Architecture and microservices are standard; ",
      ),
    },
    {
      t: t(
        "DSGVO-Konformität und Secure by Design",
        "GDPR compliance and Secure by Design",
      ),
      b: true,
    },
    { t: t(" denke ich von Beginn an mit.", " are built in from day one.") },
  ],
  [
    { t: t("Erprobt ist das im ", "I've done this inside a ") },
    {
      t: t("20-köpfigen Engineering-Team", "20-person engineering team"),
      b: true,
    },
    {
      t: t(
        " – zuletzt an einer KI-gestützten LegalTech-Plattform mit ",
        " – most recently on an AI-powered LegalTech platform with ",
      ),
    },
    { t: t("über 3.000 Kunden", "more than 3,000 customers"), b: true },
    {
      t: t(
        " – ebenso wie als alleiniger Entwickler mit voller Produktverantwortung. In ",
        " – and as a sole developer with full product ownership. Over ",
      ),
    },
    { t: t("über sieben Jahren", "seven years"), b: true },
    {
      t: t(
        " quer durch LegalTech, HealthTech, E-Commerce, EdTech und Logistik.",
        " across LegalTech, HealthTech, e-commerce, EdTech and logistics.",
      ),
    },
  ],
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
  { id: "languages", label: t("Sprachen", "Languages"), level: 2 as const },
  { id: "approach", label: t("Arbeitsweise", "Ways of working"), level: 2 as const },
  { id: "focus", label: t("Schwerpunkt", "Focus"), level: 1 as const },
  { id: "projects", label: t("Projekte", "Projects"), level: 1 as const },
  { id: "references", label: t("Referenzen", "Testimonials"), level: 1 as const },
  { id: "skills", label: t("Skills", "Skills"), level: 1 as const },
  { id: "certificates", label: t("Zertifikate", "Certificates"), level: 1 as const },
];

/* Description of the site itself — metadata, social card, JSON-LD. */
export const siteDescription = t(
  "Freiberuflicher Senior Full-Stack & AI Engineer mit Schwerpunkt LLM-Integration, RAG und KI-gestützter Automatisierung. Über 7 Jahre Erfahrung in LegalTech, HealthTech, E-Commerce, EdTech und Logistik.",
  "Freelance Senior Full-Stack & AI Engineer focused on LLM integration, RAG and AI-assisted automation. More than 7 years of experience in LegalTech, HealthTech, e-commerce, EdTech and logistics.",
);
