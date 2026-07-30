import referencesData from "./references.json";

export type Span = { t: string; b?: boolean };
export type RichLine = Span[];

export const profile = {
  name: "Nikita Petrich",
  role: "Senior Full-Stack & AI Engineer",
  booking: "https://calendar.notion.so/meet/petrichnikita/erstgespraech-30-min",
  accent: "#e1852e",
};

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
  { label: "Stundensatz", value: "auf Anfrage" },
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
  { label: "freelancermap", href: "https://www.freelancermap.de/profil/nikita-petrich" },
  { label: "Malt", href: "https://www.malt.de/profile/nikitapetrich" },
];

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
  /** Client / company the project was for ("Eigenprodukt" for own products). */
  company?: string;
  /** Company/product website; makes the company name a link when set. */
  companyUrl?: string;
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

export const projects: Project[] = [
  {
    num: "01", slug: "bescheidklar", name: "BESCHEIDKLAR", company: "Eigenprodukt", companyUrl: "https://bescheidklar.de", subtitle: "KI-gestützte LegalTech-SaaS-Plattform",
    cat: "LegalTech / GovTech", role: "Gründer & CTO",
    dateRange: "04/2025 – heute", sort: "2025-04",
    caption: "KI-Vorprüfungs-Dashboard für Bescheide",
    cover: "/assets/projects/bescheidklar.jpg", cardTags: ["LegalTech", "KI · RAG"],
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
    tech: ["TypeScript", "Python", "Next.js", "React", "FastAPI", "LLM-Integration", "OpenAI API", "Azure OpenAI", "RAG (Retrieval Augmented Generation)", "Prompt Engineering", "Embeddings", "pgvector", "OCR", "Dokumentenanalyse", "LangChain", "PostgreSQL", "Redis", "Tailwind CSS", "shadcn/ui", "Stripe", "JWT", "OAuth 2.0", "Docker", "GitHub Actions", "CI/CD", "Hetzner", "Linux", "Ubuntu", "Slack", "Microservices", "Clean Architecture", "SaaS", "EU AI Act", "DSGVO", "Privacy by Design", "Produktverantwortung"],
  },
  {
    num: "02", slug: "manifest-os", name: "Manifest OS", company: "Manifest Law", companyUrl: "https://manifestlaw.com", subtitle: "KI-gestützte Einwanderungsplattform",
    cat: "LegalTech / Immigration", role: "Full-Stack Engineer (KI-Feature-Integration)",
    dateRange: "12/2025 – 04/2026 · 5 Monate", sort: "2025-12",
    caption: "B2X-Portal — Fallübersicht",
    cover: "/assets/projects/manifest-os.jpg", cardTags: ["LegalTech", "KI-Features"],
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
    tech: ["TypeScript", "Python", "Next.js", "React", "NestJS", "Node.js", "Fastify", "Express.js", "REST API", "Webhooks", "DTOs", "BullMQ", "RabbitMQ", "LLM-Integration", "OpenAI API", "Anthropic Claude API", "Model Context Protocol (MCP)", "Bluedot", "Amplitude", "PostgreSQL", "Redis", "MikroORM", "TanStack Query", "better-auth", "JWT", "Docker", "Linux", "Ubuntu", "Google Cloud Platform (GCP)", "GitHub Actions", "CI/CD", "Claude Code", "Cursor AI", "Code Rabbit", "Linear", "Figma", "Slack", "Playwright", "Microservices", "Event-Driven Architecture", "Idempotenz", "Clean Architecture"],
  },
  {
    num: "03", slug: "aitoi", name: "AITOI", company: "AITOI", subtitle: "Interaktives IoT-Spielzeug (MVP)",
    cat: "IoT / Consumer Electronics", role: "Frontend Engineer",
    dateRange: "08/2025 – 09/2025 · 2 Monate", sort: "2025-08",
    caption: "PWA WLAN-Onboarding Flow",
    cover: "/assets/projects/aitoi.jpg", cardTags: ["IoT", "PWA"],
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
    tech: ["TypeScript", "Next.js", "React", "Progressive Web App (PWA)", "Responsive Design", "Design System", "React Hook Form", "DTOs", "Device Pairing", "Supabase", "Supabase Realtime", "Row Level Security", "PostgreSQL", "Tailwind CSS", "shadcn/ui", "JWT", "Authentifizierung", "Docker", "Linux", "Ubuntu", "CI/CD", "GitHub Actions", "Vitest", "Cursor AI", "Model Context Protocol (MCP)", "MVP-Entwicklung", "Clean Architecture"],
  },
  {
    num: "04", slug: "dino", name: "DiNo", company: "LeXtorByte UG", companyUrl: "https://digitales-notariat.de", subtitle: "Digitales Notariat",
    cat: "LegalTech / Notariat", role: "Frontend Engineer",
    dateRange: "01/2025 – 05/2025 · 5 Monate", sort: "2025-01",
    caption: "Mandantenportal — Vorgangsübersicht",
    cover: "/assets/projects/dino.jpg", cardTags: ["LegalTech", "Frontend"],
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
    tech: ["TypeScript", "React", "Python", "Flask", "REST API", "OpenAPI", "DTOs", "MariaDB", "MySQL", "Redux", "React Router", "React Hook Form", "Material UI (MUI)", "Single Page Application (SPA)", "Nutzerführung", "Mandantenportal", "Digitale Archivführung", "JWT", "OAuth 2.0", "Role-Based Access Control (RBAC)", "DSGVO", "Docker", "Nginx", "Linux", "Ubuntu", "GitLab", "Slack", "Clean Architecture"],
  },
  {
    num: "05", slug: "accounting-os", name: "AccountingOS", company: "HD Autoservice", subtitle: "GoBD-konformes Buchhaltungs- & Lagersystem",
    cat: "Handel & Kfz-Gewerbe", role: "Sole Developer · Full-Stack & AI",
    dateRange: "01/2024 – 12/2024 · 12 Monate · lfd. Wartung", sort: "2024-01",
    caption: "Lagerverwaltung & Rechnungsmodul",
    cover: "/assets/projects/accounting-os.jpg", cardTags: ["Warenwirtschaft", "Full-Stack"],
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
    tech: ["TypeScript", "Node.js", "NestJS", "Next.js", "React", "Fastify", "REST API", "GraphQL", "DTOs", "Typsicherheit", "Daten-Synchronisation", "CSV-Verarbeitung", "Message Queues", "Caching", "MariaDB", "PostgreSQL", "Redis", "MikroORM", "TanStack Query", "Tailwind CSS", "Warenwirtschaft", "Lagerverwaltung", "Buchhaltung", "ERP", "GoBD", "better-auth", "JWT", "Role-Based Access Control (RBAC)", "Docker", "Self-Hosting", "Linux", "Ubuntu", "CI/CD", "GitHub", "GitHub Actions", "Claude Code", "Cursor AI", "Model Context Protocol (MCP)", "Microservices", "Clean Architecture"],
  },
  {
    num: "06", slug: "lkw-tourverwaltung", name: "LadeTrans", company: "CDH Stephanus", companyUrl: "https://cdh-stephanus.org", subtitle: "LKW-Tourverwaltungssystem",
    cat: "Logistik & Transport", role: "Sole Developer · Full-Stack & AI",
    dateRange: "02/2021 – 05/2023 · 2 J. 4 Mon. · lfd. Wartung", sort: "2021-02",
    caption: "Tourenplanung mit Echtzeit-Tracking",
    cover: "/assets/projects/lkw-tourverwaltung.jpg", cardTags: ["Logistik", "Full-Stack"],
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
    tech: ["TypeScript", "Node.js", "NestJS", "Next.js", "React", "Fastify", "REST API", "GraphQL", "PostgreSQL", "Redis", "MikroORM", "React Router", "Tailwind CSS", "Single Page Application (SPA)", "Logistik", "Tourenplanung", "Routenoptimierung", "Echtzeit-Tracking", "PDF-Generierung", "DOCX-Generierung", "Digitale Archivführung", "better-auth", "JWT", "Authentifizierung", "Role-Based Access Control (RBAC)", "Docker", "Self-Hosting", "Linux", "Ubuntu", "CI/CD", "GitHub Actions", "Claude Code", "Cursor AI", "Model Context Protocol (MCP)", "Slack", "Nginx", "Microservices", "Clean Architecture"],
  },
  {
    num: "07", slug: "xu-navigator", name: "XU Navigator", company: "XU Group", companyUrl: "https://xu.de", subtitle: "Enterprise-Lernplattform",
    cat: "EdTech / E-Learning", role: "Full-Stack Engineer",
    dateRange: "05/2020 – 02/2023 · 2 J. 10 Mon.", sort: "2020-05",
    caption: "Kursverwaltung & Zertifikats-Engine",
    cover: "/assets/projects/xu-navigator.jpg", cardTags: ["EdTech", "Microservices"],
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
    tech: ["TypeScript", "Angular", "Node.js", "NestJS", "Express.js", "REST API", "GraphQL", "MongoDB", "Mongoose", "NgRx", "RxJS", "Angular Material", "SCSS", "Figma", "Microsoft Azure", "Azure DevOps", "Azure Pipelines", "Azure App Service", "Azure Blob Storage", "Docker", "CI/CD", "JWT", "OAuth 2.0", "Single Sign-On (SSO)", "Learning Management System (LMS)", "Video-Streaming", "Microservices", "Clean Architecture"],
  },
  {
    num: "08", slug: "medizingeraete-ms", name: "Medizingeräte-MS", company: "Krankenhauskette (anonymisiert)", subtitle: "Managementsystem für Medizingeräte",
    cat: "HealthTech / Medizintechnik", role: "Full-Stack Engineer",
    dateRange: "01/2019 – 05/2020 · 1 J. 5 Mon.", sort: "2019-01",
    caption: "Geräte- & Wartungshistorie-Übersicht",
    cover: "/assets/projects/medizingeraete-ms.jpg", cardTags: ["HealthTech", ".NET"],
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
    tech: ["C#", ".NET Core", "ASP.NET Core", "ASP.NET Core Web API", "OpenAPI", "Swagger", "TypeScript", "React", "Entity Framework Core", "Datenmodellierung", "Microsoft SQL Server (MSSQL)", "Fluent UI", "Redux", "React Router", "Axios", "Single Page Application (SPA)", "Dependency Injection", "JWT", "O365 Identity", "Role-Based Access Control (RBAC)", "Multi-Tenancy", "Stammdatenverwaltung", "Dokumentenmanagement", "Microsoft Azure", "Azure SQL", "Azure DevOps", "Docker", "CI/CD", "Clean Architecture"],
  },
];

