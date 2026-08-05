import { t, type I18nText } from "@/lib/i18n/text";
import type { Locale } from "@/lib/i18n/config";

import referencesData from "../references.json";
import { projects } from "./projects";

/* Testimonials. The wording lives in lib/references.json, which the PDF CV
 * shares — that file stays the single source of the quotes and is not touched
 * here.
 *
 * Every recommendation was written in one language: four in German, five in
 * English. Both language versions of the site show every testimonial, so the
 * counterpart is a translation, and each entry records which side is the
 * original — the UI says so, and the source link (LinkedIn / Malt) always
 * leads to the words as they were actually written. */

export type ReferenceSource = "LinkedIn" | "Malt";

/* Where a testimonial can be verified — rendered as a linked tag on each card.
   Both point at Nikita's own public profiles (his received recommendations). */
export const referenceSources: Record<
  ReferenceSource,
  { label: string; href: string }
> = referencesData.sources as Record<
  ReferenceSource,
  { label: string; href: string }
>;

/* "Projektteam" covers everyone Nikita built the product with, whichever of
   the small teams they led or sat in — Manifest OS was one squad split across
   four domain teams, and he implemented in the neighbouring ones regularly. */
const relation = {
  team: t("Projektteam", "Project team"),
  client: t("Kunde", "Client"),
};

/* Project labels shown on a testimonial — the project name plus its subtitle,
   matching the wording of ./projects.ts. */
const projectLabel = {
  "manifest-os": t(
    "Manifest OS — KI-gestützte Einwanderungsplattform",
    "Manifest OS — AI-assisted immigration platform",
  ),
  aitoi: t(
    "AITOI — KI-Spielzeug (Setup-App & PWA-Dashboard)",
    "AITOI — AI toy (setup app & PWA dashboard)",
  ),
  dino: t("DiNo — Digitales Notariat", "DiNo — digital notary office"),
  "accounting-os": t(
    "Accounting OS — ERP- & Warenwirtschaftssystem",
    "Accounting OS — ERP & inventory management system",
  ),
  "xu-navigator": t(
    "XU Navigator — Enterprise-Lernplattform",
    "XU Navigator — enterprise learning platform",
  ),
};

type Translation = {
  /** Language the recommendation was originally written in. */
  original: Locale;
  role: I18nText | string;
  relation: I18nText;
  project: I18nText;
  quote: I18nText;
  short: I18nText;
};

/* Keyed by slug. The side matching `original` repeats the JSON verbatim; the
   other side is the translation. */
