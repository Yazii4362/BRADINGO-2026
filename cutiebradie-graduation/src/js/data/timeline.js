/**
 * Timeline archive data (GNB tab — not a course node).
 * Soft copy only; no invented year-specific facts beyond known project themes.
 */

/**
 * Year thumbnails reuse images already shipped for quiz / memory / ending screens.
 * `month` is set only where the date is actually known.
 * @type {ReadonlyArray<{
 *   year: number,
 *   month?: number,
 *   tagKey: string,
 *   line1Key: string,
 *   line2Key: string,
 *   accent: 'green' | 'blue' | 'purple' | 'orange' | 'gold',
 *   image: string
 * }>}
 */
export const TIMELINE_YEARS = Object.freeze([
  Object.freeze({
    year: 2018,
    tagKey: 'timeline.y2018.tag',
    line1Key: 'timeline.y2018.l1',
    line2Key: 'timeline.y2018.l2',
    accent: 'green',
    image: './assets/images/quiz/campus-skip.webp',
  }),
  Object.freeze({
    year: 2019,
    tagKey: 'timeline.y2019.tag',
    line1Key: 'timeline.y2019.l1',
    line2Key: 'timeline.y2019.l2',
    accent: 'blue',
    image: './assets/images/memory/01-hangout.webp',
  }),
  Object.freeze({
    year: 2020,
    tagKey: 'timeline.y2020.tag',
    line1Key: 'timeline.y2020.l1',
    line2Key: 'timeline.y2020.l2',
    accent: 'purple',
    image: './assets/images/quiz/n1-jeong.webp',
  }),
  Object.freeze({
    year: 2021,
    tagKey: 'timeline.y2021.tag',
    line1Key: 'timeline.y2021.l1',
    line2Key: 'timeline.y2021.l2',
    accent: 'orange',
    image: './assets/images/memory/05-outdoor.webp',
  }),
  Object.freeze({
    year: 2022,
    tagKey: 'timeline.y2022.tag',
    line1Key: 'timeline.y2022.l1',
    line2Key: 'timeline.y2022.l2',
    accent: 'blue',
    image: './assets/images/quiz/campus-australia.webp',
  }),
  Object.freeze({
    year: 2023,
    month: 2,
    tagKey: 'timeline.y2023.tag',
    line1Key: 'timeline.y2023.l1',
    line2Key: 'timeline.y2023.l2',
    accent: 'green',
    image: './assets/images/memory/02-mirror.webp',
  }),
  Object.freeze({
    year: 2024,
    month: 8,
    tagKey: 'timeline.y2024.tag',
    line1Key: 'timeline.y2024.l1',
    line2Key: 'timeline.y2024.l2',
    accent: 'purple',
    image: './assets/images/memory/07-photobooth-strip.webp',
  }),
  Object.freeze({
    year: 2025,
    tagKey: 'timeline.y2025.tag',
    line1Key: 'timeline.y2025.l1',
    line2Key: 'timeline.y2025.l2',
    accent: 'orange',
    image: './assets/images/memory/12-restaurant.webp',
  }),
  Object.freeze({
    year: 2026,
    tagKey: 'timeline.y2026.tag',
    line1Key: 'timeline.y2026.l1',
    line2Key: 'timeline.y2026.l2',
    accent: 'gold',
    image: './assets/images/ending/hero.webp',
  }),
]);

export function getTimelineYears() {
  return TIMELINE_YEARS;
}
