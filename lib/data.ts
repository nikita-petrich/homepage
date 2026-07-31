import referencesData from "./references.json";

export type Span = { t: string; b?: boolean };
export type RichLine = Span[];

export const profile = {
  name: "Nikita Petrich",
  role: "Senior Full-Stack & AI Engineer",
  booking: "https://calendar.notion.so/meet/petrichnikita/erstgespraech-30-min",
  accent: "#ff9900",
};

export type CvFile = { href: string; label: string; flag: string; sub: string };
export const cvFiles: CvFile[] = [
  { href: "/cv/CV_Nikita_Petrich_DE.pdf", label: "CV Deutsch", flag: "/assets/flags/de.svg", sub: "PDF · 10 Seiten" },
  { href: "/cv/CV_Nikita_Petrich_EN.pdf", label: "CV EN", flag: "/assets/flags/gb.svg", sub: "PDF · 10 pages" },
];

/* Intrinsic viewBox ratios of the flag SVGs (DE is 5:3, GB is 2:1). next/image
   needs width/height in the real ratio so a fixed-height + auto-width render
   scales uniformly and doesn't trip its dev-only "width or height modified, but
   not the other" warning. */
export const flagDimensions: Record<string, { width: number; height: number }> = {
  "/assets/flags/de.svg": { width: 5, height: 3 },
  "/assets/flags/gb.svg": { width: 60, height: 30 },
};

export type InfoItem = { icon: string; text: string; href?: string };

export const contact: InfoItem[] = [
  { icon: "📞", text: "+49 15679088678", href: "tel:+4915679088678" },
  { icon: "✉️", text: "n.petrich@sequenz.io", href: "mailto:n.petrich@sequenz.io" },
  { icon: "🌐", text: "https://sequenz.io", href: "https://sequenz.io" },
];

/* An array value is rendered as one line per entry — for facts that carry
   several independent statements and would otherwise wrap awkwardly in the
   210px sidebar. */
export type FactItem = { label: string; value: string | string[] };

export const facts: FactItem[] = [
  { label: "Erfahrung", value: "7+ Jahre" },
  { label: "Verfügbar", value: "ab sofort · Vollzeit" },
  { label: "Stundensatz", value: "auf Anfrage" },
  { label: "Qualifikation", value: "IHK-Fachinformatiker (AE)" },
  {
    label: "Einsatzort",
    value: [
      "Remote (bevorzugt)",
      "München hybrid: 1–2 Tage/Woche",
      "Fernreisen: 1–2 Tage/Monat",
    ],
  },
  { label: "Onboarding", value: "Anreise vor Ort (bei Bedarf)" },
];

export type Language = { flag: string; text: string; sub: string };

export const languages: Language[] = [
  { flag: "/assets/flags/de.svg", text: "Deutsch", sub: "Muttersprache" },
  { flag: "/assets/flags/gb.svg", text: "Englisch", sub: "B2 · US/EU-Remote" },
];

export const approach: string[] = [
  "ergebnisorientiert",
  "eigenverantwortlich & zuverlässig",
  "autonome, asynchrone Arbeitsweise",
  "klare Kommunikation (DE/EN)",
];

/* Methods actually used in the projects (see each project's "Methodik"),
   mirrored from the "Methodik & Zusammenarbeit" skill category so the
   sidebar and the skills database never claim different things. */
