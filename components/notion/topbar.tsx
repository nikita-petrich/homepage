import { Copy, MoreHorizontal, Search, Upload } from "lucide-react";

import { CloudyOrangeIcon } from "./icons";

/* The notion.site published-page top bar. */
export function NotionTopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-11 items-center justify-between border-b border-[rgba(55,53,47,0.09)] bg-white/95 px-3 backdrop-blur-sm sm:px-4">
      <div className="flex items-center gap-2 text-[14px] font-medium">
        <CloudyOrangeIcon size={18} />
        <span>Maya Zhang</span>
      </div>
      <div className="flex items-center gap-0.5 text-notion-gray">
        {[Search, Upload, Copy].map((Icon, i) => (
          <button
            key={i}
            className="hidden rounded-md p-1.5 hover:bg-[rgba(55,53,47,0.06)] sm:inline-flex"
            aria-label="Toolbar action"
            type="button"
          >
            <Icon size={18} strokeWidth={1.75} />
          </button>
        ))}
        <button
          className="rounded-md p-1.5 hover:bg-[rgba(55,53,47,0.06)]"
          aria-label="More"
          type="button"
        >
          <MoreHorizontal size={18} strokeWidth={1.75} />
        </button>
        <button
          className="ml-1.5 rounded-md bg-[#37352f] px-2.5 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-black"
          type="button"
        >
          Get Notion free
        </button>
      </div>
    </header>
  );
}
