/**
 * Active-node start sheet — chapter title + CTA.
 * CB / Map / Node Start Sheet
 * Motion mirrors Duolingo path START → lesson enter.
 *
 * @param {{
 *   title: string,
 *   actionLabel?: string,
 *   onStart: () => void,
 *   onDismiss?: () => void
 * }} props
 */
export function openNodeStartSheet(props) {
  const previouslyFocused = document.activeElement instanceof HTMLElement
    ? document.activeElement
    : null;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const host = document.getElementById('app') ?? document.body;

  const overlay = document.createElement('div');
  overlay.className = 'cb-node-start-sheet__overlay';
  overlay.setAttribute('role', 'presentation');

  const sheet = document.createElement('div');
  sheet.className = 'cb-node-start-sheet';
  sheet.setAttribute('role', 'dialog');
  sheet.setAttribute('aria-modal', 'false');
  sheet.setAttribute('aria-labelledby', 'node-start-title');

  sheet.innerHTML = `
    <div class="cb-node-start-sheet__notch" aria-hidden="true"></div>
    <p class="cb-node-start-sheet__eyebrow">START</p>
    <h2 id="node-start-title" class="cb-node-start-sheet__title">${props.title}</h2>
    <button type="button" class="cb-node-start-sheet__cta" data-action="start">
      ${props.actionLabel ?? '시작하기'}
    </button>
  `;

  overlay.appendChild(sheet);
  host.appendChild(overlay);

  const startBtn = sheet.querySelector('[data-action="start"]');
  let closing = false;

  function finishClose() {
    document.removeEventListener('keydown', onKeyDown);
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

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      props.onDismiss?.();
      close();
    }
  });

  startBtn?.addEventListener('click', () => {
    if (!(startBtn instanceof HTMLElement) || closing) return;
    startBtn.classList.add('is-pressed');
    close(() => props.onStart());
  });

  document.addEventListener('keydown', onKeyDown);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.classList.add('is-open');
      if (startBtn instanceof HTMLElement) startBtn.focus();
    });
  });

  return { close: () => close() };
}
