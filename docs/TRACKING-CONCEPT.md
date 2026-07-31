# Tracking and analytics concept for Nikita Petrich's portfolio website

**Design document · as of 2026-07-24 · legal framework: GDPR, TDDDG (§ 25), DDG**

---

## 0. Starting point in the code (as-is analysis)

The website is a static Next.js 16 App Router site with no backend, no API routes and no analytics tool integrated. Relevant findings:

- **No tracking present.** `app/layout.tsx` renders only `{children}` and `{modal}` — no `next/script`, no `instrumentation-client.ts`, no analytics import (app/layout.tsx:24–31).
- **The cookie banner is currently pure decoration.** It claims `"Diese Website verwendet Cookies, um die Nutzung zu analysieren"` (components/notion/cookie-banner.tsx:58–59) even though not a single cookie is set and nothing is analysed. That is not merely useless but misleading — the text has to be brought in line with the actual behaviour.
- **The preferences are not stored.** In the "Anpassen" dialog only the string `"customized"` is persisted; the actual toggles (`functional`/`analytics`/`marketing`) are lost: `localStorage.setItem(STORAGE_KEY, value)` with `value = "all" | "none" | "customized"` (cookie-banner.tsx:36, called via `onDone={() => dismiss("customized")}`, cookie-banner.tsx:52). A consent gate cannot be built on that.
- **No way to withdraw.** After the first decision the banner never reappears (`shouldShow = !localStorage.getItem(STORAGE_KEY)`, cookie-banner.tsx:24); there is no "Cookie-Einstellungen" link in the footer.
- **The interactive elements that are to be tracked already exist and are clearly identifiable in the code** (CV dropdown, booking CTA, project/reference cards, search fields, TOC, outbound links) — details in section 3.

**Positive:** "Ablehnen" is placed with equal weight next to "Alle akzeptieren" (cookie-banner.tsx:61–74) — that matches the DSK's line on the design of consent banners and is preserved.

---

## 1. Legal framework: the two-tier model

The operator's wish is "maximally detailed tracking, every button click". That is achievable — but only if two tiers are cleanly separated:

**Tier 1 — no consent required (the default for all visitors):**
§ 25(1) TDDDG requires consent only for **storing information on, or accessing information in, the terminal device** where that is not strictly necessary (cookies, localStorage IDs, fingerprinting). A measurement that **stores nothing on the device and reads nothing from it** does not fall under § 25. The subsequent data processing (IP address in the request, user agent) is measured against the GDPR and, for **cookieless, aggregated reach and interaction measurement without recognition across visits**, can be based on Art. 6(1)(f) GDPR (legitimate interest) — which is also the position of the DSK's guidance for telemedia providers. Importantly: *every button click as an anonymous counting event* is permissible at this tier. What does not work is recognising the person clicking across visits.

**Tier 2 — only with consent (Art. 6(1)(a) GDPR + § 25(1) TDDDG):**
Everything that marks a device or builds profiles — persistent visitor IDs (cookie/localStorage), cross-visit journeys ("came in via LinkedIn on Monday, downloaded the CV on Wednesday"), session replay/heatmaps with movement data, marketing/campaign attribution with recognition. Consent has to be active, informed, granular and **as easy to withdraw as to give** (Art. 7(3) GDPR).

All events from the taxonomy (section 3) run at **both** tiers — tier 2 merely adds the link to a person/device. That means the operator already gets full click statistics without a single consent click.

---

## 2. Tool comparison and recommendation

