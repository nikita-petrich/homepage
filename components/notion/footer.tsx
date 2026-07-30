import Link from "next/link";

import { CookieSettingsButton } from "./cookie-settings-button";

/* Site-wide footer with the legally required links (Impressum, Datenschutz)
   and the re-entry point for the consent settings. Rendered from the root
   layout so it is present on every route, including the standalone
   /projects/<slug> and /references/<slug> pages. */
export function Footer() {
  return (
    <footer className="border-t border-[rgba(55,53,47,0.09)] bg-white">
      <div className="mx-auto flex max-w-[960px] flex-col items-center justify-between gap-2 px-6 py-5 text-[13px] text-notion-gray sm:flex-row sm:px-12">
        <span>© {new Date().getFullYear()} Nikita Petrich</span>
        <nav
          aria-label="Rechtliches"
          className="flex flex-wrap items-center gap-x-4 gap-y-1"
        >
          <Link href="/imprint" className="hover:underline">
            Impressum
          </Link>
          <Link href="/privacy" className="hover:underline">
            Datenschutz
          </Link>
          <CookieSettingsButton />
        </nav>
      </div>
    </footer>
  );
}
