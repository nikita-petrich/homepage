import { getContent, profileName, profileRole } from "@/lib/data";
import { localeMeta, localePath, type Locale } from "@/lib/i18n/config";

/* schema.org Person markup for search engines (pattern from the bundled
   guide node_modules/next/dist/docs/01-app/02-guides/json-ld.md — the
   `.replace(/</g, '\\u003c')` escaping is the doc-recommended XSS guard;
   the data is our own static content).

   Emitted per language: the skill terms it lists are the ones the page shows,
   and `inLanguage` names the language of the page it describes. */
export function PersonJsonLd({ locale }: { locale: Locale }) {
  const { certificates, contact, profileLinks, projects, siteDescription, skills } =
    getContent(locale);

  /* Every skill the page shows, as schema.org topics. Roles, languages,
     location and the soft-skill claims are left out (`subjectMatter: false` in
     lib/content/skills.ts): none of them is subject matter a person "knows
     about" — jobTitle/address carry the first, and "Zuverlässigkeit" as a
     claimed area of expertise only dilutes the ~300 technical topics beside it.
     Each skill is listed in exactly one category, so the Set only guards
     against a term being cross-listed again later. */
  const knowsAbout = [
    ...new Set(
      skills.filter((c) => c.subjectMatter !== false).flatMap((c) => c.items),
    ),
  ];

  /* The role names the taxonomy carries, as alternate job titles. A German ATS
     matching "Softwareentwickler" against a profile whose only machine-readable
     title is "Senior Full-Stack & AI Engineer" scores it zero, so every
     spelling the profile legitimately answers to is listed.

     Only the leading `jobTitles` entries of that category, never the whole
     thing: it also holds the working mode, the languages and the location, and
     emitting those here claimed "München" and "Englisch B2" as job titles. */
  const roles = skills.find((c) => c.kind === "profile");
  const roleTitles = roles ? roles.items.slice(0, roles.jobTitles ?? 0) : [];

  /* Projects and certificates were the richest content on the page and were
     invisible to a parser — nine documented engagements and eight credentials
     that no crawler could tell apart from prose. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profileName,
    jobTitle: [profileRole, ...roleTitles],
    description: siteDescription,
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
    /* No `skills` here. It used to repeat all ~330 `knowsAbout` terms as one
       comma-separated string — the same list twice, and in the shape a parser
       reads as keyword stuffing. `knowsAbout` is the field that carries them. */
    hasOccupation: {
      "@type": "Occupation",
      name: profileRole,
      occupationLocation: { "@type": "Country", name: "DE" },
    },
    subjectOf: projects.map((p) => ({
      "@type": "CreativeWork",
      name: p.name,
      headline: p.subtitle,
      abstract: p.desc,
      url: `https://sequenz.io${localePath(locale, `/projects/${p.slug}`)}`,
      about: p.cat,
      keywords: p.tech.join(", "),
      inLanguage: localeMeta[locale].htmlLang,
    })),
    hasCredential: certificates.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      name: c.title,
      credentialCategory: c.cat,
      url: `https://sequenz.io${localePath(locale, `/certificates/${c.slug}`)}`,
      recognizedBy: { "@type": "Organization", name: c.issuer },
    })),
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