const translations: Record<string, Translation> = {
  "aslan-aiaev": {
    original: "en",
    role: "Senior Software Engineer",
    relation: relation.team,
    project: projectLabel["manifest-os"],
    quote: t(
      "Nikita und ich haben bei Manifest OS gemeinsam das Onboarding durchlaufen und danach längere Zeit eng im selben Team gearbeitet. Er war dort als Senior Fullstack Engineer unter anderem an der Zusammenführung der getrennten Portale in das einheitliche Portal beteiligt — ein Umbau, bei dem Datenmodell und UI zusammengeführt werden mussten und der entsprechend viel Sorgfalt und Kontext verlangt hat.\n\nWas mir aus der Zusammenarbeit am stärksten geblieben ist: Nikita arbeitet außerordentlich eigenständig. Er hat sich in eine komplexe, gewachsene Codebasis eingefunden, ohne dass ihn jemand durchführen musste, und war jederzeit ansprechbar, wenn ich Fragen hatte. Sein Code war sauber, typsicher und getestet — er hat SOLID- und Clean-Code-Prinzipien konsequent angewendet und wiederverwendbare Komponenten und Utilities gebaut, von denen das ganze Team profitiert hat. Das hat Reviews mit ihm produktiv statt mühsam gemacht.\n\nErwähnenswert außerdem: Er hat nicht nur an seinen eigenen Tickets gearbeitet. Er hat wiederholt bestehende Fehler im System aufgespürt, die vorher niemandem aufgefallen waren, und sie direkt behoben. Eine echte Bereicherung für das Team, fachlich wie menschlich. Ich würde jederzeit wieder mit ihm arbeiten und empfehle ihn ohne Einschränkung.",
      "Nikita and I went through onboarding together at Manifest OS and then worked closely in the same team for a considerable time. He was a Senior Fullstack Engineer there, involved among other things in consolidating the separate portals into the unified one — a rebuild that required merging data model and UI, and correspondingly a lot of care and context.\n\nWhat stayed with me most about working with him: Nikita is extremely self-reliant. He found his way into a complex, grown codebase without anyone having to guide him through it, and was always approachable whenever I had questions. His code was clean, type-safe and tested — he consistently applied SOLID and clean code principles and built reusable components and utilities that the whole team benefited from. That made reviews with him productive rather than tedious.\n\nWorth mentioning as well: he didn’t just work on his own tickets. He repeatedly tracked down existing bugs in the system that nobody had noticed before and fixed them directly. A real asset to the team, both technically and personally. I’d work with him again any time and recommend him without reservation.",
    ),
    short: t(
      "Nikita arbeitet außerordentlich eigenständig. Er hat sich in eine komplexe, gewachsene Codebasis eingefunden, ohne dass ihn jemand durchführen musste … Sein Code war sauber, typsicher und getestet — er hat SOLID- und Clean-Code-Prinzipien konsequent angewendet … Ich würde jederzeit wieder mit ihm arbeiten und empfehle ihn ohne Einschränkung.",
      "Nikita is extremely self-reliant. He found his way into a complex, grown codebase without anyone having to guide him through it … His code was clean, type-safe and tested — he consistently applied SOLID and clean code principles … I’d work with him again any time and recommend him without reservation.",
    ),
  },

  "artem-puliavin": {
    original: "en",
    role: "Tech Lead B2C",
    relation: relation.team,
    project: projectLabel["manifest-os"],
    quote: t(
      "Als Tech Lead für den B2C-Bereich habe ich bei Manifest OS mit Nikita an der Integration von HubSpot, Cal.com und Bluedot AI gearbeitet — er als Senior Fullstack Engineer, ich auf der Lead-Seite. Konkret ging es um die ereignisgetriebene Anreicherung von Leads aus anwaltlichen Erstgesprächen: Meeting-Aufzeichnungen werden über Bluedot transkribiert, über einen Webhook und eine Queue weiterverarbeitet, von einem LLM ausgewertet, und die strukturierten Ergebnisse fließen automatisch in die Kernsysteme zurück. Eine Kette mit reichlich Fehlerquellen, die entsprechend robust gebaut werden musste (Retry, Idempotenz).\n\nNikita hat diese Integration vollständig eigenverantwortlich geliefert. Ich musste nie eingreifen — er hat mich mit kurzen, präzisen Status-Updates auf dem Laufenden gehalten, offene Entscheidungen rechtzeitig eskaliert und den Rest selbst getragen. Das Ergebnis war eine voll funktionsfähige KI-Integration im Produktivbetrieb, sauber umgesetzt und termingerecht geliefert.\n\nFür mich zeigt das am besten, wie er arbeitet: ein hohes Maß an Autonomie, verbunden mit transparenter Kommunikation. Ich kann Nikita klar empfehlen.",
      "As tech lead for the B2C area I worked with Nikita at Manifest OS on the HubSpot, Cal.com and Bluedot AI integration — him as a Senior Fullstack Engineer, me on the lead side. Specifically it was about event-driven enrichment of initial legal consultation leads: meeting recordings are transcribed via Bluedot, processed further through a webhook and a queue, evaluated by an LLM, and the structured results flow back into the core systems automatically. A chain with plenty of failure modes, which had to be built accordingly resilient (retry, idempotency).\n\nNikita delivered this integration entirely on his own responsibility. I never had to step in — he kept me updated with short, precise status updates, escalated open decisions in time and carried the rest himself. The result was a fully functional AI integration running in production, cleanly implemented and delivered on time.\n\nFor me that’s the best illustration of how he works: a high degree of autonomy combined with transparent communication. I can clearly recommend Nikita.",
    ),
    short: t(
      "Nikita hat diese Integration vollständig eigenverantwortlich geliefert. Ich musste nie eingreifen — er hat mich mit kurzen, präzisen Status-Updates auf dem Laufenden gehalten und offene Entscheidungen rechtzeitig eskaliert … Eine voll funktionsfähige KI-Integration im Produktivbetrieb, sauber umgesetzt und termingerecht geliefert. Ich kann Nikita klar empfehlen.",
      "Nikita delivered this integration entirely on his own responsibility. I never had to step in — he kept me updated with short, precise status updates and escalated open decisions in time … A fully functional AI integration running in production, cleanly implemented and delivered on time. I can clearly recommend Nikita.",
    ),
  },

  "sagar-anne": {
    original: "en",
    role: "Product Manager",
    relation: relation.team,
    project: projectLabel["manifest-os"],
    quote: t(
      "Als Product Manager habe ich bei Manifest OS das Amplitude-Analytics-Projekt verantwortet; Nikita hat als Senior Fullstack Engineer die Umsetzung getragen. Er hat das anwendungsweite Event-Tracking konzipiert und implementiert, alle relevanten geschäftlichen User-Flows instrumentiert, die Events getestet und validiert und damit überhaupt erst die Datengrundlage geschaffen, die Schwachstellen und Reibungspunkte in der User Journey sichtbar macht.\n\nWas die Zusammenarbeit aus PM-Sicht so einfach gemacht hat, ist die Eigenständigkeit, mit der Nikita gearbeitet hat: Er hat Anforderungen schnell erfasst, Lücken selbst erkannt und gezielt nachgefragt, statt Annahmen zu treffen. Auch cross-funktional war er stark: Er hat eng mit unseren Designern zusammengearbeitet und sich konsequent an das Designsystem gehalten, statt Eigenbauten zu schaffen — das hat die visuelle Konsistenz der Plattform spürbar unterstützt.",
      "As Product Manager I owned the Amplitude analytics project at Manifest OS; Nikita, as a Senior Fullstack Engineer, was the one who carried the implementation. He designed and implemented the application-wide event tracking, instrumented all relevant business user flows, tested and validated the events and created the data foundation that made weaknesses and friction points in the user journey visible in the first place.\n\nWhat made the collaboration so easy from a PM perspective is how autonomously Nikita worked: he grasped requirements quickly, identified gaps himself and asked targeted questions rather than making assumptions. He was also strong cross-functionally: he worked closely with our designers and consistently followed the design system instead of building his own one-offs, which noticeably supported the visual consistency of the platform.",
    ),
    short: t(
      "Nikita hat das anwendungsweite Event-Tracking konzipiert und implementiert, alle relevanten geschäftlichen User-Flows instrumentiert und damit die Datengrundlage geschaffen, die Schwachstellen und Reibungspunkte in der User Journey überhaupt erst sichtbar macht … Er hat Anforderungen schnell erfasst, Lücken selbst erkannt und gezielt nachgefragt, statt Annahmen zu treffen.",
      "Nikita designed and implemented the application-wide event tracking, instrumented all relevant business user flows and created the data foundation that made weaknesses and friction points in the user journey visible in the first place … He grasped requirements quickly, identified gaps himself and asked targeted questions rather than making assumptions.",
    ),
  },

  "nikita-herndlhofer": {
    original: "en",
    role: "Tech Lead Platform",
    relation: relation.team,
    project: projectLabel["manifest-os"],
    quote: t(
      "Als Tech Lead aus einem anderen Team hatte ich die Gelegenheit, mit Nikita an mehreren Projekten zusammenzuarbeiten. Nikita hat durchgehend starke Umsetzung, sicheres Urteilsvermögen und die Fähigkeit gezeigt, Dinge effizient zum Abschluss zu bringen — auch über Teamgrenzen hinweg!",
      "As a tech lead from another team, I’ve had the opportunity to collaborate with Nikita on several projects. Nikita consistently delivered strong execution, sound judgment, and the ability to get things done efficiently, even across team boundaries!",
    ),
    short: t(
      "Nikita hat durchgehend starke Umsetzung, sicheres Urteilsvermögen und die Fähigkeit gezeigt, Dinge effizient zum Abschluss zu bringen — auch über Teamgrenzen hinweg!",
      "Nikita consistently delivered strong execution, sound judgment, and the ability to get things done efficiently, even across team boundaries!",
    ),
  },

  "suraj-kakar": {
    original: "de",
    role: "Executive Director, Private Markets Distribution & Capital Raising",
    relation: relation.client,
    project: projectLabel.aitoi,
    quote: t(
      "Wir sind äußerst zufrieden mit der Arbeit von Nikita Petrich als freiberuflicher Entwickler! Er hat unser KI-Spielzeug-Projekt maßgeblich unterstützt und dabei eine klare, sichere und skalierbare Lösung umgesetzt. Nikita entwickelte eine Next.js-App zur einfachen Einrichtung des Spielzeugs sowie eine Next.js Progressive Web Application (PWA) für das Dashboard, über das Eltern die Spielsessions ihrer Kinder nachverfolgen, filtern und analysieren können. Für die Umsetzung setzte er modernste Technologien ein, darunter React, Next.js 15, Tailwind CSS, shadcn, Supabase, Docker, sowie CI/CD-Pipelines und Unit-Tests, um die Qualität, Sicherheit und Zuverlässigkeit der Anwendungen sicherzustellen. Wir schätzen besonders Nikitas Professionalität, sein technisches Know-how und seinen durchdachten Ansatz – wir würden jederzeit wieder mit ihm zusammenarbeiten und können ihn uneingeschränkt empfehlen.",
      "We are extremely happy with Nikita Petrich's work as a freelance developer! He made a decisive contribution to our AI toy project and delivered a clear, secure and scalable solution. Nikita built a Next.js app for setting the toy up easily as well as a Next.js progressive web application (PWA) for the dashboard through which parents can follow, filter and analyse their children's play sessions. He used state-of-the-art technologies for the implementation, among them React, Next.js 15, Tailwind CSS, shadcn, Supabase and Docker, along with CI/CD pipelines and unit tests to ensure the quality, security and reliability of the applications. We particularly value Nikita's professionalism, his technical expertise and his considered approach — we would work with him again at any time and can recommend him without reservation.",
    ),
    short: t(
      "Wir sind äußerst zufrieden mit der Arbeit von Nikita Petrich als freiberuflicher Entwickler! Er hat unser KI-Spielzeug-Projekt maßgeblich unterstützt und dabei eine klare, sichere und skalierbare Lösung umgesetzt … Wir würden jederzeit wieder mit ihm zusammenarbeiten und können ihn uneingeschränkt empfehlen.",
      "We are extremely happy with Nikita Petrich's work as a freelance developer! He made a decisive contribution to our AI toy project and delivered a clear, secure and scalable solution … We would work with him again at any time and can recommend him without reservation.",
    ),
  },

  "daniel-kmiotek": {
    original: "de",
    role: t("Geschäftsführer", "Managing Director"),
    relation: relation.client,
    project: projectLabel.dino,
    quote: t(
      "Wir arbeiten nun seit drei Monaten mit Nikita zusammen. Seine Leistung und sein Engagement übertreffen deutlich die Erwartungen an einen Freelancer. Er unterstützt uns bei der Entwicklung einer Notarhilfssoftware und erarbeitet schnell sowie zuverlässig die Anforderungen im Frontend (React TS). Darüber hinaus verbessert er durch Eigeninitiative die Qualität des Quellcodes und trägt maßgeblich zur Qualitätssicherung der Software bei. Wir arbeiten sehr gerne mit Nikita zusammen und empfehlen ihn uneingeschränkt weiter. Er ist eine ausgezeichnete Wahl, wenn es darum geht, Frontend-Lösungen sauber und benutzerfreundlich umzusetzen.",
      "We have been working with Nikita for three months now. His performance and commitment clearly exceed what you would expect from a freelancer. He supports us in developing software for notary offices and works through the frontend requirements (React TS) quickly and reliably. Beyond that, he improves the quality of the source code on his own initiative and contributes substantially to the quality assurance of the software. We very much enjoy working with Nikita and recommend him without reservation. He is an excellent choice when frontend solutions need to be implemented cleanly and in a user-friendly way.",
    ),
    short: t(
      "Seine Leistung und sein Engagement übertreffen deutlich die Erwartungen an einen Freelancer … Durch Eigeninitiative verbessert er die Qualität des Quellcodes und trägt maßgeblich zur Qualitätssicherung bei. Wir empfehlen ihn uneingeschränkt weiter.",
      "His performance and commitment clearly exceed what you would expect from a freelancer … On his own initiative he improves the quality of the source code and contributes substantially to quality assurance. We recommend him without reservation.",
    ),
  },

  "harry-diwert": {
    original: "de",
    role: t("Geschäftsführer", "Managing Director"),
    relation: relation.client,
    project: projectLabel["accounting-os"],
    quote: t(
      "Ich möchte Nikita Petrich uneingeschränkt für seine hervorragende Arbeit als Full Stack Developer empfehlen. Er hat für unser Unternehmen ein maßgeschneidertes ERP-System entwickelt, das unsere Geschäftsprozesse erheblich optimiert hat. Hervorzuhebende Punkte: Technische Expertise: Nikita hat mit Technologien wie React, NestJS, GraphQL und MariaDB ein leistungsstarkes und benutzerfreundliches ERP-System geschaffen, das perfekt auf unsere Anforderungen zugeschnitten ist. Effizientes Inventarmanagement: Die von ihm implementierte Lösung ermöglicht eine präzise Echtzeit-Verfolgung unserer Lagerbestände, was unsere Effizienz deutlich gesteigert hat. Rechnungsstellung: Die Funktion zur Generierung von PDF-Rechnungen hat unsere Arbeitsabläufe beschleunigt und Fehler minimiert. Professionelle Zusammenarbeit: Nikita hat uns durch klare Kommunikation, proaktive Vorschläge und eine sorgfältige Schulung während der Implementierung überzeugt. Zuverlässiger Support: Auch nach Projektabschluss steht er uns für Fragen und Anpassungen stets zur Verfügung. Nikita kombiniert technisches Know-how mit einer lösungsorientierten Arbeitsweise und einem hohen Maß an Professionalität. Wir sind begeistert von seiner Arbeit und können ihn jedem Unternehmen empfehlen, das nach individuellen Softwarelösungen sucht. Vielen Dank für die großartige Zusammenarbeit!",
      "I would like to recommend Nikita Petrich without reservation for his outstanding work as a full stack developer. He built a bespoke ERP system for our company that has substantially improved our business processes. Points worth highlighting: Technical expertise: using technologies such as React, NestJS, GraphQL and MariaDB, Nikita created a powerful and user-friendly ERP system tailored precisely to our requirements. Efficient inventory management: the solution he implemented allows precise real-time tracking of our stock, which has markedly increased our efficiency. Invoicing: the function for generating PDF invoices has sped up our workflows and minimised errors. Professional collaboration: Nikita convinced us with clear communication, proactive suggestions and thorough training during the implementation. Reliable support: even after the project was completed he is always available for questions and adjustments. Nikita combines technical expertise with a solution-oriented way of working and a high degree of professionalism. We are delighted with his work and can recommend him to any company looking for bespoke software solutions. Many thanks for the excellent collaboration!",
    ),
    short: t(
      "Nikita hat für unser Unternehmen ein maßgeschneidertes ERP-System entwickelt, das unsere Geschäftsprozesse erheblich optimiert hat … Wir sind begeistert von seiner Arbeit und können ihn jedem Unternehmen empfehlen, das nach individuellen Softwarelösungen sucht.",
      "Nikita built a bespoke ERP system for our company that has substantially improved our business processes … We are delighted with his work and can recommend him to any company looking for bespoke software solutions.",
    ),
  },

  "ahmed-buraa-hameed": {
    original: "en",
    role: "Senior Full Stack Engineer",
    relation: relation.team,
    project: projectLabel["xu-navigator"],
    quote: t(
      "Ich bestätige gerne, dass wir Nikita von Juli 2021 bis Februar 2023 beauftragt haben. Nikita war für die Entwicklung von Frontend und Backend der Plattform verantwortlich. Er hat eigenständig an unserer Plattform gearbeitet und uns dank seiner Erfahrung im Frontend-Bereich geholfen, die bestmögliche UI/UX-Erfahrung zu bieten. Wir haben Nikita als kompetenten, freundlichen und engagierten Menschen kennengelernt. Wir sind überzeugt, dass in Nikita enormes Potenzial steckt und dass er eine herausragende Verstärkung für das Team wäre. Ich hätte keinerlei Bedenken, ihn erneut zu beauftragen, und empfehle Nikita mit Überzeugung für eine Anstellung oder externe Unterstützung als Auftragnehmer.",
      "I am happy to confirm that we have contracted Nikita from July 2021, to February 2023. Nikita was responsible for developing the front-end and the back-end of the platform. Nikita worked independently on our platform and helped us provide the best UI/UX experience due to his experience in the Front-end field. We got to know Nikita as a competent, friendly and engaged person. We believe that Nikita has a tremendous amount of potential and would be an outstanding addition to the team. I would have no reservations about hiring him again and I am confident in recommending Nikita for employment or external support as a contractor.",
    ),
    short: t(
      "Nikita hat eigenständig an unserer Plattform gearbeitet und uns dank seiner Erfahrung im Frontend-Bereich geholfen, die bestmögliche UI/UX-Erfahrung zu bieten … Ich hätte keinerlei Bedenken, ihn erneut zu beauftragen, und empfehle Nikita mit Überzeugung als Auftragnehmer.",
      "Nikita worked independently on our platform and helped us provide the best UI/UX experience due to his experience in the Front-end field … I would have no reservations about hiring him again and I am confident in recommending Nikita as a contractor.",
    ),
  },

  "behdad-tabrizi": {
    original: "de",
    role: "Full-Stack Developer",
    relation: relation.team,
    project: projectLabel["xu-navigator"],
    quote: t(
      "Hiermit möchte ich Nikita Petrich eine positive Referenz für seine Mitarbeit im gemeinsamen Projekt für die XU Group aussprechen. Während unserer Zusammenarbeit war Nikita als Full-Stack-Entwickler mit Fokus auf Angular im Frontend und NestJS im Backend tätig. In dieser Rolle hat er stets durch sein technisches Know-how, seine Zuverlässigkeit und seine strukturierte Arbeitsweise überzeugt. Besonders hervorzuheben ist seine Fähigkeit, komplexe Anforderungen schnell zu erfassen und in effiziente, saubere Lösungen umzusetzen. Nikita war nicht nur fachlich ein starker Teamplayer, sondern auch menschlich eine Bereicherung für das Projekt. Die Kommunikation mit ihm war stets offen, konstruktiv und zielorientiert. Ich kann Nikita weiterempfehlen und bin überzeugt, dass er auch in zukünftigen Projekten eine wertvolle Unterstützung sein wird.",
      "I am glad to give Nikita Petrich a positive reference for his work in our joint project for the XU Group. During our collaboration Nikita worked as a full-stack developer focusing on Angular in the frontend and NestJS in the backend. In that role he consistently convinced through his technical expertise, his reliability and his structured way of working. His ability to grasp complex requirements quickly and turn them into efficient, clean solutions deserves particular mention. Nikita was not only a strong team player professionally but also an asset to the project as a person. Communication with him was always open, constructive and goal-oriented. I can recommend Nikita and am convinced that he will be a valuable support in future projects as well.",
    ),
    short: t(
      "Nikita hat stets durch sein technisches Know-how, seine Zuverlässigkeit und seine strukturierte Arbeitsweise überzeugt … Er war nicht nur fachlich ein starker Teamplayer, sondern auch menschlich eine Bereicherung für das Projekt.",
      "Nikita consistently convinced through his technical expertise, his reliability and his structured way of working … He was not only a strong team player professionally but also an asset to the project as a person.",
    ),
  },
};