export type SkillCategory = { num: string; name: string; items: string[] };

/* The skill taxonomy doubles as the site's keyword surface: every item is
   rendered as a tag, is searchable in the skills gallery and feeds the
   `knowsAbout` list of the schema.org Person markup (components/notion/json-ld.tsx).
   Items are therefore spelled out the way a client or recruiter would search
   for them ("Role-Based Access Control (RBAC)", not "RBAC") — the substring
   filter matches both the abbreviation and the long form. Every skill belongs
   to exactly one category: a cross-listed tag would surface two near-identical
   cards for one search hit. */
export const skills: SkillCategory[] = [
  { num: "01", name: "KI, LLM & AI Engineering", items: ["LLM-Integration", "RAG (Retrieval Augmented Generation)", "Prompt Engineering", "Embeddings", "Vektordatenbanken", "pgvector", "Semantische Suche", "Dokumentenanalyse", "OCR", "LangChain", "OpenAI API", "Azure OpenAI", "Anthropic Claude API", "Hugging Face", "Ollama", "KI-Agenten", "Agentic Software Engineering", "KI-gestützte Automatisierung", "AI Engineering", "Künstliche Intelligenz", "DSGVO-konforme KI-Architektur"] },
  { num: "02", name: "Agentic Coding", items: ["Claude Code", "Cursor AI", "GitHub Copilot", "Code Rabbit", "ChatGPT", "Lovable", "v0", "Claude Code Hooks", "Slash Commands", "Agent Skills", "Subagenten", "Multi-Agent-Workflows", "Model Context Protocol (MCP)", "Agentic Coding", "Context Engineering", "Spec-Driven Development", "Agentische Pull-Request-Workflows", "KI-gestützte Testgenerierung"] },
  { num: "03", name: "Programmiersprachen", items: ["TypeScript", "JavaScript", "Python", "C#", "SQL", "Bash", "HTML", "CSS", "SCSS", "XML", "UML"] },
  { num: "04", name: "Backend & Frameworks", items: ["Node.js", "NestJS", "Express.js", "Fastify", "FastAPI", "Flask", "ASP.NET Core", ".NET Core", "GraphQL", "REST API", "OpenAPI", "Swagger", "WebSockets", "Webhooks", "Message Queues", "BullMQ", "RabbitMQ", "Backend-Entwicklung", "Objektorientierte Programmierung (OOP)"] },
  { num: "05", name: "Frontend", items: ["React", "Next.js", "Angular", "React Native", "Ionic", "Redux", "NgRx", "RxJS", "TanStack Query", "React Hook Form", "React Router", "Axios", "Zod", "Tailwind CSS", "shadcn/ui", "Material UI (MUI)", "Fluent UI", "Single Page Application (SPA)", "Progressive Web App (PWA)", "Server-Side Rendering (SSR)", "Internationalisierung (i18n)", "Frontend-Entwicklung", "Web-Entwicklung"] },
  { num: "06", name: "Design & UX", items: ["Figma", "Wireframing", "Prototyping", "Design System", "Design Tokens", "Komponentenbibliotheken", "Storybook", "UI/UX Design", "UI-Implementierung", "Responsive Design", "Mobile First", "Barrierefreiheit (WCAG)", "Usability", "Nutzerführung", "Onboarding-Flows", "Informationsarchitektur", "UX Writing", "Microcopy", "Design Reviews"] },
  { num: "07", name: "Datenbanken & Daten", items: ["PostgreSQL", "MySQL", "MariaDB", "Microsoft SQL Server (MSSQL)", "MongoDB", "Mongoose", "NoSQL", "SQLite", "Redis", "Prisma", "MikroORM", "TypeORM", "Drizzle ORM", "Entity Framework Core", "Datenmodellierung", "Datenarchitektur", "DTOs", "Daten-Synchronisation", "ETL", "CSV-Verarbeitung", "Caching", "Idempotenz"] },
  { num: "08", name: "DevOps, Cloud & Infrastruktur", items: ["Docker", "Docker Compose", "CI/CD", "Continuous Integration", "GitHub Actions", "GitLab CI", "Azure Pipelines", "Jenkins", "Nginx", "Sentry", "Monitoring", "Observability", "Linux", "Ubuntu", "Self-Hosting", "Microsoft Azure", "Azure Functions", "Azure App Service", "Azure Blob Storage", "Azure SQL", "Google Cloud Platform (GCP)", "Amazon Web Services (AWS)", "Hetzner", "IONOS", "Digital Ocean", "Vercel", "Supabase", "Firebase", "DevOps", "DevSecOps"] },
  { num: "09", name: "Auth & Security", items: ["JWT", "OAuth 2.0", "Single Sign-On (SSO)", "better-auth", "Authentifizierung", "Role-Based Access Control (RBAC)", "Row Level Security", "SSL/TLS", "Ende-zu-Ende-Verschlüsselung", "O365 Identity", "Secure by Design", "IT-Sicherheit"] },
  { num: "10", name: "Architektur & Prinzipien", items: ["Software-Architektur", "Clean Architecture", "Clean Code", "SOLID", "Design Patterns", "Domain-Driven Design", "Separation of Concerns", "Dependency Injection", "Microservices", "Event-Driven Architecture", "Monorepo", "Nx", "Turborepo", "Skalierbare Architektur", "Systemintegration", "Plattform-Migration", "Middleware", "API-First", "Resilience Patterns", "Typsicherheit", "MVP-Entwicklung"] },
  { num: "11", name: "Methodik & Zusammenarbeit", items: ["Agile Methoden", "Scrum", "Kanban", "Scrumban", "Code Reviews", "Test-Driven Development (TDD)", "Softwareentwicklung", "Projektmanagement", "IT-Beratung", "Requirements Engineering", "Remote Work", "Public Speaking"] },
  { num: "12", name: "Business & Strategie", items: ["IT-Strategie", "Digitalstrategie", "Digitale Transformation", "Prozessdigitalisierung", "Produktverantwortung", "Entrepreneurship"] },
  { num: "13", name: "Datenschutz & Compliance", items: ["DSGVO", "Privacy by Design", "Datenminimierung", "Auftragsverarbeitungsvertrag (AVV)", "EU AI Act", "AI Governance", "GoBD", "Revisionssicherheit", "EU-Hosting", "Digitale Souveränität", "Barrierefreiheitsstärkungsgesetz (BFSG)", "European Accessibility Act (EAA)"] },
  { num: "14", name: "Testing & QA", items: ["Jest", "Vitest", "Cypress", "Playwright", "React Testing Library", "Unit Testing", "Integrationstests", "End-to-End-Tests", "Postman", "API-Testing", "Testautomatisierung"] },
  { num: "15", name: "Tooling", items: ["Git", "GitHub", "GitLab", "Visual Studio Code", "Visual Studio", "Jira", "Linear", "Slack", "Azure DevOps", "Bluedot", "Google Workspace (Meet, APIs)", "Amplitude", "Product Analytics"] },
  { num: "16", name: "Domänen & Branchen", items: ["LegalTech", "GovTech", "Kanzleisoftware", "Notariat", "Mandantenportal", "Dokumentenmanagement", "HealthTech", "Medizintechnik", "Instandhaltungsmanagement", "ERP", "Warenwirtschaft", "Lagerverwaltung", "Rechnungsstellung", "Auftragsverwaltung", "CRM", "Buchhaltung", "Stammdatenverwaltung", "Multi-Tenancy", "Stripe", "SEPA", "Zahlungsabwicklung", "Logistik", "Tourenplanung", "Routenoptimierung", "Echtzeit-Tracking", "PDF-Generierung", "Digitale Archivführung", "EdTech", "E-Learning", "Learning Management System (LMS)", "IoT", "Device Pairing", "Consumer Electronics", "SaaS", "Plattformentwicklung"] },
  { num: "17", name: "Rollen & Profil", items: ["Senior Full-Stack Engineer", "AI Engineer", "Software Engineer", "Freelance Developer", "Interim CTO", "Technischer Berater", "Fachinformatiker Anwendungsentwicklung", "Deutsch (Muttersprache)", "Englisch B2", "München", "DACH"] },
];

