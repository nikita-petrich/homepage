import { t, type I18nText } from "@/lib/i18n/text";

import { techList } from "./terms";

export type SkillCategorySource = {
  num: string;
  name: I18nText | string;
  /** Group heading the category is listed under; "hard" when omitted. */
  kind?: SkillKind;
  /** Whether the items are subject matter for schema.org `knowsAbout`. */
  subjectMatter?: boolean;
  /* How many leading items of `items` are job titles, for the schema.org
     `jobTitle` array (components/notion/json-ld.tsx). Only the roles category
     sets it. The category also carries the context facts — working mode,
     languages, location — and those are emphatically not job titles: without
     this boundary the markup claimed "München" and "Englisch B2" as roles this
     person holds. Titles are therefore kept at the front of the list and
     counted, rather than the whole category being piped into `jobTitle`. */
  jobTitles?: number;
  items: (I18nText | string)[];
};

/* The skills section groups its cards under three headings: what is
   demonstrable in code ("hard"), how the collaboration runs ("soft") and the
   framing facts that are neither ("profile" — roles, languages, location).
   Without that third group the profile card would end up filed under "Hard
   Skills", which is the one place it does not belong. */
export type SkillKind = "hard" | "soft" | "profile";

/* The skill taxonomy doubles as the site's keyword surface: every item is
   rendered as a tag, is searchable in the skills gallery and feeds the
   `knowsAbout` list of the schema.org Person markup (components/notion/json-ld.tsx).
   Items are therefore spelled out the way a client or recruiter would search
   for them ("Role-Based Access Control (RBAC)", not "RBAC") — the substring
   filter matches both the abbreviation and the long form. Every skill belongs
   to exactly one category: a cross-listed tag would surface two near-identical
   cards for one search hit.

   Item translations live in ./terms.ts, shared with the projects' tech lists,
   so a term reads the same wherever it appears. */

