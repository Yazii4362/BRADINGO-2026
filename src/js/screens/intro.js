import { BRAND } from '../data/brand.js';
import { t } from '../i18n/index.js';
import { createTapUnlock, openCreatorSupport } from '../components/creator-promo.js';

/**
 * @param {{ onStart: () => void }} props
 */
export function renderIntro(props) {
  const el = document.createElement('section');
  el.className = 'screen screen--intro';
  el.dataset.screen = 'intro';
  el.innerHTML = `
    <header class="intro-brand">
      <svg class="intro-wordmark" viewBox="0 0 280 44" role="img" aria-label="${BRAND.wordmark}">
        <title>${BRAND.wordmark}</title>
        <text
          x="140"
          y="34"
          text-anchor="middle"
          fill="currentColor"
          font-family="Nunito, 'Noto Sans KR', sans-serif"
          font-size="36"
          font-weight="900"
          letter-spacing="0.04em"
        >${BRAND.wordmark}</text>
      </svg>
      <p class="intro-course">${t('brand.courseTitle')}</p>
    </header>

    <div class="intro-hero">
      <button type="button" class="intro-egg" data-action="egg" aria-label="${t('intro.eggAria')}">
        <span class="intro-egg__shell" aria-hidden="true"></span>
      </button>
      <span class="intro-sparks" aria-hidden="true">
        <i class="intro-sparks__dot intro-sparks__dot--lg"></i>
        <i class="intro-sparks__dot intro-sparks__dot--sm"></i>
      </span>
    </div>

    <div class="intro-footer">
      <p class="intro-lead">${t('intro.lead', { course: BRAND.courseName })}</p>
      <button
        type="button"
        class="cb-button cb-button--primary cb-button--fill intro-start"
        data-action="start"
      >${t('intro.start')}</button>
    </div>
  `;

  const unlockEgg = createTapUnlock({
    taps: 5,
    onUnlock: () => openCreatorSupport({ variant: 'easter' }),
  });

  el.querySelector('[data-action="start"]')?.addEventListener('click', props.onStart);
  el.querySelector('[data-action="egg"]')?.addEventListener('click', unlockEgg);
  return el;
}
