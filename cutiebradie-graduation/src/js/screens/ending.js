import { getGraduationStats } from '../data/course.js';
import { openConfirmModal } from '../components/confirm-modal.js';
import { createTapUnlock, openCoffeeCoupon } from '../components/coffee-coupon.js';
import { EXPORT_FILE_NAME } from '../constants.js';
import {
  deliverPngBlob,
  prepareExportPngBlob,
  prefetchExportLibs,
  showPngPreview,
} from '../png/export.js';

/**
 * N5 Ending screen + client PNG export.
 * @param {{
 *   nodeId: string,
 *   title: string,
 *   mode: 'play' | 'replay',
 *   progress: { nodeStatus: Record<string, string>, endingViewed?: boolean },
 *   onEndingRendered: () => void,
 *   onResetConfirmed: () => void
 * }} props
 */
export function renderEnding(props) {
  const stats = getGraduationStats(props.progress);
  const completedDisplay =
    props.progress.nodeStatus.n5 === 'completed' || props.progress.nodeStatus.n5 === 'active'
      ? stats.totalNodes
      : stats.completedCount;

  const summaryRows = stats.summaryRows.map((row) => {
    if (row.id === 'courses') {
      return { ...row, value: `${completedDisplay} / ${stats.totalNodes}` };
    }
    return row;
  });

  /** @type {'idle' | 'generating' | 'success' | 'failure' | 'cancelled'} */
  let exportStatus = 'idle';
  let markedComplete = false;

  /** Ready before the tap whenever possible — required for iOS Web Share. */
  /** @type {Blob | null} */
  let readyBlob = null;
  /** @type {Promise<Blob> | null} */
  let preparePromise = null;

  const fullClearProgress = {
    nodeStatus: Object.fromEntries(
      Object.keys(props.progress.nodeStatus).map((id) => [id, 'completed'])
    ),
  };

  const el = document.createElement('section');
  el.className = 'screen screen--ending';
  el.dataset.screen = 'ending';
  el.dataset.nodeId = props.nodeId;
  el.dataset.mode = props.mode;
  el.dataset.exportStatus = exportStatus;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const summaryHtml = summaryRows
    .map((row) => {
      const valueHtml = row.valueHtml ?? row.value;
      return `
        <li class="cb-ending-stat">
          <img class="cb-ending-stat__icon" src="${row.icon}" alt="" width="28" height="28" />
          <span class="cb-ending-stat__label">${row.label}</span>
          <strong class="cb-ending-stat__value">${valueHtml}</strong>
        </li>
      `;
    })
    .join('');

  el.innerHTML = `
    <div class="ending-bg" aria-hidden="true">
      <img class="ending-bg__img" src="${stats.heroImage}" alt="" decoding="async" />
      <div class="ending-bg__veil"></div>
      ${reduceMotion ? '' : '<div class="ending-confetti"></div>'}
    </div>
    <div class="ending-body">
      <button type="button" class="ending-title ending-egg" data-action="egg" aria-label="숨겨진 쿠폰">
        ${stats.title}
      </button>
      <p class="ending-lead">${stats.lead}</p>
      <p class="ending-tagline">${stats.tagline}</p>
      <section class="ending-summary" aria-label="${stats.summaryTitle}">
        <h2 class="ending-summary__title">— ${stats.summaryTitle} —</h2>
        <ul class="ending-stats">${summaryHtml}</ul>
      </section>
      <p class="ending-status" role="status" aria-live="polite"></p>
      <div class="ending-actions">
        <button type="button" class="ending-save-btn" data-action="export" aria-label="이미지로 저장">
          <img class="ending-save-btn__icon" src="./assets/images/ending/btn-save.svg" alt="" width="50" height="48" decoding="async" />
        </button>
        <button type="button" class="cb-button cb-button--text ending-btn" data-action="reset">처음부터 다시</button>
      </div>
    </div>
  `;

  const statusEl = el.querySelector('.ending-status');
  const exportBtn = el.querySelector('[data-action="export"]');

  const unlockEgg = createTapUnlock({
    taps: 5,
    onUnlock: () => openCoffeeCoupon(),
  });
  el.querySelector('[data-action="egg"]')?.addEventListener('click', unlockEgg);

  el.querySelector('[data-action="reset"]')?.addEventListener('click', () => {
    openConfirmModal({
      title: '정말 처음부터 시작할까요?',
      body: '지금까지의 진행 기록이 모두 지워져요.',
      cancelLabel: '취소',
      confirmLabel: '처음부터 다시',
      confirmVariant: 'danger',
      onCancel: () => {},
      onConfirm: () => props.onResetConfirmed(),
    });
  });

  exportBtn?.addEventListener('click', () => {
    if (readyBlob) {
      void deliverReadyBlob(readyBlob);
      return;
    }
    void runExportWhenPending();
  });

  function setExportStatus(next, message = '') {
    exportStatus = next;
    el.dataset.exportStatus = next;
    if (statusEl) statusEl.textContent = message;
    if (exportBtn instanceof HTMLButtonElement) {
      const busy = next === 'generating';
      exportBtn.disabled = busy;
      exportBtn.classList.toggle('is-loading', busy);
      exportBtn.setAttribute(
        'aria-label',
        next === 'failure' ? '다시 시도' : busy ? '이미지 준비 중' : '이미지로 저장'
      );
    }
  }

  function startPrepare() {
    prefetchExportLibs();
    preparePromise = prepareExportPngBlob(fullClearProgress)
      .then((blob) => {
        if (!el.isConnected) return blob;
        readyBlob = blob;
        return blob;
      })
      .catch((error) => {
        console.warn('[ending/export] 미리 생성 실패', error);
        preparePromise = null;
        throw error;
      });
  }

  /**
   * Hot path: blob already in memory — share() runs in this gesture turn.
   * @param {Blob} blob
   */
  async function deliverReadyBlob(blob) {
    if (exportStatus === 'generating') return;
    setExportStatus('generating', '이미지를 준비하고 있어요');
    try {
      const mode = await deliverPngBlob(blob, EXPORT_FILE_NAME);
      if (mode === 'cancelled') {
        setExportStatus('idle', '');
        return;
      }
      if (mode === 'download' && shouldShowMobilePreview()) {
        showPngPreview(blob);
      }
      setExportStatus('success', '이미지가 준비됐어요');
    } catch (error) {
      console.error('[ending/export] 전달 실패', error);
      if (shouldShowMobilePreview()) {
        showPngPreview(blob);
        setExportStatus('success', '이미지를 길게 눌러 저장해 주세요');
        return;
      }
      setExportStatus('failure', '이미지를 만들지 못했어요');
    }
  }

  /** Cold path: still rendering — gesture will be lost; preview fallback on iOS. */
  async function runExportWhenPending() {
    if (exportStatus === 'generating') return;
    setExportStatus('generating', '이미지를 준비하고 있어요');

    /** @type {Blob | null} */
    let blob = null;
    try {
      if (!preparePromise) startPrepare();
      blob = await preparePromise;
      readyBlob = blob;
    } catch (error) {
      console.error('[ending/export] PNG 생성 실패', error);
      setExportStatus('failure', '이미지를 만들지 못했어요');
      return;
    }

    try {
      const mode = await deliverPngBlob(blob, EXPORT_FILE_NAME);
      if (mode === 'cancelled') {
        setExportStatus('idle', '');
        return;
      }
      // Gesture is usually gone here — prefer long-press preview on touch devices.
      if (mode !== 'share' && shouldShowMobilePreview()) {
        showPngPreview(blob);
      }
      setExportStatus('success', '이미지가 준비됐어요');
    } catch (error) {
      console.error('[ending/export] 전달 실패', error);
      if (shouldShowMobilePreview() && blob) {
        showPngPreview(blob);
        setExportStatus('success', '이미지를 길게 눌러 저장해 주세요');
        return;
      }
      setExportStatus('failure', '이미지를 만들지 못했어요');
    }
  }

  startPrepare();

  requestAnimationFrame(() => {
    if (markedComplete) return;
    markedComplete = true;
    props.onEndingRendered();
  });

  return el;
}

function shouldShowMobilePreview() {
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const narrow = window.matchMedia('(max-width: 480px)').matches;
  return coarse || narrow;
}