/* Course certificates, each served as a PDF from /public/zertifikate. The
   public URL /zertifikate/<slug>.pdf is a permanent, shareable link. */
export type Certificate = {
  /** Stable URL slug — the PDF lives at /zertifikate/<slug>.pdf forever. */
  slug: string;
  title: string;
  issuer: "Scrimba" | "Code with Mosh" | "Udemy";
  date: string;
  /** ISO completion date, used for sorting (newest first). */
  sort: string;
  /** Scope, e.g. "8,2 Std · 142 Lektionen". */
  detail?: string;
  cat: string;
  tags: string[];
  verifyUrl?: string;
  /** Official URL for certificates not (yet) self-hosted as a PDF. */
  externalUrl?: string;
};

/* Ordered newest first by default (mirrors the projects gallery). */
export const certificates: Certificate[] = [
  {
    slug: "ai-for-developers-github-copilot",
    title: "AI For Developers With GitHub Copilot, Cursor AI & ChatGPT",
    issuer: "Udemy",
    date: "Dezember 2025",
    sort: "2025-12-08",
    detail: "5,5 Std",
    cat: "KI / AI",
    tags: ["GitHub Copilot", "Cursor AI"],
    externalUrl:
      "https://www.udemy.com/certificate/UC-00859d2d-a91d-40bd-8ea8-cae70ce1c5da/",
  },
  {
    slug: "build-ai-powered-apps",
    title: "Build AI-Powered Apps",
    issuer: "Code with Mosh",
    date: "Dezember 2025",
    sort: "2025-12-07",
    cat: "KI / AI",
    tags: ["LLM", "OpenAI API"],
  },
  {
    slug: "angular-real-world-guide",
    title: "Angular Real World Guide — Build Angular & Firebase Apps",
    issuer: "Udemy",
    date: "November 2025",
    sort: "2025-11-13",
    detail: "10,5 Std",
    cat: "Frontend",
    tags: ["Angular", "Firebase"],
    verifyUrl:
      "https://www.udemy.com/certificate/UC-057de643-09eb-4285-86cb-dae81086f54f/",
  },
  {
    slug: "the-ai-engineer-path",
    title: "The AI Engineer Path",
    issuer: "Scrimba",
    date: "Juni 2025",
    sort: "2025-06-14",
    detail: "8,2 Std · 142 Lektionen",
    cat: "KI / AI",
    tags: ["AI Engineering", "RAG"],
  },
  {
    slug: "learn-python",
    title: "Learn Python",
    issuer: "Scrimba",
    date: "Juni 2025",
    sort: "2025-06-12",
    detail: "5,6 Std · 62 Lektionen",
    cat: "Python",
    tags: ["Grundlagen"],
  },
  {
    slug: "learn-accessible-web-design",
    title: "Learn Accessible Web Design",
    issuer: "Scrimba",
    date: "Juni 2025",
    sort: "2025-06-11",
    detail: "1,6 Std · 28 Lektionen",
    cat: "Accessibility",
    tags: ["WCAG", "Barrierefreiheit"],
  },
  {
    slug: "complete-python-mastery",
    title: "Complete Python Mastery",
    issuer: "Code with Mosh",
    date: "Juni 2025",
    sort: "2025-06-02",
    cat: "Python",
    tags: ["OOP"],
  },
];

