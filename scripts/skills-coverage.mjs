#!/usr/bin/env node
/* Reports how much of the skill taxonomy the projects actually back up.
 *
 *   node scripts/skills-coverage.mjs
 *
 * The skills gallery is a claim; a project is the evidence for it. A recruiter's
 * parser (and a reader) can only work out *where* a skill was used and *for how
 * long* from the projects it is attached to — a skill listed in the taxonomy and
 * nowhere else carries no date and no context. This script makes that gap
 * visible, and fails on the one thing that is always a mistake:
 *
 *   Unknown terms — a project lists a technology the taxonomy has never heard
 *   of. It renders as a tag and is nothing else: the gallery search cannot find
 *   it and the schema.org `knowsAbout` list omits it. Exits 1.
 *
 * Everything else is reported, not enforced. Some categories are meant to stay
 * uncovered — networking fundamentals and office tooling come from training and
 * daily work, not from a reference project — so a coverage target would be a
 * number to game rather than a bar to clear. Read the list, decide per term.
 *
 * Terms derived from `cat`, `cardTags` and the meta grid (see
 * lib/content/derive.ts) count as attachments: they are real project skills,
 * just authored in another field.
 */
import { spawnSync } from "node:child_process";
import { register } from "node:module";

/* Importing a .ts file from a package.json without "type": "module" makes node
   warn, once per file, that it had to reparse as ESM — four lines of notice
   about a cost only this script pays, on top of every report. The flag that
   silences that one warning code has to be set at startup, and a `warning`
   listener does not catch it, so the script re-runs itself with the flag. */
const SILENCE_REPARSE = "--disable-warning=MODULE_TYPELESS_PACKAGE_JSON";
if (!process.execArgv.includes(SILENCE_REPARSE)) {
  const argv = [SILENCE_REPARSE, ...process.argv.slice(1)];
  process.exit(spawnSync(process.execPath, argv, { stdio: "inherit" }).status ?? 1);
}

/* A report gets piped into `head` or quit out of `less`, which closes the pipe
   mid-write. That is the reader being done, not a failure. */
process.stdout.on("error", (error) => {
  if (error.code !== "EPIPE") throw error;
  process.exit(0);
});

register("./lib/ts-loader.mjs", import.meta.url);

const { skills } = await import("../lib/content/skills.ts");
const { projects } = await import("../lib/content/projects.ts");
const { certificates } = await import("../lib/content/certificates.ts");
const { germanTerm, unplacedTopics, withDerivedSkills } = await import(
  "../lib/content/derive.ts"
);

const pct = (part, whole) => `${Math.round((part / whole) * 100)}%`;

/* Plain text when the output is piped or redirected — the report is meant to
   be readable in a file or a CI log too. */
const style = (code) =>
  process.stdout.isTTY ? (s) => `[${code}m${s}[0m` : (s) => s;
const bold = style(1);
const dim = style(2);
const red = style(31);

const taxonomy = new Map();
for (const category of skills) {
  for (const item of category.items) taxonomy.set(germanTerm(item), category);
}

/* Every project with its derived terms folded in — the same list the site
   renders, so the report counts what the page actually shows. */
const resolved = projects.map((project) => {
  const full = withDerivedSkills(project);
  return {
    slug: project.slug,
    authored: project.tech.length,
    terms: full.tech.map(germanTerm),
    unplaced: unplacedTopics(project),
  };
});

const attachments = new Map();
for (const project of resolved) {
  for (const term of project.terms) {
    attachments.set(term, (attachments.get(term) ?? 0) + 1);
  }
}

/* Certificates are the site's second kind of evidence, and the weaker one: a
   course proves the subject was taught, a project proves it was used. Reported
   separately for that reason — a skill backed only by a certificate is a fair
   claim, but not the same claim.

   Only the fields that describe the course count. URLs and slugs are skipped:
   "react" inside a course link would otherwise back React. */
