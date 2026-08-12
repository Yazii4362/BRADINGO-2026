import { BRAND } from '../data/course.js';

/**
 * @param {{ onStart: () => void }} props
 */
export function renderIntro(props) {
  const el = document.createElement('section');
  el.className = 'screen screen--intro';
  el.dataset.screen = 'intro';
  el.innerHTML = `
    <h1 class="screen__title intro-wordmark">${BRAND.wordmark}</h1>
    <p class="screen__body intro-lead">
      병건이의 <strong>${BRAND.courseName}</strong>,<br>마지막 코스가 열렸어요. 🎓
    </p>
    <div class="cb-button-row">
      <button type="button" class="cb-button cb-button--primary cb-button--fill" data-action="start">여정 시작하기</button>
    </div>
  `;
  el.querySelector('[data-action="start"]')?.addEventListener('click', props.onStart);
  return el;
}