export type ReferenceSourceEntry = {
  /** Stable slug — the reference lives at /references/<slug> forever. */
  slug: string;
  name: string;
  role: I18nText | string;
  /** Company or organisation the recommender represents. */
  company?: string;
  /** Company website; makes the company name a link when set. */
  companyUrl?: string;
  /** Relationship to Nikita, e.g. "Kunde", "Projektteam". */
  relation: I18nText;
  /** Slug of the related project (links to /projects/<slug>). */
  projectSlug?: string;
  /** Human-readable project label shown on the card. */
  project: I18nText;
  /** Verifiable sources; each renders as an outbound tag. */
  sources: ReferenceSource[];
  /** ISO date for sorting (newest first), mirroring the related project. */
  sort: string;
  /** Editorial override for the gallery order, compared in place of `sort`.
      Only for a card whose position is a deliberate choice rather than its
      date — `sort` stays the honest date either way. */
  order?: string;
  /** Language the recommendation was written in. */
  originalLocale: Locale;
  /** Full testimonial — original on one side, translation on the other. */
  quote: I18nText;
  /** The same testimonial in the language it was written in, as a plain string
      so it survives `localize()` on both sides: a reader looking at the
      translation can switch to the wording as written without leaving the
      page. Identical to `quote` when the page is already in that language. */
  quoteOriginal: string;
  /** Condensed pull-quote for the compact listing. */
  short: I18nText;
};

