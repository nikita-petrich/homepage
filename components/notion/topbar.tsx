import Image from "next/image";

import { profile } from "@/lib/data";
import { CvDownload } from "./cv-download";

export function NotionTopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-11 items-center justify-between border-b border-[rgba(55,53,47,0.09)] bg-white/95 px-3 backdrop-blur-sm sm:px-4">
      {/* min-w-0 + truncate: the name yields space to the actions instead of
          forcing them to wrap out of the 44px bar on narrow phones. */}
      <div className="flex min-w-0 items-center gap-2 text-[14px] font-medium">
        <Image
          src="/assets/avatar.png"
          alt=""
          width={18}
          height={18}
          className="h-[18px] w-[18px] shrink-0 object-cover"
        />
        <span className="truncate">{profile.name}</span>
      </div>
      {/* Positioning context for the CV menu, so it aligns with the bar's
          right edge and stays inside the viewport on phones. */}
      <div className="relative flex shrink-0 items-center gap-2">
        <CvDownload variant="topbar" />
        <a
          href={profile.booking}
          target="_blank"
          rel="noopener noreferrer"
          data-analytics-event="booking_click"
          data-analytics-prop-placement="topbar"
          className="rounded-md bg-[var(--accent-text)] px-2 py-1 text-[12px] font-medium whitespace-nowrap text-white shadow-sm transition-colors hover:brightness-95 sm:px-2.5 sm:py-1.5 sm:text-[13px]"
        >
          Erstgespräch buchen
        </a>
      </div>
    </header>
  );
}
