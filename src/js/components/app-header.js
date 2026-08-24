import { t } from '../i18n/index.js';

/**
 * Top status header — streak / gems / hearts / travel (CB / App Header).
 * Streak → 연속 재학 tooltip (always 3095일).
 * Hearts → friends tooltip.
 * Travel (rightmost) → plane + country count + tooltip.
 * @param {{
 *   gems?: number | string,
 * }} [props]
 */
export function createAppHeader(props = {}) {
  const streak = STREAK_DAYS;
  const gems = props.gems ?? 2026;
  const countries = TRAVEL_COUNTRY_COUNT;
  const week = buildWeekState();

  const el = document.createElement('header');
  el.className = 'cb-app-header';
  el.setAttribute('aria-label', t('header.aria'));

  el.innerHTML = `
    <button
      type="button"
      class="cb-app-header__item cb-app-header__item--streak"
      aria-describedby="streak-tooltip"
      aria-expanded="false"
      aria-label="${t('header.streakAria', { streak })}"
    >
      <span class="cb-app-header__icon" aria-hidden="true">${STREAK_ICON}</span>
      <span class="cb-app-header__value cb-app-header__value--streak">${streak}</span>
      <span class="cb-streak-tooltip" id="streak-tooltip" role="tooltip" hidden>
        <span class="cb-streak-tooltip__hero">
          <span class="cb-streak-tooltip__copy-block">
            <span class="cb-streak-tooltip__badge">${t('header.streakBadge')}</span>
            <span class="cb-streak-tooltip__title">${t('header.streakTitle', { streak })}</span>
            <span class="cb-streak-tooltip__desc">${t('header.streakDesc')}</span>
          </span>
          <span class="cb-streak-tooltip__mascot" aria-hidden="true">${STREAK_ICON}</span>
        </span>
        <span class="cb-streak-tooltip__week" aria-hidden="true">
          <span class="cb-streak-tooltip__days">${week.daysHtml}</span>
          <span class="cb-streak-tooltip__track">
            <span class="cb-streak-tooltip__fill" style="width: ${week.fillPercent}%"></span>
            <span class="cb-streak-tooltip__spark" style="left: ${week.fillPercent}%"></span>
            <span class="cb-streak-tooltip__goal">${GOAL_FLAME}</span>
          </span>
        </span>
      </span>
    </button>
    <div class="cb-app-header__item cb-app-header__item--gems">
      <span class="cb-app-header__icon" aria-hidden="true">${GEM_ICON}</span>
      <span class="cb-app-header__value cb-app-header__value--gems">${gems}</span>
    </div>
    <button
      type="button"
      class="cb-app-header__item cb-app-header__item--hearts"
      aria-describedby="friends-tooltip"
      aria-expanded="false"
      aria-label="${t('header.friendsAria')}"
    >
      <span class="cb-app-header__icon cb-app-header__icon--hearts" aria-hidden="true">${HEART_ICON}</span>
      <span class="cb-app-header__value cb-app-header__value--hearts">∞</span>
      <span class="cb-friends-tooltip" id="friends-tooltip" role="tooltip" hidden>
        <span class="cb-friends-tooltip__art" aria-hidden="true">
          <img
            class="cb-friends-tooltip__icon"
            src="./assets/images/gnb/icon-friends.svg"
            alt=""
            width="80"
            height="74"
            decoding="async"
          />
        </span>
        <span class="cb-friends-tooltip__copy">
          <span class="cb-friends-tooltip__title">${t('header.friendsTitle')}</span>
          <span class="cb-friends-tooltip__desc">${t('header.friendsDesc')}</span>
        </span>
      </span>
    </button>
    <button
      type="button"
      class="cb-app-header__item cb-app-header__item--course"
      aria-describedby="travel-tooltip"
      aria-expanded="false"
      aria-label="${t('header.travelAria', { count: countries })}"
    >
      <span class="cb-app-header__icon cb-app-header__icon--plane" aria-hidden="true">${PLANE_ICON}</span>
      <span class="cb-app-header__value cb-app-header__value--course">${countries}</span>
      <span class="cb-travel-tooltip" id="travel-tooltip" role="tooltip" hidden>
        <span class="cb-travel-tooltip__art" aria-hidden="true">
          <img
            class="cb-travel-tooltip__globe"
            src="./assets/images/header/globe.svg"
            alt=""
            width="360"
            height="360"
            decoding="async"
          />
        </span>
        <span class="cb-travel-tooltip__copy">
          <span class="cb-travel-tooltip__title">${t('header.travelTitle')}</span>
          <span class="cb-travel-tooltip__desc">${t('header.travelDesc', { count: countries })}</span>
        </span>
      </span>
    </button>
  `;

  /** @type {Array<{ button: HTMLButtonElement, tooltip: HTMLElement }>} */
  const tooltipPairs = [];

  const courseBtn = el.querySelector('.cb-app-header__item--course');
  const travelTip = el.querySelector('.cb-travel-tooltip');
  if (courseBtn instanceof HTMLButtonElement && travelTip instanceof HTMLElement) {
    tooltipPairs.push({ button: courseBtn, tooltip: travelTip });
  }

  const streakBtn = el.querySelector('.cb-app-header__item--streak');
  const streakTip = el.querySelector('.cb-streak-tooltip');
  if (streakBtn instanceof HTMLButtonElement && streakTip instanceof HTMLElement) {
    tooltipPairs.push({ button: streakBtn, tooltip: streakTip });
  }

  const heartsBtn = el.querySelector('.cb-app-header__item--hearts');
  const friendsTip = el.querySelector('.cb-friends-tooltip');
  if (heartsBtn instanceof HTMLButtonElement && friendsTip instanceof HTMLElement) {
    tooltipPairs.push({ button: heartsBtn, tooltip: friendsTip });
  }

  tooltipPairs.forEach((pair) => {
    bindHeaderTooltip(pair.button, pair.tooltip, () =>
      tooltipPairs.filter((other) => other !== pair)
    );
  });

  return el;
}

