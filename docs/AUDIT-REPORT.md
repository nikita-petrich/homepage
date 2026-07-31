# Audit-Report: Security, Code-Qualität, Architektur & DSGVO

**Projekt:** nikita-petrich/homepage · Next.js 16.2.10 (App Router, TypeScript, Turbopack), React 19.2.4, Tailwind CSS v4
**Stand:** 24.07.2026
**Anlass:** Die Website soll produktiv für die freiberufliche Tätigkeit genutzt werden.

> **Hinweis:** Dieser Report ist eine technische Analyse und ersetzt keine anwaltliche Beratung. Die rechtlichen Einordnungen (DSGVO, DDG, TDDDG, UWG) beschreiben die übliche, gut dokumentierte Rechtslage für geschäftsmäßige deutsche Websites.

---

## 1. Management Summary

Die Codebasis ist für die Projektgröße **technisch solide** (Lint und Typecheck fehlerfrei, Produktions-Build sauber, korrekte Parallel-/Intercepting-Routes, keine XSS-Vektoren, keine Secrets im Repo, Fonts self-hosted). **Für den Produktivbetrieb als geschäftliche Website ist sie in der jetzigen Form aber nicht geeignet** — die gravierendsten Probleme sind rechtlicher Natur, nicht technischer:

| # | Top-Risiko | Schwere |
|---|---|---|
| 1 | **Kein Impressum** (§ 5 DDG) — abmahnfähig, Bußgeld bis 50.000 € möglich | 🔴 Kritisch |
| 2 | **Keine Datenschutzerklärung** (Art. 13 DSGVO) — abmahnfähig | 🔴 Kritisch |
| 3 | **Cookie-Banner ist eine Attrappe**: behauptet Analyse-Cookies, die nicht existieren; Nutzer-Auswahl wird verworfen und nirgends ausgewertet (Irreführung, § 5 UWG / Art. 5 DSGVO) | 🟠 Hoch |
| 4 | **Referenzen nennen Klarnamen von 6 Dritten** — Einwilligung nirgends dokumentiert | 🟡 Mittel |
| 5 | **Next.js 16.2.10 mit 9 bekannten CVEs** — Patch 16.2.11 verfügbar (im konkreten Setup nur eingeschränkt ausnutzbar) | 🟡 Mittel |
| 6 | **Kein CI, kein Dependabot/Renovate** — strukturelle Ursache für Risiko 5 | 🟡 Mittel |
| 7 | **Modale Dialoge ohne Fokus-Management, WCAG-Kontrastverstöße** — für Tastatur-/Screenreader-Nutzer teils unbenutzbar | 🟠 Hoch |
| 8 | **Keine OG-/SEO-Metadaten, keine Sitemap** — Link-Previews (LinkedIn!) ohne Bild, Akquise-Nachteil | 🟠 Hoch |

**Befundübersicht (nach Verifikation):** 2 kritisch · 7 hoch · 21 mittel · 23 niedrig · 24 Hinweise/Positivbefunde — konsolidiert in diesem Report zu ~45 eindeutigen Befunden.

