import { getGraduationStats } from '../data/course.js';
import { openConfirmModal } from '../components/confirm-modal.js';
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
    <div class="ending-splash" data-role="splash" aria-hidden="false">
      <img
        class="ending-splash__bg"
        src="./assets/images/ending/splash.jpg"
        alt=""
        width="576"
        height="1024"
        decoding="sync"
        fetchpriority="high"
      />
    </div>
    <div class="ending-stage-wrap" data-role="stage" hidden>
      <div class="ending-bg" aria-hidden="true">
        <img class="ending-bg__img" src="${stats.heroImage}" alt="" decoding="async" />
        <div class="ending-bg__veil"></div>
        ${reduceMotion ? '' : '<div class="ending-confetti"></div>'}
      </div>
      <div class="ending-body">
        <p class="ending-stage">${stats.stageLabel}</p>
        <button type="button" class="ending-title ending-egg" data-action="egg" aria-label="${t('ending.eggAria')}">
          ${stats.title}
        </button>
        <p class="ending-lead">${stats.lead}</p>
        <p class="ending-tagline">${stats.tagline}</p>
        <section class="ending-summary" aria-label="${stats.summaryTitle}">
          <h2 class="ending-summary__title">— ${stats.summaryTitle} —</h2>
          <ul class="ending-stats">${summaryHtml}</ul>
        </section>
        <section class="ending-cheer" aria-label="${t('ending.cheerTitle')}">
          <button type="button" class="ending-cheer__heart" data-action="cheer" aria-label="${t('ending.cheerCta')}">
            💚
          </button>
        </section>
        <p class="ending-status" role="status" aria-live="polite"></p>
        <div class="ending-actions">
          <button type="button" class="cb-button cb-button--primary cb-button--fill ending-save-text" data-action="export" aria-label="${t('ending.saveAria')}">
            ${t('ending.saveCta')}
          </button>
          <p class="ending-save-hint">${t('ending.saveHint')}</p>
          <button type="button" class="cb-button cb-button--text ending-btn" data-action="reset">${t('ending.resetConfirm')}</button>
        </div>
        <p class="ending-congrats">${t('ending.congrats')}</p>
      </div>
    </div>
  `;

  const splashEl = el.querySelector('[data-role="splash"]');
  const stageEl = el.querySelector('[data-role="stage"]');
  const statusEl = el.querySelector('.ending-status');
  const exportBtn = el.querySelector('[data-action="export"]');
  const cheerBtn = el.querySelector('[data-action="cheer"]');

  /** @type {number | null} */
  let splashTimer = null;
  const SPLASH_MS = reduceMotion ? 600 : 2800;

  function revealStage() {
    if (!(splashEl instanceof HTMLElement) || !(stageEl instanceof HTMLElement)) return;
    splashEl.classList.add('is-leaving');
    stageEl.hidden = false;
    requestAnimationFrame(() => {
      stageEl.classList.add('is-visible');
    });
    window.setTimeout(() => {
      splashEl.remove();
    }, reduceMotion ? 0 : 420);
  }

  splashTimer = window.setTimeout(() => {
    splashTimer = null;
    revealStage();
  }, SPLASH_MS);

  const unlockEgg = createTapUnlock({
    taps: 5,
    onUnlock: () => openCoffeeCoupon(),
  });
  el.querySelector('[data-action="egg"]')?.addEventListener('click', unlockEgg);

  cheerBtn?.addEventListener('click', () => {
    if (!(cheerBtn instanceof HTMLElement)) return;
    cheerBtn.classList.remove('is-pop');
    void cheerBtn.offsetWidth;
    cheerBtn.classList.add('is-pop');
    spawnHeartBurst(el.querySelector('.ending-cheer'), reduceMotion);
  });

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

  el.__cleanup = () => {
    if (splashTimer != null) {
      window.clearTimeout(splashTimer);
      splashTimer = null;
    }
  };

  return el;
}

/**
 * @param {Element | null} host
 * @param {boolean} reduceMotion
 */
function spawnHeartBurst(host, reduceMotion) {
  if (!host || reduceMotion) return;
  const burst = document.createElement('div');
  burst.className = 'ending-heart-burst';
  burst.setAttribute('aria-hidden', 'true');
  const glyphs = ['💚', '💚', '💚', '💕', '💚', '💚', '💚', '💚'];
  for (let i = 0; i < glyphs.length; i += 1) {
    const heart = document.createElement('span');
    heart.className = 'ending-heart-burst__item';
    heart.textContent = glyphs[i];
    heart.style.setProperty('--i', String(i));
    heart.style.setProperty('--dx', `${(i - (glyphs.length - 1) / 2) * 22}px`);
    heart.style.setProperty('--dy', `${-52 - (i % 3) * 18}px`);
    heart.style.setProperty('--rot', `${(i - 3.5) * 12}deg`);
    burst.appendChild(heart);
  }
  host.appendChild(burst);
  window.setTimeout(() => burst.remove(), 1000);
}

function shouldShowMobilePreview() {
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const narrow = window.matchMedia('(max-width: 480px)').matches;
  return coarse || narrow;
}
