/**
 * CB / Quiz / Prompt — NEW WORD + instruction + speakable target word.
 * @param {{
 *   badge?: string,
 *   instruction: string,
 *   promptWord?: string,
 *   promptId?: string
 * }} props
 */
export function createQuizPrompt(props) {
  const el = document.createElement('div');
  el.className = 'cb-quiz-prompt';

  const badge = props.badge ?? '새 단어';
  const word = props.promptWord?.trim() || '';

  el.innerHTML = `
    <div class="cb-quiz-prompt__badge">
      <img class="cb-quiz-prompt__badge-icon" src="./assets/images/quiz/icon-new-word.svg" alt="" width="24" height="24" />
      <span class="cb-quiz-prompt__badge-text">${badge}</span>
    </div>
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
    if (!word || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(word);
    utter.lang = /[가-힣]/.test(word) ? 'ko-KR' : 'en-US';
    window.speechSynthesis.speak(utter);
  });

  return el;
}
