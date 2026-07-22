/*
 * Stand-ins for Notion's illustrated icon set (the proxy blocks notion.so):
 * the orange brand page icon and the orange info callout icon.
 */

import { Info } from "lucide-react";

type IconProps = {
  size?: number;
  className?: string;
};

const ORANGE = "#e1852e";

export function CloudyOrangeIcon({ size = 64, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M18 34c0-9.2 6.8-16.7 16-16.7 4.4 0 8.4 1.6 11.3 4.3 1.4 1.4 2.4 3.3 2.4 5.4 0 3.5-2.6 6.6-6 7.4l-3.3.8c-3.5.8-5.9 3.8-5.9 7.3v.8H22c-3.5 0-6.4-2.9-6.4-6.4 0-2.7 1.7-5.1 4.1-6.1l1.3-.5c.7-.3 1.2-1 1.2-1.8Z"
        fill={ORANGE}
      />
      <circle cx="44" cy="16" r="6" fill={ORANGE} opacity="0.95" />
      <circle cx="30" cy="32" r="4" fill="#ffbb7f" opacity="0.95" />
      <path
        d="M21 41h22"
        stroke="#f2b16d"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CactusOrangeIcon({ size = 24, className }: IconProps) {
  return (
    <Info
      size={size}
      stroke={ORANGE}
      fill="none"
      className={className}
    />
  );
}
