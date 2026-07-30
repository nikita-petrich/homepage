# Tracking- und Analytics-Konzept für die Portfolio-Website von Nikita Petrich

**Designdokument · Stand: 2026-07-24 · Rechtsrahmen: DSGVO, TDDDG (§ 25), DDG**

---

## 0. Ausgangslage im Code (Ist-Analyse)

Die Website ist eine statische Next.js-16-App-Router-Seite ohne Backend, ohne API-Routen und ohne eingebundenes Analytics-Tool. Relevante Befunde:

- **Kein Tracking vorhanden.** `app/layout.tsx` rendert nur `{children}` und `{modal}` — kein `next/script`, kein `instrumentation-client.ts`, kein Analytics-Import (app/layout.tsx:24–31).
- **Der Cookie-Banner ist derzeit reine Dekoration.** Er behauptet `"Diese Website verwendet Cookies, um die Nutzung zu analysieren"` (components/notion/cookie-banner.tsx:58–59), obwohl kein einziges Cookie gesetzt und nichts analysiert wird. Das ist nicht nur nutzlos, sondern irreführend — der Text muss an das tatsächliche Verhalten angepasst werden.
- **Die Präferenzen werden nicht gespeichert.** Beim „Anpassen“-Dialog wird nur der String `"customized"` persistiert, die eigentlichen Toggles (`functional`/`analytics`/`marketing`) gehen verloren: `localStorage.setItem(STORAGE_KEY, value)` mit `value = "all" | "none" | "customized"` (cookie-banner.tsx:36, aufgerufen via `onDone={() => dismiss("customized")}`, cookie-banner.tsx:52). Ein Consent-Gate kann darauf nicht aufbauen.
- **Kein Widerrufsweg.** Nach der ersten Entscheidung erscheint der Banner nie wieder (`shouldShow = !localStorage.getItem(STORAGE_KEY)`, cookie-banner.tsx:24); es gibt keinen Link „Cookie-Einstellungen“ im Footer.
- **Interaktive Elemente, die getrackt werden sollen, existieren bereits klar identifizierbar im Code** (CV-Dropdown, Booking-CTA, Projekt-/Referenz-Karten, Suchfelder, TOC, Outbound-Links) — Details in Abschnitt 3.

**Positiv:** „Ablehnen“ ist gleichrangig neben „Alle akzeptieren“ platziert (cookie-banner.tsx:61–74) — das entspricht der DSK-Linie zur Gestaltung von Einwilligungsbannern und bleibt erhalten.

---

## 1. Rechtlicher Rahmen: das Zwei-Stufen-Modell

Der Wunsch des Betreibers ist „maximal detailliertes Tracking, jeder Button-Klick“. Das ist erreichbar — aber nur, wenn man sauber zwei Stufen trennt:

**Stufe 1 — einwilligungsfrei (Standard für alle Besucher):**
§ 25 Abs. 1 TDDDG verlangt eine Einwilligung nur für das **Speichern von oder Zugreifen auf Informationen im Endgerät**, das nicht unbedingt erforderlich ist (Cookies, localStorage-IDs, Fingerprinting). Eine Messung, die **nichts im Endgerät speichert und nicht ausliest**, fällt nicht unter § 25. Die anschließende Datenverarbeitung (IP-Adresse im Request, User-Agent) ist an der DSGVO zu messen und kann bei **cookieloser, aggregierter Reichweiten- und Interaktionsmessung ohne Wiedererkennung über Besuche hinweg** auf Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse) gestützt werden — so auch die Orientierungshilfe der DSK für Telemedienanbieter. Wichtig: *Jeder Button-Klick als anonymes Zähl-Event* ist in dieser Stufe zulässig. Was nicht geht: den Klicker über Besuche hinweg wiedererkennen.

**Stufe 2 — nur mit Einwilligung (Art. 6 Abs. 1 lit. a DSGVO + § 25 Abs. 1 TDDDG):**
Alles, was ein Endgerät markiert oder Profile bildet — persistente Besucher-IDs (Cookie/localStorage), Cross-Visit-Journeys („kam am Montag über LinkedIn, lud am Mittwoch den CV“), Session-Replay/Heatmaps mit Bewegungsdaten, Marketing-/Kampagnen-Attribution mit Wiedererkennung. Einwilligung muss aktiv, informiert, granular und **so leicht widerrufbar wie erteilbar** sein (Art. 7 Abs. 3 DSGVO).

Alle Events aus der Taxonomie (Abschnitt 3) laufen in **beiden** Stufen — Stufe 2 fügt lediglich die Personen-/Geräteverknüpfung hinzu. Damit bekommt der Betreiber ohne einen einzigen Consent-Klick bereits vollständige Klick-Statistiken.

