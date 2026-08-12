const CLOSE_ICON = `
<svg width="28" height="28" viewBox="0 0 23 23" fill="none" aria-hidden="true">
  <path d="M11.23 13.39 2.86 21.76a1.67 1.67 0 0 1-2.36-2.36L8.87 11.03.5 2.66A1.67 1.67 0 0 1 2.86.3l8.37 8.37L19.6.3a1.67 1.67 0 1 1 2.36 2.36l-8.37 8.37 8.37 8.37a1.67 1.67 0 1 1-2.36 2.36l-8.37-8.37Z" fill="#B0ADB1"/>
</svg>
`;

/**
 * CB / Quiz / Progress Header — close + lesson progress bar.
 * Shared top chrome height with CB / App Header (`--header-height`).
 * @param {{
 *   progress?: number,
 *   onClose: () => void
 * }} props
 */
export function createQuizProgressHeader(props) {
  const progress = Math.max(0, Math.min(1, props.progress ?? 0.08));
  const el = document.createElement('header');
  el.className = 'cb-quiz-progress';

  el.innerHTML = `
    <button type="button" class="cb-quiz-progress__close" aria-label="문제 닫기" data-action="close">
      ${CLOSE_ICON}
    </button>
    <div class="cb-quiz-progress__track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(progress * 100)}" aria-label="진행도">
      <div class="cb-quiz-progress__fill" style="width: ${progress * 100}%">
        <span class="cb-quiz-progress__shine" aria-hidden="true"></span>
      </div>
    </div>
  `;

  el.querySelector('[data-action="close"]')?.addEventListener('click', props.onClose);
  return el;
}