**Zum gewünschten Tracking:** Detailliertes Event-Tracking („jeder Button-Klick") ist machbar — aber „möglichst alles über die Benutzer sammeln" kollidiert frontal mit der DSGVO (Grundsatz der Datenminimierung, Art. 5 Abs. 1 lit. c) und § 25 TDDDG (Einwilligungspflicht für Gerätezugriffe). Der rechtssichere Maximalausbau ist ein **Zwei-Stufen-Modell**: cookielose, anonyme Messung *aller* Interaktionen ohne Einwilligung (Stufe 1) plus optionales, einwilligungsbasiertes Profiling/Session-Replay (Stufe 2). Details: [`TRACKING-CONCEPT.md`](./TRACKING-CONCEPT.md), Umsetzung: [`IMPLEMENTATION-PLAN.md`](./IMPLEMENTATION-PLAN.md).

---

## 2. Methodik

- **Multi-Agent-Audit** über 6 Dimensionen (Security, Next.js-16-Best-Practices, Architektur/Qualität, DSGVO/Recht, Dependencies/Repo-Hygiene, Content/Assets), jeweils mit vollständiger Code-Durchsicht.
- **Framework-Aussagen wurden gegen die versionsgenaue Next.js-16-Doku geprüft** (`node_modules/next/dist/docs/`), nicht gegen Trainingswissen — gemäß Projektvorgabe in `AGENTS.md`.
- **Werkzeuge:** `pnpm audit`, `pnpm outdated`, `pnpm lint`, `tsc --noEmit`, Produktions-Build, systematischer Asset-Referenz-Abgleich, WCAG-Kontrastberechnung.
- **Adversariale Verifikation:** Jedes Finding sollte von einem separaten Prüf-Agenten widerlegt werden. Die Security-Dimension und Teile der Best-Practices-Dimension wurden vollständig verifiziert (Severity-Korrekturen sind eingearbeitet, z. B. Next-CVEs hoch→mittel wegen nicht erreichbarer Angriffsfläche). Bei einem Teil der übrigen Findings fiel die automatische Verifikation aus (API-Limit); die kritischen und hohen Befunde daraus wurden manuell am Code nachgeprüft und bestätigt (Impressum/Datenschutz fehlen, Cookie-Banner-Verhalten, Modal-Fokus, TOC-Hover, Typzusicherung in `lib/data.ts:538`).

**Severity-Skala:** 🔴 Kritisch (rechtliches/produktives Risiko, sofort beheben) · 🟠 Hoch · 🟡 Mittel · 🔵 Niedrig · ⚪ Hinweis/Info · ✅ Positivbefund.

---

## 3. Recht & DSGVO

### R-01 🔴 Kein Impressum (§ 5 DDG)

**Befund:** Es existiert keine Route `/imprint`, kein Footer, kein einziger Treffer für „Impressum" im gesamten Quellcode. Routen-Bestand: nur `/`, `/projects/[slug]`, `/references/[slug]` (`app/page.tsx:155-157` endet ohne Footer). Die Seite ist eindeutig geschäftsmäßig (Stundensatz „80 €/h" in `lib/data.ts:32`, CTA „Erstgespräch buchen") — damit greift die Impressumspflicht. Fehlendes Impressum ist eine Ordnungswidrigkeit (Bußgeld bis 50.000 €, § 33 DDG) und ein klassischer Abmahngrund. Besonders unglücklich: Die Seite bewirbt sich selbst mit „DSGVO-konform" und „DSGVO by Design" (`lib/data.ts:90-92, 394`).

**Empfehlung:** `app/imprint/page.tsx` anlegen und von **jeder** Seite „leicht erkennbar, unmittelbar erreichbar und ständig verfügbar" verlinken (Footer im Root-Layout, damit auch die Slug-Routen abgedeckt sind). Pflichtangaben für einen Freiberufler (Einzelunternehmer, nicht kammergebunden):

1. Vollständiger Vor- und Nachname
2. Ladungsfähige Anschrift (Straße, Hausnummer, PLZ, Ort — kein Postfach)
3. Schnelle elektronische Kontaktmöglichkeit: E-Mail **und** ein weiterer Weg (z. B. Telefon) — beides liegt bereits in `lib/data.ts:22-23` vor
4. USt-IdNr. nach § 27a UStG, sofern vorhanden (bei Kleinunternehmerregelung § 19 UStG entfällt sie)
5. Keine Kammer-/Berufsrechtsangaben nötig („Fachinformatiker" ist nicht reglementiert), keine Handelsregisterangaben
6. Empfohlen: Erklärung zur (Nicht-)Teilnahme an Verbraucherschlichtung (§ 36 VSBG) — bei reinem B2B verzichtbar

*Aufwand: S (Seite) — die Anschrift muss vom Betreiber kommen.*

### R-02 🔴 Keine Datenschutzerklärung (Art. 13 DSGVO)

**Befund:** Weder eine Route `/privacy` noch irgendein Link darauf. Auch ohne Analytics verarbeitet die Website personenbezogene Daten, über die informiert werden muss: Server-Logs/Hosting (IP-Adressen), Kontaktaufnahme (`mailto:`/`tel:`), Weiterleitung zur Terminbuchung bei **Notion** (`calendar.notion.so`, US-Anbieter — dort gibt der Interessent Name/E-Mail ein), und der localStorage-Eintrag des Cookie-Banners. Dass das Banner aktiv eine „Analyse" behauptet, ohne dass irgendwo steht, wer Verantwortlicher ist, verschärft den Transparenzverstoß (Art. 5 Abs. 1 lit. a, Art. 12 f. DSGVO).

**Empfehlung:** `app/privacy/page.tsx` mit mindestens: Verantwortlicher (= Impressumsdaten); Hosting/Server-Logs (Rechtsgrundlage Art. 6 Abs. 1 lit. f, Speicherdauer, AVV mit dem Hoster); Kontaktaufnahme; Terminbuchung über Notion inkl. Drittlandtransfer-Hinweis (EU-US Data Privacy Framework — Zertifizierung von Notion prüfen); Referenzen/Testimonials (siehe R-04); Betroffenenrechte (Art. 15–21, 77). Nach Einführung des Trackings entsprechend erweitern (Pflichtinhalte stehen in `TRACKING-CONCEPT.md`, Abschnitt 6). *Aufwand: M.*

### R-03 🟠 Cookie-Banner: irreführend und funktionslos

**Befund (`components/notion/cookie-banner.tsx`):**
- Text behauptet: „Diese Website verwendet Cookies, um die Nutzung zu analysieren…" (Z. 57–59). **Faktisch falsch:** Im gesamten Repo gibt es kein `document.cookie`, kein Analytics-Skript, keine Third-Party-Embeds (verifiziert per Grep nach `gtag|plausible|matomo|umami|posthog|sendBeacon|<script|iframe`).
- Die granularen Präferenzen (functional/analytics/marketing) aus dem „Anpassen"-Panel werden **nie gespeichert**: `dismiss()` schreibt nur den String `"all"/"none"/"customized"` (Z. 34–42), das `prefs`-Objekt verfällt (Z. 52).
- **Kein Code liest den Consent-Wert** — „Alle akzeptieren" und „Ablehnen" führen zu identischem Verhalten.
- **Kein Widerrufsweg:** Der Banner erscheint nach der ersten Entscheidung nie wieder; es gibt keinen „Cookie-Einstellungen"-Link (Art. 7 Abs. 3 DSGVO verlangt Widerruf so einfach wie Erteilung — relevant, sobald echtes Tracking kommt).

Ein Consent-Banner ohne dahinterliegende Verarbeitung ist (a) eine irreführende geschäftliche Handlung mit UWG-Abmahnrisiko, (b) ein Transparenzverstoß und (c) ein Dark-Pattern-Anti-Pattern. **Positiv:** „Ablehnen" liegt gleichwertig neben „Alle akzeptieren" (DSK-konforme erste Ebene) — das bleibt beim Umbau erhalten.

**Empfehlung:** Entweder Banner entfernen, solange kein Tracking läuft — oder (empfohlen, da Tracking gewünscht) direkt zum echten Consent-Gate umbauen (Plan, Phase 2). *Aufwand: S (entfernen) / M (umbauen).*

### R-04 🟡 Referenzen: Klarnamen Dritter ohne dokumentierte Rechtsgrundlage

**Befund:** `lib/references.json` enthält Name, Position, Firma und ausführliche Zitate von **sechs identifizierbaren Personen** (Suraj Kakar, Daniel Kmiotek, Harry Diwert, Ahmed Buraa Hameed, Behdad Tabrizi, Serghei Granici). Diese werden unter dauerhaften URLs `/references/<slug>` ausgespielt und aktiv in SEO-Metadaten gehoben (`app/references/[slug]/page.tsx:21-22` setzt `Referenz von ${name}` als `<title>` — die Namen werden suchmaschinenindexierbar). Die Zitate stammen von LinkedIn/Malt; die **Weiterveröffentlichung auf der eigenen kommerziellen Website ist eine eigene Verarbeitung**, die eine eigene Rechtsgrundlage braucht (bei werblicher Namensnutzung ist die Einwilligung der sichere Weg). Im Repo ist keinerlei Einwilligungsdokumentation erkennbar. Erschwerend: Der Code-Kommentar „the slug is a permanent route and must never change once published" (`lib/data.ts:512`) verankert dauerhafte Abrufbarkeit — das kollidiert mit Löschungsrecht/Widerruf (Art. 17, Art. 7 Abs. 3). **Positiv:** Der Krankenhaus-Kunde ist bewusst anonymisiert.

**Empfehlung:** (1) Von allen sechs Referenzgebern eine ausdrückliche, dokumentierte Einwilligung einholen bzw. bestätigen lassen und außerhalb des Repos archivieren (Nachweispflicht Art. 7 Abs. 1). (2) Abschnitt „Referenzen" in die Datenschutzerklärung. (3) Entfernungsprozess definieren (bei Widerruf: Eintrag löschen, Route liefert 404/410 — den „never remove"-Kommentar relativieren). (4) Prüfen, ob Namen in `<title>`/Description von der Einwilligung gedeckt sind. *Aufwand: M (organisatorisch).*

### R-05 ⚪ CV-PDFs inhaltlich prüfen

`public/cv/*.pdf` (je ~1 MB, 10 Seiten) sind frei abrufbar. Eigene Daten: unproblematisch. Enthaltene Referenz-Zitate/Kundennennungen müssen von denselben Einwilligungen gedeckt sein wie die Website-Referenzen; bei Widerruf müssen auch die PDFs neu generiert werden.

### R-06 ⚪ Eigene Kontaktdaten im Klartext

Telefon und E-Mail stehen maschinenlesbar im HTML (`lib/data.ts:22-23`) — kein Rechtsverstoß (für das Impressum ohnehin nötig), aber Spam-/Scraping-Exposition. Bewusste Abwägung: Für Akquise ist Erreichbarkeit meist wichtiger; bei Spam-Problemen leichte Obfuskation erwägen.

### R-07 ⚪ Einordnung des geplanten Trackings (§ 25 TDDDG)

§ 25 Abs. 1 TDDDG verlangt Einwilligung für **jedes** nicht unbedingt erforderliche Speichern/Auslesen auf dem Endgerät — unabhängig vom Personenbezug. Detailliertes Klick-Tracking ist trotzdem weitgehend **einwilligungsfrei** möglich, wenn nichts im Endgerät gespeichert und niemand über Besuche hinweg wiedererkannt wird (cookielose, aggregierte Messung; Rechtsgrundlage Art. 6 Abs. 1 lit. f). Persistente IDs, Session-Replay und Cross-Visit-Profile erfordern dagegen zwingend Einwilligung. → Zwei-Stufen-Modell in `TRACKING-CONCEPT.md`.

### R-08 ✅ Positivbefunde Recht

- **Keine eingebetteten Dritt-Ressourcen zur Laufzeit** — alle externen URLs sind reine ausgehende Links (Notion-Booking, LinkedIn, GitHub, Malt, freelancermap, sequenz.io).
- **Inter-Font wird via `next/font` self-hosted** — kein Google-Fonts-Problem (die bekannte LG-München-Konstellation ist vermieden; bestätigt durch `13-fonts.md`: „no requests are sent to Google by the browser").

---

## 4. Security

### S-01 🟡 Next.js 16.2.10 mit 9 bekannten Sicherheitslücken — Patch verfügbar *(verifiziert)*

`pnpm audit` meldet für `next@16.2.10` neun Advisories (4× high, 5× moderate), alle in **16.2.11** gepatcht: SSRF in Server Actions (GHSA-89xv-2m56-2m9x), SSRF in Rewrites (GHSA-p9j2-gv94-2wf4), Middleware/Proxy-Bypass (GHSA-6gpp-xcg3-4w24), DoS im App Router (GHSA-m99w-x7hq-7vfj), Cache-Confusion (GHSA-68g3-v927-f742, GHSA-4633-3j49-mh5q), Server-Function-Endpoint-Disclosure (GHSA-955p-x3mx-jcvp), unbegrenzte Server-Action-Payloads (GHSA-4c39-4ccg-62r3), DoS Image Optimization (GHSA-q8wf-6r8g-63ch).

**Verifizierte Einordnung:** Keiner der vier high-Advisories ist hier konkret ausnutzbar (kein `middleware.ts`/`proxy.ts`, keine Server Actions, keine Rewrites, Image Optimizer deaktiviert). Real relevant bleiben die moderate-Advisories, v. a. Cache-Confusion bei Betrieb via `next start`. Severity daher **mittel** — aber der Fix ist trivial: `pnpm up next@16.2.11 eslint-config-next@16.2.11`. *Aufwand: S.*

### S-02 🟡 Verwundbare transitive Abhängigkeiten: postcss 8.4.31, sharp 0.34.5 *(verifiziert)*

Beide kommen transitiv über `next` und werden **auch durch 16.2.11 nicht behoben** (verifiziert: 16.2.11 pinnt weiterhin postcss 8.4.31 / sharp ^0.34.5). postcss < 8.5.12: Arbitrary File Read (high, GHSA-6g55-p6wh-862q) + XSS (moderate) — primär Build-Zeit-Risiko; sharp < 0.35.0: libvips-CVEs (high, GHSA-f88m-g3jw-g9cj) — zur Laufzeit ungenutzt (`images.unoptimized: true`). **Empfehlung:** pnpm-Overrides (`postcss >= 8.5.12`, `sharp >= 0.35.0`) in `pnpm-workspace.yaml`, danach `pnpm install && pnpm build` verifizieren. *Aufwand: S.*

### S-03 🟡 Kein CI, kein Dependabot/Renovate

`.github/` existiert nicht — kein CI-Workflow, keine automatisierte Dependency-Pflege. Dass die Seite auf einem Next mit 9 gepatchten CVEs stand, ist die direkte Folge. **Für den Dauerbetrieb die wichtigste strukturelle Maßnahme dieses Audits:** `.github/dependabot.yml` (npm, weekly, gruppierte Updates) + `.github/workflows/ci.yml` (`pnpm install --frozen-lockfile && pnpm lint && pnpm build`). *Aufwand: M.*

### S-04 🔵 Keine Security-Header konfiguriert *(verifiziert)*

`next.config.ts` setzt nur `images.unoptimized` — keine `headers()`-Funktion, nirgendwo CSP, `frame-ancestors`/X-Frame-Options (Clickjacking), X-Content-Type-Options, Referrer-Policy, Permissions-Policy. Die Seite ist vollständig statisch ohne Nutzereingaben, daher nur Defense-in-Depth (Severity nach Verifikation: niedrig) — aber die Header sind praktisch kostenlos. Die versionseigene Doku (`content-security-policy.md`, Abschnitt „Without Nonces") empfiehlt für statische Seiten die CSP direkt über `headers()`; Nonce-CSP wäre falsch (erzwingt dynamisches Rendering). Konkretes Header-Set im Umsetzungsplan. **HSTS** ist deployment-abhängig (Vercel setzt es automatisch; bei Self-Hosting im Reverse Proxy setzen). *Aufwand: S–M.*

### S-05 🔵 `X-Powered-By` nicht deaktiviert *(verifiziert)*

Ohne `poweredByHeader: false` verrät jeder Response das Framework. Eine Zeile in `next.config.ts`. *Aufwand: S.*

### S-06 ⚪ Kleinigkeiten *(verifiziert)*

- localStorage-Consent-Wert wird ohne Schema-Validierung gelesen — kein Injection-Risiko (wird nur als truthy/falsy genutzt), aber beim Consent-Umbau gegen eine Allowlist/ein versioniertes Schema validieren.
- Externe Links nutzen durchgehend `rel="noreferrer"` (impliziert `noopener`) — funktional korrekt; optional explizit `"noopener noreferrer"` ausschreiben.

### S-07 ✅ Positivbefunde Security *(verifiziert)*

- **Keine XSS-Vektoren:** kein `dangerouslySetInnerHTML`/`innerHTML`/`eval`; Favicon aus hartkodiertem JSX; ausschließlich statische Daten.
- **Keine Secrets im Repo** — auch nicht in der Git-Historie; `.gitignore` deckt `.env*`/`*.pem` ab.
- **Client/Server-Grenzen konform** mit dem Next-16-Data-Security-Guide (alle Daten per Design öffentlich).
- **`pnpm-workspace.yaml` nutzt `allowBuilds` korrekt** — wirksamer Supply-Chain-Schutz (Build-Scripts nur für 5 explizit freigegebene Pakete).

---

## 5. Next.js-16-Best-Practices & SEO

### N-01 🟠 Metadata unvollständig: kein metadataBase, kein Open Graph, keine robots/sitemap *(verifiziert)*

`app/layout.tsx:11-15` definiert nur `title` + `description`. Es fehlen: `metadataBase` (nötig für absolute OG-URLs/Canonicals), `openGraph`/`twitter`-Blöcke, `app/opengraph-image.tsx`, `app/robots.ts`, `app/sitemap.ts`, `manifest`, `apple-icon`. **Konsequenz für eine Akquise-Seite:** Beim Teilen auf LinkedIn/WhatsApp/Slack erscheint **keine Vorschau-Karte**; Suchmaschinen bekommen keine Sitemap für die 14 SSG-Unterseiten. Die `production-checklist.md` fordert OG-Images und Sitemap/Robots explizit. **Empfehlung:** `metadataBase` auf die Produktionsdomain, OG/Twitter-Felder, `opengraph-image.tsx` (per `ImageResponse`, analog `icon.tsx`), `sitemap.ts` + `robots.ts` aus `lib/data.ts`-Slugs generiert, optional JSON-LD `Person`-Schema (`json-ld.md`). *Aufwand: M.*

### N-02 🟡 Keine eigenen Fehlerseiten *(verifiziert)*

`notFound()` wird korrekt aufgerufen, aber ohne `app/not-found.tsx` erscheint die **englische** Next-Default-404 auf einer durchgestalteten deutschen Seite; ohne `error.tsx`/`global-error.tsx` endet jeder Rendering-Fehler im Default-Fehlerbildschirm. Next-16-Spezifika: `error.tsx` mit `unstable_retry`, `global-error.tsx` mit eigenen `<html>/<body>`-Tags. *Aufwand: S.*

### N-03 🟡 Bilder komplett unoptimiert: `images.unoptimized: true` + durchgängig `<img>` *(verifiziert)*

Alle 6 Bild-Stellen nutzen `<img>` (2× wird die ESLint-Regel gezielt unterdrückt); `next/image` wird nirgends importiert. Die 8 Projekt-Cover (1280 px, zusammen ~944 KB, z. B. `dino.jpg` 212 KB) werden für ~240–350 px breite Karten in voller Größe ohne srcset/WebP/AVIF ausgeliefert. Zusätzlich ist `images.unoptimized: true` gesetzt, **ohne dass `output: 'export'` konfiguriert wäre** — der einzige legitime Grund für diese Option liegt nicht vor (und ein statischer Export wäre wegen der Intercepting Routes ohnehin nicht möglich). Direkter LCP-/Core-Web-Vitals-/SEO-Nachteil. **Empfehlung:** `unoptimized` entfernen, auf `next/image` mit statischen Imports + `sizes` umstellen (liefert width/height/blur automatisch); alternativ mindestens Cover auf ~640 px WebP vorskalieren (−70–80 %). *Aufwand: M.*

### N-04 🔵 Intercepting Routes werden dynamisch gerendert

Die Modal-Routen (`app/@modal/(.)projects/[slug]/page.tsx`, analog Referenzen) sind Client-Komponenten mit `useParams` — sie können kein `generateStaticParams` exportieren und werden als „Dynamic" gerendert (jede Modal-Öffnung = On-Demand-Rendering). Als Server-Komponente mit `generateStaticParams` + kleinem Client-Wrapper wären sie prerendert — und der `notFound()`-Fall (siehe A-17) gleich mitgelöst. *Aufwand: M.*

### N-05 ✅ Positivbefunde Next.js

- **SSG korrekt:** beide `[slug]`-Routen mit `generateStaticParams`, `params` korrekt awaited (Next-16-Konvention); 18 statisch vorgerenderte Seiten, Build fehler- und warnungsfrei.
- **Font-Setup doku-konform** (Variable Font, `display: swap`, CSS-Variable).
- **Parallel-/Intercepting-Route-Konventionen exakt richtig** umgesetzt (`@modal` + `default.tsx`, `(.)`-Intercepts).

---

## 6. Architektur, Code-Qualität & Barrierefreiheit

### A-01 🟠 Modale Dialoge ohne Fokus-Management

`ProjectModal`/`ReferenceModal` setzen `role="dialog"` + `aria-modal="true"` und behandeln ESC/Scroll-Lock — aber: **kein initialer Fokus, kein Fokus-Trap, keine Fokus-Rückgabe** beim Schließen (verifiziert: kein einziger `.focus()`-Aufruf). Tab wandert ungehindert in den per `aria-modal` versteckten Hintergrund. Verstößt gegen WCAG 2.1.2/2.4.3; für Tastatur-/Screenreader-Nutzer praktisch unbenutzbar. **Empfehlung:** gemeinsame `ModalShell` mit nativem `<dialog>`/`showModal()` (Fokus-Trap, ESC, Rückgabe gratis) oder Radix Dialog (stack-konform zu shadcn/ui). *Aufwand: M — zusammen mit A-04 lösen.*

### A-02 🟠 WCAG-Kontrastverstöße bei Akzentfarbe und Sekundärtexten

Berechnete Kontraste (AA-Grenze 4,5:1 für Normaltext): Akzent-Orange `#e1852e` auf Weiß **2,76:1** — betrifft ausgerechnet die Conversion-Elemente („Erstgespräch buchen"-Button, CV-Button, Profil-Links); `#9a8f7c` auf Bannergrund 2,78:1 bei 10 px; `#a7a399` 2,27:1; `text-notion-gray #787774` 4,48:1 (knapp unter AA, großflächig). **Empfehlung:** Text-auf-Weiß-Akzent auf ~`#b5651d` (≈4,6:1) abdunkeln, helles Orange nur für Flächen/großen Text; Farbpaare als Token-Paare zentral in `globals.css`. *Aufwand: M.*

### A-03 🟡 `references.json` per Doppel-Typzusicherung ohne Validierung

`lib/data.ts:538`: `referencesData.references as Reference[]` — TypeScript prüft nichts. Ein Tippfehler im JSON (z. B. `"Linkedin"` statt `"LinkedIn"`) kompiliert, crasht aber zur Laufzeit beim Rendern (`referenceSources[source].href`). `projectSlug` wird nicht gegen existierende Projekt-Slugs geprüft. **Empfehlung:** JSON nach `.ts` mit `satisfies Reference[]` überführen oder (falls es wegen PDF-CV-Sync JSON bleiben muss) beim Import mit Zod validieren → Fehler schlagen im Build auf, nicht zur Laufzeit. *Aufwand: S.*

### A-04 🟡 Modal-Gerüst komplett dupliziert

ESC-Handler, Scroll-Lock, Overlay, Close-Button sind zeichengleich in `projects.tsx:166-178` und `references.tsx:133-145`; die vier Slug-/Standalone-Pages sind strukturgleiche Kopien. Jede Änderung (z. B. der Fokus-Trap aus A-01) müsste 2–4× erfolgen. → `ModalShell`-Komponente + generische `findBySlug`/Metadata-Helper (~80 Zeilen weniger). *Aufwand: M.*

### A-05 🟡 Galerie-Logik dreifach dupliziert

Identischer Such-/Sortier-`useMemo` in `projects.tsx`, `references.tsx`, `certificates.tsx`; „Keine Treffer."-Empty-State 4×; Grid-Template 3×. → Hook `useGallery<T>` + `GalleryGrid`/`EmptyState`. *Aufwand: M.*

### A-06 🟡 Funktionslose Fake-Bedienelemente in der DatabaseToolbar

„Expand"-Button ohne `onClick`, Filter-Popover mit Dummy-Einträgen („Filter by..."), „Add sort"/„Delete sort" schließen nur das Popover. Für AT-Nutzer erreichbare, angekündigte Elemente ohne Wirkung; auch für Maus-Nutzer irreführend — die Seite ist ein Aushängeschild. Zusätzlich fehlen `aria-expanded`/`aria-haspopup` und ESC-Handling; das Suchfeld hat kein `aria-label`. **Empfehlung:** Fake-Elemente entfernen oder funktional machen. *Aufwand: M.*

### A-07 🟡 Kompletter Seiteninhalt ist Client-Bundle

Alle Galerien sind `"use client"` und importieren die **vollständigen** Datenarrays — der gesamte Content (inkl. aller Projekt-Volltexte und Referenz-Zitate) wird zusätzlich zum Server-HTML ein zweites Mal als JS ausgeliefert. Modal-only-Felder (`aufgaben`/`ergebnis`/`meta`) stecken unnötig im Galerie-Bundle. Kein Muss bei dieser Seitengröße, aber die Doku empfiehlt Client-Komponenten nur für interaktive Blätter. *Aufwand: L (optional).*

### A-08 🟡 Invertierte Überschriften-Hierarchie

Der Name ist ein `h2` (CoverBanner), während fünf Untersektionen je ein eigenes `h1` bekommen; Sidebar-`h2` erscheinen vor dem ersten `h1`. Irreführend für Screenreader-Navigation, suboptimal für SEO. → Name als einziges `h1`, Sektionen `h2`/`h3` (visuelle Größen bleiben über Klassen unverändert). *Aufwand: S.*

### A-09 🟡 Table of Contents nur per Maus-Hover erreichbar

`toc.tsx:38-42`: Öffnen nur via `onMouseEnter`; im geschlossenen Zustand ist die Nav `invisible` → Buttons nicht fokussierbar, **kein Tastaturzugang**. Zudem englisches `aria-label` („Table of contents") auf einer `lang="de"`-Seite. → `onFocus`/`:focus-within` bzw. echter Toggle-Button mit `aria-expanded`. *Aufwand: S.*

### A-10 🟡 Cookie-Toggles ohne zugänglichen Namen

Die Schalter im „Cookies anpassen"-Panel haben `aria-pressed`, aber kein Label — Screenreader sagen nur „Schalter gedrückt/nicht gedrückt", ohne die Kategorie zu nennen. → `aria-label={row.title}` bzw. `role="switch"` + `aria-labelledby`. *Aufwand: S (im Zuge des Banner-Umbaus).*

### A-11 – A-17 🔵 Weitere Punkte

| ID | Befund | Fix |
|---|---|---|
| A-11 | Englische aria-labels/UI-Texte („Close search", „Filter by...", „Add sort") auf deutscher Seite | Eindeutschen |
| A-12 | CV-Dropdown deklariert `role="menu"` ohne das ARIA-Menü-Tastatur-Pattern (keine Pfeiltasten) | Menu-Rollen entfernen — Disclosure mit `aria-expanded` genügt |
| A-13 | 75 hartkodierte Hex-/rgba-Werte in 10+ Dateien trotz vorhandener CSS-Tokens | Palette in `@theme` (Tailwind v4) zentralisieren |
| A-14 | ESLint/TS-Minimalkonfiguration (kein typescript-eslint strict, kein jsx-a11y, kein `noUncheckedIndexedAccess`) | Jetzt nachschärfen — tsc läuft aktuell sauber, günstigster Zeitpunkt |
| A-15 | Toter Export `referenceHref` (dokumentiert, nirgends genutzt; URLs werden inline gebaut) | Konsequent nutzen oder löschen |
| A-16 | Zitat-Preview öffnet mit „ und schließt mit geradem `"` statt " | Typografie korrigieren |
| A-17 | Interception-Routen rendern bei unbekanntem Slug einfach nichts (URL ändert sich, kein Modal, kein 404) | `notFound()` aufrufen — oder N-04-Refactoring |

### A-18 ✅ Positivbefund

`pnpm lint` (0 Fehler, 4 no-img-Warnungen) und `tsc --noEmit` laufen fehlerfrei; die Grundarchitektur (Routing, Datenhaltung, Komponentenschnitt) ist für die Projektgröße angemessen.

---

## 7. Content, Assets & Repo-Hygiene

| ID | Schwere | Befund | Empfehlung |
|---|---|---|---|
| C-01 | 🔵 | **19 ungenutzte Template-Assets (~700 KB)** in `public/assets/` werden mit deployed, darunter „LinkedIn Banner-selection.png" (406 KB, Leerzeichen im Dateinamen), `cover.jpg` (109 KB — der sichtbare Cover ist CSS), 7 `skill-*.png`, `proj-*.jpg` | Alle löschen; Konvention: kleingeschriebene, bindestrich-getrennte Dateinamen |
| C-02 | 🟡 | **freelancermap- und Malt-Links zeigen auf die Portal-Startseiten** statt aufs Profil (`lib/data.ts:57-58`) — Interessenten landen im Nichts. Die korrekte Malt-Profil-URL existiert bereits in `references.json` | Echte Profil-URLs eintragen oder Links entfernen |
| C-03 | 🔵 | `verifyUrl` des Angular-Zertifikats wird nie gerendert (Render-Logik nutzt nur `externalUrl`) | Als zweiten Link rendern oder Feld entfernen |
| C-04 | 🔵 | Referenz-Zitate widersprechen Projektangaben: XU-Zeitraum „05/2020–02/2023" vs. Zitat „from July 2021 to February 2023"; Zitat nennt Firma „deroso" | Zeiträume einordnen; `relation`/`company` präzisieren (Originalzitate nicht verändern) |
| C-05 | 🔵 | Statisch „04/2025 – heute · **15 Monate**" veraltet monatlich (seit Juli 2026: 16) | Monatszahl weglassen oder aus `sort` berechnen |
| C-06 | 🔵 | Runtime-Deps mit Patch-Drift (react 19.2.4→19.2.8 exakt gepinnt), Dev-Tooling mit Major-Rückstand | Mit dem Next-Update bündeln; Dev-Tooling separat bewusst anheben |
| C-07 | 🔵 | README veraltet: beschreibt nicht existierenden zweiten CV-Button, Struktur-Abschnitt ohne `references.tsx`, `certificates.tsx`, Slug-Routen etc. | README aktualisieren; „hero"-Variante von `CvDownload` einbauen (Conversion-Element!) oder als toten Code entfernen |
| C-08 | ⚪ | Sprachmix: „Munich" im Cover vs. „München" in den Eckdaten | Vereinheitlichen |
| C-09 | ⚪ | Sektion „Eckdaten" hat eine Anker-ID, fehlt aber im TOC — ausgerechnet Stundensatz/Verfügbarkeit | `{ id: "eckdaten", … }` in `sections` ergänzen |
| C-10 | ⚪ | Projekt-Meta „Website"/„Code" (z. B. `github.com/nikita-petrich/accounting-os`) ist reiner Text, nicht klickbar | Als Links rendern; Existenz des GitHub-Repos verifizieren |
| C-11 | ✅ | **Keine Broken References:** alle 22 im Code referenzierten `public/`-Dateien existieren (inkl. `assets/flags/`, aller Zertifikats- und CV-PDFs) | Optional als CI-Test absichern |
| C-12 | ✅ | `.gitignore` vollständig; keine Build-Artefakte/`.env` im Index; keine LICENSE (bei `private: true` Portfolio vertretbar) | Beibehalten |

---

## 8. Konsolidierte Prioritätenliste

**P0 — vor bzw. unmittelbar mit Produktivgang (Rechtsrisiko):**
R-01 Impressum · R-02 Datenschutzerklärung · R-03 Cookie-Banner (entfernen oder echt machen) · R-04 Referenz-Einwilligungen einholen

**P1 — kurzfristig (Security & Akquise-Wirkung):**
S-01 Next-Update 16.2.11 · S-02 pnpm-Overrides · S-03 CI + Dependabot · N-01 Metadata/OG/Sitemap · A-01 Modal-Fokus · A-02 Kontraste · N-02 Fehlerseiten · C-02 Profil-Links

**P2 — mittelfristig (Qualität & Performance):**
N-03 Bildoptimierung · S-04/S-05 Security-Header + poweredByHeader · A-03 Datenvalidierung · A-04/A-05 Deduplizierung · A-06 Fake-Toolbar · A-08/A-09/A-10 A11y · C-01 Asset-Bereinigung

**P3 — laufend/optional:**
A-07 Client/Server-Split · N-04 Intercepting-Route-Prerendering · A-11–A-17 · C-03–C-10 · Tracking Stufe 2

Der konkrete, schrittweise Abarbeitungsplan inkl. Tracking-Einführung und ai-blueprint-Prozess steht in [`IMPLEMENTATION-PLAN.md`](./IMPLEMENTATION-PLAN.md).
