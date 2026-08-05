/**
 * Minimal lock tooltip — shown near a locked map node.
 */
export function createLockTooltip() {
  const el = document.createElement('div');
  el.className = 'lock-tooltip';
  el.setAttribute('role', 'status');
  el.hidden = true;
  document.body.appendChild(el);

  let hideTimer = 0;

  /**
   * @param {string} message
   * @param {DOMRect} anchorRect
   */
  function show(message, anchorRect) {
    window.clearTimeout(hideTimer);
    el.textContent = message;
    el.hidden = false;

    const gap = 8;
    const tipWidth = Math.min(280, window.innerWidth - 32);
    let left = anchorRect.left + anchorRect.width / 2 - tipWidth / 2;
    left = Math.max(16, Math.min(left, window.innerWidth - tipWidth - 16));
    const top = Math.max(16, anchorRect.top - 52);

    el.style.width = `${tipWidth}px`;
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
    requestAnimationFrame(() => el.classList.add('is-visible'));

    hideTimer = window.setTimeout(() => hide(), 1800);
  }

  function hide() {
    el.classList.remove('is-visible');
    hideTimer = window.setTimeout(() => {
      el.hidden = true;
    }, 160);
  }

  return { show, hide, el };
}
