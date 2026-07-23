/*
 * Content for Nikita Petrich's résumé homepage — a Notion-style page mirroring
 * the design template (cover, title, two-column layout with contact / key facts
 * / languages / focus sidebar and an about callout, project case studies and a
 * skills database in the main column). All copy is sourced from the CV.
 */

export type Span = { t: string; b?: boolean };
export type RichLine = Span[];

export const profile = {
  name: "Nikita Petrich",
  role: "Senior Full-Stack & AI Engineer",
  calendly: "https://calendly.com/nikita-petrich/30min",
  accent: "#e1852e",
};

/* Downloadable CV files (generated PDFs, served from /public/cv). */
export type CvFile = { href: string; label: string; flag: string; sub: string };
export const cvFiles: CvFile[] = [
  { href: "/cv/CV_Nikita_Petrich_DE.pdf", label: "CV Deutsch", flag: "/assets/flags/de.svg", sub: "PDF · 10 Seiten" },
  { href: "/cv/CV_Nikita_Petrich_EN.pdf", label: "CV EN", flag: "/assets/flags/us.svg", sub: "PDF · 10 pages" },
];

export type InfoItem = { icon: string; text: string; href?: string };

export const contact: InfoItem[] = [
  { icon: "📞", text: "+49 15679088678", href: "tel:+4915679088678" },
  { icon: "✉️", text: "n.petrich@sequenz.io", href: "mailto:n.petrich@sequenz.io" },
  { icon: "🌐", text: "https://sequenz.io", href: "https://sequenz.io" },
];

export type FactItem = { label: string; value: string };

export const eckdaten: FactItem[] = [
  { label: "Erfahrung", value: "7+ Jahre" },
  { label: "Verfügbar", value: "ab sofort · Vollzeit" },
  { label: "Stundensatz", value: "80 €/h" },
  { label: "Qualifikation", value: "IHK-Fachinformatiker (AE)" },
  { label: "Standort", value: "Remote · München (max. 1–2 Tage onsite)" },
];

export type Language = { flag: string; text: string; sub: string };

export const languages: Language[] = [
  { flag: "/assets/flags/de.svg", text: "Deutsch", sub: "Muttersprache" },
  { flag: "/assets/flags/us.svg", text: "Englisch", sub: "B2 · US/EU-Remote" },
];

export const arbeitsweise: string[] = [
  "ergebnisorientiert",
  "eigenverantwortlich & zuverlässig",
  "autonome, asynchrone Arbeitsweise",
  "klare Kommunikation (DE/EN)",
];

export type ProfileLink = { label: string; href: string };

export const profileLinks: ProfileLink[] = [
  { label: "Website", href: "https://sequenz.io" },
  { label: "LinkedIn", href: "https://linkedin.com/in/nikita-petrich" },
  { label: "GitHub", href: "https://github.com/nikita-petrich" },
  { label: "freelancermap", href: "https://www.freelancermap.de" },
  { label: "Malt", href: "https://www.malt.de" },
];

