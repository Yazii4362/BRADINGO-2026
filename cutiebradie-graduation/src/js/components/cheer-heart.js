import { t } from '../i18n.js';

/**
 * Shared “leave a heart” button — intro + ending.
 * @param {{ className?: string }} [props]
 * @returns {HTMLDivElement}
 */
export function createCheerHeart(props = {}) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wrap = document.createElement('div');
  wrap.className = props.className ? `cb-cheer ${props.className}` : 'cb-cheer';

  wrap.innerHTML = `
    <button type="button" class="cb-cheer__heart" data-action="cheer">
      <span class="cb-cheer__glyph" aria-hidden="true">💚</span>
      <span class="cb-cheer__label">${t('ending.cheerCta')}</span>
    </button>
  `;

  const btn = wrap.querySelector('[data-action="cheer"]');
  btn?.addEventListener('click', () => {
    if (!(btn instanceof HTMLButtonElement) || btn.disabled) return;
    const glyph = btn.querySelector('.cb-cheer__glyph');
    if (glyph instanceof HTMLElement) {
      glyph.classList.remove('is-pop');
      void glyph.offsetWidth;
      glyph.classList.add('is-pop');
    }
    spawnHeartBurst(wrap, reduceMotion);
    const label = btn.querySelector('.cb-cheer__label');
    if (label) label.textContent = t('ending.cheerToast');
    btn.classList.add('is-sent');
    btn.disabled = true;
  });

  return wrap;
}

/**
 * @param {Element | null} host
 * @param {boolean} reduceMotion
 */
function spawnHeartBurst(host, reduceMotion) {
  if (!host || reduceMotion) return;
  const burst = document.createElement('div');
  burst.className = 'cb-cheer-burst';
  burst.setAttribute('aria-hidden', 'true');
  const glyphs = ['💚', '💚', '💚', '💕', '💚', '💚', '💚', '💚'];
  for (let i = 0; i < glyphs.length; i += 1) {
    const heart = document.createElement('span');
    heart.className = 'cb-cheer-burst__item';
    heart.textContent = glyphs[i];
    heart.style.setProperty('--i', String(i));
    heart.style.setProperty('--dx', `${(i - (glyphs.length - 1) / 2) * 22}px`);
    heart.style.setProperty('--dy', `${-52 - (i % 3) * 18}px`);
    heart.style.setProperty('--rot', `${(i - 3.5) * 12}deg`);
    burst.appendChild(heart);
  }
  host.appendChild(burst);
  window.setTimeout(() => burst.remove(), 1000);
}
