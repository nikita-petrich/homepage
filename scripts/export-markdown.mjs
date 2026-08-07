#!/usr/bin/env node
/* Exports the whole site as one bilingual Markdown file plus its images.
 *
 *   node scripts/export-markdown.mjs [target-dir]     (default: export/)
 *
 * What comes out is a folder that can be zipped and sent on: a single
 * `nikita-petrich-homepage.md` with the German and the English version of
 * every page one after the other, and an `images/` folder next to it holding
 * every image the site ships, referenced with relative paths so the file
 * renders offline.
 *
 * The content is read from lib/content/* through the same `getContent(locale)`
 * the pages use, so an export cannot say something the site does not — with
 * one exception: the legal pages are JSX (app/[locale]/{imprint,privacy}), and
 * those are converted from their source below. Their markup is a closed set of
 * eight tags, which is what makes that safe; `jsxToMarkdown` throws on
 * anything it has not been taught.
 *
 * Links point at the live site (absolute), because a Markdown file that has
 * left this repository cannot resolve /de/projects/… on its own.
 */
import { spawnSync } from "node:child_process";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { register } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/* Same reason as scripts/skills-coverage.mjs: importing .ts from a package
   without "type": "module" warns once per file, and the flag that silences it
   has to be set at startup. */
const SILENCE_REPARSE = "--disable-warning=MODULE_TYPELESS_PACKAGE_JSON";
if (!process.execArgv.includes(SILENCE_REPARSE)) {
  const argv = [SILENCE_REPARSE, ...process.argv.slice(1)];
  process.exit(spawnSync(process.execPath, argv, { stdio: "inherit" }).status ?? 1);
}

register("./lib/ts-loader.mjs", import.meta.url);

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, process.argv[2] ?? "export");
const imagesDir = resolve(outDir, "images");

const { getContent, referencesForProject, bookingUrlFor, referenceSources } =
  await import("../lib/data.ts");
const { getUi } = await import("../lib/i18n/ui.ts");
const { format } = await import("../lib/i18n/text.ts");
const { siteUrl } = await import("../lib/profile.ts");
const { locales, localeMeta } = await import("../lib/i18n/config.ts");

/* ---- small markdown helpers -------------------------------------------- */

const lines = [];
const push = (...text) => lines.push(...text);
const blank = () => {
  if (lines.length && lines[lines.length - 1] !== "") lines.push("");
};
const section = (text) => {
  blank();
  push(text, "");
};

/* A value that ends up in a table cell can carry a pipe ("KI · RAG" does not,
   "Fullstack | AI" would) — one unescaped pipe shifts every column after it. */
const cell = (value) => String(value).replace(/\|/g, "\\|").replace(/\n+/g, " ");

const link = (label, href) => (href ? `[${label}](${href})` : label);

/* Image paths in the content are site-absolute ("/assets/projects/x.jpg");
   in the export they are relative to the Markdown file. */
