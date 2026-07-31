import { ImageResponse } from "next/og";

import { getContent } from "@/lib/data";
import { defaultLocale, isLocale, locales } from "@/lib/i18n/config";
import { ogImageAlt, ogImageContentType, ogImageSize } from "@/lib/metadata";

/* Social-share card (LinkedIn, WhatsApp, Slack …), generated at build time in
   the cover-banner design: warm gradient, accent bar, name, role, domain.
   Alt text and dimensions come from lib/metadata.ts, which also hands them to
   the routes that build their own openGraph block. */

export const alt = ogImageAlt;
export const size = ogImageSize;
export const contentType = ogImageContentType;

/* One card per language — the tagline above the name is the only translated
   element, so both cards stay visually identical. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { profile } = getContent(isLocale(locale) ? locale : defaultLocale);

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
        <div style={{ width: 14, height: "100%", background: "#ff9900" }} />
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
              color: "#ff9900",
            }}
          >
            {profile.tagline}
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
