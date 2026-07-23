import { profile } from "@/lib/data";
import { CvDownload } from "./cv-download";

/* Sticky published-page top bar: name + CV download + "book a call" CTA. */
export function NotionTopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-11 items-center justify-between border-b border-[rgba(55,53,47,0.09)] bg-white/95 px-3 backdrop-blur-sm sm:px-4">
      <div className="flex items-center gap-2 text-[14px] font-medium">
        <img
          src="/assets/CV%20-%20Optimierte%20Lesbarkeit-selection%20(1).png"
          alt="Logo"
          className="h-[18px] w-[18px] object-cover"
        />
        <span>{profile.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <CvDownload variant="topbar" />
        <a
          href={profile.calendly}
          target="_blank"
          rel="noreferrer"
          className="rounded-md bg-[var(--accent-o)] px-2.5 py-1.5 text-[13px] font-medium text-white shadow-sm transition-colors hover:brightness-95"
        >
          Erstgespräch buchen
        </a>
      </div>
    </header>
  );
}