const certificateText = certificates.map((c) =>
  [
    c.title,
    germanTerm(c.cat),
    ...c.tags.map(germanTerm),
    germanTerm(c.summary),
    ...(c.outcomes ?? []).map(germanTerm),
    ...(c.curriculum ?? []).flatMap((s) => [
      germanTerm(s.title),
      ...(s.lessons ?? []),
    ]),
  ].join(" • "),
);

/* Whole-term matches only. A plain substring search backs "NAT" from
   "alternative" and "Go" from "Google" — and a taught-skill list that includes
   terms nobody taught is worse than one that misses a few. */
const wholeTerm = (term) =>
  new RegExp(
    `(?<![\\p{L}\\p{N}])${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\p{L}\\p{N}])`,
    "iu",
  );

const taught = new Set();
for (const term of taxonomy.keys()) {
  if (attachments.has(term)) continue;
  const pattern = wholeTerm(term);
  if (certificateText.some((text) => pattern.test(text))) taught.add(term);
}

const unknown = resolved.flatMap((p) =>
  p.terms.filter((term) => !taxonomy.has(term)).map((term) => [p.slug, term]),
);

const covered = [...taxonomy.keys()].filter((term) => attachments.has(term));
const derived = resolved.reduce((n, p) => n + p.terms.length - p.authored, 0);
const total = resolved.reduce((n, p) => n + p.terms.length, 0);

console.log(`\n${bold("Skill coverage")}\n`);
console.log(`  ${taxonomy.size} skills in ${skills.length} categories`);
console.log(
  `  ${resolved.length} projects · ${total} attachments ` +
    dim(`(${total - derived} authored, ${derived} derived)`),
);
console.log(
  `  ${bold(`${covered.length}/${taxonomy.size}`)} skills ` +
    `(${pct(covered.length, taxonomy.size)}) backed by at least one project`,
);
console.log(
  `  ${taught.size} more taught by a certificate · ` +
    `${bold(String(taxonomy.size - covered.length - taught.size))} backed by neither\n`,
);

console.log(bold("Per category"));
for (const category of skills) {
  const missing = category.items
    .map(germanTerm)
    .filter((term) => !attachments.has(term));
  const hit = category.items.length - missing.length;
  const name = germanTerm(category.name);
  console.log(
    `\n  ${category.num} ${name.padEnd(32)} ${String(hit).padStart(2)}/${String(
      category.items.length,
    ).padEnd(3)} ${pct(hit, category.items.length).padStart(4)}` +
      (category.subjectMatter === false ? dim("  not subject matter") : ""),
  );
  const courseOnly = missing.filter((term) => taught.has(term));
  const neither = missing.filter((term) => !taught.has(term));
  if (courseOnly.length) {
    console.log(dim(`     taught only: ${courseOnly.join(" · ")}`));
  }
  if (neither.length) console.log(dim(`     unbacked:    ${neither.join(" · ")}`));
}

console.log(`\n${bold("Per project")}`);
for (const project of resolved) {
  const extra = project.terms.length - project.authored;
  console.log(
    `  ${project.slug.padEnd(20)} ${String(project.terms.length).padStart(3)} skills` +
      (extra ? dim(`  (+${extra} derived)`) : ""),
  );
}

const unplaced = resolved.filter((p) => p.unplaced.length);
if (unplaced.length) {
  console.log(`\n${bold("Topics naming no skill")}`);
  console.log(
    dim(
      "  Fragments of `cat`/`cardTags` the taxonomy cannot place — either a\n" +
        "  term worth adding, or a short form of one already listed.",
    ),
  );
  for (const project of unplaced) {
    console.log(`  ${project.slug.padEnd(20)} ${project.unplaced.join(" · ")}`);
  }
}

if (unknown.length) {
  console.log(`\n${red(bold("Unknown terms"))}`);
  console.log(
    dim("  Listed on a project, absent from lib/content/skills.ts:"),
  );
  for (const [slug, term] of unknown) console.log(`  ${slug.padEnd(20)} ${term}`);
  console.log();
  process.exit(1);
}

console.log(`\n${dim("No unknown terms.")}\n`);
