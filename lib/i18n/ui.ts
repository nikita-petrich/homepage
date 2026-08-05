import { localizedMemo, t } from "./text";

/* Every string of the interface itself — labels, buttons, ARIA text, empty
 * states. Page content (projects, certificates, testimonials …) lives in
 * lib/content/*; this file is the chrome around it.
 *
 * Strings with a {placeholder} are filled via format() at the call site. */
const ui = {
  topbar: {
    booking: t("Erstgespräch buchen", "Book an intro call"),
    /* Same action, shown in the top bar below ~400px where the full label
       would not fit next to the other controls. */
    bookingShort: t("Buchen", "Book a call"),
    home: t("Zur Startseite", "Back to home"),
  },

  language: {
    switchLabel: t("Sprache wählen", "Choose language"),
    /* WCAG 2.5.3 (Label in Name): the button shows nothing but the locale code,
       so the accessible name has to start with that code — a voice-control user
       says what they can see ("click DE"), not what the aria-label invented. */
    switchLabelFor: t("{code} – Sprache wählen", "{code} – choose language"),
    current: t("Aktuelle Sprache: {language}", "Current language: {language}"),
    menuLabel: t("Sprache", "Language"),
  },

  /* The languages named in the page's own language — the switcher itself shows
     each language's native name instead (see localeMeta in i18n/config.ts). */
  languageName: {
    de: t("Deutsch", "German"),
    en: t("Englisch", "English"),
  },

  theme: {
    toLight: t("Zu hellem Design wechseln", "Switch to light theme"),
    toDark: t("Zu dunklem Design wechseln", "Switch to dark theme"),
  },

  cv: {
    button: t("CV", "CV"),
    buttonSuffix: t(" herunterladen", " download"),
    menuTitle: t("Lebenslauf als PDF", "Résumé as PDF"),
  },

  footer: {
    legalNav: t("Rechtliches", "Legal"),
    imprint: t("Impressum", "Imprint"),
    privacy: t("Datenschutz", "Privacy"),
    privacySettings: t("Datenschutz-Einstellungen", "Privacy settings"),
  },

  /* Headings of the home page. The floating table of contents carries its own,
     shorter labels (see `sections` in lib/content/profile.ts). */
  sections: {
    contact: t("Kontakt", "Contact"),
    facts: t("Eckdaten", "Key facts"),
    profiles: t("Profile", "Profiles"),
    methods: t("Methodik", "Methodology"),
    languages: t("Sprachen", "Languages"),
    approach: t("Arbeitsweise", "Ways of working"),
    focus: t("Schwerpunkt", "Focus"),
    projects: t("Projekte", "Projects"),
    references: t("Referenzen", "Testimonials"),
    /* Not "Skills & Fähigkeiten" — that is the same word twice in German. */
    skills: t("Skills & Technologien", "Skills & technologies"),
    certificates: t("Zertifikate", "Certificates"),
  },

  home: {
    /* The last line of the about block, rendered as its accented closing line
       directly above the booking button — which is why the invitation lives
       here rather than as a sixth intro paragraph. */
    ctaQuestion: t(
      "Passt das zu Ihrem Vorhaben? Dann freue ich mich auf ein unverbindliches Erstgespräch.",
      "Does this fit what you have in mind? Then I'd be glad to have a no-obligation intro call.",
    ),
    /* The hero button spells out that the intro call is free — the top bar
       keeps the shorter topbar.booking label where space is tight. */
    ctaButton: t(
      "Kostenloses Erstgespräch buchen",
      "Book a free intro call",
    ),
    referencesIntro: t(
      "Was Kund:innen und Projektbeteiligte über die Zusammenarbeit sagen. Jede Empfehlung ist über ihre Quelle (LinkedIn / Malt) nachprüfbar.",
      "What clients and project colleagues say about working together. Every testimonial is verifiable through its source (LinkedIn / Malt).",
    ),
    /* Not only "Weiterbildungen" any more: the list is no longer just
       technology courses — the language qualification is assessed, not taught. */
    certificatesIntro: t(
      "Abgeschlossene Weiterbildungen und geprüfte Qualifikationen. Jede Karte zeigt den vollständigen Umfang — Eckdaten, Inhalte und Kursaufbau — und verlinkt das Zertifikat als PDF.",
      "Completed courses and assessed qualifications. Each card shows the full scope — key facts, contents and syllabus — and links to the certificate as a PDF.",
    ),
    certificatesLink: t(
      "Alle Zertifikate auf einer Seite",
      "All certificates on one page",
    ),

    /* The closing call to action. The hero CTA used to be the only one on the
       page: a visitor who was finally convinced — after nine projects, eight
       testimonials, the skills database and the certificates — had to scroll
       all the way back up to act on it.

       Three routes rather than one, because the three visitors who get this far
       want different things. An agency recruiter sourcing for a client will not
       book a calendar slot on first contact; they send a spec and ask for a
       rate, and the artefact they need is the CV to forward. */
    closingTitle: t("Zusammenarbeit", "Working together"),
    closingLead: t(
      "Sie haben ein Projekt, das zu diesem Profil passt? Drei Wege, je nachdem, wie konkret es schon ist.",
      "Have a project that fits this profile? Three ways in, depending on how firm it already is.",
    ),
    closingCall: t("Kostenloses Erstgespräch buchen", "Book a free intro call"),
    closingCallSub: t("30 Minuten · unverbindlich", "30 minutes · no strings"),
    closingBrief: t("Projektanfrage senden", "Send a project brief"),
    closingBriefSub: t(
      "Anforderungen, Zeitraum, Auslastung",
      "Requirements, timeframe, capacity",
    ),
    /* Pre-filled so the reply contains the things needed to answer at all — the
       alternative is a blank mail and two rounds of questions.

       It asks for scope, not for the prospect's budget: while the key facts
       say "Stundensatz auf Anfrage", asking them to name a number first reads
       as a negotiation opener rather than as an offer. */
    closingBriefSubject: t(
      "Projektanfrage — Senior Full-Stack & AI Engineer",
      "Project enquiry — Senior Full-Stack & AI Engineer",
    ),
    closingBriefBody: t(
      "Hallo Herr Petrich,\n\nkurz zum Vorhaben:\n\n- Projekt / Aufgabe:\n- Zeitraum & Auslastung:\n- Remote / vor Ort:\n- Technischer Rahmen (Stack, Bestandssystem):\n\nViele Grüße\n",
      "Hello Nikita,\n\nbriefly about the project:\n\n- Project / task:\n- Timeframe & capacity:\n- Remote / on-site:\n- Technical context (stack, existing system):\n\nBest regards\n",
    ),
    closingCv: t("CV als PDF", "CV as a PDF"),
    closingCvSub: t("Deutsch oder Englisch", "German or English"),
  },

  gallery: {
    view: t("Galerie", "Gallery"),
    table: t("Tabelle", "Table"),
    /* Same reason as language.switchLabelFor: the trigger's visible text is the
       current view's name, so the accessible name has to lead with it. */
    switchView: t("{view} – Ansicht wechseln", "{view} – switch view"),
    search: t("Suchen", "Search"),
    searchPlaceholder: t("Suchen…", "Search…"),
    searchLabel: t("Durchsuchen", "Search entries"),
    closeSearch: t("Suche schließen", "Close search"),
    empty: t("Keine Treffer.", "No matches."),
  },

  skills: {
    title: t("Meine Skills", "My skills"),
    searchPlaceholder: t("Skill suchen…", "Search skills…"),
    searchLabel: t("Skill suchen", "Search skills"),
    /* Headings above the category cards, one per `kind` in
       lib/content/skills.ts. "Hard Skills"/"Soft Skills" are the terms a German
       job ad uses, so they stay English in the German version too. */
    groups: {
      hard: t("Hard Skills", "Hard skills"),
      soft: t("Soft Skills", "Soft skills"),
      profile: t("Profil", "Profile"),
    },
  },

  projects: {
    colName: t("Name", "Name"),
    colCompany: t("Firma", "Company"),
    colCategory: t("Kategorie", "Category"),
    responsibilities: t("Aufgaben", "Responsibilities"),
    results: t("Ergebnis", "Outcome"),
    /* Separate heading from `results` on purpose — see the `outlook` comment in
       lib/content/projects.ts. Says "target", not "outcome", in both languages.
       Just "Zielbild": the heading, the muted treatment and the dashed border
       already say this is not a result, and the earlier
       "(noch nicht erreicht)" read as *missed* rather than as *planned*. */
    outlook: t("Zielbild", "Targets"),
    reference: t("Referenz", "Testimonial"),
    references: t("Referenzen", "Testimonials"),
    technologies: t("Technologien", "Technologies"),
    viewReference: t(
      "Referenz von {name} ansehen",
      "View testimonial by {name}",
    ),
    viewAll: t("Alle {count} ansehen", "View all {count}"),
    viewAllReferences: t(
      "Alle {count} Referenzen zu {project} ansehen",
      "View all {count} testimonials for {project}",
    ),
  },

  references: {
    coverLabel: t("Empfehlung", "Testimonial"),
    colName: t("Name", "Name"),
    colCompany: t("Firma", "Company"),
    colRelation: t("Bezug", "Relation"),
    dialogLabel: t("Referenz von {name}", "Testimonial by {name}"),
    /* Leads with {label} — the button's visible text — so the accessible
       name contains it (WCAG 2.5.3), same as certificates.openDocument. */
    openSingle: t(
      "{label} – Referenz von {name} öffnen",
      "{label} – open the testimonial by {name} on its own page",
    ),
    single: t("Einzelansicht", "Single view"),
    source: t("Quelle:", "Source:"),
    viewOnSource: t("Referenz auf {source} ansehen", "View testimonial on {source}"),
    projectDialogLabel: t(
      "Referenzen zu {project}",
      "Testimonials for {project}",
    ),
    countOne: t("1 Referenz", "1 testimonial"),
    countMany: t("{count} Referenzen", "{count} testimonials"),
    toProject: t("Zum Projekt", "Go to project"),
    /* Testimonials are quoted in the language they were written in; the other
       language shows a translation, and this line names the original. */
    originalLanguage: t(
      "Übersetzt aus dem Original ({language}) — der Wortlaut steht bei der verlinkten Quelle.",
      "Translated from the original ({language}) — the wording as written is at the linked source.",
    ),
    metaDescription: t(
      "{name} ({role}) über die Zusammenarbeit mit Nikita Petrich.",
      "{name} ({role}) on working with Nikita Petrich.",
    ),
    projectMetaTitle: t(
      "Referenzen — {project}",
      "Testimonials — {project}",
    ),
    projectMetaDescription: t(
      "{count} zum Projekt {project} ({subtitle}): {names}.",
      "{count} for the {project} project ({subtitle}): {names}.",
    ),
  },

  certificates: {
    colTitle: t("Titel", "Title"),
    colIssuer: t("Aussteller", "Issuer"),
    colCategory: t("Kategorie", "Category"),
    dialogLabel: t("Zertifikat: {title}", "Certificate: {title}"),
    previewAlt: t(
      "Zertifikat „{title}“ von {issuer}, ausgestellt {date}",
      "Certificate “{title}” from {issuer}, issued {date}",
    ),
    /* Leads with {label} — the control's own visible text — so the accessible
       name contains it (WCAG 2.5.3), then adds the context the visible text
       leaves out: which certificate, and that it opens in a new tab. */
    openDocument: t(
      "{label} – Zertifikat „{title}“ als {kind} in neuem Tab öffnen",
      "{label} – open certificate “{title}” as {kind} in a new tab",
    ),
    kindOriginal: t("Original", "the original"),
    kindPdf: t("PDF", "a PDF"),
    viewOnIssuer: t("Auf {issuer} ansehen", "View on {issuer}"),
    openPdf: t("PDF öffnen", "Open PDF"),
    openInNewTab: t("In neuem Tab öffnen", "Open in a new tab"),
    scopeAndContents: t("Umfang & Inhalte", "Scope & contents"),
    viewCertificateOnIssuer: t(
      "Zertifikat auf {issuer} ansehen",
      "View certificate on {issuer}",
    ),
    openCertificatePdf: t(
      "Zertifikat als PDF öffnen",
      "Open certificate as PDF",
    ),
    verifyOnIssuer: t("Auf {issuer} verifizieren", "Verify on {issuer}"),
    coursePage: t("Kursseite", "Course page"),
    outcomes: t("Inhalte & Kompetenzen", "Contents & competencies"),
    curriculum: t("Kursaufbau", "Syllabus"),
    topics: t("Themen", "Topics"),
    lessons: t("{count} Lektionen", "{count} lessons"),
    metaTitle: t("{title} — Zertifikat", "{title} — certificate"),
    /* Back link of a single certificate page — one level up the URL, to the
       overview, rather than all the way to the home page. */
    backToOverview: t("Zu allen Zertifikaten", "Back to all certificates"),
    pageTitle: t("Zertifikate", "Certificates"),
    pageIntro: t(
      "Abgeschlossene Weiterbildungen mit dem jeweiligen Zertifikat als PDF. Ein Klick auf eine Karte zeigt den vollständigen Umfang — Eckdaten, Inhalte und den Kursaufbau bis zur einzelnen Lektion; das Zertifikat selbst öffnet sich in einem neuen Tab.",
      "Completed courses, each with its certificate as a PDF. Clicking a card shows the full scope — key facts, contents and the syllabus down to the individual lesson; the certificate itself opens in a new tab.",
    ),
    pageDescription: t(
      "Alle {count} Zertifikate von Nikita Petrich mit Umfang, Kursaufbau und dem Zertifikat als PDF — von Scrimba, Code with Mosh, Udemy, Traversy Media und EnglishRadar.",
      "All {count} certificates held by Nikita Petrich, with scope, syllabus and the certificate as a PDF — from Scrimba, Code with Mosh, Udemy, Traversy Media and EnglishRadar.",
    ),
  },

  common: {
    close: t("Schließen", "Close"),
    toc: t("Inhaltsverzeichnis", "Table of contents"),
    openWebsite: t("Website von {name} öffnen", "Open the website of {name}"),
  },

  consent: {
    /* Says "no tracking cookies" rather than "no cookies": the language
       switcher stores one strictly necessary cookie (see the privacy page). */
    text: t(
      "Diese Website misst die Nutzung cookielos und anonym — ohne Tracking-Cookies und ohne Wiedererkennung.",
      "This website measures its usage cookielessly and anonymously — no tracking cookies, no recognition across visits.",
    ),
    details: t("Details", "Details"),
    ok: t("OK", "OK"),
    decline: t("Ablehnen", "Decline"),
    customize: t(
      "Datenschutz-Einstellungen anpassen",
      "Adjust privacy settings",
    ),
    settings: t("Datenschutz-Einstellungen", "Privacy settings"),
    done: t("Fertig", "Done"),
    necessaryTitle: t("Unbedingt erforderlich", "Strictly necessary"),
    necessaryDesc: t(
      "Speichert ausschließlich Ihre hier getroffene Entscheidung. Immer aktiv.",
      "Stores nothing but the choice you make here. Always on.",
    ),
    statisticsTitle: t("Anonyme Statistik", "Anonymous statistics"),
    statisticsDesc: t(
      "Cookielose, anonyme Messung von Seitenaufrufen und Klicks — ohne Wiedererkennung, ohne Speicherung auf Ihrem Gerät. Kann hier jederzeit deaktiviert werden.",
      "Cookieless, anonymous measurement of page views and clicks — no recognition, nothing stored on your device. Can be switched off here at any time.",
    ),
  },

  notFound: {
    metaTitle: t("Seite nicht gefunden", "Page not found"),
    label: t("Fehler 404", "Error 404"),
    title: t(
      "Diese Seite gibt es nicht (mehr).",
      "This page does not exist (any more).",
    ),
    text: t(
      "Die aufgerufene Adresse existiert nicht oder wurde entfernt.",
      "The address you requested does not exist or has been removed.",
    ),
  },

  error: {
    title: t("Da ist etwas schiefgelaufen.", "Something went wrong."),
    text: t(
      "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
      "An unexpected error occurred. Please try again.",
    ),
    textShort: t(
      "Ein unerwarteter Fehler ist aufgetreten.",
      "An unexpected error occurred.",
    ),
    retry: t("Erneut versuchen", "Try again"),
  },

  legal: {
    imprintTitle: t("Impressum", "Imprint"),
    imprintDescription: t(
      "Anbieterkennzeichnung gemäß § 5 DDG.",
      "Provider identification pursuant to § 5 DDG (German Digital Services Act).",
    ),
    privacyTitle: t("Datenschutzerklärung", "Privacy policy"),
    privacyDescription: t(
      "Informationen zur Verarbeitung personenbezogener Daten auf dieser Website gemäß Art. 13 DSGVO.",
      "Information on the processing of personal data on this website pursuant to Art. 13 GDPR.",
    ),
    /* German law applies to both documents; the English version is a courtesy
       translation and says so. */
    translationNote: t(
      "",
      "This is a courtesy translation. The legally binding version is the German one.",
    ),
    translationLink: t("", "Read the German version"),
  },
} as const;

export type Ui = ReturnType<typeof getUi>;

export const getUi = localizedMemo(ui);