---

## 2. Tool-Vergleich und Empfehlung

| Kriterium | **Umami** (self-hosted) | **Matomo** (self-hosted) | **Plausible** (EU-Cloud / CE self-hosted) | **PostHog** (EU-Cloud) | **Eigenbau** (Route Handler + SQLite/Postgres) |
|---|---|---|---|---|---|
| **Einwilligungsfrei nutzbar (§ 25 TDDDG)?** | **Ja** — cookielos by default, kein Storage im Endgerät; Besucher-Hash serverseitig mit täglich rotierendem Salt (keine Cross-Visit-Wiedererkennung) | **Ja, konfigurierbar** — Cookieless-Modus muss aktiv eingestellt werden; volle Features (Heatmaps, Session Recording) nur mit Consent | **Ja** — cookielos by design, täglich rotierender Hash | **Nur eingeschränkt** — Standard nutzt persistente IDs (localStorage/Cookie) → einwilligungspflichtig; „memory persistence“-Modus möglich, Autocapture/Replay klar consent-pflichtig | **Ja** — volle Kontrolle, man speichert schlicht nichts im Endgerät |
| **Hosting-Aufwand** | Gering: 1 Docker-Container + Postgres, ~256 MB RAM | Mittel–hoch: PHP + MySQL, Updates, Plugin-Pflege | Cloud: null. CE self-hosted: hoch (ClickHouse + Postgres, RAM-hungrig) | Null (Cloud, Region Frankfurt) | Kein Fremdsystem, aber Eigenentwicklung + eigene DB-Pflege |
| **Kosten** | Server ~5 €/Monat (z. B. Hetzner — passt zum vorhandenen Stack, vgl. lib/data.ts:178 „Hetzner“) | Server ~10 €/Monat; Heatmaps/Replay = kostenpflichtige Plugins | Cloud ab ~9 €/Monat; CE gratis + Serverkosten | Free Tier großzügig, danach nutzungsbasiert | Nur Serverkosten, aber Entwicklungszeit |
| **Event-Tracking** | Gut: Custom Events + Properties, deklarativ via `data-umami-event`-Attribute oder `umami.track()` | Sehr gut: Events, Dimensionen, Funnels, E-Commerce | Gut: Custom Events + Props, einfache Funnels/Goals | Exzellent: Autocapture, Funnels, Retention, Session Replay, Feature Flags | Beliebig — aber alles selbst bauen |
| **Auswertungs-UI** | Modern, schlank, ausreichend für eine Portfolio-Seite | Mächtig, aber altbacken/komplex | Sehr schlank, bewusst reduziert | Sehr mächtig (Produkt-Analytics-Niveau) | Muss komplett selbst gebaut werden |
| **DSGVO-Randnotizen** | Kein AVV nötig (eigener Server, EU) | Kein AVV nötig | Cloud: AVV mit Plausible OÜ (EU-Firma, Hosting Hetzner DE) | AVV nötig; US-Mutterkonzern trotz EU-Datenhaltung → Drittlandsthematik im Transfer Impact Assessment erwähnen | Keine Drittbeteiligung — maximale Datensouveränität |

**Empfehlung für diesen Fall (Freiberufler, kleine statische Seite, EU, Wunsch nach Klick-Detailtiefe):**

1. **Primär: selbst gehostetes Umami als Stufe-1-Werkzeug.** Es ist das beste Verhältnis aus „einwilligungsfrei alle Events zählen“ zu Betriebsaufwand. Der Betreiber hostet ohnehin auf EU-Infrastruktur (Hetzner taucht mehrfach im eigenen Tech-Stack auf), Docker-Betrieb ist Kernkompetenz. Kein AVV, keine Drittlandsprüfung, keine laufenden Lizenzkosten. Das deklarative `data-umami-event`-Attribut passt exakt zur gewünschten „jeder Button“-Instrumentierung.
2. **Optional als Stufe 2: PostHog EU-Cloud, ausschließlich nach Opt-in geladen** — wenn der Betreiber Session-Replay und Cross-Visit-Journeys wirklich sehen will. Realistische Erwartung: Auf einer Portfolio-Seite willigt nur ein Bruchteil ein; Stufe 2 ist Bonus, nicht Datengrundlage.
3. **Nicht empfohlen als Alleinlösung:** Matomo (Betriebsaufwand und UI-Komplexität stehen für eine Ein-Seiten-Site in keinem Verhältnis; wäre aber die richtige Wahl, wenn zwingend *ein* Tool beide Stufen abdecken soll), Plausible CE (ClickHouse-Overhead), reiner Eigenbau (Auswertungs-UI selbst zu bauen ist der teuerste Teil — als *Ergänzung* für Consent-Logging und First-Party-Proxy aber sinnvoll, siehe Abschnitt 5.5).

