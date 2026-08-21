/**
 * Path node popover — start (green) or locked (dark) bubble.
 * CB / Map / Node Start Sheet
 *
 * @param {{
 *   title: string,
 *   body?: string,
 *   actionLabel?: string,
 *   variant?: 'start' | 'locked',
 *   anchorRect?: DOMRect | null,
 *   anchorEl?: HTMLElement | null,
 *   onStart?: () => void,
 *   onDismiss?: () => void
 * }} props
 */
export function openNodeStartSheet(props) {
  const variant = props.variant ?? 'start';
  const isLocked = variant === 'locked';
  const previouslyFocused = document.activeElement instanceof HTMLElement
    ? document.activeElement
    : null;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const host = document.getElementById('app') ?? document.body;
  const hasAnchor = Boolean(props.anchorEl || props.anchorRect);

  document.querySelector('.cb-node-start-sheet__overlay')?.remove();

  const overlay = document.createElement('div');
  overlay.className = `cb-node-start-sheet__overlay${
    hasAnchor ? ' cb-node-start-sheet__overlay--anchored' : ''
  }`;
  overlay.setAttribute('role', 'presentation');

  const sheet = document.createElement('div');
  sheet.className = `cb-node-start-sheet${isLocked ? ' cb-node-start-sheet--locked' : ''}`;
  sheet.setAttribute('role', 'dialog');
  sheet.setAttribute('aria-modal', 'false');
  sheet.setAttribute('aria-labelledby', 'node-start-title');
  sheet.tabIndex = -1;

  const bodyHtml = props.body
    ? `<p class="cb-node-start-sheet__body">${props.body}</p>`
    : '';

  const ctaHtml = isLocked
    ? ''
    : `<button
        type="button"
        class="cb-node-start-sheet__cta"
        data-action="start"
      >
        ${props.actionLabel ?? ''}
      </button>`;

  sheet.innerHTML = `
    <div class="cb-node-start-sheet__notch" aria-hidden="true"></div>
    <h2 id="node-start-title" class="cb-node-start-sheet__title">${props.title}</h2>
    ${bodyHtml}
    ${ctaHtml}
  `;

  overlay.appendChild(sheet);
  host.appendChild(overlay);

  const startBtn = sheet.querySelector('[data-action="start"]');
  const notch = sheet.querySelector('.cb-node-start-sheet__notch');
  let closing = false;
  const ignoreScrollUntil = Date.now() + 180;

  function readAnchorRect() {
    const el = props.anchorEl;
    if (el instanceof HTMLElement && el.isConnected) {
      const circle = el.matches('.cb-map-node') ? el : el.querySelector('.cb-map-node');
      if (circle instanceof HTMLElement) {
        return circle.getBoundingClientRect();
      }
      return el.getBoundingClientRect();
    }
    return props.anchorRect ?? null;
  }

  function reposition() {
    if (closing) return;
    const rect = readAnchorRect();
    if (rect && rect.width) {
      positionNearAnchor(sheet, rect, notch instanceof HTMLElement ? notch : null);
    }
  }

  if (hasAnchor) {
    reposition();
  }

  function finishClose() {
    document.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('resize', onReposition);
    window.removeEventListener('orientationchange', onReposition);
    window.visualViewport?.removeEventListener('resize', onReposition);
    window.visualViewport?.removeEventListener('scroll', onReposition);
    detachScrollClosers();
    overlay.remove();
    previouslyFocused?.focus();
  }

  /** @type {Array<() => void>} */
  const scrollCloserCleanups = [];

  function detachScrollClosers() {
    while (scrollCloserCleanups.length) {
      scrollCloserCleanups.pop()?.();
    }
  }

  /**
   * @param {() => void} [after]
   */
  function close(after) {
    if (closing) return;
    closing = true;
    document.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('resize', onReposition);
    window.removeEventListener('orientationchange', onReposition);
    window.visualViewport?.removeEventListener('resize', onReposition);
    window.visualViewport?.removeEventListener('scroll', onReposition);
    detachScrollClosers();

    if (reduceMotion) {
      finishClose();
      after?.();
      return;
    }

    overlay.classList.remove('is-open');
    overlay.classList.add('is-leaving');

    let done = false;
    const complete = () => {
      if (done) return;
      done = true;
      finishClose();
      after?.();
    };

    overlay.addEventListener('transitionend', complete, { once: true });
    window.setTimeout(complete, 280);
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      props.onDismiss?.();
      close();
    }
  }

  function onReposition() {
    reposition();
  }

  function onMapScrollClose() {
    if (closing) return;
    if (Date.now() < ignoreScrollUntil) return;
    props.onDismiss?.();
    close();
  }

  /**
   * Bind close-on-scroll to the real map scroller(s), not document (scroll doesn't bubble).
   */
  function attachScrollClosers() {
    const roots = new Set();
    const anchor = props.anchorEl;
    if (anchor instanceof HTMLElement) {
      const mapScreen = anchor.closest('.screen--map');
      const canvas = anchor.closest('.map-canvas');
      if (mapScreen) roots.add(mapScreen);
      if (canvas) roots.add(canvas);
    }
    document.querySelectorAll('.screen--map, .map-canvas').forEach((node) => roots.add(node));

    roots.forEach((node) => {
      node.addEventListener('scroll', onMapScrollClose, { passive: true });
      scrollCloserCleanups.push(() => node.removeEventListener('scroll', onMapScrollClose));
    });
  }

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      props.onDismiss?.();
      close();
    }
  });

  if (!isLocked) {
    startBtn?.addEventListener('click', () => {
      if (!(startBtn instanceof HTMLElement) || closing) return;
      startBtn.classList.add('is-pressed');
      close(() => props.onStart?.());
    });
  }

  document.addEventListener('keydown', onKeyDown);
  if (hasAnchor) {
    window.addEventListener('resize', onReposition);
    window.addEventListener('orientationchange', onReposition);
    window.visualViewport?.addEventListener('resize', onReposition);
    window.visualViewport?.addEventListener('scroll', onReposition);
    attachScrollClosers();
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (hasAnchor) reposition();
      overlay.classList.add('is-open');
      if (!isLocked && startBtn instanceof HTMLButtonElement && !startBtn.disabled) {
        startBtn.focus();
      } else {
        sheet.focus();
      }
    });
  });

  return { close: () => close() };
}