/* The JSON import is unchecked by TypeScript, so validate it at module load —
   a typo in the JSON, a missing translation or a stale slug then fails the
   build (generateStaticParams) instead of crashing in the browser. */
function buildReferences(data: unknown): ReferenceSourceEntry[] {
  if (!Array.isArray(data)) throw new Error("references.json: not an array");
  const projectSlugs = new Set(projects.map((p) => p.slug));

  return (data as Record<string, never>[]).map((raw) => {
    const r = raw as unknown as {
      slug: string;
      name: string;
      company?: string;
      companyUrl?: string;
      projectSlug?: string;
      sources: ReferenceSource[];
      sort: string;
      order?: string;
      quote: string;
      short: string;
    };

    if (!r.slug || !r.name || !r.sort || !r.quote || !r.short) {
      throw new Error(
        `references.json: missing required field for "${r.slug ?? "?"}"`,
      );
    }
    for (const s of r.sources) {
      if (!(s in referenceSources)) {
        throw new Error(
          `references.json: unknown source "${s}" for "${r.slug}"`,
        );
      }
    }
    if (r.projectSlug && !projectSlugs.has(r.projectSlug)) {
      throw new Error(
        `references.json: unknown projectSlug "${r.projectSlug}" for "${r.slug}"`,
      );
    }

    const translation = translations[r.slug];
    if (!translation) {
      throw new Error(
        `lib/content/references.ts: no translation for "${r.slug}"`,
      );
    }
    /* The original side must still be the wording from references.json — that
       file is what the PDF CV renders, and the two must not drift apart. */
    if (translation.quote[translation.original] !== r.quote) {
      throw new Error(
        `lib/content/references.ts: the ${translation.original} quote for "${r.slug}" no longer matches references.json`,
      );
    }
    if (translation.short[translation.original] !== r.short) {
      throw new Error(
        `lib/content/references.ts: the ${translation.original} short quote for "${r.slug}" no longer matches references.json`,
      );
    }

    return {
      slug: r.slug,
      name: r.name,
      company: r.company,
      companyUrl: r.companyUrl,
      projectSlug: r.projectSlug,
      sources: r.sources,
      sort: r.sort,
      order: r.order,
      role: translation.role,
      relation: translation.relation,
      project: translation.project,
      originalLocale: translation.original,
      quote: translation.quote,
      /* r.quote is the original wording by definition — the check above is what
         keeps it that way. */
      quoteOriginal: r.quote,
      short: translation.short,
    };
  });
}

/* Ordered newest first, mirroring the projects gallery. */
export const references: ReferenceSourceEntry[] = buildReferences(
  referencesData.references,
);
