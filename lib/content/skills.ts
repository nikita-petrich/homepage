import { t, type I18nText } from "@/lib/i18n/text";

import { techList } from "./terms";

export type SkillCategorySource = {
  num: string;
  name: I18nText | string;
  /** Whether the items are subject matter for schema.org `knowsAbout`. */
  subjectMatter?: boolean;
  items: (I18nText | string)[];
};

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
    items: techList(["Node.js", "NestJS", "Express.js", "Fastify", "FastAPI", "Flask", "ASP.NET Core", ".NET Core", "MERN", "MEAN", "Headless CMS", "Strapi", "Directus", "GraphQL", "REST API", "OpenAPI", "Swagger", "gRPC", "WebSockets", "Webhooks", "Message Queues", "BullMQ", "RabbitMQ", "Backend-Entwicklung", "Objektorientierte Programmierung (OOP)"]),
  },
  {
    num: "05",
    name: "Frontend",
    items: techList(["React", "Next.js", "Angular", "React Native", "Ionic", "Capacitor", "Cross-Platform-Entwicklung", "iOS", "Android", "Redux", "NgRx", "RxJS", "TanStack Query", "React Hook Form", "React Router", "Axios", "Zod", "Tailwind CSS", "shadcn/ui", "Material UI (MUI)", "Fluent UI", "Single Page Application (SPA)", "Progressive Web App (PWA)", "Server-Side Rendering (SSR)", "Internationalisierung (i18n)", "Frontend-Entwicklung", "Web-Entwicklung"]),
  },
  {
    num: "06",
    name: t("Design & UX", "Design & UX"),
    items: techList(["Figma", "Wireframing", "Prototyping", "Design System", "Design Tokens", "Komponentenbibliotheken", "Storybook", "UI/UX Design", "UI-Implementierung", "Responsive Design", "Mobile First", "Barrierefreiheit (WCAG)", "Usability", "Nutzerführung", "Onboarding-Flows", "Informationsarchitektur", "UX Writing", "Microcopy", "Design Reviews"]),
  },
  {
    num: "07",
    name: t("Datenbanken & Daten", "Databases & data"),
    items: techList(["PostgreSQL", "MySQL", "MariaDB", "Microsoft SQL Server (MSSQL)", "MongoDB", "Mongoose", "NoSQL", "Cloud Firestore", "SQLite", "Redis", "Prisma", "MikroORM", "TypeORM", "Drizzle ORM", "Entity Framework Core", "Datenmodellierung", "Datenarchitektur", "DTOs", "Daten-Synchronisation", "ETL", "CSV-Verarbeitung", "Caching", "Idempotenz"]),
  },
  {
    num: "08",
    name: t("DevOps, Cloud & Infrastruktur", "DevOps, cloud & infrastructure"),
    items: techList(["Docker", "Docker Compose", "GitHub Actions", "GitLab CI", "Azure Pipelines", "Jenkins", "Nginx", "Sentry", "Monitoring", "Observability", "Linux", "Ubuntu", "Self-Hosting", "Microsoft Azure", "Azure Functions", "Azure App Service", "Azure Blob Storage", "Azure SQL", "Google Cloud Platform (GCP)", "Amazon Web Services (AWS)", "Hetzner", "IONOS", "Digital Ocean", "Vercel", "Supabase", "Firebase", "Cloud Functions", "Cloud Storage", "Firebase Cloud Messaging (FCM)", "Firebase Hosting", "DevOps", "DevSecOps"]),
  },
  /* Network fundamentals sit apart from DevOps (08): 08 is about running
     services, 09 about the layer underneath them — addressing, name
     resolution and the wire protocols. Application-level protocols that come
     with a framework stay with it (REST, gRPC, WebSockets in 04). */
  {
    num: "09",
    name: t("Netzwerke & Protokolle", "Networking & protocols"),
    items: techList(["TCP/IP", "IP-Netzwerke", "DNS", "NAT", "MAC-Adressen", "HTTP/HTTPS"]),
  },
  {
    num: "10",
    name: t("Auth & Security", "Auth & security"),
    items: techList(["JWT", "OAuth 2.0", "Single Sign-On (SSO)", "better-auth", "Firebase Authentication", "Firebase Security Rules", "Authentifizierung", "Role-Based Access Control (RBAC)", "Row Level Security", "SSL/TLS", "Ende-zu-Ende-Verschlüsselung", "O365 Identity", "Microsoft Entra ID (ehem. Azure Active Directory)", "Secure by Design", "IT-Sicherheit"]),
  },
  {
    num: "11",
    name: t("Architektur & Prinzipien", "Architecture & principles"),
    items: techList(["Software-Architektur", "Clean Architecture", "SOLID", "Design Patterns", "Domain-Driven Design", "Separation of Concerns", "Dependency Injection", "Microservices", "Event-Driven Architecture", "Monorepo", "Nx", "Turborepo", "Skalierbare Architektur", "Systemintegration", "Plattform-Migration", "Middleware", "API-First", "Resilience Patterns", "Typsicherheit", "MVP-Entwicklung"]),
  },
  /* Methodology is split in two on purpose: the process models a team agrees
     on (12) and the engineering practices that run inside them (13). Lumping
     both together with job descriptions ("IT-Beratung") and working modes
     ("Remote Work") is what makes the usual consultant profile unreadable —
     those live in 14 and 19 instead. Tools stay out of both — the pipelines
     that run CI are under DevOps (08), the test runners under Testing & QA
     (16) — so a practice is never listed twice as its own tooling. */
  {
    num: "12",
    name: t("Vorgehen & Methodik", "Ways of working & methodology"),
    items: techList(["Agile Methoden", "Scrum", "Kanban", "Scrumban", "SAFe (Scaled Agile Framework)", "Requirements Engineering"]),
  },
  {
    num: "13",
    name: t("Engineering-Praktiken", "Engineering practices"),
    items: techList(["Clean Code", "Code Reviews", "Test-Driven Development (TDD)", "Continuous Integration", "CI/CD"]),
  },
  {
    num: "14",
    name: t("Beratung & Business", "Consulting & business"),
    items: techList(["IT-Beratung", "Softwareentwicklung", "Projektmanagement", "IT-Strategie", "Digitalstrategie", "Digitale Transformation", "Prozessdigitalisierung", "Produktverantwortung", "Entrepreneurship", "Public Speaking"]),
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
    items: techList(["Git", "GitHub", "GitLab", "Husky", "npm", "pnpm", "CLI (Command Line Interface)", "Windows CMD (Kommandozeile)", "Visual Studio Code", "Visual Studio", "Jira", "Confluence", "Linear", "Azure DevOps", "Miro", "Slack", "Microsoft Teams", "Microsoft Outlook", "Gmail", "Google Calendar", "Google Workspace (Meet, APIs)", "Bluedot", "HubSpot", "Cal.com", "n8n", "Amplitude", "Product Analytics"]),
  },
  {
    num: "18",
    name: t("Domänen & Branchen", "Domains & industries"),
    items: techList(["LegalTech", "GovTech", "Kanzleisoftware", "Notariat", "Mandantenportal", "Dokumentenmanagement", "HealthTech", "Medizintechnik", "Instandhaltungsmanagement", "ERP", "Warenwirtschaft", "Lagerverwaltung", "Rechnungsstellung", "Auftragsverwaltung", "CRM", "Buchhaltung", "Stammdatenverwaltung", "Multi-Tenancy", "Stripe", "SEPA", "Zahlungsabwicklung", "Logistik", "Tourenplanung", "PDF-Generierung", "Digitale Archivführung", "EdTech", "E-Learning", "Learning Management System (LMS)", "Social Media", "IoT", "Device Pairing", "Consumer Electronics", "SaaS", "Plattformentwicklung"]),
  },
  {
    num: "19",
    name: t("Rollen & Profil", "Roles & profile"),
    /* Left out of the schema.org `knowsAbout` list: roles, languages, working
       mode and location are not subject matter a person "knows about"
       (jobTitle and address already carry those). */
    subjectMatter: false,
    items: techList(["Senior Full-Stack Engineer", "AI Engineer", "Software Engineer", "Freelance Developer", "Interim CTO", "Technischer Berater", "Fachinformatiker Anwendungsentwicklung", "Remote Work", "Deutsch (Muttersprache)", "Englisch B2", "München", "DACH"]),
  },
];
