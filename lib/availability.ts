import type { Locale } from "./i18n/config";
import { availability as handMaintained } from "./profile";

/* Availability, read from project-pilot rather than maintained here.
 *
 * project-pilot is the one place Nik states from when and in what capacity he
 * takes work: it reads the value when it judges a listing, writes it to the
 * freelance platforms, and publishes it at a public endpoint. The site renders
 * what that endpoint says — in the sidebar, in the markdown twins and in
 * /api/profile.json — so the page and the platforms cannot disagree.
 *
 * The endpoint is a dependency the site must survive without: a timeout, an
 * error status, a body of the wrong shape or a value that was never set all
 * fall back to the hand-maintained value in lib/profile.ts, and the page
 * renders as it did before the endpoint existed.
 *
 * Everything but `getAvailability` is pure, so the wording can be checked
 * without a network. */

export type AvailabilityScope = "full_time" | "part_time";

export type Availability = {
  /** ISO date of the first working day, or `null` for "immediately". */
  from: string | null;
  scope: AvailabilityScope;
  /** Set for part-time only. */
  hoursPerWeek: number | null;
};

const DEFAULT_URL = "https://mcp-project-pilot.sequenz.io/availability";
/** Matches the endpoint's own `Cache-Control: max-age=300`. */
const REVALIDATE_SECONDS = 300;
const TIMEOUT_MS = 3000;
/** The working week a part-time share is measured against. */
const FULL_TIME_HOURS = 40;

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

function isIsoDate(value: string): boolean {
  const match = ISO_DATE.exec(value);
  if (!match) return false;
  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year!, month! - 1, day!));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month! - 1 &&
    date.getUTCDate() === day
  );
}

/** Today's date in Berlin as an ISO string — the day a German reader is in. */
export function berlinToday(now: Date): string {
  /* en-CA formats as YYYY-MM-DD. */
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/**
 * Reads the endpoint's body into an `Availability`, or `null` when it does not
 * carry a usable one: the wrong shape, an impossible date, part-time without
 * hours, or a value that was never set (`available_from` or `scope` null).
 */
export function parseAvailability(body: unknown): Availability | null {
  if (typeof body !== "object" || body === null) return null;
  const {
    available_from: from,
    scope,
    hours_per_week: hours,
  } = body as Record<string, unknown>;

  if (typeof from !== "string" || !isIsoDate(from)) return null;
  if (scope !== "full_time" && scope !== "part_time") return null;

  if (scope === "full_time") return { from, scope, hoursPerWeek: null };

  if (typeof hours !== "number" || !Number.isInteger(hours)) return null;
  if (hours < 1 || hours > FULL_TIME_HOURS) return null;
  return { from, scope, hoursPerWeek: hours };
}

/**
 * The value the site shows: the endpoint's when it has a usable one, the
 * hand-maintained one otherwise. A start date of today or earlier means
 * "immediately", so a date that has passed never reads as a date to wait for.
 */
export function resolveAvailability(body: unknown, today: string): Availability {
  const value = parseAvailability(body) ?? handMaintained.fallback;
  if (value.from !== null && value.from <= today) return { ...value, from: null };
  return value;
}

/** The share of a full working week, as the feed's `capacity_percent`. */
export function capacityPercent(value: Availability): number {
  if (value.scope === "full_time" || value.hoursPerWeek === null) return 100;
  return Math.min(100, Math.round((value.hoursPerWeek / FULL_TIME_HOURS) * 100));
}

const MONTHS_EN_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const MONTHS_EN_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/* Spelled out by hand rather than through Intl, so the wording does not depend
   on the ICU data of whichever Node runs the build. */
function dateParts(iso: string): { year: string; month: number; day: number } {
  const [year = "", month = "1", day = "1"] = iso.split("-");
  return { year, month: Number(month), day: Number(day) };
}

function germanDate(iso: string): string {
  const { year, month, day } = dateParts(iso);
  return `${String(day).padStart(2, "0")}.${String(month).padStart(2, "0")}.${year}`;
}

function englishDate(iso: string, months: string[]): string {
  const { year, month, day } = dateParts(iso);
  return `${day} ${months[month - 1]} ${year}`;
}

/** The sidebar's key-fact value: "ab 01.11.2026 · Vollzeit". */
export function availabilityLabel(value: Availability, locale: Locale): string {
  const hours = value.hoursPerWeek;
  if (locale === "de") {
    const start = value.from === null ? "ab sofort" : `ab ${germanDate(value.from)}`;
    const scope =
      value.scope === "full_time" ? "Vollzeit" : `Teilzeit (${hours} Std./Woche)`;
    return `${start} · ${scope}`;
  }
  const start =
    value.from === null ? "immediately" : `from ${englishDate(value.from, MONTHS_EN_SHORT)}`;
  const scope = value.scope === "full_time" ? "full time" : `part time (${hours} h/week)`;
  return `${start} · ${scope}`;
}

/** The key facts with the availability fact's value replaced by the live one. */
export function withLiveAvailability<Fact extends { live?: string; value: string }>(
  facts: Fact[],
  value: Availability,
  locale: Locale,
): Fact[] {
  return facts.map((fact) =>
    fact.live === "availability"
      ? { ...fact, value: availabilityLabel(value, locale) }
      : fact,
  );
}

/** The ready-made sentence /api/profile.json hands to an application writer. */
export function availabilitySentence(
  value: Availability,
  locale: Locale,
  onsiteMaxPercent: number,
): string {
  const percent = capacityPercent(value);
  const hours = value.hoursPerWeek;
  if (locale === "de") {
    const start = value.from === null ? "ab sofort" : `ab dem ${germanDate(value.from)}`;
    const scope =
      value.scope === "full_time"
        ? "Vollzeit"
        : `Teilzeit mit ${hours} Stunden pro Woche`;
    return (
      `Der Projektstart wäre ${start} in ${scope} (${percent} %, ` +
      `davon maximal ${onsiteMaxPercent} % vor Ort) möglich.`
    );
  }
  const start =
    value.from === null ? "immediately" : `on ${englishDate(value.from, MONTHS_EN_LONG)}`;
  const scope =
    value.scope === "full_time" ? "full-time" : `part-time, ${hours} hours per week`;
  return (
    `I would be available to start ${start}, working ${scope} ` +
    `(${percent} %, of which at most ${onsiteMaxPercent} % on-site).`
  );
}

/**
 * Fetches the live availability, cached for five minutes by Next's data cache
 * (so a page or feed revalidated within that window reuses the last answer),
 * and resolves it against today in Berlin. Never throws.
 */
export async function getAvailability(now: Date = new Date()): Promise<Availability> {
  const url = process.env.AVAILABILITY_URL || DEFAULT_URL;
  let body: unknown = null;
  try {
    const response = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { Accept: "application/json" },
    });
    if (response.ok) body = await response.json();
    else console.warn(`availability: ${url} answered ${response.status}, using the fallback`);
  } catch (error) {
    // Unreachable, timed out or not JSON: the hand-maintained value stands in.
    console.warn(`availability: ${url} failed (${String(error)}), using the fallback`);
  }
  if (body !== null && parseAvailability(body) === null) {
    console.warn(`availability: ${url} returned no usable value, using the fallback`);
  }
  return resolveAvailability(body, berlinToday(now));
}