/** Always-on joke streak — never changes. */
const STREAK_DAYS = 3095;

/** Countries Bradie has visited (for now). */
const TRAVEL_COUNTRY_COUNT = 4;

function buildWeekState() {
  const labels = t('header.week').split(',');
  const today = new Date().getDay(); // 0 = Sun
  const daysHtml = labels.map((label, index) => {
    const className =
      index === today
        ? 'cb-streak-tooltip__day is-today'
        : 'cb-streak-tooltip__day';
    return `<span class="${className}">${label.trim()}</span>`;
  }).join('');

  // Fill through today's column (Thu ≈ 71%).
  const fillPercent = Math.round(((today + 0.5) / 7) * 1000) / 10;

  return { daysHtml, fillPercent };
}

/**
 * @param {HTMLButtonElement} button
 * @param {HTMLElement} tooltip
 * @param {() => Array<{ button: HTMLButtonElement, tooltip: HTMLElement }>} getOthers
 */
function bindHeaderTooltip(button, tooltip, getOthers) {
  let hideTimer = /** @type {ReturnType<typeof setTimeout> | null} */ (null);

  const hidePair = (pair) => {
    pair.tooltip.hidden = true;
    pair.button.setAttribute('aria-expanded', 'false');
    pair.button.classList.remove('is-tooltip-open');
  };

  const show = () => {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
    getOthers().forEach(hidePair);
    tooltip.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    button.classList.add('is-tooltip-open');
  };

  const hide = () => {
    hidePair({ button, tooltip });
  };

  const scheduleHide = () => {
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, 120);
  };

  button.addEventListener('pointerenter', show);
  button.addEventListener('pointerleave', scheduleHide);
  button.addEventListener('focus', show);
  button.addEventListener('blur', scheduleHide);
  button.addEventListener('click', (event) => {
    event.preventDefault();
    if (tooltip.hidden) show();
    else hide();
  });

  document.addEventListener(
    'pointerdown',
    (event) => {
      if (!(event.target instanceof Node)) return;
      if (!button.contains(event.target)) hide();
    },
    true
  );
}

