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

/* Methods actually used in the projects (see each project's "Methodik" and
   tech list), mirrored from the "Vorgehen & Methodik" and
   "Engineering-Praktiken" skill categories so the sidebar and the skills
   database never claim different things. Process models first, then the
   practices that run inside them — the same split the categories make. */
export const methods = [
  "Scrum",
  "Scrumban",
  "Kanban",
  "Requirements Engineering",
  t("Code Reviews", "Code reviews"),
  "CI/CD",
];

export const profileLinks = [
  { label: "Website", href: "https://sequenz.io" },
  { label: "LinkedIn", href: "https://linkedin.com/in/nikita-petrich" },
  { label: "GitHub", href: "https://github.com/nikita-petrich" },
  { label: "freelancermap", href: "https://www.freelancermap.de/profil/nikita-petrich" },
  { label: "Malt", href: "https://www.malt.de/profile/nikitapetrich" },
];

/* The "about" block. Each line makes one point: focus, guiding principle, way
   of building, way of working, stack, track record. Bold marks the proof
   points — the principle, the concrete numbers and the lead technologies.
   Kept short on purpose: the
   projects and the CV carry the detail, this block only has to make a reader
   want them. */
export type IntroLine = { spans: RichLine };

export const intro: IntroLine[] = [
  {
    spans: [
      { t: t("Schwerpunkt auf KI: ", "Focused on AI: ") },
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
  },
  {
    spans: [
      { t: t("Mein Leitsatz: ", "My guiding principle: ") },
      {
        t: t(
          "Was zweimal manuell passiert, wird automatisiert.",
          "anything done manually twice gets automated.",
        ),
        b: true,
      },
      { t: t(" In der Logistik sind das ", " In logistics that means ") },
      {
        t: t(
          "bis zu 1.000 Stunden pro Mitarbeiter und Jahr",
          "up to 1,000 hours per employee per year",
        ),
        b: true,
      },
      { t: t(", im Handel ", "; in retail, ") },
      { t: t("bis zu 40 Stunden pro Monat", "up to 40 hours a month"), b: true },
      { t: t(", im Notariat ", "; at a notary's office, ") },
      { t: t("bis zu 70 %", "up to 70 %"), b: true },
      {
        t: t(
          " weniger telefonische Rückfragen.",
          " fewer phone enquiries.",
        ),
      },
    ],
  },
  {
    spans: [
      { t: t("Durchgängig ", "I work consistently with ") },
      {
        t: t(
          "Agentic-Coding- und AI-Engineering-Workflows",
          "agentic coding and AI engineering workflows",
        ),
        b: true,
      },
      {
        t: t(
          " (Claude Code, Cursor, Code Rabbit, MCP) – spezifikationsgetrieben, mit KI-gestützter Testgenerierung. Das Ergebnis: eine vollständige Cross-Platform-App ",
          " (Claude Code, Cursor, Code Rabbit, MCP) – spec-driven, with AI-assisted test generation. The result: a complete cross-platform app ",
        ),
      },
      { t: t("in rund zwei Monaten", "in roughly two months"), b: true },
      { t: t(", als alleiniger Entwickler.", ", as the sole developer.") },
    ],
  },
  {
    spans: [
      {
        t: t(
          "Eigenverantwortlich, remote und asynchron.",
          "Independently, remote and asynchronously.",
        ),
        b: true,
      },
      {
        t: t(
          " Ich brauche keine tägliche Steuerung, sondern ein klares Ziel – und melde mich, bevor etwas ins Rutschen kommt. Kommunikation auf Deutsch und Englisch.",
          " I don't need daily direction, just a clear goal – and I speak up before anything slips. I communicate in German and English.",
        ),
      },
    ],
  },
  {
    spans: [
      { t: t("Technisch ", "Technically ") },
      { t: t("TypeScript und Python", "TypeScript and Python"), b: true },
      {
        t: t(
          ", Backend mit ",
          ", backends with ",
        ),
      },
      {
        t: t("NestJS, Node.js und FastAPI", "NestJS, Node.js and FastAPI"),
        b: true,
      },
      { t: t(", Frontend mit ", ", frontends with ") },
      {
        t: t("Next.js, React und Angular", "Next.js, React and Angular"),
        b: true,
      },
      {
        t: t(
          ", dazu PostgreSQL, Docker und CI/CD. Clean Architecture und Microservices als Standard, ",
          ", plus PostgreSQL, Docker and CI/CD. Clean Architecture and microservices as standard, ",
        ),
      },
      {
        t: t(
          "DSGVO-Konformität und Secure by Design",
          "GDPR compliance and Secure by Design",
        ),
        b: true,
      },
      { t: t(" von Beginn an.", " from day one.") },
    ],
  },
  {
    spans: [
      { t: t("Erprobt im ", "Proven inside a ") },
      {
        t: t("20-köpfigen Engineering-Team", "20-person engineering team"),
        b: true,
      },
      {
        t: t(
          " an einer LegalTech-Plattform mit ",
          " on a LegalTech platform with ",
        ),
      },
      { t: t("über 3.000 Kunden", "more than 3,000 customers"), b: true },
      {
        t: t(
          " und als alleiniger Entwickler mit voller Produktverantwortung – in ",
          " and as a sole developer with full product ownership – over ",
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
  },
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