---

## 3. Event-Taxonomie

Abgeleitet aus den tatsächlich vorhandenen Komponenten. Namenskonvention: `snake_case`, Objekt_Verb-Ordnung. Alle Events sind in **Stufe 1 einwilligungsfrei**, solange sie ohne Geräte-/Personenkennung gesendet werden; die Spalte „Einwilligung“ bezieht sich auf das Event selbst, nicht auf eine zusätzliche ID-Verknüpfung (die ist *immer* Stufe 2).

| Event-Name | Trigger (Code-Anker) | Properties | Einwilligung nötig? |
|---|---|---|---|
| `page_view` | Initiales Laden / App-Router-Navigation | `path`, `referrer_domain` (nur Domain, ohne Query), `lang` | **Nein** (cookielos, aggregiert) |
| `cv_download` | Klick auf einen CV-Eintrag im Dropdown: `cvFiles.map((f) => (<a … href={f.href} download` (cv-download.tsx:76–79) | `cv_lang: "de" \| "en"` (aus `f.href`, data.ts:15–16), `placement: "topbar" \| "hero"` (Prop `variant`, cv-download.tsx:13; aktuell nur `variant="topbar"` in topbar.tsx:16 — `hero` ist vorbereitet) | **Nein** |
| `cv_menu_open` | Toggle des Dropdowns (`onClick={() => setOpen((v) => !v)}`, cv-download.tsx:43) | `placement` | **Nein** |
| `booking_click` | Klick auf `href={profile.booking}` → `calendar.notion.so` (topbar.tsx:17–19 „Erstgespräch buchen“ und page.tsx:112–118 Callout-Link) | `placement: "topbar" \| "intro_callout"` | **Nein** — *Hinweis:* Der Klick führt zu Notion (US-Anbieter); das ist ein Outbound-Link, kein eigenes Tracking. In die Datenschutzerklärung gehört ein Hinweis auf den externen Buchungsdienst. |
| `project_open` | Navigation auf Projekt-Karte: `href={/projekte/${p.slug}}` (projects.tsx:115) | `slug` (stabil, data.ts:127), `source: "gallery"` | **Nein** |
| `project_reference_click` | Referenz-Chip im Projekt-Modal (projects.tsx:294–306) | `project_slug`, `reference_slug` | **Nein** |
| `project_references_open` | „Alle N ansehen“ im Projekt-Modal: `href={/projekte/${project.slug}/referenzen}` (projects.tsx) | `slug` (Projekt-Slug), `source: "project_modal"` | **Nein** |
| `reference_open` | Karte `href={/referenzen/${r.slug}}` (references.tsx:91) | `slug`, `source: "gallery" \| "project_modal" \| "project_references"` | **Nein** |
| `reference_source_click` | `SourceTag` Outbound zu LinkedIn/Malt (references.tsx:41–47) | `source: "LinkedIn" \| "Malt"`, `reference_slug` | **Nein** |
| `certificate_open` | Karte `href={certHref(c)} target="_blank"` (certificates.tsx:112–117) | `slug`, `target: "pdf" \| "external"`, `issuer` | **Nein** |
| `skills_search` | Debounced (≥ 800 ms Pause) auf `onChange={(e) => setQuery(e.target.value)}` (galleries.tsx:36–37) | `query_length`, `result_count`, `matched_categories` (nur Werte aus der festen Liste `skills[].name`, data.ts:390–408) — **niemals der Roh-Query** | **Nein** (gerade *weil* kein Klartext) |
| `gallery_search` | Debounced auf die `DatabaseToolbar`-Suche in Projekten/Referenzen/Zertifikaten (`query={query} onQueryChange={setQuery}`, projects.tsx:96–97, references.tsx:269–270, certificates.tsx:96–97) | `gallery: "projects" \| "references" \| "certificates"`, `query_length`, `result_count` | **Nein** |
| `gallery_sort_toggle` | `onToggleSortDir` (z. B. projects.tsx:95) | `gallery`, `direction` | **Nein** |
| `toc_navigate` | TOC-Button `onClick={() => scrollTo(item.id)}` (toc.tsx:55) | `section_id` (aus `sections`, data.ts:577–587) | **Nein** |
| `outbound_click` | Klick auf `profileLinks`-Anker (page.tsx:91–101; Ziele data.ts:53–59: Website, LinkedIn, GitHub, freelancermap, Malt) sowie `companyUrl`-Links | `target_domain`, `link_label` | **Nein** |
| `scroll_depth` | IntersectionObserver/Scroll-Listener, Schwellen 25/50/75/100 % (je Schwelle einmal pro Pageview) | `depth: 25 \| 50 \| 75 \| 100` | **Nein** |
| `engagement_time` | Beim `visibilitychange`/`pagehide` via `navigator.sendBeacon` (Muster aus node_modules/next/dist/docs/01-app/02-guides/analytics.md, Abschnitt „Sending results to external systems“) | `seconds_bucket: "0-10" \| "10-30" \| "30-60" \| "60-180" \| "180+"` (gebuckelt, kein Exaktwert) | **Nein** |
| `web_vitals` | `useReportWebVitals` (analytics.md) | `metric_name` (LCP/CLS/INP/…), `value_bucket`, `path` | **Nein** |
| `consent_banner_shown` | Banner wird sichtbar (`setVisible(true)`, cookie-banner.tsx:30) | — | **Nein** (muss zwingend consent-frei messbar sein, sonst Henne-Ei) |
| `consent_decision` | `dismiss(value)` (cookie-banner.tsx:34) | `decision: "all" \| "none" \| "customized"`, `analytics: bool`, `marketing: bool`, `banner_version` | **Nein** (aggregierter Zähler; das *Consent-Log* selbst siehe 4.4) |
| `session_recording_start` | Nur PostHog, nach Opt-in | Session-ID (PostHog-intern) | **JA — Stufe 2** |
| `identify` / Cross-Visit-Profil | Nur PostHog, nach Opt-in | persistente `distinct_id` | **JA — Stufe 2** |

