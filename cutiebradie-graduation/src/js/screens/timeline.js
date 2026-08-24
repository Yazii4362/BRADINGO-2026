import { getTimelineYears } from '../data/timeline.js';
import { t } from '../i18n.js';

/**
 * GNB archive — Bradie's 2018–2026 school-life timeline (light mode).
 * Not a course node.
 */
export function renderTimeline() {
  const years = getTimelineYears();
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const el = document.createElement('section');
  el.className = 'screen screen--timeline screen--with-gnb';
  el.dataset.screen = 'timeline';

  const header = document.createElement('header');
  header.className = 'chapter-header timeline-header';
  header.innerHTML = `
    <span aria-hidden="true"></span>
    <div class="timeline-heading">
      <h1 class="chapter-title">${t('timeline.title')}</h1>
      <p class="timeline-heading__sub">
        <span class="timeline-heading__range">${t('timeline.bannerRange')}</span>
      </p>
    </div>
    <span aria-hidden="true"></span>
  `;

  const yearNav = document.createElement('nav');
  yearNav.className = 'memory-filters timeline-years';
  yearNav.setAttribute('aria-label', t('timeline.bannerRange'));

  /** @type {Map<number, HTMLButtonElement>} */
  const chipByYear = new Map();
  /** @type {Map<number, HTMLElement>} */
  const cardByYear = new Map();

  const body = document.createElement('div');
  body.className = 'timeline-body';

  /** @type {number | null} */
  let activeYear = null;
  /** Scroll-driven sync pauses while a tapped jump is still animating. */
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
      if (isActive) chip.setAttribute('aria-current', 'true');
      else chip.removeAttribute('aria-current');
    });
    if (options.revealChip === false) return;
    chipByYear.get(year)?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }

  const list = document.createElement('ol');
  list.className = 'timeline-list';
  list.setAttribute('aria-label', t('timeline.listAria'));

  /** @type {HTMLElement[]} */
  const allCards = [];

  years.forEach((entry, index) => {
    const isLast = index === years.length - 1;
    const card = document.createElement('li');
    card.className = `timeline-card timeline-card--${entry.accent}${isLast ? ' timeline-card--goal' : ''}`;
    card.id = `timeline-${entry.id}`;
    card.dataset.year = String(entry.year);
    const media = entry.image
      ? `<span class="cb-answer-card__media timeline-card__emoji timeline-card__emoji--stamp" aria-hidden="true"><img class="timeline-card__stamp" src="${entry.image}" alt=""></span>`
      : `<span class="cb-answer-card__media timeline-card__emoji" aria-hidden="true">${entry.emoji}</span>`;

    card.innerHTML = `
      <article class="timeline-card__panel cb-answer-card cb-answer-card--row">
        ${media}
        <span class="cb-answer-card__label timeline-card__copy">
          <span class="timeline-card__meta">
            <span class="timeline-card__year">${
              entry.month ? `${entry.year}.${entry.month}` : entry.year
            }</span>
            <span class="timeline-card__tag">${t(entry.tagKey)}</span>
          </span>
          <span class="timeline-card__text">
            ${t(entry.line1Key)} ${t(entry.line2Key)}
          </span>
        </span>
      </article>
    `;
    list.appendChild(card);
    allCards.push(card);
    if (!cardByYear.has(entry.year)) cardByYear.set(entry.year, card);

    if (chipByYear.has(entry.year)) return;
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'memory-filter timeline-year-chip';
    chip.textContent = String(entry.year);
    chip.dataset.year = String(entry.year);
    chip.addEventListener('click', () => {
      if (jumpTimer != null) window.clearTimeout(jumpTimer);
      jumpTimer = window.setTimeout(() => {
        jumpTimer = null;
      }, 700);
      applyActiveYear(entry.year, { revealChip: false });
      card.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    });
    yearNav.appendChild(chip);
    chipByYear.set(entry.year, chip);
  });

  body.appendChild(list);
  el.append(header, yearNav, body);

  const firstYear = years[0]?.year;
  if (firstYear != null) applyActiveYear(firstYear, { revealChip: false });

  /** Track the card nearest the top of the scroll area. */
  const observer = new IntersectionObserver(
    (entries) => {
      if (jumpTimer != null) return;
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!visible) return;
      const year = Number(visible.target.dataset.year);
      if (Number.isFinite(year)) applyActiveYear(year);
    },
    { root: body, rootMargin: '0px 0px -60% 0px', threshold: 0.01 }
  );
  allCards.forEach((card) => observer.observe(card));

  el.__cleanup = () => {
    observer.disconnect();
    if (jumpTimer != null) {
      window.clearTimeout(jumpTimer);
      jumpTimer = null;
    }
  };

  return el;
}
