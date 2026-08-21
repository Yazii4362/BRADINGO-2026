import { t } from '../i18n.js';

const BACK_ICON = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

/** @type {ReadonlyArray<{ id: string, labelKey: string, accent: string }>} */
const REVIEW_ITEMS = Object.freeze([
  Object.freeze({ id: 'survive', labelKey: 'review.item.survive', accent: 'green' }),
  Object.freeze({ id: 'adapt', labelKey: 'review.item.adapt', accent: 'blue' }),
  Object.freeze({ id: 'friends', labelKey: 'review.item.friends', accent: 'purple' }),
  Object.freeze({ id: 'will', labelKey: 'review.item.will', accent: 'orange' }),
]);

/**
 * N2 — Graduation qualification review (playful interaction).
 * @param {{
 *   nodeId: string,
 *   title: string,
 *   mode: 'play' | 'replay',
 *   onBackToMap: () => void,
 *   onComplete: () => void
 * }} props
 */
export function renderChapter(props) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /** @type {number[]} */
  const timers = [];

  const el = document.createElement('section');
  el.className = 'screen screen--chapter screen--review';
  el.dataset.screen = 'chapter';
  el.dataset.nodeId = props.nodeId;

  const header = document.createElement('header');
  header.className = 'chapter-header review-header';
  header.innerHTML = `
    <button type="button" class="chapter-back" aria-label="${t('chapter.backToMap')}">${BACK_ICON}</button>
    <p class="review-progress">${t('review.progress')}</p>
  `;
  header.querySelector('.chapter-back')?.addEventListener('click', () => {
    clearTimers();
    props.onBackToMap();
  });

  const main = document.createElement('div');
  main.className = 'review-body';

  const titleBlock = document.createElement('div');
  titleBlock.className = 'review-intro';
  titleBlock.innerHTML = `
    <h1 class="review-title">${t('review.title')}</h1>
    <p class="review-desc">${t('review.desc')}</p>
  `;

  const stage = document.createElement('div');
  stage.className = 'review-stage';
  stage.innerHTML = `
    <img
      class="review-character"
      src="./assets/images/quiz/n2-character-full.png"
      alt=""
      width="180"
      height="180"
      decoding="async"
    />
  `;

  const list = document.createElement('ul');
  list.className = 'review-list';
  list.setAttribute('aria-label', t('review.listAria'));

  /** @type {Map<string, HTMLElement>} */
  const statusEls = new Map();

  REVIEW_ITEMS.forEach((item) => {
    const row = document.createElement('li');
    row.className = `review-row review-row--${item.accent}`;
    row.dataset.itemId = item.id;
    row.innerHTML = `
      <span class="review-row__dot" aria-hidden="true"></span>
      <span class="review-row__label">${t(item.labelKey)}</span>
      <span class="review-row__status" data-role="status">${
        item.id === 'will' ? t('review.measuring') : '…'
      }</span>
    `;
    const status = row.querySelector('[data-role="status"]');
    if (status instanceof HTMLElement) statusEls.set(item.id, status);
    list.appendChild(row);
  });

  const result = document.createElement('div');
  result.className = 'review-result';
  result.hidden = true;
  result.innerHTML = `
    <p class="review-result__eyebrow">${t('review.resultLabel')}</p>
    <p class="review-result__title">${t('review.resultTitle')}</p>
    <p class="review-result__body">${t('review.resultBody')}</p>
  `;

  const footer = document.createElement('footer');
  footer.className = 'chapter-footer review-footer';

  const completeBtn = document.createElement('button');
  completeBtn.type = 'button';
  completeBtn.className = 'cb-button cb-button--primary cb-button--fill';
  completeBtn.textContent =
    props.mode === 'replay' ? t('chapter.backToMap') : t('review.approve');
  completeBtn.disabled = props.mode === 'play';
  completeBtn.addEventListener('click', () => {
    if (props.mode === 'play' && completeBtn.disabled) return;
    clearTimers();
    props.onComplete();
  });

  const secondary = document.createElement('button');
  secondary.type = 'button';
  secondary.className = 'cb-button cb-button--text review-secondary';
  secondary.textContent = t('chapter.backToMap');
  secondary.hidden = props.mode !== 'play';
  secondary.addEventListener('click', () => {
    clearTimers();
    props.onBackToMap();
  });

  footer.append(completeBtn, secondary);
  main.append(titleBlock, stage, list, result);
  el.append(header, main, footer);

  function clearTimers() {
    while (timers.length) {
      const id = timers.pop();
      if (id != null) window.clearTimeout(id);
    }
  }

  function markPass(id) {
    const status = statusEls.get(id);
    if (!status) return;
    status.textContent = t('review.pass');
    status.classList.add('is-pass');
    const row = list.querySelector(`[data-item-id="${id}"]`);
    row?.classList.add('is-done');
  }

  function finishReview() {
    markPass('will');
    result.hidden = false;
    result.classList.add('is-visible');
    if (props.mode === 'play') {
      completeBtn.disabled = false;
    }
  }

  if (props.mode === 'replay' || reduceMotion) {
    REVIEW_ITEMS.forEach((item) => markPass(item.id));
    result.hidden = false;
    result.classList.add('is-visible');
    completeBtn.disabled = false;
  } else {
    const schedule = [
      { id: 'survive', delay: 450 },
      { id: 'adapt', delay: 950 },
      { id: 'friends', delay: 1450 },
      { id: 'will-done', delay: 2600 },
    ];
    schedule.forEach((step) => {
      timers.push(
        window.setTimeout(() => {
          if (step.id === 'will-done') finishReview();
          else markPass(step.id);
        }, step.delay)
      );
    });
  }

  el.__cleanup = () => clearTimers();
  return el;
}
