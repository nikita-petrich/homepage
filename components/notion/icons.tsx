import Image from "next/image";

import { cn } from "@/lib/utils";

/* Decorative flag chip. Every flag is drawn into the same fixed 3:2 box and
   cropped with object-cover, so DE (5:3) and GB (2:1) render at identical
   dimensions instead of the different widths height-only scaling would give
   them. The height comes from the caller's className (e.g. h-4); the aspect
   ratio then fixes the width. */
export function Flag({ src, className }: { src: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-block aspect-[3/2] w-auto overflow-hidden",
        className,
      )}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="32px"
        unoptimized
        className="object-cover"
      />
    </span>
  );
}

/* Brand logo tile: a rounded square in the primary colour with white `</>`
   brackets, drawn inline (mirrors app/icon.tsx) so the colour always tracks
   --primary and never goes stale like a cached raster would. */
export function CodeLogo({
  size = 64,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const radius = Math.round(size * 0.22);
  const glyph = Math.round(size * 0.625);
  return (
    <span
      aria-hidden
      className={className}
      style={{
        display: "inline-flex",
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: radius,
        background: "var(--primary)",
      }}
    >
      <svg
        width={glyph}
        height={glyph}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffffff"
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="8,7 3,12 8,17" />
        <polyline points="16,7 21,12 16,17" />
        <line x1="13.5" y1="5.5" x2="10.5" y2="18.5" />
      </svg>
    </span>
  );
}
