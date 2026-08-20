/**
 * Path node popover — start (green) or locked (dark) bubble.
 * CB / Map / Node Start Sheet
 * Motion mirrors Duolingo path START / locked level bubble.
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
  const eyebrowHtml = isLocked
    ? ''
    : '<p class="cb-node-start-sheet__eyebrow">시작</p>';
  const ctaLabel = props.actionLabel ?? (isLocked ? '잠김' : '시작하기');

  sheet.innerHTML = `
    <div class="cb-node-start-sheet__notch" aria-hidden="true"></div>
    ${eyebrowHtml}
    <h2 id="node-start-title" class="cb-node-start-sheet__title">${props.title}</h2>
    ${bodyHtml}
    <button
      type="button"
      class="cb-node-start-sheet__cta"
      data-action="start"
      ${isLocked ? 'disabled aria-disabled="true"' : ''}
    >
      ${ctaLabel}
    </button>
  `;

  overlay.appendChild(sheet);
  host.appendChild(overlay);

  const startBtn = sheet.querySelector('[data-action="start"]');
  const notch = sheet.querySelector('.cb-node-start-sheet__notch');
  let closing = false;

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
    document.removeEventListener('scroll', onReposition, true);
    overlay.remove();
    previouslyFocused?.focus();
  }

  /**
   * @param {() => void} [after]
   */
  function close(after) {
    if (closing) return;
    closing = true;
    document.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('resize', onReposition);
    document.removeEventListener('scroll', onReposition, true);

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
    // Capture: map may scroll inside .screen--map / .map-canvas, not window.
    document.addEventListener('scroll', onReposition, true);
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
 * Place bubble under the tapped node, clamped to the viewport.
 * Notch tracks the node center even when the sheet is horizontally clamped.
 * @param {HTMLElement} sheet
 * @param {DOMRect} anchorRect
 * @param {HTMLElement | null} notch
 */
function positionNearAnchor(sheet, anchorRect, notch) {
  const gap = 14;
  const margin = 16;
  const width = Math.min(340, window.innerWidth - margin * 2);
  sheet.style.width = `${width}px`;

  let left = anchorRect.left + anchorRect.width / 2 - width / 2;
  left = Math.max(margin, Math.min(left, window.innerWidth - width - margin));

  let top = anchorRect.bottom + gap;
  const sheetHeight = sheet.offsetHeight || 160;
  if (top + sheetHeight > window.innerHeight - margin) {
    top = Math.max(margin, anchorRect.top - sheetHeight - gap);
    sheet.classList.add('cb-node-start-sheet--above');
  } else {
    sheet.classList.remove('cb-node-start-sheet--above');
  }

  sheet.style.left = `${left}px`;
  sheet.style.top = `${top}px`;

  if (notch) {
    const anchorCenterX = anchorRect.left + anchorRect.width / 2;
    const notchPad = 18;
    const notchX = Math.max(notchPad, Math.min(width - notchPad, anchorCenterX - left));
    notch.style.left = `${notchX}px`;
  }
}