/* About-me callout — bold segments preserved from the source page. */
export const intro: RichLine[] = [
  [
    { t: "Ich bin freiberuflicher " },
    { t: "Senior Full-Stack & AI Engineer", b: true },
    { t: ". Mein Schwerpunkt ist KI: " },
    { t: "LLM-Integration", b: true },
    { t: ", " },
    { t: "RAG", b: true },
    { t: " und " },
    { t: "KI-gestützte Automatisierung", b: true },
    { t: ", die den Sprung in den Produktivbetrieb schaffen – von der Architektur über die Integration bis zum stabilen Betrieb." },
  ],
  [
    { t: "Ebenso zu Hause bin ich in der klassischen Full-Stack-Entwicklung – ob komplette Anwendung, reines Backend (" },
    { t: "NestJS", b: true },
    { t: ", " },
    { t: "Node.js", b: true },
    { t: ", " },
    { t: "FastAPI", b: true },
    { t: ") oder reines Frontend (" },
    { t: "Next.js", b: true },
    { t: ", " },
    { t: "React", b: true },
    { t: ", " },
    { t: "Angular", b: true },
    { t: "). Robuste APIs, klar geschnittene Architektur (" },
    { t: "Clean Architecture", b: true },
    { t: ", " },
    { t: "Microservices", b: true },
    { t: ") und wartbarer, getesteter Code sind Standard; Datenschutz denke ich von Beginn an mit – " },
    { t: "DSGVO-konform", b: true },
    { t: " und Secure by Design auf europäischer Infrastruktur." },
  ],
  [
    { t: "Ich arbeite konsequent mit modernen " },
    { t: "Agentic-Coding-", b: true },
    { t: " und " },
    { t: "AI-Engineering", b: true },
    { t: "-Workflows und -Tools (Claude Code, Cursor, Code Rabbit) – für außergewöhnlich hohe Produktivität bei gleichbleibender Qualität." },
  ],
  [
    { t: "In über sieben Jahren habe ich Anwendungen in " },
    { t: "LegalTech", b: true },
    { t: ", " },
    { t: "HealthTech", b: true },
    { t: ", " },
    { t: "E-Commerce/Handel", b: true },
    { t: ", " },
    { t: "EdTech", b: true },
    { t: " und " },
    { t: "Logistik", b: true },
    { t: " umgesetzt – von KI-Plattformen mit mehreren Tausend Nutzern bis zu geschäftskritischen Fachanwendungen." },
  ],
];

export const schwerpunkt: string[] = [
  "LLM-Integration", "RAG", "KI-gestützte Automatisierung",
  "Agentic Coding / AI-Engineering", "TypeScript", "Python",
  "Backend (NestJS · Node.js · FastAPI)", "Frontend (Next.js · React · Angular)",
  "PostgreSQL", "Clean Architecture", "Microservices", "CI/CD", "Docker",
  "DSGVO-konforme KI-Architektur",
];

export type ProjectMeta = { label: string; value: string };
export type Project = {
  num: string;
  /** Stable URL slug — never change an existing one; it is a permanent route. */
  slug: string;
  name: string;
  subtitle: string;
  cat: string;
  role: string;
  dateRange: string;
  sort: string;
  caption: string;
  /** Optional cover image (served from /public); falls back to a placeholder. */
  cover?: string;
  cardTags: string[];
  desc: string;
  meta: ProjectMeta[];
  aufgaben: string[];
  ergebnis: string[];
  tech: string[];
};

