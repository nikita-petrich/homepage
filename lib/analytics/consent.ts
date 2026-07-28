/* Consent state for the privacy settings banner.
 *
 * Stage-1 measurement (self-hosted Umami behind the first-party proxy) is
 * cookieless and stores nothing on the device, so it runs without consent on
 * the basis of Art. 6 Abs. 1 lit. f DSGVO — `statistics` is therefore an
 * OPT-OUT flag (Widerspruch, Art. 21 DSGVO), not an opt-in.
 *
 * Storing this state object itself is strictly necessary to honour the
 * visitor's choice and thus permitted without consent (§ 25 Abs. 2 Nr. 2
 * TDDDG). Bump CONSENT_VERSION whenever categories or banner wording change
 * in a way that invalidates earlier decisions — stored states from older
 * versions are discarded and the banner is shown again.
 */

export const CONSENT_VERSION = 1;
const STORAGE_KEY = "np-consent";

/* Fired on window whenever the consent state changes. */
export const CONSENT_CHANGE_EVENT = "np:consent";
/* Fired on window to re-open the banner (footer "Datenschutz-Einstellungen"). */
export const OPEN_CONSENT_EVENT = "np:open-consent";

export type ConsentState = {
  version: number;
  /** ISO timestamp of the decision. */
  timestamp: string;
  /** Anonymous, cookieless usage statistics (opt-out; default on). */
  statistics: boolean;
};

function isConsentState(value: unknown): value is ConsentState {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.version === "number" &&
    typeof v.timestamp === "string" &&
    typeof v.statistics === "boolean"
  );
}

export function readConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isConsentState(parsed) || parsed.version !== CONSENT_VERSION) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeConsent(
  choice: Omit<ConsentState, "version" | "timestamp">,
): ConsentState {
  const state: ConsentState = {
    ...choice,
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* Private mode / storage disabled — the choice still applies in-memory. */
  }
  window.dispatchEvent(
    new CustomEvent<ConsentState>(CONSENT_CHANGE_EVENT, { detail: state }),
  );
  return state;
}

/* Statistics are allowed unless the visitor actively opted out. */
export function statisticsAllowed(): boolean {
  return readConsent()?.statistics !== false;
}
