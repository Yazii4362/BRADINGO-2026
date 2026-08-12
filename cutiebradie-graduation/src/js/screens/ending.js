import { getGraduationStats } from '../data/course.js';
import { openConfirmModal } from '../components/confirm-modal.js';
import { EXPORT_FILE_NAME } from '../constants.js';
import {
  createExportCard,
  deliverPngBlob,
  mountExportCard,
  renderExportCardToPngBlob,
  showPngPreview,
} from '../png/export.js';

/**
 * N5 Ending screen + client PNG export.
 * @param {{
 *   nodeId: string,
 *   title: string,
 *   mode: 'play' | 'replay',
 *   progress: { nodeStatus: Record<string, string>, endingViewed?: boolean },
 *   onReviewMap: () => void,
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

  /** @type {'idle' | 'generating' | 'success' | 'failure' | 'cancelled'} */
  let exportStatus = 'idle';
  let markedComplete = false;

  const el = document.createElement('section');
  el.className = 'screen screen--ending';
  el.dataset.screen = 'ending';
  el.dataset.nodeId = props.nodeId;
  el.dataset.mode = props.mode;
  el.dataset.exportStatus = exportStatus;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  el.innerHTML = `
    <div class="ending-glow" aria-hidden="true"></div>
    ${reduceMotion ? '' : '<div class="ending-confetti" aria-hidden="true"></div>'}
    <header class="ending-header">
      <p class="ending-eyebrow">${stats.wordmark}</p>
      ${props.mode === 'replay' ? '<span class="cb-replay-badge ending-replay">다시 보기</span>' : ''}
    </header>
    <div class="ending-hero" role="img" aria-label="${stats.heroAlt}">
      ${
        stats.heroImage
          ? `<img class="ending-hero__img" src="${stats.heroImage}" alt="${stats.heroAlt}" />`
          : '<div class="ending-hero__fallback">졸업 축하 일러스트</div>'
      }
    </div>
    <h1 class="ending-title">${stats.title}</h1>
    <p class="ending-subtitle">${stats.subtitle}</p>
    <ul class="ending-stats" aria-label="완료 기록">
      <li class="cb-ending-stat"><span>완료 챕터</span><strong>${completedDisplay}/${stats.totalNodes}</strong></li>
      <li class="cb-ending-stat"><span>스트릭</span><strong>${stats.streakDays}일</strong></li>
      <li class="cb-ending-stat"><span>추억 사진</span><strong>${stats.memoryCount}장</strong></li>
      <li class="cb-ending-stat"><span>친구 메시지</span><strong>${stats.friendMessageCount}명</strong></li>
    </ul>
    <p class="ending-status" role="status" aria-live="polite"></p>
    <div class="ending-actions">
      <button type="button" class="cb-button cb-button--primary cb-button--fill ending-btn" data-action="export">이미지로 저장</button>
      <button type="button" class="cb-button cb-button--ghost-dark cb-button--fill ending-btn" data-action="review">다시 보기</button>
      <button type="button" class="cb-button cb-button--danger cb-button--fill ending-btn" data-action="reset">처음부터 다시</button>
    </div>
  `;

  const statusEl = el.querySelector('.ending-status');
  const exportBtn = el.querySelector('[data-action="export"]');

  el.querySelector('[data-action="review"]')?.addEventListener('click', () => {
    props.onReviewMap();
  });

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
    void runExport();
  });

  function setExportStatus(next, message = '') {
    exportStatus = next;
    el.dataset.exportStatus = next;
    if (statusEl) statusEl.textContent = message;
    if (exportBtn instanceof HTMLButtonElement) {
      exportBtn.disabled = next === 'generating';
      exportBtn.classList.toggle('cb-button--loading', next === 'generating');
      if (next === 'failure') {
        exportBtn.textContent = '다시 시도';
      } else if (next === 'generating') {
        exportBtn.textContent = '준비 중…';
      } else {
        exportBtn.textContent = '이미지로 저장';
      }
    }
  }

  async function runExport() {
    if (exportStatus === 'generating') return;
    setExportStatus('generating', '이미지를 준비하고 있어요');

    // Export always shows a full-clear card (5/5), independent of mid-session counts.
    const fullClearProgress = {
      nodeStatus: Object.fromEntries(
        Object.keys(props.progress.nodeStatus).map((id) => [id, 'completed'])
      ),
    };
    const exportCard = createExportCard(fullClearProgress);
    const unmount = mountExportCard(exportCard);

    try {
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

      const images = [...exportCard.querySelectorAll('img')];
      for (const img of images) {
        if (img.getAttribute('src') && img.complete && img.naturalWidth === 0) {
          throw new Error('ExportCard image failed to load');
        }
      }

      const blob = await renderExportCardToPngBlob(exportCard);
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
      console.error('[ending/export] PNG 생성 실패', error);
      setExportStatus('failure', '이미지를 만들지 못했어요');
    } finally {
      unmount();
    }
  }

  // Mark N5 complete once content is in the DOM (play mode only via app callback).
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
