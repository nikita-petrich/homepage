/*
 * Hand-drawn stand-ins for Notion's illustrated icon set.
 * The proxy blocks notion.so, so these recreate the "cloudy_orange",
 * "cactus_orange" and "archery_gray" line icons in the matching tint.
 */

type IconProps = {
  size?: number;
  className?: string;
};

const ORANGE = "#e1852e";
const GRAY = "#9b9a97";

export function CloudyOrangeIcon({ size = 40, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      stroke={ORANGE}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* sun */}
      <circle cx="15" cy="14" r="5" />
      <path d="M15 6V3.6M8.7 7.7 7 6M6 14H3.6M8.7 20.3 7 22M21.3 7.7 23 6" />
      {/* cloud, drawn on top of the sun */}
      <path
        d="M18 32.5h12.5a4.8 4.8 0 0 0 .6-9.55A6.8 6.8 0 0 0 18.3 20 5.8 5.8 0 0 0 12.6 26.7 4.8 4.8 0 0 0 18 32.5Z"
        fill="#ffffff"
      />
    </svg>
  );
}

export function CactusOrangeIcon({ size = 26, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      stroke={ORANGE}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* main stem */}
      <path d="M16.5 31V17a3.5 3.5 0 0 1 7 0v14" />
      {/* left arm */}
      <path d="M13 28.5V26a3 3 0 0 1 3-3h.5" />
      {/* right arm */}
      <path d="M27 26.5v-4a3 3 0 0 0-3-3h-.5" />
      {/* pot */}
      <path d="M13.8 31.5h12.4l-1.3 5.4a1 1 0 0 1-1 .8h-6.8a1 1 0 0 1-1-.8Z" />
      <path d="M12.6 31.5h14.8" />
    </svg>
  );
}

export function ArcheryGrayIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      stroke={GRAY}
      strokeWidth={2.1}
      className={className}
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="14" />
      <circle cx="20" cy="20" r="9.3" />
      <circle cx="20" cy="20" r="4.6" />
      <circle cx="20" cy="20" r="1.5" fill={GRAY} stroke="none" />
    </svg>
  );
}
