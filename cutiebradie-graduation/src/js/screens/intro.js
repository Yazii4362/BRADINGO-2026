import { BRAND } from '../data/course.js';
import { t } from '../i18n.js';
import { createCheerHeart } from '../components/cheer-heart.js';
import { createTapUnlock, openCoffeeCoupon } from '../components/coffee-coupon.js';

/**
 * @param {{ onStart: () => void }} props
 */
export function renderIntro(props) {
  const el = document.createElement('section');
  el.className = 'screen screen--intro';
  el.dataset.screen = 'intro';
  el.innerHTML = `
    <h1 class="visually-hidden">${BRAND.wordmark}</h1>
    <img
      class="intro-bg"
      src="./assets/images/intro/bg.webp"
      alt=""
      width="576"
      height="1024"
      decoding="sync"
      fetchpriority="high"
      aria-hidden="true"
    />
    <div class="intro-hero">
      <button type="button" class="intro-egg" data-action="egg" aria-label="${t('intro.eggAria')}"></button>
    </div>
    <div class="intro-dock">
      <p class="intro-lead">${t('intro.lead', { course: BRAND.courseName })}</p>
      <div class="cb-button-row">
        <button type="button" class="cb-button cb-button--primary cb-button--fill" data-action="start">${t('intro.start')}</button>
      </div>
    </div>
  `;

  el.querySelector('.intro-hero')?.appendChild(createCheerHeart({ className: 'intro-cheer' }));

  const unlockEgg = createTapUnlock({
    taps: 5,
    onUnlock: () => openCoffeeCoupon(),
  });

  el.querySelector('[data-action="start"]')?.addEventListener('click', props.onStart);
  el.querySelector('[data-action="egg"]')?.addEventListener('click', unlockEgg);
  return el;
}