**Warum der Skill-Such-Query nicht im Klartext geloggt wird:** (1) Freitextfelder sind unkontrollierbare Datenquellen — Nutzer tippen oder pasten versehentlich Namen, E-Mail-Adressen, interne Projektbezeichnungen; damit würden potenziell personenbezogene Daten ohne Rechtsgrundlage und ohne Löschzuordnung gespeichert. (2) Seltene, individuelle Suchstrings wirken als Quasi-Identifikator und können in Kombination mit Zeitstempel/IP eine Wiedererkennung ermöglichen — das würde die Stufe-1-Argumentation („keine Wiedererkennung“) untergraben. (3) Der analytische Nutzen ist mit `query_length`, `result_count` und `matched_categories` (Allowlist aus dem festen Skill-Vokabular) fast vollständig erhalten: Man sieht, *wonach gesucht wird* (auf Kategorie-Ebene) und *ob etwas gefunden wird* — ohne Klartext-Risiko.

---

## 4. Consent-Architektur: vom Deko-Banner zum echten Gate

### 4.1 Consent-State als einzige Quelle der Wahrheit

Der heutige Zustand (`"all" | "none" | "customized"` als String) wird durch ein **versioniertes, strukturiertes Objekt** ersetzt:

```ts
// lib/analytics/consent.ts
export const CONSENT_VERSION = 1; // erhöhen bei jeder Änderung an Kategorien/Texten
const KEY = "np-consent-v1";

export type ConsentState = {
  version: number;
  timestamp: string;          // ISO, Zeitpunkt der Entscheidung
  functional: boolean;
  analytics: boolean;         // Stufe 2: persistente IDs, PostHog
  marketing: boolean;         // derzeit ungenutzt, Kategorie bleibt für später
};

export function readConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    // Alte Version ⇒ Einwilligung verfällt, Banner erneut zeigen
    return parsed.version === CONSENT_VERSION ? parsed : null;
  } catch {
    return null;
  }
}

export function writeConsent(c: Omit<ConsentState, "version" | "timestamp">) {
  const state: ConsentState = { ...c, version: CONSENT_VERSION, timestamp: new Date().toISOString() };
  localStorage.setItem(KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent<ConsentState>("np:consent", { detail: state }));
  return state;
}
```

Das Speichern *dieses* Objekts ist nach § 25 Abs. 2 Nr. 2 TDDDG einwilligungsfrei zulässig — es ist unbedingt erforderlich, um die Nutzerentscheidung selbst zu respektieren.

**Änderungen am Banner (cookie-banner.tsx):**
- `dismiss()` ruft `writeConsent()` mit dem echten `prefs`-Objekt auf („Alle akzeptieren“ ⇒ alles `true`, „Ablehnen“ ⇒ alles `false`, „Fertig“ ⇒ aktuelle Toggles). Der Bug, dass `prefs` verworfen wird (cookie-banner.tsx:52), ist damit behoben.
- Der Bannertext wird korrigiert, denn Stufe 1 setzt **keine Cookies**: *„Diese Website misst die Nutzung cookielos und anonym. Optional: erweiterte Analyse mit Wiedererkennung — nur mit Ihrer Einwilligung.“* Der heutige Text (cookie-banner.tsx:58–59) wäre nach dem Umbau schlicht falsch.
- Die Kategorie-Beschreibungen im `CustomizePanel` werden präzisiert: „Analyse“ ⇒ „Erweiterte Analyse mit Wiedererkennung über Besuche hinweg (PostHog, EU-Server). Die anonyme Basismessung läuft unabhängig davon.“

