/**
 * Bottom feedback sheet (correct / incorrect).
 * @param {{
 *   variant: 'correct' | 'incorrect',
 *   title: string,
 *   body: string,
 *   actionLabel: string,
 *   onAction: () => void
 * }} props
 */
export function createFeedbackSheet(props) {
  const el = document.createElement('div');
  el.className = `feedback-sheet is-${props.variant}`;
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.setAttribute('aria-atomic', 'true');

  el.innerHTML = `
    <div class="feedback-sheet__content">
      <p class="feedback-sheet__title">${props.title}</p>
      <p class="feedback-sheet__body">${props.body}</p>
    </div>
    <button type="button" class="btn ${props.variant === 'correct' ? 'btn--primary' : 'btn--danger'} feedback-sheet__action">
      ${props.actionLabel}
    </button>
  `;

  el.querySelector('.feedback-sheet__action')?.addEventListener('click', props.onAction);
  return el;
}
