import type { Metadata } from "next";

import { LegalPage, LegalSection } from "@/components/notion/legal";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Anbieterkennzeichnung gemäß § 5 DDG.",
};

export default function ImpressumPage() {
  return (
    <LegalPage title="Impressum">
      <LegalSection title="Angaben gemäß § 5 DDG">
        <p>
          Nikita Petrich
          <br />
          Sonnenhamer Straße 17
          <br />
          86561 Aresing
          <br />
          Deutschland
        </p>
      </LegalSection>

      <LegalSection title="Kontakt">
        <p>
          Telefon:{" "}
          <a href="tel:+4915679088678" className="font-medium underline underline-offset-2">
            +49 15679088678
          </a>
          <br />
          E-Mail:{" "}
          <a href="mailto:n.petrich@sequenz.io" className="font-medium underline underline-offset-2">
            n.petrich@sequenz.io
          </a>
        </p>
      </LegalSection>

      <LegalSection title="Umsatzsteuer-Identifikationsnummer">
        <p>
          Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:
          <br />
          DE368159064
        </p>
      </LegalSection>

      <LegalSection title="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
        <p>
          Nikita Petrich
          <br />
          Sonnenhamer Straße 17
          <br />
          86561 Aresing
        </p>
      </LegalSection>

      <LegalSection title="Verbraucherstreitbeilegung">
        <p>
          Ich bin nicht bereit und nicht verpflichtet, an
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen (§ 36 VSBG).
        </p>
      </LegalSection>
    </LegalPage>
  );
}
