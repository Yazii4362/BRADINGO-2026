const CLOSE_ICON = `
<img class="cb-quiz-progress__close-icon" src="./assets/images/quiz/icon-close.svg" alt="" width="23" height="23" decoding="async" />
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
      <div class="cb-quiz-progress__fill" style="width: ${Math.max(progress * 100, 4)}%">
        <span class="cb-quiz-progress__shine" aria-hidden="true"></span>
      </div>
    </div>
  `;

  el.querySelector('[data-action="close"]')?.addEventListener('click', props.onClose);

  /**
   * @param {number} next
   */
  el.setProgress = (next) => {
    const value = Math.max(0, Math.min(1, next));
    const track = el.querySelector('.cb-quiz-progress__track');
    const fill = el.querySelector('.cb-quiz-progress__fill');
    if (track instanceof HTMLElement) {
      track.setAttribute('aria-valuenow', String(Math.round(value * 100)));
    }
    if (fill instanceof HTMLElement) {
      fill.style.width = `${Math.max(value * 100, 4)}%`;
    }
  };

  return el;
}
