/**
 * Top status header — streak / gems / hearts (CB / App Header).
 * @param {{
 *   streak?: number | string,
 *   gems?: number | string,
 * }} [props]
 */
export function createAppHeader(props = {}) {
  const streak = props.streak ?? 3095;
  const gems = props.gems ?? 2026;

  const el = document.createElement('header');
  el.className = 'cb-app-header';
  el.setAttribute('aria-label', '학습 현황');

  el.innerHTML = `
    <div class="cb-app-header__item cb-app-header__item--streak">
      <span class="cb-app-header__icon" aria-hidden="true">${STREAK_ICON}</span>
      <span class="cb-app-header__value cb-app-header__value--streak">${streak}</span>
    </div>
    <div class="cb-app-header__item cb-app-header__item--gems">
      <span class="cb-app-header__icon" aria-hidden="true">${GEM_ICON}</span>
      <span class="cb-app-header__value cb-app-header__value--gems">${gems}</span>
    </div>
    <div class="cb-app-header__item cb-app-header__item--hearts">
      <span class="cb-app-header__icon cb-app-header__icon--hearts" aria-hidden="true">
        <img
          class="cb-app-header__heart-img"
          src="./assets/images/heart.svg"
          alt=""
          width="28"
          height="28"
          decoding="async"
        />
      </span>
      <span class="cb-app-header__value cb-app-header__value--hearts visually-hidden">무제한</span>
    </div>
  `;

  return el;
}

const STREAK_ICON = `
<svg width="28" height="28" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M0.924 14.238L0.903 6.919C0.899 5.29 1.947 4.086 3.509 4.349C3.818 4.401 4.324 4.561 4.591 4.704L6.054 5.487L8.866 1.942C9.338 1.347 10.056 1 10.816 1C11.575 1 12.293 1.347 12.765 1.942L18.623 9.328C20.008 11.006 20.765 13.113 20.766 15.289C20.766 20.606 16.304 24.903 10.816 24.903C5.327 24.903 0.865 20.606 0.865 15.289C0.865 14.936 0.885 14.585 0.924 14.238Z" fill="#FF9600" stroke="white" stroke-width="1.73"/>
  <path d="M7.797 14.586C7.81 14.554 7.826 14.524 7.847 14.496L10.14 11.373C10.29 11.168 10.53 11.047 10.784 11.047C11.039 11.047 11.278 11.168 11.429 11.373L13.612 14.346C14.312 15.034 14.707 15.974 14.709 16.955C14.709 19.026 12.965 20.704 10.815 20.704C8.665 20.704 6.922 19.026 6.922 16.955C6.922 16.056 7.251 15.232 7.797 14.586Z" fill="#FFC800"/>
</svg>`;

const GEM_ICON = `
<svg width="28" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M3.12 6.46C1.804 7.254 1 8.679 1 10.216V19.882C1 21.419 1.804 22.844 3.12 23.638L9.595 27.546C10.989 28.387 12.734 28.387 14.128 27.546L20.603 23.638C21.919 22.844 22.724 21.419 22.724 19.882V10.216C22.724 8.679 21.919 7.254 20.603 6.46L14.128 2.552C12.734 1.711 10.989 1.711 9.595 2.552L3.12 6.46Z" fill="#5ACD05" stroke="white" stroke-width="2"/>
  <path fill-rule="evenodd" d="M10.244 5.453C10.964 5.011 11.89 5.529 11.89 6.373V9.538C11.89 9.916 11.692 10.267 11.369 10.463L8.421 12.245C8.055 12.467 7.593 12.451 7.243 12.206L4.856 10.534C4.22 10.088 4.249 9.136 4.911 8.729L10.244 5.453Z" fill="#DDF4FF"/>
</svg>`;
