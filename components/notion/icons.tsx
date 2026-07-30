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