| Criterion | **Umami** (self-hosted) | **Matomo** (self-hosted) | **Plausible** (EU cloud / CE self-hosted) | **PostHog** (EU cloud) | **In-house** (route handler + SQLite/Postgres) |
|---|---|---|---|---|---|
| **Usable without consent (§ 25 TDDDG)?** | **Yes** — cookieless by default, no storage on the device; visitor hash computed server-side with a daily rotating salt (no cross-visit recognition) | **Yes, configurable** — the cookieless mode has to be switched on explicitly; the full feature set (heatmaps, session recording) only with consent | **Yes** — cookieless by design, daily rotating hash | **Only to a limited degree** — by default it uses persistent IDs (localStorage/cookie) → consent required; a "memory persistence" mode is possible, autocapture/replay clearly require consent | **Yes** — full control, you simply store nothing on the device |
| **Hosting effort** | Low: 1 Docker container + Postgres, ~256 MB RAM | Medium–high: PHP + MySQL, updates, plugin maintenance | Cloud: none. CE self-hosted: high (ClickHouse + Postgres, RAM-hungry) | None (cloud, Frankfurt region) | No third-party system, but in-house development + your own DB maintenance |
| **Cost** | Server ~€5/month (e.g. Hetzner — fits the existing stack, cf. lib/data.ts:178 "Hetzner") | Server ~€10/month; heatmaps/replay = paid plugins | Cloud from ~€9/month; CE free + server costs | Generous free tier, usage-based after that | Server costs only, but development time |
| **Event tracking** | Good: custom events + properties, declaratively via `data-umami-event` attributes or `umami.track()` | Very good: events, dimensions, funnels, e-commerce | Good: custom events + props, simple funnels/goals | Excellent: autocapture, funnels, retention, session replay, feature flags | Anything you like — but you build all of it |
| **Reporting UI** | Modern, lean, sufficient for a portfolio page | Powerful, but dated/complex | Very lean, deliberately reduced | Very powerful (product-analytics grade) | Has to be built entirely from scratch |
| **GDPR footnotes** | No DPA needed (own server, EU) | No DPA needed | Cloud: DPA with Plausible OÜ (EU company, hosting Hetzner DE) | DPA needed; US parent company despite EU data residency → mention the third-country issue in the transfer impact assessment | No third party involved — maximum data sovereignty |

**Recommendation for this case (freelancer, small static site, EU, a wish for click-level detail):**

1. **Primary: self-hosted Umami as the tier-1 tool.** It offers the best ratio of "count all events without consent" to operational effort. The operator hosts on EU infrastructure anyway (Hetzner shows up repeatedly in their own tech stack) and running Docker is a core skill. No DPA, no third-country assessment, no ongoing licence costs. The declarative `data-umami-event` attribute fits the desired "every button" instrumentation exactly.
2. **Optionally as tier 2: PostHog EU cloud, loaded exclusively after opt-in** — if the operator really wants to see session replay and cross-visit journeys. A realistic expectation: on a portfolio page only a fraction will consent; tier 2 is a bonus, not the data foundation.
3. **Not recommended as a sole solution:** Matomo (its operational effort and UI complexity are out of proportion for a one-page site; it would, however, be the right choice if *one* tool absolutely had to cover both tiers), Plausible CE (ClickHouse overhead), a purely in-house build (building the reporting UI yourself is the most expensive part — as a *supplement* for consent logging and the first-party proxy it does make sense, see section 5.5).

---

## 3. Event taxonomy

Derived from the components that actually exist. Naming convention: `snake_case`, object_verb order. All events are **consent-free at tier 1** as long as they are sent without a device/person identifier; the "Consent" column refers to the event itself, not to an additional ID link (that is *always* tier 2).

