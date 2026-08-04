import { t, type I18nText } from "@/lib/i18n/text";

/* Technology and skill terms.
 *
 * The same term appears in several places — a project's tech list, the skills
 * database, the focus tags, the schema.org `knowsAbout` list — so the
 * translations live in one table instead of next to every occurrence. Anything
 * not listed here is a proper noun (TypeScript, PostgreSQL, Figma …) and is
 * returned unchanged, which is also how a missing entry behaves: the German
 * term shows in both languages rather than disappearing. */
const translations: Record<string, string> = {
  // AI / LLM
  "LLM-Integration": "LLM integration",
  "RAG (Retrieval Augmented Generation)": "RAG (retrieval augmented generation)",
  Vektordatenbanken: "Vector databases",
  "Semantische Suche": "Semantic search",
  Dokumentenanalyse: "Document analysis",
  "KI-Agenten": "AI agents",
  "KI-gestützte Automatisierung": "AI-assisted automation",
  "Künstliche Intelligenz": "Artificial intelligence",
  "DSGVO-konforme KI-Architektur": "GDPR-compliant AI architecture",
  Subagenten: "Subagents",
  "Multi-Agent-Workflows": "Multi-agent workflows",
  "Agentische Pull-Request-Workflows": "Agentic pull request workflows",
  "KI-gestützte Testgenerierung": "AI-assisted test generation",

  // Engineering
  "Backend-Entwicklung": "Backend development",
  "Frontend-Entwicklung": "Frontend development",
  "Web-Entwicklung": "Web development",
  "Objektorientierte Programmierung (OOP)": "Object-oriented programming (OOP)",
  "Cross-Platform-Entwicklung": "Cross-platform development",
  "Internationalisierung (i18n)": "Internationalisation (i18n)",
  Komponentenbibliotheken: "Component libraries",
  "Barrierefreiheit (WCAG)": "Accessibility (WCAG)",
  Nutzerführung: "User guidance",
  "UI-Implementierung": "UI implementation",
  "Onboarding-Flows": "Onboarding flows",
  Informationsarchitektur: "Information architecture",
  Datenmodellierung: "Data modelling",
  Datenarchitektur: "Data architecture",
  "Daten-Synchronisation": "Data synchronisation",
  "CSV-Verarbeitung": "CSV processing",
  Idempotenz: "Idempotency",
  Authentifizierung: "Authentication",
  "Ende-zu-Ende-Verschlüsselung": "End-to-end encryption",
  "Microsoft Entra ID (ehem. Azure Active Directory)":
    "Microsoft Entra ID (formerly Azure Active Directory)",
  "IT-Sicherheit": "IT security",
  "Software-Architektur": "Software architecture",
  "Skalierbare Architektur": "Scalable architecture",
  Systemintegration: "System integration",
  "Plattform-Migration": "Platform migration",
  Typsicherheit: "Type safety",
  "MVP-Entwicklung": "MVP development",
  "Video-Streaming": "Video streaming",

  // Networking
  "IP-Netzwerke": "IP networks",
  "MAC-Adressen": "MAC addresses",
  "Windows CMD (Kommandozeile)": "Windows CMD (command line)",

  // Ways of working
  "Agile Methoden": "Agile methods",
  "Code Reviews": "Code reviews",
  Softwareentwicklung: "Software development",
  Projektmanagement: "Project management",
  "IT-Beratung": "IT consulting",
  "IT-Strategie": "IT strategy",
  Digitalstrategie: "Digital strategy",
  "Digitale Transformation": "Digital transformation",
  Prozessdigitalisierung: "Process digitalisation",
  Produktverantwortung: "Product ownership",

  // Compliance
  DSGVO: "GDPR",
  Datenminimierung: "Data minimisation",
  "Auftragsverarbeitungsvertrag (AVV)": "Data processing agreement (DPA)",
  Revisionssicherheit: "Audit-proof records",
  "EU-Hosting": "EU hosting",
  "Digitale Souveränität": "Digital sovereignty",
  "Barrierefreiheitsstärkungsgesetz (BFSG)":
    "German Accessibility Reinforcement Act (BFSG)",

  // Testing
  Integrationstests: "Integration tests",
  "End-to-End-Tests": "End-to-end tests",
  Testautomatisierung: "Test automation",
  "API-Testing": "API testing",

  // Domains
  Kanzleisoftware: "Law firm software",
  Notariat: "Notary services",
  Mandantenportal: "Client portal",
  Dokumentenmanagement: "Document management",
  Medizintechnik: "Medical technology",
  Instandhaltungsmanagement: "Maintenance management",
  Warenwirtschaft: "Inventory management",
  Lagerverwaltung: "Warehouse management",
  Rechnungsstellung: "Invoicing",
  Auftragsverwaltung: "Order management",
  Buchhaltung: "Accounting",
  Stammdatenverwaltung: "Master data management",
  Zahlungsabwicklung: "Payment processing",
  Logistik: "Logistics",
  Tourenplanung: "Route planning",
  "PDF-Generierung": "PDF generation",
  "DOCX-Generierung": "DOCX generation",
  "Digitale Archivführung": "Digital archiving",
  Plattformentwicklung: "Platform development",

  // Roles & profile
  "Technischer Berater": "Technical advisor",
  "Fachinformatiker Anwendungsentwicklung":
    "IT specialist for application development",
  "Deutsch (Muttersprache)": "German (native)",
  "Englisch B2": "English B2",
  München: "Munich",
};

/* A technology/skill term, translated when it is not a proper noun. */
export function tech(name: string): I18nText | string {
  const english = translations[name];
  return english ? t(name, english) : name;
}

export function techList(names: string[]): (I18nText | string)[] {
  return names.map(tech);
}
