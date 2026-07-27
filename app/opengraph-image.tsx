import { ImageResponse } from "next/og";

/* Social-share card (LinkedIn, WhatsApp, Slack …), generated at build time in
   the cover-banner design: warm gradient, accent bar, name, role, domain. */

export const alt = "Nikita Petrich — Senior Full-Stack & AI Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(100deg, #ecefe8 0%, #f5f3ee 58%, #f1eee7 100%)",
        }}
      >
        <div style={{ width: 14, height: "100%", background: "#e1852e" }} />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 90px",
          }}
        >
          <div
            style={{
              fontSize: 30,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#b5651d",
            }}
          >
            Freiberuflich · Remote · München
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 92,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#2b2925",
            }}
          >
            Nikita Petrich
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 42,
              fontWeight: 600,
              color: "#3a382f",
            }}
          >
            Senior Full-Stack &amp; AI Engineer
          </div>
          <div
            style={{
              marginTop: 46,
              display: "flex",
              gap: 16,
              fontSize: 28,
              color: "#6f5b3e",
            }}
          >
            <div style={{ background: "#ece3d3", padding: "10px 22px", borderRadius: 10 }}>
              LLM-Integration
            </div>
            <div style={{ background: "#ece3d3", padding: "10px 22px", borderRadius: 10 }}>
              RAG
            </div>
            <div style={{ background: "#ece3d3", padding: "10px 22px", borderRadius: 10 }}>
              Clean Architecture
            </div>
          </div>
          <div
            style={{
              marginTop: 46,
              fontSize: 32,
              fontWeight: 700,
              color: "#2b2925",
            }}
          >
            https://sequenz.io
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