| Event name | Trigger (code anchor) | Properties | Consent needed? |
|---|---|---|---|
| `page_view` | Initial load / App Router navigation | `path`, `referrer_domain` (domain only, without query), `lang` | **No** (cookieless, aggregated) |
| `cv_download` | Click on a CV entry in the dropdown: `cvFiles.map((f) => (<a … href={f.href} download` (cv-download.tsx:76–79) | `cv_lang: "de" \| "en"` (from `f.href`, data.ts:15–16), `placement: "topbar" \| "hero"` (prop `variant`, cv-download.tsx:13; currently only `variant="topbar"` in topbar.tsx:16 — `hero` is prepared) | **No** |
| `cv_menu_open` | Toggling the dropdown (`onClick={() => setOpen((v) => !v)}`, cv-download.tsx:43) | `placement` | **No** |
| `booking_click` | Click on `href={profile.booking}` → `calendar.notion.so` (topbar.tsx:17–19 "Erstgespräch buchen" and page.tsx:112–118 callout link) | `placement: "topbar" \| "intro_callout"` | **No** — *note:* the click leads to Notion (a US provider); that is an outbound link, not tracking of our own. The privacy policy needs a note about the external booking service. |
| `project_open` | Navigation on a project card: `href={/projects/${p.slug}}` (projects.tsx:115) | `slug` (stable, data.ts:127), `source: "gallery"` | **No** |
| `project_reference_click` | Reference chip in the project modal (projects.tsx:294–306) | `project_slug`, `reference_slug` | **No** |
| `project_references_open` | "Alle N ansehen" in the project modal: `href={/projects/${project.slug}/references}` (projects.tsx) | `slug` (project slug), `source: "project_modal"` | **No** |
| `reference_open` | Card `href={/references/${r.slug}}` (references.tsx:91) | `slug`, `source: "gallery" \| "project_modal" \| "project_references"` | **No** |
| `reference_source_click` | `SourceTag` outbound to LinkedIn/Malt (references.tsx:41–47) | `source: "LinkedIn" \| "Malt"`, `reference_slug` | **No** |
| `certificate_open` | Certificate card or table row `href={certPageHref(c)}` → detail dialog (certificates.tsx) | `slug`, `issuer`, `source: "gallery" \| "table"` | **No** |
| `certificate_document_open` | Opening the certificate itself in a new tab: card link "PDF öffnen", click on the preview in the dialog, primary button in the dialog (certificates.tsx) | `slug`, `issuer`, `target: "pdf" \| "external"`, `source: "gallery" \| "modal_preview" \| "modal_button"` | **No** |
| `certificate_verify_click` | "Auf ‹Aussteller› verifizieren" in the dialog → outbound to the provider's certificate check (certificates.tsx) | `slug`, `issuer` | **No** |
| `certificate_course_click` | "Kursseite" in the dialog → outbound to the public course page (certificates.tsx) | `slug`, `issuer` | **No** |
| `certificates_overview_open` | "Alle Zertifikate auf einer Seite" in the "Zertifikate" section → `/certificates` (page.tsx) | `source: "home_section"` | **No** |
| `skills_search` | Debounced (≥ 800 ms pause) on `onChange={(e) => setQuery(e.target.value)}` (galleries.tsx:36–37) | `query_length`, `result_count`, `matched_categories` (only values from the fixed list `skills[].name`, data.ts:390–408) — **never the raw query** | **No** (precisely *because* there is no plain text) |
| `gallery_search` | Debounced on the `DatabaseToolbar` search in projects/references/certificates (`query={query} onQueryChange={setQuery}`, projects.tsx:96–97, references.tsx:269–270, certificates.tsx:96–97) | `gallery: "projects" \| "references" \| "certificates"`, `query_length`, `result_count` | **No** |
| `gallery_sort_toggle` | `onToggleSortDir` (e.g. projects.tsx:95) | `gallery`, `direction` | **No** |
| `language_switch` | Click on a language in the header's language menu (language-toggle.tsx) | `locale: "de" \| "en"` | **No** |
| `language_menu_open` | Opening the language menu (language-toggle.tsx) | — | **No** |
| `theme_switch` | Click on the light/dark switch (theme-toggle.tsx) | `theme: "light" \| "dark"` | **No** |
| `toc_navigate` | TOC button `onClick={() => scrollTo(item.id)}` (toc.tsx:55) | `section_id` (from `sections`, data.ts:577–587) | **No** |
| `outbound_click` | Click on a `profileLinks` anchor (page.tsx:91–101; targets data.ts:53–59: website, LinkedIn, GitHub, freelancermap, Malt) as well as `companyUrl` links | `target_domain`, `link_label` | **No** |
| `scroll_depth` | IntersectionObserver/scroll listener, thresholds 25/50/75/100 % (each threshold once per pageview) | `depth: 25 \| 50 \| 75 \| 100` | **No** |
| `engagement_time` | On `visibilitychange`/`pagehide` via `navigator.sendBeacon` (pattern from node_modules/next/dist/docs/01-app/02-guides/analytics.md, section "Sending results to external systems") | `seconds_bucket: "0-10" \| "10-30" \| "30-60" \| "60-180" \| "180+"` (bucketed, no exact value) | **No** |
| `web_vitals` | `useReportWebVitals` (analytics.md) | `metric_name` (LCP/CLS/INP/…), `value_bucket`, `path` | **No** |
| `consent_banner_shown` | The banner becomes visible (`setVisible(true)`, cookie-banner.tsx:30) | — | **No** (this must be measurable without consent, otherwise it is a chicken-and-egg problem) |
| `consent_decision` | `dismiss(value)` (cookie-banner.tsx:34) | `decision: "all" \| "none" \| "customized"`, `analytics: bool`, `marketing: bool`, `banner_version` | **No** (an aggregated counter; for the *consent log* itself see 4.4) |
| `session_recording_start` | PostHog only, after opt-in | session ID (PostHog-internal) | **YES — tier 2** |
| `identify` / cross-visit profile | PostHog only, after opt-in | persistent `distinct_id` | **YES — tier 2** |

