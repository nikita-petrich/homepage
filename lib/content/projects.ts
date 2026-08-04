import { t, type I18nText } from "@/lib/i18n/text";

import { techList } from "./terms";

/* The nine reference projects, newest first. Slugs are permanent — each one is
   a public URL (/projects/<slug>) and must never change. */

type Text = I18nText | string;

export type ProjectSource = {
  num: string;
  /** Stable URL slug — never change an existing one; it is a permanent route. */
  slug: string;
  name: string;
  /** Client / company the project was for ("own product" for own products). */
  company?: Text;
  /** Company/product website; makes the company name a link when set. */
  companyUrl?: string;
  subtitle: Text;
  cat: Text;
  /** Headline role, shown next to the date on the detail view. Where a project
      involved more than one role, this is the leading one — the full set
      belongs in the "Rolle" meta cell, which takes a list. */
  role: Text;
  dateRange: Text;
  sort: string;
  caption: Text;
  /** Optional cover image (served from /public); falls back to a placeholder. */
  cover?: string;
  cardTags: Text[];
  desc: Text;
  /* A cell may hold several values — two roles held in the same project, say.
     They render as stacked lines in one cell rather than as separate cells, so
     the six-cell grid keeps its shape. Keep such a list to two or three
     entries: beyond that it reads as a claim rather than as a fact. */
  meta: { label: Text; value: Text | Text[] }[];
  responsibilities: Text[];
  results: Text[];
  tech: Text[];
};

const ownProduct = t("Eigenprodukt", "Own product");
const soloClient = t("Solo · Kundenprojekt", "Solo · client project");
const internalSystem = t("Internes System", "Internal system");
const selfDirected = t("Eigenverantwortlich", "Self-directed");
const german = t("Deutsch", "German");

const label = {
  role: t("Rolle", "Role"),
  /* Every project carries this one, and its value always leads with the team
     size — a headcount ("3 Personen", "~20 Engineers") or "Solo" for the
     one-person projects. Qualifiers ("Kundenprojekt", the disciplines) follow
     after the separator. */
  team: t("Team", "Team"),
  location: t("Standort", "Location"),
  language: t("Sprache", "Language"),
  website: t("Website", "Website"),
  method: t("Methodik", "Methodology"),
  visibility: t("Sichtbarkeit", "Visibility"),
};

