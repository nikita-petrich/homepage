"use client"; // global-error replaces the root layout when active

import { defaultLocale, localeMeta } from "@/lib/i18n/config";
import { getUi } from "@/lib/i18n/ui";

/* Replaces the root layout — so it has no locale from the route and no
   stylesheet. It renders in the fallback language, the same one proxy.ts falls
   back to, with inline styles in the light palette. */
const ui = getUi(defaultLocale);

export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    // global-error must include html and body tags
    <html lang={localeMeta[defaultLocale].htmlLang}>
      <body
        style={{
          fontFamily:
            "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          color: "#171717",
        }}
      >
        <main style={{ textAlign: "center", padding: "0 24px" }}>
          <h1 style={{ fontSize: 24, fontWeight: 600 }}>{ui.error.title}</h1>
          <p style={{ marginTop: 8, color: "#737373" }}>{ui.error.textShort}</p>
          <button
            type="button"
            onClick={() => unstable_retry()}
            style={{
              marginTop: 16,
              cursor: "pointer",
              borderRadius: 6,
              border: "none",
              background: "#171717",
              color: "#ffffff",
              padding: "8px 16px",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {ui.error.retry}
          </button>
        </main>
      </body>
    </html>
  );
}