/**
 * @returns {{ left: number, right: number, top: number, bottom: number, width: number }}
 */
function getPlacementBounds() {
  const margin = 12;
  const app = document.getElementById('app');
  const appRect = app?.getBoundingClientRect();
  const vv = window.visualViewport;
  const viewLeft = vv?.offsetLeft ?? 0;
  const viewTop = vv?.offsetTop ?? 0;
  const viewRight = viewLeft + (vv?.width ?? window.innerWidth);
  const viewBottom = viewTop + (vv?.height ?? window.innerHeight);

  const frameLeft = appRect ? Math.max(appRect.left, viewLeft) : viewLeft;
  const frameRight = appRect ? Math.min(appRect.right, viewRight) : viewRight;
  const frameTop = appRect ? Math.max(appRect.top, viewTop) : viewTop;
  let frameBottom = appRect ? Math.min(appRect.bottom, viewBottom) : viewBottom;

  const gnb = document.getElementById('app-gnb');
  if (gnb) {
    const gnbRect = gnb.getBoundingClientRect();
    if (gnbRect.height > 0) {
      frameBottom = Math.min(frameBottom, gnbRect.top);
    }
  }

  const safeBottom =
    Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)')
    ) || 0;
  // env() via getPropertyValue often returns empty; use padding from GNB instead.
  void safeBottom;

  const left = frameLeft + margin;
  const right = frameRight - margin;
  const top = frameTop + margin;
  const bottom = frameBottom - margin;

  return {
    left,
    right,
    top,
    bottom,
    width: Math.max(0, right - left),
  };
}

/**
 * Place bubble under/above the tapped node, clamped to #app ∩ visual viewport above GNB.
 * Notch tracks the node center even when the sheet is horizontally clamped.
 * @param {HTMLElement} sheet
 * @param {DOMRect} anchorRect
 * @param {HTMLElement | null} notch
 */
function positionNearAnchor(sheet, anchorRect, notch) {
  const gap = 14;
  const bounds = getPlacementBounds();
  const width = Math.min(320, Math.max(200, bounds.width));
  sheet.style.width = `${width}px`;

  const anchorCenterX = anchorRect.left + anchorRect.width / 2;
  let left = anchorCenterX - width / 2;
  left = Math.max(bounds.left, Math.min(left, bounds.right - width));

  const sheetHeight = sheet.offsetHeight || (sheet.classList.contains('cb-node-start-sheet--locked') ? 96 : 140);
  let top = anchorRect.bottom + gap;
  const fitsBelow = top + sheetHeight <= bounds.bottom;
  const aboveTop = anchorRect.top - sheetHeight - gap;
  const fitsAbove = aboveTop >= bounds.top;

  if (!fitsBelow && fitsAbove) {
    top = aboveTop;
    sheet.classList.add('cb-node-start-sheet--above');
  } else if (!fitsBelow && !fitsAbove) {
    // Prefer above when near bottom (GNB), else below — then clamp.
    if (anchorRect.bottom > (bounds.top + bounds.bottom) / 2) {
      top = Math.max(bounds.top, Math.min(aboveTop, bounds.bottom - sheetHeight));
      sheet.classList.add('cb-node-start-sheet--above');
    } else {
      top = Math.max(bounds.top, Math.min(top, bounds.bottom - sheetHeight));
      sheet.classList.remove('cb-node-start-sheet--above');
    }
  } else {
    sheet.classList.remove('cb-node-start-sheet--above');
  }

  top = Math.max(bounds.top, Math.min(top, bounds.bottom - sheetHeight));

  sheet.style.left = `${left}px`;
  sheet.style.top = `${top}px`;

  if (notch) {
    const notchPad = 18;
    const notchX = Math.max(notchPad, Math.min(width - notchPad, anchorCenterX - left));
    notch.style.left = `${notchX}px`;
  }
}
