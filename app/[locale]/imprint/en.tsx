import { LegalSection } from "@/components/notion/legal";

/* Courtesy translation — the German version is the legally binding one, which
   the note above this content says explicitly. German legal references (DDG,
   MStV, VSBG) are kept as they are: they name the actual statutes. */
export function ImprintEn() {
  return (
    <>
      <LegalSection title="Details pursuant to § 5 DDG (German Digital Services Act)">
        <p>
          Nikita Petrich
          <br />
          Sonnenhamer Straße 17
          <br />
          86561 Aresing
          <br />
          Germany
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Phone:{" "}
          <a href="tel:+4915679088678" className="font-medium underline underline-offset-2">
            +49 15679088678
          </a>
          <br />
          E-mail:{" "}
          <a href="mailto:n.petrich@sequenz.io" className="font-medium underline underline-offset-2">
            n.petrich@sequenz.io
          </a>
        </p>
      </LegalSection>

      <LegalSection title="VAT identification number">
        <p>
          VAT identification number pursuant to § 27a of the German VAT Act:
          <br />
          DE368159064
        </p>
      </LegalSection>

      <LegalSection title="Responsible for the content pursuant to § 18 (2) MStV">
        <p>
          Nikita Petrich
          <br />
          Sonnenhamer Straße 17
          <br />
          86561 Aresing
        </p>
      </LegalSection>

      <LegalSection title="Consumer dispute resolution">
        <p>
          I am neither willing nor obliged to take part in dispute resolution
          proceedings before a consumer arbitration board (§ 36 VSBG).
        </p>
      </LegalSection>
    </>
  );
}
