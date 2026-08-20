import { BRAND } from '../data/course.js';
import { t } from '../i18n.js';
import { createTapUnlock, openCoffeeCoupon } from '../components/coffee-coupon.js';

/**
 * @param {{ onStart: () => void }} props
 */
export function renderIntro(props) {
  const el = document.createElement('section');
  el.className = 'screen screen--intro';
  el.dataset.screen = 'intro';
  el.innerHTML = `
    <div class="intro-hero" aria-hidden="true">
      <button type="button" class="intro-egg" data-action="egg" aria-label="${t('intro.eggAria')}">
        <img
          class="intro-hero__img"
          src="./assets/images/intro-character.png"
          alt=""
          width="544"
          height="934"
          decoding="async"
        />
      </button>
    </div>
    <h1 class="intro-wordmark">
      <img
        class="intro-wordmark__img"
        src="./assets/images/logo.png"
        alt="${BRAND.wordmark}"
        width="860"
        height="244"
        decoding="async"
      />
    </h1>
    <p class="screen__body intro-lead">
      ${t('intro.lead', { course: BRAND.courseName })}
    </p>
    <div class="cb-button-row">
      <button type="button" class="cb-button cb-button--primary cb-button--fill" data-action="start">${t('intro.start')}</button>
    </div>
  `;

  const unlockEgg = createTapUnlock({
    taps: 5,
    onUnlock: () => openCoffeeCoupon(),
  });

  el.querySelector('[data-action="start"]')?.addEventListener('click', props.onStart);
  el.querySelector('[data-action="egg"]')?.addEventListener('click', unlockEgg);
  return el;
}