/* Case studies — ordered newest first by default. */
export const projects: Project[] = [
  {
    num: "01", slug: "bescheidklar", name: "BESCHEIDKLAR", subtitle: "KI-gestützte LegalTech-SaaS-Plattform",
    cat: "LegalTech / GovTech", role: "Gründer & CTO",
    dateRange: "04/2025 – heute · 15 Monate", sort: "2025-04",
    caption: "KI-Vorprüfungs-Dashboard für Bescheide",
    cover: "/assets/projects/proj-01.jpg", cardTags: ["LegalTech", "KI · RAG"],
    desc: "Zweiseitige LegalTech-SaaS-Plattform, die KI-gestützte Dokumentenanalyse (Azure OpenAI) mit einem regionalen Lizenzmodell für Anwaltskanzleien verbindet.",
    meta: [
      { label: "Rolle", value: "Gründer & CTO" },
      { label: "Team", value: "Solo · Eigenprodukt" },
      { label: "Standort", value: "Niedersachsen, DE · Remote" },
      { label: "Sprache", value: "Deutsch" },
      { label: "Website", value: "bescheidklar.de" },
      { label: "Methodik", value: "Direkte Produktverantwortung" },
    ],
    aufgaben: [
      "Konzeption und Aufbau einer zweiseitigen LegalTech-SaaS-Plattform mit modularer, service-orientierter Architektur.",
      "KI-Vorprüfungs-Pipeline für Bescheide und Kündigungen: Extraktion → Fristprüfung → Plausibilitäts- und Erfolgseinschätzung mit strukturierter Aufbereitung des Falls.",
      "Automatisierte, DSGVO-konforme Übergabe qualifizierter Leads inkl. hochgeladener Dokumente an passende Spezialisten (Rechtsanwälte, Law Clinics).",
      "RAG-basierter Ratgeber-Bereich mit Artikeln und Handlungsempfehlungen für Betroffene.",
      "Gesamtverantwortung für Architektur, Tech-Stack, Hosting auf EU-Infrastruktur und ein Secure-by-Design-Compliance-Konzept (EU AI Act, DSGVO, RDG).",
    ],
    ergebnis: [
      "Adressierbarer Markt: 188.522 zugelassene Rechtsanwälte in Deutschland – skalierbares Modell bei minimalen Fixkosten.",
      "Ziel: bis zu 10.000 automatisierte Vorprüfungen pro Monat.",
      "Ziel: bis zu 80 % weniger manuelle Fallannahme durch KI-Intake und automatisiertes Anwalts-Routing.",
    ],
    tech: ["TypeScript", "Python", "Next.js", "React", "FastAPI", "LLM-Integration", "OpenAI API", "Azure OpenAI", "RAG", "Prompt Engineering", "Embeddings", "pgvector", "OCR", "LangChain", "PostgreSQL", "Redis", "Tailwind CSS", "shadcn/ui", "Stripe", "JWT", "OAuth 2.0", "Docker", "GitHub Actions", "CI/CD", "Hetzner", "Microservices", "EU AI Act", "Clean Architecture", "DSGVO by Design"],
  },
  {
    num: "02", slug: "manifest-os", name: "Manifest OS", subtitle: "KI-gestützte Einwanderungsplattform",
    cat: "LegalTech / Immigration", role: "Full-Stack Engineer (KI-Feature-Integration)",
    dateRange: "12/2025 – 04/2026 · 5 Monate", sort: "2025-12",
    caption: "B2X-Portal — Fallübersicht",
    cover: "/assets/projects/proj-02.jpg", cardTags: ["LegalTech", "KI-Features"],
    desc: "KI-Feature-Integration in einer etablierten US-Einwanderungsplattform (~60 Mio. USD Bewertung) mit über 3.000 Kunden.",
    meta: [
      { label: "Rolle", value: "Full-Stack Engineer" },
      { label: "Team", value: "~20 Engineers · crossfunktional" },
      { label: "Standort", value: "New York, USA · Remote" },
      { label: "Sprache", value: "Englisch" },
      { label: "Website", value: "manifestlaw.com" },
      { label: "Methodik", value: "Scrum · autonom" },
    ],
    aufgaben: [
      "Produktive KI-Features: ereignisgesteuerte Anreicherung anwaltlicher Erstgespräch-Leads – Aufzeichnungen per Bluedot transkribiert, über Webhook + BullMQ-Queue an die OpenAI-Integration, resilient (Retry, Idempotenz).",
      "KI-gestützte Evidence-Verarbeitung: hochgeladene Falldokumente automatisiert analysiert, klassifiziert und einheitlich benannt.",
      "Mitwirkung an der Konsolidierung von vier Portalen (B2B, B2C, Lawyer, Ops) in ein einheitliches „B2X“-Portal; Fullstack-Migration der B2B- und Ops-Bereiche.",
      "Einführung eines anwendungsweiten Event-Trackings (Amplitude) als Datengrundlage für Produkt- und Data-Analytics.",
      "Robuste, ereignisgetriebene Backend-Services (NestJS, BullMQ) mit Retry-, Idempotenz- und Fehlerbehandlungs-Strategien.",
    ],
    ergebnis: [
      "Teil eines rund 20-köpfigen Engineering-Teams an einer etablierten Plattform (~60 Mio. USD Bewertung).",
      "Plattform mit über 3.000 Kunden und 150+ Corporate-Programmen (Team-Ergebnis).",
      "Bis zu 15 % höhere Genehmigungsraten gegenüber dem USCIS-Durchschnitt (Team-Ergebnis).",
    ],
    tech: ["TypeScript", "Python", "Next.js", "React", "NestJS", "Node.js", "Fastify", "REST API", "Webhooks", "BullMQ", "RabbitMQ", "LLM-Integration", "OpenAI API", "Anthropic Claude API", "RAG", "Embeddings", "OCR", "Amplitude", "PostgreSQL", "Redis", "MikroORM", "TanStack Query", "better-auth", "JWT", "Docker", "GCP", "GitHub Actions", "CI/CD", "Claude Code", "Cursor AI", "Code Rabbit", "Linear", "Playwright", "Microservices", "Event-Driven Architecture", "Clean Architecture"],
  },
  {
    num: "03", slug: "aitoi", name: "AITOI", subtitle: "Interaktives IoT-Spielzeug (MVP)",
    cat: "IoT / Consumer Electronics", role: "Frontend Engineer",
    dateRange: "08/2025 – 09/2025 · 2 Monate", sort: "2025-08",
    caption: "PWA WLAN-Onboarding Flow",
    cover: "/assets/projects/proj-03.jpg", cardTags: ["IoT", "PWA"],
    desc: "PWA-Frontend für ein vernetztes KI-Spielzeug: WLAN-Onboarding per QR-Code-Scan, Gerätekopplung und Echtzeit-Synchronisation.",
    meta: [
      { label: "Rolle", value: "Frontend Engineer" },
      { label: "Team", value: "Interdisziplinär · inkl. Hardware" },
      { label: "Standort", value: "Frankfurt, DE · Remote" },
      { label: "Sprache", value: "Deutsch & Englisch" },
      { label: "Sichtbarkeit", value: "Internes System" },
      { label: "Methodik", value: "Eigenverantwortlich" },
    ],
    aufgaben: [
      "Konzeption und Umsetzung des IoT-WLAN-Onboardings per QR-Code-Scan – inkl. geführtem Einrichtungs-Flow, Gerätekopplung und robuster Fehlerbehandlung.",
      "Erst-Einrichtung neuer Geräte und nachträgliche Konfiguration über eine plattformunabhängige PWA.",
      "Anbindung von Supabase für Authentifizierung, Datenhaltung und Echtzeit-Synchronisation (inkl. Row Level Security).",
      "Aufbau einer performanten PWA-Architektur (Next.js) mit responsivem UI.",
    ],
    ergebnis: [
      "Voll funktionsfähiges MVP-Frontend in rund einem Monat – eigenständig von Konzept bis Demo.",
      "Plattformunabhängig nutzbare PWA mit Echtzeit-Synchronisation zwischen IoT-Gerät und App.",
      "Skalierbare, dokumentierte Architektur als tragfähige Grundlage für den Produktlaunch.",
    ],
    tech: ["TypeScript", "Next.js", "React", "PWA", "Responsive Design", "Design System", "Figma", "TanStack Query", "React Hook Form", "WebSockets", "Device-Pairing", "Supabase", "Supabase Realtime", "Row Level Security", "PostgreSQL", "Tailwind CSS", "shadcn/ui", "JWT", "Docker", "CI/CD", "GitHub Actions", "Vitest", "MVP-Entwicklung", "Clean Architecture"],
  },
  {
    num: "04", slug: "dino", name: "DiNo", subtitle: "Digitales Notariat",
    cat: "LegalTech / Notariat", role: "Frontend Engineer",
    dateRange: "01/2025 – 05/2025 · 5 Monate", sort: "2025-01",
    caption: "Mandantenportal — Vorgangsübersicht",
    cover: "/assets/projects/proj-04.jpg", cardTags: ["LegalTech", "Frontend"],
    desc: "Frontend zur Digitalisierung von Notarprozessen mit Fokus auf klare, nachvollziehbare Nutzerführung – Mandanten- und Notarportal.",
    meta: [
      { label: "Rolle", value: "Frontend Engineer" },
      { label: "Team", value: "2–4 Personen" },
      { label: "Standort", value: "Oranienburg, DE · Remote" },
      { label: "Sprache", value: "Deutsch" },
      { label: "Website", value: "digitales-notariat.de" },
      { label: "Methodik", value: "Scrumban" },
    ],
    aufgaben: [
      "Frontend-Features zur Digitalisierung von Notarprozessen mit klarer, nachvollziehbarer Nutzerführung (Mandanten- und Notarportal).",
      "Digitale Vorgangsverwaltung: strukturierte Datenerfassung, digitale Verfahrensakten und nahtlose interne Ablage.",
      "Mandantenportal für Statusverfolgung, sichere Dokumentenbereitstellung und datenschutzkonforme Kommunikation.",
      "Responsive Oberflächen (React, Material UI) für Mandanten- und Notarportal.",
    ],
    ergebnis: [
      "Laut Anbieter bis zu 70 % weniger telefonische Rückfragen der Mandanten.",
      "Rechnungen werden laut Anbieter bis zu 30 Tage früher bezahlt.",
      "Spürbar reduzierter Verwaltungsaufwand durch durchgängig digitale Prozesse.",
    ],
    tech: ["TypeScript", "React", "Python", "Flask", "REST API / OpenAPI", "MariaDB", "MySQL", "Redux", "React Router", "React Hook Form", "Material UI (MUI)", "SPA", "Mandantenportal", "Digitale Aktenführung", "JWT", "OAuth 2.0", "RBAC", "DSGVO-Compliance", "Docker", "Nginx", "GitLab", "Clean Architecture"],
  },
  {
    num: "05", slug: "accounting-os", name: "AccountingOS", subtitle: "GoBD-konformes Buchhaltungs- & Lagersystem",
    cat: "Handel & Kfz-Gewerbe", role: "Sole Developer · Full-Stack & AI",
    dateRange: "01/2024 – 12/2024 · 12 Monate · lfd. Wartung", sort: "2024-01",
    caption: "Lagerverwaltung & Rechnungsmodul",
    cover: "/assets/projects/proj-05.jpg", cardTags: ["Warenwirtschaft", "Full-Stack"],
    desc: "GoBD-konformes Buchhaltungs- und Lagersystem mit resilientem Daten-Synchronisationsservice für Lieferanten-Kataloge (bis 20 Mio. CSV-Zeilen).",
    meta: [
      { label: "Rolle", value: "Sole Developer · Full-Stack & AI" },
      { label: "Team", value: "Solo · Kundenprojekt" },
      { label: "Standort", value: "Salzgitter, DE · Remote" },
      { label: "Sprache", value: "Deutsch" },
      { label: "Code", value: "github.com/nikita-petrich/accounting-os" },
      { label: "Methodik", value: "Eigenverantwortlich" },
    ],
    aufgaben: [
      "Konzeption und Entwicklung eines GoBD-konformen Buchhaltungs- und Lagersystems auf Basis sauber geschichteter Architektur (Clean Architecture).",
      "Resilienter Daten-Synchronisationsservice („Pipe Service“) für Lieferanten-Kataloge – bis 20 Mio. CSV-Zeilen über TLS mit Queue, Caching, Retry-Logik, Validierung und Deduplizierung.",
      "Buchhaltungsmodul: Rechnungen, Korrekturrechnungen, PDF-Export, Kundenverwaltung, Bestellimport mit GoBD-Festschreibung.",
      "Kopplung von Lagerverwaltung und Rechnungsmanagement (automatische Bestandsabbuchung, Mindestbestand-Benachrichtigung).",
      "Rollenbasierte Zugriffssteuerung (better-auth); typsichere GraphQL- und REST-Schnittstellen (NestJS, MikroORM, DTOs).",
    ],
    ergebnis: [
      "Spart bis zu 40 Stunden Verwaltungsarbeit pro Monat (bis zu 480 Stunden/Jahr).",
      "Reduziert den Zeitaufwand bei Routineprozessen um bis zu 50 %.",
      "Durchgängig digitale, GoBD-konforme Abläufe mit direkter Kopplung von Lager und Buchhaltung.",
    ],
    tech: ["TypeScript", "Node.js", "NestJS", "Next.js", "React", "Fastify", "REST API", "GraphQL", "Daten-Synchronisation", "CSV-Verarbeitung", "Message Queues", "Caching", "MariaDB", "PostgreSQL", "Redis", "MikroORM", "TanStack Query", "Tailwind CSS", "Warenwirtschaft", "ERP", "GoBD", "better-auth", "JWT", "RBAC", "Docker", "Self-Hosting", "CI/CD", "GitHub Actions", "Hetzner", "Microservices", "Clean Architecture"],
  },
  {
    num: "06", slug: "lkw-tourverwaltung", name: "LKW-Tourverwaltung", subtitle: "Tourenplanung mit Echtzeit-Tracking",
    cat: "Logistik & Transport", role: "Sole Developer · Full-Stack & AI",
    dateRange: "02/2021 – 05/2023 · 2 J. 4 Mon. · lfd. Wartung", sort: "2021-02",
    caption: "Tourenplanung mit Echtzeit-Tracking",
    cover: "/assets/projects/proj-06.jpg", cardTags: ["Logistik", "Full-Stack"],
    desc: "LKW-Tourverwaltungssystem zur effizienten Steuerung und Optimierung der Tourenplanung mit Echtzeit-Tracking und revisionssicherer Archivführung.",
    meta: [
      { label: "Rolle", value: "Sole Developer · Full-Stack & AI" },
      { label: "Team", value: "Solo · Kundenprojekt" },
      { label: "Standort", value: "Bremen, DE · Remote" },
      { label: "Sprache", value: "Deutsch" },
      { label: "Website", value: "cdh-stephanus.org" },
      { label: "Methodik", value: "Eigenverantwortlich" },
    ],
    aufgaben: [
      "Eigenständige Konzeption und Entwicklung eines LKW-Tourverwaltungssystems zur Steuerung und Optimierung der Tourenplanung.",
      "Dynamische Tourenverwaltung zur Erhöhung der Transportgenauigkeit.",
      "Automatisierte Generierung von PDF- und DOCX-Dokumenten sowie revisionssichere digitale Archivführung je Tour.",
      "Rollenbasierte Zugriffssteuerung und sichere Authentifizierung (better-auth).",
      "Container-basiertes, selbst gehostetes Deployment (Docker, Nginx); Backend mit sauberer Schichtung (NestJS, Clean Architecture).",
    ],
    ergebnis: [
      "Spart durch automatisierte Dokumentenprozesse bis zu 1.000 Stunden pro Jahr und senkt Personalkosten spürbar.",
      "Erhöht die Transportgenauigkeit um bis zu 25 % und die Logistikeffizienz um bis zu 30 %.",
      "Deutlich reduzierte Übertragungsfehler durch durchgängig digitale Prozesse.",
    ],
    tech: ["TypeScript", "Node.js", "NestJS", "Next.js", "React", "Fastify", "REST API", "GraphQL", "PostgreSQL", "Redis", "MikroORM", "React Router", "Tailwind CSS", "SPA", "Tourenplanung / Routenoptimierung", "Echtzeit-Tracking", "PDF-Generierung", "DOCX-Generierung", "better-auth", "JWT", "RBAC", "Docker", "Self-Hosting", "CI/CD", "GitHub Actions", "Nginx", "Microservices", "Clean Architecture"],
  },
  {
    num: "07", slug: "xu-navigator", name: "XU Navigator", subtitle: "Enterprise-Lernplattform",
    cat: "EdTech / E-Learning", role: "Full-Stack Engineer",
    dateRange: "05/2020 – 02/2023 · 2 J. 10 Mon.", sort: "2020-05",
    caption: "Kursverwaltung & Zertifikats-Engine",
    cover: "/assets/projects/proj-07.jpg", cardTags: ["EdTech", "Microservices"],
    desc: "Skalierbare Microservice-Lernplattform für Unternehmensmitarbeitende – im Einsatz bei Konzernen wie Daimler, VW und ThyssenKrupp.",
    meta: [
      { label: "Rolle", value: "Full-Stack Engineer" },
      { label: "Team", value: "5–10 Personen" },
      { label: "Standort", value: "Bremen, DE · Remote" },
      { label: "Sprache", value: "Deutsch" },
      { label: "Website", value: "xu.de" },
      { label: "Methodik", value: "Scrum" },
    ],
    aufgaben: [
      "Mitentwicklung des „XU Navigator“, einer skalierbaren Microservice-Lernplattform für Unternehmensmitarbeitende.",
      "Dynamisch, mandantenspezifisch befüllbare Kursinhalte (Videos, Podcasts, Multiple-Choice, Artikel) über klar abgegrenzte Services.",
      "Lernfortschrittskontrolle inkl. automatischer Zertifikatsgenerierung sowie Experten- und Community-Foren.",
      "Skalierbare Backend-Services (NestJS, GraphQL) mit klar abgegrenzten Domänen in Microservice-Architektur.",
      "Responsive Angular-Oberflächen (Angular Material, NgRx); Bereitstellung über Azure (DevOps Pipelines, Docker).",
    ],
    ergebnis: [
      "Skalierbare Microservice-Plattform im produktiven Einsatz bei namhaften Konzernen (Daimler, VW, ThyssenKrupp u. a.).",
      "Hoher Individualisierungsgrad für passgenaue, unternehmensspezifische Schulungen.",
      "Automatisierte Zertifikatsvergabe und Fortschrittsanalyse zur Steigerung der Abschlussquoten.",
    ],
    tech: ["TypeScript", "Angular", "Node.js", "NestJS", "Express.js", "REST API", "GraphQL", "MongoDB", "Mongoose", "NgRx", "RxJS", "Angular Material", "SCSS", "Azure", "Azure DevOps", "Azure App Service", "Azure Blob Storage", "Docker", "CI/CD", "JWT", "OAuth 2.0", "SSO", "LMS", "Video-Streaming", "Microservices", "Clean Architecture"],
  },
  {
    num: "08", slug: "medizingeraete-ms", name: "Medizingeräte-MS", subtitle: "Managementsystem für Medizingeräte",
    cat: "HealthTech / Medizintechnik", role: "Full-Stack Engineer",
    dateRange: "01/2019 – 05/2020 · 1 J. 5 Mon.", sort: "2019-01",
    caption: "Geräte- & Wartungshistorie-Übersicht",
    cover: "/assets/projects/proj-08.jpg", cardTags: ["HealthTech", ".NET"],
    desc: "Mandantenfähige Software zur Verwaltung medizinischer Geräte über mehrere Krankenhäuser – Werkzeug für Techniker zur Wartung und Reparatur.",
    meta: [
      { label: "Rolle", value: "Full-Stack Engineer" },
      { label: "Team", value: "2–4 Personen" },
      { label: "Standort", value: "Deutschland · Vor Ort / Hybrid" },
      { label: "Sprache", value: "Deutsch" },
      { label: "Sichtbarkeit", value: "Krankenhauskette (anonymisiert)" },
      { label: "Methodik", value: "Scrumban" },
    ],
    aufgaben: [
      "Mitentwicklung aller Bereiche einer Software zur Verwaltung medizinischer Geräte über mehrere Krankenhäuser.",
      "Geräte- und Stammdatenverwaltung (Krankenhaus, Standort, Gerätespezifikationen) auf sauber geschichteter Architektur (Clean Architecture, DI).",
      "Detaillierte Wartungshistorie und gerätebezogenes Dokumentenmanagement; Störungserfassung durch Pflegepersonal.",
      "Mandantenfähige Filterung nach Krankenhaus (Multi-Tenancy) und Anbindung der Microsoft-Anmeldung (O365 Identity).",
      "Typische REST-API (ASP.NET Core Web API, Swagger/OpenAPI); Datenmodellierung mit Entity Framework Core (Code-First) auf MSSQL.",
    ],
    ergebnis: [
      "Vollständige, mandantenfähige Geräteverwaltung mit Wartungshistorie und Dokumentenmanagement umgesetzt.",
      "Strukturierte technische Grundlage für effizientere Wartungs- und Reparaturprozesse der Technik.",
    ],
    tech: ["C#", ".NET Core", "ASP.NET Core", "ASP.NET Core Web API", "TypeScript", "React", "Entity Framework Core", "MSSQL", "Fluent UI", "Redux", "React Router", "Axios", "SPA", "Dependency Injection", "JWT", "O365 Identity", "RBAC", "Multi-Tenancy", "Azure", "Azure SQL", "Azure DevOps", "Docker", "CI/CD", "Clean Architecture"],
  },
];

