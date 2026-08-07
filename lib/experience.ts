/* Years of professional experience — derived, not maintained by hand.
 *
 * The number used to sit in three places as a literal ("7+ Jahre" in the key
 * facts, "über 7 Jahre" in the intro and in the page description) and went
 * quietly stale there every year. It is therefore derived from the start date.
 *
 * The value is produced at build time: the pages are static, so it moves on
 * with the next deploy. For a figure that grows by one once a year that is
 * enough — rendering it on the client would only buy layout shifts. */

/** Start of professional experience: October 2018. */
export const CAREER_START = { year: 2018, month: 10 } as const;

/** Full years since `CAREER_START`, rounded down. */
export function yearsOfExperience(now: Date = new Date()): number {
  const months =
    (now.getFullYear() - CAREER_START.year) * 12 +
    (now.getMonth() + 1 - CAREER_START.month);
  return Math.max(0, Math.floor(months / 12));
}

export const experienceYears = yearsOfExperience();

/** "7+" — the spelling used by the key facts and the running text. */
export const experienceYearsPlus = `${experienceYears}+`;
