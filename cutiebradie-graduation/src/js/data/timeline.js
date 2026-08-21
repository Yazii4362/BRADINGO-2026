/**
 * Timeline archive data (GNB tab — not a course node).
 * Soft copy only; no invented year-specific facts beyond known project themes.
 */

/** @type {ReadonlyArray<{ id: string, name: string, image: string, alt: string }>} */
export const TIMELINE_FRIENDS = Object.freeze([
  Object.freeze({
    id: 'dabin',
    name: '이다빈',
    image: './assets/images/friends/dabin.png',
    alt: '이다빈',
  }),
  Object.freeze({
    id: 'yaji',
    name: '야지',
    image: './assets/images/friends/yaji.png',
    alt: '야지',
  }),
  Object.freeze({
    id: 'yubinu',
    name: '유비누',
    image: './assets/images/friends/yubinu.png',
    alt: '유비누',
  }),
  Object.freeze({
    id: 'gaeuni',
    name: '가은이',
    image: './assets/images/friends/gaeuni.png',
    alt: '가은이',
  }),
  Object.freeze({
    id: 'byeonggeon',
    name: '병건',
    image: './assets/images/profile.webp',
    alt: '병건',
  }),
]);

/**
 * @type {ReadonlyArray<{
 *   year: number,
 *   tagKey: string,
 *   line1Key: string,
 *   line2Key: string,
 *   accent: 'green' | 'blue' | 'purple' | 'orange' | 'gold'
 * }>}
 */
export const TIMELINE_YEARS = Object.freeze([
  Object.freeze({
    year: 2018,
    tagKey: 'timeline.y2018.tag',
    line1Key: 'timeline.y2018.l1',
    line2Key: 'timeline.y2018.l2',
    accent: 'green',
  }),
  Object.freeze({
    year: 2019,
    tagKey: 'timeline.y2019.tag',
    line1Key: 'timeline.y2019.l1',
    line2Key: 'timeline.y2019.l2',
    accent: 'blue',
  }),
  Object.freeze({
    year: 2020,
    tagKey: 'timeline.y2020.tag',
    line1Key: 'timeline.y2020.l1',
    line2Key: 'timeline.y2020.l2',
    accent: 'purple',
  }),
  Object.freeze({
    year: 2021,
    tagKey: 'timeline.y2021.tag',
    line1Key: 'timeline.y2021.l1',
    line2Key: 'timeline.y2021.l2',
    accent: 'orange',
  }),
  Object.freeze({
    year: 2022,
    tagKey: 'timeline.y2022.tag',
    line1Key: 'timeline.y2022.l1',
    line2Key: 'timeline.y2022.l2',
    accent: 'blue',
  }),
  Object.freeze({
    year: 2023,
    tagKey: 'timeline.y2023.tag',
    line1Key: 'timeline.y2023.l1',
    line2Key: 'timeline.y2023.l2',
    accent: 'green',
  }),
  Object.freeze({
    year: 2024,
    tagKey: 'timeline.y2024.tag',
    line1Key: 'timeline.y2024.l1',
    line2Key: 'timeline.y2024.l2',
    accent: 'purple',
  }),
  Object.freeze({
    year: 2025,
    tagKey: 'timeline.y2025.tag',
    line1Key: 'timeline.y2025.l1',
    line2Key: 'timeline.y2025.l2',
    accent: 'orange',
  }),
  Object.freeze({
    year: 2026,
    tagKey: 'timeline.y2026.tag',
    line1Key: 'timeline.y2026.l1',
    line2Key: 'timeline.y2026.l2',
    accent: 'gold',
  }),
]);

export function getTimelineYears() {
  return TIMELINE_YEARS;
}

export function getTimelineFriends() {
  return TIMELINE_FRIENDS;
}