const STREAK_ICON = `
<svg width="25" height="25" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M0.924 14.238L0.903 6.919C0.899 5.29 1.947 4.086 3.509 4.349C3.818 4.401 4.324 4.561 4.591 4.704L6.054 5.487L8.866 1.942C9.338 1.347 10.056 1 10.816 1C11.575 1 12.293 1.347 12.765 1.942L18.623 9.328C20.008 11.006 20.765 13.113 20.766 15.289C20.766 20.606 16.304 24.903 10.816 24.903C5.327 24.903 0.865 20.606 0.865 15.289C0.865 14.936 0.885 14.585 0.924 14.238Z" fill="#FF9600" stroke="white" stroke-width="1.73"/>
  <path d="M7.797 14.586C7.81 14.554 7.826 14.524 7.847 14.496L10.14 11.373C10.29 11.168 10.53 11.047 10.784 11.047C11.039 11.047 11.278 11.168 11.429 11.373L13.612 14.346C14.312 15.034 14.707 15.974 14.709 16.955C14.709 19.026 12.965 20.704 10.815 20.704C8.665 20.704 6.922 19.026 6.922 16.955C6.922 16.056 7.251 15.232 7.797 14.586Z" fill="#FFC800"/>
</svg>`;

/** Flat travel plane — pairs with the country count. */
const PLANE_ICON = `
<svg width="25" height="25" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M0.921378 20.7194L12.3855 20.9145L7.18232 26.1176L0.133609 21.8723C0.00306852 21.7937 -0.0390214 21.6242 0.0395986 21.4936C0.0511586 21.4745 0.0650084 21.4567 0.0808584 21.4409L0.721589 20.8002C0.774489 20.7473 0.846588 20.7181 0.921378 20.7194Z" fill="#1899D6"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M28.8793 29.6406C28.8979 30.3957 28.6061 31.1254 28.072 31.6596L27.0305 32.7011C27.008 32.7236 26.9836 32.7441 26.9575 32.7624C26.7082 32.9376 26.364 32.8775 26.1888 32.6281L18.1243 21.1494L28.416 10.8577L28.8793 29.6406Z" fill="#1899D6"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M4.25546 5.01647L23.0382 5.47981L12.7466 15.7714L1.26791 7.70693C1.01854 7.53173 0.958407 7.18763 1.13361 6.93823C1.15191 6.91218 1.17243 6.88776 1.19494 6.86525L2.23644 5.82375C2.77057 5.28963 3.50032 4.99784 4.25546 5.01647Z" fill="#1899D6"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M13.0498 32.8479C13.0511 32.9226 13.0219 32.9948 12.969 33.0476L12.3283 33.6884C12.3125 33.7042 12.2948 33.7181 12.2756 33.7296C12.145 33.8083 11.9755 33.7662 11.8969 33.6356L7.65161 26.5869L12.8548 21.3838L13.0498 32.8479Z" fill="#1899D6"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M23.5649 2.89925C24.9673 1.49689 30.0932 -1.61825 32.7498 1.03836C35.4064 3.69498 32.3863 8.97742 31.0148 10.349L16.0176 25.3461C13.9604 27.4034 10.625 27.4034 8.56784 25.3461C6.51067 23.2889 6.51067 19.9535 8.56784 17.8963L23.5649 2.89925Z" fill="#7ACDEF"/>
  <path d="M26.3497 3.16872L30.4799 7.29891C30.5876 7.40671 30.7623 7.40671 30.8701 7.29891L31.3578 6.81119C31.7349 6.43407 31.7349 5.82263 31.3578 5.44551L28.2031 2.29078C27.826 1.91365 27.2145 1.91365 26.8374 2.29078L26.3497 2.77852C26.2419 2.88627 26.2419 3.06097 26.3497 3.16872Z" fill="#1899D6"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M12.9043 21.0281C13.3016 21.4255 13.3016 22.0697 12.9043 22.467L7.90232 27.469C7.50492 27.8664 6.86072 27.8664 6.46341 27.469C6.06607 27.0717 6.06607 26.4275 6.46341 26.0301L11.4654 21.0281C11.8627 20.6308 12.5069 20.6308 12.9043 21.0281Z" fill="#1899D6"/>
</svg>`;

