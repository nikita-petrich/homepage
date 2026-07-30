import Image from "next/image";

import { profile } from "@/lib/data";
import { CvDownload } from "./cv-download";

export function NotionTopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-11 items-center justify-between border-b border-[rgba(55,53,47,0.09)] bg-white/95 px-3 backdrop-blur-sm sm:px-4">
      <div className="flex items-center gap-2 text-[14px] font-medium">
        <Image
          src="/assets/avatar.png"
          alt=""
          width={18}
          height={18}
          className="h-[18px] w-[18px] object-cover"
        />
        <span>{profile.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <CvDownload variant="topbar" />
        <a
          href={profile.booking}
          target="_blank"
          rel="noopener noreferrer"
          data-analytics-event="booking_click"
          data-analytics-prop-placement="topbar"
          className="rounded-md bg-primary px-2.5 py-1.5 text-[13px] font-medium text-primary-foreground shadow-sm transition-colors hover:brightness-95"
        >
          Erstgespräch buchen
        </a>
      </div>
    </header>
  );
}