const imagePath = (src) => src.replace(/^\/assets\//, "images/");

const bullets = (items) => items.map((item) => `- ${item}`);

const referenceSourceHref = (source) => referenceSources[source]?.href;

/* A testimonial is several paragraphs; a Markdown blockquote has to carry the
   marker on the blank lines between them too, or it ends after the first. */
const quote = (text) =>
  text.split("\n").map((line) => (line.trim() ? `> ${line.trim()}` : ">"));

const table = (headers, rows) => [
  `| ${headers.map(cell).join(" | ")} |`,
  `| ${headers.map(() => "---").join(" | ")} |`,
  ...rows.map((row) => `| ${row.map(cell).join(" | ")} |`),
];

/* Bold runs are authored with their surrounding spaces inside the span
   ("  mit Schwerpunkt auf "), and `** text **` is not bold in Markdown — so
   the whitespace moves back out of the markers. */
function renderSpans(spans) {
  return spans
    .map(({ t, b }) => {
      if (!b) return t;
      const [, before, text, after] = /^(\s*)(.*?)(\s*)$/s.exec(t);
      return text ? `${before}**${text}**${after}` : t;
    })
    .join("");
}

/* ---- the legal pages (JSX → markdown) ---------------------------------- */

/* The eight tags app/[locale]/{imprint,privacy}/*.tsx actually use. Anything
   else is a deliberate error rather than a silently dropped paragraph. */
const ENTITIES = {
  "&nbsp;": " ",
  "&apos;": "'",
  "&quot;": '"',
  "&amp;": "&",
  "&ndash;": "–",
  "&mdash;": "—",
};

function jsxToMarkdown(source, componentName, buttonLabel) {
  const body = source.slice(
    source.indexOf("<>", source.indexOf(`function ${componentName}`)) + 2,
    source.lastIndexOf("</>"),
  );

  const out = [];
  let rest = body
    .replace(/\{"\s*"\}/g, " ") // JSX's explicit space
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "") // JSX comments
    .replace(/\s*className="[^"]*"/g, "");

  /* <CookieSettingsButton /> is a control, not prose: name what it does. */
  rest = rest.replace(/<CookieSettingsButton\s*\/>/g, buttonLabel);

  /* Entities are HTML the browser resolves; a Markdown reader shows them raw.
     Trailing punctuation that sat on its own source line ends up separated
     from the word before it once the wrapping is collapsed away. */
  const decode = (text) =>
    Object.entries(ENTITIES)
      .reduce((out, [entity, char]) => out.replaceAll(entity, char), text)
      .replace(/ +([.,;:!?])/g, "$1");

  const collapse = (text) => decode(text.replace(/\s+/g, " ")).trim();

  /* The line breaks in the JSX are the source file's wrapping, not the
     document's — only <br /> is a real one. So every newline is collapsed
     away first and the breaks are put back from a marker, otherwise an
     address comes out with a hard break after every wrapped line. */
  const BREAK = "\u0000";

  const inline = (text) =>
    collapse(text.replace(/<br\s*\/>/g, BREAK))
      .replace(/<a href="([^"]+)"[^>]*>(.*?)<\/a>/g, (_, href, label) =>
        `[${label.trim()}](${href})`,
      )
      .replace(/<strong>(.*?)<\/strong>/g, "**$1**")
      .replace(/<code>(.*?)<\/code>/g, "`$1`")
      .split(BREAK)
      .map((line) => line.trim())
      .filter(Boolean)
      .join("\\\n");

  const tokens = rest.matchAll(
    /<LegalSection title="([^"]+)">([\s\S]*?)<\/LegalSection>|<p>([\s\S]*?)<\/p>/g,
  );

  for (const [, title, sectionBody, loose] of tokens) {
    if (loose !== undefined) {
      out.push(inline(loose), "");
      continue;
    }
    out.push(`### ${collapse(title)}`, "");
    const parts = sectionBody.matchAll(
      /<p>([\s\S]*?)<\/p>|<ul>([\s\S]*?)<\/ul>/g,
    );
    for (const [, paragraph, list] of parts) {
      if (paragraph !== undefined) out.push(inline(paragraph), "");
      else {
        for (const [, item] of list.matchAll(/<li>([\s\S]*?)<\/li>/g)) {
          out.push(`- ${inline(item).replace(/\\\n/g, " ")}`);
        }
        out.push("");
      }
    }
  }

  const unknown = rest.replace(
    /<\/?(?:LegalSection|p|br|a|strong|code|ul|li)\b[^>]*>/g,
    "",
  );
  const leftover = unknown.match(/<[A-Za-z][^>]*>/g);
  if (leftover) {
    throw new Error(
      `${componentName}: unhandled markup ${[...new Set(leftover)].join(", ")}`,
    );
  }

  return out.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd();
}

async function legalMarkdown(page, locale) {
  const file = resolve(root, `app/[locale]/${page}/${locale}.tsx`);
  const component = `${page[0].toUpperCase()}${page.slice(1)}${locale[0].toUpperCase()}${locale.slice(1)}`;
  const ui = getUi(locale);
  const button = `*(${ui.footer.privacySettings}${
    locale === "de" ? " im Fußbereich der Website" : " in the footer of the website"
  })*`;
  return jsxToMarkdown(await readFile(file, "utf8"), component, button);
}

/* ---- one language ------------------------------------------------------ */

