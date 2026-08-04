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
    href: "/cv/CV_Nikita_Petrich_DE.pdf",
    label: t("CV Deutsch", "CV German"),
    flag: "/assets/flags/de.svg",
    sub: t("PDF · zum Weiterleiten", "PDF · ready to forward"),
  },
  {
    href: "/cv/CV_Nikita_Petrich_EN.pdf",
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

/* The "about" block. Four paragraphs: positioning with the proof numbers,
   way of working, stack, track record. Bold marks the proof points — the
   concrete savings and the scale figures. The closing question and the
   booking button under the callout carry the CTA, so the text itself stops
   after the track record. */
export type IntroLine = { spans: RichLine };

export const intro: IntroLine[] = [
  {
    spans: [
      {
        t: t(
          /* The attribution leads the list rather than trailing it. It used to
             sit at the end, where "jeweils" governed all three figures in one
             sentence; splitting that sentence left it hanging off the last one,
             so two client numbers were being asserted as the site's own. */
          "Ich bin freiberuflicher Senior Full-Stack & AI Engineer mit Schwerpunkt auf LLM-Integration, RAG und KI-gestützter Automatisierung – von der Architektur bis zum Produktivbetrieb. Meine Ergebnisse, jeweils nach Angaben der Kunden bzw. Anbieter: ",
          "I'm a freelance Senior Full-Stack & AI Engineer focused on LLM integration, RAG and AI-driven automation – from architecture to production. My results, each as reported by the client or provider: ",
        ),
      },
      /* Order matters here, and so does sentence length. The logistics figure
         is the largest and the one a reader is most likely to bounce off, so
         the two immediately credible numbers come first and it arrives last —
         in a sentence of its own, with the mechanism in front of it rather than
         wedged into an em-dash aside. Three bold figures in one 60-word run did
         not survive a skim, which is the only way this paragraph is read. */
      { t: t("40 Stunden/Monat", "40 hours/month"), b: true },
      {
        t: t(
          " weniger Verwaltungsarbeit im Handel, ",
          " less administrative work in retail, ",
        ),
      },
      {
        t: t("70 % weniger Rückfragen", "70 % fewer enquiries"),
        b: true,
      },
      {
        /* "spart" — the same verb the project page uses. Splitting this out of
           the previous sentence had left the biggest number on the site as a
           bare apposition with nothing in the clause that saved anything. */
        t: t(
          " im Notariat. In der Logistik spart die automatisierte Erzeugung der Tourunterlagen – vorher je Fahrt von Hand zusammengestellt – ",
          " at a notary's office. In logistics, generating the route documents automatically — they used to be assembled by hand for every trip — saves ",
        ),
      },
      {
        t: t(
          "bis zu 1.000 Stunden pro Mitarbeiter und Jahr",
          "up to 1,000 hours per employee per year",
        ),
        b: true,
      },
      {
        t: t(
          ". Dieselbe Konsequenz gilt für meine Entwicklung selbst: Mit Agentic-Coding-Workflows (Claude Code, Cursor, MCP) und spezifikationsgetriebenem Vorgehen entstand eine ",
          ". I apply the same rigour to how I build: with agentic coding workflows (Claude Code, Cursor, MCP) and a spec-driven approach, I delivered a ",
        ),
      },
      {
        t: t(
          "vollständige Cross-Platform-App in rund zwei Monaten",
          "complete cross-platform app in roughly two months",
        ),
        b: true,
      },
      { t: t(" – als alleiniger Entwickler.", " – as the sole developer.") },
    ],
  },
  {
    spans: [
      { t: t("Ich arbeite ", "I work ") },
      {
        t: t(
          "eigenverantwortlich, remote und asynchron",
          "independently, remote and asynchronously",
        ),
        b: true,
      },
      {
        t: t(
          ": klares Ziel genügt, dokumentierte Entscheidungen und getesteter Code sind Standard. Kommunikation auf Deutsch und Englisch.",
          ": a clear goal is enough – documented decisions and tested code are the standard. Communication in German and English.",
        ),
      },
    ],
  },
  {
    spans: [
      { t: t("Tech-Stack:", "Tech stack:"), b: true },
      {
        t: t(
          " TypeScript/Python, NestJS/FastAPI, Next.js/React/Angular, PostgreSQL, Docker, CI/CD, Azure/GCP – Clean Architecture, DSGVO-Konformität und Secure by Design von Anfang an.",
          " TypeScript/Python, NestJS/FastAPI, Next.js/React/Angular, PostgreSQL, Docker, CI/CD, Azure/GCP – Clean Architecture, GDPR compliance and Secure by Design from day one.",
        ),
      },
    ],
  },
  {
    spans: [
      {
        t: t("Über 7 Jahre Erfahrung", "More than 7 years of experience"),
        b: true,
      },
      /* The seniority signal. Nothing here is a new claim, and each half names
         its own scope — which is the part the first version left out. Stating
         "Ich verantworte Architektur und Betrieb end-to-end" unqualified read
         as full-time commercial ownership, while every project backing it is
         the own product or a system maintained alongside client work. A reader
         who found "nebenberuflich" two clicks later would discount the whole
         paragraph; naming the two tracks up front costs nothing and survives
         the cross-read. */
      {
        t: t(
          " in LegalTech, HealthTech, E-Commerce, EdTech und Logistik. In Kundenprojekten liefere ich im bestehenden Team: bei einer LegalTech-Plattform mit ",
          " in LegalTech, HealthTech, e-commerce, EdTech and logistics. On client engagements I deliver inside the existing team: on a LegalTech platform with ",
        ),
      },
      { t: t("3.000+ Kunden", "3,000+ customers"), b: true },
      {
        /* Attributed here too — the project page says "laut Anbieter", and the
           intro was quoting the same number as if it were its own. */
        t: t(
          " (laut Anbieter) als einer von rund 20 Engineers in vier Teams – dort produktive KI-Features und, im Viererteam, die Zusammenführung von vier Portalen zu einem. Daneben verantworte ich ",
          " (per the provider) as one of some 20 engineers across four teams – production AI features there and, in a team of four, the consolidation of four portals into one. Alongside that I own ",
        ),
      },
      {
        t: t(
          "Architektur und Betrieb end-to-end",
          "architecture and operations end-to-end",
        ),
        b: true,
      },
      {
        t: t(
          " – auf meinem Eigenprodukt und auf zwei Kundensystemen, die ich nebenberuflich weiterbetreue; eines davon läuft seit 2021 durchgehend im Produktivbetrieb.",
          " – on my own product and on two client systems I keep maintaining alongside client work; one of them has been running in production continuously since 2021.",
        ),
      },
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
  "Freiberuflicher Senior Full-Stack & AI Engineer mit Schwerpunkt LLM-Integration, RAG und KI-gestützter Automatisierung. Über 7 Jahre Erfahrung in LegalTech, HealthTech, E-Commerce, EdTech und Logistik.",
  "Freelance Senior Full-Stack & AI Engineer focused on LLM integration, RAG and AI-assisted automation. More than 7 years of experience in LegalTech, HealthTech, e-commerce, EdTech and logistics.",
);
