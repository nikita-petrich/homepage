"use client";

import { profileName } from "@/lib/data";
import { localePath } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";

import { CookieSettingsButton } from "./cookie-settings-button";
import { IntentLink } from "./intent-link";

/* Site-wide footer with the legally required links (Impressum, Datenschutz)
   and the re-entry point for the consent settings. Rendered from the root
   layout so it is present on every route, including the standalone
   /projects/<slug> and /references/<slug> pages. */
export function Footer() {
  const { locale, ui } = useI18n();

  return (
    <footer className="border-t border-[var(--hairline)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-[960px] flex-col items-center justify-between gap-2 px-6 py-5 text-[13px] text-notion-gray sm:flex-row sm:px-12">
        <span>
          © {new Date().getFullYear()} {profileName}
        </span>
        {/* py-1 lifts the links to the 24px minimum target size on touch
            devices (WCAG 2.2 SC 2.5.8). */}
        <nav
          aria-label={ui.footer.legalNav}
          className="flex flex-wrap items-center justify-center gap-x-4"
        >
          <IntentLink
            href={localePath(locale, "/imprint")}
            className="inline-block py-1 hover:underline"
          >
            {ui.footer.imprint}
          </IntentLink>
          <IntentLink
            href={localePath(locale, "/privacy")}
            className="inline-block py-1 hover:underline"
          >
            {ui.footer.privacy}
          </IntentLink>
          <CookieSettingsButton />
        </nav>
      </div>
    </footer>
  );
}
