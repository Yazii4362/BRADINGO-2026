import { EXPORT_FILE_NAME } from '../constants.js';

export { EXPORT_FILE_NAME } from '../constants.js';

/** Graduation card export uses the site OG thumbnail as the saved image. */
export const EXPORT_IMAGE_SRC = './assets/images/og-thumbnail.jpg';

/** Thumbnail native size (1200×630). Kept for callers that still reference PNG_SIZE. */
export const PNG_SIZE = Object.freeze({ width: 1200, height: 630 });

/** @type {Promise<Blob> | null} */
let preparedBlobPromise = null;

/**
 * Prefetch the export thumbnail so the save tap is ready sooner.
 */
export function prefetchExportLibs() {
  return prepareExportPngBlob();
}

/**
 * Load the OG thumbnail and convert it to a PNG blob for share/download.
 * @param {{ nodeStatus?: Record<string, string> } | null} [_progress]
 * @returns {Promise<Blob>}
 */
export async function prepareExportPngBlob(_progress = null) {
  if (!preparedBlobPromise) {
    preparedBlobPromise = loadThumbnailAsPngBlob().catch((error) => {
      preparedBlobPromise = null;
      throw error;
    });
  }
  return preparedBlobPromise;
}

/**
 * @returns {Promise<Blob>}
 */
async function loadThumbnailAsPngBlob() {
  const response = await fetch(EXPORT_IMAGE_SRC, { cache: 'force-cache' });
  if (!response.ok) {
    throw new Error(`Failed to load export image (${response.status})`);
  }

  const sourceBlob = await response.blob();
  const bitmap = await createImageBitmap(sourceBlob);
  try {
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 2D unavailable');
    }
    ctx.drawImage(bitmap, 0, 0);

    const pngBlob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to encode PNG'));
        },
        'image/png'
      );
    });
    return pngBlob;
  } finally {
    bitmap.close?.();
  }
}

/**
 * @param {unknown} error
 */
function shareErrorName(error) {
  if (error && typeof error === 'object' && 'name' in error && typeof error.name === 'string') {
    return error.name;
  }
  return '';
}

/**
 * Deliver a PNG. Calls navigator.share() before any await when the Web Share
 * API is available, so iOS keeps the user activation from the tap.
 * @param {Blob} blob
 * @param {string} filename
 * @returns {Promise<'download' | 'share' | 'cancelled'>}
 */
export async function deliverPngBlob(blob, filename = EXPORT_FILE_NAME) {
  const file = new File([blob], filename, { type: 'image/png' });

  if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
    try {
      const sharing = navigator.share({ files: [file], title: filename });
      await sharing;
      return 'share';
    } catch (error) {
      const name = shareErrorName(error);
      if (name === 'AbortError') {
        return 'cancelled';
      }
      console.warn('[export] share failed, falling back', name || error);
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
      <p class="cb-confirm-modal__body">이미지를 길게 눌러 저장해 주세요</p>
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
