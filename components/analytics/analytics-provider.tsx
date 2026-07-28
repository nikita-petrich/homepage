"use client";

import Script from "next/script";
import { useEffect, useSyncExternalStore } from "react";
import { useReportWebVitals } from "next/web-vitals";

import { CONSENT_CHANGE_EVENT, readConsent } from "@/lib/analytics/consent";
import { flushPending, track, type EventProps } from "@/lib/analytics/track";

const WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

/* dataset key "analyticsPropCvLang" → property name "cv_lang" */
function propsFromDataset(el: HTMLElement): EventProps {
  const props: EventProps = {};
  for (const [key, value] of Object.entries(el.dataset)) {
    if (key.startsWith("analyticsProp") && key !== "analyticsProp") {
      const name = key
        .slice("analyticsProp".length)
        .replace(/([A-Z])/g, "_$1")
        .toLowerCase()
        .replace(/^_/, "");
      props[name] = value ?? "";
    }
  }
  return props;
}

/* Delegated click tracking: any element carrying data-analytics-event is
   reported with its data-analytics-prop-* values. Grep for
   "data-analytics-event" to see the full instrumentation map. */
function useClickTracking() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const el = target.closest<HTMLElement>("[data-analytics-event]");
      if (!el || !el.dataset.analyticsEvent) return;
      track(el.dataset.analyticsEvent, propsFromDataset(el));
    };
    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true });
  }, []);
}

/* Scroll depth (25/50/75/100 %, each reported once per page load) and
   engagement time, bucketed and sent when the tab is hidden or closed. */
function useEngagementTracking() {
  useEffect(() => {
    const reported = new Set<number>();
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const depth = ((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100;
      for (const threshold of [25, 50, 75, 100]) {
        if (depth >= threshold && !reported.has(threshold)) {
          reported.add(threshold);
          track("scroll_depth", { depth: threshold });
        }
      }
    };

    const start = Date.now();
    let lastBucket = "";
    const bucketOf = (seconds: number) =>
      seconds < 10
        ? "0-10"
        : seconds < 30
          ? "10-30"
          : seconds < 60
            ? "30-60"
            : seconds < 180
              ? "60-180"
              : "180+";
    const onVisibility = () => {
      if (document.visibilityState !== "hidden") return;
      const bucket = bucketOf((Date.now() - start) / 1000);
      if (bucket === lastBucket) return;
      lastBucket = bucket;
      track("engagement_time", { seconds_bucket: bucket });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
}

function useWebVitalsTracking() {
  useReportWebVitals((metric) => {
    // Coarse buckets only — exact values are not needed and reduce noise.
    const value =
      metric.name === "CLS"
        ? Math.round(metric.value * 100) / 100
        : Math.round(metric.value / 100) * 100;
    track("web_vitals", { metric: metric.name, value });
  });
}

function subscribeToConsent(onChange: () => void) {
  window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
}

function statisticsSnapshot(): "allowed" | "opted-out" {
  return readConsent()?.statistics === false ? "opted-out" : "allowed";
}

/* Client island mounted from the root layout. Loads the stage-1 Umami script
   through the first-party proxy (/api/a) — cookieless, no device storage, so
   no consent required — unless the visitor has opted out (Art. 21 DSGVO). */
export function AnalyticsProvider() {
  // "pending" on the server render; resolved from localStorage on the client.
  const statistics = useSyncExternalStore(
    subscribeToConsent,
    statisticsSnapshot,
    () => "pending" as const,
  );

  useClickTracking();
  useEngagementTracking();
  useWebVitalsTracking();

  // "pending": consent not read yet (server render) — don't load the script
  // prematurely; events queue in track() meanwhile.
  if (!WEBSITE_ID || statistics !== "allowed") return null;

  return (
    <Script
      src="/api/a/script.js"
      data-website-id={WEBSITE_ID}
      data-host-url="/api/a"
      strategy="afterInteractive"
      onLoad={() => flushPending()}
    />
  );
}
