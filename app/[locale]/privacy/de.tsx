import { LegalSection } from "@/components/notion/legal";
import { CookieSettingsButton } from "@/components/notion/cookie-settings-button";

export function PrivacyDe() {
  return (
    <>
      <p className="text-notion-gray">Stand: Juli 2026</p>

      <LegalSection title="1. Verantwortlicher">
        <p>
          Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
        </p>
        <p>
          Nikita Petrich
          <br />
          Sonnenhamer Straße 17
          <br />
          86561 Aresing
          <br />
          Telefon: +49 15679088678
          <br />
          E-Mail: n.petrich@sequenz.io
        </p>
      </LegalSection>

      <LegalSection title="2. Überblick">
        <p>
          Diese Website ist eine statische Portfolio-Seite ohne Login, ohne
          Formulare und ohne Werbenetzwerke. Schriftarten werden lokal von
          dieser Website ausgeliefert; beim Besuch wird keine Verbindung zu
          Google oder anderen Font-Diensten aufgebaut. Personenbezogene Daten
          fallen nur in dem unten beschriebenen, engen Umfang an.
        </p>
        <p>
          Es werden <strong>keine Tracking- oder Werbe-Cookies</strong> gesetzt.
          Gesetzt wird ausschließlich ein technisch notwendiges Cookie für Ihre
          Sprachwahl: Wenn Sie oben rechts zwischen Deutsch und Englisch
          wechseln, speichert die Website Ihre Auswahl unter dem Namen{" "}
          <code>NEXT_LOCALE</code> (Wert „de“ oder „en“, Laufzeit ein Jahr),
          damit ein später aufgerufener Link ohne Sprachkennung in Ihrer Sprache
          erscheint. Das Cookie enthält keine Kennung, mit der Sie
          wiedererkannt werden könnten, und wird nicht an Dritte übermittelt.
          Es ist für die von Ihnen ausdrücklich gewünschte Funktion unbedingt
          erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG); Rechtsgrundlage der
          Verarbeitung ist Art. 6 Abs. 1 lit. f DSGVO.
        </p>
        <p>
          Ebenfalls unbedingt erforderlich und daher einwilligungsfrei sind zwei
          Einträge im localStorage Ihres Browsers: Ihre Entscheidung zur
          Reichweitenmessung (siehe Abschnitt 4) und Ihre Auswahl zwischen
          hellem und dunklem Design. Beide verlassen Ihr Gerät nicht.
        </p>
      </LegalSection>

      <LegalSection title="3. Hosting und Server-Logfiles">
        <p>
          Diese Website wird bei der netcup GmbH, Emmy-Noether-Straße 10,
          76131 Karlsruhe, Deutschland gehostet; Serverstandort ist Nürnberg
          (Deutschland). Mit netcup besteht ein Auftragsverarbeitungsvertrag
          nach Art. 28 DSGVO.
        </p>
        <p>
          Beim Aufruf dieser Website verarbeitet der Webserver automatisch
          Informationen, die Ihr Browser übermittelt (insbesondere IP-Adresse,
          Datum und Uhrzeit des Zugriffs, aufgerufene Seite, Referrer-URL,
          Browsertyp und bevorzugte Sprache). Die bevorzugte Sprache wird
          ausschließlich flüchtig ausgewertet, um Sie beim ersten Aufruf auf die
          deutsche oder die englische Fassung zu leiten; gespeichert wird sie
          nicht. Diese Server-Logfiles dienen ausschließlich der
          Sicherstellung eines störungsfreien Betriebs und der Sicherheit der
          Website (Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO). Die Logdaten
          werden nach spätestens 7 Tagen gelöscht und nicht mit anderen
          Datenquellen zusammengeführt.
        </p>
      </LegalSection>

      <LegalSection title="4. Anonyme Reichweiten- und Interaktionsmessung">
        <p>
          Diese Website misst ihre Nutzung mit einer selbst gehosteten Instanz
          der Open-Source-Software Umami auf einem Server in der EU. Die Messung
          ist bewusst datensparsam ausgestaltet: Es werden{" "}
          <strong>keine Cookies</strong> gesetzt und es wird{" "}
          <strong>nichts auf Ihrem Endgerät gespeichert oder ausgelesen</strong>.
          Ihre IP-Adresse wird ausschließlich flüchtig verarbeitet, um daraus
          das Herkunftsland und die Region abzuleiten sowie einen Kennwert zu
          bilden, der Ihren Besuch von anderen unterscheidbar macht; dieser
          Kennwert wird aus IP-Adresse, Browserkennung und einem{" "}
          <strong>täglich wechselnden Zufallswert</strong> gebildet. Die
          IP-Adresse selbst wird <strong>nicht gespeichert</strong>, und durch
          den täglichen Wechsel ist eine Wiedererkennung über mehrere Tage
          hinweg ausgeschlossen.
        </p>
        <p>
          Erfasst werden aggregierte Angaben wie Seitenaufrufe, Herkunftsland
          und -region, Browser, Betriebssystem, Gerätetyp und
          Bildschirmauflösung, die verweisende Seite sowie Ereignisse wie
          geklickte Schaltflächen (z.&nbsp;B. CV-Download, Terminbuchung,
          Sprach- oder Designwechsel), Scroll-Tiefe und ungefähre Verweildauer —
          ohne Bezug zu Ihrer Person. Suchtexteingaben werden nicht im Klartext
          erfasst. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
          Interesse an der Reichweitenmessung und Verbesserung des Angebots);
          § 25 TDDDG findet keine Anwendung, da nicht auf Ihr Endgerät
          zugegriffen wird. Aggregierte Statistikdaten werden nach spätestens
          14 Monaten gelöscht.
        </p>
        <p>
          Sie können dieser Messung jederzeit mit Wirkung für die Zukunft
          widersprechen (Art. 21 DSGVO): über die{" "}
          <CookieSettingsButton /> im Fußbereich jeder Seite. Ihre Entscheidung
          wird als einzelner Eintrag im localStorage Ihres Browsers gespeichert
          — diese Speicherung ist für die Umsetzung Ihrer Wahl unbedingt
          erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG).
        </p>
      </LegalSection>

      <LegalSection title="5. Kontaktaufnahme">
        <p>
          Wenn Sie mich per E-Mail oder Telefon kontaktieren, verarbeite ich
          die dabei übermittelten Daten (Name, Kontaktdaten, Inhalt der
          Anfrage) zur Bearbeitung der Anfrage. Rechtsgrundlage ist Art. 6
          Abs. 1 lit. b DSGVO (Anbahnung/Durchführung eines Vertrags) bzw.
          Art. 6 Abs. 1 lit. f DSGVO (Beantwortung allgemeiner Anfragen). Die
          Daten werden gelöscht, sobald sie für den Zweck nicht mehr
          erforderlich sind und keine gesetzlichen Aufbewahrungspflichten
          entgegenstehen.
        </p>
      </LegalSection>

      <LegalSection title="6. Terminbuchung über Notion Calendar">
        <p>
          Für die Vereinbarung eines Erstgesprächs verlinkt diese Website auf
          den externen Buchungsdienst Notion Calendar (calendar.notion.so) der
          Notion Labs, Inc., San Francisco, USA. Erst wenn Sie dem Link folgen
          und dort Daten (z.&nbsp;B. Name, E-Mail-Adresse, Terminwunsch)
          eingeben, verarbeitet Notion diese Daten in eigener Verantwortung;
          dabei kann eine Übermittlung in die USA stattfinden. Notion Labs,
          Inc. ist nach dem EU-US Data Privacy Framework zertifiziert.
          Einzelheiten entnehmen Sie der{" "}
          <a
            href="https://www.notion.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-2"
          >
            Datenschutzerklärung von Notion
          </a>
          . Die Nutzung des Buchungslinks ist freiwillig; Sie können Termine
          alternativ per E-Mail oder Telefon vereinbaren.
        </p>
      </LegalSection>

      <LegalSection title="7. Referenzen und Empfehlungen Dritter">
        <p>
          Im Bereich „Referenzen“ veröffentliche ich Empfehlungen von Kunden und
          Projektbeteiligten mit Name, Position, Unternehmen und Zitattext.
          Diese Empfehlungen wurden von den jeweiligen Personen
          öffentlich auf LinkedIn bzw. Malt abgegeben und werden hier mit ihrer
          Zustimmung wiedergegeben (Rechtsgrundlage: Art. 6 Abs. 1 lit. a
          DSGVO). Liegt die Empfehlung nicht in der Sprache der aufgerufenen
          Seite vor, wird zusätzlich eine als solche gekennzeichnete
          Übersetzung angezeigt; maßgeblich bleibt der bei der verlinkten
          Quelle veröffentlichte Originaltext. Jeder Referenzgeber kann seine
          Zustimmung jederzeit formlos widerrufen (Kontaktdaten siehe
          Abschnitt 1); der Eintrag wird dann umgehend von der Website
          entfernt.
        </p>
      </LegalSection>

      <LegalSection title="8. Ihre Rechte">
        <p>Ihnen stehen nach der DSGVO folgende Rechte zu:</p>
        <ul className="flex list-disc flex-col gap-1 pl-5">
          <li>Auskunft über die verarbeiteten Daten (Art. 15 DSGVO),</li>
          <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO),</li>
          <li>Löschung (Art. 17 DSGVO),</li>
          <li>Einschränkung der Verarbeitung (Art. 18 DSGVO),</li>
          <li>Datenübertragbarkeit (Art. 20 DSGVO),</li>
          <li>
            Widerspruch gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1
            lit. f DSGVO (Art. 21 DSGVO),
          </li>
          <li>
            Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft
            (Art. 7 Abs. 3 DSGVO).
          </li>
        </ul>
        <p>
          Zudem haben Sie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde
          zu beschweren (Art. 77 DSGVO). Zuständig ist das Bayerische Landesamt
          für Datenschutzaufsicht (BayLDA), Promenade 18, 91522 Ansbach,{" "}
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

      <LegalSection title="9. Keine automatisierte Entscheidungsfindung">
        <p>
          Eine automatisierte Entscheidungsfindung einschließlich Profiling im
          Sinne von Art. 22 DSGVO findet nicht statt.
        </p>
      </LegalSection>

      <LegalSection title="10. Änderungen dieser Erklärung">
        <p>
          Diese Datenschutzerklärung wird angepasst, sobald sich die
          Datenverarbeitung auf dieser Website ändert. Es gilt jeweils die hier
          veröffentlichte Fassung.
        </p>
      </LegalSection>
    </>
  );
}