function renderLocale(locale, legal) {
  const c = getContent(locale);
  const ui = getUi(locale);
  const de = locale === "de";
  const base = `${siteUrl}/${locale}`;
  const label = (deText, enText) => (de ? deText : enText);

  const heading = {
    about: label("Über mich", "About"),
    cv: label("Lebenslauf als PDF", "Résumé as PDF"),
    intro: label("Kurzprofil", "At a glance"),
    booking: label("Erstgespräch", "Intro call"),
    page: label("Seite", "Page"),
    company: label("Auftraggeber", "Client"),
    category: label("Kategorie", "Category"),
    role: label("Rolle", "Role"),
    period: label("Zeitraum", "Period"),
    project: label("Projekt", "Project"),
    field: label("Feld", "Field"),
    value: label("Wert", "Value"),
    source: label("Quelle", "Source"),
    original: label("Original", "Original"),
    issuer: label("Aussteller", "Issuer"),
    date: label("Datum", "Date"),
    scope: label("Umfang", "Scope"),
    document: label("Dokument", "Document"),
    imprint: ui.footer.imprint,
    privacy: ui.legal.privacyTitle,
  };

  section(`# ${label("Deutsch", "English")}`);

  /* -- profile ---------------------------------------------------------- */
  section(`## ${c.profile.name} — ${c.profile.role}`);
  push(`![${c.profile.name}](images/profile.jpg)`, "");
  push(`*${c.profile.slogan}*`, "");
  push(c.siteDescription, "");
  push(c.bannerTags.join(" · "), "");
  push(`${heading.page}: ${base}`, "");

  /* -- contact ---------------------------------------------------------- */
  section(`## ${ui.sections.contact}`);
  push(
    ...bullets([
      ...c.contact.map((item) => link(item.text, item.href)),
      `${ui.topbar.booking}: ${bookingUrlFor(locale)}`,
    ]),
  );

  section(`## ${ui.sections.profiles}`);
  push(...bullets(c.profileLinks.map((item) => `${item.label}: ${item.href}`)));

  section(`## ${heading.cv}`);
  push(
    ...bullets(
      c.cvFiles.map(
        (file) =>
          `![](${imagePath(file.flag)}) ${link(
            file.label,
            siteUrl + file.href,
          )} — ${file.sub}`,
      ),
    ),
  );

  /* -- key facts -------------------------------------------------------- */
  section(`## ${ui.sections.facts}`);
  for (const fact of c.facts) {
    push(`- **${fact.label}:** ${fact.value}`);
    for (const detail of fact.details ?? []) {
      push(`  - ${detail.key}: ${detail.value}`);
    }
  }

  section(`## ${ui.sections.languages}`);
  push(
    ...bullets(
      c.languages.map((entry) => {
        const text = `![](${imagePath(entry.flag)}) **${entry.text}** — ${entry.sub}`;
        return entry.href ? `${text} (${base}${entry.href})` : text;
      }),
    ),
  );

  section(`## ${ui.sections.methods}`);
  push(...bullets(c.methods));

  section(`## ${ui.sections.approach}`);
  push(...bullets(c.approach));

  /* -- about ------------------------------------------------------------ */
  section(`## ${heading.about}`);
  for (const line of c.intro) push(renderSpans(line.spans), "");
  push(`*${ui.home.ctaQuestion}*`, "");
  push(`${ui.home.ctaButton}: ${bookingUrlFor(locale)}`);

  section(`## ${ui.sections.focus}`);
  push(...bullets(c.focus));

  /* -- projects --------------------------------------------------------- */
  section(`## ${ui.sections.projects} (${c.projects.length})`);
  for (const project of c.projects) {
    section(`### ${project.num} — ${project.name}: ${project.subtitle}`);
    if (project.cover) {
      push(`![${project.caption}](${imagePath(project.cover)})`, "");
    }
    push(`*${project.caption}*`, "");
    push(
      ...bullets([
        `${heading.page}: ${base}/projects/${project.slug}`,
        ...(project.company
          ? [
              `${heading.company}: ${
                project.companyUrl
                  ? link(project.company, project.companyUrl)
                  : project.company
              }`,
            ]
          : []),
        `${heading.category}: ${project.cat}`,
        `${heading.role}: ${project.role}`,
        `${heading.period}: ${project.dateRange}`,
        `Tags: ${project.cardTags.join(" · ")}`,
      ]),
    );
    blank();
    push(project.desc, "");
    push(
      ...table(
        [heading.field, heading.value],
        project.meta.map((m) => [
          m.label,
          Array.isArray(m.value) ? m.value.join(" · ") : m.value,
        ]),
      ),
    );

    section(`#### ${ui.projects.responsibilities}`);
    push(...bullets(project.responsibilities));
    section(`#### ${ui.projects.results}`);
    push(...bullets(project.results));
    if (project.outlook?.length) {
      section(`#### ${ui.projects.outlook}`);
      push(...bullets(project.outlook));
    }

    const testimonials = referencesForProject(locale, project.slug);
    if (testimonials.length) {
      section(`#### ${ui.projects.references}`);
      push(
        ...bullets(
          testimonials.map(
            (r) =>
              `${r.name} (${r.role}, ${r.company}) — ${base}/references/${r.slug}`,
          ),
        ),
      );
    }

    section(`#### ${ui.projects.technologies} (${project.tech.length})`);
    push(project.tech.join(" · "));
  }

  /* -- testimonials ----------------------------------------------------- */
  section(`## ${ui.sections.references} (${c.references.length})`);
  push(ui.home.referencesIntro, "");
  for (const r of c.references) {
    section(`### ${r.name} — ${r.role}, ${link(r.company, r.companyUrl)}`);
    push(
      ...bullets([
        `${heading.page}: ${base}/references/${r.slug}`,
        `${ui.references.colRelation}: ${r.relation}`,
        ...(r.project
          ? [
              `${heading.project}: ${r.project}${
                r.projectSlug ? ` (${base}/projects/${r.projectSlug})` : ""
              }`,
            ]
          : []),
        `${heading.source}: ${r.sources
          .map((s) => link(s, referenceSourceHref(s)))
          .join(", ")}`,
      ]),
    );
    blank();
    push(...quote(r.quote));
    if (r.originalLocale !== locale) {
      blank();
      push(
        `*${format(ui.references.originalLanguage, {
          language: ui.languageName[r.originalLocale],
        })}*`,
        "",
        `**${heading.original} (${ui.languageName[r.originalLocale]}):**`,
        "",
        ...quote(r.quoteOriginal),
      );
    }
  }

  /* -- skills ----------------------------------------------------------- */
  section(`## ${ui.sections.skills}`);
  for (const kind of ["hard", "soft", "profile"]) {
    const group = c.skills.filter((s) => (s.kind ?? "hard") === kind);
    if (!group.length) continue;
    section(`### ${ui.skills.groups[kind]}`);
    for (const category of group) {
      push(`**${category.num} — ${category.name}**`, "");
      push(category.items.join(" · "), "");
    }
  }

  /* -- certificates ----------------------------------------------------- */
  section(`## ${ui.sections.certificates} (${c.certificates.length})`);
  push(ui.home.certificatesIntro, "");
  push(`${label("Übersicht", "Overview")}: ${base}/certificates`, "");
  for (const cert of c.certificates) {
    section(`### ${cert.title}`);
    if (cert.preview) push(`![${cert.title}](${imagePath(cert.preview)})`, "");
    const pdf = existsSync(resolve(root, `public/certificates/${cert.slug}.pdf`))
      ? `${siteUrl}/certificates/${cert.slug}.pdf`
      : undefined;
    push(
      ...bullets([
        `${heading.page}: ${base}/certificates/${cert.slug}`,
        `${heading.issuer}: ${cert.issuer}`,
        `${heading.date}: ${cert.date}`,
        ...(cert.detail ? [`${heading.scope}: ${cert.detail}`] : []),
        `${heading.category}: ${cert.cat}`,
        `Tags: ${cert.tags.join(" · ")}`,
        ...(pdf ? [`${heading.document}: ${pdf}`] : []),
        ...(cert.externalUrl ? [`${heading.original}: ${cert.externalUrl}`] : []),
        ...(cert.verifyUrl
          ? [
              `${format(ui.certificates.verifyOnIssuer, {
                issuer: cert.issuer,
              })}: ${cert.verifyUrl}`,
            ]
          : []),
        ...(cert.courseUrl
          ? [`${ui.certificates.coursePage}: ${cert.courseUrl}`]
          : []),
      ]),
    );
    blank();
    push(cert.summary, "");
    if (cert.facts?.length) {
      push(
        ...table(
          [heading.field, heading.value],
          cert.facts.map((f) => [f.label, f.value]),
        ),
      );
    }
    if (cert.outcomes?.length) {
      section(`#### ${ui.certificates.outcomes}`);
      push(...bullets(cert.outcomes));
    }
    if (cert.curriculum?.length) {
      section(`#### ${ui.certificates.curriculum}`);
      for (const part of cert.curriculum) {
        push(`- **${part.title}**${part.meta ? ` — ${part.meta}` : ""}`);
        for (const lesson of part.lessons ?? []) push(`  - ${lesson}`);
      }
      if (cert.curriculumNote) {
        blank();
        push(`*${cert.curriculumNote}*`);
      }
    }
  }

  /* -- closing cta ------------------------------------------------------ */
  section(`## ${ui.home.closingTitle}`);
  push(ui.home.closingLead, "");
  push(
    ...bullets([
      `**${ui.home.closingCall}** (${ui.home.closingCallSub}): ${bookingUrlFor(locale)}`,
      `**${ui.home.closingBrief}** (${ui.home.closingBriefSub}): ${
        c.contact.find((i) => i.href?.startsWith("mailto:"))?.text ?? ""
      }`,
      `**${ui.home.closingCv}** (${ui.home.closingCvSub}): ${c.cvFiles
        .map((f) => siteUrl + f.href)
        .join(" · ")}`,
    ]),
  );

  /* -- legal ------------------------------------------------------------ */
  section(`## ${heading.imprint}`);
  push(`${heading.page}: ${base}/imprint`, "");
  push(legal.imprint, "");

  section(`## ${heading.privacy}`);
  push(`${heading.page}: ${base}/privacy`, "");
  push(legal.privacy);
}

