# Umsetzungsplan: Rechtssicherer Produktivbetrieb + detailliertes Nutzer-Tracking

**Grundlage:** [`AUDIT-REPORT.md`](./AUDIT-REPORT.md) (Findings R-/S-/N-/A-/C-…) und [`TRACKING-KONZEPT.md`](./TRACKING-KONZEPT.md) (vollständiges Tracking-Design).
**Arbeitsprozess:** strukturiert über [bradtraversy/ai-blueprint](https://github.com/bradtraversy/ai-blueprint) — siehe Abschnitt „Arbeitsprozess mit ai-blueprint" unten.

---

## 0. Zielbild und Leitplanken

1. **Rechtssicherheit vor Features.** Impressum + Datenschutzerklärung sind Voraussetzung für den Produktivgang — und auch für jedes Tracking (die Datenschutzerklärung muss das Tracking beschreiben, *bevor* es live geht).
2. **„Möglichst alles sammeln" wird als Zwei-Stufen-Modell umgesetzt.** Maximal detailliertes Klick-Tracking ist erreichbar — aber legal nur so:
   - **Stufe 1 (alle Besucher, ohne Einwilligung):** cookielose, anonyme Messung *jedes* Klicks/Events — kein Speichern im Endgerät, keine Wiedererkennung über Besuche hinweg (§ 25 TDDDG greift nicht; Rechtsgrundlage Art. 6 Abs. 1 lit. f DSGVO). Damit gibt es **ohne einen einzigen Consent-Klick vollständige Klick-Statistiken.**
   - **Stufe 2 (nur nach Opt-in):** persistente Besucher-IDs, Cross-Visit-Journeys, Session-Replay. Realistisch willigt auf einer Portfolio-Seite nur ein Bruchteil ein — Stufe 2 ist Bonus, nicht Datengrundlage.
   - Ein „alles ohne Fragen sammeln" (persistente IDs/Fingerprinting ohne Consent) wäre in Deutschland klar rechtswidrig (§ 25 TDDDG, Art. 5/6 DSGVO) und wird nicht gebaut.
3. **Kleine, überprüfbare Schritte** — jede Phase endet mit grünem `pnpm lint && pnpm build` und einem Commit; die Rechts-Features blockieren als P1-Findings den Abschluss (ai-blueprint-Gate).

---

## Phase 1 — Rechtliche Basis (P0, ~1 Tag + Zuarbeit)

> Erledigt R-01, R-02, R-03 (Teil 1), R-04. **Ohne diese Phase kein Produktivgang.**

| # | Schritt | Dateien | Aufwand |
|---|---|---|---|
| 1.1 | **Footer-Komponente** mit Links „Impressum · Datenschutz · Cookie-Einstellungen" in `app/layout.tsx` einhängen (erscheint damit auf allen Routen inkl. `/projekte/*`, `/referenzen/*`) | `components/notion/footer.tsx`, `app/layout.tsx` | S |
| 1.2 | **Impressum-Seite** im Seiten-Design. Pflichtangaben (Freiberufler): Name, ladungsfähige Anschrift, E-Mail + Telefon, USt-IdNr. (falls vorhanden; bei § 19 UStG entfällt sie), VSBG-Hinweis. `robots`-Meta bleibt indexierbar | `app/impressum/page.tsx` | S |
| 1.3 | **Datenschutzerklärungs-Seite**: Verantwortlicher; Hosting/Server-Logs (Art. 6 lit. f, Speicherdauer, AVV-Hinweis auf Hoster); Kontaktaufnahme; **Terminbuchung via Notion** (calendar.notion.so, Drittlandtransfer, DPF-Status prüfen); **Referenzen/Testimonials** (Rechtsgrundlage, Widerruf); Betroffenenrechte Art. 15–21, 77; Hinweis „Fonts lokal gehostet, keine Verbindung zu Google" | `app/datenschutz/page.tsx` | M |
| 1.4 | **Cookie-Banner stilllegen** (Interimszustand bis Phase 2): Banner entfernen oder Text auf die Wahrheit reduzieren — keine Schein-Toggles. *Alternativ Phase 2 direkt anschließen und den Banner in einem Zug echt machen.* | `components/notion/cookie-banner.tsx`, `app/page.tsx` | S |
| 1.5 | **Einwilligungen der 6 Referenzgeber** einholen/bestätigen (E-Mail genügt) und **außerhalb des Repos** archivieren (Art. 7 Abs. 1). Entfernungsprozess festhalten: bei Widerruf Eintrag aus `lib/references.json` löschen → Route liefert 404; „never change/never remove"-Kommentar in `lib/data.ts` relativieren | organisatorisch + `lib/data.ts` | M (Zuarbeit) |
| 1.6 | **CV-PDFs prüfen**: enthaltene Referenz-Zitate/Kundennennungen müssen von 1.5 gedeckt sein | `public/cv/` | S (Zuarbeit) |

**Zuarbeit des Betreibers nötig:** Anschrift, USt-IdNr./Kleinunternehmer-Status, Hoster-Name (für AVV-Abschnitt), Referenzgeber-Kontakte.

---

## Phase 2 — Consent-Architektur + Tracking Stufe 1 (P0/P1, ~2–3 Tage)

> Setzt das [`TRACKING-KONZEPT.md`](./TRACKING-KONZEPT.md) um (dort: vollständige Begründung, Code-Skizzen, Event-Taxonomie). Erledigt R-03 (Teil 2), R-07, A-10.

**Tool-Entscheidung (Empfehlung aus dem Konzept):** **Selbst gehostetes Umami** (Docker + Postgres, z. B. auf Hetzner — passt zum vorhandenen Stack). Cookielos by default, Visitor-Hash mit täglich rotierendem Salt → einwilligungsfrei nutzbar, kein AVV, keine Drittlandsprüfung, keine Lizenzkosten, deklaratives Event-Tracking. Alternativen und Kriterien: Konzept, Abschnitt 2.

| # | Schritt | Kern |
|---|---|---|
| 2.1 | **Consent-Modul** `lib/analytics/consent.ts` | Versioniertes `ConsentState`-Objekt (statt `"all"/"none"/"customized"`-String), `readConsent()`/`writeConsent()` mit Schema-Validierung, CustomEvent `np:consent`. Speicherung selbst ist § 25 Abs. 2 Nr. 2 TDDDG-konform |
| 2.2 | **Banner-Umbau** `cookie-banner.tsx` | Echte Persistenz der Toggles; **korrigierter Text** („Diese Website misst die Nutzung cookielos und anonym. Optional: erweiterte Analyse — nur mit Ihrer Einwilligung."); „Ablehnen" bleibt gleichrangig; `aria-label` auf den Toggles (A-10); Footer-Link „Cookie-Einstellungen" öffnet den Banner erneut mit vorbefüllten Werten (Widerruf, Art. 7 Abs. 3) |
| 2.3 | **Umami aufsetzen** | Docker-Container + Postgres auf EU-Server; Website-ID als `NEXT_PUBLIC_UMAMI_ID` |
| 2.4 | **First-Party-Proxy** `app/api/a/[...path]/route.ts` | Script + Collect-Endpoint unter eigener Domain; **bewusst keine IP-Weitergabe** (kein X-Forwarded-For) → Umami sieht nie Client-IPs. Next-16-Konvention: `RouteContext`-Helper, awaited `params` |
| 2.5 | **AnalyticsProvider** in `app/layout.tsx` | Kleine Client-Insel; Umami-`<Script>` lädt immer (Stufe 1, einwilligungsfrei); Stufe-2-Script wird erst **gerendert**, wenn `analytics: true` (next/script-Semantik: Strategie steuert *wann*, Rendern steuert *ob*) |
| 2.6 | **`track()`-Utility + Instrumentierung** | Zentrale `lib/analytics/track.ts`; **deklarativ** per `data-analytics-event`/`data-analytics-prop-*`-Attributen + globalem delegiertem Click-Listener (Server-Komponenten bleiben Server-Komponenten; `grep data-analytics-event` = komplette Instrumentierungs-Landkarte). Explizite Hooks nur für Suche (debounced), Scroll-Tiefe, Engagement-Zeit (`sendBeacon` bei `pagehide`), Web Vitals (`useReportWebVitals`) |
| 2.7 | **Datenschutzerklärung erweitern** | Abschnitt Stufe-1-Messung (Art. 6 lit. f, keine Cookies, Widerspruchsrecht) — **vor** Aktivierung des Trackings deployen |

**Event-Taxonomie (Auszug — vollständige Tabelle mit Code-Ankern im Konzept, Abschnitt 3):**

| Event | Trigger | Properties |
|---|---|---|
| `cv_download` | CV-Menü-Eintrag | `cv_lang: de/en`, `placement: topbar/hero` |
| `booking_click` | „Erstgespräch buchen" | `placement: topbar/intro_callout` |
| `project_open` / `reference_open` / `certificate_open` | Karten | `slug`, `source` |
| `skills_search` / `gallery_search` | Suchfelder (debounced) | `query_length`, `result_count`, `matched_categories` — **nie der Roh-Query** (PII-Risiko, Quasi-Identifikator) |
| `toc_navigate`, `outbound_click`, `scroll_depth`, `engagement_time`, `web_vitals`, `consent_decision` | s. Konzept | gebucketed, ohne Personenbezug |

**Datenminimierung (verbindlich):** keine IP-Speicherung (Proxy streift sie ab), Referrer nur als Domain, Zeit-/Vitals-Werte gebucketed, Property-Allowlist in `track()`, Speicherfristen laut Konzept (Roh-Events 14 Monate, Access-Logs 7 Tage, Consent-Logs 3 Jahre).

---

## Phase 3 — Security-Härtung & Betriebsreife (P1, ~1 Tag)

> Erledigt S-01…S-05, N-02.

| # | Schritt | Detail |
|---|---|---|
| 3.1 | **Next-Update** | `pnpm up next@16.2.11 eslint-config-next@16.2.11` → 9 CVEs geschlossen; danach `pnpm build` + Smoke-Test. React/lucide-react-Patch-Drift gleich mitnehmen |
| 3.2 | **pnpm-Overrides** in `pnpm-workspace.yaml` | `postcss: '>=8.5.12'`, `sharp: '>=0.35.0'` (werden von 16.2.11 **nicht** mitgefixt); `pnpm audit` muss danach leer sein; Build-Regression prüfen (next pinnt postcss bewusst exakt) |
| 3.3 | **CI + Dependabot** | `.github/workflows/ci.yml` (`pnpm install --frozen-lockfile && pnpm lint && pnpm build`) + `.github/dependabot.yml` (npm, weekly, gruppierte Minor/Patch). *Wichtigste strukturelle Maßnahme des Audits* |
| 3.4 | **Security-Header** in `next.config.ts` via `headers()` | CSP nach dem „Without Nonces"-Muster der Next-16-Doku (statische Seite → **kein** Nonce-Setup, das würde dynamisches Rendering erzwingen): `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests` + `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, restriktive `Permissions-Policy`. Nach Phase 2 die CSP um die Umami-Proxy-Pfade ergänzen (bleibt 'self' — Vorteil des First-Party-Proxys). HSTS: setzt Vercel automatisch; bei Self-Hosting im Reverse Proxy |
| 3.5 | **`poweredByHeader: false`** | eine Zeile `next.config.ts` |
| 3.6 | **Fehlerseiten** | `app/not-found.tsx` (deutsch, Seitendesign, Link zur Startseite), `app/error.tsx` (`unstable_retry`), `app/global-error.tsx` (eigene `<html>/<body>`) |

---

## Phase 4 — SEO & Akquise-Wirkung (P1, ~1 Tag)

> Erledigt N-01, C-02, Teile von C-07.

1. `metadataBase` + `openGraph`/`twitter`-Blöcke in `app/layout.tsx`; `title.template` für die Slug-Seiten.
2. `app/opengraph-image.tsx` per `ImageResponse` (1200×630, analog `icon.tsx`/CoverBanner-Design) → Link-Previews auf LinkedIn & Co. mit Bild.
3. `app/sitemap.ts` + `app/robots.ts`, generiert aus `projects`/`references` in `lib/data.ts` (kann nie divergieren).
4. JSON-LD `Person`/`ProfessionalService`-Schema (Guide `json-ld.md`).
5. **Profil-Links reparieren** (C-02): echte Malt-Profil-URL (liegt schon in `references.json`), echte freelancermap-Profil-URL eintragen — aktuell landen Interessenten auf den Portal-Startseiten.
6. Optional: den im README versprochenen zweiten CV-Button („hero"-Variante existiert als toter Code) neben dem Intro-Callout einbauen — Conversion-Element.

---

## Phase 5 — Performance & Barrierefreiheit (P2, ~2 Tage)

> Erledigt N-03, A-01, A-02, A-04, A-05, A-06, A-08, A-09, A-17.

1. **Bilder:** `images.unoptimized` entfernen, alle 6 `<img>`-Stellen auf `next/image` mit statischen Imports + `sizes` (Cover werden dann automatisch als AVIF/WebP in Kartengröße ausgeliefert; ~70–80 % Ersparnis auf ~944 KB Cover-Last).
2. **ModalShell extrahieren** (A-04) und dabei Fokus-Management lösen (A-01): natives `<dialog>`/`showModal()` oder Radix Dialog → Fokus-Trap, initialer Fokus, Fokus-Rückgabe, ESC zentral. Interception-Routen dabei auf Server-Komponenten mit `generateStaticParams` umstellen (N-04) und `notFound()` bei unbekanntem Slug (A-17).
3. **Kontraste fixen** (A-02): Akzent für Text-auf-Weiß ~`#b5651d`, `--notion-text-gray` anheben; Farbpaare als Token-Paare in `globals.css`/`@theme` (löst A-13 gleich mit).
4. **Galerie-Hook** `useGallery<T>` + `GalleryGrid`/`EmptyState` (A-05).
5. **Fake-Toolbar bereinigen** (A-06): Expand/Add sort/Delete sort entfernen, Filter-Popover real an die Suche koppeln oder streichen; `aria-expanded`/`aria-haspopup`/ESC ergänzen.
6. **Überschriften-Hierarchie** (A-08): Name = einziges `h1`; TOC per Tastatur öffenbar (A-09); deutsche aria-labels (A-11); CV-Dropdown ohne `role="menu"` (A-12).

---

## Phase 6 — Hygiene & Feinschliff (P3, ~½ Tag, parallelisierbar)

- 19 ungenutzte Assets löschen (~700 KB, inkl. „LinkedIn Banner-selection.png"); optional CI-Check public↔Code-Referenzen (C-01, C-11).
- `references.json`-Import mit Zod validieren oder nach `.ts` mit `satisfies` (A-03); `projectSlug`-Build-Assertion.
- ESLint/TS nachschärfen: typescript-eslint strict, jsx-a11y, `noUncheckedIndexedAccess`, `typecheck`-Script (A-14).
- Kleinkram: toter Export `referenceHref`, Anführungszeichen, „Munich"→„München", „Eckdaten" ins TOC, `verifyUrl` rendern, Projekt-Meta verlinken, „15 Monate" dynamisch, README aktualisieren (A-15–A-16, C-03–C-10).

## Phase 7 — Optional: Tracking Stufe 2 (nur bei echtem Bedarf)

PostHog EU-Cloud (Frankfurt) **ausschließlich nach Opt-in** gerendert; In-Memory-Event-Queue (nie localStorage vor Consent!); Consent-Logging-Endpoint `app/api/consent/route.ts` (UUID-Beleg ohne IP/UA, 3 Jahre); Widerruf löscht `ph_*`-Keys + reload; AVV mit PostHog, Drittland-Hinweis in der Datenschutzerklärung. **Empfehlung aus dem Konzept:** erst nach 4 Wochen Stufe-1-Daten entscheiden, ob sich das lohnt — Stufe 1 liefert für eine Portfolio-Seite fast den gesamten Erkenntnisgewinn.

---

## Arbeitsprozess mit ai-blueprint

[ai-blueprint](https://github.com/bradtraversy/ai-blueprint) (Brad Traversy; „A repeatable process for coding with AI while being the architect of your project") ist kein npm-Laufzeitpaket, sondern ein Satz Markdown-Skills/-Templates, der einen review-getriebenen KI-Arbeitsprozess erzwingt — als Gegenentwurf zum „Vibe Coding". Die vier Grundprinzipien: **Spezifikation vor Implementierung** (Spec stoppt zur Freigabe), **kleine reviewte Diffs**, **dateibasierter Zustand** (überlebt jeden Context-Reset; `/status` ersetzt verlorene Chat-Historie) und ein **Findings-Ledger mit Autorität** (P0/P1-Findings blockieren jeden Merge, bis sie re-reviewt oder bewusst akzeptiert sind).

### Warum es hier passt

- Das **Findings-Ledger + P0/P1-Gate** macht aus diesem Audit-Report einen maschinell trackbaren Zustand mit *erzwungener* Abarbeitung — statt einer To-do-Liste, die versandet. Als P1 eingetragen, blockieren Impressum/Datenschutz jeden Feature-Merge, bis sie behoben **und per Re-Audit geschlossen** sind. Genau das ist hier gewollt.
- Der **dateibasierte Zustand** passt zu über Tage verteilten Claude-Code-Sessions.
- Die Phasen dieses Plans sind sauber feature-große Outcomes im Sinne des `build-plan`-Templates.

### Installation in dieses Repo

Konfliktpunkt: `CLAUDE.md` (enthält nur `@AGENTS.md`) und `AGENTS.md` (enthält den **kritischen Next-16-Hinweis** „This is NOT the Next.js you know") existieren bereits. Strategie: Blueprint-Versionen übernehmen, den Hinweis danach wieder verankern.

```bash
git checkout -b chore/ai-blueprint
cp AGENTS.md AGENTS.local.bak.md && cp CLAUDE.md CLAUDE.local.bak.md   # 1. sichern
npx create-ai-blueprint@latest --claude                                # 2. installieren (Claude-Adapter)
# Überschreiben von AGENTS.md/CLAUDE.md bestätigen; non-interaktiv: --force NUR nach Backup
```

3. **Next-16-Hinweis re-integrieren** — an zwei Stellen: als eigener Abschnitt oben in der neuen `AGENTS.md` **und** in `blueprint/context/coding-standards.md` (wird von der neuen `CLAUDE.md` per `@`-Import in jede Session geladen). Backups löschen, alles committen (empfohlen: Blueprint-Dateien committen, damit Findings-Historie im Repo nachvollziehbar bleibt).

4. **Onboarding für Bestandsprojekt:**

```
/onboard   # Stack-Erkennung (pnpm lint, pnpm build; kein Test-Runner)
/adopt     # Brownfield-Bootstrap: erfasst das fertige Portfolio als "shipped", statt es bauen zu wollen
/doctor    # Read-only-Konsistenzcheck
/overview  # generiert blueprint/context/project-overview.md aus den Plänen
```

### Die Audit-Ergebnisse im Blueprint abbilden

**`blueprint/build-plan.md`** — die Phasen dieses Plans als nummerierte Features (abgeschlossene Items werden nie umnummeriert):

```markdown
## MVP (Bestand, via /adopt erfasst)
- [x] 1. **Notion-Resume-Seite** - Layout, Projekte, Skills-Datenbank, CV-Download DE/EN

## Rechtliches & Tracking
- [ ] 2. **Impressum** - statische Route /impressum + Footer, Pflichtangaben Freiberufler
- [ ] 3. **Datenschutzerklärung** - Route /datenschutz, verlinkt aus Footer und Cookie-Banner
- [ ] 4. **Consent-Gate + Tracking Stufe 1** - echter Consent-State, Umami self-hosted, track()-Utility
- [ ] 5. **Security-Härtung** - Next 16.2.11, Overrides, CI/Dependabot, Header, Fehlerseiten
- [ ] 6. **SEO/OG** - metadataBase, opengraph-image, sitemap, robots, Profil-Links
- [ ] 7. **A11y & Performance** - ModalShell+Fokus, Kontraste, next/image
```

**`blueprint/context/findings.md`** — die P0/P1-Findings aus dem Report im dokumentierten Ledger-Format (`### F-NN [Severity] status - Titel`; Severities: P0 = Datenverlust/Security, P1 = wahrscheinlicher Bug/hohes Risiko, P2 = Wartbarkeit, P3 = Cleanup; Status: `unverified/open/fixed/closed/accepted/invalid`). Entweder trägt `/audit full` sie selbst ein (diesen Report als Input referenzieren) oder von Hand:

```markdown
### F-01 [P1] open - Fehlendes Impressum (R-01)
- Fundort: app/ (keine Route /impressum), kein Footer
- Vorschlag: Feature 2 im build-plan

### F-02 [P1] open - Fehlende Datenschutzerklärung (R-02)
### F-03 [P1] open - Cookie-Banner irreführend & funktionslos (R-03)
### F-04 [P1] open - next@16.2.10 mit 9 bekannten CVEs (S-01)
### F-05 [P2] open - Modal ohne Fokus-Management (A-01)
…
```

Wichtig am Gate: Ein per `/implement` gefixtes P0/P1-Finding bleibt blockierend (`fixed`), bis ein erneuter `/audit`-Pass es auf `closed` setzt — kein stilles Versanden.

**Der Zyklus pro Feature:**

```
/feature        → Spec für das nächste offene Item (stoppt zur Freigabe)
/implement      → baut in kleinen, genehmigten Schritten
/check          → beweist die Erfolgskriterien
/audit current  → Re-Review, setzt zugehörige Findings fixed → closed
/complete       → archiviert, committet, merged (blockiert bei offenen P0/P1)
```

Dazwischen: `/fix "…"` für Ungeplantes, `/status` nach Context-Resets.

### Grenzen (ehrliche Einordnung)

Für ein statisches Portfolio mit einem Entwickler ist der volle Zeremonienumfang spürbarer Overhead — der Loop amortisiert sich, wenn Features nicht in einer Session fertig werden. Empfehlung: **Ledger + build-plan als verbindliches Gerüst nutzen** (das Gate erzwingt die Rechts-Themen), den Loop pragmatisch fahren, und auf `/tests` (nur für die Consent-Logik sinnvoll), `/release` und `/autopilot` vorerst verzichten. Bei jeder Planänderung `/overview` neu laufen lassen (prüft `/doctor`).

---

## Reihenfolge & Aufwand (Gesamtübersicht)

| Phase | Inhalt | Aufwand | Abhängigkeit |
|---|---|---|---|
| 1 | Impressum, Datenschutz, Banner-Interim, Referenz-Einwilligungen | ~1 Tag + Zuarbeit | — (**vor Produktivgang**) |
| 2 | Consent-Gate, Umami, track(), Instrumentierung | ~2–3 Tage | Phase 1 (Datenschutzerklärung zuerst) |
| 3 | Next-Update, Overrides, CI/Dependabot, Header, Fehlerseiten | ~1 Tag | — (parallel zu 1 möglich) |
| 4 | Metadata/OG/Sitemap, Profil-Links | ~1 Tag | — |
| 5 | Bilder, ModalShell+Fokus, Kontraste, Dedup, Toolbar | ~2 Tage | sinnvoll nach 3 |
| 6 | Assets, Validierung, Lint-Regeln, Kleinkram | ~½ Tag | — |
| 7 | (Optional) PostHog Stufe 2 + Consent-Logging | ~1 Tag | Phase 2 + 4 Wochen Datenlage |

**Gesamt: ~7–9 Arbeitstage** für Phasen 1–6; danach läuft die Seite rechtssicher, gehärtet, barriereärmer, SEO-wirksam — und liefert ab Phase 2 vollständige Klick-Statistiken über jeden Button, DSGVO-konform und ganz überwiegend ohne Consent-Hürde.
