/**
 * Bottom feedback sheet (correct / incorrect).
 * CB / Feedback / Sheet — Figma 96:2865
 *
 * @param {{
 *   variant: 'correct' | 'incorrect',
 *   title: string,
 *   actionLabel: string,
 *   onAction: () => void
 * }} props
 */
export function createFeedbackSheet(props) {
  const isCorrect = props.variant === 'correct';
  const el = document.createElement('div');
  el.className = `cb-feedback-sheet cb-feedback-sheet--${props.variant}`;
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.setAttribute('aria-atomic', 'true');

  el.innerHTML = `
    <div class="cb-feedback-sheet__header">
      <div class="cb-feedback-sheet__status">
        <span class="cb-feedback-sheet__badge" aria-hidden="true">${isCorrect ? CHECK_ICON : CROSS_ICON}</span>
        <p class="cb-feedback-sheet__title">${props.title}</p>
      </div>
      <div class="cb-feedback-sheet__tools">
        <button type="button" class="cb-feedback-sheet__tool" aria-label="공유" tabindex="-1">${SHARE_ICON}</button>
        <button type="button" class="cb-feedback-sheet__tool" aria-label="신고" tabindex="-1">${FLAG_ICON}</button>
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

const SHARE_ICON = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M12 3v11" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M8.5 6.5L12 3l3.5 3.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M5 13v5.5A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V13" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
</svg>`;

const FLAG_ICON = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M5 21V4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M5 5h10.5l-1.8 3.2 1.8 3.2H5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
