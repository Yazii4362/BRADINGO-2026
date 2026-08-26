import { t } from '../i18n/index.js';

const BACK_ICON = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

/**
 * Shared top chrome for path / archive screens.
 * Keeps a 3-column grid so the title stays optically centered.
 *
 * @param {{
 *   title: string,
 *   subtitle?: string,
 *   leading?: 'back' | 'close' | 'none',
 *   trailing?: HTMLElement | null,
 *   onLeading?: () => void
 * }} props
 * @returns {HTMLElement}
 */
export function createScreenHeader(props) {
  const leading = props.leading ?? 'back';
  const trailing = props.trailing ?? null;

  const el = document.createElement('header');
  el.className = 'cb-screen-header';

  const leadSlot = document.createElement('div');
  leadSlot.className = 'cb-screen-header__slot cb-screen-header__slot--leading';

  if (leading === 'back' || leading === 'close') {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cb-screen-header__lead';
    btn.setAttribute(
      'aria-label',
      leading === 'close' ? t('quiz.close') : t('chapter.backToMap')
    );
    if (leading === 'back') {
      btn.innerHTML = BACK_ICON;
    } else {
      btn.innerHTML = `<img class="cb-screen-header__close-icon" src="./assets/images/quiz/icon-close.svg" alt="" width="23" height="23" decoding="async" />`;
    }
    btn.addEventListener('click', () => props.onLeading?.());
    leadSlot.appendChild(btn);
  }

  const copy = document.createElement('div');
  copy.className = 'cb-screen-header__copy';

  const title = document.createElement('h1');
  title.className = 'cb-screen-header__title';
  title.textContent = props.title;
  copy.appendChild(title);

  if (props.subtitle) {
    const subtitle = document.createElement('p');
    subtitle.className = 'cb-screen-header__subtitle';
    subtitle.textContent = props.subtitle;
    copy.appendChild(subtitle);
  }

  const trailSlot = document.createElement('div');
  trailSlot.className = 'cb-screen-header__slot cb-screen-header__slot--trailing';
  if (trailing) trailSlot.appendChild(trailing);

  el.append(leadSlot, copy, trailSlot);
  return el;
}
