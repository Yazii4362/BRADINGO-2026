import { createAnswerTile } from '../components/answer-tile.js';
import { DEFAULT_LOCALE, isLocaleId, tFor } from '../i18n.js';

/** @typedef {{ id: string, flag: string }} LangOption */

/** Country flag icons remapped to correct national marks (SVG tiles). */
/** @type {LangOption[]} */
const LANGUAGES = [
  { id: 'ko', flag: './assets/images/lang/flag-ko.svg' },
  { id: 'en', flag: './assets/images/lang/flag-en.svg' },
  { id: 'ja', flag: './assets/images/lang/flag-ja.svg' },
  { id: 'es', flag: './assets/images/lang/flag-es.svg' },
];

/** Map character illustration (swapped with lang Bradie animation). */
const LANG_HERO_ILLUST = './assets/images/map-irumae.svg';

/**
 * @param {{ onContinue: (langId: string) => void }} props
 */
export function renderLangSelect(props) {
  const el = document.createElement('section');
  el.className = 'screen screen--lang';
  el.dataset.screen = 'lang';

  let selectedId = DEFAULT_LOCALE;

  const hero = document.createElement('div');
  hero.className = 'lang-hero';

  const duo = document.createElement('img');
  duo.className = 'lang-hero__duo';
  duo.src = LANG_HERO_ILLUST;
  duo.alt = '';
  duo.width = 131;
  duo.height = 144;
  duo.decoding = 'async';
  duo.setAttribute('aria-hidden', 'true');

  const bubble = document.createElement('div');
  bubble.className = 'lang-bubble';
  bubble.setAttribute('role', 'status');
  bubble.innerHTML = '<p class="lang-bubble__text" data-role="bubble"></p>';

  hero.append(duo, bubble);

  const divider = document.createElement('div');
  divider.className = 'lang-divider';
  divider.setAttribute('aria-hidden', 'true');

  const list = document.createElement('ul');
  list.className = 'lang-list answer-list answer-list--grid-2x2';
  list.setAttribute('role', 'listbox');
  list.dataset.role = 'list';

  /** @type {Map<string, HTMLButtonElement>} */
  const tiles = new Map();

  LANGUAGES.forEach((lang) => {
    const item = document.createElement('li');
    item.className = 'lang-list__item';
    const tile = createAnswerTile({
      id: lang.id,
      image: lang.flag,
      alt: lang.id,
      label: '',
      selected: lang.id === selectedId,
      role: 'option',
      ariaSelected: lang.id === selectedId,
      className: 'lang-option',
    });
    tile.dataset.lang = lang.id;
    tile.addEventListener('click', () => selectLang(lang.id));
    tiles.set(lang.id, tile);
    item.appendChild(tile);
    list.appendChild(item);
  });

  const footer = document.createElement('div');
  footer.className = 'lang-footer';
  const continueBtn = document.createElement('button');
  continueBtn.type = 'button';
  continueBtn.className = 'cb-button cb-button--primary cb-button--fill';
  continueBtn.dataset.action = 'continue';
  continueBtn.addEventListener('click', () => props.onContinue(selectedId));
  footer.appendChild(continueBtn);

  el.append(hero, divider, list, footer);

  const bubbleEl = el.querySelector('[data-role="bubble"]');

  /**
   * @param {string} langId
   */
  function paintCopy(langId) {
    const locale = isLocaleId(langId) ? langId : DEFAULT_LOCALE;
    if (bubbleEl) bubbleEl.innerHTML = tFor(locale, 'lang.bubble');
    list.setAttribute('aria-label', tFor(locale, 'lang.listAria'));
    continueBtn.textContent = tFor(locale, 'lang.continue');

    tiles.forEach((tile, id) => {
      const label = tFor(locale, `lang.${id}`);
      const media = tile.querySelector('.cb-answer-card__media');
      let labelEl = tile.querySelector('.cb-answer-card__label');
      if (!labelEl) {
        labelEl = document.createElement('span');
        labelEl.className = 'cb-answer-card__label';
        tile.appendChild(labelEl);
      }
      labelEl.textContent = label;
      labelEl.dataset.role = 'label';
      tile.classList.remove('cb-answer-card--media-only');
      tile.setAttribute('aria-label', label);
      if (!media) return;
      const img = media.querySelector('img');
      if (img) img.alt = label;
    });
  }

  /**
   * @param {string} langId
   */
  function selectLang(langId) {
    selectedId = langId;
    tiles.forEach((tile, id) => {
      const isSelected = id === langId;
      tile.classList.toggle('is-selected', isSelected);
      tile.classList.toggle('cb-answer-card--selected', isSelected);
      tile.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });
    paintCopy(langId);
  }

  paintCopy(selectedId);
  return el;
}
