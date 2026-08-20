import { getFriendsFeed } from '../data/course.js';
import { openCreatorSupport } from '../components/coffee-coupon.js';

/**
 * Escape text for safe HTML insertion.
 * @param {string} value
 */
function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * @param {string} text
 */
function formatLetterHtml(text) {
  return escapeHtml(text).replaceAll('\n', '<br>');
}

/**
 * Friends letters tab (GNB) — profile row + contact/letter detail.
 */
export function renderFriends() {
  const content = getFriendsFeed();
  const friends = content.friends;
  /** @type {string} */
  let activeId = friends[0]?.id ?? '';

  const el = document.createElement('section');
  el.className = 'screen screen--friends';
  el.dataset.screen = 'friends';

  const header = document.createElement('header');
  header.className = 'friends-header friends-header--tab';
  header.innerHTML = `
    <div class="friends-header__copy">
      <h1 class="friends-header__title">${escapeHtml(content.title)}</h1>
      <p class="friends-header__subtitle">${escapeHtml(content.subtitle)}</p>
    </div>
  `;

  const avatars = document.createElement('div');
  avatars.className = 'friends-avatars';
  avatars.setAttribute('role', 'tablist');
  avatars.setAttribute('aria-label', '친구 프로필');

  friends.forEach((friend) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'friends-avatar';
    btn.setAttribute('role', 'tab');
    btn.dataset.friendId = friend.id;
    btn.setAttribute('aria-selected', friend.id === activeId ? 'true' : 'false');
    btn.setAttribute('aria-label', `${friend.name} 편지 보기`);
    btn.innerHTML = renderAvatarFace(friend);
    btn.addEventListener('click', () => selectFriend(friend.id));
    avatars.appendChild(btn);
  });

  const scroll = document.createElement('div');
  scroll.className = 'friends-scroll';

  const detail = document.createElement('article');
  detail.className = 'friends-detail';
  detail.setAttribute('aria-live', 'polite');

  const list = document.createElement('div');
  list.className = 'friends-list';
  list.setAttribute('role', 'list');

  /** @type {Map<string, typeof friends>} */
  const groups = new Map();
  friends.forEach((friend) => {
    const key = friend.group || '편지';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)?.push(friend);
  });

  groups.forEach((groupFriends, groupLabel) => {
    const section = document.createElement('section');
    section.className = 'friends-group';

    const heading = document.createElement('h2');
    heading.className = 'friends-group__label';
    heading.textContent = groupLabel;
    section.appendChild(heading);

    groupFriends.forEach((friend) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'friends-card';
      card.dataset.friendId = friend.id;
      card.setAttribute('role', 'listitem');
      card.setAttribute('aria-pressed', friend.id === activeId ? 'true' : 'false');
      card.innerHTML = `
        <span class="friends-card__avatar" aria-hidden="true">${renderAvatarFace(friend)}</span>
        <span class="friends-card__body">
          <span class="friends-card__top">
            <span class="friends-card__name">${escapeHtml(friend.name)}</span>
            <span class="friends-card__when">${escapeHtml(friend.group)}</span>
          </span>
          <span class="friends-card__preview">${escapeHtml(friend.preview)}</span>
        </span>
      `;
      card.addEventListener('click', () => selectFriend(friend.id));
      section.appendChild(card);
    });

    list.appendChild(section);
  });

  scroll.append(detail, list);

  const body = document.createElement('div');
  body.className = 'friends-body';
  body.append(avatars, scroll);

  el.append(header, body);

  function selectFriend(friendId) {
    const friend = friends.find((item) => item.id === friendId);
    if (!friend) return;
    activeId = friendId;
    renderDetail(friend);
    syncSelection();
  }

  function syncSelection() {
    avatars.querySelectorAll('.friends-avatar').forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      const selected = node.dataset.friendId === activeId;
      node.classList.toggle('is-active', selected);
      node.setAttribute('aria-selected', selected ? 'true' : 'false');
    });
    list.querySelectorAll('.friends-card').forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      const selected = node.dataset.friendId === activeId;
      node.classList.toggle('is-active', selected);
      node.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });
  }

  /**
   * @param {(typeof friends)[number]} friend
   */
  function renderDetail(friend) {
    const isCreator = friend.id === 'yaji';
    const avatarHtml = friend.image
      ? `<img class="friends-detail__photo" src="${escapeHtml(friend.image)}" alt="${escapeHtml(friend.alt || friend.name)}" />`
      : `<span class="friends-detail__initials" aria-hidden="true">${escapeHtml(friend.initials)}</span>`;

    const faceTag = isCreator ? 'button' : 'div';
    const faceAttrs = isCreator
      ? ' type="button" class="friends-detail__face friends-detail__face--creator" data-action="creator-support" aria-label="만든 사람 응원하기"'
      : ' class="friends-detail__face"';

    detail.innerHTML = `
      <div class="friends-detail__profile">
        <${faceTag}${faceAttrs}>${avatarHtml}</${faceTag}>
        <div class="friends-detail__meta">
          <h2 class="friends-detail__name">${escapeHtml(friend.name)}</h2>
          <dl class="friends-detail__contacts">
            <div class="friends-detail__row">
              <dt>연락처</dt>
              <dd><a href="tel:${escapeHtml(friend.phone)}">${escapeHtml(friend.phone)}</a></dd>
            </div>
            <div class="friends-detail__row">
              <dt>이메일</dt>
              <dd><a href="mailto:${escapeHtml(friend.email)}">${escapeHtml(friend.email)}</a></dd>
            </div>
          </dl>
          ${
            isCreator
              ? `<button type="button" class="friends-detail__support" data-action="creator-support">만든 사람 응원하기</button>`
              : ''
          }
        </div>
      </div>
      <div class="friends-detail__letter">
        <p class="friends-detail__letter-label">편지</p>
        <p class="friends-detail__letter-body">${formatLetterHtml(friend.letter)}</p>
      </div>
    `;

    detail.querySelectorAll('[data-action="creator-support"]').forEach((node) => {
      node.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        openCreatorSupport();
      });
    });
  }

  const first = friends.find((item) => item.id === activeId) ?? friends[0];
  if (first) {
    renderDetail(first);
    syncSelection();
  }

  return el;
}

/**
 * @param {{ id: string, name: string, initials: string, image?: string, alt?: string }} friend
 */
function renderAvatarFace(friend) {
  if (friend.image) {
    return `<img src="${escapeHtml(friend.image)}" alt="" />`;
  }
  return `<span>${escapeHtml(friend.initials)}</span>`;
}
