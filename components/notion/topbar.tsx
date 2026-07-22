import { CloudyOrangeIcon } from "./icons";
import { CvDownload } from "./cv-download";
import { profile } from "@/lib/data";

/* Sticky published-page top bar: name + CV download + "book a call" CTA. */
export function NotionTopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-11 items-center justify-between border-b border-[rgba(55,53,47,0.09)] bg-white/95 px-3 backdrop-blur-sm sm:px-4">
      <div className="flex items-center gap-2 text-[14px] font-medium">
        <CloudyOrangeIcon size={18} />
        <span>{profile.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <CvDownload variant="topbar" />
        <a
          href={profile.calendly}
          target="_blank"
          rel="noreferrer"
          className="rounded-md bg-[#37352f] px-2.5 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-black"
        >
          Erstgespräch buchen
        </a>
      </div>
    </header>
  );
}
