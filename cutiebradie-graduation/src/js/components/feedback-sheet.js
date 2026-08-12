/**
 * Bottom feedback sheet (correct / incorrect).
 * CB / Feedback / Sheet — title + body + CTA (no share/report).
 *
 * @param {{
 *   variant: 'correct' | 'incorrect',
 *   title: string,
 *   body?: string,
 *   actionLabel: string,
 *   onAction: () => void
 * }} props
 */
export function createFeedbackSheet(props) {
  const isCorrect = props.variant === 'correct';
  const body = props.body?.trim() || '';
  const el = document.createElement('div');
  el.className = `cb-feedback-sheet cb-feedback-sheet--${props.variant}`;
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.setAttribute('aria-atomic', 'true');

  el.innerHTML = `
    <div class="cb-feedback-sheet__header">
      <div class="cb-feedback-sheet__status">
        <span class="cb-feedback-sheet__badge" aria-hidden="true">${isCorrect ? CHECK_ICON : CROSS_ICON}</span>
        <div class="cb-feedback-sheet__copy">
          <p class="cb-feedback-sheet__title">${props.title}</p>
          ${body ? `<p class="cb-feedback-sheet__body">${body.replace(/\n/g, '<br />')}</p>` : ''}
        </div>
      </div>
    </div>
    <button type="button" class="cb-feedback-sheet__cta" data-action="continue">
      ${props.actionLabel}
    </button>
  `;

  el.querySelector('[data-action="continue"]')?.addEventListener('click', props.onAction);
  return el;
}

const CHECK_ICON = `
<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
  <circle cx="14" cy="14" r="14" fill="currentColor"/>
  <path d="M8.2 14.2L12.1 18.1L19.8 10.2" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const CROSS_ICON = `
<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
  <circle cx="14" cy="14" r="14" fill="currentColor"/>
  <path d="M9.5 9.5L18.5 18.5M18.5 9.5L9.5 18.5" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>
</svg>`;
