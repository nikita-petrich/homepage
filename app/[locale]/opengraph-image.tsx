import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { getContent } from "@/lib/data";
import { defaultLocale, isLocale, locales } from "@/lib/i18n/config";
import { ogImageAlt, ogImageContentType, ogImageSize } from "@/lib/metadata";
import { profileName, siteUrl } from "@/lib/profile";

/* Social-share card (Slack, LinkedIn, WhatsApp, iMessage …), generated at build
   time in the cover-banner design: warm gradient, accent bar, and the banner's
   own order — role, name, guiding principle, focus tags. The photo leads,
   because that is what a card for a person is for: the reader knows who is
   behind the link before opening it.
   Alt text and dimensions come from lib/metadata.ts, which also hands them to
   the routes that build their own openGraph block.

   Everything readable is deliberately large: a chat client renders these 1200
   points at roughly a third of that width, so anything under ~25pt turns to
   mush in the preview. */

export const alt = ogImageAlt;
export const size = ogImageSize;
export const contentType = ogImageContentType;

/* Geist is the site's typeface (see app/[locale]/layout.tsx). next/font serves
   it as woff2, which Satori cannot parse — the same package ships TrueType
   next to it, and that is what `fonts` below wants. Three faces only: the
   500KB budget an ImageResponse bundle has to stay inside covers the fonts,
   the photo and the markup together. */
const geistDir = "node_modules/geist/dist/fonts/geist-sans";

/** Primary amber, as in app/icon.tsx — keep it in sync with `--primary`. */
const accent = "#bb4d00";

/* One card per language — the role, the guiding principle and the focus areas
   are translated, the rest is identical in both. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { profile, focus } = getContent(isLocale(locale) ? locale : defaultLocale);

  /* Read straight from disk instead of fetching the deployed URL: the card is
     prerendered during `next build`, when no server is listening yet. */
  const [photo, regular, bold, italic] = await Promise.all([
    readFile(join(process.cwd(), "public/assets/profile.jpg"), "base64"),
    readFile(join(process.cwd(), geistDir, "Geist-Regular.ttf")),
    readFile(join(process.cwd(), geistDir, "Geist-Bold.ttf")),
    readFile(join(process.cwd(), geistDir, "Geist-Italic.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          fontFamily: "Geist",
          background: "linear-gradient(100deg, #f5f5f5 0%, #ffffff 55%, #f5f5f5 100%)",
        }}
      >
        <div style={{ width: 14, height: "100%", background: accent }} />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 72px",
          }}
        >
          {/* Same order as the cover banner: the role is the accent eyebrow
              above the name, so the card and the page open with one line. It
              is long, so it spans the full width instead of sharing a row with
              the photo — at 26pt it needs a little over 900 of the 1042
              points between the paddings. */}
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: accent,
            }}
          >
            {profile.role}
          </div>

          <div style={{ marginTop: 36, display: "flex", alignItems: "center", gap: 48 }}>
            {/* Same 1 / 1.1 portrait frame the sidebar uses (app/[locale]/page.tsx),
                anchored to the top edge so the crop never cuts into the face. */}
            <img
              /* The card as a whole carries the alt text — see `alt` above. */
              alt=""
              src={`data:image/jpeg;base64,${photo}`}
              width={230}
              height={253}
              style={{
                borderRadius: 20,
                objectFit: "cover",
                objectPosition: "top",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.14)",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: 76,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "#171717",
                }}
              >
                {profileName}
              </div>
              {/* Quoted in accent italic, as the banner quotes it under the name. */}
              <div
                style={{
                  marginTop: 14,
                  fontSize: 29,
                  fontStyle: "italic",
                  color: accent,
                }}
              >
                {profile.slogan}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* The three headline focus areas, straight from the content tree,
                so the card cannot drift from what the page claims. */}
            <div style={{ display: "flex", gap: 14, fontSize: 26, color: "#262626" }}>
              {focus.slice(0, 3).map((item) => (
                <div
                  key={item}
                  style={{ background: "#f0efed", padding: "10px 20px", borderRadius: 10 }}
                >
                  {item}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 29, fontWeight: 700, color: "#171717" }}>
              {siteUrl.replace(/^https?:\/\//, "")}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: Uint8Array.from(regular).buffer, weight: 400, style: "normal" },
        { name: "Geist", data: Uint8Array.from(bold).buffer, weight: 700, style: "normal" },
        { name: "Geist", data: Uint8Array.from(italic).buffer, weight: 400, style: "italic" },
      ],
    },
  );
}
