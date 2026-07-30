"use client"; // global-error replaces the root layout when active

export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    // global-error must include html and body tags
    <html lang="de">
      <body
        style={{
          fontFamily:
            "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          color: "#37352f",
        }}
      >
        <main style={{ textAlign: "center", padding: "0 24px" }}>
          <h1 style={{ fontSize: 24, fontWeight: 600 }}>
            Da ist etwas schiefgelaufen.
          </h1>
          <p style={{ marginTop: 8, color: "#787774" }}>
            Ein unerwarteter Fehler ist aufgetreten.
          </p>
          <button
            type="button"
            onClick={() => unstable_retry()}
            style={{
              marginTop: 16,
              cursor: "pointer",
              borderRadius: 6,
              border: "none",
              background: "#ff6900",
              color: "#ffffff",
              padding: "8px 16px",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Erneut versuchen
          </button>
        </main>
      </body>
    </html>
  );
}