### 4.2 Script-Laden nach next/script-Semantik

Aus `scripts.md` folgt die Gating-Mechanik: Ein `<Script>` wird geladen, sobald die Komponente gerendert wird (Strategie steuert nur *wann im Lebenszyklus*, nicht *ob*). Consent-Gating heißt deshalb: **die `<Script>`-Komponente für Stufe 2 wird erst gerendert, wenn `analytics: true` im Consent-State steht.** `onLoad`-Handler funktionieren nur in Client-Komponenten (scripts.md, „Executing Additional Code“) — der Provider ist ohnehin `"use client"`.

```tsx
// components/analytics/analytics-provider.tsx
"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { readConsent, type ConsentState } from "@/lib/analytics/consent";
import { flushQueue } from "@/lib/analytics/track";

export function AnalyticsProvider() {
  const [consent, setConsent] = useState<ConsentState | null>(null);

  useEffect(() => {
    setConsent(readConsent());
    const onChange = (e: Event) =>
      setConsent((e as CustomEvent<ConsentState>).detail);
    window.addEventListener("np:consent", onChange);
    return () => window.removeEventListener("np:consent", onChange);
  }, []);

  return (
    <>
      {/* Stufe 1: cookieloses Umami — lädt IMMER, keine Einwilligung nötig.
          First-Party-Proxy /api/a (siehe 5.5), data-* wird von next/script
          ans finale <script>-Tag durchgereicht (scripts.md, „Additional Attributes“). */}
      <Script
        src="/api/a/script.js"
        data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID}
        data-host-url="/api/a"
        data-auto-track="false"
        strategy="afterInteractive"
      />

      {/* Stufe 2: PostHog EU — wird erst GERENDERT (und damit geladen),
          wenn die Einwilligung vorliegt. */}
      {consent?.analytics && (
        <Script
          id="posthog"
          strategy="afterInteractive"
          onLoad={() => flushQueue("analytics")}
        >
          {`/* posthog-js Snippet, api_host: 'https://eu.i.posthog.com',
               persistence: 'localStorage+cookie' — erst jetzt zulässig */`}
        </Script>
      )}
    </>
  );
}
```

Einhängung im Root-Layout — als eigene, minimale Client-Insel, damit `layout.tsx` Server Component bleibt (Muster aus analytics.md zum `WebVitals`-Wrapper):

```tsx
// app/layout.tsx (Ausschnitt)
import { AnalyticsProvider } from "@/components/analytics/analytics-provider";

export default function RootLayout({ children, modal }: …) {
  return (
    <html lang="de" className={`${inter.variable} antialiased`}>
      <body>
        {children}
        {modal}
        <AnalyticsProvider />
      </body>
    </html>
  );
}
```

Zusätzlich bietet Next 16 `instrumentation-client.ts` im Projekt-Root an, das *vor* dem restlichen Frontend-Code läuft (analytics.md, „Client Instrumentation“) — idealer Ort, um den Consent-State früh zu lesen und in `window.__npConsent` zu cachen, damit `track()` schon vor React-Hydration korrekt entscheidet.

### 4.3 Event-Queue vor der Entscheidung

- **Stufe-1-Events brauchen keine Queue** — sie sind einwilligungsfrei und feuern sofort (auch während der Banner noch offen ist). Genau dadurch ist auch `consent_banner_shown`/`consent_decision` messbar.
- **Stufe-2-Kontext** (z. B. „diese Events sollen später der PostHog-Session zugeordnet werden“): Events werden in einer **In-Memory-Ringpuffer-Queue** (max. ~50 Einträge) gehalten und bei Opt-in via `flushQueue()` nachgereicht. Bei „Ablehnen“ oder `pagehide` wird die Queue verworfen. **Wichtig:** Die Queue darf *nicht* in `localStorage`/`sessionStorage` persistiert werden — das wäre selbst ein Speichern im Endgerät vor Einwilligung und damit ein § 25-Verstoß durch die Hintertür.

### 4.4 Widerruf und Consent-Logging

