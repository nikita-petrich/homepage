import { t } from "@/lib/i18n/text";
import { accentColor, bookingUrl, profileName, profileRole } from "@/lib/profile";

/* Identity, sidebar and hero content. Every visible string carries both
   languages via t(); anything without it (names, URLs, technologies) is
   identical in German and English by nature. */

export type Span = { t: ReturnType<typeof t> | string; b?: boolean };
export type RichLine = Span[];

export const profile = {
  name: profileName,
  role: profileRole,
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

/* An array value is rendered as one line per entry — for facts that carry
   several independent statements and would otherwise wrap awkwardly in the
   210px sidebar. */
export const facts = [
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
    value: [
      t("Remote (bevorzugt)", "Remote (preferred)"),
      t("Vor Ort: München · 1–2 Tage/Woche", "On-site: Munich · 1–2 days/week"),
      t("Reisen: 1–2 Tage/Monat", "Travel: 1–2 days/month"),
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

export const intro: RichLine[] = [
  [
    { t: t("Ich bin freiberuflicher ", "I am a freelance ") },
    { t: "Senior Full-Stack & AI Engineer", b: true },
    { t: t(". Mein Schwerpunkt ist KI: ", ". My focus is AI: ") },
    { t: t("LLM-Integration", "LLM integration"), b: true },
    { t: ", " },
    { t: "RAG", b: true },
    { t: t(" und ", " and ") },
    { t: t("KI-gestützte Automatisierung", "AI-assisted automation"), b: true },
    {
      t: t(
        ", die den Sprung in den Produktivbetrieb schaffen – von der Architektur über die Integration bis zum stabilen Betrieb.",
        " — the kind that actually makes it into production, from architecture through integration to stable operation.",
      ),
    },
  ],
  [
    {
      t: t(
        "Ebenso zu Hause bin ich in der klassischen Full-Stack-Entwicklung – ob komplette Anwendung, reines Backend (",
        "I am equally at home in classic full-stack development — a complete application, a pure backend (",
      ),
    },
    { t: "NestJS", b: true },
    { t: ", " },
    { t: "Node.js", b: true },
    { t: ", " },
    { t: "FastAPI", b: true },
    { t: t(") oder reines Frontend (", ") or a pure frontend (") },
    { t: "Next.js", b: true },
    { t: ", " },
    { t: "React", b: true },
    { t: ", " },
    { t: "Angular", b: true },
    {
      t: t(
        "). Robuste APIs, klar geschnittene Architektur (",
        "). Robust APIs, cleanly separated architecture (",
      ),
    },
    { t: "Clean Architecture", b: true },
    { t: ", " },
    { t: "Microservices", b: true },
    {
      t: t(
        ") und wartbarer, getesteter Code sind Standard; Datenschutz denke ich von Beginn an mit – ",
        ") and maintainable, tested code are the baseline; data protection is part of the design from day one — ",
      ),
    },
    { t: t("DSGVO-konform", "GDPR-compliant"), b: true },
    {
      t: t(
        " und Secure by Design auf europäischer Infrastruktur.",
        " and secure by design on European infrastructure.",
      ),
    },
  ],
  [
    { t: t("Ich arbeite konsequent mit modernen ", "I consistently work with modern ") },
    { t: "Agentic-Coding-", b: true },
    { t: t(" und ", " and ") },
    { t: "AI-Engineering", b: true },
    {
      t: t(
        "-Workflows und -Tools (Claude Code, Cursor, Code Rabbit) – für außergewöhnlich hohe Produktivität bei gleichbleibender Qualität.",
        " workflows and tools (Claude Code, Cursor, Code Rabbit) — for exceptionally high productivity at consistent quality.",
      ),
    },
  ],
  [
    {
      t: t(
        "In über sieben Jahren habe ich Anwendungen in ",
        "Over more than seven years I have built applications in ",
      ),
    },
    { t: "LegalTech", b: true },
    { t: ", " },
    { t: "HealthTech", b: true },
    { t: ", " },
    { t: t("E-Commerce/Handel", "e-commerce/retail"), b: true },
    { t: ", " },
    { t: "EdTech", b: true },
    { t: t(" und ", " and ") },
    { t: t("Logistik", "logistics"), b: true },
    {
      t: t(
        " umgesetzt – von KI-Plattformen mit mehreren Tausend Nutzern bis zu geschäftskritischen Fachanwendungen.",
        " — from AI platforms with several thousand users to business-critical line-of-business systems.",
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