export const skills: SkillCategorySource[] = [
  {
    num: "01",
    name: t("KI, LLM & AI Engineering", "AI, LLM & AI engineering"),
    items: techList(["LLM-Integration", "RAG (Retrieval Augmented Generation)", "Prompt Engineering", "Embeddings", "Vektordatenbanken", "pgvector", "Semantische Suche", "Dokumentenanalyse", "OCR", "LangChain", "OpenAI API", "Azure OpenAI", "Anthropic Claude API", "Hugging Face", "Ollama", "KI-Agenten", "Agentic Software Engineering", "KI-gestützte Automatisierung", "AI Engineering", "GenAI", "Künstliche Intelligenz", "DSGVO-konforme KI-Architektur"]),
  },
  {
    num: "02",
    name: t("Agentic Coding", "Agentic coding"),
    items: techList(["Claude Code", "Cursor AI", "GitHub Copilot", "Code Rabbit", "ChatGPT", "Lovable", "v0", "Claude Code Hooks", "Slash Commands", "Agent Skills", "Subagenten", "Multi-Agent-Workflows", "Model Context Protocol (MCP)", "Agentic Coding", "Context Engineering", "Spec-Driven Development", "Agentische Pull-Request-Workflows", "KI-gestützte Testgenerierung"]),
  },
  {
    num: "03",
    name: t("Programmiersprachen", "Programming languages"),
    items: techList(["TypeScript", "JavaScript", "Python", "C#", "SQL", "Bash", "HTML", "CSS", "SCSS", "XML", "JSON", "YAML", "UML"]),
  },
  {
    num: "04",
    name: t("Backend & Frameworks", "Backend & frameworks"),
    items: techList(["Node.js", "NestJS", "Express.js", "Fastify", "FastAPI", "Flask", "ASP.NET Core", "ASP.NET Core Web API", ".NET Core", "MERN", "MEAN", "Headless CMS", "Strapi", "Directus", "GraphQL", "REST API", "OpenAPI", "Swagger", "gRPC", "WebSockets", "Webhooks", "Message Queues", "BullMQ", "RabbitMQ", "Backend-Entwicklung", "Objektorientierte Programmierung (OOP)"]),
  },
  {
    num: "05",
    name: "Frontend",
    items: techList(["React", "Next.js", "Angular", "React Native", "Ionic", "Capacitor", "Cross-Platform-Entwicklung", "iOS", "Android", "Redux", "NgRx", "RxJS", "TanStack Query", "React Hook Form", "React Router", "Axios", "Zod", "Tailwind CSS", "shadcn/ui", "Material UI (MUI)", "Angular Material", "Fluent UI", "Single Page Application (SPA)", "Progressive Web App (PWA)", "Server-Side Rendering (SSR)", "Internationalisierung (i18n)", "Frontend-Entwicklung", "Web-Entwicklung"]),
  },
  {
    num: "06",
    name: t("Design & UX", "Design & UX"),
    items: techList(["Figma", "Wireframing", "Prototyping", "Design System", "Design Tokens", "Komponentenbibliotheken", "Storybook", "UI/UX Design", "UI-Implementierung", "Responsive Design", "Mobile First", "Barrierefreiheit (WCAG)", "Usability", "Nutzerführung", "Onboarding-Flows", "Informationsarchitektur", "UX Writing"]),
  },
  {
    num: "07",
    name: t("Datenbanken & Daten", "Databases & data"),
    items: techList(["PostgreSQL", "MySQL", "MariaDB", "Microsoft SQL Server (MSSQL)", "MongoDB", "Mongoose", "NoSQL", "Cloud Firestore", "SQLite", "Redis", "Prisma", "MikroORM", "TypeORM", "Drizzle ORM", "Entity Framework Core", "Datenmodellierung", "Datenarchitektur", "DTOs", "Daten-Synchronisation", "ETL", "CSV-Verarbeitung", "Caching", "Idempotenz"]),
  },
  {
    num: "08",
    name: t("DevOps, Cloud & Infrastruktur", "DevOps, cloud & infrastructure"),
    items: techList(["Docker", "Docker Compose", "CI/CD", "GitHub Actions", "GitLab CI", "Azure Pipelines", "Jenkins", "Nginx", "Sentry", "Datadog", "Monitoring", "Observability", "Linux", "Ubuntu", "Self-Hosting", "Microsoft Azure", "Azure Functions", "Azure App Service", "Azure Blob Storage", "Azure SQL", "Google Cloud Platform (GCP)", "Amazon Web Services (AWS)", "Hetzner", "IONOS", "Digital Ocean", "Vercel", "Supabase", "Supabase Realtime", "Supabase Edge Functions", "Firebase", "Cloud Functions", "Cloud Storage", "Firebase Cloud Messaging (FCM)", "Firebase Hosting", "DevOps", "DevSecOps"]),
  },
  /* Network fundamentals sit apart from DevOps (08): 08 is about running
     services, 09 about the layer underneath them — addressing, name
     resolution and the wire protocols. Application-level protocols that come
     with a framework stay with it (REST, gRPC, WebSockets in 04). */
  {
    num: "09",
    name: t("Netzwerke & Protokolle", "Networking & protocols"),
    /* "MAC-Adressen" used to sit here. It is genuine IHK training content and
       genuinely useless on a senior profile: a reader who meets it re-reads the
       whole taxonomy as padding, which costs more than the term earns. */
    items: techList(["TCP/IP", "IP-Netzwerke", "DNS", "HTTP/HTTPS"]),
  },
  {
    num: "10",
    name: t("Auth & Security", "Auth & security"),
    items: techList(["JWT", "OAuth 2.0", "Single Sign-On (SSO)", "better-auth", "Firebase Authentication", "Firebase Security Rules", "Authentifizierung", "Role-Based Access Control (RBAC)", "Row Level Security", "SSL/TLS", "Ende-zu-Ende-Verschlüsselung", "O365 Identity", "Microsoft Entra ID (ehem. Azure Active Directory)", "Secure by Design", "IT-Sicherheit"]),
  },
  {
    num: "11",
    name: t("Architektur & Prinzipien", "Architecture & principles"),
    items: techList(["Software-Architektur", "Clean Architecture", "SOLID", "Design Patterns", "Domain-Driven Design", "Separation of Concerns", "Dependency Injection", "Microservices", "Event-Driven Architecture", "Monorepo", "Nx", "Turborepo", "Skalierbare Architektur", "Systemintegration", "Schnittstellenentwicklung", "API-Integration", "Drittsystem-Anbindung", "Plattform-Migration", "Middleware", "API-First", "Resilience Patterns", "Typsicherheit", "MVP-Entwicklung"]),
  },
  /* Methodology is split in two on purpose: the process models a team agrees
     on (12) and the engineering practices that run inside them (13). Lumping
     both together with job descriptions ("IT-Beratung") and working modes
     ("Remote Work") is what makes the usual consultant profile unreadable —
     those live in 14 and 22 instead. Tools stay out of both — the pipelines
     that run CI are under DevOps (08), the test runners under Testing & QA
     (16) — so a practice is never listed twice as its own tooling.

     That is also why 13 spells out "Continuous Integration" and "Continuous
     Delivery" while the abbreviation "CI/CD" sits in 08: written out, the
     terms name the discipline (integrate daily, stay releasable); abbreviated,
     everyone reads "the pipeline", which is tooling. The short form still has
     to exist somewhere or the skills search would stop finding it. */
  {
    num: "12",
    name: t("Vorgehen & Methodik", "Ways of working & methodology"),
    /* The Scrum ceremonies are spelled out rather than left implied in "Scrum":
       German enterprise ATS filters match the ceremony names, and four projects
       ran Scrum or Scrumban. "Anforderungsanalyse" is the German term a client
       writes in a spec where this list says "Requirements Engineering". */
    items: techList(["Agile Methoden", "Scrum", "Kanban", "Scrumban", "Requirements Engineering", "Anforderungsanalyse", "Sprint Planning", "Backlog Refinement", "Retrospektive", "Daily Stand-up"]),
  },
  {
    num: "13",
    name: t("Engineering-Praktiken", "Engineering practices"),
    items: techList(["Clean Code", "Code Reviews", "Refactoring", "Legacy-Modernisierung", "Continuous Integration", "Continuous Delivery"]),
  },
  {
    num: "14",
    name: t("Beratung & Business", "Consulting & business"),
    /* "Public Speaking" used to sit here; it is a presentation skill, so it
       moved to the soft-skill category 19 rather than being listed twice. */
    items: techList(["IT-Beratung", "Softwareentwicklung", "Projektmanagement", "IT-Strategie", "Digitalstrategie", "Digitale Transformation", "Prozessdigitalisierung", "Produktverantwortung", "Entrepreneurship"]),
  },
  {
    num: "15",
    name: t("Datenschutz & Compliance", "Data protection & compliance"),
    items: techList(["DSGVO", "Privacy by Design", "Datenminimierung", "Auftragsverarbeitungsvertrag (AVV)", "EU AI Act", "AI Governance", "GoBD", "Revisionssicherheit", "EU-Hosting", "Digitale Souveränität", "Barrierefreiheitsstärkungsgesetz (BFSG)", "European Accessibility Act (EAA)"]),
  },
  {
    num: "16",
    name: t("Testing & QA", "Testing & QA"),
    items: techList(["Jest", "Vitest", "Cypress", "Playwright", "React Testing Library", "Unit Testing", "Integrationstests", "End-to-End-Tests", "Postman", "API-Testing", "Testautomatisierung"]),
  },
  {
    num: "17",
    name: "Tooling",
    /* Office commodities are gone: "Windows CMD", "Gmail", "Microsoft Outlook".
       Nobody staffs on them, no ATS filters for them, and listing them next to
       "Model Context Protocol" invites the reader to discount both. Google
       Calendar and Google Workspace stay — they were integrated against as APIs
       at Manifest OS, which is a different claim from using them. */
    items: techList(["Git", "GitHub", "GitLab", "Husky", "npm", "pnpm", "CLI (Command Line Interface)", "Visual Studio Code", "Visual Studio", "Jira", "Confluence", "Linear", "Trello", "Azure DevOps", "Miro", "Slack", "Microsoft Teams", "Google Calendar", "Google Workspace (Meet, APIs)", "Bluedot", "HubSpot", "Cal.com", "n8n", "Amplitude", "Product Analytics"]),
  },
  {
    num: "18",
    name: t("Domänen & Branchen", "Domains & industries"),
    items: techList(["LegalTech", "GovTech", "Kanzleisoftware", "Notariat", "Mandantenportal", "Dokumentenmanagement", "HealthTech", "Medizintechnik", "Instandhaltungsmanagement", "ERP", "Warenwirtschaft", "Lagerverwaltung", "Rechnungsstellung", "Auftragsverwaltung", "CRM", "Buchhaltung", "Stammdatenverwaltung", "Multi-Tenancy", "Stripe", "SEPA", "Zahlungsabwicklung", "Logistik", "Tourenplanung", "PDF-Generierung", "DOCX-Generierung", "Digitale Archivführung", "EdTech", "E-Learning", "Learning Management System (LMS)", "Video-Streaming", "Social Media", "IoT", "Device Pairing", "Consumer Electronics", "SaaS", "Plattformentwicklung"]),
  },
  /* Soft skills (19–21). Same card format as the hard skills on purpose: a
     claim like "zuverlässig" is worth as little as the proof behind it, so the
     items stay next to the technical taxonomy instead of becoming a separate
     adjective list. They are split the way they are asked about — how someone
     communicates, how they work in an existing team, and what can be relied on.
     Wording overlaps deliberately with the "Arbeitsweise" tags in the sidebar
     (lib/content/profile.ts) — same claims, both surfaces.

     All three are `subjectMatter: false`. They are worth showing a human, who
     can weigh them against the testimonials that say the same thing with
     evidence attached; they are not worth feeding to a parser. schema.org
     `knowsAbout` means "subject matter this person knows about", and 22
     adjectives — "Zuverlässigkeit", "Lernbereitschaft", "Teamfähigkeit" —
     entering that list as claimed areas of expertise dilutes the ~300 genuine
     technical topics next to them without matching a single search anyone
     runs. */
  {
    num: "19",
    name: t("Kommunikation & Präsentation", "Communication & presentation"),
    kind: "soft",
    subjectMatter: false,
    items: techList(["Professionelle Kommunikation", "Klare Kommunikation (Deutsch/Englisch)", "Proaktive Kommunikation", "Präsentationsfähigkeit", "Public Speaking", "Stakeholder-Kommunikation", "Konstruktives Feedback", "Technische Dokumentation"]),
  },
  {
    num: "20",
    name: t("Teamarbeit & Zusammenarbeit", "Teamwork & collaboration"),
    kind: "soft",
    subjectMatter: false,
    items: techList(["Teamfähigkeit", "Integration in bestehende Teams", "Kollegiale Zusammenarbeit", "Wissenstransfer", "Remote-Zusammenarbeit", "Asynchrone Zusammenarbeit", "Interdisziplinäre Zusammenarbeit"]),
  },
  {
    num: "21",
    name: t("Verlässlichkeit & Arbeitshaltung", "Reliability & work ethic"),
    kind: "soft",
    subjectMatter: false,
    items: techList(["Zuverlässigkeit", "Verantwortungsbewusstsein", "Eigenverantwortliches Arbeiten", "Schnelle Reaktionszeiten", "Ergebnisorientierung", "Lösungsorientierung", "Lernbereitschaft"]),
  },
  /* Roles. This category is the site's job-title surface, and a German ATS or a
     freelancermap boolean search matches on the person-noun ("Softwareentwickler"),
     not on the activity noun ("Softwareentwicklung", which lives in 14). Both
     spellings therefore have to exist, in both languages.

     "Interim CTO" used to sit here and is gone: the only CTO title on the site
     is the one he awarded himself on his own product, and an unbacked role tag
     is the first thing a recruiter strikes from a profile. */
  {
    num: "22",
    name: t("Rollen & Profil", "Roles & profile"),
    kind: "profile",
    /* Left out of the schema.org `knowsAbout` list: roles, languages, working
       mode and location are not subject matter a person "knows about"
       (jobTitle and address already carry those). */
    subjectMatter: false,
    /* The first 13 items are titles; everything after "Fachinformatiker
       Anwendungsentwicklung" is context. Keep new titles above that line and
       new context facts below it. */
    jobTitles: 13,
    items: techList(["Senior Full-Stack Engineer", "AI Engineer", "Software Engineer", "Softwareentwickler", "Fullstack-Entwickler", "Frontend-Entwickler", "Backend-Entwickler", "Webentwickler", "Softwarearchitekt", "Freelance Developer", "Freiberuflicher Softwareentwickler", "Technischer Berater", "Fachinformatiker Anwendungsentwicklung", "Remote Work", "Deutsch (Muttersprache)", "Englisch B2", "Business English", "München", "DACH"]),
  },
];
