import { getGraduationStats } from '../data/course.js';
import { openConfirmModal } from '../components/confirm-modal.js';
import { createCheerHeart } from '../components/cheer-heart.js';
import { createTapUnlock, openCoffeeCoupon } from '../components/coffee-coupon.js';
import { EXPORT_FILE_NAME } from '../constants.js';
import { t } from '../i18n.js';
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
    if (row.id === 'stages') {
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

  const summaryHtml = summaryRows
    .map((row) => {
      const valueHtml = row.valueHtml ?? row.value;
      return `
        <li class="cb-ending-stat cb-ending-stat--${row.tone}">
          <span class="cb-ending-stat__head">${row.head}</span>
          <div class="cb-ending-stat__body">
            ${endingStatGlyph(row.tone)}
            <strong class="cb-ending-stat__value">${valueHtml}</strong>
          </div>
          <span class="visually-hidden">${row.label}</span>
        </li>
      `;
    })
    .join('');

  el.innerHTML = `
    <div class="ending-stage-wrap is-visible" data-role="stage">
      <div class="ending-bg" aria-hidden="true">
        <img class="ending-bg__img" src="./assets/images/ending/bg.webp" alt="" width="576" height="1024" decoding="async" />
      </div>
      <div class="ending-body">
        <p class="ending-stage">${stats.stageLabel}</p>
        <figure class="ending-hero">
          <img class="ending-hero__img" src="${stats.heroImage}" alt="${stats.heroAlt}" decoding="async" />
        </figure>
        <button type="button" class="ending-title ending-egg" data-action="egg" aria-label="${t('ending.eggAria')}">
          ${stats.title}
        </button>
        <p class="ending-lead">${stats.lead}</p>
        <p class="ending-tagline">${stats.tagline}</p>
        <section class="ending-summary" aria-label="${stats.summaryTitle}">
          <h2 class="ending-summary__title">${stats.summaryTitle}</h2>
          <ul class="ending-stats">${summaryHtml}</ul>
        </section>
        <section class="ending-cheer-card" aria-label="${t('ending.cheerTitle')}">
          <p class="ending-cheer-card__title">${t('ending.cheerTitle')}</p>
          <p class="ending-congrats">${t('ending.congrats')}</p>
        </section>
        <div class="ending-actions">
          <button type="button" class="cb-button cb-button--primary cb-button--fill ending-save-text" data-action="export" aria-label="${t('ending.saveAria')}">
            ${t('ending.saveCta')}
          </button>
          <p class="ending-save-hint">${t('ending.saveHint')}</p>
          <p class="ending-status" role="status" aria-live="polite"></p>
          <button type="button" class="cb-button cb-button--text ending-btn" data-action="reset">${t('ending.resetConfirm')}</button>
        </div>
      </div>
    </div>
  `;

  el.querySelector('.ending-cheer-card')?.appendChild(createCheerHeart());

  const statusEl = el.querySelector('.ending-status');
  const exportBtn = el.querySelector('[data-action="export"]');

  const unlockEgg = createTapUnlock({
    taps: 5,
    onUnlock: () => openCoffeeCoupon(),
  });
  el.querySelector('[data-action="egg"]')?.addEventListener('click', unlockEgg);

  el.querySelector('[data-action="reset"]')?.addEventListener('click', () => {
    openConfirmModal({
      title: t('ending.resetTitle'),
      body: t('ending.resetBody'),
      cancelLabel: t('ending.resetCancel'),
      confirmLabel: t('ending.resetConfirm'),
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
        next === 'failure' ? t('ending.saveRetry') : busy ? t('ending.savePreparing') : t('ending.saveAria')
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
    setExportStatus('generating', t('ending.savePreparingMsg'));
    try {
      const mode = await deliverPngBlob(blob, EXPORT_FILE_NAME);
      if (mode === 'cancelled') {
        setExportStatus('idle', '');
        return;
      }
      if (mode === 'download' && shouldShowMobilePreview()) {
        showPngPreview(blob);
      }
      setExportStatus('success', t('ending.saveReady'));
    } catch (error) {
      console.error('[ending/export] 전달 실패', error);
      if (shouldShowMobilePreview()) {
        showPngPreview(blob);
        setExportStatus('success', t('ending.saveLongPress'));
        return;
      }
      setExportStatus('failure', t('ending.saveFail'));
    }
  }

  /** Cold path: still rendering — gesture will be lost; preview fallback on iOS. */
  async function runExportWhenPending() {
    if (exportStatus === 'generating') return;
    setExportStatus('generating', t('ending.savePreparingMsg'));

    /** @type {Blob | null} */
    let blob = null;
    try {
      if (!preparePromise) startPrepare();
      blob = await preparePromise;
      readyBlob = blob;
    } catch (error) {
      console.error('[ending/export] PNG 생성 실패', error);
      setExportStatus('failure', t('ending.saveFail'));
      return;
    }

    try {
      const mode = await deliverPngBlob(blob, EXPORT_FILE_NAME);
      if (mode === 'cancelled') {
        setExportStatus('idle', '');
        return;
      }
      if (mode !== 'share' && shouldShowMobilePreview()) {
        showPngPreview(blob);
      }
      setExportStatus('success', t('ending.saveReady'));
    } catch (error) {
      console.error('[ending/export] 전달 실패', error);
      if (shouldShowMobilePreview() && blob) {
        showPngPreview(blob);
        setExportStatus('success', t('ending.saveLongPress'));
        return;
      }
      setExportStatus('failure', t('ending.saveFail'));
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

/**
 * Duolingo-style XP / TIME / LESSONS glyphs from the ending stats mock.
 * @param {'xp' | 'time' | 'lessons'} tone
 */
function endingStatGlyph(tone) {
  if (tone === 'xp') {
    return `
      <svg class="cb-ending-stat__glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M13.2 2.15a.95.95 0 0 1 1.7.78l-1.22 6.72h5.05a.95.95 0 0 1 .72 1.56L10.8 21.85a.95.95 0 0 1-1.7-.78l1.22-6.72H5.27a.95.95 0 0 1-.72-1.56L13.2 2.15Z"/>
      </svg>
    `;
  }

  if (tone === 'time') {
    return `
      <svg class="cb-ending-stat__glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="13" r="7.15" fill="currentColor"/>
        <circle cx="12" cy="13" r="2.35" fill="#ecffde"/>
        <circle cx="12" cy="13" r="4.55" fill="none" stroke="#ecffde" stroke-width="1.7"/>
        <path d="M15.3 7.2 15.55 9.4c.03.22.17.4.37.48l1.85.75c.2.08.22-.18.03-.3l-1.55-.7a.55.55 0 0 1-.28-.72L15.7 6.7c-.06-.22-.32-.3-.5-.15L15.3 7.2Z" fill="currentColor"/>
        <path d="M12 13 18.2 8.2" fill="none" stroke="#478700" stroke-width="1.35" stroke-linecap="round"/>
      </svg>
    `;
  }

  return `
    <svg class="cb-ending-stat__glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12.2" r="6.4" fill="#ddf4ff" stroke="currentColor" stroke-width="1.8"/>
      <circle cx="12" cy="12.4" r="1.55" fill="currentColor"/>
      <path d="M11.7 12.5 16.4 8.7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
    </svg>
  `;
}

function shouldShowMobilePreview() {
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const narrow = window.matchMedia('(max-width: 480px)').matches;
  return coarse || narrow;
}
