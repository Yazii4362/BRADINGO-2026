import { getTimelineYearGroups } from '../data/timeline.js';
import { t } from '../i18n/index.js';

/**
 * GNB archive — chronological school-life record (not the photo album).
 */
export function renderTimeline() {
  const groups = getTimelineYearGroups();
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const el = document.createElement('section');
  el.className = 'screen screen--timeline screen--with-gnb';
  el.dataset.screen = 'timeline';

  const header = document.createElement('header');
  header.className = 'tl-head';
  header.innerHTML = `
    <h1 class="tl-head__title">${t('timeline.title')}</h1>
    <p class="tl-head__sub">${t('timeline.subtitle')}</p>
  `;

  const yearNav = document.createElement('nav');
  yearNav.className = 'tl-index';
  yearNav.setAttribute('aria-label', t('timeline.jumpAria'));

  /** @type {Map<number, HTMLButtonElement>} */
  const chipByYear = new Map();
  /** @type {Map<number, HTMLElement>} */
  const sectionByYear = new Map();

  const body = document.createElement('div');
  body.className = 'tl-body';

  /** @type {number | null} */
  let activeYear = null;
  let jumpTimer = /** @type {number | null} */ (null);

  /**
   * @param {number} year
   * @param {{ revealChip?: boolean }} [options]
   */
  function applyActiveYear(year, options = {}) {
    if (activeYear === year) return;
    activeYear = year;
    chipByYear.forEach((chip, chipYear) => {
      const isActive = chipYear === year;
      chip.classList.toggle('is-active', isActive);
      chip.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
    if (options.revealChip === false) return;
    chipByYear.get(year)?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }

  const list = document.createElement('div');
  list.className = 'tl-feed';
  list.setAttribute('role', 'feed');
  list.setAttribute('aria-label', t('timeline.listAria'));

  groups.forEach((group) => {
    const section = document.createElement('section');
    section.className = 'tl-year';
    section.id = `tl-year-${group.year}`;
    section.dataset.year = String(group.year);
    section.setAttribute('aria-labelledby', `tl-year-label-${group.year}`);

    const heading = document.createElement('header');
    heading.className = 'tl-year__head';
    heading.innerHTML = `
      <h2 class="tl-year__label" id="tl-year-label-${group.year}">${group.year}</h2>
    `;

    const ol = document.createElement('ol');
    ol.className = 'tl-events';

    group.entries.forEach((entry, index) => {
      const isLastOverall =
        group === groups[groups.length - 1] && index === group.entries.length - 1;
      const li = document.createElement('li');
      li.className = `tl-event tl-event--${entry.accent}${isLastOverall ? ' tl-event--goal' : ''}`;
      li.id = `timeline-${entry.id}`;

      const when = entry.month
        ? `${entry.year}.${String(entry.month).padStart(2, '0')}`
        : String(entry.year);
      const media = entry.image
        ? `<span class="tl-event__media tl-event__media--stamp" aria-hidden="true"><img class="tl-event__stamp" src="${entry.image}" alt=""></span>`
        : `<span class="tl-event__media" aria-hidden="true">${entry.emoji ?? ''}</span>`;

      li.innerHTML = `
        <p class="tl-event__when"><time datetime="${entry.year}${
          entry.month ? `-${String(entry.month).padStart(2, '0')}` : ''
        }">${when}</time></p>
        <div class="tl-event__card">
          ${media}
          <div class="tl-event__copy">
            <p class="tl-event__tag">${t(entry.tagKey)}</p>
            <p class="tl-event__lead">${t(entry.line1Key)}</p>
            <p class="tl-event__note">${t(entry.line2Key)}</p>
          </div>
        </div>
      `;
      ol.appendChild(li);
    });

    section.append(heading, ol);
    list.appendChild(section);
    sectionByYear.set(group.year, section);

    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'tl-index__year';
    chip.dataset.year = String(group.year);
    chip.setAttribute('aria-current', 'false');
    chip.setAttribute('aria-label', t('timeline.jumpYearAria', { year: group.year }));
    chip.innerHTML = `<span class="tl-index__num">${group.year}</span>`;
    chip.addEventListener('click', () => {
      if (jumpTimer != null) window.clearTimeout(jumpTimer);
      jumpTimer = window.setTimeout(() => {
        jumpTimer = null;
      }, 650);
      applyActiveYear(group.year, { revealChip: false });
      section.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    });
    yearNav.appendChild(chip);
    chipByYear.set(group.year, chip);
  });

  body.appendChild(list);
  el.append(header, yearNav, body);

  const firstYear = groups[0]?.year;
  if (firstYear != null) applyActiveYear(firstYear, { revealChip: false });

  const observer = new IntersectionObserver(
    (entries) => {
      if (jumpTimer != null) return;
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!visible) return;
      const year = Number(/** @type {HTMLElement} */ (visible.target).dataset.year);
      if (Number.isFinite(year)) applyActiveYear(year);
    },
    { root: body, rootMargin: '-8% 0px -70% 0px', threshold: 0 }
  );
  sectionByYear.forEach((section) => observer.observe(section));

  el.__cleanup = () => {
    observer.disconnect();
    if (jumpTimer != null) {
      window.clearTimeout(jumpTimer);
      jumpTimer = null;
    }
  };

  return el;
}
