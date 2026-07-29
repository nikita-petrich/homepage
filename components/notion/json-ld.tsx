import { contact, profile, profileLinks, skills } from "@/lib/data";

/* Every skill the page shows, as schema.org topics. Categories 01–16 are
   subject matter; "17 — Rollen & Profil" is left out because roles, languages
   and location are not things a person "knows about" (jobTitle/address above
   already carry that). Postman appears in two categories, hence the Set. */
const knowsAbout = [
  ...new Set(
    skills.filter((c) => c.name !== "Rollen & Profil").flatMap((c) => c.items),
  ),
];

/* schema.org Person markup for search engines (pattern from the bundled
   guide node_modules/next/dist/docs/01-app/02-guides/json-ld.md — the
   `.replace(/</g, '\\u003c')` escaping is the doc-recommended XSS guard;
   the data is our own static content). */
export function PersonJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    url: "https://sequenz.io",
    email: contact.find((c) => c.href?.startsWith("mailto:"))?.text,
    telephone: contact.find((c) => c.href?.startsWith("tel:"))?.text,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Aresing",
      postalCode: "86561",
      addressCountry: "DE",
    },
    sameAs: profileLinks
      .filter((p) => p.href.startsWith("http"))
      .map((p) => p.href),
    knowsAbout,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
