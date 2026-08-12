import { EXPORT_FILE_NAME } from '../constants.js';
import { getGraduationStats } from '../data/course.js';

export { EXPORT_FILE_NAME } from '../constants.js';
export const PNG_SIZE = Object.freeze({ width: 1080, height: 1920 });

/**
 * @param {{ nodeStatus?: Record<string, string> } | null} [progress]
 */
export function createExportCard(progress = null) {
  const stats = getGraduationStats(progress);
  const card = document.createElement('div');
  card.className = 'cb-export-card';
  card.setAttribute('aria-hidden', 'true');
  card.style.width = `${PNG_SIZE.width}px`;
  card.style.height = `${PNG_SIZE.height}px`;

  const hero = stats.heroImage
    ? `<img class="cb-export-card__hero-img" src="${stats.heroImage}" alt="${stats.heroAlt}" />`
    : `<div class="cb-export-card__hero-fallback" role="img" aria-label="${stats.heroAlt}">졸업 축하</div>`;

  card.innerHTML = `
    <div class="cb-export-card__inner">
      <p class="cb-export-card__wordmark">${stats.wordmark}</p>
      <div class="cb-export-card__hero">${hero}</div>
      <h1 class="cb-export-card__title">${stats.title}</h1>
      <p class="cb-export-card__subtitle">${stats.exportSubtitle}</p>
      <ul class="cb-export-card__stats">
        <li>완료 챕터 ${stats.completedCount}/${stats.totalNodes}</li>
        <li>스트릭 ${stats.streakDays}일</li>
        <li>추억 사진 ${stats.memoryCount}장</li>
        <li>친구 메시지 ${stats.friendMessageCount}명</li>
      </ul>
    </div>
  `;

  return card;
}

/**
 * Mount card off-screen for capture, then remove.
 * @param {HTMLElement} card
 */
export function mountExportCard(card) {
  const host = document.createElement('div');
  host.className = 'export-card-host';
  host.appendChild(card);
  document.body.appendChild(host);
  return () => host.remove();
}

/**
 * @param {HTMLElement} root
 */
export async function waitForExportAssets(root) {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const images = [...root.querySelectorAll('img')];
  await Promise.all(
    images.map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          const done = () => resolve();
          img.addEventListener('load', done, { once: true });
          img.addEventListener('error', done, { once: true });
          if (typeof img.decode === 'function') {
            img.decode().then(done).catch(done);
          }
        })
    )
  );
}

/**
 * @param {HTMLElement} card
 * @returns {Promise<Blob>}
 */
export async function renderExportCardToPngBlob(card) {
  const { toBlob } = await import('https://cdn.jsdelivr.net/npm/html-to-image@1.11.13/+esm');
  await waitForExportAssets(card);

  const blob = await toBlob(card, {
    width: PNG_SIZE.width,
    height: PNG_SIZE.height,
    pixelRatio: 1,
    cacheBust: false,
    backgroundColor: '#112d51',
  });

  if (!blob) {
    throw new Error('html-to-image returned empty blob');
  }
  return blob;
}

/**
 * @param {Blob} blob
 * @param {string} filename
 * @returns {Promise<'download' | 'share' | 'cancelled'>}
 */
export async function deliverPngBlob(blob, filename = EXPORT_FILE_NAME) {
  const file = new File([blob], filename, { type: 'image/png' });

  if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: filename });
      return 'share';
    } catch (error) {
      if (error && typeof error === 'object' && 'name' in error && error.name === 'AbortError') {
        return 'cancelled';
      }
    }
  }

  const url = URL.createObjectURL(blob);
  try {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.rel = 'noopener';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    return 'download';
  } finally {
    // Keep URL briefly for mobile preview fallback callers.
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }
}

/**
 * Show long-press save preview for restricted mobile browsers.
 * @param {Blob} blob
 */
export function showPngPreview(blob) {
  const url = URL.createObjectURL(blob);
  const previouslyFocused = document.activeElement instanceof HTMLElement
    ? document.activeElement
    : null;
  const overlay = document.createElement('div');
  overlay.className = 'cb-confirm-modal__overlay png-preview-overlay';
  overlay.innerHTML = `
    <div class="cb-confirm-modal png-preview" role="dialog" aria-modal="true" aria-labelledby="png-preview-title">
      <h2 id="png-preview-title" class="cb-confirm-modal__title">이미지가 준비됐어요</h2>
      <p class="cb-confirm-modal__body">이미지를 길게 눌러 저장해 주세요.</p>
      <img class="png-preview__img" src="${url}" alt="졸업 축하 카드 미리보기" />
      <div class="cb-confirm-modal__actions">
        <button type="button" class="cb-button cb-button--primary" data-action="close">닫기</button>
      </div>
    </div>
  `;

  const closeBtn = overlay.querySelector('[data-action="close"]');

  const close = () => {
    document.removeEventListener('keydown', onKeyDown);
    overlay.remove();
    URL.revokeObjectURL(url);
    previouslyFocused?.focus();
  };

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  }

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close();
  });
  closeBtn?.addEventListener('click', close);
  document.addEventListener('keydown', onKeyDown);
  document.body.appendChild(overlay);
  requestAnimationFrame(() => closeBtn instanceof HTMLElement && closeBtn.focus());
}
