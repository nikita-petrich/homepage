import { Info } from "lucide-react";

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