export const projects: ProjectSource[] = [
  {
    num: "01",
    slug: "bescheidklar",
    name: "BESCHEIDKLAR",
    company: ownProduct,
    companyUrl: "https://bescheidklar.de",
    subtitle: t(
      "KI-gestützte LegalTech-SaaS-Plattform",
      "AI-assisted LegalTech SaaS platform",
    ),
    cat: "LegalTech / GovTech",
    role: t("Gründer & CTO", "Founder & CTO"),
    dateRange: t("04/2025 – heute", "04/2025 – today"),
    /* Ongoing project: sorts by its current activity rather than its 04/2025
       start, so the active flagship leads the newest-first gallery (matching
       num 01). Bump this above the newest completed project's start date. */
    sort: "2026-07",
    caption: t("KI-Vorprüfung für Bescheide", "AI pre-assessment of official notices"),
    cover: "/assets/projects/bescheidklar.jpg",
    cardTags: ["LegalTech", t("KI · RAG", "AI · RAG")],
    desc: t(
      "Zweiseitige LegalTech-SaaS-Plattform, die KI-gestützte Dokumentenanalyse (Azure OpenAI) mit einem regionalen Lizenzmodell für Anwaltskanzleien verbindet.",
      "Two-sided LegalTech SaaS platform combining AI-assisted document analysis (Azure OpenAI) with a regional licensing model for law firms.",
    ),
    meta: [
      { label: label.role, value: t("Gründer & CTO", "Founder & CTO") },
      {
        label: label.team,
        value: t(
          "Solo · Eigenprodukt (nebenberuflich)",
          "Solo · own product (side project)",
        ),
      },
      {
        label: label.location,
        value: t("Niedersachsen, DE · Remote", "Lower Saxony, DE · remote"),
      },
      { label: label.language, value: german },
      { label: label.website, value: "bescheidklar.de" },
      {
        label: label.method,
        value: t("Direkte Produktverantwortung", "Direct product ownership"),
      },
    ],
    responsibilities: [
      t(
        "Aufbau einer modularen, service-orientierten Architektur für Betroffenen-Frontend, Kanzlei-Bereich und das regionale Lizenzmodell (Stripe).",
        "Built a modular, service-oriented architecture for the claimant-facing frontend, the law firm area and the regional licensing model (Stripe).",
      ),
      t(
        "KI-Vorprüfungs-Pipeline für Bescheide und Kündigungen (in Umsetzung): Extraktion → Fristprüfung → Plausibilitäts- und Erfolgseinschätzung mit strukturierter Aufbereitung des Falls.",
        "AI pre-assessment pipeline for official notices and terminations (in progress): extraction → deadline check → plausibility and prospects assessment, with the case prepared in structured form.",
      ),
      t(
        "Automatisierte, DSGVO-konforme Übergabe qualifizierter Leads inkl. hochgeladener Dokumente an passende Spezialisten (Rechtsanwälte, Law Clinics).",
        "Automated, GDPR-compliant handover of qualified leads including uploaded documents to matching specialists (lawyers, law clinics).",
      ),
      t(
        "RAG-basierter Ratgeber-Bereich mit Artikeln und Handlungsempfehlungen für Betroffene.",
        "RAG-based guidance section with articles and recommended next steps for those affected.",
      ),
      t(
        "Abdeckung mehrerer Rechtsbereiche (Rechts-, Sozial- und Arbeitswesen) über eine erweiterbare, mehrsprachige und barrierearme Weboberfläche.",
        "Coverage of several legal areas (civil, social and employment law) through an extensible, multilingual and low-barrier web interface.",
      ),
      t(
        "Gesamtverantwortung für Tech-Stack, Hosting auf EU-Infrastruktur und ein Secure-by-Design-Compliance-Konzept (EU AI Act, DSGVO, RDG).",
        "End-to-end responsibility for the tech stack, hosting on EU infrastructure and a secure-by-design compliance concept (EU AI Act, GDPR, German Legal Services Act).",
      ),
      t(
        "Aufbau typsicherer End-to-End-Datenflüsse (TypeScript, DTOs, Zod) mit automatisierter CI/CD-Auslieferung (GitHub Actions, Docker), Monitoring/Fehler-Tracking (Sentry) und Test-Abdeckung (Vitest, Playwright).",
        "Type-safe end-to-end data flows (TypeScript, DTOs, Zod) with automated CI/CD delivery (GitHub Actions, Docker), monitoring and error tracking (Sentry) and test coverage (Vitest, Playwright).",
      ),
    ],
    results: [
      t(
        "MVP in Eigenregie umgesetzt – Architektur, Plattform und Betrieb auf EU-Infrastruktur aus einer Hand.",
        "MVP delivered single-handedly — architecture, platform and operation on EU infrastructure from one source.",
      ),
      t(
        "Compliance im Produktdesign verankert statt nachgerüstet: EU AI Act, DSGVO und die Grenzen des RDG von Beginn an eingeplant.",
        "Compliance built into the product design rather than retrofitted: the EU AI Act, the GDPR and the limits of the German Legal Services Act were part of the plan from the start.",
      ),
      t(
        "Zielbild: bis zu 10.000 automatisierte Vorprüfungen pro Monat und bis zu 80 % weniger manuelle Fallannahme – in einem Markt mit 167.547 zugelassenen Rechtsanwältinnen und Rechtsanwälten (BRAK, 01.01.2026).",
        "Target: up to 10,000 automated pre-assessments per month and up to 80 % less manual case intake — in a market of 167,547 admitted lawyers (German Federal Bar, 1 Jan 2026).",
      ),
      t(
        "Planbarer Zustrom vorqualifizierter Mandate für angebundene Kanzleien statt aufwändiger manueller Ersteinschätzung.",
        "A predictable inflow of pre-qualified cases for partner law firms instead of costly manual initial assessment.",
      ),
      t(
        "Auslieferung vollständig automatisiert: Tests, Build und Container-Deployment laufen über GitHub Actions, Fehler im Betrieb melden sich über Sentry – Releases ohne manuellen Eingriff, auch als Ein-Personen-Team.",
        "Delivery fully automated: tests, build and container deployment run through GitHub Actions, and production errors surface through Sentry — releases with no manual step, even as a one-person team.",
      ),
    ],
    tech: techList([
      "TypeScript", "JavaScript", "Python", "SQL", "Bash", "HTML", "CSS",
      "JSON", "YAML", "UML", "Next.js", "React",
      "Server-Side Rendering (SSR)", "FastAPI", "Backend-Entwicklung",
      "Frontend-Entwicklung", "Web-Entwicklung", "Künstliche Intelligenz",
      "GenAI", "AI Engineering", "LLM-Integration", "OpenAI API",
      "Azure OpenAI", "RAG (Retrieval Augmented Generation)",
      "Prompt Engineering", "Embeddings", "Vektordatenbanken", "pgvector",
      "Semantische Suche", "OCR", "Dokumentenanalyse", "LangChain",
      "KI-Agenten", "Multi-Agent-Workflows", "KI-gestützte Automatisierung",
      "KI-gestützte Testgenerierung", "DSGVO-konforme KI-Architektur",
      "Claude Code", "Claude Code Hooks", "Slash Commands", "Agent Skills",
      "Subagenten", "ChatGPT", "v0", "Agentic Coding",
      "Agentic Software Engineering", "Context Engineering",
      "Spec-Driven Development", "PostgreSQL", "Redis", "Datenarchitektur",
      "Tailwind CSS", "shadcn/ui", "Komponentenbibliotheken", "Storybook",
      "Design Tokens", "Wireframing", "Internationalisierung (i18n)",
      "Barrierefreiheit (WCAG)", "Barrierefreiheitsstärkungsgesetz (BFSG)",
      "European Accessibility Act (EAA)", "Stripe", "Zahlungsabwicklung",
      "SEPA", "JWT", "OAuth 2.0", "Secure by Design", "IT-Sicherheit",
      "Ende-zu-Ende-Verschlüsselung", "Docker", "GitHub Actions", "CI/CD",
      "Continuous Integration", "DevOps", "Hetzner", "IONOS", "EU-Hosting",
      "Linux", "Ubuntu", "TCP/IP", "IP-Netzwerke", "DNS", "HTTP/HTTPS",
      "Sentry", "Monitoring", "Observability", "Vitest",
      "Playwright", "Unit Testing", "Integrationstests", "End-to-End-Tests",
      "API-Testing", "Postman", "Testautomatisierung", "Zod", "DTOs", "Slack",
      "Husky", "pnpm", "CLI (Command Line Interface)", "Software-Architektur",
      "API-First", "Middleware", "Design Patterns", "Domain-Driven Design",
      "Microservices", "Skalierbare Architektur", "Clean Code", "SOLID",
      "Clean Architecture", "MVP-Entwicklung", "SaaS", "Kanzleisoftware",
      "Prozessdigitalisierung", "EU AI Act", "AI Governance", "DSGVO",
      "Privacy by Design", "Datenminimierung",
      "Auftragsverarbeitungsvertrag (AVV)", "Digitale Souveränität", "Kanban",
      "Projektmanagement", "IT-Strategie", "Digitalstrategie",
      "Digitale Transformation", "Softwareentwicklung", "Produktverantwortung", "Entrepreneurship",
    ]),
  },
  {
    num: "02",
    slug: "manifest-os",
    name: "Manifest OS",
    company: "Manifest Law",
    companyUrl: "https://manifestlaw.com",
    subtitle: t(
      "KI-gestützte Einwanderungsplattform",
      "AI-assisted immigration platform",
    ),
    cat: "LegalTech / Immigration",
    role: t(
      "Full-Stack Engineer (KI-Feature-Integration)",
      "Full-stack engineer (AI feature integration)",
    ),
    dateRange: t(
      "12/2025 – 04/2026 · ~5 Monate",
      "12/2025 – 04/2026 · ~5 months",
    ),
    sort: "2025-12",
    caption: t("B2X-Portal — Fallübersicht", "B2X portal — case overview"),
    cover: "/assets/projects/manifest-os.jpg",
    cardTags: ["LegalTech", t("KI-Features", "AI features")],
    desc: t(
      "KI-Feature-Integration in einer etablierten US-Einwanderungsplattform (~60 Mio. USD Bewertung) mit über 3.000 Kunden und über 100 Anwältinnen und Anwälten.",
      "AI feature integration in an established US immigration platform (~USD 60 m valuation) with more than 3,000 clients and over 100 lawyers.",
    ),
    meta: [
      { label: label.role, value: t("Full-Stack Engineer", "Full-stack engineer") },
      {
        label: label.team,
        value: t(
          "~20 Engineers in 4 Teams · Platform, AI, Fullstack",
          "~20 engineers across 4 teams · platform, AI, full-stack",
        ),
      },
      { label: label.location, value: t("New York, USA · Remote", "New York, USA · remote") },
      { label: label.language, value: t("Englisch · EU & US", "English · EU & US") },
      { label: label.website, value: "manifestlaw.com" },
      {
        label: label.method,
        value: t(
          "Scrum · autonom · mit PM und Design",
          "Scrum · autonomous · with PM and design",
        ),
      },
    ],
    responsibilities: [
      t(
        "Produktive KI-Anreicherung anwaltlicher Erstgespräch-Leads (HubSpot, Cal.com, Bluedot): Aufzeichnungen werden transkribiert, über Webhook und BullMQ-Queue an die OpenAI-Integration übergeben und strukturiert in die Kernsysteme zurückgeschrieben – als Grundlage für eine effizientere Fallbearbeitung.",
        "Production AI enrichment of initial legal consultation leads (HubSpot, Cal.com, Bluedot): recordings are transcribed, passed to the OpenAI integration through a webhook and a BullMQ queue, and written back into the core systems in structured form — the basis for more efficient case handling.",
      ),
      t(
        "KI-gestützte Evidence-Verarbeitung: hochgeladene Falldokumente werden automatisiert analysiert, klassifiziert und einheitlich benannt.",
        "AI-assisted evidence processing: uploaded case documents are analysed, classified and consistently named automatically.",
      ),
      t(
        "Konsolidierung von vier Portalen (B2B, B2C, Lawyer, Ops) in ein einheitliches „B2X“-Portal – im Team aus vier Engineers, mit Schwerpunkt auf der Fullstack-Migration der B2B- und Ops-Bereiche.",
        "Consolidation of four portals (B2B, B2C, lawyer, ops) into a single “B2X” portal — in a team of four engineers, focusing on the full-stack migration of the B2B and ops areas.",
      ),
      t(
        "Einführung eines anwendungsweiten Event-Trackings (Amplitude) als Datengrundlage für Produkt- und Data-Analytics.",
        "Introduction of application-wide event tracking (Amplitude) as the data foundation for product and data analytics.",
      ),
      t(
        "Resilienz der ereignisgetriebenen Services (NestJS, BullMQ): Retry-Strategien, Idempotenz und definiertes Verhalten bei Ausfällen der KI- und Transkriptions-Dienste.",
        "Resilience of the event-driven services (NestJS, BullMQ): retry strategies, idempotency and defined behaviour when the AI and transcription services fail.",
      ),
      t(
        "Umsetzung im Monorepo mit klar abgegrenzten Feature-Modulen für eine zukünftig möglichst schnelle Aufteilung in Microservices, mit typsicheren Schnittstellen (TypeScript, DTOs) sowie automatisierten Tests (Jest, Playwright) im CI/CD-Prozess.",
        "Delivery within a monorepo with clearly scoped feature modules, so it can be split into microservices quickly later on, with type-safe interfaces (TypeScript, DTOs) and automated tests (Jest, Playwright) in the CI/CD pipeline.",
      ),
      t(
        "Enge Zusammenarbeit in Code-Reviews und Einsatz KI-gestützter Werkzeuge (Claude Code, Cursor AI, Code Rabbit) zur Sicherung von Qualität und Entwicklungstempo.",
        "Close collaboration in code reviews and use of AI-assisted tools (Claude Code, Cursor AI, Code Rabbit) to safeguard quality and development pace.",
      ),
    ],
    results: [
      t(
        "KI-Features im Produktivbetrieb: Erstgespräch-Leads und Falldokumente werden ohne manuelle Nacharbeit angereichert, klassifiziert und benannt.",
        "AI features running in production: consultation leads and case documents are enriched, classified and named without manual rework.",
      ),
      t(
        "Anwendungsweites Event-Tracking als gemeinsame Datengrundlage für Produkt- und Data-Analytics etabliert.",
        "Application-wide event tracking established as a shared data foundation for product and data analytics.",
      ),
      t(
        "Refactoring-Initiativen in den migrierten B2B- und Ops-Bereichen: bestehende Strukturen vereinfacht und auf bessere Wartbarkeit ausgerichtet.",
        "Refactoring initiatives in the migrated B2B and ops areas: existing structures simplified and geared towards better maintainability.",
      ),
      t(
        "Laut Anbieter über 3.000 Kunden, 150+ Corporate-Programme und bis zu 15 % höhere Genehmigungsraten gegenüber dem USCIS-Durchschnitt (Team-Ergebnis).",
        "According to the provider: more than 3,000 clients, 150+ corporate programmes and up to 15 % higher approval rates than the USCIS average (a team result).",
      ),
    ],
    tech: techList([
      "TypeScript", "JavaScript", "Python", "SQL", "HTML", "CSS", "JSON", "YAML",
      "Next.js", "React", "Server-Side Rendering (SSR)", "NestJS", "Node.js",
      "Fastify", "Express.js", "Dependency Injection", "REST API", "Webhooks",
      "DTOs", "BullMQ", "RabbitMQ", "Caching", "Backend-Entwicklung",
      "Frontend-Entwicklung", "Web-Entwicklung", "Künstliche Intelligenz",
      "GenAI", "AI Engineering", "LLM-Integration", "OpenAI API",
      "Anthropic Claude API", "Model Context Protocol (MCP)", "Bluedot",
      "HubSpot", "CRM", "Cal.com", "Amplitude", "Product Analytics",
      "PostgreSQL", "Redis", "MikroORM", "Drizzle ORM", "TanStack Query",
      "better-auth", "JWT", "Docker", "Linux", "Ubuntu", "TCP/IP",
      "IP-Netzwerke", "HTTP/HTTPS", "Google Cloud Platform (GCP)", "Vercel",
      "GitHub Actions", "CI/CD", "Continuous Integration", "Datadog",
      "Monitoring", "Observability", "Playwright", "End-to-End-Tests",
      "Claude Code", "Cursor AI", "Code Rabbit", "Agentic Coding",
      "Agentische Pull-Request-Workflows", "Code Reviews", "Linear", "Figma",
      "Slack", "Husky", "CLI (Command Line Interface)", "Google Calendar",
      "Google Workspace (Meet, APIs)", "Monorepo", "Turborepo", "Microservices",
      "Domain-Driven Design", "Skalierbare Architektur",
      "Event-Driven Architecture", "Idempotenz", "Clean Architecture",
      "Agile Methoden", "Digitale Transformation", "Public Speaking",
      "Softwareentwicklung",
    ]),
  },
  {
    num: "03",
    slug: "rate-up",
    name: "RateUp",
    company: "Krutzfeld Tech GmbH",
    companyUrl: "https://krutzfeld.tech",
    subtitle: t(
      "Bewertungs-App für Web, iOS und Android",
      "Rating app for web, iOS and Android",
    ),
    cat: t("Social Media / Mobile App", "Social media / mobile app"),
    role: t("Sole Developer · Full-Stack", "Sole developer · full-stack"),
    dateRange: t("11/2025 – 12/2025 · ~2 Monate", "11/2025 – 12/2025 · ~2 months"),
    sort: "2025-11",
    caption: t(
      "Cross-Platform-App für Web, iOS und Android",
      "Cross-platform app for web, iOS and Android",
    ),
    cover: "/assets/projects/rate-up.jpg",
    cardTags: [t("Social Media", "Social media"), t("Cross-Platform", "Cross-platform")],
    desc: t(
      "Cross-Platform-App im Social-Media-Umfeld: Bewertungen, Feed und Profile aus einer Ionic-/Angular-Codebasis für Web, iOS und Android – Backend vollständig auf Firebase.",
      "Cross-platform social media app: ratings, feed and profiles from a single Ionic/Angular codebase for web, iOS and Android — backend entirely on Firebase.",
    ),
    meta: [
      { label: label.role, value: t("Sole Developer · Full-Stack", "Sole developer · full-stack") },
      { label: label.team, value: soloClient },
      { label: label.location, value: t("Zürich, CH · Remote", "Zurich, CH · remote") },
      { label: label.language, value: german },
      { label: label.website, value: "krutzfeld.tech" },
      { label: label.method, value: selfDirected },
    ],
    responsibilities: [
      t(
        "Bewertungs-App im Social-Media-Umfeld aus einer einzigen Ionic-/Angular-Codebasis – als installierbare PWA im Web und als native Builds für iOS und Android (Capacitor).",
        "Social media rating app from a single Ionic/Angular codebase — as an installable PWA on the web and as native builds for iOS and Android (Capacitor).",
      ),
      t(
        "Registrierung, Login und Onboarding inklusive Profilerstellung (Firebase Authentication), abgesichert über Firebase Security Rules.",
        "Sign-up, login and onboarding including profile creation (Firebase Authentication), secured through Firebase security rules.",
      ),
      t(
        "Social-Media-Feed mit Filtern, eigenen Beiträgen und Media-Upload (Cloud Firestore, Cloud Storage).",
        "Social media feed with filters, own posts and media upload (Cloud Firestore, Cloud Storage).",
      ),
      t(
        "Serverseitige Logik in Cloud Functions, Auslieferung über Firebase Hosting und eine CI/CD-Pipeline (GitHub Actions) für alle drei Plattformen.",
        "Server-side logic in Cloud Functions, delivery via Firebase Hosting and a CI/CD pipeline (GitHub Actions) for all three platforms.",
      ),
      t(
        "Wartbare Codebasis für die Übergabe: klar geschichtete Struktur, wiederverwendbare Komponenten, typsichere Modelle, Unit-Tests und durchgängiger Clean-Code-Stil (SOLID).",
        "A maintainable codebase for handover: clearly layered structure, reusable components, type-safe models, unit tests and a consistent clean-code style (SOLID).",
      ),
    ],
    results: [
      t(
        "Fertiges Produkt an den Kunden übergeben – lauffähig als PWA im Web und als native App auf iOS und Android aus einer gemeinsamen Codebasis.",
        "Finished product handed over to the client — running as a PWA on the web and as a native app on iOS and Android from one shared codebase.",
      ),
      t(
        "Vollständig auf Firebase aufgesetzt: Authentifizierung, Datenhaltung, Media-Storage, Serverlogik und Auslieferung.",
        "Built entirely on Firebase: authentication, data storage, media storage, server logic and delivery.",
      ),
      t(
        "Übergabefähige Codebasis: einheitliche Struktur, wiederverwendbare Komponenten, Unit-Tests und durchgängige Typsicherheit – das Kundenteam kann ohne Einarbeitungshürde weiterarbeiten.",
        "A codebase ready for handover: consistent structure, reusable components, unit tests and type safety throughout — the client's team can carry on without a ramp-up hurdle.",
      ),
      t(
        "Drei Auslieferungswege aus einer Pipeline: Web-Deployment über Firebase Hosting, iOS- und Android-Builds über GitHub Actions – ein Stand, alle drei Plattformen.",
        "Three delivery paths from one pipeline: web deployment via Firebase Hosting, iOS and Android builds through GitHub Actions — one revision, all three platforms.",
      ),
      t(
        "Von der ersten Zeile bis zur Übergabe in rund zwei Monaten.",
        "From the first line of code to handover in around two months.",
      ),
    ],
    tech: techList([
      "TypeScript", "JavaScript", "HTML", "CSS", "JSON", "YAML", "Angular",
      "Ionic", "Capacitor", "RxJS", "Komponentenbibliotheken",
      "Cross-Platform-Entwicklung", "iOS", "Android",
      "Progressive Web App (PWA)", "Mobile First", "Responsive Design",
      "UI-Implementierung", "Nutzerführung", "Onboarding-Flows",
      "Frontend-Entwicklung", "Web-Entwicklung", "Firebase",
      "Firebase Authentication", "Firebase Security Rules", "Cloud Firestore",
      "NoSQL", "Datenmodellierung", "Cloud Storage", "Cloud Functions",
      "Firebase Cloud Messaging (FCM)", "Firebase Hosting", "Authentifizierung",
      "IT-Sicherheit", "Social Media", "Typsicherheit", "Unit Testing",
      "Clean Code", "SOLID", "Separation of Concerns", "Clean Architecture",
      "Domain-Driven Design", "Skalierbare Architektur", "MVP-Entwicklung",
      "Git", "GitHub", "npm", "CLI (Command Line Interface)", "Trello",
      "GitHub Actions", "CI/CD", "Continuous Integration", "Linux", "TCP/IP",
      "IP-Netzwerke", "DNS", "HTTP/HTTPS", "Digitale Transformation",
      "Softwareentwicklung",
    ]),
  },
  {
    num: "04",
    slug: "aitoi",
    name: "AITOI",
    company: "AITOI",
    subtitle: t("Interaktives IoT-Spielzeug (MVP)", "Interactive IoT toy (MVP)"),
    cat: t("IoT / Consumer Electronics", "IoT / consumer electronics"),
    role: t("Frontend Engineer", "Frontend engineer"),
    dateRange: t("08/2025 – 09/2025 · ~2 Monate", "08/2025 – 09/2025 · ~2 months"),
    sort: "2025-08",
    caption: t("PWA WLAN-Onboarding Flow", "PWA Wi-Fi onboarding flow"),
    cover: "/assets/projects/aitoi.jpg",
    cardTags: ["IoT", "PWA"],
    desc: t(
      "PWA-Frontend für ein vernetztes KI-Spielzeug: WLAN-Onboarding per QR-Code-Scan, Gerätekopplung und Echtzeit-Synchronisation.",
      "PWA frontend for a connected AI toy: Wi-Fi onboarding by QR code scan, device pairing and real-time synchronisation.",
    ),
    meta: [
      { label: label.role, value: t("Frontend Engineer", "Frontend engineer") },
      {
        label: label.team,
        value: t(
          "3 Personen · Frontend, Embedded/Hardware, Lead",
          "3 people · frontend, embedded/hardware, lead",
        ),
      },
      { label: label.location, value: t("Frankfurt, DE · Remote", "Frankfurt, DE · remote") },
      { label: label.language, value: t("Deutsch & Englisch", "German & English") },
      { label: label.visibility, value: internalSystem },
      { label: label.method, value: selfDirected },
    ],
    responsibilities: [
      t(
        "Setup-App für die Erst-Einrichtung neuer Geräte: WLAN-Onboarding per QR-Code-Scan mit geführtem Flow, Gerätekopplung und robuster Fehlerbehandlung.",
        "Setup app for commissioning new devices: Wi-Fi onboarding by QR code scan with a guided flow, device pairing and robust error handling.",
      ),
      t(
        "PWA-Dashboard für Eltern: Spielsessions der Kinder nachverfolgen, filtern und auswerten.",
        "PWA dashboard for parents: follow, filter and review their children's play sessions.",
      ),
      t(
        "Nachträgliche Konfiguration gekoppelter Geräte über dieselbe plattformunabhängige PWA.",
        "Later reconfiguration of paired devices through the same platform-independent PWA.",
      ),
      t(
        "Anbindung von Supabase für Authentifizierung, Datenhaltung und Echtzeit-Synchronisation (inkl. Row Level Security).",
        "Integration of Supabase for authentication, data storage and real-time synchronisation (including row level security).",
      ),
      t(
        "Performante PWA-Architektur (Next.js) mit responsivem UI und Unit-Tests (Vitest).",
        "A fast PWA architecture (Next.js) with responsive UI and unit tests (Vitest).",
      ),
      t(
        "Automatisierte Auslieferung über eine CI/CD-Pipeline (GitHub Actions) auf Basis containerisierter Builds (Docker): jeder Stand war ohne manuellen Build-Schritt vorführbar.",
        "Automated delivery through a CI/CD pipeline (GitHub Actions) on top of containerised builds (Docker): every revision was ready to demo without a manual build step.",
      ),
      t(
        "Definition und Umsetzung typsicherer Datenmodelle und API-Schnittstellen (TypeScript, DTOs, Zod).",
        "Definition and implementation of type-safe data models and API interfaces (TypeScript, DTOs, Zod).",
      ),
      t(
        "Enge, englischsprachige Abstimmung mit dem Hardware-Team zur Definition der Geräte-App-Kommunikation und der Setup-Protokolle.",
        "Close coordination in English with the hardware team to define the device-app communication and the setup protocols.",
      ),
      t(
        "Beratung und Navigation des Kunden von der ersten Idee bis zum umsetzbaren MVP-Konzept.",
        "Advising and guiding the client from the initial idea to an actionable MVP concept.",
      ),
    ],
    results: [
      t(
        "Voll funktionsfähiges MVP-Frontend in ~2–3 Wochen reiner Arbeitszeit – eigenständig von Konzept über Kundenabstimmung bis zur Demo.",
        "A fully functional MVP frontend in ~2–3 weeks of actual working time — independently, from concept through client coordination to the demo.",
      ),
      t(
        "Setup-App und Eltern-Dashboard als eine plattformunabhängige PWA, in Echtzeit mit dem IoT-Gerät synchronisiert.",
        "Setup app and parent dashboard as one platform-independent PWA, synchronised with the IoT device in real time.",
      ),
      t(
        "Skalierbare, dokumentierte Architektur als tragfähige Grundlage für den Produktlaunch.",
        "A scalable, documented architecture as a solid basis for the product launch.",
      ),
      t(
        "Vertrauensvolle, funktionsübergreifende Zusammenarbeit mit dem Hardware-Team über die gesamte Projektlaufzeit – trotz kurzer Taktung ohne Reibungsverluste an der Geräte-App-Schnittstelle.",
        "Trusted, cross-functional collaboration with the hardware team throughout the project — no friction at the device-app interface despite the tight schedule.",
      ),
      t(
        "CI/CD-Pipelines und Unit-Tests vom Kunden in der Referenz ausdrücklich als Beitrag zu Qualität, Sicherheit und Zuverlässigkeit hervorgehoben.",
        "The client's testimonial explicitly names the CI/CD pipelines and unit tests as contributing to the quality, security and reliability of the applications.",
      ),
    ],
    tech: techList([
      "TypeScript", "JavaScript", "HTML", "CSS", "SQL", "JSON", "YAML",
      "Next.js", "React", "Server-Side Rendering (SSR)",
      "Progressive Web App (PWA)", "Mobile First", "Responsive Design",
      "Design System", "Komponentenbibliotheken", "UI/UX Design", "Usability",
      "Prototyping", "React Hook Form", "DTOs", "Frontend-Entwicklung",
      "Backend-Entwicklung", "Web-Entwicklung", "Device Pairing", "Supabase",
      "Supabase Realtime", "WebSockets", "Supabase Edge Functions",
      "Row Level Security", "PostgreSQL", "Datenmodellierung", "Tailwind CSS",
      "shadcn/ui", "JWT", "Authentifizierung", "IT-Sicherheit", "Docker",
      "Linux", "Ubuntu", "TCP/IP", "IP-Netzwerke", "DNS", "HTTP/HTTPS",
      "Vercel", "CI/CD", "GitHub Actions", "Continuous Integration", "Vitest",
      "Unit Testing", "npm", "CLI (Command Line Interface)", "Cursor AI",
      "Model Context Protocol (MCP)", "Agentic Coding", "MVP-Entwicklung",
      "Clean Code", "SOLID", "Clean Architecture", "Domain-Driven Design",
      "Digitale Transformation", "Softwareentwicklung",
    ]),
  },
  {
    num: "05",
    slug: "dino",
    name: "DiNo",
    company: "LeXtorByte UG",
    companyUrl: "https://digitales-notariat.de",
    subtitle: t("Digitales Notariat", "Digital notary office"),
    cat: t("LegalTech / Notariat", "LegalTech / notary services"),
    role: t("Frontend Engineer", "Frontend engineer"),
    dateRange: t("01/2025 – 05/2025 · ~5 Monate", "01/2025 – 05/2025 · ~5 months"),
    sort: "2025-01",
    caption: t("Mandantenportal — Vorgangsübersicht", "Client portal — case overview"),
    cover: "/assets/projects/dino.jpg",
    cardTags: ["LegalTech", "Frontend"],
    desc: t(
      "Frontend zur Digitalisierung von Notarprozessen mit Fokus auf klare, nachvollziehbare Nutzerführung – mehrere Portale für Notariat und Mandanten.",
      "Frontend for digitalising notarial processes with a focus on clear, comprehensible user guidance — several portals for the notary office and its clients.",
    ),
    meta: [
      { label: label.role, value: t("Frontend Engineer", "Frontend engineer") },
      { label: label.team, value: t("2–4 Personen", "2–4 people") },
      { label: label.location, value: t("Oranienburg, DE · Remote", "Oranienburg, DE · remote") },
      { label: label.language, value: german },
      { label: label.website, value: "digitales-notariat.de" },
      { label: label.method, value: "Scrumban" },
    ],
    responsibilities: [
      t(
        "Digitale Vorgangsverwaltung über mehrere Portale hinweg: strukturierte Datenerfassung, digitale Verfahrensakten und nahtlose interne Ablage.",
        "Digital case management across several portals: structured data capture, digital case files and seamless internal filing.",
      ),
      t(
        "Statusverfolgung im Mandantenportal (anteilig).",
        "Status tracking in the client portal (partial contribution).",
      ),
      t(
        "Nutzerführung für erklärungsbedürftige Notarprozesse – jeder Schritt nachvollziehbar auch ohne juristische Vorkenntnisse.",
        "User guidance for notarial processes that need explaining — every step comprehensible without legal training.",
      ),
      t(
        "Oberflächen für Notariats- und Mandantenportal mit React und Material UI.",
        "Interfaces for the notary and client portals with React and Material UI.",
      ),
      t(
        "Eigeninitiative in der Codebasis: wiederverwendbare Komponenten eingeführt, bestehenden Code refactored und Altfehler behoben – ausgerichtet auf langfristig tragfähige Lösungen.",
        "Initiative within the codebase: introduced reusable components, refactored existing code and fixed long-standing bugs — aimed at solutions that hold up over time.",
      ),
      t(
        "Einheitliche Formular-Validierung (React Hook Form) zur Beschleunigung der Feature-Entwicklung im gesamten Team.",
        "Unified form validation (React Hook Form) to speed up feature development across the whole team.",
      ),
      t(
        "Enge Abstimmung mit Design und Backend im Scrumban-Rhythmus, um neue Anforderungen zügig in nutzbare Oberflächen zu übersetzen.",
        "Close coordination with design and backend in a Scrumban rhythm, turning new requirements into usable interfaces quickly.",
      ),
    ],
    results: [
      t(
        "Laut Anbieter bis zu 70 % weniger telefonische Rückfragen der Mandanten.",
        "According to the provider, up to 70 % fewer phone queries from clients.",
      ),
      t(
        "Laut Anbieter werden Rechnungen bis zu 30 Tage früher bezahlt.",
        "According to the provider, invoices are paid up to 30 days earlier.",
      ),
      t(
        "Laut Anbieter spürbar reduzierter Verwaltungsaufwand durch durchgängig digitale Prozesse.",
        "According to the provider, noticeably less administrative effort thanks to end-to-end digital processes.",
      ),
      t(
        "Konsistentes, modernes UI über Mandanten- und Notarportal hinweg, das Vertrauen bei Mandanten und Effizienz im Notariat gleichermaßen stärkt.",
        "A consistent, modern UI across the client and notary portals, strengthening client trust and the notary office's efficiency alike.",
      ),
    ],
    tech: techList([
      "TypeScript", "JavaScript", "Python", "SQL", "HTML", "CSS", "JSON",
      "React", "Flask", "REST API", "OpenAPI", "DTOs", "MariaDB", "MySQL",
      "Redux", "React Router", "React Hook Form", "Material UI (MUI)",
      "Komponentenbibliotheken", "Single Page Application (SPA)",
      "UI/UX Design", "Usability", "Nutzerführung", "Frontend-Entwicklung",
      "Backend-Entwicklung", "Web-Entwicklung", "Mandantenportal",
      "Dokumentenmanagement", "Digitale Archivführung", "Prozessdigitalisierung",
      "Digitale Transformation",
      "JWT", "OAuth 2.0", "Role-Based Access Control (RBAC)", "DSGVO", "Docker",
      "Nginx", "Linux", "Ubuntu", "TCP/IP", "IP-Netzwerke", "HTTP/HTTPS",
      "GitLab", "GitLab CI", "npm", "CLI (Command Line Interface)", "Slack",
      "Confluence", "Clean Architecture", "Domain-Driven Design",
      "Code Reviews", "Requirements Engineering", "Agile Methoden",
      "Softwareentwicklung",
    ]),
  },
  {
    num: "06",
    slug: "accounting-os",
    name: "Accounting OS",
    company: "HD Autoservice",
    subtitle: t(
      "GoBD-konformes Buchhaltungs- & Lagersystem",
      "GoBD-compliant accounting & warehouse system",
    ),
    cat: t("Handel & Kfz-Gewerbe", "Retail & automotive trade"),
    role: t("Sole Developer · Full-Stack & AI", "Sole developer · full-stack & AI"),
    dateRange: t(
      "01/2024 – 12/2024 · ~12 Monate · lfd. Wartung (nebenberuflich)",
      "01/2024 – 12/2024 · ~12 months · ongoing maintenance (side project)",
    ),
    sort: "2024-01",
    caption: t(
      "Lagerverwaltung & Rechnungsmodul",
      "Warehouse management & invoicing module",
    ),
    cover: "/assets/projects/accounting-os.jpg",
    cardTags: [t("Warenwirtschaft", "Inventory management"), "Full-Stack"],
    desc: t(
      "GoBD-konformes Buchhaltungs- und Lagersystem mit resilientem Daten-Synchronisationsservice für Lieferanten-Kataloge (bis 20 Mio. CSV-Zeilen).",
      "GoBD-compliant accounting and warehouse system with a resilient data synchronisation service for supplier catalogues (up to 20 m CSV rows).",
    ),
    meta: [
      {
        label: label.role,
        value: t("Sole Developer · Full-Stack & AI", "Sole developer · full-stack & AI"),
      },
      { label: label.team, value: soloClient },
      { label: label.location, value: t("Salzgitter, DE · Remote", "Salzgitter, DE · remote") },
      { label: label.language, value: german },
      { label: label.visibility, value: internalSystem },
      { label: label.method, value: selfDirected },
    ],
    responsibilities: [
      t(
        "Buchhaltungsmodul: Rechnungen, Korrekturrechnungen, PDF-Export, Kundenverwaltung, Bestellimport mit GoBD-Festschreibung.",
        "Accounting module: invoices, corrective invoices, PDF export, customer management, order import with GoBD-compliant record locking.",
      ),
      t(
        "Kopplung von Lagerverwaltung und Rechnungsmanagement (automatische Bestandsabbuchung, Mindestbestand-Benachrichtigung).",
        "Coupling of warehouse management and invoicing (automatic stock deduction, minimum-stock notifications).",
      ),
      t(
        "Resilienter Daten-Synchronisationsservice („Pipe Service“) für Lieferanten-Kataloge – bis 20 Mio. CSV-Zeilen über TLS mit Queue, Caching, Retry-Logik, Validierung und Deduplizierung.",
        "A resilient data synchronisation service (“pipe service”) for supplier catalogues — up to 20 m CSV rows over TLS with a queue, caching, retry logic, validation and deduplication.",
      ),
      t(
        "Rekursive Auflösung von Fremdschlüssel-Abhängigkeiten in den Eingabedialogen für eine konsistente Stammdatenpflege.",
        "Recursive resolution of foreign-key dependencies in the input dialogs, for consistent master data maintenance.",
      ),
      t(
        "Kunden- und Stammdatenverwaltung mit rollenbasierter Zugriffssteuerung (Admin, Mitarbeiter, Steuerberater) und Authentifizierung via better-auth; typsichere GraphQL- und REST-Schnittstellen (NestJS, MikroORM, DTOs).",
        "Customer and master data management with role-based access control (admin, staff, tax adviser) and authentication via better-auth; type-safe GraphQL and REST interfaces (NestJS, MikroORM, DTOs).",
      ),
      t(
        "Technische Beratung des Kunden zu Lösungsansätzen, Architektur und Prozessoptimierung.",
        "Technical advice for the client on approaches, architecture and process optimisation.",
      ),
      t(
        "Selbst gehostete Auslieferung auf Linux-Servern (Docker) mit CI/CD-Pipeline (GitHub Actions) und automatischen Qualitätsprüfungen vor jedem Commit (Husky).",
        "Self-hosted delivery on Linux servers (Docker) with a CI/CD pipeline (GitHub Actions) and automated quality checks before every commit (Husky).",
      ),
      t(
        "Alleinverantwortung für Architektur (Clean Architecture), Deployment und laufende Betreuung (nebenberuflich): Wartung, Security-Updates und Weiterentwicklung.",
        "Sole responsibility for the architecture (clean architecture), deployment and ongoing support (side project): maintenance, security updates and further development.",
      ),
    ],
    results: [
      t(
        "Laut Kunde bis zu 40 Stunden weniger Verwaltungsarbeit pro Monat – rund 480 Stunden im Jahr oder etwa 19.200 € bei kalkulatorisch 40 € Arbeitskosten je Stunde.",
        "According to the client, up to 40 hours less administrative work per month — roughly 480 hours a year, or about € 19,200 at an assumed labour cost of € 40 per hour.",
      ),
      t(
        "Routineprozesse laufen laut Kunde mit bis zu 50 % weniger Zeitaufwand.",
        "According to the client, routine processes take up to 50 % less time.",
      ),
      t(
        "Durchgängig digitale, GoBD-konforme Abläufe mit direkter Kopplung von Lager und Buchhaltung.",
        "End-to-end digital, GoBD-compliant workflows with warehouse and accounting directly coupled.",
      ),
      t(
        "Seit der Einführung im Dauerbetrieb: Auslieferung, Security-Updates und Weiterentwicklung laufen automatisiert weiter, ohne dass der Kunde eine eigene IT dafür vorhalten muss.",
        "In continuous operation since go-live: delivery, security updates and further development keep running automatically, without the client having to maintain an IT function for it.",
      ),
    ],
    tech: techList([
      "TypeScript", "JavaScript", "SQL", "HTML", "CSS", "JSON", "YAML",
      "Node.js", "NestJS", "Fastify", "Dependency Injection", "Next.js",
      "React", "Server-Side Rendering (SSR)", "TanStack Query", "Tailwind CSS",
      "Storybook", "REST API", "GraphQL", "DTOs", "Typsicherheit",
      "Backend-Entwicklung",
      "Frontend-Entwicklung", "Web-Entwicklung", "Daten-Synchronisation",
      "CSV-Verarbeitung", "ETL", "Message Queues", "Caching", "Idempotenz",
      "Resilience Patterns", "MariaDB", "PostgreSQL", "Redis", "MikroORM",
      "TypeORM", "Datenmodellierung", "Warenwirtschaft", "Lagerverwaltung", "Buchhaltung",
      "Rechnungsstellung", "Auftragsverwaltung", "Stammdatenverwaltung",
      "PDF-Generierung", "ERP", "GoBD", "Revisionssicherheit",
      "Prozessdigitalisierung", "Digitale Transformation", "better-auth", "JWT",
      "Role-Based Access Control (RBAC)", "SSL/TLS", "IT-Sicherheit", "Docker",
      "Docker Compose", "Digital Ocean", "Self-Hosting", "Linux", "Ubuntu",
      "TCP/IP", "IP-Netzwerke", "DNS", "HTTP/HTTPS", "Monitoring",
      "Observability", "CI/CD", "Continuous Integration", "GitHub",
      "GitHub Actions", "Husky", "npm", "CLI (Command Line Interface)", "Miro",
      "Unit Testing", "Testautomatisierung", "Claude Code", "Cursor AI",
      "Model Context Protocol (MCP)", "Agentic Coding",
      "Agentische Pull-Request-Workflows", "Monorepo", "Nx", "Microservices",
      "Domain-Driven Design", "Skalierbare Architektur", "Clean Code", "SOLID",
      "Clean Architecture", "Requirements Engineering", "IT-Beratung",
      "Softwareentwicklung", "Produktverantwortung", "Entrepreneurship",
    ]),
  },
  {
    num: "07",
    slug: "lkw-tourverwaltung",
    name: "LadeTrans",
    company: "CDH Stephanus",
    companyUrl: "https://cdh-stephanus.org",
    subtitle: t(
      "LKW-Tourverwaltung für eine humanitäre Hilfsorganisation",
      "Truck route management for a humanitarian aid organisation",
    ),
    cat: t("Logistik & Transport", "Logistics & transport"),
    role: t("Sole Developer · Full-Stack & AI", "Sole developer · full-stack & AI"),
    dateRange: t(
      "02/2021 – 05/2023 · ~2 J. 4 Mon. · lfd. Wartung (nebenberuflich)",
      "02/2021 – 05/2023 · ~2 yrs 4 mos · ongoing maintenance (side project)",
    ),
    sort: "2021-02",
    caption: t(
      "Ladeliste & Tourunterlagen je Vorgang",
      "Loading list & route documents per case",
    ),
    cover: "/assets/projects/lkw-tourverwaltung.jpg",
    cardTags: [t("Logistik", "Logistics"), "Full-Stack"],
    desc: t(
      "LKW-Tourverwaltungssystem für die Hilfstransporte einer humanitären Organisation: Ladelisten, Tourunterlagen und revisionssichere Archivführung je Tour.",
      "Truck route management system for a humanitarian organisation's aid transports: loading lists, route documents and audit-proof archiving for every trip.",
    ),
    meta: [
      {
        label: label.role,
        value: t("Sole Developer · Full-Stack & AI", "Sole developer · full-stack & AI"),
      },
      { label: label.team, value: soloClient },
      { label: label.location, value: t("Bremen, DE · Remote", "Bremen, DE · remote") },
      { label: label.language, value: german },
      { label: label.website, value: "cdh-stephanus.org" },
      { label: label.method, value: selfDirected },
    ],
    responsibilities: [
      t(
        "Ladelisten je Tour: zu versendende Ware, Empfängeradressen und Fahrer in einem Vorgang zusammengestellt.",
        "Loading lists per trip: goods to be shipped, recipient addresses and drivers assembled in a single case.",
      ),
      t(
        "Jede Tour als durchgängiger Vorgang – anlegen, bearbeiten, abschließen und archivieren.",
        "Every trip as one continuous case — create, edit, close and archive.",
      ),
      t(
        "Automatisierte Generierung der Tourunterlagen aus den erfassten Daten, u. a. für Grenzkontrollen.",
        "Automated generation of the route documents from the captured data, among other things for border checks.",
      ),
      t(
        "Revisionssichere Archivierung abgeschlossener Touren inkl. der am Tourende hochgeladenen Nachweise.",
        "Audit-proof archiving of completed trips including the proofs uploaded at the end of each trip.",
      ),
      t(
        "Alleinverantwortung für Backend-Architektur (NestJS, Clean Architecture), rollenbasierte Zugriffssteuerung (better-auth) und das selbst gehostete Deployment inkl. laufender Wartung (nebenberuflich).",
        "Sole responsibility for the backend architecture (NestJS, clean architecture), role-based access control (better-auth) and the self-hosted deployment including ongoing maintenance (side project).",
      ),
      t(
        "Automatisierte Auslieferung der selbst gehosteten Umgebung: CI/CD-Pipeline (GitHub Actions), containerisierter Build (Docker) hinter Nginx als Reverse Proxy, Qualitätsprüfungen vor jedem Commit (Husky).",
        "Automated delivery of the self-hosted environment: CI/CD pipeline (GitHub Actions), containerised build (Docker) behind Nginx as a reverse proxy, quality checks before every commit (Husky).",
      ),
    ],
    results: [
      t(
        "Spart durch automatisierte Dokumentenprozesse laut Kunde bis zu 1.000 Stunden pro Mitarbeiter und Jahr – bei kalkulatorisch 40 € Arbeitskosten je Stunde rund 40.000 € jährlich.",
        "According to the client, automated document processes save up to 1,000 hours per employee per year — about € 40,000 annually at an assumed labour cost of € 40 per hour.",
      ),
      t(
        "Laut Kunde bis zu 30 % höhere Logistikeffizienz durch die durchgängige Verwaltung der Versandtouren.",
        "According to the client, up to 30 % higher logistics efficiency thanks to end-to-end management of the shipping trips.",
      ),
      t(
        "Deutlich reduzierte Übertragungsfehler; jede Tour ist mit Unterlagen und Nachweisen revisionssicher archiviert.",
        "Markedly fewer transcription errors; every trip is archived audit-proof together with its documents and proofs.",
      ),
      t(
        "Seit 2021 durchgehend im Einsatz für die Hilfstransporte – selbst gehostet, mit automatisierter Auslieferung und laufender Wartung aus einer Hand.",
        "In continuous use for the aid transports since 2021 — self-hosted, with automated delivery and ongoing maintenance from one source.",
      ),
    ],
    tech: techList([
      "TypeScript", "JavaScript", "SQL", "HTML", "CSS", "XML", "JSON", "YAML",
      "Node.js", "NestJS", "Fastify", "Dependency Injection", "Next.js",
      "React", "Server-Side Rendering (SSR)", "React Router",
      "Single Page Application (SPA)", "Tailwind CSS", "Storybook", "REST API",
      "GraphQL", "Backend-Entwicklung", "Frontend-Entwicklung",
      "Web-Entwicklung", "PostgreSQL", "Redis", "Caching", "MikroORM",
      "TypeORM", "Datenmodellierung",
      "Logistik", "Tourenplanung", "Auftragsverwaltung", "Dokumentenmanagement",
      "PDF-Generierung", "DOCX-Generierung", "Digitale Archivführung",
      "Prozessdigitalisierung", "Digitale Transformation", "Plattform-Migration",
      "Systemintegration", "better-auth", "JWT", "Authentifizierung",
      "Role-Based Access Control (RBAC)", "IT-Sicherheit", "Docker",
      "Docker Compose", "Digital Ocean", "Self-Hosting", "Linux", "Ubuntu",
      "TCP/IP", "IP-Netzwerke", "DNS", "HTTP/HTTPS", "Nginx", "Monitoring",
      "Observability", "CI/CD", "Continuous Integration", "GitHub Actions",
      "Husky", "npm", "CLI (Command Line Interface)",
      "Unit Testing", "Testautomatisierung", "Claude Code", "Cursor AI",
      "Model Context Protocol (MCP)", "Agentic Coding",
      "Agentische Pull-Request-Workflows", "Monorepo", "Nx", "Slack",
      "Microservices", "Domain-Driven Design", "Skalierbare Architektur",
      "Clean Code", "SOLID", "Clean Architecture",
      "Requirements Engineering",
      "IT-Beratung", "Softwareentwicklung", "Produktverantwortung",
    ]),
  },
  {
    num: "08",
    slug: "xu-navigator",
    name: "XU Navigator",
    company: "XU Group",
    companyUrl: "https://xu.de",
    subtitle: t("Enterprise-Lernplattform", "Enterprise learning platform"),
    cat: t("EdTech / E-Learning", "EdTech / e-learning"),
    role: t("Full-Stack Engineer", "Full-stack engineer"),
    dateRange: t(
      "05/2020 – 02/2023 · ~2 J. 10 Mon.",
      "05/2020 – 02/2023 · ~2 yrs 10 mos",
    ),
    sort: "2020-05",
    caption: t(
      "Kursverwaltung & Zertifikats-Engine",
      "Course management & certificate engine",
    ),
    cover: "/assets/projects/xu-navigator.jpg",
    cardTags: ["EdTech", "Microservices"],
    desc: t(
      "Skalierbare Microservice-Lernplattform für Unternehmensmitarbeitende – im Einsatz bei Konzernen wie Daimler, VW und ThyssenKrupp.",
      "Scalable microservice learning platform for corporate employees — in use at groups such as Daimler, VW and ThyssenKrupp.",
    ),
    meta: [
      { label: label.role, value: t("Full-Stack Engineer", "Full-stack engineer") },
      { label: label.team, value: t("5–10 Personen", "5–10 people") },
      { label: label.location, value: t("Bremen, DE · Remote", "Bremen, DE · remote") },
      { label: label.language, value: t("Deutsch & Englisch", "German & English") },
      { label: label.website, value: "xu.de" },
      { label: label.method, value: "Scrum" },
    ],
    responsibilities: [
      t(
        "Dynamisch, mandantenspezifisch befüllbare Kursinhalte (Videos, Podcasts, Multiple-Choice, Artikel) über klar abgegrenzte Services.",
        "Course content (videos, podcasts, multiple choice, articles) that each tenant fills dynamically, served by clearly bounded services.",
      ),
      t(
        "Lernfortschrittskontrolle inklusive automatischer Zertifikatsgenerierung.",
        "Learning progress tracking including automatic certificate generation.",
      ),
      t(
        "Experten- und Community-Foren für den Austausch zwischen Teilnehmenden und Fachleuten.",
        "Expert and community forums for exchange between participants and specialists.",
      ),
      t(
        "Full-Stack-Entwicklung über alle Plattform-Module hinweg im agilen Scrum-Team – von der Kursverwaltung bis zur Zertifikats-Engine, in Frontend und Backend.",
        "Full-stack development across all platform modules within an agile Scrum team — from course management to the certificate engine, in frontend and backend alike.",
      ),
      t(
        "Skalierbare Backend-Services (NestJS, GraphQL) mit klar abgegrenzten Domänen in Microservice-Architektur.",
        "Scalable backend services (NestJS, GraphQL) with clearly bounded domains in a microservice architecture.",
      ),
      t(
        "Frontend der Lernplattform in Angular (Angular Material, NgRx) sowie Bereitstellung über Azure DevOps Pipelines.",
        "The learning platform's frontend in Angular (Angular Material, NgRx), delivered through Azure DevOps pipelines.",
      ),
    ],
    results: [
      t(
        "Skalierbare Microservice-Plattform im produktiven Einsatz bei namhaften Konzernen (Daimler, VW, ThyssenKrupp u. a.).",
        "A scalable microservice platform running in production at well-known corporations (Daimler, VW, ThyssenKrupp and others).",
      ),
      t(
        "Mandantenspezifische Kursinhalte: jeder Konzern bespielt dieselbe Plattform mit eigenen Schulungen.",
        "Tenant-specific course content: every corporation runs its own training on the same platform.",
      ),
      t(
        "Zertifikate werden ohne manuelle Nacharbeit ausgestellt, der Lernfortschritt ist je Mandant auswertbar.",
        "Certificates are issued without manual rework, and learning progress can be evaluated per tenant.",
      ),
      t(
        "Enge, funktionsübergreifende Zusammenarbeit mit Produkt und Design über zweieinhalb Jahre – vom ersten Ausbau bis zum produktiven Betrieb bei mehreren Großkunden.",
        "Close, cross-functional collaboration with product and design over two and a half years — from the first build-out to production use at several major clients.",
      ),
    ],
    tech: techList([
      "TypeScript", "JavaScript", "HTML", "CSS", "SCSS", "XML", "JSON", "YAML",
      "Angular", "NgRx", "RxJS", "Angular Material", "Komponentenbibliotheken",
      "Figma", "UI-Implementierung", "Node.js", "NestJS", "Express.js", "MEAN",
      "Dependency Injection", "REST API", "GraphQL", "Frontend-Entwicklung",
      "Backend-Entwicklung", "Web-Entwicklung", "MongoDB", "Mongoose", "NoSQL",
      "TypeORM", "Datenmodellierung", "Microsoft Azure", "Azure DevOps",
      "Azure Pipelines", "Azure App Service", "Azure Functions",
      "Azure Blob Storage", "Docker", "TCP/IP", "IP-Netzwerke", "HTTP/HTTPS",
      "CI/CD", "Continuous Integration", "npm",
      "CLI (Command Line Interface)", "Microsoft Teams", "JWT", "OAuth 2.0",
      "Single Sign-On (SSO)", "Microsoft Entra ID (ehem. Azure Active Directory)",
      "Systemintegration", "Learning Management System (LMS)", "Video-Streaming",
      "Multi-Tenancy", "SaaS", "Plattformentwicklung", "Monorepo",
      "Microservices", "Domain-Driven Design", "Skalierbare Architektur",
      "Event-Driven Architecture", "Clean Architecture",
      "Agile Methoden", "Digitale Transformation", "Softwareentwicklung",
    ]),
  },
  {
    num: "09",
    slug: "medizingeraete-ms",
    name: "Medizingeräte-MS",
    company: t("Krankenhauskette (anonymisiert)", "Hospital group (anonymised)"),
    subtitle: t(
      "Managementsystem für Medizingeräte",
      "Management system for medical devices",
    ),
    cat: t("HealthTech / Medizintechnik", "HealthTech / medical technology"),
    role: t("Full-Stack Engineer", "Full-stack engineer"),
    dateRange: t(
      "01/2019 – 05/2020 · ~1 J. 5 Mon.",
      "01/2019 – 05/2020 · ~1 yr 5 mos",
    ),
    sort: "2019-01",
    caption: t(
      "Geräte- & Wartungshistorie-Übersicht",
      "Device & maintenance history overview",
    ),
    cover: "/assets/projects/medizingeraete-ms.jpg",
    cardTags: ["HealthTech", ".NET"],
    desc: t(
      "Mandantenfähige Software zur Verwaltung medizinischer Geräte über mehrere Krankenhäuser – Werkzeug für Techniker zur Wartung und Reparatur.",
      "Multi-tenant software for managing medical devices across several hospitals — a tool for technicians handling maintenance and repairs.",
    ),
    meta: [
      { label: label.role, value: t("Full-Stack Engineer", "Full-stack engineer") },
      { label: label.team, value: t("2–4 Personen", "2–4 people") },
      {
        label: label.location,
        value: t("Deutschland · Vor Ort / Hybrid", "Germany · on site / hybrid"),
      },
      { label: label.language, value: german },
      {
        label: label.visibility,
        value: t("Krankenhauskette (anonymisiert)", "Hospital group (anonymised)"),
      },
      { label: label.method, value: "Scrumban" },
    ],
    responsibilities: [
      t(
        "Geräte- und Stammdatenverwaltung (Krankenhaus, Standort, Gerätespezifikationen).",
        "Device and master data management (hospital, location, device specifications).",
      ),
      t(
        "Detaillierte Wartungshistorie je Gerät (Zeitpunkt und Art der durchgeführten Arbeiten) sowie gerätebezogenes Dokumentenmanagement.",
        "Detailed maintenance history for every device (when work was done and what kind) plus device-related document management.",
      ),
      t(
        "Störungserfassung durch das Pflegepersonal als Einstieg in den Wartungsprozess der Medizintechnik.",
        "Fault reporting by nursing staff as the entry point into the medical engineering maintenance process.",
      ),
      t(
        "Mandantenfähige Filterung nach Krankenhaus (Multi-Tenancy) sowie Anbindung der Microsoft-Anmeldung über O365 Identity.",
        "Multi-tenant filtering by hospital, plus integration of the Microsoft sign-in via O365 Identity.",
      ),
      t(
        "REST-API mit ASP.NET Core (Swagger/OpenAPI); Datenmodellierung mit Entity Framework Core (Code-First) auf MSSQL.",
        "REST API with ASP.NET Core (Swagger/OpenAPI); data modelling with Entity Framework Core (code-first) on MSSQL.",
      ),
    ],
    results: [
      t(
        "Mandantenfähige Geräteverwaltung für mehrere Krankenhäuser – Stammdaten, Wartungshistorie und Dokumentenmanagement je Gerät an einer Stelle.",
        "Multi-tenant device management for several hospitals — master data, maintenance history and document management per device in one place.",
      ),
      t(
        "Störungsmeldungen des Pflegepersonals laufen ohne Umweg in den Wartungsprozess der Medizintechnik.",
        "Fault reports from nursing staff feed straight into the medical engineering maintenance process.",
      ),
      t(
        "Sauber geschichtete .NET-Architektur: Code-First-Datenmodell (Entity Framework Core, MSSQL), dokumentierte REST-API (Swagger/OpenAPI) und Authentifizierung über O365 Identity.",
        "A cleanly layered .NET architecture: code-first data model (Entity Framework Core, MSSQL), documented REST API (Swagger/OpenAPI) and authentication via O365 Identity.",
      ),
      t(
        "Über ein Jahr Mitwirkung in einem kleinen, eng abgestimmten Team an einer sicherheitskritischen Anwendung im Krankenhausumfeld – mit Fokus auf Sorgfalt, Nachvollziehbarkeit und stabile Auslieferung.",
        "More than a year contributing within a small, closely aligned team on a safety-critical application in a hospital setting — with a focus on rigour, traceability and stable delivery.",
      ),
    ],
    tech: techList([
      "C#", "Objektorientierte Programmierung (OOP)", ".NET Core",
      "ASP.NET Core", "ASP.NET Core Web API", "Dependency Injection", "OpenAPI",
      "Swagger", "SQL", "Entity Framework Core", "Datenmodellierung",
      "Microsoft SQL Server (MSSQL)", "TypeScript", "JavaScript", "HTML", "CSS",
      "XML", "JSON", "React", "Redux", "React Router", "Axios", "Fluent UI",
      "Komponentenbibliotheken", "Single Page Application (SPA)",
      "Backend-Entwicklung", "Frontend-Entwicklung", "Web-Entwicklung", "JWT",
      "O365 Identity", "Microsoft Entra ID (ehem. Azure Active Directory)",
      "Role-Based Access Control (RBAC)", "Multi-Tenancy", "Systemintegration",
      "Stammdatenverwaltung", "Dokumentenmanagement",
      "Instandhaltungsmanagement", "Prozessdigitalisierung",
      "Digitale Transformation", "Microsoft Azure",
      "Azure SQL", "Azure DevOps", "Docker", "TCP/IP", "IP-Netzwerke",
      "HTTP/HTTPS", "CI/CD", "Continuous Integration",
      "npm", "CLI (Command Line Interface)", "Visual Studio",
      "Visual Studio Code", "Microsoft Teams", "Clean Architecture",
      "Domain-Driven Design", "Agile Methoden", "Softwareentwicklung",
    ]),
  },
];
