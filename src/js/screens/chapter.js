import { CHECK_ICON, createFeedbackSheet } from '../components/feedback-sheet.js';
import { createMotionScope, prefersReducedMotion } from '../lib/motion.js';
import { REVIEW_ITEMS } from '../data/chapter.js';
import { t } from '../i18n/index.js';

const BACK_ICON = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

/** Sequence beats (ms). Total lands around ~2s. */
const SEQ = Object.freeze({
  start: 200,
  step: 280,
  /** Last row hesitates for comic timing. */
  lastStep: 480,
  resultPause: 160,
  resultReveal: 320,
});

/**
 * N2 — Graduation qualification review (light mode, existing CB components).
 * @param {{
 *   nodeId: string,
 *   title: string,
 *   mode: 'play' | 'replay',
 *   onBackToMap: () => void,
 *   onComplete: () => void
 * }} props
 */
export function renderChapter(props) {
  const reduceMotion = prefersReducedMotion();
  const scope = createMotionScope();
  let completing = false;

  const el = document.createElement('section');
  el.className = 'screen screen--chapter screen--review';
  el.dataset.screen = 'chapter';
  el.dataset.nodeId = props.nodeId;

  const header = document.createElement('header');
  header.className = 'chapter-header';
  header.innerHTML = `
    <button type="button" class="chapter-back" aria-label="${t('chapter.backToMap')}">${BACK_ICON}</button>
    <h1 class="chapter-title">${t('review.title')}</h1>
    <span aria-hidden="true"></span>
  `;
  header.querySelector('.chapter-back')?.addEventListener('click', () => {
    scope.dispose();
    props.onBackToMap();
  });

  const main = document.createElement('div');
  main.className = 'review-body';

  const stage = document.createElement('div');
  stage.className = 'review-stage';
  stage.innerHTML = `
    <img
      class="review-character"
      src="./assets/images/review/graduation-review.svg"
      alt=""
      width="245"
      height="162"
      decoding="async"
    />
    <p class="review-desc">${t('review.desc')}</p>
  `;

  const list = document.createElement('ul');
  list.className = 'review-list answer-list answer-list--stack';
  list.setAttribute('aria-label', t('review.listAria'));

  /** @type {Map<string, { row: HTMLElement, status: HTMLElement }>} */
  const rows = new Map();

  REVIEW_ITEMS.forEach((item) => {
    const row = document.createElement('li');
    row.className = `review-row review-row--${item.accent} cb-answer-card cb-answer-card--row is-waiting`;
    row.dataset.itemId = item.id;
    row.innerHTML = `
      <span class="review-row__swatch" aria-hidden="true"></span>
      <span class="cb-answer-card__label review-row__label">${t(item.labelKey)}</span>
      <span class="review-row__status" data-role="status"></span>
      <span class="review-row__mark" aria-hidden="true">
        <span class="review-row__dots"><i></i><i></i><i></i></span>
        <span class="review-row__check">${CHECK_ICON}</span>
      </span>
    `;
    const status = row.querySelector('[data-role="status"]');
    if (status instanceof HTMLElement) rows.set(item.id, { row, status });
    list.appendChild(row);
  });

  const sheetHost = document.createElement('div');
  sheetHost.className = 'review-sheet-host';
  sheetHost.hidden = true;

  main.append(stage, list);
  el.append(header, main, sheetHost);

  /** @param {string} id */
  function markChecking(id) {
    const entry = rows.get(id);
    if (!entry) return;
    entry.row.classList.remove('is-waiting');
    entry.row.classList.add('is-current');
    // Only the lingering last row is on screen long enough to read a label.
    if (id === 'will') {
      entry.status.textContent = t('review.measuring');
      entry.status.classList.add('is-pending');
    }
  }

  /** @param {string} id */
  function markPass(id) {
    const entry = rows.get(id);
    if (!entry) return;
    entry.row.classList.remove('is-waiting', 'is-current');
    entry.row.classList.add('is-done', 'cb-answer-card--correct');
    entry.status.textContent = t('review.pass');
    entry.status.classList.remove('is-pending');
    entry.status.classList.add('is-pass');
  }

  function showResult() {
    sheetHost.hidden = false;
    sheetHost.replaceChildren();

    const ctaLabel = props.mode === 'replay' ? t('chapter.backToMap') : t('review.approve');
    const sheet = createFeedbackSheet({
      variant: 'correct',
      title: t('review.resultTitle'),
      body: t('review.resultBody'),
      actionLabel: ctaLabel,
      onAction: () => finishReview(sheet),
    });
    sheet.classList.add('is-revealing');
    sheetHost.appendChild(sheet);

    const cta = sheet.querySelector('.cb-feedback-sheet__cta');
    if (cta instanceof HTMLButtonElement) {
      // Stays disabled until the panel has finished revealing (spec §8).
      cta.disabled = true;
      scope.after(() => {
        cta.disabled = false;
        cta.classList.add('is-enabling');
      }, reduceMotion ? 0 : SEQ.resultReveal);
    }
  }

  /** @param {HTMLElement} sheet */
  function finishReview(sheet) {
    if (completing) return;
    completing = true;

    const cta = sheet.querySelector('.cb-feedback-sheet__cta');
    if (cta instanceof HTMLButtonElement) {
      cta.disabled = true;
      if (props.mode !== 'replay') {
        cta.textContent = t('review.approved');
        cta.classList.add('is-approved');
        spawnApprovalSparkles(sheet, reduceMotion);
      }
    }

    const hold = reduceMotion || props.mode === 'replay' ? 0 : 480;
    scope.after(() => {
      scope.dispose();
      props.onComplete();
    }, hold);
  }

  if (props.mode === 'replay' || reduceMotion) {
    REVIEW_ITEMS.forEach((item) => markPass(item.id));
    showResult();
  } else {
    let at = SEQ.start;
    REVIEW_ITEMS.forEach((item, index) => {
      const isLast = index === REVIEW_ITEMS.length - 1;
      const dwell = isLast ? SEQ.lastStep : SEQ.step;
      const checkingAt = at;
      scope.after(() => markChecking(item.id), checkingAt);
      scope.after(() => markPass(item.id), checkingAt + dwell);
      at = checkingAt + dwell;
    });
    scope.after(showResult, at + SEQ.resultPause);
  }

  el.__cleanup = () => scope.dispose();
  return el;
}

/**
 * Small star pop around the approval CTA — not a full-screen burst.
 * @param {HTMLElement} host
 * @param {boolean} reduceMotion
 */
function spawnApprovalSparkles(host, reduceMotion) {
  if (reduceMotion) return;
  const burst = document.createElement('div');
  burst.className = 'review-sparkles';
  burst.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 5; i += 1) {
    const spark = document.createElement('span');
    spark.className = 'review-sparkles__item';
    spark.style.setProperty('--dx', `${(i - 2) * 26}px`);
    spark.style.setProperty('--dy', `${-30 - (i % 3) * 12}px`);
    spark.style.setProperty('--d', `${i * 40}ms`);
    burst.appendChild(spark);
  }
  host.appendChild(burst);
  window.setTimeout(() => burst.remove(), 800);
}
