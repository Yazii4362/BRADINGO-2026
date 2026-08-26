import { speakText } from '../lib/speech.js';

/**
 * CB / Quiz / Prompt — badge + instruction (+ optional speakable target word).
 * @param {{
 *   badge?: string,
 *   badgeVariant?: 'new-word' | 'hard',
 *   instruction: string,
 *   promptWord?: string,
 *   promptId?: string
 * }} props
 */
export function createQuizPrompt(props) {
  const el = document.createElement('div');
  el.className = 'cb-quiz-prompt';

  const badge = props.badge?.trim() || '';
  const variant =
    props.badgeVariant ??
    (badge === '어려운 문제' || badge === 'Hard exercise' || badge === 'むずかしい問題' || badge === 'Ejercicio difícil'
      ? 'hard'
      : badge
        ? 'new-word'
        : '');
  const word = props.promptWord?.trim() || '';
  const iconSrc =
    variant === 'hard'
      ? './assets/images/quiz/icon-hard.svg'
      : './assets/images/quiz/icon-new-word.svg';

  if (variant) el.dataset.badgeVariant = variant;

  el.innerHTML = `
    ${
      badge
        ? `<div class="cb-quiz-prompt__badge">
            <img class="cb-quiz-prompt__badge-icon" src="${iconSrc}" alt="" width="24" height="24" />
            <span class="cb-quiz-prompt__badge-text">${badge}</span>
          </div>`
        : ''
    }
    <h1 class="cb-quiz-prompt__title" id="${props.promptId ?? 'quiz-question-title'}">${props.instruction}</h1>
    ${
      word
        ? `<div class="cb-quiz-prompt__word-row">
            <button type="button" class="cb-quiz-prompt__speak" aria-label="${word} 듣기" data-action="speak">
              <img src="./assets/images/quiz/icon-speaker.svg" alt="" width="40" height="36" />
            </button>
            <p class="cb-quiz-prompt__word">${word}</p>
          </div>`
        : ''
    }
  `;

  el.querySelector('[data-action="speak"]')?.addEventListener('click', () => {
    if (!word) return;
    speakText(word);
  });

  return el;
}
