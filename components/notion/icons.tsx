/*
 * Stand-ins for Notion's illustrated icon set (the proxy blocks notion.so):
 * the orange "cloudy" page icon and the orange "cactus" callout icon.
 */

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
      viewBox="0 0 24 24"
      fill={ORANGE}
      className={className}
      aria-hidden="true"
    >
      <path d="M6.4 20.2C2.6 20.2 1.4 16.9 2.2 14.6 2.9 12.6 4.8 11.4 6.2 11.5 6.3 7.9 9 6 11.8 6c2.9 0 4.9 1.9 5.6 4.3 3.4-.4 5.2 2 5.2 4.3 0 2.6-1.8 5.6-5.4 5.6H6.4Z" />
    </svg>
  );
}

export function CactusOrangeIcon({ size = 24, className }: IconProps) {
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
      <path d="M16.5 31V17a3.5 3.5 0 0 1 7 0v14" />
      <path d="M13 28.5V26a3 3 0 0 1 3-3h.5" />
      <path d="M27 26.5v-4a3 3 0 0 0-3-3h-.5" />
      <path d="M13.8 31.5h12.4l-1.3 5.4a1 1 0 0 1-1 .8h-6.8a1 1 0 0 1-1-.8Z" />
      <path d="M12.6 31.5h14.8" />
    </svg>
  );
}
