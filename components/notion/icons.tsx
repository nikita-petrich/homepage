import Image from "next/image";
import { Info } from "lucide-react";

import { flagDimensions } from "@/lib/data";

export function CactusOrangeIcon({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Info
      size={size}
      fill="none"
      className={className}
      style={{ stroke: "var(--accent-o)" }}
    />
  );
}

/* Decorative flag icon. Uses each SVG's intrinsic ratio (see flagDimensions) so
   next/image can scale it by height alone without an aspect-ratio warning. */
export function Flag({ src, className }: { src: string; className?: string }) {
  const { width, height } = flagDimensions[src] ?? { width: 4, height: 3 };
  return (
    <Image
      src={src}
      alt=""
      aria-hidden
      width={width}
      height={height}
      unoptimized
      className={className}
    />
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