/* Client & colleague references. Each has a stable slug so it can be linked
   from anywhere (e.g. the PDF CV) via /referenzen/<slug>; the slug is a
   permanent route and must never change once published. Projects without a
   (published) reference simply have no entry here. */
export type ReferenceSource = "LinkedIn" | "Malt";

/* Where a testimonial can be verified — rendered as a linked tag on each card.
   Both point at Nikita's own public profiles (his received recommendations).
   Sourced from lib/references.json so the website and the PDF CV stay in sync. */
export const referenceSources: Record<
  ReferenceSource,
  { label: string; href: string }
> = referencesData.sources as Record<
  ReferenceSource,
  { label: string; href: string }
>;

export type Reference = {
  /** Stable slug — the reference lives at /referenzen/<slug> forever. */
  slug: string;
  name: string;
  role: string;
  /** Company or organisation the recommender represents. */
  company?: string;
  /** Company website; makes the company name a link when set. */
  companyUrl?: string;
  /** Relationship to Nikita, e.g. "Kunde", "ehem. Kollege". */
  relation: string;
  /** Slug of the related case study (links to /projekte/<slug>). */
  projectSlug?: string;
  /** Human-readable project label shown on the card. */
  project: string;
  /** Verifiable sources; each renders as an outbound tag. */
  sources: ReferenceSource[];
  /** ISO date for sorting (newest first), mirroring the related project. */
  sort: string;
  /** Full testimonial, shown on the website. */
  quote: string;
  /** Condensed pull-quote for the compact PDF CV listing. */
  short: string;
};

