import { getChapterByNodeId } from '../data/course.js';
import { t } from '../i18n.js';

const BACK_ICON = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

/**
 * Lightweight path chapter (non-quiz content gate).
 * @param {{
 *   nodeId: string,
 *   title: string,
 *   mode: 'play' | 'replay',
 *   onBackToMap: () => void,
 *   onComplete: () => void
 * }} props
 */
export function renderChapter(props) {
  const content = getChapterByNodeId(props.nodeId);
  const localizedBody = t(`chapter.${props.nodeId}.body`);
  const body =
    (!localizedBody.startsWith('chapter.') && localizedBody) ||
    content?.body ||
    '';

  const el = document.createElement('section');
  el.className = 'screen screen--chapter';
  el.dataset.screen = 'chapter';
  el.dataset.nodeId = props.nodeId;

  const header = document.createElement('header');
  header.className = 'chapter-header';
  header.innerHTML = `
    <button type="button" class="chapter-back" aria-label="${t('quiz.close')}">${BACK_ICON}</button>
    <h1 class="chapter-title">${props.title}</h1>
  `;
  header.querySelector('.chapter-back')?.addEventListener('click', () => {
    props.onBackToMap();
  });

  const main = document.createElement('div');
  main.className = 'chapter-body';
  main.innerHTML = `
    <img
      class="chapter-art"
      src="./assets/images/quiz/n2-character-full.png"
      alt=""
      width="220"
      height="220"
      decoding="async"
    />
    <p class="chapter-copy">${body}</p>
  `;

  const footer = document.createElement('footer');
  footer.className = 'chapter-footer';
  const completeBtn = document.createElement('button');
  completeBtn.type = 'button';
  completeBtn.className = 'cb-button cb-button--primary cb-button--fill';
  completeBtn.textContent =
    props.mode === 'replay' ? t('chapter.backToMap') : t('chapter.complete');
  completeBtn.addEventListener('click', () => props.onComplete());
  footer.appendChild(completeBtn);

  el.append(header, main, footer);
  return el;
}
