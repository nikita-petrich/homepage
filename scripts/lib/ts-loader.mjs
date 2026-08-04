/* Module hooks that let a plain node script import the site's TypeScript
 * content modules directly (lib/content/*.ts), instead of re-parsing them.
 *
 * Node strips the types itself since 22.6 — what it does not do is resolve the
 * three conveniences the app's imports rely on, because bundlers normally
 * provide them:
 *
 *   "@/lib/i18n/text"      the tsconfig path alias for the repo root
 *   "./content/skills"     an extensionless specifier
 *   "./references.json"    a JSON import without an import attribute
 *
 * Register from a script with:
 *
 *   import { register } from "node:module";
 *   register("./lib/ts-loader.mjs", import.meta.url);
 *
 * Deliberately not a dependency (no tsx, no ts-node): scripts here run with
 * nothing but node, and this file is the whole reason that still holds.
 */
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, resolve as resolvePath } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolvePath(dirname(fileURLToPath(import.meta.url)), "../..");

/* The candidates a bundler would try, in the order tsconfig implies. */
const candidates = (base) => [base, `${base}.ts`, resolvePath(base, "index.ts")];

export function resolve(specifier, context, next) {
  let base = null;
  if (specifier.startsWith("@/")) base = resolvePath(root, specifier.slice(2));
  else if (specifier.startsWith(".") && context.parentURL) {
    base = resolvePath(dirname(fileURLToPath(context.parentURL)), specifier);
  }

  if (base) {
    for (const candidate of candidates(base)) {
      if (candidate.endsWith(".ts") && existsSync(candidate)) {
        return { url: pathToFileURL(candidate).href, shortCircuit: true };
      }
    }
  }

  return next(specifier, context);
}

/* JSON without `with { type: "json" }` is a hard error in node but ordinary in
   a bundled app, so hand it over as a module with the data as its default. */
export async function load(url, context, next) {
  if (!url.endsWith(".json")) return next(url, context);
  const json = await readFile(fileURLToPath(url), "utf8");
  return { format: "module", shortCircuit: true, source: `export default ${json}` };
}
