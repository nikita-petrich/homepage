import { profileName, profileRole, siteUrl } from "@/lib/profile";

/* The signpost for anything reading this site as data rather than as a page.
 *
 * It answers one question — where is the plain-text version — and answers it in
 * the first few lines, because an agent that has to read a styled page to find
 * that out has already paid the cost the twins exist to avoid. */
export const dynamic = "force-static";

const body = `# ${profileName} — ${profileRole}

> Freelance engineer's profile. Every page has a markdown twin at the same path
> with a .md suffix; the figures prose cannot carry precisely are published as
> JSON.

## Profile

- [Profile (German)](${siteUrl}/de.md): positioning, key facts, skills, reference projects, testimonials, contact and signature values.
- [Profile (English)](${siteUrl}/en.md): the same profile in English.
- [Facts as JSON](${siteUrl}/api/profile.json): availability, capacity, on-site ceiling, rate, booking links, and ready-made availability and rate sentences.

## Pages

- [Profile page (German)](${siteUrl}/de)
- [Profile page (English)](${siteUrl}/en)
- [Sitemap](${siteUrl}/sitemap.xml): every project, testimonial and certificate page, in both languages.

## Notes

- The CVs are at ${siteUrl}/cv/CV-German.pdf and ${siteUrl}/cv/CV-English.pdf.
- Contact: n.petrich@sequenz.io. An intro call can be booked from the links in the JSON feed.
`;

export function GET(): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
