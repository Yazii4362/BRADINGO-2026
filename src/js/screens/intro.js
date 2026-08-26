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
    <div class="intro-sky" aria-hidden="true">
      <span class="intro-cloud intro-cloud--a"></span>
      <span class="intro-cloud intro-cloud--b"></span>
      <span class="intro-cloud intro-cloud--c"></span>
      <span class="intro-hill"></span>
      <span class="intro-hill intro-hill--far"></span>
    </div>

    <header class="intro-brand">
      <p class="intro-kicker">${t('brand.courseTitle')}</p>
      <h1 class="intro-wordmark" aria-label="${BRAND.wordmark}">
        <span class="intro-wordmark__mark">${BRAND.wordmark}</span>
      </h1>
    </header>

    <div class="intro-hero">
      <div class="intro-stage">
        <ol class="intro-path" aria-hidden="true">
          <li class="intro-path__node is-done"></li>
          <li class="intro-path__node is-done"></li>
          <li class="intro-path__node is-active"></li>
          <li class="intro-path__node"></li>
          <li class="intro-path__node"></li>
        </ol>

        <button type="button" class="intro-cast" data-action="egg" aria-label="${t('intro.eggAria')}">
          <img
            class="intro-cast__bradie"
            src="./assets/images/ending/hero.webp"
            alt=""
            width="253"
            height="450"
            decoding="async"
            fetchpriority="high"
          />
          <img
            class="intro-cast__irumae"
            src="./assets/images/map/irumae.svg"
            alt=""
            width="131"
            height="144"
            decoding="async"
          />
          <span class="intro-confetti" aria-hidden="true">
            <i></i><i></i><i></i><i></i><i></i><i></i>
          </span>
        </button>
      </div>
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
