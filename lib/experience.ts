/* Berufserfahrung in Jahren — gerechnet statt gepflegt.
 *
 * Die Zahl stand an drei Stellen als Literal ("7+ Jahre" in den Eckdaten, "über
 * 7 Jahre" im Intro und in der Seitenbeschreibung) und veraltet dort jedes Jahr
 * still. Sie wird deshalb aus dem Startdatum abgeleitet.
 *
 * Der Wert entsteht beim Build: die Seiten sind statisch, also wandert er mit
 * dem nächsten Deploy weiter. Für eine Angabe, die sich einmal im Jahr um eins
 * erhöht, reicht das — ein Client-Renderer dafür würde nur Layout-Sprünge
 * einhandeln. */

/** Beginn der Berufserfahrung: Oktober 2018. */
export const CAREER_START = { year: 2018, month: 10 } as const;

/** Volle Jahre seit `CAREER_START`, abgerundet. */
export function yearsOfExperience(now: Date = new Date()): number {
  const months =
    (now.getFullYear() - CAREER_START.year) * 12 +
    (now.getMonth() + 1 - CAREER_START.month);
  return Math.max(0, Math.floor(months / 12));
}

export const experienceYears = yearsOfExperience();

/** "7+" — die Schreibweise der Eckdaten und der Fließtexte. */
export const experienceYearsPlus = `${experienceYears}+`;