- **Widerruf:** Footer-Link „Cookie-Einstellungen“ (neu anzulegen), der den Banner mit vorbefüllten Toggles erneut öffnet. Bei Widerruf von `analytics`: `writeConsent()` mit neuen Werten, anschließend PostHog-Cookies/localStorage-Keys (`ph_*`) löschen und `location.reload()` — denn ein bereits geladenes Script lässt sich zur Laufzeit nicht zuverlässig „entladen“. Widerruf ist damit genauso einfach wie die Erteilung (Art. 7 Abs. 3 DSGVO).
- **Consent-Logging (Nachweispflicht Art. 7 Abs. 1 DSGVO):** Ein schlanker Route Handler `app/api/consent/route.ts` (`POST`; Route Handlers werden bei `POST` nie gecacht, vgl. route-handlers.md „Caching“) schreibt einen Beleg in die Datenbank: `{ consent_id (zufällige UUID, wird zusammen mit dem Consent-State im localStorage abgelegt), timestamp, version, decision, analytics, marketing, banner_text_hash }`. **Keine IP, kein User-Agent** im Log — die UUID genügt, um auf Nachfrage („Ich habe nie eingewilligt“) den konkreten Beleg zu finden, ohne selbst ein Tracking-Datum zu schaffen. Aufbewahrung: 3 Jahre nach Widerruf/letzter Änderung (Verjährungsfrist).

---

## 5. Technische Architektur im Code

### 5.1 Zentrale `track()`-Utility

Ein einziger Trichter für alle Events — kein Komponenten-Code ruft je ein Vendor-SDK direkt auf:

```ts
// lib/analytics/track.ts
type Tier = "base" | "analytics";
type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: { track: (name: string, props?: Props) => void };
    posthog?: { capture: (name: string, props?: Props) => void };
    __npConsent?: import("./consent").ConsentState | null;
  }
}

const queue: Array<{ name: string; props?: Props }> = [];

export function track(name: string, props?: Props, tier: Tier = "base") {
  if (process.env.NODE_ENV !== "production") {
    console.debug("[track]", name, props);
  }
  // Stufe 1: immer, cookielos, via Umami (bzw. sendBeacon-Fallback)
  window.umami?.track(name, props);

  // Stufe 2: nur mit Einwilligung; vorher In-Memory-Queue (max 50, kein Storage!)
  if (tier === "analytics") {
    if (window.__npConsent?.analytics && window.posthog) {
      window.posthog.capture(name, props);
    } else if (!window.__npConsent) {
      if (queue.length < 50) queue.push({ name, props });
    }
  }
}

export function flushQueue(_reason: Tier) {
  while (queue.length) {
    const e = queue.shift()!;
    window.posthog?.capture(e.name, e.props);
  }
}
```

### 5.2 Deklarativ per `data-analytics`-Attribut (empfohlen für Klicks)

Statt jede der vielen Klick-Stellen (cv-download.tsx:76 ff., topbar.tsx:17 ff., projects.tsx:113 ff., references.tsx:90 ff., certificates.tsx:112 ff., page.tsx:91 ff.) mit Hook-Code zu durchsetzen, ein **globaler delegierter Click-Listener** im Provider plus Attribute im Markup:

```tsx
// im AnalyticsProvider zusätzlich:
useEffect(() => {
  const onClick = (e: MouseEvent) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>("[data-analytics-event]");
    if (!el) return;
    const props: Record<string, string> = {};
    for (const [k, v] of Object.entries(el.dataset)) {
      if (k.startsWith("analyticsProp")) {
        // data-analytics-prop-cv-lang="de" → cvLang → cv_lang
        const key = k.replace("analyticsProp", "");
        props[key.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "")] = v ?? "";
      }
    }
    track(el.dataset.analyticsEvent!, props);
  };
  document.addEventListener("click", onClick, { capture: true });
  return () => document.removeEventListener("click", onClick, { capture: true });
}, []);
```

Anwendung, z. B. CV-Download (cv-download.tsx):

```tsx
<a
  key={f.href}
  href={f.href}
  download
  data-analytics-event="cv_download"
  data-analytics-prop-cv-lang={f.href.includes("_DE") ? "de" : "en"}
  data-analytics-prop-placement={variant}
  …
>
```

und der Booking-CTA (topbar.tsx):

```tsx
<a href={profile.booking} target="_blank" rel="noreferrer"
   data-analytics-event="booking_click"
   data-analytics-prop-placement="topbar" …>
```

**Vorteile:** Server Components wie `NotionTopBar` bleiben Server Components (Attribute sind reines HTML, kein Handler nötig); ein Grep nach `data-analytics-event` liefert die komplette Instrumentierungs-Landkarte; die Taxonomie ist im Markup dokumentiert. Umami könnte alternativ sein natives `data-umami-event` nutzen — das eigene Attribut hält aber beide Stufen vendor-neutral.

