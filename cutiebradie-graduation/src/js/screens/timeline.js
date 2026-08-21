import { getTimelineFriends, getTimelineYears } from '../data/timeline.js';
import { t } from '../i18n.js';

const HEART_ICON = `
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M12 20.5s-6.5-4.1-8.7-7.8C1.3 9.6 2.6 6.5 5.6 5.5c1.8-.6 3.7.1 4.8 1.5C11.5 5.6 13.4 4.9 15.2 5.5c3 .9 4.3 4.1 2.3 7.2C18.5 16.4 12 20.5 12 20.5Z" fill="currentColor"/>
</svg>
`;

const COMMENT_ICON = `
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M5 5.5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H10l-4.5 3.2V16.5H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
</svg>
`;

/**
 * GNB archive — Byeonggeon's 2018–2026 school-life timeline.
 * Not a course node.
 */
export function renderTimeline() {
  const years = getTimelineYears();
  const friends = getTimelineFriends();

  const el = document.createElement('section');
  el.className = 'screen screen--timeline screen--with-gnb';
  el.dataset.screen = 'timeline';

  const header = document.createElement('header');
  header.className = 'timeline-header';
  header.innerHTML = `<h1 class="timeline-header__title">${t('timeline.title')}</h1>`;

  const avatars = document.createElement('div');
  avatars.className = 'timeline-avatars';
  avatars.setAttribute('role', 'list');
  avatars.setAttribute('aria-label', t('timeline.friendsAria'));
  friends.forEach((friend) => {
    const item = document.createElement('div');
    item.className = 'timeline-avatar';
    item.setAttribute('role', 'listitem');
    item.innerHTML = `
      <img class="timeline-avatar__img" src="${friend.image}" alt="${friend.alt}" width="48" height="48" decoding="async" />
      <span class="timeline-avatar__name">${friend.name}</span>
    `;
    avatars.appendChild(item);
  });

  const banner = document.createElement('div');
  banner.className = 'timeline-banner';
  banner.setAttribute('aria-hidden', 'false');
  banner.innerHTML = `
    <p class="timeline-banner__eyebrow">${t('timeline.bannerTitle')}</p>
    <p class="timeline-banner__range">${t('timeline.bannerRange')}</p>
  `;

  const list = document.createElement('ol');
  list.className = 'timeline-list';
  list.setAttribute('aria-label', t('timeline.listAria'));

  years.forEach((entry, index) => {
    const card = document.createElement('li');
    card.className = `timeline-card timeline-card--${entry.accent}`;
    card.innerHTML = `
      <div class="timeline-card__rail" aria-hidden="true">
        <span class="timeline-card__dot"></span>
        ${index < years.length - 1 ? '<span class="timeline-card__line"></span>' : ''}
      </div>
      <article class="timeline-card__panel">
        <div class="timeline-card__copy">
          <div class="timeline-card__meta">
            <h2 class="timeline-card__year">${entry.year}</h2>
            <span class="timeline-card__tag">${t(entry.tagKey)}</span>
          </div>
          <p class="timeline-card__text">
            <span>${t(entry.line1Key)}</span><br />
            <span>${t(entry.line2Key)}</span>
          </p>
          <div class="timeline-card__reacts" aria-hidden="true">
            <span class="timeline-card__react">${HEART_ICON}</span>
            <span class="timeline-card__react">${COMMENT_ICON}</span>
          </div>
        </div>
        <img
          class="timeline-card__art"
          src="./assets/images/quiz/n2-character-full.png"
          alt=""
          width="88"
          height="88"
          decoding="async"
          loading="lazy"
        />
      </article>
    `;
    list.appendChild(card);
  });

  const body = document.createElement('div');
  body.className = 'timeline-body';
  body.append(avatars, banner, list);

  el.append(header, body);
  return el;
}
