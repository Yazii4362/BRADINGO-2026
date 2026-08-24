/**
 * Accessible confirm modal with backdrop, Escape, and basic focus handling.
 * CB / Overlay / Confirm Modal
 * @param {{
 *   title: string,
 *   body: string,
 *   confirmLabel: string,
 *   cancelLabel: string,
 *   confirmVariant?: 'primary' | 'danger',
 *   onConfirm: () => void,
 *   onCancel: () => void
 * }} props
 */
export function openConfirmModal(props) {
  const confirmClass =
    props.confirmVariant === 'danger'
      ? 'cb-button cb-button--danger'
      : 'cb-button cb-button--primary';

  const previouslyFocused = document.activeElement instanceof HTMLElement
    ? document.activeElement
    : null;

  const overlay = document.createElement('div');
  overlay.className = 'cb-confirm-modal__overlay';
  overlay.setAttribute('role', 'presentation');

  const dialog = document.createElement('div');
  dialog.className = 'cb-confirm-modal';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'confirm-modal-title');
  dialog.setAttribute('aria-describedby', 'confirm-modal-desc');

  dialog.innerHTML = `
    <h2 id="confirm-modal-title" class="cb-confirm-modal__title">${props.title}</h2>
    <p id="confirm-modal-desc" class="cb-confirm-modal__body">${props.body}</p>
    <div class="cb-confirm-modal__actions">
      <button type="button" class="cb-button cb-button--ghost cb-button--fill" data-action="cancel">${props.cancelLabel}</button>
      <button type="button" class="${confirmClass} cb-button--fill" data-action="confirm">${props.confirmLabel}</button>
    </div>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  const cancelBtn = dialog.querySelector('[data-action="cancel"]');
  const confirmBtn = dialog.querySelector('[data-action="confirm"]');
  const focusables = [cancelBtn, confirmBtn].filter(Boolean);

  function close() {
    document.removeEventListener('keydown', onKeyDown);
    overlay.remove();
    previouslyFocused?.focus();
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      props.onCancel();
      close();
      return;
    }
    if (event.key !== 'Tab' || focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      props.onCancel();
      close();
    }
  });

  cancelBtn?.addEventListener('click', () => {
    props.onCancel();
    close();
  });

  confirmBtn?.addEventListener('click', () => {
    props.onConfirm();
    close();
  });

  document.addEventListener('keydown', onKeyDown);
  requestAnimationFrame(() => cancelBtn?.focus());

  return { close };
}