const GEM_ICON = `
<svg width="25" height="25" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M3.12 6.46C1.804 7.254 1 8.679 1 10.216V19.882C1 21.419 1.804 22.844 3.12 23.638L9.595 27.546C10.989 28.387 12.734 28.387 14.128 27.546L20.603 23.638C21.919 22.844 22.724 21.419 22.724 19.882V10.216C22.724 8.679 21.919 7.254 20.603 6.46L14.128 2.552C12.734 1.711 10.989 1.711 9.595 2.552L3.12 6.46Z" fill="#5ACD05" stroke="white" stroke-width="2"/>
  <path fill-rule="evenodd" d="M10.244 5.453C10.964 5.011 11.89 5.529 11.89 6.373V9.538C11.89 9.916 11.692 10.267 11.369 10.463L8.421 12.245C8.055 12.467 7.593 12.451 7.243 12.206L4.856 10.534C4.22 10.088 4.249 9.136 4.911 8.729L10.244 5.453Z" fill="#DDF4FF"/>
</svg>`;

/** Duolingo-style red heart for the friends/hearts meter. */
const HEART_ICON = `
<svg width="25" height="25" viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M14 24.2C13.55 24.2 13.12 24.04 12.78 23.74L3.42 15.22C1.24 13.22 0 10.56 0 7.74C0 3.48 3.4 0 7.56 0C10.02 0 12.24 1.2 14 3.16C15.76 1.2 17.98 0 20.44 0C24.6 0 28 3.48 28 7.74C28 10.56 26.76 13.22 24.58 15.22L15.22 23.74C14.88 24.04 14.45 24.2 14 24.2Z" fill="#FF4B4B"/>
  <path opacity="0.35" d="M7.2 4.2C5.1 4.2 3.4 5.95 3.4 8.05C3.4 8.55 3.8 8.95 4.3 8.95C4.8 8.95 5.2 8.55 5.2 8.05C5.2 6.95 6.1 6 7.2 6C7.7 6 8.1 5.6 8.1 5.1C8.1 4.6 7.7 4.2 7.2 4.2Z" fill="white"/>
</svg>`;

/** Gray goal flame at the end of the week track (same shape as header streak). */
const GOAL_FLAME = `
<svg width="22" height="26" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M0.924 14.238L0.903 6.919C0.899 5.29 1.947 4.086 3.509 4.349C3.818 4.401 4.324 4.561 4.591 4.704L6.054 5.487L8.866 1.942C9.338 1.347 10.056 1 10.816 1C11.575 1 12.293 1.347 12.765 1.942L18.623 9.328C20.008 11.006 20.765 13.113 20.766 15.289C20.766 20.606 16.304 24.903 10.816 24.903C5.327 24.903 0.865 20.606 0.865 15.289C0.865 14.936 0.885 14.585 0.924 14.238Z" fill="#4B5C66"/>
  <path d="M7.797 14.586C7.81 14.554 7.826 14.524 7.847 14.496L10.14 11.373C10.29 11.168 10.53 11.047 10.784 11.047C11.039 11.047 11.278 11.168 11.429 11.373L13.612 14.346C14.312 15.034 14.707 15.974 14.709 16.955C14.709 19.026 12.965 20.704 10.815 20.704C8.665 20.704 6.922 19.026 6.922 16.955C6.922 16.056 7.251 15.232 7.797 14.586Z" fill="#3A4850"/>
</svg>`;