export const methods: string[] = [
  "Scrum",
  "Scrumban",
  "Kanban",
  "Code Reviews",
  "Requirements Engineering",
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

export const focus: string[] = [
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
  responsibilities: string[];
  results: string[];
  tech: string[];
};

export const projects: Project[] = [
  {
    num: "01", slug: "bescheidklar", name: "BESCHEIDKLAR", company: "Eigenprodukt", companyUrl: "https://bescheidklar.de", subtitle: "KI-gestützte LegalTech-SaaS-Plattform",
    cat: "LegalTech / GovTech", role: "Gründer & CTO",
    dateRange: "04/2025 – heute", sort: "2025-04",
    caption: "KI-Vorprüfung für Bescheide",
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
    responsibilities: [
      "Aufbau einer modularen, service-orientierten Architektur für Betroffenen-Frontend, Kanzlei-Bereich und das regionale Lizenzmodell (Stripe).",
      "KI-Vorprüfungs-Pipeline für Bescheide und Kündigungen (in Umsetzung): Extraktion → Fristprüfung → Plausibilitäts- und Erfolgseinschätzung mit strukturierter Aufbereitung des Falls.",
      "Automatisierte, DSGVO-konforme Übergabe qualifizierter Leads inkl. hochgeladener Dokumente an passende Spezialisten (Rechtsanwälte, Law Clinics).",
      "RAG-basierter Ratgeber-Bereich mit Artikeln und Handlungsempfehlungen für Betroffene.",
      "Gesamtverantwortung für Tech-Stack, Hosting auf EU-Infrastruktur und ein Secure-by-Design-Compliance-Konzept (EU AI Act, DSGVO, RDG).",
    ],
    results: [
      "MVP in Eigenregie umgesetzt – Architektur, Plattform und Betrieb auf EU-Infrastruktur aus einer Hand.",
      "Compliance im Produktdesign verankert statt nachgerüstet: EU AI Act, DSGVO und die Grenzen des RDG von Beginn an eingeplant.",
      "Zielbild: bis zu 10.000 automatisierte Vorprüfungen pro Monat und bis zu 80 % weniger manuelle Fallannahme – in einem Markt mit 167.547 zugelassenen Rechtsanwältinnen und Rechtsanwälten (BRAK, 01.01.2026).",
    ],
    tech: ["TypeScript", "Python", "Next.js", "React", "FastAPI", "LLM-Integration", "OpenAI API", "Azure OpenAI", "RAG (Retrieval Augmented Generation)", "Prompt Engineering", "Embeddings", "pgvector", "OCR", "Dokumentenanalyse", "LangChain", "PostgreSQL", "Redis", "Tailwind CSS", "shadcn/ui", "Stripe", "JWT", "OAuth 2.0", "Docker", "GitHub Actions", "CI/CD", "Hetzner", "Linux", "Ubuntu", "Slack", "Microservices", "Clean Architecture", "SaaS", "EU AI Act", "DSGVO", "Privacy by Design", "Produktverantwortung"],
  },
  {
    num: "02", slug: "manifest-os", name: "Manifest OS", company: "Manifest Law", companyUrl: "https://manifestlaw.com", subtitle: "KI-gestützte Einwanderungsplattform",
    cat: "LegalTech / Immigration", role: "Full-Stack Engineer (KI-Feature-Integration)",
    dateRange: "12/2025 – 04/2026 · ~5 Monate", sort: "2025-12",
    caption: "B2X-Portal — Fallübersicht",
    cover: "/assets/projects/manifest-os.jpg", cardTags: ["LegalTech", "KI-Features"],
    desc: "KI-Feature-Integration in einer etablierten US-Einwanderungsplattform (~60 Mio. USD Bewertung) mit über 3.000 Kunden und über 100 Anwältinnen und Anwälten.",
    meta: [
      { label: "Rolle", value: "Full-Stack Engineer" },
      { label: "Team", value: "~20 Engineers in 4 Teams · Platform, AI, Fullstack" },
      { label: "Standort", value: "New York, USA · Remote" },
      { label: "Sprache", value: "Englisch · EU & US" },
      { label: "Website", value: "manifestlaw.com" },
      { label: "Methodik", value: "Scrum · autonom · mit PM und Design" },
    ],
    responsibilities: [
      "Produktive KI-Anreicherung anwaltlicher Erstgespräch-Leads (HubSpot, Cal.com, Bluedot): Aufzeichnungen werden transkribiert, über Webhook und BullMQ-Queue an die OpenAI-Integration übergeben und strukturiert in die Kernsysteme zurückgeschrieben – als Grundlage für eine effizientere Fallbearbeitung.",
      "KI-gestützte Evidence-Verarbeitung: hochgeladene Falldokumente werden automatisiert analysiert, klassifiziert und einheitlich benannt.",
      "Konsolidierung von vier Portalen (B2B, B2C, Lawyer, Ops) in ein einheitliches „B2X“-Portal – im Team aus vier Engineers, mit Schwerpunkt auf der Fullstack-Migration der B2B- und Ops-Bereiche.",
      "Einführung eines anwendungsweiten Event-Trackings (Amplitude) als Datengrundlage für Produkt- und Data-Analytics.",
      "Resilienz der ereignisgetriebenen Services (NestJS, BullMQ): Retry-Strategien, Idempotenz und definiertes Verhalten bei Ausfällen der KI- und Transkriptions-Dienste.",
    ],
    results: [
      "KI-Features im Produktivbetrieb: Erstgespräch-Leads und Falldokumente werden ohne manuelle Nacharbeit angereichert, klassifiziert und benannt.",
      "Anwendungsweites Event-Tracking als gemeinsame Datengrundlage für Produkt- und Data-Analytics etabliert.",
      "Refactoring-Initiativen in den migrierten B2B- und Ops-Bereichen: bestehende Strukturen vereinfacht und auf bessere Wartbarkeit ausgerichtet.",
      "Laut Anbieter über 3.000 Kunden, 150+ Corporate-Programme und bis zu 15 % höhere Genehmigungsraten gegenüber dem USCIS-Durchschnitt (Team-Ergebnis).",
    ],
    tech: ["TypeScript", "Python", "Next.js", "React", "NestJS", "Node.js", "Fastify", "Express.js", "REST API", "Webhooks", "DTOs", "BullMQ", "RabbitMQ", "LLM-Integration", "OpenAI API", "Anthropic Claude API", "Model Context Protocol (MCP)", "Bluedot", "HubSpot", "Cal.com", "Amplitude", "PostgreSQL", "Redis", "MikroORM", "TanStack Query", "better-auth", "JWT", "Docker", "Linux", "Ubuntu", "Google Cloud Platform (GCP)", "GitHub Actions", "CI/CD", "Claude Code", "Cursor AI", "Code Rabbit", "Linear", "Figma", "Slack", "Playwright", "Microservices", "Event-Driven Architecture", "Idempotenz", "Clean Architecture"],
  },
  {
    num: "03", slug: "rate-up", name: "RateUp", company: "Krutzfeld Tech GmbH", companyUrl: "https://krutzfeld.tech", subtitle: "Bewertungs-App für Web, iOS und Android",
    cat: "Social Media / Mobile App", role: "Sole Developer · Full-Stack",
    dateRange: "11/2025 – 12/2025 · ~2 Monate", sort: "2025-11",
    caption: "Cross-Platform-App für Web, iOS und Android",
    cardTags: ["Social Media", "Cross-Platform"],
    desc: "Cross-Platform-App im Social-Media-Umfeld: Bewertungen, Feed und Profile aus einer Ionic-/Angular-Codebasis für Web, iOS und Android – Backend vollständig auf Firebase.",
    meta: [
      { label: "Rolle", value: "Sole Developer · Full-Stack" },
      { label: "Team", value: "Solo · Kundenprojekt" },
      { label: "Standort", value: "Zürich, CH · Remote" },
      { label: "Sprache", value: "Deutsch" },
      { label: "Website", value: "krutzfeld.tech" },
      { label: "Methodik", value: "Eigenverantwortlich" },
    ],
    responsibilities: [
      "Bewertungs-App im Social-Media-Umfeld aus einer einzigen Ionic-/Angular-Codebasis – als installierbare PWA im Web und als native Builds für iOS und Android (Capacitor).",
      "Registrierung, Login und Onboarding inklusive Profilerstellung (Firebase Authentication), abgesichert über Firebase Security Rules.",
      "Social-Media-Feed mit Filtern, eigenen Beiträgen und Media-Upload (Cloud Firestore, Cloud Storage).",
      "Serverseitige Logik in Cloud Functions, Auslieferung über Firebase Hosting und eine CI/CD-Pipeline (GitHub Actions) für alle drei Plattformen.",
      "Wartbare Codebasis für die Übergabe: klar geschichtete Struktur, wiederverwendbare Komponenten, typsichere Modelle, Unit-Tests und durchgängiger Clean-Code-Stil (SOLID).",
    ],
    results: [
      "Fertiges Produkt an den Kunden übergeben – lauffähig als PWA im Web und als native App auf iOS und Android aus einer gemeinsamen Codebasis.",
      "Vollständig auf Firebase aufgesetzt: Authentifizierung, Datenhaltung, Media-Storage, Serverlogik und Auslieferung.",
      "Übergabefähige Codebasis: einheitliche Struktur, wiederverwendbare Komponenten, Unit-Tests und durchgängige Typsicherheit – das Kundenteam kann ohne Einarbeitungshürde weiterarbeiten.",
      "Von der ersten Zeile bis zur Übergabe in rund zwei Monaten.",
    ],
    tech: ["TypeScript", "Angular", "Ionic", "Capacitor", "RxJS", "Cross-Platform-Entwicklung", "iOS", "Android", "Progressive Web App (PWA)", "Responsive Design", "UI-Implementierung", "Nutzerführung", "Firebase", "Firebase Authentication", "Firebase Security Rules", "Cloud Firestore", "Cloud Storage", "Cloud Functions", "Firebase Cloud Messaging (FCM)", "Firebase Hosting", "Authentifizierung", "Onboarding-Flows", "Social Media", "Typsicherheit", "Unit Testing", "Clean Code", "SOLID", "Separation of Concerns", "Clean Architecture", "Git", "GitHub", "GitHub Actions", "CI/CD", "Linux"],
  },
  {
    num: "04", slug: "aitoi", name: "AITOI", company: "AITOI", subtitle: "Interaktives IoT-Spielzeug (MVP)",
    cat: "IoT / Consumer Electronics", role: "Frontend Engineer",
    dateRange: "08/2025 – 09/2025 · ~2 Monate", sort: "2025-08",
    caption: "PWA WLAN-Onboarding Flow",
    cover: "/assets/projects/aitoi.jpg", cardTags: ["IoT", "PWA"],
    desc: "PWA-Frontend für ein vernetztes KI-Spielzeug: WLAN-Onboarding per QR-Code-Scan, Gerätekopplung und Echtzeit-Synchronisation.",
    meta: [
      { label: "Rolle", value: "Frontend Engineer" },
      { label: "Team", value: "Interdisziplinär · inkl. Hardware" },
      { label: "Standort", value: "Frankfurt, DE · Remote" },
      { label: "Sprache", value: "Englisch" },
      { label: "Sichtbarkeit", value: "Internes System" },
      { label: "Methodik", value: "Eigenverantwortlich" },
    ],
    responsibilities: [
      "Setup-App für die Erst-Einrichtung neuer Geräte: WLAN-Onboarding per QR-Code-Scan mit geführtem Flow, Gerätekopplung und robuster Fehlerbehandlung.",
      "PWA-Dashboard für Eltern: Spielsessions der Kinder nachverfolgen, filtern und auswerten.",
      "Nachträgliche Konfiguration gekoppelter Geräte über dieselbe plattformunabhängige PWA.",
      "Anbindung von Supabase für Authentifizierung, Datenhaltung und Echtzeit-Synchronisation (inkl. Row Level Security).",
      "Performante PWA-Architektur (Next.js) mit responsivem UI, Unit-Tests und CI/CD-Pipeline.",
    ],
    results: [
      "Voll funktionsfähiges MVP-Frontend in ~2–3 Wochen reiner Arbeitszeit – eigenständig von Konzept über Kundenabstimmung bis zur Demo.",
      "Setup-App und Eltern-Dashboard als eine plattformunabhängige PWA, in Echtzeit mit dem IoT-Gerät synchronisiert.",
      "Skalierbare, dokumentierte Architektur als tragfähige Grundlage für den Produktlaunch.",
    ],
    tech: ["TypeScript", "Next.js", "React", "Progressive Web App (PWA)", "Responsive Design", "Design System", "React Hook Form", "DTOs", "Device Pairing", "Supabase", "Supabase Realtime", "Row Level Security", "PostgreSQL", "Tailwind CSS", "shadcn/ui", "JWT", "Authentifizierung", "Docker", "Linux", "Ubuntu", "CI/CD", "GitHub Actions", "Vitest", "Cursor AI", "Model Context Protocol (MCP)", "MVP-Entwicklung", "Clean Architecture"],
  },
  {
    num: "05", slug: "dino", name: "DiNo", company: "LeXtorByte UG", companyUrl: "https://digitales-notariat.de", subtitle: "Digitales Notariat",
    cat: "LegalTech / Notariat", role: "Frontend Engineer",
    dateRange: "01/2025 – 05/2025 · ~5 Monate", sort: "2025-01",
    caption: "Mandantenportal — Vorgangsübersicht",
    cover: "/assets/projects/dino.jpg", cardTags: ["LegalTech", "Frontend"],
    desc: "Frontend zur Digitalisierung von Notarprozessen mit Fokus auf klare, nachvollziehbare Nutzerführung – mehrere Portale für Notariat und Mandanten.",
    meta: [
      { label: "Rolle", value: "Frontend Engineer" },
      { label: "Team", value: "2–4 Personen" },
      { label: "Standort", value: "Oranienburg, DE · Remote" },
      { label: "Sprache", value: "Deutsch" },
      { label: "Website", value: "digitales-notariat.de" },
      { label: "Methodik", value: "Scrumban" },
    ],
    responsibilities: [
      "Digitale Vorgangsverwaltung über mehrere Portale hinweg: strukturierte Datenerfassung, digitale Verfahrensakten und nahtlose interne Ablage.",
      "Statusverfolgung im Mandantenportal (anteilig).",
      "Nutzerführung für erklärungsbedürftige Notarprozesse – jeder Schritt nachvollziehbar auch ohne juristische Vorkenntnisse.",
      "Oberflächen für Notariats- und Mandantenportal mit React und Material UI.",
      "Eigeninitiative in der Codebasis: wiederverwendbare Komponenten eingeführt, bestehenden Code refactored und Altfehler behoben – ausgerichtet auf langfristig tragfähige Lösungen.",
    ],
    results: [
      "Laut Anbieter bis zu 70 % weniger telefonische Rückfragen der Mandanten.",
      "Laut Anbieter werden Rechnungen bis zu 30 Tage früher bezahlt.",
      "Laut Anbieter spürbar reduzierter Verwaltungsaufwand durch durchgängig digitale Prozesse.",
    ],
    tech: ["TypeScript", "React", "Python", "Flask", "REST API", "OpenAPI", "DTOs", "MariaDB", "MySQL", "Redux", "React Router", "React Hook Form", "Material UI (MUI)", "Single Page Application (SPA)", "Nutzerführung", "Mandantenportal", "Digitale Archivführung", "JWT", "OAuth 2.0", "Role-Based Access Control (RBAC)", "DSGVO", "Docker", "Nginx", "Linux", "Ubuntu", "GitLab", "Slack", "Clean Architecture"],
  },
  {
    num: "06", slug: "accounting-os", name: "Accounting OS", company: "HD Autoservice", subtitle: "GoBD-konformes Buchhaltungs- & Lagersystem",
    cat: "Handel & Kfz-Gewerbe", role: "Sole Developer · Full-Stack & AI",
    dateRange: "01/2024 – 12/2024 · ~12 Monate · lfd. Wartung", sort: "2024-01",
    caption: "Lagerverwaltung & Rechnungsmodul",
    cover: "/assets/projects/accounting-os.jpg", cardTags: ["Warenwirtschaft", "Full-Stack"],
    desc: "GoBD-konformes Buchhaltungs- und Lagersystem mit resilientem Daten-Synchronisationsservice für Lieferanten-Kataloge (bis 20 Mio. CSV-Zeilen).",
    meta: [
      { label: "Rolle", value: "Sole Developer · Full-Stack & AI" },
      { label: "Team", value: "Solo · Kundenprojekt" },
      { label: "Standort", value: "Salzgitter, DE · Remote" },
      { label: "Sprache", value: "Deutsch" },
      { label: "Sichtbarkeit", value: "Internes System" },
      { label: "Methodik", value: "Eigenverantwortlich" },
    ],
    responsibilities: [
      "Buchhaltungsmodul: Rechnungen, Korrekturrechnungen, PDF-Export, Kundenverwaltung, Bestellimport mit GoBD-Festschreibung.",
      "Kopplung von Lagerverwaltung und Rechnungsmanagement (automatische Bestandsabbuchung, Mindestbestand-Benachrichtigung).",
      "Resilienter Daten-Synchronisationsservice („Pipe Service“) für Lieferanten-Kataloge – bis 20 Mio. CSV-Zeilen über TLS mit Queue, Caching, Retry-Logik, Validierung und Deduplizierung.",
      "Rollenbasierte Zugriffssteuerung (better-auth); typsichere GraphQL- und REST-Schnittstellen (NestJS, MikroORM, DTOs).",
      "Alleinverantwortung für Architektur (Clean Architecture), Deployment und laufende Wartung.",
    ],
    results: [
      "Laut Kunde bis zu 40 Stunden weniger Verwaltungsarbeit pro Monat – rund 480 Stunden im Jahr oder etwa 19.200 € bei kalkulatorisch 40 € Arbeitskosten je Stunde.",
      "Routineprozesse laufen laut Kunde mit bis zu 50 % weniger Zeitaufwand.",
      "Durchgängig digitale, GoBD-konforme Abläufe mit direkter Kopplung von Lager und Buchhaltung.",
    ],
    tech: ["TypeScript", "Node.js", "NestJS", "Next.js", "React", "Fastify", "REST API", "GraphQL", "DTOs", "Typsicherheit", "Daten-Synchronisation", "CSV-Verarbeitung", "Message Queues", "Caching", "MariaDB", "PostgreSQL", "Redis", "MikroORM", "TanStack Query", "Tailwind CSS", "Warenwirtschaft", "Lagerverwaltung", "Buchhaltung", "ERP", "GoBD", "better-auth", "JWT", "Role-Based Access Control (RBAC)", "Docker", "Self-Hosting", "Linux", "Ubuntu", "CI/CD", "GitHub", "GitHub Actions", "Claude Code", "Cursor AI", "Model Context Protocol (MCP)", "Microservices", "Clean Architecture"],
  },
  {
    num: "07", slug: "lkw-tourverwaltung", name: "LadeTrans", company: "CDH Stephanus", companyUrl: "https://cdh-stephanus.org", subtitle: "LKW-Tourverwaltung für eine humanitäre Hilfsorganisation",
    cat: "Logistik & Transport", role: "Sole Developer · Full-Stack & AI",
    dateRange: "02/2021 – 05/2023 · ~2 J. 4 Mon. · lfd. Wartung", sort: "2021-02",
    caption: "Ladeliste & Tourunterlagen je Vorgang",
    cover: "/assets/projects/lkw-tourverwaltung.jpg", cardTags: ["Logistik", "Full-Stack"],
    desc: "LKW-Tourverwaltungssystem für die Hilfstransporte einer humanitären Organisation: Ladelisten, Tourunterlagen und revisionssichere Archivführung je Tour.",
    meta: [
      { label: "Rolle", value: "Sole Developer · Full-Stack & AI" },
      { label: "Team", value: "Solo · Kundenprojekt" },
      { label: "Standort", value: "Bremen, DE · Remote" },
      { label: "Sprache", value: "Deutsch" },
      { label: "Website", value: "cdh-stephanus.org" },
      { label: "Methodik", value: "Eigenverantwortlich" },
    ],
    responsibilities: [
      "Ladelisten je Tour: zu versendende Ware, Empfängeradressen und Fahrer in einem Vorgang zusammengestellt.",
      "Jede Tour als durchgängiger Vorgang – anlegen, bearbeiten, abschließen und archivieren.",
      "Automatisierte Generierung der Tourunterlagen aus den erfassten Daten, u. a. für Grenzkontrollen.",
      "Revisionssichere Archivierung abgeschlossener Touren inkl. der am Tourende hochgeladenen Nachweise.",
      "Alleinverantwortung für Backend-Architektur (NestJS, Clean Architecture), rollenbasierte Zugriffssteuerung (better-auth) und das selbst gehostete Deployment (Docker, Nginx) inkl. laufender Wartung.",
    ],
    results: [
      "Spart durch automatisierte Dokumentenprozesse laut Kunde bis zu 1.000 Stunden pro Jahr – bei kalkulatorisch 40 € Arbeitskosten je Stunde rund 40.000 € jährlich.",
      "Laut Kunde bis zu 20 % höhere Logistikeffizienz durch die durchgängige Verwaltung der Versandtouren.",
      "Deutlich reduzierte Übertragungsfehler; jede Tour ist mit Unterlagen und Nachweisen revisionssicher archiviert.",
    ],
    tech: ["TypeScript", "Node.js", "NestJS", "Next.js", "React", "Fastify", "REST API", "GraphQL", "PostgreSQL", "Redis", "MikroORM", "React Router", "Tailwind CSS", "Single Page Application (SPA)", "Logistik", "Tourenplanung", "PDF-Generierung", "Digitale Archivführung", "better-auth", "JWT", "Authentifizierung", "Role-Based Access Control (RBAC)", "Docker", "Self-Hosting", "Linux", "Ubuntu", "CI/CD", "GitHub Actions", "Claude Code", "Cursor AI", "Model Context Protocol (MCP)", "Slack", "Nginx", "Microservices", "Clean Architecture"],
  },
  {
    num: "08", slug: "xu-navigator", name: "XU Navigator", company: "XU Group", companyUrl: "https://xu.de", subtitle: "Enterprise-Lernplattform",
    cat: "EdTech / E-Learning", role: "Full-Stack Engineer",
    dateRange: "05/2020 – 02/2023 · ~2 J. 10 Mon.", sort: "2020-05",
    caption: "Kursverwaltung & Zertifikats-Engine",
    cover: "/assets/projects/xu-navigator.jpg", cardTags: ["EdTech", "Microservices"],
    desc: "Skalierbare Microservice-Lernplattform für Unternehmensmitarbeitende – im Einsatz bei Konzernen wie Daimler, VW und ThyssenKrupp.",
    meta: [
      { label: "Rolle", value: "Full-Stack Engineer" },
      { label: "Team", value: "5–10 Personen" },
      { label: "Standort", value: "Bremen, DE · Remote" },
      { label: "Sprache", value: "Englisch" },
      { label: "Website", value: "xu.de" },
      { label: "Methodik", value: "Scrum" },
    ],
    responsibilities: [
      "Dynamisch, mandantenspezifisch befüllbare Kursinhalte (Videos, Podcasts, Multiple-Choice, Artikel) über klar abgegrenzte Services.",
      "Lernfortschrittskontrolle inklusive automatischer Zertifikatsgenerierung.",
      "Experten- und Community-Foren für den Austausch zwischen Teilnehmenden und Fachleuten.",
      "Skalierbare Backend-Services (NestJS, GraphQL) mit klar abgegrenzten Domänen in Microservice-Architektur.",
      "Frontend der Lernplattform in Angular (Angular Material, NgRx) sowie Bereitstellung über Azure DevOps Pipelines.",
    ],
    results: [
      "Skalierbare Microservice-Plattform im produktiven Einsatz bei namhaften Konzernen (Daimler, VW, ThyssenKrupp u. a.).",
      "Mandantenspezifische Kursinhalte: jeder Konzern bespielt dieselbe Plattform mit eigenen Schulungen.",
      "Zertifikate werden ohne manuelle Nacharbeit ausgestellt, der Lernfortschritt ist je Mandant auswertbar.",
    ],
    tech: ["TypeScript", "Angular", "Node.js", "NestJS", "Express.js", "REST API", "GraphQL", "MongoDB", "Mongoose", "NgRx", "RxJS", "Angular Material", "SCSS", "Figma", "Microsoft Azure", "Azure DevOps", "Azure Pipelines", "Azure App Service", "Azure Blob Storage", "Docker", "CI/CD", "JWT", "OAuth 2.0", "Single Sign-On (SSO)", "Learning Management System (LMS)", "Video-Streaming", "Microservices", "Clean Architecture"],
  },
  {
    num: "09", slug: "medizingeraete-ms", name: "Medizingeräte-MS", company: "Krankenhauskette (anonymisiert)", subtitle: "Managementsystem für Medizingeräte",
    cat: "HealthTech / Medizintechnik", role: "Full-Stack Engineer",
    dateRange: "01/2019 – 05/2020 · ~1 J. 5 Mon.", sort: "2019-01",
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
    responsibilities: [
      "Geräte- und Stammdatenverwaltung (Krankenhaus, Standort, Gerätespezifikationen).",
      "Detaillierte Wartungshistorie je Gerät.",
      "Störungserfassung durch das Pflegepersonal als Einstieg in den Wartungsprozess der Medizintechnik.",
      "Mandantenfähige Filterung nach Krankenhaus (Multi-Tenancy) und Authentifizierung gegen den Microsoft-Entra-ID-Tenant (ehem. Azure Active Directory) des jeweiligen Hauses.",
      "REST-API mit ASP.NET Core (Swagger/OpenAPI); Datenmodellierung mit Entity Framework Core (Code-First) auf MSSQL.",
    ],
    results: [
      "Mandantenfähige Geräteverwaltung für mehrere Krankenhäuser – Stammdaten und Wartungshistorie je Gerät an einer Stelle.",
      "Störungsmeldungen des Pflegepersonals laufen ohne Umweg in den Wartungsprozess der Medizintechnik.",
      "Sauber geschichtete .NET-Architektur: Code-First-Datenmodell (Entity Framework Core, MSSQL), dokumentierte REST-API (Swagger/OpenAPI) und Authentifizierung gegen Microsoft Entra ID.",
    ],
    tech: ["C#", ".NET Core", "ASP.NET Core", "ASP.NET Core Web API", "OpenAPI", "Swagger", "TypeScript", "React", "Entity Framework Core", "Datenmodellierung", "Microsoft SQL Server (MSSQL)", "Fluent UI", "Redux", "React Router", "Axios", "Single Page Application (SPA)", "Dependency Injection", "JWT", "Microsoft Entra ID (ehem. Azure Active Directory)", "Role-Based Access Control (RBAC)", "Multi-Tenancy", "Stammdatenverwaltung", "Microsoft Azure", "Azure SQL", "Azure DevOps", "Docker", "CI/CD", "Clean Architecture"],
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
  { num: "05", name: "Frontend", items: ["React", "Next.js", "Angular", "React Native", "Ionic", "Capacitor", "Cross-Platform-Entwicklung", "iOS", "Android", "Redux", "NgRx", "RxJS", "TanStack Query", "React Hook Form", "React Router", "Axios", "Zod", "Tailwind CSS", "shadcn/ui", "Material UI (MUI)", "Fluent UI", "Single Page Application (SPA)", "Progressive Web App (PWA)", "Server-Side Rendering (SSR)", "Internationalisierung (i18n)", "Frontend-Entwicklung", "Web-Entwicklung"] },
  { num: "06", name: "Design & UX", items: ["Figma", "Wireframing", "Prototyping", "Design System", "Design Tokens", "Komponentenbibliotheken", "Storybook", "UI/UX Design", "UI-Implementierung", "Responsive Design", "Mobile First", "Barrierefreiheit (WCAG)", "Usability", "Nutzerführung", "Onboarding-Flows", "Informationsarchitektur", "UX Writing", "Microcopy", "Design Reviews"] },
  { num: "07", name: "Datenbanken & Daten", items: ["PostgreSQL", "MySQL", "MariaDB", "Microsoft SQL Server (MSSQL)", "MongoDB", "Mongoose", "NoSQL", "Cloud Firestore", "SQLite", "Redis", "Prisma", "MikroORM", "TypeORM", "Drizzle ORM", "Entity Framework Core", "Datenmodellierung", "Datenarchitektur", "DTOs", "Daten-Synchronisation", "ETL", "CSV-Verarbeitung", "Caching", "Idempotenz"] },
  { num: "08", name: "DevOps, Cloud & Infrastruktur", items: ["Docker", "Docker Compose", "CI/CD", "Continuous Integration", "GitHub Actions", "GitLab CI", "Azure Pipelines", "Jenkins", "Nginx", "Sentry", "Monitoring", "Observability", "Linux", "Ubuntu", "Self-Hosting", "Microsoft Azure", "Azure Functions", "Azure App Service", "Azure Blob Storage", "Azure SQL", "Google Cloud Platform (GCP)", "Amazon Web Services (AWS)", "Hetzner", "IONOS", "Digital Ocean", "Vercel", "Supabase", "Firebase", "Cloud Functions", "Cloud Storage", "Firebase Cloud Messaging (FCM)", "Firebase Hosting", "DevOps", "DevSecOps"] },
  { num: "09", name: "Auth & Security", items: ["JWT", "OAuth 2.0", "Single Sign-On (SSO)", "better-auth", "Firebase Authentication", "Firebase Security Rules", "Authentifizierung", "Role-Based Access Control (RBAC)", "Row Level Security", "SSL/TLS", "Ende-zu-Ende-Verschlüsselung", "Microsoft Entra ID (ehem. Azure Active Directory)", "Secure by Design", "IT-Sicherheit"] },
  { num: "10", name: "Architektur & Prinzipien", items: ["Software-Architektur", "Clean Architecture", "Clean Code", "SOLID", "Design Patterns", "Domain-Driven Design", "Separation of Concerns", "Dependency Injection", "Microservices", "Event-Driven Architecture", "Monorepo", "Nx", "Turborepo", "Skalierbare Architektur", "Systemintegration", "Plattform-Migration", "Middleware", "API-First", "Resilience Patterns", "Typsicherheit", "MVP-Entwicklung"] },
  { num: "11", name: "Methodik & Zusammenarbeit", items: ["Agile Methoden", "Scrum", "Kanban", "Scrumban", "Code Reviews", "Test-Driven Development (TDD)", "Softwareentwicklung", "Projektmanagement", "IT-Beratung", "Requirements Engineering", "Remote Work", "Public Speaking"] },
  { num: "12", name: "Business & Strategie", items: ["IT-Strategie", "Digitalstrategie", "Digitale Transformation", "Prozessdigitalisierung", "Produktverantwortung", "Entrepreneurship"] },
  { num: "13", name: "Datenschutz & Compliance", items: ["DSGVO", "Privacy by Design", "Datenminimierung", "Auftragsverarbeitungsvertrag (AVV)", "EU AI Act", "AI Governance", "GoBD", "Revisionssicherheit", "EU-Hosting", "Digitale Souveränität", "Barrierefreiheitsstärkungsgesetz (BFSG)", "European Accessibility Act (EAA)"] },
  { num: "14", name: "Testing & QA", items: ["Jest", "Vitest", "Cypress", "Playwright", "React Testing Library", "Unit Testing", "Integrationstests", "End-to-End-Tests", "Postman", "API-Testing", "Testautomatisierung"] },
  { num: "15", name: "Tooling", items: ["Git", "GitHub", "GitLab", "Visual Studio Code", "Visual Studio", "Jira", "Linear", "Slack", "Azure DevOps", "Bluedot", "HubSpot", "Cal.com", "Google Workspace (Meet, APIs)", "Amplitude", "Product Analytics"] },
  { num: "16", name: "Domänen & Branchen", items: ["LegalTech", "GovTech", "Kanzleisoftware", "Notariat", "Mandantenportal", "Dokumentenmanagement", "HealthTech", "Medizintechnik", "Instandhaltungsmanagement", "ERP", "Warenwirtschaft", "Lagerverwaltung", "Rechnungsstellung", "Auftragsverwaltung", "CRM", "Buchhaltung", "Stammdatenverwaltung", "Multi-Tenancy", "Stripe", "SEPA", "Zahlungsabwicklung", "Logistik", "Tourenplanung", "PDF-Generierung", "Digitale Archivführung", "EdTech", "E-Learning", "Learning Management System (LMS)", "Social Media", "IoT", "Device Pairing", "Consumer Electronics", "SaaS", "Plattformentwicklung"] },
  { num: "17", name: "Rollen & Profil", items: ["Senior Full-Stack Engineer", "AI Engineer", "Software Engineer", "Freelance Developer", "Interim CTO", "Technischer Berater", "Fachinformatiker Anwendungsentwicklung", "Deutsch (Muttersprache)", "Englisch B2", "München", "DACH"] },
];

/* Course certificates, each served as a PDF from /public/certificates. The
   public URL /certificates/<slug>.pdf is a permanent, shareable link. */

/* One chapter of a course syllabus. Sections are listed in course order; the
   lesson titles stay in the course's own language (English), because that is
   how they are verifiable against the course page. */
export type CertificateSection = {
  title: string;
  /** Official scope of the section, e.g. "113 Min." — omitted when unknown. */
  meta?: string;
  lessons?: string[];
};

export type Certificate = {
  /** Stable URL slug — the PDF lives at /certificates/<slug>.pdf forever, the
      detail page at /certificates/<slug>. */
  slug: string;
  title: string;
  issuer: "Scrimba" | "Code with Mosh" | "Udemy";
  date: string;
  /** ISO completion date, used for sorting (newest first). */
  sort: string;
  /** Scope for the card line, e.g. "8,2 Std · 142 Lektionen". */
  detail?: string;
  cat: string;
  tags: string[];
  verifyUrl?: string;
  /** Official URL for certificates not (yet) self-hosted as a PDF. */
  externalUrl?: string;
  /** Pre-rendered first PDF page, generated by scripts/certificate-previews.mjs
      into /public/assets/certificates. Set exactly for the self-hosted PDFs.
      Shown contained in the dialog, so the whole document stays visible. */
  preview?: string;
  /** Same page cropped to the gallery tile's aspect ratio by that script, so a
      tile is filled edge to edge instead of letterboxing the page. */
  tilePreview?: string;
  /** Public course page, shown as an outbound link in the dialog. */
  courseUrl?: string;
  /** What the course covered, in two to four sentences. */
  summary: string;
  /** Scope facts for the dialog grid (Umfang, Lektionen, Dozent, …). */
  facts?: { label: string; value: string }[];
  /** Substance of the certificate: what was learned and practised. */
  outcomes?: string[];
  /** Syllabus in course order. */
  curriculum?: CertificateSection[];
  /** Explains what the listing above is when it is not the official one. */
  curriculumNote?: string;
};

/* Ordered newest first by default (mirrors the projects gallery). */
export const certificates: Certificate[] = [
  {
    slug: "ai-for-developers-github-copilot",
    title: "AI For Developers With GitHub Copilot, Cursor AI & ChatGPT",
    issuer: "Udemy",
    date: "Dezember 2025",
    sort: "2025-12-08",
    detail: "5,5 Std · 147 Lektionen",
    cat: "KI / AI",
    tags: ["GitHub Copilot", "Cursor AI"],
    verifyUrl:
      "https://www.udemy.com/certificate/UC-00859d2d-a91d-40bd-8ea8-cae70ce1c5da/",
    preview: "/assets/certificates/ai-for-developers-github-copilot.webp",
    tilePreview: "/assets/certificates/ai-for-developers-github-copilot-tile.webp",
    summary:
      "Kurs zum KI-gestützten Entwickeln mit GitHub Copilot, Cursor AI und ChatGPT: von Code-Completions über Ask-, Plan- und Agent-Modus bis zu Instruction Files, AGENTS.md, Agent Skills und MCP-Servern. Behandelt beide Werkzeuge in ihrer aktuellen Form, dazu Prompt- und Context-Engineering-Grundlagen sowie den bewussten Einsatz externer Dienste wie ChatGPT für Planung und Recherche. Abschluss ist ein vollständiges Demo-Projekt: eine Node.js-REST-API mit SQLite, JWT-Authentifizierung, Rollen-Autorisierung und Bild-Upload, durchgehend mit KI-Assistenz gebaut.",
    facts: [
      { label: "Umfang (Urkunde)", value: "5,5 Std." },
      { label: "Kursumfang heute", value: "8 Std. 2 Min. Video" },
      { label: "Lektionen", value: "147 in 7 Abschnitten" },
      { label: "Dozenten", value: "Academind by Maximilian Schwarzmüller" },
      { label: "Sprache", value: "Englisch" },
      { label: "Format", value: "Video-Kurs mit Projektarbeit" },
      { label: "Zusatzmaterial", value: "7 Artikel, 5 Downloads" },
      { label: "Abschluss", value: "8. Dezember 2025" },
    ],
    outcomes: [
      "GitHub Copilot einsetzen, um Code mit KI-Vorschlägen zu schreiben, zu testen und zu verbessern",
      "Copilot Chat für die eigenen Anforderungen konfigurieren und feinjustieren — Modelle, Editor-Settings, Prompt- und Instruction Files, Checkpoints",
      "Ask-, Plan- und Agent-Modus gezielt auseinanderhalten, Werkzeug-Berechtigungen kontrollieren und eigene Agenten bauen",
      "Code mit Cursor AI generieren und verbessern: Tab-Completion, Inline Edits, Composer, Chat und Agent-Layout",
      "Context Engineering in der Praxis: Cursor Rules und AGENTS.md, Memories, cursorignore, MCP-Server anbinden",
      "Projekte mit ChatGPT und anderen externen Diensten planen, Lösungen recherchieren und Assets erzeugen — inklusive der Frage, wann man das besser nicht tut",
      "Ein vollständiges Demo-Projekt bauen: REST API mit SQLite, Validierung, bcryptjs, JWT-Authentifizierung, rollenbasierter Autorisierung, Multer-Bild-Upload und CORS",
    ],
    curriculum: [
      {
        title: "Getting Started",
        meta: "13 Min. · 7 Lektionen",
        lessons: [
          "Welcome To The Course!",
          "Course Overview: What You'll Learn & Achieve",
          "Course Focus: AI Programming Tools & Beyond",
          "Understanding AI: Limitations, Costs & Unpredictability",
          "AI Tools For Developers - An Overview",
          "Prompt & Context Engineering Recommendations",
          "Join The Academind Community",
        ],
      },
      {
        title: "Leverage GitHub Copilot Suggestions & Chat",
        meta: "2 Std. 47 Min. · 51 Lektionen",
        lessons: [
          "Module Introduction",
          "GitHub Copilot Setup",
          "Working With AI-powered Completions",
          "Using Smart Context Actions",
          "Changing the Completions Model",
          "Onwards To Chat & Agents",
          "Using “Inline” and “Quick Chat”",
          "Using Inline Chat In The Terminal",
          "Configuring Copilot Models & Features (Account Level)",
          "Tweaking Copilot-related Editor Settings",
          "Using “Ask” Mode (When & How)",
          "Using “Plan” Mode & Configuring Tools",
          "Using “Agent” Mode & Controlling Permissions",
          "Building Custom Agents & Combining Agents",
          "Configuring Chat & Sessions",
          "Safe Usage via Checkpoints",
          "Prompt & Context Engineering Essentials",
          "Context Engineering In Action",
          "Exploring Background & Cloud Agents",
          "Using Prompt Files",
          "Using Built-in Commands",
          "More Smart Actions",
          "Utilizing Instruction Files",
          "Understanding AGENTS.MD",
          "Working With Agent Skills",
          "More on Tools & MCP",
          "--- LEGACY CONTENT BELOW ---",
          "Introducing GitHub Copilot",
          "GitHub Copilot: AI Code Completion For Developers",
          "Installing & Setting Up GitHub Copilot",
          "Using AI Powered Code Suggestions To Write Code",
          "Using “Next Edit” Suggestions",
          "Mastering Prompts: Using Comments To Guide Github Copilot's AI",
          "Writing A Full Python Script With Suggestions",
          "Using The Inline Chat Feature To Add Error Handling",
          "Configuring GitHub Copilot: Tips For Efficient Use",
          "Taking Advantage of “Code Actions”",
          "Exploring The Sidebar Chat For More Complex Tasks",
          "Adding Context: Using References & Shortcuts For Smarter Code Creation",
          "Adding Additional Participants For Enhanced Sidebar Chat Context",
          "Running Terminal Commands Efficiently With AI",
          "Mastering GitHub Copilot Slash Commands: Explain, Fix & More",
          "Multi-File Edits with “Copilot Edits”",
          "Using “Agent Mode”",
          "Automating Unit Test Generation For Selected Code Sections",
          "Creating New Projects With The /new Command",
          "Prompt Engineering Essentials: Guidelines & Best Practices",
          "How Being Specific & Adding Context Improves AI Code Generation Efficiency",
          "Validating Input With GitHub Copilot Sidebar Chat",
          "Effective Iteration: Balancing AI & Manual Coding",
          "GitHub Copilot Extensions",
        ],
      },
      {
        title: "Cursor Basics",
        meta: "41 Min. · 20 Lektionen",
        lessons: [
          "Module Introduction",
          "What Is Cursor?",
          "Pricing & Privacy",
          "Settings Overview",
          "Tab, Tab, Tab",
          "Using Tab Completion Efficiently",
          "Tab-Completion Settings",
          "Comment-based Prompting",
          "Inline Edits & Chatting",
          "Inline Explanations",
          "Inline Chats For Full-File Edits",
          "Generating Terminal Commands",
          "Cursor Chat / Agent Introduction",
          "Selecting Models",
          "Using “Ask” Mode",
          "Using “Agent” Mode",
          "Other Modes",
          "Using Cursor Checkpoints",
          "Queueing Messages",
          "Wrap Up",
        ],
      },
      {
        title: "Cursor Advanced",
        meta: "59 Min. · 15 Lektionen",
        lessons: [
          "Module Introduction",
          "Understanding Context Engineering",
          "Getting Started with AI Agents",
          "Using “Plan” & “Agent” Mode",
          "Checking & Editing AI Generated Plans",
          "Advanced Context Engineering",
          "Don't Outsource Everything To AI",
          "Using “Ask” Mode Efficiently",
          "Using Cursor's Agent Layout",
          "Reverting AI Agent Changes",
          "Using Cursor Rules & AGENTS.MD",
          "Letting AI Use Tools",
          "Working With MCP Servers",
          "Cursor Memories & Custom Commands",
          "Using the cursorignore File",
        ],
      },
      {
        title: "Introducing Cursor AI: Smart Suggestions, Chat and Composer",
        meta: "50 Min. · 18 Lektionen",
        lessons: [
          "LEGACY SECTION",
          "Introducing Cursor AI",
          "What Is Cursor AI & How It Enhances Developer Productivity",
          "Prerequisites For Using Cursor: What You Need To Know",
          "Getting Started With Cursor's Auto-Suggestions",
          "Smart & Predictive Code Completion With Cursor: Writing Code Faster With Tab",
          "Fixing Code On The Fly With Cursor's AI-Powered Suggestions",
          "Using Comments As Prompts To Guide Cursor's Code Generation",
          "Debugging Errors In The Terminal",
          "Understanding Cursor's Inline Chat Feature",
          "Leveraging The Docs Integration For Better Code Generation",
          "Generating Terminal Commands With The Inline-Chat",
          "Explaining Selected Code Snippets With The Quick Question Mode",
          "Enhancing The Workflow With The External Sidebar Chat Window",
          "Editing Multiple Files & Performing More Complex Edits With Cursor Composer Mode",
          "Understanding “Auto Run” (Yolo) Mode",
          "An Introduction To MCP Servers",
          "Cursor AI Features Round-Up: Tests, Code Fixes & More",
        ],
      },
      {
        title:
          "ChatGPT Or Other External AI Services: Use-Cases During Development",
        meta: "15 Min. · 7 Lektionen",
        lessons: [
          "Introduction To External AI Services",
          "How To NOT Use ChatGPT As A Developer",
          "Planning Applications With ChatGPT",
          "Researching Development Solutions With External AI Services",
          "Using AI For Asset Generation",
          "Prompt Engineering: Key Techniques",
          "Section Round Up: When To Use External AI Services In Development",
        ],
      },
      {
        title: "Practice Project: Creating a REST API with AI",
        meta: "2 Std. 17 Min. · 29 Lektionen",
        lessons: [
          "GitHub Copilot & Cursor Versions",
          "A Full Demo Project: Overview",
          "The REST API: Application Requirements Overview",
          "Planning the Application Structure with ChatGPT",
          "Setting Up the Project in Cursor AI",
          "Writing User Registration & Login Code with Cursor Composer",
          "Providing Follow-Up Feedback To Cursor Composer",
          "Connecting to A SQLite Database with Cursor's Sidebar Chat",
          "Tweaking AI-Generated Code",
          "Using Inline Chat For Editing Validation Code",
          "Testing the REST API With Postman",
          "Encrypting User Passwords With bcryptjs",
          "Debugging the App With The AI Chat",
          "Adding Authentication with JSON Web Tokens",
          "Adding Event Specific Routes With GitHub Copilot Inline Chat",
          "Creating, Editing & Deleting Events With Copilot's Sidebar Chat",
          "Creating & Exporting Reusable Model Functions For Event Management",
          "Testing & Debugging The App",
          "Implementing & Testing Validation With The Inline Chat",
          "Protecting Event Routes With User Authentication",
          "Testing Authentication",
          "Adding Role Based Authorization To The Update & Delete Routes",
          "Testing Authorization",
          "Adding POST Routes with Suggestions For Registering & Unregistering Events",
          "Testing & Fixing Event Registration & Unregistration",
          "Integrating Image Upload Functionality With The Multer Package",
          "Finishing & Testing The Image Upload Feature",
          "Adding Frontend Applications To The REST API with the CORS Package",
          "Conclusion & Next Steps",
        ],
      },
    ],
    curriculumNote:
      "Offizielle Kursgliederung mit den Abschnittsnamen der Kursseite: 147 Lektionen in 7 Abschnitten, Kursstand Januar 2026. Die Urkunde weist 5,5 Stunden aus, der Kurs umfasst heute 8 Stunden — er wurde nach dem Abschluss um die aktuellen Copilot- und Cursor-Module erweitert; die als „Legacy“ gekennzeichneten Teile sind die ältere Fassung.",
  },
  {
    slug: "build-ai-powered-apps",
    title: "Build AI-Powered Apps",
    issuer: "Code with Mosh",
    date: "Dezember 2025",
    sort: "2025-12-07",
    detail: "7 Std · 120 Lektionen",
    cat: "KI / AI",
    tags: ["LLM", "OpenAI API"],
    preview: "/assets/certificates/build-ai-powered-apps.webp",
    tilePreview: "/assets/certificates/build-ai-powered-apps-tile.webp",
    summary:
      "Projektkurs von Mosh Hamedani zum Bauen von LLM-Anwendungen: von den Grundlagen der Sprachmodelle (Tokens, Modellwahl, Model Settings) über ein modernes Full-Stack-Setup mit Bun, TailwindCSS und shadcn/ui bis zu zwei durchgehenden Projekten — einem Chatbot mit Streaming-UI und einem Review Summarizer mit MySQL, Prisma und TanStack Query. Dazu ein eigenes Modul Prompt Engineering und der Einsatz von Open-Source-Modellen über Hugging Face und Ollama. Ein durchgehendes Thema ist das Refactoring: Repository, Service und Controller werden schrittweise herausgezogen. Vollständig abgeschlossen (alle Lektionen).",
    facts: [
      { label: "Umfang", value: "7 Std." },
      { label: "Lektionen", value: "120 in 8 Abschnitten" },
      { label: "Dozent", value: "Mosh Hamedani" },
      { label: "Sprache", value: "Englisch" },
      { label: "Format", value: "Video-Kurs mit Projektarbeit" },
      { label: "Fortschritt", value: "100 % abgeschlossen" },
      { label: "Abschluss", value: "7. Dezember 2025" },
    ],
    outcomes: [
      "Grundlagen der Sprachmodelle: Was LLMs können, Tokens verstehen und zählen, das passende Modell wählen, Model Settings und API-Aufrufe",
      "Modernes Full-Stack-Setup: Bun, getrenntes Frontend und Backend, OpenAI-API-Key-Handling, TailwindCSS, shadcn/ui, Prettier und Pre-Commit-Checks mit Husky",
      "Chatbot-Backend: Chat-API, Verwaltung des Konversationszustands, Input-Validierung und Fehlerbehandlung — anschließend refactored in Repository, Service, Controller und Routes",
      "Chatbot-Frontend: Chat-UI, State-Management, Markdown-Rendering, Typing-Indicator, Auto-Scrolling und Fehlerbehandlung, zerlegt in eigene Komponenten",
      "Prompt Engineering: Aufbau eines guten Prompts, Kontext liefern, Ausgabeformat steuern, Beispiele geben, Halluzinationen reduzieren und Prompts iterativ verbessern",
      "Review Summarizer: MySQL und Prisma mit Schema, Migrationen und realistischen Testdaten, API zum Abrufen und Zusammenfassen von Reviews, Speichern und Regenerieren der Summary, Edge Cases",
      "Frontend mit TanStack Query: Reviews und Sternebewertungen anzeigen, Loading Skeletons, Fehlerbehandlung, Mutations und eine herausgezogene API-Schicht",
      "Open-Source-Modelle: Modelle auf Hugging Face finden und aufrufen, das passende Modell für die Aufgabe wählen, Modelle lokal mit Ollama betreiben",
    ],
    curriculum: [
      {
        title: "Getting Started",
        meta: "7 Min. · 6 Lektionen",
        lessons: [
          "Welcome",
          "Prerequisites",
          "What You'll Learn",
          "Getting Help",
          "Source Code",
          "Submitting Feedback",
        ],
      },
      {
        title: "Introduction to AI Models",
        meta: "32 Min. · 8 Lektionen",
        lessons: [
          "Rise of AI Engineering",
          "What Are Large Language Models?",
          "What Can You Do With Language Models?",
          "Understanding Tokens",
          "Counting Tokens",
          "Choosing the Right Model",
          "Understanding Model Settings",
          "Calling Models",
        ],
      },
      {
        title: "Setting Up a Modern Full-Stack Project",
        meta: "50 Min. · 11 Lektionen",
        lessons: [
          "Setting Up Bun",
          "Creating the Project Structure",
          "Creating the Backend",
          "Managing OpenAI API Key",
          "Creating the Frontend",
          "Connecting the Frontend and Backend",
          "Running Both Apps Together",
          "Setting Up TailwindCSS",
          "Setting Up ShadCN/UI",
          "Formatting Code With Prettier",
          "Automating Pre-Commit Checks With Husky",
        ],
      },
      {
        title: "Building a ChatBot",
        meta: "1 Std. 15 Min. · 30 Lektionen",
        lessons: [
          "Introduction",
          "Building the Backend",
          "Building the Chat API",
          "Testing the API",
          "Managing Conversation State",
          "Input Validation",
          "Error Handling",
          "Refactoring the Chat API",
          "Extracting Conversation Repository",
          "Extracting Chat Service",
          "Extracting Chat Controller",
          "Extracting Routes",
          "Building the Frontend",
          "Designing the Chat UI",
          "Managing State",
          "Sending Messages",
          "Displaying Messages",
          "Styling Messages",
          "Rendering Markdown Text",
          "Adding a Typing Indicator",
          "Auto-Scrolling to the Latest Message",
          "Improving Copy Behaviour",
          "Improving the Look and Feel",
          "Handling Errors",
          "Refactorings",
          "Extracting TypingIndicator Component",
          "Extracting ChatMessages Component",
          "Extracting ChatInput Component",
          "Recap",
          "Summary",
        ],
      },
      {
        title: "Prompt Engineering",
        meta: "32 Min. · 12 Lektionen",
        lessons: [
          "What is Prompt Engineering",
          "Anatomy of a Good Prompt",
          "Providing Context",
          "Controlling the Output Format",
          "Providing Examples",
          "Handling Errors and Edge Cases",
          "Reducing Hallucinations",
          "Refining Prompts",
          "Improving Chatbot Responses",
          "Adding Sound Effects",
          "Exercises",
          "Summary",
        ],
      },
      {
        title: "Building a Review Summarizer",
        meta: "2 Std. 20 Min. · 32 Lektionen",
        lessons: [
          "Introduction",
          "Setting Up the Database",
          "Setting Up MySQL",
          "Setting Up Prisma",
          "Defining the Prisma Schema",
          "Running Migrations",
          "Refining the Prisma Schema",
          "Populating the Database with Realistic Data",
          "Building the Backend",
          "Creating the API to Fetch Reviews",
          "Refactoring: Separation of Concerns",
          "Creating an API for Summarizing Reviews",
          "Generating Summaries",
          "Refactoring: Extracting the LLM Logic",
          "Refactoring: Extracting the Prompt",
          "Storing the Summary",
          "Handling Regeneration",
          "Handling Edge Cases",
          "Fetching the Summary",
          "Building the Frontend",
          "Displaying Reviews",
          "Displaying Star Ratings",
          "Displaying Loading Skeletons",
          "Handling Errors",
          "Introducing Tanstack Query",
          "Displaying the Summary",
          "Triggering Summary Generation",
          "Displaying Loading Skeletons",
          "Handling Errors",
          "Refactoring with Mutations",
          "Refactoring for Readability",
          "Extracting the API Layer",
        ],
      },
      {
        title: "Building with Open Source Models",
        meta: "28 Min. · 8 Lektionen",
        lessons: [
          "Introduction",
          "Why Use Open-Source Models",
          "Finding Open-Source Models",
          "Calling Hugging Face Models",
          "Choosing the Right Model For the Job",
          "Running Models Locally",
          "Using Hugging Face Models with Ollama",
          "Calling Ollama Models",
        ],
      },
      {
        title: "Course Wrap Up",
        meta: "2 Lektionen",
        lessons: ["Course Wrap Up", "Feedback"],
      },
    ],
    curriculumNote:
      "Die Kursseite nennt 7 Stunden und 120 Lektionen in 8 Abschnitten, listet die Einzellektionen aber nur für „Getting Started“. Die Gliederung hier ist deshalb dem Kursplayer entnommen und zeigt alle 109 Lektionen, die zum Abschluss im Dezember 2025 enthalten waren — der Kurs ist seither gewachsen. Die Urkunde von Code with Mosh weist selbst keinen Umfang aus. Die Nummerierung der Unterlektionen (2.1, 4.3 …) ist zugunsten einer durchlaufenden Zählung entfernt.",
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
    preview: "/assets/certificates/angular-real-world-guide.webp",
    tilePreview: "/assets/certificates/angular-real-world-guide-tile.webp",
    courseUrl:
      "https://www.udemy.com/course/angular-and-google-firebase-frontend-development/",
    summary:
      "Durchgehend projektbasierter Angular-Kurs: von den Grundlagen (Komponenten, Templates, Services) bis zur vollständigen Anwendung „Dev Pulse“ mit Google Firebase als Backend. Enthalten sind Reactive Forms mit Validierung, vollständiges Firestore-CRUD, Datei-Uploads, Authentifizierung mit Registrierung, Login und Logout sowie öffentliche Seiten in drei Umsetzungen — mit Observables, mit Signals und mit RxResource.",
    facts: [
      { label: "Umfang", value: "10,5 Std." },
      { label: "Lektionen", value: "52 in 6 Abschnitten" },
      { label: "Dozent", value: "Sameer Saini" },
      { label: "Sprache", value: "Englisch" },
      { label: "Format", value: "Video-Kurs mit Projektarbeit" },
      { label: "Abschluss", value: "13. November 2025" },
    ],
    outcomes: [
      "Angular-Grundlagen: Komponenten als Bausteine, Component State und Behavior, dynamische Templates, Conditionals und Loops, User-Event-Handling und geteilte Logik über Services",
      "Projekt-Setup mit Angular CLI und Tailwind CSS, Navigation mit RouterOutlet und RouterLink, Trennung der Umgebungen über Environments",
      "Reactive Forms samt Validierung, Markdown-Editor mit Live-Preview und Cover-Image-Upload",
      "Google Firebase und AngularFire: Schreiben mit addDoc und setDoc, Collection- und Einzeldokument-Abfragen, Update und Delete — vollständiges Firestore-CRUD in einem BlogPost-Service",
      "Firebase Authentication: Registrierung, Login und Logout, LoggedIn-/LoggedOut-Zustände in der Navbar, reaktiver State über Signals",
      "Dashboard mit Statistiken und Parent-to-Child-Datenfluss, Filterung auf die eigenen Beiträge, Batch-Upload in die Firestore-Datenbank",
      "Öffentliche Seiten (Home und Blog-Details) in drei Varianten umgesetzt: mit Observables, mit Signals und mit RxResource",
    ],
    curriculum: [
      {
        title: "Introduction",
        meta: "6 Lektionen",
        lessons: [
          "Introduction",
          "Install Visual Studio Code",
          "Install Visual Studio Code Extensions",
          "Install Node Js and npm",
          "Install Angular CLI",
          "Github Code Repository",
        ],
      },
      {
        title: "Angular basics and essentials",
        meta: "8 Lektionen",
        lessons: [
          "Let's Understand Angular",
          "Create New Angular Application",
          "Components — Building Blocks of an Angular Application",
          "Managing Dynamic Data — Component State and Behavior",
          "Rendering Dynamic Templates",
          "Conditionals and Loops",
          "User Event Handling",
          "Sharing Code or Logic using Services",
        ],
      },
      {
        title: "Dev Pulse — Angular and Google Firebase Real World Project",
        meta: "15 Lektionen",
        lessons: [
          "Create New Angular Application Using Angular CLI",
          "Install Tailwind CSS in Angular Application",
          "Create Navigation Menu or Navbar",
          "Create-Post Component, RouterOutlet and RouterLink",
          "Define Elements and Style Create-Post Page",
          "Angular Reactive Forms and Create Post Form",
          "Validations in Reactive Forms",
          "Environments",
          "Google Firebase Intro and Setup",
          "Install AngularFire and Add Firebase Configuration",
          "Save data using addDoc method to Firebase",
          "Save data using setDoc method to Firebase",
          "Creating BlogPost Service",
          "Add Markdown Editor and Preview",
          "Upload Files — CoverImage to BlogPost",
        ],
      },
      {
        title: "CRUD Operations, Dashboard Page, Public pages",
        meta: "7 Lektionen",
        lessons: [
          "Section Introduction",
          "Navbar — LoggedIn and LoggedOut Functionality and UserService",
          "Navbar Dropdown (use signals to reactively change state)",
          "Dashboard Page and Dashboard Statistics — Passing Data From Parent to Child Component",
          "Getting Collection Data From Firestore — BlogPost List",
          "Get Single Document From Firestore — Edit/Update BlogPost",
          "Delete Document From Firestore — Delete BlogPost",
        ],
      },
      {
        title: "Authentication using Google Firebase (Register, Login, Logout)",
        meta: "9 Lektionen",
        lessons: [
          "Google Firebase Authentication Overview",
          "Enable Google Firebase Authentication",
          "Create Register Page/Component",
          "Register Page Template",
          "Register User",
          "Create Login Page Component",
          "Login Page HTML Template",
          "User Login using Google Firebase",
          "Logout/Signout Functionality",
        ],
      },
      {
        title:
          "Filter, Batch Create Data, Home page and Blog Details Page (Public pages)",
        meta: "7 Lektionen",
        lessons: [
          "Add User Details To Blogs",
          "Dashboard to show only loggedIn user created blogs",
          "Bulk/Batch Upload Data in Firestore Database",
          "Home Page — Display All Blogs",
          "Blog Details Page — Using Observables",
          "Blog Details Page — Using Signals",
          "Blog Details Page — Using RxResource",
        ],
      },
    ],
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
    preview: "/assets/certificates/the-ai-engineer-path.webp",
    tilePreview: "/assets/certificates/the-ai-engineer-path-tile.webp",
    summary:
      "Scrimbas Lernpfad zum AI Engineer, durchgehend interaktiv im Browser-Editor. Der Pfad führt von den ersten API-Requests an ein Sprachmodell über Streaming-UIs, Prompt- und Context Engineering und eine von Hand gebaute RAG-Pipeline (Embeddings, Chunking, Vektordatenbank in Supabase) zu Agenten: erst nach dem ReAct-Muster selbst gebaut, dann über OpenAI Function Calling und schließlich mit dem Vercel AI SDK samt Tool Calling, strukturierten Outputs und agentischem Retrieval-Routing. Dazu kommen Open-Source-Modelle (Hugging Face, Transformers.js im Browser, Ollama lokal), Deployment mit Staging, Health-Endpoint und Alerting, ein eigener MCP-Server sowie Multimodalität mit Bildgenerierung und Vision. Enthalten sind mehrere eigenständige Solo-Projekte — PollyGlot, PopChoice und ein AI Travel Agent.",
    facts: [
      { label: "Umfang (Urkunde)", value: "8,2 Std." },
      { label: "Lektionen (Urkunde)", value: "142 Scrims" },
      { label: "Level", value: "Intermediate" },
      { label: "Zugang", value: "Scrimba Pro" },
      {
        label: "Lehrende",
        value: "Per Borgen, Bob Ziroll, Guil Hernandez, Arsala Khan",
      },
      { label: "Sprache", value: "Englisch" },
      { label: "Format", value: "Interaktive Scrims mit Challenges" },
      { label: "Unterzeichnet von", value: "Per Harald Borgen, CEO Scrimba" },
      { label: "Abschluss", value: "14. Juni 2025" },
    ],
    outcomes: [
      "Modellauswahl und Setup: KI-Marktplatz und empfohlene Modelle, eigener AI-Client, erste API-Requests aufbauen und anschließend ohne Vorlage nachbauen",
      "Kosten und Grenzen im Griff: Tokens, Token-Kosten, Context Windows, Model Snapshots und das Messages-Array",
      "Prompting in der Praxis: System Message, Few-Shot-Prompting, Temperature und Top P, JSON- und Structured Outputs, Web-Search-Tool",
      "Streaming-UIs: Antworten streamen, Markdown sicher rendern, Fehler behandeln und den Kontext einer laufenden Unterhaltung mitführen",
      "Context Engineering: System-Prompts gezielt bauen, das Context Window verwalten und Kontext zusammenfassen, wenn er zu groß wird",
      "RAG von Grund auf: Embeddings erzeugen, Dokumente chunken, in einer Supabase-Vektordatenbank speichern und per Similarity Search abrufen — inklusive Mehrfach-Treffern und Fehlerbehandlung",
      "Agenten selbst bauen: ReAct-Prompting mit eigener Loop-Logik und Response-Parsing, danach derselbe Agent über OpenAI Function Calling mit automatischen Tool-Aufrufen",
      "Vercel AI SDK: Basics, strukturierte Outputs, Tool Calling und agentisches Retrieval-Routing — jeweils mit eigener Challenge — bis zum vollständigen Customer-Support-Agenten mit Websuche",
      "Open-Source-Modelle: Hugging Face Inference für Summarization, Klassifikation und Bildbearbeitung, Modelle im Browser mit Transformers.js, lokaler Betrieb mit Ollama",
      "Model Context Protocol: Architektur und Kernkonzepte, eigener MCP-Server mit Tools und Resources, Transports und MCP-Clients",
      "Multimodalität: Bildgenerierung inklusive Prompting, Response-Formaten, Größe/Qualität/Stil und Bildbearbeitung sowie Vision-Auswertung mit GPT-4",
      "Deployment: Node-Umgebung, Build-Command auf Render, Smoke-Test, Domains, Staging und Merging, Alerting, Health-Endpoint und sauberes Beenden von Prozessen",
    ],
    curriculum: [
      {
        title: "Intro to AI Engineering (updated)",
        meta: "ca. 2,5 Std.",
        lessons: [
          "Introducing Your AI Superpower",
          "The AI Marketplace",
          "Environment Setup",
          "Recommended Models",
          "Setting Up Your AI Client",
          "Your First AI Request",
          "Your First AI Request Walkthrough",
          "Rebuilding Your First AI Request",
          "Shorter Responses With Tokens",
          "Refining Our Prompt",
          "Refactoring Our AI Request",
          "Model Snapshots",
          "The Messages Array",
          "The System Message",
          "Token Costs",
          "Context Windows",
          "Wiring up our UI",
          "Error Handling",
          "Rendering Markdown Safely",
          "Streaming AI Responses",
          "Gift Genie UI Streaming Challenge",
          "Structuring Our Markdown Responses",
          "Making Our Gift Genie Context Aware",
          "Few Shot Prompting",
          "Temperature & Top P",
          "Responses API Intro",
          "JSON Output",
          "Structured Outputs",
          "Web Search Tool",
          "Web Search In The Gift Genie UI",
          "Backend Orientation",
          "Backend Migration Super Challenge",
          "Solo Project: PollyGlot",
          "Scrimba Docs",
          "Outro",
        ],
      },
      {
        title: "Deployment (updated)",
        meta: "71 Min.",
        lessons: [
          "Intro",
          "Code check",
          "The Node Environment",
          "Push to GitHub",
          "Render Build Command",
          "Smoke Test",
          "Domain Names",
          "Database Problems",
          "Staging",
          "Merging",
          "Alerts and Notifications",
          "Health Endpoint",
          "Terminating Processes & Signals",
          "Outro",
        ],
      },
      {
        title: "Open-source Models",
        meta: "40 Min.",
        lessons: [
          "Open source vs closed source",
          "Intro To HuggingFace.js Inference",
          "Getting Started",
          "Text Summarization & Classification with HuggingFace Inference",
          "Transforming Images with HuggingFace Inference",
          "How to find Inference Models on HuggingFace",
          "AI Models In The Browser With Transformers.js",
          "Download and Run AI Models on Your Computer with Ollama",
          "Section Recap",
        ],
      },
      {
        title: "Embeddings and Vector Databases",
        meta: "95 Min.",
        lessons: [
          "What are embeddings?",
          "Set up environment variables",
          "Create an embedding",
          "Challenge: Pair text with embedding",
          "Vector databases",
          "Supabase Dependency Upgrade Warning",
          "Set up your vector database",
          "Store vector embeddings",
          "Semantic search",
          "Query embeddings using similarity search",
          "Create a conversational response using OpenAI",
          "Chunking text from documents",
          "Challenge: Split text, get vectors, insert into Supabase",
          "Error handling",
          "Query database and manage multiple matches",
          "AI chatbot proof of concept",
          "Retrieval-augmented generation (RAG)",
          "Solo Project: PopChoice",
          "Outro",
        ],
      },
      {
        title: "Agents",
        meta: "117 Min.",
        lessons: [
          "AI Agent Intro",
          "Prompt Engineering 101",
          "Control Response Formats",
          "Zooming Out",
          "Agent Setup",
          "Introduction to ReAct prompting",
          "Build action functions",
          "Write ReAct prompt (Part 1 – Planning)",
          "ReAct Agent (Teile 2–9): Prompting, Loop Logic, Code Setup, Response Parsing, Action Calls, Housekeeping, Final Loop",
          "OpenAI Functions Agent (Teile 1–9): Intro, Demo Day, Tools, Loop Logic, Setup Challenge, Tool Calls, Pushing to Messages, Adding Arguments, Automatic Function Calls",
          "Adding UI to agent – proof of concept",
          "Solo Project: AI Travel Agent",
          "Outro",
        ],
      },
      {
        title: "Context Engineering",
        meta: "58 Min.",
        lessons: [
          "Context Engineering Intro",
          "The System Prompt",
          "AI SDK + OpenRouter Setup",
          "Code Overview",
          "Adding A System Prompt",
          "System Prompt Challenge",
          "Managing The Context Window (inkl. Demo und Challenge)",
          "Summarizing Context (inkl. Demo und Super Challenge)",
          "Context Engineering Outro",
        ],
      },
      {
        title: "Vercel AI SDK",
        meta: "113 Min. · 20 Lektionen",
        lessons: [
          "Customer support ai agent intro",
          "Retrieval augmented generation refresher",
          "Embeddings recap",
          "Vector database embed documents",
          "Vector database retrieval",
          "Challenge: Vector database retrieval",
          "Vector database text splitting and retrieval",
          "Vercel ai sdk basics",
          "Challenge: Vercel ai sdk basics",
          "Vercel ai sdk structured outputs",
          "Challenge: Vercel ai sdk structured outputs",
          "Vercel ai sdk tool calling",
          "Challenge: Vercel ai tool calling",
          "Agentic retrieval routing",
          "Challenge: Agentic retrieval routing",
          "Web search ai agent",
          "Web search plus retrieval agent",
          "Challenge: Web search retrieval",
          "Complete customer support ai agent",
          "Outro",
        ],
      },
      {
        title: "Model Context Protocol",
        meta: "37 Min. · 9 Lektionen",
        lessons: [
          "Introduction",
          "Intro to MCP & Its Importance",
          "Core MCP Concepts & Architecture",
          "Setting up MCP Server and Defining Tools",
          "Registering Resources in the MCP Server",
          "Run the MCP Server",
          "Transports",
          "MCP Clients",
          "Wrap Up",
        ],
      },
      {
        title: "Multimodality",
        meta: "62 Min. · 11 Lektionen",
        lessons: [
          "Introduction",
          "Generate original images from a text prompt",
          "Response formats",
          "Prompting for image generation",
          "Size, quality and style",
          "Editing images",
          "Image generation challenge",
          "Image generation challenge solution",
          "GPT-4 with Vision — Part 1",
          "GPT-4 with Vision — Part 2",
          "Image generation & Vision recap",
        ],
      },
      {
        title: "Abschluss",
        lessons: ["How to Utilize Your Certificate", "Certificate of Completion"],
      },
    ],
    curriculumNote:
      "Aktueller Stand des Lernpfads: 9 Module mit zusammen 11,4 Stunden. Die Urkunde vom Juni 2025 weist 8,2 Stunden und 142 Scrims aus — der Pfad wurde nach dem Abschluss erweitert, erkennbar an den mit „updated“ gekennzeichneten Modulen. Im Modul „Agents“ sind die mehrteiligen ReAct- und Function-Calling-Serien zu je einem Eintrag zusammengefasst.",
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
    preview: "/assets/certificates/learn-python.webp",
    tilePreview: "/assets/certificates/learn-python-tile.webp",
    summary:
      "Vollständiger Python-Grundkurs von Scrimba: kurze Video-Lektionen von vier bis acht Minuten im Wechsel mit interaktiven Coding-Challenges direkt im Browser. Der Kurs deckt die Sprache von Variablen, Datentypen und Strings über Listen, Tupel, Sets und Dictionaries bis zu Funktionen, Kontrollstrukturen, OOP, Exceptions, Lambdas und Comprehensions ab und übt jedes Thema an einer kleinen Aufgabe. Dozent ist Olof Paulson, mit Hintergrund in Finanzen, Portfolio-Management und Algorithmic Trading.",
    facts: [
      { label: "Umfang", value: "5,6 Std." },
      { label: "Lektionen", value: "62" },
      { label: "Dozent", value: "Olof Paulson" },
      { label: "Niveau", value: "Einsteiger" },
      { label: "Sprache", value: "Englisch" },
      { label: "Format", value: "Interaktive Scrims mit Challenges" },
      { label: "Abschluss", value: "12. Juni 2025" },
    ],
    outcomes: [
      "Python-Syntax und Programmfluss: Print Statements, Variablen, Datentypen und Typecasting, Nutzereingaben, arithmetische Operationen",
      "Strings: Slicing, Suchen und Ersetzen, String-Formatierung",
      "Datenstrukturen: Listen inklusive Split und Join, Tupel, Sets und Dictionaries — jeweils mit Übungen",
      "Funktionen: Aufrufe, Parameter und Argumente, Standardwerte, Named Notation, Return Statements",
      "Kontrollstrukturen: Booleans und Vergleiche, if/else/elif, while- und for-Loops sowie verschachtelte Schleifen",
      "Fortgeschrittenes: Klassen und Objekte (OOP), Vererbung, Exceptions mit try/except/raise, Lambda-Funktionen, List- und Dict-Comprehensions, File Handling",
      "Werkzeuge und Performance: enumerate, sort() und sorted(), zip und unzip, Randomness, Laufzeitmessung mit timeit",
      "Umsetzung in Challenges und kleinen Projekten — von Coffee Order Queue und Phone Number Normalizer bis Crypto Machine, Math Tutor und Project Euler Q4",
    ],
    curriculum: [
      {
        title: "Grundlagen und Basis-Konzepte",
        lessons: [
          "Course Introduction",
          "Running Python with Brython",
          "Print Statements & Programflow",
          "Variables",
          "Datatypes & Typecasting",
          "User Input",
          "Arithmetic Operations",
          "Strings: Basics & Slicing",
          "Strings: Find & Replace",
          "String-Formatierung",
        ],
      },
      {
        title: "Datenstrukturen",
        lessons: [
          "Listen: Grundlagen",
          "Listen: Split & Join",
          "Tupel",
          "Sets und Set-Übungen",
          "Dictionaries: Grundlagen",
          "Dictionaries: vertiefende Konzepte und Übungen",
        ],
      },
      {
        title: "Funktionen und Kontrollstrukturen",
        lessons: [
          "Funktionsaufrufe",
          "Parameter und Argumente",
          "Standardwerte",
          "Named Notation",
          "Return Statements",
          "Booleans und Vergleiche",
          "If / Else / Elif",
          "While-Loops",
          "For-Loops",
          "Verschachtelte Schleifen (Nesting)",
        ],
      },
      {
        title: "Fortgeschrittene Themen und Werkzeuge",
        lessons: [
          "Enumerate",
          "sort() und sorted()",
          "Zip und Unzip",
          "Randomness",
          "Timeit und Performance",
          "File Handling (Dateien lesen)",
          "Exceptions (try / except / raise)",
          "Klassen und Objekte (OOP)",
          "Vererbung (Inheritance)",
          "Lambda-Funktionen",
          "Comprehensions (Lists und Dictionaries)",
        ],
      },
      {
        title: "Challenges und Praxisprojekte",
        lessons: [
          "Arcade Day Pass Challenge",
          "Pit Stop Timing Optimizer Challenge",
          "Coffee Order Queue Challenge",
          "Phone Number Normalizer Challenge",
          "Access Control Scanner Challenge",
          "Loyalty Points Engine Challenge",
          "Dog Bus Tracker Challenge",
          "Pizza Builder Challenge",
          "Crypto Machine Project",
          "Math Tutor Project",
          "Marble / Trading Game Project",
          "Raffle Prize Picker",
          "Project Euler Q4 (Palindromes)",
        ],
      },
      {
        title: "Abschluss",
        lessons: [
          "Kurs-Zusammenfassung",
          "How to Utilize Your Certificate",
          "Certificate of Completion",
        ],
      },
    ],
    curriculumNote:
      "Inhalte thematisch gebündelt statt in der Kapitelnummerierung des Kurses; das Zertifikat weist 62 Lektionen aus.",
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
    preview: "/assets/certificates/learn-accessible-web-design.webp",
    tilePreview: "/assets/certificates/learn-accessible-web-design-tile.webp",
    summary:
      "Praxiskurs zu barrierefreiem Web-Design: Textkontraste, Alternativtexte, Links und Labels, semantisches HTML, Textgrößen und Heading-Struktur, ARIA inklusive Live-Regions, zugängliches JavaScript, das korrekte Verbergen von Inhalten und ein Skip-Navigation-Link. Jedes Thema wird zuerst als „Aside“ erklärt und unmittelbar danach als Challenge im Editor umgesetzt; zum Abschluss steht eine zweiteilige Gesamt-Challenge.",
    facts: [
      { label: "Umfang", value: "1,6 Std." },
      { label: "Lektionen", value: "28" },
      { label: "Sprache", value: "Englisch" },
      { label: "Format", value: "Interaktive Scrims mit Challenges" },
      { label: "Abschluss", value: "11. Juni 2025" },
    ],
    outcomes: [
      "Web-Barrierefreiheit verstehen: wen sie betrifft und woran Nutzung scheitert",
      "Farbe und Kontrast: Textkontraste prüfen und korrigieren, Farbe nie als einzigen Informationsträger einsetzen",
      "Alternativtexte und aussagekräftige Links statt „hier klicken“",
      "Formulare: Labels korrekt verknüpfen, Radio-Buttons sinnvoll gruppieren",
      "Semantisches HTML: echte Listen, saubere Heading-Hierarchie, skalierbare Textgrößen",
      "ARIA gezielt einsetzen — inklusive Live-Regions für dynamisch nachgeladene Inhalte",
      "Zugängliches JavaScript, Inhalte korrekt vor Screenreadern verbergen, Skip-Navigation-Link umsetzen",
      "Alles zusammen in einer zweiteiligen Abschluss-Challenge",
    ],
    curriculum: [
      {
        title: "Kursinhalt",
        meta: "28 Lektionen · 1,6 Std.",
        lessons: [
          "Accessible Development Intro",
          "Understanding web accessibility",
          "Aside: Text contrast",
          "Aside: Use of color",
          "Text contrast",
          "Aside: Alternative text",
          "Aside: Links",
          "Links and alternative text",
          "Aside: Labels",
          "Aside: Radio buttons",
          "Labels",
          "Semantic HTML",
          "Lists",
          "Text-size",
          "Headings",
          "ARIA",
          "ARIA live regions",
          "Aside: Accessible JavaScript",
          "Aside: Hiding content",
          "Aside: Skip Navigation Link Part 1",
          "Aside: Skip Navigation Link Part 2",
          "Skip Navigation Link",
          "Final challenge part 1",
          "Final challenge part 2",
          "Want to become a Scrimbassador?",
          "Outro",
          "How to Utilize Your Certificate",
          "Certificate of Completion",
        ],
      },
    ],
  },
  {
    slug: "complete-python-mastery",
    title: "Complete Python Mastery",
    issuer: "Code with Mosh",
    date: "Juni 2025",
    sort: "2025-06-02",
    detail: "12 Std · 200 Lektionen",
    cat: "Python",
    tags: ["OOP"],
    preview: "/assets/certificates/complete-python-mastery.webp",
    tilePreview: "/assets/certificates/complete-python-mastery-tile.webp",
    summary:
      "Umfassender Python-Kurs von Mosh Hamedani, der die Sprache von den Grundlagen bis in die Breite ihres Ökosystems durchgeht: primitive Typen, Control Flow und Funktionen, ein großes Kapitel Datenstrukturen (Listen, Tupel, Sets, Dictionaries, Comprehensions, Generatoren), Exceptions und ein ausführlicher Teil zu objektorientierter Programmierung — von Magic Methods und Properties über Mehrfachvererbung und Abstract Base Classes bis zu Polymorphie, Duck Typing und Data Classes. Dazu Module und Pakete, die Standardbibliothek (Dateien, CSV, JSON, SQLite, Datum und Zeit, E-Mail, Subprozesse), der Python Package Index samt Veröffentlichen eigener Pakete sowie Praxismodule zu Web Scraping, Browser-Automatisierung, Excel und NumPy, einer Django-Webanwendung bis zum Deployment und einer Einführung in Machine Learning mit scikit-learn. Vollständig abgeschlossen (alle Lektionen).",
    facts: [
      { label: "Umfang", value: "12 Std." },
      { label: "Lektionen", value: "200 in 13 Abschnitten" },
      { label: "Dozent", value: "Mosh Hamedani" },
      { label: "Sprache", value: "Englisch" },
      { label: "Format", value: "Video-Kurs mit Übungen und Quizzes" },
      { label: "Fortschritt", value: "100 % abgeschlossen" },
      { label: "Abschluss", value: "2. Juni 2025" },
    ],
    outcomes: [
      "Sprachgrundlagen: Variablen, Strings mit Escape-Sequenzen und f-Strings, Zahlen, Typkonvertierung",
      "Control Flow: Vergleichs- und Logikoperatoren, Short-circuit Evaluation, verkettete Vergleiche, For- und While-Schleifen, verschachtelte Schleifen, Iterables",
      "Funktionen: Argumente, Keyword- und Default-Argumente, *args und **kwargs, Scope und Debugging",
      "Datenstrukturen in der Breite: Listen mit Unpacking und Sortierung, Lambda, map und filter, List- und Dictionary-Comprehensions, Zip, Stacks, Queues, Tupel, Arrays, Sets, Dictionaries, Generator Expressions und der Unpacking-Operator",
      "Exceptions: gezielt behandeln, aufräumen, das With-Statement, eigene Exceptions auslösen und die Kosten davon einschätzen",
      "Objektorientierung: Konstruktoren, Klassen- gegen Instanzattribute und -methoden, Magic Methods, Operatorüberladung, eigene Container, Private Members, Properties",
      "Vererbung und Polymorphie: Method Overriding, mehrstufige und Mehrfachvererbung, Abstract Base Classes, Duck Typing, Erweitern eingebauter Typen, Data Classes",
      "Module und Pakete: Modul-Suchpfad, Packages und Sub-packages, Intra-package References, Module als Skript ausführen",
      "Standardbibliothek: Pfade, Verzeichnisse und Dateien, Zip, CSV, JSON, SQLite, Timestamps und DateTimes, Zufallswerte, E-Mail-Versand, Templates, CLI-Argumente, externe Programme",
      "Paket-Ökosystem: PyPI und Pip, virtuelle Umgebungen mit Pipenv, Dependency-Management, eigene Pakete veröffentlichen, Docstrings und Pydoc",
      "Praxis-Pakete: REST-APIs konsumieren, API-Keys verstecken, SMS versenden, Web Scraping, Browser-Automatisierung, PDFs und Excel-Dateien, NumPy",
      "Django: Views, Models und Migrationen, Admin anpassen, Templates mit Bootstrap, URL-Parameter, 404-Behandlung, APIs bauen und die Anwendung deployen",
      "Machine Learning: Datensätze einlesen und vorbereiten, Modelle trainieren und Vorhersagen treffen, Genauigkeit berechnen, Modelle persistieren und einen Decision Tree visualisieren",
    ],
    curriculum: [
      {
        title: "Getting Started",
        meta: "4 Lektionen",
        lessons: [
          "Welcome",
          "Questions and Support",
          "Connect with Me",
          "Learning Paths",
        ],
      },
      {
        title: "Getting Started with Python",
        meta: "32 Min. · 12 Lektionen",
        lessons: [
          "What is Python",
          "Installing Python",
          "Python Interpreter",
          "Code Editors",
          "Bonus: Redeem Your FREE Access to PyCharm",
          "Your First Python Program",
          "Python Extension",
          "Formatting Python Code",
          "Running Python Code",
          "Python Implementations",
          "How Python Code is Executed",
          "Quiz",
        ],
      },
      {
        title: "Primitive Types",
        meta: "34 Min. · 10 Lektionen",
        lessons: [
          "Variables",
          "Variable Names",
          "Strings",
          "Escape Sequences",
          "Formatted Strings",
          "String Methods",
          "Numbers",
          "Working with Numbers",
          "Type Conversion",
          "Quiz",
        ],
      },
      {
        title: "Control Flow",
        meta: "37 Min. · 14 Lektionen",
        lessons: [
          "Comparison Operators",
          "Conditional Statements",
          "Ternary Operator",
          "Logical Operators",
          "Short-circuit Evaluation",
          "Chaining Comparison Operators",
          "Quiz",
          "For Loops",
          "For..Else",
          "Nested Loops",
          "Iterables",
          "While Loops",
          "Infinite Loops",
          "Exercise",
        ],
      },
      {
        title: "Functions",
        meta: "41 Min. · 14 Lektionen",
        lessons: [
          "Defining Functions",
          "Arguments",
          "Types of Functions",
          "Keyword Arguments",
          "Default Arguments",
          "*args",
          "**kwargs",
          "Scope",
          "Debugging",
          "VSCode Coding Tricks — Windows",
          "VSCode Coding Tricks — Mac",
          "Exercise",
          "Solution",
          "A Quick Note",
        ],
      },
      {
        title: "Data Structures",
        meta: "1 Std. 20 Min. · 23 Lektionen",
        lessons: [
          "Lists",
          "Accessing Items",
          "List Unpacking",
          "Looping over Lists",
          "Adding or Removing Items",
          "Finding Items",
          "Sorting Lists",
          "Lambda Functions",
          "Map Function",
          "Filter Function",
          "List Comprehensions",
          "Zip Function",
          "Stacks",
          "Queues",
          "Tuples",
          "Swapping Variables",
          "Arrays",
          "Sets",
          "Dictionaries",
          "Dictionary Comprehensions",
          "Generator Expressions",
          "Unpacking Operator",
          "Exercise",
        ],
      },
      {
        title: "Exceptions",
        meta: "20 Min. · 7 Lektionen",
        lessons: [
          "Exceptions",
          "Handling Exceptions",
          "Handling Different Exceptions",
          "Cleaning Up",
          "The With Statement",
          "Raising Exceptions",
          "Cost of Raising Exceptions",
        ],
      },
      {
        title: "Classes",
        meta: "1 Std. 25 Min. · 22 Lektionen",
        lessons: [
          "Classes",
          "Creating Classes",
          "Constructors",
          "Class vs Instance Attributes",
          "Class vs Instance Methods",
          "Magic Methods",
          "Comparing Objects",
          "Performing Arithmetic Operations",
          "Making Custom Containers",
          "Private Members",
          "Properties",
          "Inheritance",
          "The Object Class",
          "Method Overriding",
          "Multi-level Inheritance",
          "Multiple Inheritance",
          "A Good Example of Inheritance",
          "Abstract Base Classes",
          "Polymorphism",
          "Duck Typing",
          "Extending Built-in Types",
          "Data Classes",
        ],
      },
      {
        title: "Modules",
        meta: "20 Min. · 8 Lektionen",
        lessons: [
          "Creating Modules",
          "Compiled Python Files",
          "Module Search Path",
          "Packages",
          "Sub-packages",
          "Intra-package References",
          "The dir Function",
          "Executing Modules as Scripts",
        ],
      },
      {
        title: "Python Standard Library",
        meta: "1 Std. · 17 Lektionen",
        lessons: [
          "Python Standard Library",
          "Working With Paths",
          "Working with Directories",
          "Working with Files",
          "Working with Zip Files",
          "Working with CSV Files",
          "Working with JSON Files",
          "Working with a SQLite Database",
          "Working with Timestamps",
          "Working with DateTimes",
          "Working with Time Deltas",
          "Generating Random Values",
          "Opening the Browser",
          "Sending Emails",
          "Templates",
          "Command-line Arguments",
          "Running External Programs",
        ],
      },
      {
        title: "Python Package Index",
        meta: "48 Min. · 10 Lektionen",
        lessons: [
          "Pypi",
          "Pip",
          "Virtual Environments",
          "Pipenv",
          "Virtual Environments in VSCode",
          "Pipfile",
          "Managing Dependencies",
          "Publishing Packages",
          "Docstrings",
          "Pydoc",
        ],
      },
      {
        title: "Popular Python Packages",
        meta: "1 Std. 30 Min. · 12 Lektionen",
        lessons: [
          "Introduction",
          "What are APIs",
          "Yelp API",
          "Searching for Businesses",
          "Hiding API Keys",
          "Sending Text Messages",
          "Web Scraping",
          "Browser Automation",
          "Working with PDFs",
          "Working with Excel Spreadsheets",
          "Command Query Separation Principle",
          "NumPy",
        ],
      },
      {
        title: "Building Web Applications with Django",
        meta: "2 Std. · 22 Lektionen",
        lessons: [
          "Introduction",
          "Your First Django Project",
          "Your First App",
          "Views",
          "Models",
          "Migrations",
          "Changing the Models",
          "Admin",
          "Customizing the Admin",
          "Database Abstraction API",
          "Templates",
          "Adding Bootstrap",
          "Customizing the Layout",
          "Sharing a Template Across Multiple Apps",
          "Url Parameters",
          "Getting a Single Object",
          "Raising 404 Errors",
          "Referencing Urls",
          "Creating APIs",
          "Adding the Homepage",
          "Getting Ready to Deploy",
          "Deployment",
        ],
      },
      {
        title: "Machine Learning with Python",
        meta: "48 Min. · 12 Lektionen",
        lessons: [
          "What is Machine Learning",
          "Machine Learning in Action",
          "Libraries and Tools",
          "Importing a Data Set",
          "Jupyter Shortcuts",
          "A Real Machine Learning Problem",
          "Preparing the Data",
          "Learning and Predicting",
          "Calculating the Accuracy",
          "Persisting Models",
          "Visualizing a Decision Tree",
          "Thank You",
        ],
      },
    ],
    curriculumNote:
      "Die Kursseite nennt 12 Stunden und 200 Lektionen in 13 Abschnitten, listet die Einzellektionen aber nur für „Getting Started“. Die Gliederung hier ist deshalb dem Kursplayer entnommen und zeigt alle 187 Lektionen, die zum Abschluss im Juni 2025 enthalten waren; sie führt „Getting Started“ als zwei Module, wo die Kursseite eines nennt. Die Urkunde von Code with Mosh weist selbst keinen Umfang aus. Der Kurs heißt auf der Kursseite inzwischen The Complete Python Programming Course.",
  },
];

/* Client & project-team references. Each has a stable slug so it can be linked
   from anywhere (e.g. the PDF CV) via /references/<slug>; the slug is a
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
  /** Stable slug — the reference lives at /references/<slug> forever. */
  slug: string;
  name: string;
  role: string;
  /** Company or organisation the recommender represents. */
  company?: string;
  /** Company website; makes the company name a link when set. */
  companyUrl?: string;
  /** Relationship to Nikita, e.g. "Kunde", "Projektteam". */
  relation: string;
  /** Slug of the related project (links to /projects/<slug>). */
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
  if (!Array.isArray(data)) throw new Error("references.json: not an array");
  const projectSlugs = new Set(projects.map((p) => p.slug));
  for (const r of data as Reference[]) {
    if (!r.slug || !r.name || !r.role || !r.relation || !r.project || !r.sort || !r.quote || !r.short) {
      throw new Error(`references.json: missing required field for "${r.slug ?? "?"}"`);
    }
    for (const s of r.sources) {
      if (!(s in referenceSources)) {
        throw new Error(`references.json: unknown source "${s}" for "${r.slug}"`);
      }
    }
    if (r.projectSlug && !projectSlugs.has(r.projectSlug)) {
      throw new Error(`references.json: unknown projectSlug "${r.projectSlug}" for "${r.slug}"`);
    }
  }
  return data as Reference[];
}

export const references: Reference[] = assertReferences(referencesData.references);

/* All published references for one project, in the order of references.json
   (newest first). One source for the project dialog, the per-project
   listing route (/projects/<slug>/references) and the sitemap. */
export const referencesForProject = (projectSlug: string): Reference[] =>
  references.filter((r) => r.projectSlug === projectSlug);

/* Projects with at least one reference — exactly the projects for which
   /projects/<slug>/references exists. Projects without one have no route:
   an empty listing would be a thin page with nothing to show. */
export const projectsWithReferences: Project[] = projects.filter(
  (p) => referencesForProject(p.slug).length > 0,
);

/* Headings for the floating table-of-contents navigation. */
export type TocItem = { id: string; label: string; level: 1 | 2 };

export const sections: TocItem[] = [
  { id: "contact", label: "Kontakt", level: 2 },
  { id: "facts", label: "Eckdaten", level: 2 },
  { id: "languages", label: "Sprachen", level: 2 },
  { id: "approach", label: "Arbeitsweise", level: 2 },
  { id: "focus", label: "Schwerpunkt", level: 1 },
  { id: "projects", label: "Projekte", level: 1 },
  { id: "references", label: "Referenzen", level: 1 },
  { id: "skills", label: "Skills", level: 1 },
  { id: "certificates", label: "Zertifikate", level: 1 },
];