**Explizite `track()`-Aufrufe (Hooks) nur dort, wo es kein Klick-Event gibt:**
- `skills_search`/`gallery_search`: debounced in einem kleinen `useTrackedSearch(gallery, query, resultCount)`-Hook, der in `SkillsGallery` (galleries.tsx) und den drei `DatabaseToolbar`-Nutzern eingehängt wird — dort ist der `result_count` (`visible.length`) ohnehin lokal verfügbar.
- `scroll_depth` und `engagement_time`: ein `useEngagement()`-Hook im Provider (Scroll-Schwellen einmalig pro Pageview; Zeitmessung über `document.visibilityState`, Versand per `navigator.sendBeacon` beim `pagehide` — exakt das in analytics.md dokumentierte Beacon-Muster).
- `toc_navigate`: eine Zeile `track("toc_navigate", { section_id: id })` in `scrollTo()` (toc.tsx:30–35), da der Button bereits einen Handler hat.
- `project_open`/`reference_open` können alternativ als Pageview der Zielroute (`/projekte/[slug]`) gemessen werden — die Karten sind `<Link>`-Navigationen (projects.tsx:113); das Klick-Event liefert zusätzlich die `source`.

### 5.3 Web Vitals

Nach analytics.md: eigene `WebVitals`-Client-Komponente mit `useReportWebVitals`, gemountet im Provider; Werte gebuckelt als `web_vitals`-Event an Umami. Kein Drittanbieter (kein Vercel Speed Insights) nötig.

### 5.4 Wo nichts eingebaut wird

Kein Tracking in E-Mail-/Telefon-Links (`contact`, data.ts:21–25) über das Klick-Event hinaus, kein Tracking im PDF selbst (keine Tracking-Pixel in CVs), keine Query-Klartexte (Abschnitt 3).

### 5.5 First-Party-Proxy als Route Handler

Damit das Umami-Script und der Collect-Endpunkt unter der eigenen Domain laufen (kein Third-Party-Request, CSP-freundlich, weniger Adblocker-Ausfall — wobei der Proxy *nicht* dazu dienen darf, eine Ablehnung zu umgehen; in Stufe 1 gibt es aber nichts zu umgehen):

```ts
// app/api/a/[...path]/route.ts  (Next 16: RouteContext-Helper, route-handlers.md)
import type { NextRequest } from "next/server";

const UMAMI = process.env.UMAMI_ORIGIN!; // z. B. https://stats.example.de

async function proxy(req: NextRequest, ctx: RouteContext<"/api/a/[...path]">) {
  const { path } = await ctx.params;
  const url = `${UMAMI}/${path.join("/")}`;
  const res = await fetch(url, {
    method: req.method,
    headers: { "content-type": req.headers.get("content-type") ?? "" },
    body: req.method === "POST" ? await req.text() : undefined,
    // BEWUSST: keine IP-Weitergabe (kein X-Forwarded-For) → Umami sieht nur
    // die Server-IP; Geo/Unique-Zählung erfolgt dann rein serverseitig grob.
  });
  return new Response(res.body, { status: res.status });
}

export { proxy as GET, proxy as POST };
```

Hinweis nach route-handlers.md: `route.ts` darf nicht auf derselben Segmentebene wie eine `page.tsx` liegen — unter `app/api/…` ist das erfüllt; `POST` wird nie gecacht, das `GET` für `script.js` kann normal durchlaufen. Sollte später die **Eigenbau-Option** gewählt werden, wird derselbe Pfad zum eigenen Collect-Endpunkt (`POST /api/a/collect` → SQLite via `better-sqlite3` oder Postgres), mit identischem `track()`-Frontend — die Architektur ist vendor-austauschbar.

---

## 6. Datenminimierung & Betroffenenrechte

**Technische Minimierung (Stufe 1):**
- **IP-Adressen:** werden nie gespeichert. Umami persistiert IPs ohnehin nicht; über den Proxy (5.5) erreicht die Client-IP den Analytics-Server gar nicht erst. Server-Access-Logs (Nginx o. ä.) werden auf IP-Kürzung (letztes Oktett nullen) und max. 7 Tage Rotation konfiguriert — Rechtsgrundlage Art. 6 Abs. 1 lit. f (Betriebssicherheit).
- **Keine Fingerprints ohne Consent:** keine Canvas-/Font-/Hardware-Signale, kein `localStorage`-Lesen/Schreiben außer dem Consent-State selbst. Der Umami-Visitor-Hash rotiert täglich (Salt) — keine Wiedererkennung über den Tag hinaus.
- **Property-Allowlist:** `track()` akzeptiert nur skalare Werte; ein Dev-Mode-Assert prüft Event-Namen gegen die Taxonomie-Liste, damit nicht versehentlich Freitext in Properties landet.
- **Referrer:** nur `referrer_domain`, niemals volle URLs mit Query-Parametern.

