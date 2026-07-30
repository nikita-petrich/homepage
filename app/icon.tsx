import { ImageResponse } from "next/og";

/**
 * Programmatically generated favicon.
 *
 * Mirrors the on-page avatar (`public/assets/avatar.png`): a
 * rounded terracotta tile with white `</>` code brackets, drawn as crisp SVG
 * so it stays sharp at every size instead of reusing the tiny raster asset.
 * Uses the primary brand colour (`--primary`, #ff6900).
 */

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ff6900",
          borderRadius: 14,
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="8,7 3,12 8,17" />
          <polyline points="16,7 21,12 16,17" />
          <line x1="13.5" y1="5.5" x2="10.5" y2="18.5" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