/* Ordered newest first, mirroring the projects gallery. Content lives in
   lib/references.json so the website and the PDF CV share one source.

   The JSON import is unchecked by TypeScript, so validate it at module load —
   a typo in the JSON then fails the build (generateStaticParams) instead of
   crashing in the browser. */
function assertReferences(data: unknown): Reference[] {
  if (!Array.isArray(data)) throw new Error("references.json: kein Array");
  const projectSlugs = new Set(projects.map((p) => p.slug));
  for (const r of data as Reference[]) {
    if (!r.slug || !r.name || !r.role || !r.relation || !r.project || !r.sort || !r.quote || !r.short) {
      throw new Error(`references.json: Pflichtfeld fehlt bei "${r.slug ?? "?"}"`);
    }
    for (const s of r.sources) {
      if (!(s in referenceSources)) {
        throw new Error(`references.json: unbekannte Quelle "${s}" bei "${r.slug}"`);
      }
    }
    if (r.projectSlug && !projectSlugs.has(r.projectSlug)) {
      throw new Error(`references.json: unbekannter projectSlug "${r.projectSlug}" bei "${r.slug}"`);
    }
  }
  return data as Reference[];
}

export const references: Reference[] = assertReferences(referencesData.references);

/* Headings for the floating table-of-contents navigation. */
export type TocItem = { id: string; label: string; level: 1 | 2 };

export const sections: TocItem[] = [
  { id: "kontakt", label: "Kontakt", level: 2 },
  { id: "eckdaten", label: "Eckdaten", level: 2 },
  { id: "sprachen", label: "Sprachen", level: 2 },
  { id: "arbeitsweise", label: "Arbeitsweise", level: 2 },
  { id: "schwerpunkt", label: "Schwerpunkt", level: 1 },
  { id: "projekte", label: "Projekte", level: 1 },
  { id: "referenzen", label: "Referenzen", level: 1 },
  { id: "skills", label: "Skills", level: 1 },
  { id: "zertifikate", label: "Zertifikate", level: 1 },
];
