import { type I18nText } from "@/lib/i18n/text";

import { type ProjectSource } from "./projects";
import { skills } from "./skills";

/* Project skills that are authored somewhere other than the `tech` list.
 *
 * What a project was about (LegalTech, IoT) and how it was run (Scrum) lives in
 * `cat`, `cardTags` and the meta grid. Read literally, that left "LegalTech"
 * belonging to no project at all — though four of them are — and made a search
 * for "Scrum" match no project that ran it. Folding those fields into the tech
 * list lets a project state its own domain and method, instead of the reader
 * having to combine three parts of the page.
 *
 * Deliberately not derived from: `role`. Roles, languages and location are the
 * one category the taxonomy marks `subjectMatter: false`, and they are not
 * something a project demonstrates — "Remote" or "München" as a technology tag
 * would be nonsense. Excluding the whole category (rather than naming the meta
 * cells to skip) also keeps a later meta cell from quietly leaking one in. */

type Term = I18nText | string;

/* The German side of a term — the taxonomy is keyed by it, and it is the stable
   identity of a skill wherever one has to be compared or counted. */
export const germanTerm = (value: Term): string =>
  typeof value === "string" ? value : value.de;

const skillByTerm = new Map<string, Term>(
  skills
    .filter((c) => c.subjectMatter !== false)
    .flatMap((c) =>
      c.items.map((item) => [germanTerm(item).toLowerCase(), item] as const),
    ),
);

/* Display copy is not a skill list: "KI · RAG", "Handel & Kfz-Gewerbe" and
   "3 Personen · Frontend, Embedded/Hardware" each read as several fragments,
   only some of which name a skill. A value is therefore matched whole first —
   "shadcn/ui" must not be split into two halves — and only otherwise by its
   parts; a fragment the taxonomy does not know is dropped rather than becoming
   a tag no skill category accounts for.

   Matching runs on the German side and returns the taxonomy's own entry, so the
   English wording is the one skills.ts defines rather than the display label's
   ("LegalTech / notary services" → the entry that renders as "Notary
   services"). */
const TERM_SEPARATORS = /[/·&]/;

const fragments = (value: Term): string[] =>
  germanTerm(value)
    .split(TERM_SEPARATORS)
    .map((part) => part.trim())
    .filter(Boolean);

function skillsIn(value: Term): Term[] {
  const whole = skillByTerm.get(germanTerm(value).trim().toLowerCase());
  if (whole) return [whole];
  return fragments(value)
    .map((part) => skillByTerm.get(part.toLowerCase()))
    .filter((skill): skill is Term => skill !== undefined);
}

const metaTerms = (m: ProjectSource["meta"][number]): Term[] =>
  Array.isArray(m.value) ? m.value : [m.value];

const derivable = (project: ProjectSource): Term[] => [
  project.cat,
  ...project.cardTags,
  ...project.meta.flatMap(metaTerms),
];

/* The curated list keeps its order and leads; derived terms follow, each one
   listed once. */
export function withDerivedSkills(project: ProjectSource): ProjectSource {
  const seen = new Set(project.tech.map(germanTerm));
  const derived = derivable(project)
    .flatMap(skillsIn)
    .filter((term) => {
      const key = germanTerm(term);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  return derived.length
    ? { ...project, tech: [...project.tech, ...derived] }
    : project;
}

/* Topical fragments of `cat` and `cardTags` that name no skill — reported by
   scripts/skills-coverage.mjs, not used by the site.
 *
 * Only those two fields: they are the ones meant to say what a project is
 * about, so a fragment of them that the taxonomy cannot place is either a term
 * worth adding ("Immigration", "Kfz-Gewerbe") or a display abbreviation whose
 * long form is already in the taxonomy under another spelling ("PWA" for
 * "Progressive Web App (PWA)"). The meta grid is left out: team size and
 * location match nothing by design, and listing them would bury the signal. */
export function unplacedTopics(project: ProjectSource): string[] {
  return [project.cat, ...project.cardTags]
    .filter((value) => !skillByTerm.has(germanTerm(value).trim().toLowerCase()))
    .flatMap(fragments)
    .filter((part) => !skillByTerm.has(part.toLowerCase()));
}
