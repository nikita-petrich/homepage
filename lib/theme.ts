export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "np-theme";

/* Fired on window whenever the theme changes, so every toggle on the page
   stays in sync (top bar and, on the legal pages, the footer). */
export const THEME_CHANGE_EVENT = "np:theme";

/* Runs before the first paint, inlined into <head>. Without it the page would
 * render light and flip to dark once React hydrates.
 *
 * Kept as a string (rather than a function that is stringified) so what ships
 * is exactly what is written here: no bundler transform, no reference to
 * anything outside its own scope. The CSP allows inline scripts
 * (see next.config.ts), so no nonce is needed — which is what keeps the page
 * statically renderable. */
export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    var dark = stored
      ? stored === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
  } catch (e) {
    /* Storage blocked (private mode): fall back to the light theme. */
  }
})();
`.trim();

/* The theme actually in effect, read from the class the init script set. */
export function currentTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/* The theme the visitor should get: their stored choice, else the system
   preference. */
export function preferredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* Storage blocked — fall through to the system preference. */
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/* Re-applies the preferred theme if the class on <html> disagrees with it.
 *
 * The inline init script covers every prerendered page. A route rendered on
 * demand (the 404 for an unknown URL) streams the layout's <head> as part of
 * the flight payload instead of the initial HTML, so that script does not run
 * there — this reconciles the class once the page is interactive. It does not
 * write to storage: a system preference must not silently turn into an
 * explicit choice. */
export function syncThemeClass() {
  const preferred = preferredTheme();
  if (preferred === currentTheme()) return;
  document.documentElement.classList.toggle("dark", preferred === "dark");
  window.dispatchEvent(
    new CustomEvent<Theme>(THEME_CHANGE_EVENT, { detail: preferred }),
  );
}

/* Notifies every mounted toggle when the theme changes. */
export function subscribeToTheme(onChange: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, onChange);
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* Storage blocked — the choice still applies for this page view. */
  }
  window.dispatchEvent(new CustomEvent<Theme>(THEME_CHANGE_EVENT, { detail: theme }));
}