**Addendum (bilingual site, 2026-07):** Since German and English were introduced, the website sets a single, technically necessary cookie — `NEXT_LOCALE` with the value `de` or `en`, written by the language switcher and by `proxy.ts`. It is not part of the measurement, holds no identifier and serves only to deliver an address without a language prefix in the language the visitor chose (§ 25 (2) no. 2 TDDDG). The tier-1 argument is unaffected: the measurement itself remains cookieless and stores nothing on the device. The localStorage entry `np-theme` for the choice between the light and the dark theme is equally free of consent.

**Why the skill search query is not logged in plain text:** (1) free-text fields are uncontrollable data sources — users accidentally type or paste names, email addresses and internal project designations; that would store potentially personal data without a legal basis and without any way to assign a deletion. (2) Rare, individual search strings act as a quasi-identifier and, combined with a timestamp/IP, can make recognition possible — which would undermine the tier-1 argument ("no recognition"). (3) The analytical value is almost entirely preserved with `query_length`, `result_count` and `matched_categories` (an allowlist from the fixed skill vocabulary): you can see *what is being searched for* (at category level) and *whether anything is found* — without the plain-text risk.

---

## 4. Consent architecture: from decorative banner to a real gate

### 4.1 Consent state as the single source of truth

Today's state (`"all" | "none" | "customized"` as a string) is replaced by a **versioned, structured object**:

```ts
// lib/analytics/consent.ts
export const CONSENT_VERSION = 1; // bump on every change to categories/texts
const KEY = "np-consent-v1";

export type ConsentState = {
  version: number;
  timestamp: string;          // ISO, the moment of the decision
  functional: boolean;
  analytics: boolean;         // tier 2: persistent IDs, PostHog
  marketing: boolean;         // currently unused, the category stays for later
};

export function readConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    // Old version ⇒ the consent expires, show the banner again
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

Storing *this* object is permissible without consent under § 25(2) no. 2 TDDDG — it is strictly necessary in order to respect the user's decision itself.

**Changes to the banner (cookie-banner.tsx):**
- `dismiss()` calls `writeConsent()` with the real `prefs` object ("Alle akzeptieren" ⇒ everything `true`, "Ablehnen" ⇒ everything `false`, "Fertig" ⇒ the current toggles). The bug that `prefs` is discarded (cookie-banner.tsx:52) is thereby fixed.
- The banner text is corrected, because tier 1 sets **no cookies**: *"Diese Website misst die Nutzung cookielos und anonym. Optional: erweiterte Analyse mit Wiedererkennung — nur mit Ihrer Einwilligung."* Today's text (cookie-banner.tsx:58–59) would simply be wrong after the rebuild.
- The category descriptions in the `CustomizePanel` are made more precise: "Analyse" ⇒ "Erweiterte Analyse mit Wiedererkennung über Besuche hinweg (PostHog, EU-Server). Die anonyme Basismessung läuft unabhängig davon."

### 4.2 Loading scripts according to next/script semantics

The gating mechanism follows from `scripts.md`: a `<Script>` is loaded as soon as the component is rendered (the strategy controls only *when in the lifecycle*, not *whether*). Consent gating therefore means: **the `<Script>` component for tier 2 is only rendered once `analytics: true` is in the consent state.** `onLoad` handlers only work in client components (scripts.md, "Executing Additional Code") — the provider is `"use client"` anyway.

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
      {/* Tier 1: cookieless Umami — ALWAYS loads, no consent needed.
          First-party proxy /api/a (see 5.5); data-* is passed through by
          next/script to the final <script> tag (scripts.md, "Additional Attributes"). */}
      <Script
        src="/api/a/script.js"
        data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID}
        data-host-url="/api/a"
        data-auto-track="false"
        strategy="afterInteractive"
      />

      {/* Tier 2: PostHog EU — only RENDERED (and therefore loaded)
          once the consent is in place. */}
      {consent?.analytics && (
        <Script
          id="posthog"
          strategy="afterInteractive"
          onLoad={() => flushQueue("analytics")}
        >
          {`/* posthog-js snippet, api_host: 'https://eu.i.posthog.com',
               persistence: 'localStorage+cookie' — only permissible now */`}
        </Script>
      )}
    </>
  );
}
```