/* ---- assemble ---------------------------------------------------------- */

const legal = {};
for (const locale of locales) {
  legal[locale] = {
    imprint: await legalMarkdown("imprint", locale),
    privacy: await legalMarkdown("privacy", locale),
  };
}

const de = getContent("de");
push(`# ${de.profile.name} — ${de.profile.role.replace(/^Freiberuflicher /, "")}`);
push("");
push(
  `Vollständiger Inhalt von ${siteUrl} als Markdown — auf Deutsch und auf Englisch, mit allen Links und allen Bildern im Ordner \`images/\`.`,
);
push("");
push(
  `Full content of ${siteUrl} as Markdown — in German and English, with every link and every image in the \`images/\` folder.`,
);
push("");
push(
  ...bullets([
    ...locales.map(
      (locale) =>
        `[${localeMeta[locale].label}](#${localeMeta[locale].label.toLowerCase()}) — ${
          getContent(locale).profile.role
        }`,
    ),
  ]),
);

for (const locale of locales) {
  blank();
  push("---");
  renderLocale(locale, legal[locale]);
}

const markdown = `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`;

await rm(outDir, { recursive: true, force: true });
await mkdir(imagesDir, { recursive: true });
await cp(resolve(root, "public/assets"), imagesDir, { recursive: true });
await writeFile(resolve(outDir, "nikita-petrich-homepage.md"), markdown, "utf8");

const images = markdown.match(/\]\(images\/[^)]+\)/g) ?? [];
for (const reference of new Set(images)) {
  const file = reference.slice(2, -1);
  if (!existsSync(resolve(outDir, file))) {
    throw new Error(`missing image: ${file}`);
  }
}

console.log(
  `${outDir}\n  nikita-petrich-homepage.md  ${markdown.split("\n").length} lines, ${(
    Buffer.byteLength(markdown) / 1024
  ).toFixed(0)} KB\n  images/  ${new Set(images).size} referenced`,
);
