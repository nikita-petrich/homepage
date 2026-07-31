import Link from "next/link";

import { CookieSettingsButton } from "./cookie-settings-button";

/* Site-wide footer with the legally required links (Impressum, Datenschutz)
   and the re-entry point for the consent settings. Rendered from the root
   layout so it is present on every route, including the standalone
   /projekte/<slug> and /referenzen/<slug> pages. */
export function Footer() {
  return (
    <footer className="border-t border-[rgba(55,53,47,0.09)] bg-white">
      <div className="mx-auto flex max-w-[960px] flex-col items-center justify-between gap-2 px-6 py-5 text-[13px] text-notion-gray sm:flex-row sm:px-12">
        <span>© {new Date().getFullYear()} Nikita Petrich</span>
        {/* py-1 lifts the links to the 24px minimum target size on touch
            devices (WCAG 2.2 SC 2.5.8). */}
        <nav
          aria-label="Rechtliches"
          className="flex flex-wrap items-center justify-center gap-x-4"
        >
          <Link href="/impressum" className="inline-block py-1 hover:underline">
            Impressum
          </Link>
          <Link href="/datenschutz" className="inline-block py-1 hover:underline">
            Datenschutz
          </Link>
          <CookieSettingsButton />
        </nav>
      </div>
    </footer>
  );
}