Hooked into the root layout — as its own minimal client island, so `layout.tsx` stays a server component (pattern from analytics.md for the `WebVitals` wrapper):

```tsx
// app/layout.tsx (excerpt)
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

In addition, Next 16 offers `instrumentation-client.ts` in the project root, which runs *before* the rest of the frontend code (analytics.md, "Client Instrumentation") — the ideal place to read the consent state early and cache it in `window.__npConsent`, so that `track()` decides correctly even before React hydration.

### 4.3 Event queue before the decision

- **Tier-1 events need no queue** — they require no consent and fire immediately (even while the banner is still open). That is exactly what makes `consent_banner_shown`/`consent_decision` measurable.
- **Tier-2 context** (e.g. "these events should later be attributed to the PostHog session"): events are held in an **in-memory ring-buffer queue** (max. ~50 entries) and submitted on opt-in via `flushQueue()`. On "Ablehnen" or `pagehide` the queue is discarded. **Important:** the queue must *not* be persisted to `localStorage`/`sessionStorage` — that would itself be storage on the device before consent and thus a § 25 violation through the back door.

### 4.4 Withdrawal and consent logging

- **Withdrawal:** a footer link "Cookie-Einstellungen" (to be created) that reopens the banner with pre-filled toggles. On withdrawal of `analytics`: `writeConsent()` with the new values, then delete the PostHog cookies/localStorage keys (`ph_*`) and `location.reload()` — because a script that has already been loaded cannot be reliably "unloaded" at runtime. Withdrawal is thereby just as easy as giving consent (Art. 7(3) GDPR).
- **Consent logging (duty of proof, Art. 7(1) GDPR):** a lean route handler `app/api/consent/route.ts` (`POST`; route handlers are never cached on `POST`, cf. route-handlers.md "Caching") writes a record to the database: `{ consent_id (a random UUID, stored in localStorage together with the consent state), timestamp, version, decision, analytics, marketing, banner_text_hash }`. **No IP, no user agent** in the log — the UUID is enough to find the concrete record when asked ("I never consented") without creating a tracking datum in the process. Retention: 3 years after withdrawal/the last change (limitation period).

---

## 5. Technical architecture in the code

### 5.1 A central `track()` utility

A single funnel for all events — no component code ever calls a vendor SDK directly:

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
  // Tier 1: always, cookieless, via Umami (or the sendBeacon fallback)
  window.umami?.track(name, props);

  // Tier 2: only with consent; before that an in-memory queue (max 50, no storage!)
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

### 5.2 Declaratively via a `data-analytics` attribute (recommended for clicks)

Instead of peppering every one of the many click sites (cv-download.tsx:76 ff., topbar.tsx:17 ff., projects.tsx:113 ff., references.tsx:90 ff., certificates.tsx:112 ff., page.tsx:91 ff.) with hook code, use a **global delegated click listener** in the provider plus attributes in the markup:

```tsx
// additionally in the AnalyticsProvider:
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