**Speicherfristen:**

| Datenart | Frist |
|---|---|
| Server-Access-Logs (gekürzte IP) | 7 Tage |
| Stufe-1-Roh-Events (Umami, ohne Personenbezug) | 14 Monate, danach nur aggregierte Berichte |
| Stufe-2-Events/Recordings (PostHog, mit Einwilligung) | Recordings 30 Tage, Events 12 Monate; sofortige Löschung auf Widerruf hin (PostHog-API `DELETE /api/person/…`) |
| Consent-Logs | 3 Jahre nach letzter Änderung |

**Betroffenenrechte:**
- Stufe 1: Auskunft/Löschung laufen praktisch leer, weil kein Datum einer Person zuordenbar ist — genau das ist das Design-Ziel; die Datenschutzerklärung erklärt das transparent.
- Stufe 2: Auskunft (Art. 15), Löschung (Art. 17) und Widerruf (Art. 7 Abs. 3) werden über die PostHog-Person-API bedienbar gemacht; der Widerrufs-Flow (4.4) löscht clientseitige IDs sofort.
- Widerspruch (Art. 21) gegen die Stufe-1-Verarbeitung auf f-Basis: Hinweis in der Datenschutzerklärung; praktisch umsetzbar über ein Opt-out-Flag im Einstellungs-Panel, das `window.umami` deaktiviert (das Flag selbst ist als Nutzerentscheidung § 25-Abs.-2-konform speicherbar).

**Pflichtinhalte für die Datenschutzerklärung (neu zu ergänzen):**
1. Verantwortlicher inkl. Kontakt (Impressumsdaten, DDG § 5).
2. Stufe 1: cookielose Reichweiten-/Interaktionsmessung mit selbst gehostetem Umami; Rechtsgrundlage Art. 6 Abs. 1 lit. f; berechtigtes Interesse (Verbesserung des Angebots, Reichweitenmessung); keine Cookies, keine geräteübergreifende Wiedererkennung; Widerspruchsrecht.
3. Stufe 2: PostHog EU (PostHog Inc., EU-Rechenzentrum Frankfurt) nur nach Einwilligung; Kategorien (Nutzungsprofil, Session-Replay); Rechtsgrundlagen Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG; AVV nach Art. 28; Hinweis auf US-Konzernmutter und getroffene Garantien (SCC/EU-US DPF); Widerruf jederzeit über „Cookie-Einstellungen“.
4. Speicherfristen (Tabelle oben), Betroffenenrechte inkl. Beschwerderecht bei der Aufsichtsbehörde (für Niedersachsen: LfD Niedersachsen).
5. Externe Dienste beim *Verlassen* der Seite: Buchung via Notion Calendar (data.ts:9), CV-PDFs lokal (keine Drittanbieter), verlinkte Profile (LinkedIn, GitHub, Malt, freelancermap — data.ts:53–59).

---

## 7. Umsetzungs-Reihenfolge (Kurz-Roadmap)

1. **Consent-Modul** (`lib/analytics/consent.ts`) + Banner-Umbau (echte Persistenz, korrigierte Texte, Footer-Link „Cookie-Einstellungen“). *Ohne diesen Schritt darf Stufe 2 nie live gehen; Stufe 1 darf, sobald die Datenschutzerklärung steht.*
2. **Umami self-hosted** (Docker auf Hetzner) + Proxy-Route + `AnalyticsProvider` in `app/layout.tsx`.
3. **`track()`-Utility + `data-analytics`-Attribute** an den in Abschnitt 3 gelisteten Stellen; Such-/Scroll-/Engagement-Hooks.
4. **Datenschutzerklärung & Impressum** aktualisieren (Voraussetzung für Go-Live von Schritt 2/3).
5. **Optional:** PostHog EU hinter dem Consent-Gate + Consent-Logging-Endpunkt (`app/api/consent/route.ts`).
6. **Review nach 4 Wochen:** Prüfen, ob Stufe-2-Opt-in-Quote den Betrieb von PostHog rechtfertigt; sonst bewusst bei Stufe 1 bleiben — weniger Systeme, weniger Pflichten, nahezu gleicher Erkenntnisgewinn für eine Portfolio-Seite.

---

*Hinweis (severity: info): Aussagen zur konkreten Hosting-Umgebung (Vercel vs. Self-Hosting, Server-Log-Konfiguration) sind Annahmen außerhalb des Repos — im Repo ist kein Deployment-Target belegt. Dieses Dokument ist eine technische Design- und Rechts-Einordnung, ersetzt aber keine anwaltliche Beratung.*