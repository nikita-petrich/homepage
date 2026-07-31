"use client";

import { OPEN_CONSENT_EVENT } from "@/lib/analytics/consent";
import { useUi } from "@/lib/i18n/provider";

/* Footer link that re-opens the consent banner with the stored preferences,
   so a once-made choice can be reviewed or withdrawn at any time
   (Art. 7 Abs. 3 DSGVO: withdrawing must be as easy as consenting). */
export function CookieSettingsButton() {
  const ui = useUi();
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
      className="cursor-pointer py-1 hover:underline"
    >
      {ui.footer.privacySettings}
    </button>
  );
}
