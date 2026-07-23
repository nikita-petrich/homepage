import { Info } from "lucide-react";

export function CactusOrangeIcon({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return <Info size={size} stroke="#e1852e" fill="none" className={className} />;
}
