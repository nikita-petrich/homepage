import { LegalSection } from "@/components/notion/legal";
import { CookieSettingsButton } from "@/components/notion/cookie-settings-button";

/* Courtesy translation — the German version is the legally binding one, which
   the note above this content says explicitly. References to German statutes
   (DSGVO/GDPR, TDDDG, VSBG) keep their German designations, because those are
   the provisions that actually apply. */
export function PrivacyEn() {
  return (
    <>
      <p className="text-notion-gray">Last updated: August 2026</p>

      <LegalSection title="1. Controller">
        <p>
          The controller within the meaning of the General Data Protection
          Regulation (GDPR) is:
        </p>
        <p>
          Nikita Petrich
          <br />
          Sonnenhamer Straße 17
          <br />
          86561 Aresing, Germany
          <br />
          Phone: +49 15679088678
          <br />
          E-mail: n.petrich@sequenz.io
        </p>
      </LegalSection>

      <LegalSection title="2. Overview">
        <p>
          This website is a static portfolio site with no login, no forms and no
          advertising networks. Fonts are served locally from this site; visiting
          it opens no connection to Google or any other font service. Personal
          data arises only within the narrow scope described below.
        </p>
        <p>
          <strong>No tracking or advertising cookies</strong> are set. The only
          cookie set is a technically necessary one for your choice of language:
          when you switch between German and English in the top right, the site
          stores your choice under the name <code>NEXT_LOCALE</code> (value “de”
          or “en”, lifetime one year) so that a link opened later without a
          language prefix appears in your language. The cookie contains no
          identifier by which you could be recognised and is not passed on to
          third parties. It is strictly necessary for the function you
          explicitly requested (§ 25 (2) no. 2 TDDDG); the legal basis for the
          processing is Art. 6 (1) (f) GDPR.
        </p>
        <p>
          Also strictly necessary, and therefore not subject to consent, are two
          entries in your browser&apos;s localStorage: your decision about usage
          measurement (see section 4) and your choice between the light and dark
          theme. Neither leaves your device.
        </p>
      </LegalSection>

      <LegalSection title="3. Hosting and server log files">
        <p>
          This website is hosted by netcup GmbH, Emmy-Noether-Straße 10,
          76131 Karlsruhe, Germany; the server location is Nuremberg (Germany).
          A data processing agreement pursuant to Art. 28 GDPR is in place with
          netcup.
        </p>
        <p>
          When this website is accessed, the web server automatically processes
          information transmitted by your browser (in particular IP address,
          date and time of access, page requested, referrer URL, browser type
          and preferred language). The preferred language is evaluated
          transiently only, to send you to the German or the English version on
          your first visit; it is not stored. These server log files serve
          exclusively to ensure trouble-free operation and the security of the
          website (legal basis: Art. 6 (1) (f) GDPR). The log data is deleted
          after 7 days at the latest and is not merged with other data sources.
        </p>
      </LegalSection>

      <LegalSection title="4. Anonymous usage and interaction measurement">
        <p>
          This website measures its usage with a self-hosted instance of the
          open-source software Umami on a server in the EU. The measurement is
          deliberately data-minimising: <strong>no cookies</strong> are set and{" "}
          <strong>nothing is stored on or read from your device</strong>. Your
          IP address is processed transiently only, in order to derive the
          country, region and approximate locality of origin from it and to form
          a value that makes your visit distinguishable from others; that value
          is derived from the IP address, the browser identification and a{" "}
          <strong>random value that changes daily</strong>. The IP address
          itself is <strong>not stored</strong>, and because the random value
          changes every day, recognition across several days is impossible.
        </p>
        <p>
          What is recorded are aggregated details such as page views, country,
          region and locality of origin, browser, operating system, device type
          and
          screen resolution, the referring page, as well as events such as
          buttons clicked (e.g. CV download, appointment booking, switching
          language or theme), scroll depth and approximate time on page — with
          no link to you as a person. Search input is not recorded in plain
          text. The legal basis is Art. 6 (1) (f) GDPR (legitimate interest in
          measuring reach and improving the offering); § 25 TDDDG does not apply
          because your device is not accessed. Aggregated statistical data is
          deleted after 14 months at the latest.
        </p>
        <p>
          You may object to this measurement at any time with effect for the
          future (Art. 21 GDPR): via the <CookieSettingsButton /> in the footer
          of every page. Your decision is stored as a single entry in your
          browser&apos;s localStorage — that storage is strictly necessary to honour
          your choice (§ 25 (2) no. 2 TDDDG).
        </p>
      </LegalSection>

      <LegalSection title="5. Getting in touch">
        <p>
          If you contact me by e-mail or telephone, I process the data
          transmitted in doing so (name, contact details, content of the
          enquiry) in order to handle the enquiry. The legal basis is Art. 6 (1)
          (b) GDPR (initiation/performance of a contract) or Art. 6 (1) (f) GDPR
          (answering general enquiries). The data is deleted as soon as it is no
          longer required for that purpose and no statutory retention
          obligations stand in the way.
        </p>
      </LegalSection>

      <LegalSection title="6. Appointment booking via Notion Calendar">
        <p>
          For arranging an intro call, this website links to the external
          booking service Notion Calendar (calendar.notion.so) operated by
          Notion Labs, Inc., San Francisco, USA. Only once you follow that link
          and enter data there (e.g. name, e-mail address, preferred date) does
          Notion process that data under its own responsibility; a transfer to
          the USA may take place in the process. Notion Labs, Inc. is certified
          under the EU-US Data Privacy Framework. For details please see{" "}
          <a
            href="https://www.notion.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-2"
          >
            Notion&apos;s privacy policy
          </a>
          . Using the booking link is voluntary; you can alternatively arrange
          appointments by e-mail or telephone.
        </p>
      </LegalSection>

      <LegalSection title="7. Third-party testimonials and recommendations">
        <p>
          In the “Testimonials” section I publish recommendations from clients
          and project colleagues, with name, position, company and the text of
          the quotation. These recommendations were given publicly by the
          respective individuals on LinkedIn or Malt and are reproduced here
          with their consent (legal basis: Art. 6 (1) (a) GDPR). Where a
          recommendation is not available in the language of the page you are
          viewing, a translation is additionally shown and marked as such; the
          authoritative text remains the original published at the linked
          source. Every referee may withdraw their consent at any time without
          formality (contact details in section 1); the entry is then removed
          from the website immediately.
        </p>
      </LegalSection>

      <LegalSection title="8. Your rights">
        <p>Under the GDPR you have the following rights:</p>
        <ul className="flex list-disc flex-col gap-1 pl-5">
          <li>access to the data processed (Art. 15 GDPR),</li>
          <li>rectification of inaccurate data (Art. 16 GDPR),</li>
          <li>erasure (Art. 17 GDPR),</li>
          <li>restriction of processing (Art. 18 GDPR),</li>
          <li>data portability (Art. 20 GDPR),</li>
          <li>
            objection to processing based on Art. 6 (1) (f) GDPR (Art. 21 GDPR),
          </li>
          <li>
            withdrawal of consent given, with effect for the future
            (Art. 7 (3) GDPR).
          </li>
        </ul>
        <p>
          You also have the right to lodge a complaint with a data protection
          supervisory authority (Art. 77 GDPR). The competent authority is the
          Bavarian Data Protection Authority (BayLDA), Promenade 18,
          91522 Ansbach, Germany,{" "}
          <a
            href="https://www.lda.bayern.de"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-2"
          >
            www.lda.bayern.de
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="9. No automated decision-making">
        <p>
          Automated decision-making, including profiling within the meaning of
          Art. 22 GDPR, does not take place.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes to this policy">
        <p>
          This privacy policy will be adjusted as soon as the data processing on
          this website changes. The version published here is the one that
          applies at any given time.
        </p>
      </LegalSection>
    </>
  );
}
