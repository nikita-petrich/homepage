import { getContent, profileName, profileRole } from "@/lib/data";
import { localeMeta, localePath, type Locale } from "@/lib/i18n/config";

/* schema.org Person markup for search engines (pattern from the bundled
   guide node_modules/next/dist/docs/01-app/02-guides/json-ld.md — the
   `.replace(/</g, '\\u003c')` escaping is the doc-recommended XSS guard;
   the data is our own static content).

   Emitted per language: the skill terms it lists are the ones the page shows,
   and `inLanguage` names the language of the page it describes. */
export function PersonJsonLd({ locale }: { locale: Locale }) {
  const { contact, profileLinks, skills } = getContent(locale);

  /* Every skill the page shows, as schema.org topics. Roles, languages and
     location are left out (`subjectMatter: false` in lib/content/skills.ts):
     they are not things a person "knows about" — jobTitle/address above
     already carry that. Each skill is listed in exactly one category, so the
     Set only guards against a term being cross-listed again later. */
  const knowsAbout = [
    ...new Set(
      skills.filter((c) => c.subjectMatter !== false).flatMap((c) => c.items),
    ),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profileName,
    jobTitle: profileRole,
    url: `https://sequenz.io${localePath(locale)}`,
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
    knowsLanguage: ["de", "en"],
    inLanguage: localeMeta[locale].htmlLang,
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
