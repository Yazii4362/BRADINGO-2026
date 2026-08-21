/**
 * Bottom GNB — Home (map) + Timeline archive.
 */

import { t } from '../i18n.js';

const HOME_ICON = `
<svg width="32" height="32" viewBox="18 10 32 38" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M43.6587 44.4244C43.3247 46.1777 41.7917 47.4462 40.0069 47.4462H27.9704C26.1856 47.4462 24.6526 46.1777 24.3187 44.4244L21.6039 30.1719L33.8879 21.0879L46.374 30.1687L43.6587 44.4244Z" fill="#FFC800"/>
  <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M30.8008 42.0006C30.8008 41.3378 31.338 40.8005 32.0007 40.8005H36.8007C37.4635 40.8005 38.0008 41.3378 38.0008 42.0006C38.0008 42.6633 37.4635 43.2006 36.8007 43.2006H32.0007C31.338 43.2006 30.8008 42.6633 30.8008 42.0006Z" fill="#945151"/>
  <path d="M37.9139 34.3369C37.9139 36.498 36.1619 38.2499 34.0008 38.2499C31.8397 38.2499 30.0878 36.498 30.0878 34.3369C30.0878 32.1758 31.8397 30.4238 34.0008 30.4238C36.1619 30.4238 37.9139 32.1758 37.9139 34.3369Z" fill="#945151"/>
  <path d="M34.1897 19.2009C34.7236 19.1983 35.2639 19.3598 35.7283 19.6969L49.6888 29.7616C50.8505 30.6056 51.108 32.2316 50.2641 33.3933C49.4202 34.5546 47.7949 34.8124 46.6332 33.9691L34.1804 24.9915L21.7287 33.9683L21.7278 33.9691C20.5661 34.8121 18.9408 34.5545 18.097 33.3931C17.253 32.2314 17.5106 30.6054 18.6723 29.7614L18.674 29.7601L32.632 19.6974C33.1018 19.3563 33.6499 19.1944 34.1897 19.2009Z" fill="#FF4B4B"/>
</svg>
`;

const TIMELINE_ICON = `
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M10 6v20" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
  <circle cx="10" cy="9" r="2.4" fill="#58CC02"/>
  <circle cx="10" cy="16" r="2.4" fill="#1CB0F6"/>
  <circle cx="10" cy="23" r="2.4" fill="#CE82FF"/>
  <path d="M14.5 9H24M14.5 16H22M14.5 23H20" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
</svg>
`;

/**
 * @param {{
 *   active: 'map' | 'timeline',
 *   onHome: () => void,
 *   onTimeline: () => void
 * }} props
 */
export function createAppGnb(props) {
  const nav = document.createElement('nav');
  nav.className = 'app-gnb';
  nav.id = 'app-gnb';
  nav.setAttribute('aria-label', t('gnb.aria'));

  const homeLabel = t('gnb.home');
  const timelineLabel = t('gnb.timeline');

  const home = document.createElement('button');
  home.type = 'button';
  home.className = 'app-gnb__item';
  home.dataset.tab = 'map';
  home.setAttribute('aria-label', homeLabel);
  home.innerHTML = `<span class="app-gnb__icon">${HOME_ICON}</span><span class="app-gnb__label">${homeLabel}</span>`;
  home.addEventListener('click', () => props.onHome());

  const timeline = document.createElement('button');
  timeline.type = 'button';
  timeline.className = 'app-gnb__item';
  timeline.dataset.tab = 'timeline';
  timeline.setAttribute('aria-label', timelineLabel);
  timeline.innerHTML = `<span class="app-gnb__icon">${TIMELINE_ICON}</span><span class="app-gnb__label">${timelineLabel}</span>`;
  timeline.addEventListener('click', () => props.onTimeline());

  nav.append(home, timeline);
  syncAppGnb(nav, props.active);
  return nav;
}

/**
 * @param {HTMLElement} nav
 * @param {'map' | 'timeline'} active
 */
export function syncAppGnb(nav, active) {
  nav.querySelectorAll('.app-gnb__item').forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    const selected = node.dataset.tab === active;
    node.classList.toggle('is-active', selected);
    node.setAttribute('aria-current', selected ? 'page' : 'false');
  });
}