Applied, for example, to the CV download (cv-download.tsx):

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

and the booking CTA (topbar.tsx):

```tsx
<a href={profile.booking} target="_blank" rel="noreferrer"
   data-analytics-event="booking_click"
   data-analytics-prop-placement="topbar" …>
```

**Advantages:** server components such as `NotionTopBar` stay server components (attributes are plain HTML, no handler needed); a grep for `data-analytics-event` yields the complete instrumentation map; the taxonomy is documented in the markup. Umami could alternatively use its native `data-umami-event` — but our own attribute keeps both tiers vendor-neutral.

**Explicit `track()` calls (hooks) only where there is no click event:**
- `skills_search`/`gallery_search`: debounced in a small `useTrackedSearch(gallery, query, resultCount)` hook, wired into `SkillsGallery` (galleries.tsx) and the three `DatabaseToolbar` users — the `result_count` (`visible.length`) is available locally there anyway.
- `scroll_depth` and `engagement_time`: a `useEngagement()` hook in the provider (scroll thresholds once per pageview; timing via `document.visibilityState`, dispatched with `navigator.sendBeacon` on `pagehide` — exactly the beacon pattern documented in analytics.md).
- `toc_navigate`: one line, `track("toc_navigate", { section_id: id })`, in `scrollTo()` (toc.tsx:30–35), since the button already has a handler.
- `project_open`/`reference_open` can alternatively be measured as a pageview of the target route (`/projects/[slug]`) — the cards are `<Link>` navigations (projects.tsx:113); the click event additionally supplies the `source`.

### 5.3 Web vitals

Per analytics.md: a dedicated `WebVitals` client component with `useReportWebVitals`, mounted in the provider; the values are sent bucketed to Umami as a `web_vitals` event. No third party (no Vercel Speed Insights) needed.

### 5.4 Where nothing is built in

No tracking in email/phone links (`contact`, data.ts:21–25) beyond the click event, no tracking in the PDF itself (no tracking pixels in CVs), no plain-text queries (section 3).

### 5.5 First-party proxy as a route handler

So that the Umami script and the collect endpoint run under our own domain (no third-party request, CSP-friendly, less adblocker fallout — while the proxy must *not* serve to circumvent a rejection; at tier 1 there is nothing to circumvent anyway):

```ts
// app/api/a/[...path]/route.ts  (Next 16: RouteContext helper, route-handlers.md)
import type { NextRequest } from "next/server";

const UMAMI = process.env.UMAMI_ORIGIN!; // e.g. https://stats.example.de

async function proxy(req: NextRequest, ctx: RouteContext<"/api/a/[...path]">) {
  const { path } = await ctx.params;
  const url = `${UMAMI}/${path.join("/")}`;
  const res = await fetch(url, {
    method: req.method,
    headers: { "content-type": req.headers.get("content-type") ?? "" },
    body: req.method === "POST" ? await req.text() : undefined,
    // DELIBERATE: no IP forwarding (no X-Forwarded-For) → Umami only sees
    // the server IP; geo/unique counting is then purely server-side and coarse.
  });
  return new Response(res.body, { status: res.status });
}

export { proxy as GET, proxy as POST };
```

A note per route-handlers.md: `route.ts` must not sit at the same segment level as a `page.tsx` — under `app/api/…` that is satisfied; `POST` is never cached, and the `GET` for `script.js` can pass through normally. Should the **in-house option** be chosen later, the same path becomes our own collect endpoint (`POST /api/a/collect` → SQLite via `better-sqlite3` or Postgres), with an identical `track()` frontend — the architecture is vendor-interchangeable.

---

## 6. Data minimisation & data-subject rights

