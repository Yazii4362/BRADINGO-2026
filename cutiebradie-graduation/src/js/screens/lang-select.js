import { DEFAULT_LOCALE, isLocaleId, tFor } from '../i18n.js';

/** @typedef {{ id: string, flag: string }} LangOption */

/** @type {LangOption[]} */
const LANGUAGES = [
  { id: 'ko', flag: './assets/images/lang/flag-ko.svg' },
  { id: 'en', flag: './assets/images/lang/flag-en.png' },
  { id: 'ja', flag: './assets/images/lang/flag-jp.png' },
  { id: 'es', flag: './assets/images/lang/flag-es.png' },
];

/**
 * @param {{ onContinue: (langId: string) => void }} props
 */
export function renderLangSelect(props) {
  const el = document.createElement('section');
  el.className = 'screen screen--lang';
  el.dataset.screen = 'lang';

  let selectedId = DEFAULT_LOCALE;

  el.innerHTML = `
    <div class="lang-hero">
      <img
        class="lang-hero__duo"
        src="./assets/images/lang/bradie-owl.png"
        alt=""
        width="278"
        height="278"
        decoding="async"
      />
      <div class="lang-bubble" role="status">
        <p class="lang-bubble__text" data-role="bubble"></p>
      </div>
    </div>
    <div class="lang-divider" aria-hidden="true"></div>
    <ul class="lang-list" role="listbox" data-role="list" aria-label="">
      ${LANGUAGES.map(
        (lang) => `
        <li>
          <button
            type="button"
            class="lang-option${lang.id === selectedId ? ' is-selected' : ''}"
            role="option"
            aria-selected="${lang.id === selectedId ? 'true' : 'false'}"
            data-lang="${lang.id}"
          >
            <span class="lang-option__flag" aria-hidden="true">
              <img src="${lang.flag}" alt="" width="46" height="38" decoding="async" />
            </span>
            <span class="lang-option__label" data-role="label"></span>
          </button>
        </li>`
      ).join('')}
    </ul>
    <div class="lang-footer">
      <button type="button" class="cb-button cb-button--primary cb-button--fill" data-action="continue"></button>
    </div>
  `;

  const bubbleEl = el.querySelector('[data-role="bubble"]');
  const listEl = el.querySelector('[data-role="list"]');
  const continueBtn = el.querySelector('[data-action="continue"]');

  /**
   * @param {string} langId
   */
  function paintCopy(langId) {
    const locale = isLocaleId(langId) ? langId : DEFAULT_LOCALE;
    if (bubbleEl) bubbleEl.innerHTML = tFor(locale, 'lang.bubble');
    if (listEl) listEl.setAttribute('aria-label', tFor(locale, 'lang.listAria'));
    if (continueBtn) continueBtn.textContent = tFor(locale, 'lang.continue');

    el.querySelectorAll('[data-lang]').forEach((btn) => {
      const id = btn.getAttribute('data-lang');
      const label = btn.querySelector('[data-role="label"]');
      if (label && id) label.textContent = tFor(locale, `lang.${id}`);
    });
  }

  /**
   * @param {string} langId
   */
  function selectLang(langId) {
    selectedId = langId;
    el.querySelectorAll('.lang-option').forEach((btn) => {
      const isSelected = btn.getAttribute('data-lang') === langId;
      btn.classList.toggle('is-selected', isSelected);
      btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });
    paintCopy(langId);
  }

  el.querySelectorAll('[data-lang]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-lang');
      if (id) selectLang(id);
    });
  });

  continueBtn?.addEventListener('click', () => {
    props.onContinue(selectedId);
  });

  paintCopy(selectedId);
  return el;
}