export type SkillCategory = { num: string; name: string; items: string[] };

export const skills: SkillCategory[] = [
  { num: "01", name: "KI & LLM", items: ["LLM-Integration", "RAG", "Prompt Engineering", "Embeddings", "Vektor-Datenbanken (pgvector)", "Semantische Suche", "Dokumentenanalyse", "OCR", "LangChain", "OpenAI API", "Azure OpenAI", "Anthropic Claude API", "Hugging Face", "Ollama", "KI-Agenten / Agentic"] },
  { num: "02", name: "Agentic Coding", items: ["Claude Code", "Cursor AI", "Code Rabbit"] },
  { num: "03", name: "Backend & Sprachen", items: ["TypeScript", "Python", "JavaScript", "C#", "Node.js", "NestJS", "Express.js", "Fastify", "FastAPI", "Flask", "ASP.NET Core", ".NET", "GraphQL", "REST API / OpenAPI", "WebSockets / Realtime", "Webhooks", "Microservices", "Message Queues (BullMQ, RabbitMQ)", "SQL", "Bash"] },
  { num: "04", name: "Frontend", items: ["React", "Next.js", "Angular", "React Native", "Ionic", "Redux", "NgRx", "RxJS", "TanStack Query", "React Hook Form", "Zod", "Tailwind CSS", "shadcn/ui", "Material UI (MUI)", "Fluent UI", "SCSS", "HTML / CSS", "PWA", "Responsive Design", "Barrierefreiheit (WCAG)", "i18n / Mehrsprachigkeit", "SPA", "Storybook"] },
  { num: "05", name: "Design", items: ["Figma", "Design System", "UI/UX-Umsetzung"] },
  { num: "06", name: "Datenbanken & Daten", items: ["PostgreSQL", "MSSQL", "MariaDB / MySQL", "MongoDB (Mongoose)", "SQLite", "Redis", "pgvector", "Prisma", "MikroORM", "TypeORM", "Drizzle ORM", "Entity Framework Core", "DTOs", "Daten-Synchronisation", "CSV-Verarbeitung"] },
  { num: "07", name: "DevOps, Cloud & Infrastruktur", items: ["Docker / Compose", "CI/CD", "GitHub Actions", "GitLab CI", "Azure Pipelines", "Jenkins", "Nginx", "Sentry", "Linux / Ubuntu", "Self-Hosting", "Azure", "Azure Functions", "Google Cloud Platform", "AWS", "Hetzner", "IONOS", "Digital Ocean", "Vercel", "Azure App Service", "Azure SQL", "Azure Blob Storage", "Supabase", "Firebase", "DevSecOps"] },
  { num: "08", name: "Architektur & Prinzipien", items: ["Clean Architecture", "Clean Code", "SOLID", "Domain-Driven Design", "Separation of Concerns", "Microservices", "Event-Driven Architecture", "Monorepo (Nx / Turborepo)", "Systemintegration", "Plattform-Migration", "Dependency Injection", "Middleware", "API-First / OpenAPI", "Resilience-Patterns", "Type Safety"] },
  { num: "09", name: "Methodik & Zusammenarbeit", items: ["Scrum / Agile", "Kanban", "Scrumban", "Code Reviews", "Test-Driven Development", "CI/CD", "Observability / Monitoring"] },
  { num: "10", name: "Datenschutz & Compliance", items: ["AVV nach Art. 28 DSGVO", "Hosting in DE/EU", "Datenminimierung by Design", "DSGVO by Design", "EU AI Act", "GoBD", "RDG"] },
  { num: "11", name: "Testing & QA", items: ["Jest", "Vitest", "Cypress", "Playwright", "React Testing Library", "Postman / API-Testing", "E2E- & Unit-Testing"] },
  { num: "12", name: "Tooling", items: ["Git", "GitHub", "GitLab", "VS Code", "Visual Studio", "Azure DevOps", "Jira", "Linear", "Postman", "Figma", "Bluedot", "Amplitude"] },
];

/* Headings for the floating table-of-contents navigation. */
export type TocItem = { id: string; label: string; level: 1 | 2 };

export const sections: TocItem[] = [
  { id: "kontakt", label: "Kontakt", level: 2 },
  { id: "sprachen", label: "Sprachen", level: 2 },
  { id: "arbeitsweise", label: "Arbeitsweise", level: 2 },
  { id: "schwerpunkt", label: "Schwerpunkt", level: 1 },
  { id: "projekte", label: "Projekte", level: 1 },
  { id: "skills", label: "Skills", level: 1 },
];