**Technical minimisation (tier 1):**
- **IP addresses:** are never stored. Umami does not persist IPs anyway; via the proxy (5.5) the client IP never reaches the analytics server in the first place. Server access logs (Nginx or similar) are configured for IP truncation (zeroing the last octet) and rotation of at most 7 days — legal basis Art. 6(1)(f) (operational security).
- **No fingerprints without consent:** no canvas/font/hardware signals, no reading from or writing to `localStorage` other than the consent state itself. The Umami visitor hash rotates daily (salt) — no recognition beyond the day.
- **Property allowlist:** `track()` accepts scalar values only; a dev-mode assert checks event names against the taxonomy list, so free text cannot accidentally end up in properties.
- **Referrer:** only `referrer_domain`, never full URLs with query parameters.

**Retention periods:**

| Data type | Period |
|---|---|
| Server access logs (truncated IP) | 7 days |
| Tier-1 raw events (Umami, no personal reference) | 14 months, aggregated reports only after that |
| Tier-2 events/recordings (PostHog, with consent) | Recordings 30 days, events 12 months; immediate deletion on withdrawal (PostHog API `DELETE /api/person/…`) |
| Consent logs | 3 years after the last change |

**Data-subject rights:**
- Tier 1: access/erasure requests come up practically empty, because no datum can be attributed to a person — which is precisely the design goal; the privacy policy explains this transparently.
- Tier 2: access (Art. 15), erasure (Art. 17) and withdrawal (Art. 7(3)) are made serviceable via the PostHog person API; the withdrawal flow (4.4) deletes client-side IDs immediately.
- Objection (Art. 21) to the tier-1 processing on an (f) basis: a note in the privacy policy; practically implementable via an opt-out flag in the settings panel that disables `window.umami` (the flag itself, as a user decision, may be stored under § 25(2)).

**Mandatory contents for the privacy policy (to be added):**
1. The controller including contact details (imprint data, DDG § 5).
2. Tier 1: cookieless reach/interaction measurement with self-hosted Umami; legal basis Art. 6(1)(f); legitimate interest (improving the offering, measuring reach); no cookies, no cross-device recognition; right to object.
3. Tier 2: PostHog EU (PostHog Inc., EU data centre Frankfurt) only after consent; categories (usage profile, session replay); legal bases Art. 6(1)(a) GDPR and § 25(1) TDDDG; DPA under Art. 28; a note on the US parent company and the safeguards in place (SCC/EU-US DPF); withdrawal at any time via "Cookie-Einstellungen".
4. Retention periods (the table above), data-subject rights including the right to lodge a complaint with the supervisory authority (for Lower Saxony: LfD Niedersachsen).
5. External services on *leaving* the site: booking via Notion Calendar (data.ts:9), CV PDFs locally (no third parties), linked profiles (LinkedIn, GitHub, Malt, freelancermap — data.ts:53–59).

---

## 7. Implementation order (short roadmap)

1. **Consent module** (`lib/analytics/consent.ts`) + banner rebuild (real persistence, corrected texts, footer link "Cookie-Einstellungen"). *Without this step tier 2 must never go live; tier 1 may, as soon as the privacy policy is in place.*
2. **Umami self-hosted** (Docker on Hetzner) + proxy route + `AnalyticsProvider` in `app/layout.tsx`.
3. **`track()` utility + `data-analytics` attributes** at the sites listed in section 3; search/scroll/engagement hooks.
4. **Update the privacy policy & imprint** (a precondition for going live with steps 2/3).
5. **Optional:** PostHog EU behind the consent gate + a consent-logging endpoint (`app/api/consent/route.ts`).
6. **Review after 4 weeks:** check whether the tier-2 opt-in rate justifies running PostHog; otherwise deliberately stay at tier 1 — fewer systems, fewer obligations, nearly the same insight for a portfolio page.

---

*Note (severity: info): statements about the concrete hosting environment (Vercel vs. self-hosting, server-log configuration) are assumptions outside the repo — no deployment target is evidenced in the repo. This document is a technical design and legal assessment, but is no substitute for legal advice.*
