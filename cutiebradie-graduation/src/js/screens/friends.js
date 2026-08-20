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
 * Friends letters — GNB tab, or path node (n4) with complete CTA.
 * Profile strip stays on top; messages are a stacked card deck below.
 * @param {{
 *   mode?: 'play' | 'replay',
 *   onBackToMap?: () => void,
 *   onComplete?: () => void
 * }} [props]
 */
export function renderFriends(props = {}) {
  const content = getFriendsFeed();
  const friends = content.friends;
  /** @type {string} */
  let activeId = friends[0]?.id ?? '';
  const isPathChapter = typeof props.onComplete === 'function';

  const el = document.createElement('section');
  el.className = `screen screen--friends${isPathChapter ? ' screen--friends-path' : ''}`;
  el.dataset.screen = 'friends';

  const header = document.createElement('header');
  header.className = `friends-header${isPathChapter ? '' : ' friends-header--tab'}`;
  header.innerHTML = `
    ${
      isPathChapter
        ? `<button type="button" class="friends-back" aria-label="맵으로 돌아가기">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>`
        : ''
    }
    <div class="friends-header__copy">
      <h1 class="friends-header__title">${escapeHtml(content.title)}</h1>
      <p class="friends-header__subtitle">${escapeHtml(content.subtitle)}</p>
    </div>
  `;
  if (isPathChapter) {
    header.querySelector('.friends-back')?.addEventListener('click', () => {
      props.onBackToMap?.();
    });
  }

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

  const profile = document.createElement('article');
  profile.className = 'friends-detail friends-detail--profile-only';
  profile.setAttribute('aria-live', 'polite');

  const deck = document.createElement('div');
  deck.className = 'friends-deck';

  const stage = document.createElement('div');
  stage.className = 'friends-deck__stage';
  stage.setAttribute('role', 'region');
  stage.setAttribute('aria-roledescription', 'carousel');
  stage.setAttribute('aria-label', '졸업 축하 편지');

  /** @type {Map<string, HTMLElement>} */
  const cards = new Map();

  friends.forEach((friend, index) => {
    const card = document.createElement('article');
    card.className = 'friends-letter-card';
    card.dataset.friendId = friend.id;
    card.setAttribute('aria-hidden', friend.id === activeId ? 'false' : 'true');
    card.innerHTML = `
      <header class="friends-letter-card__head">
        <span class="friends-letter-card__avatar" aria-hidden="true">${renderAvatarFace(friend)}</span>
        <div class="friends-letter-card__meta">
          <p class="friends-letter-card__name">${escapeHtml(friend.name)}</p>
          <p class="friends-letter-card__when">${escapeHtml(friend.group)}</p>
        </div>
        <span class="friends-letter-card__index">${index + 1}/${friends.length}</span>
      </header>
      <div class="friends-letter-card__body">
        <p class="friends-letter-card__text">${formatLetterHtml(friend.letter)}</p>
      </div>
    `;
    cards.set(friend.id, card);
    stage.appendChild(card);
  });

  const controls = document.createElement('div');
  controls.className = 'friends-deck__controls';

  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'friends-deck__nav';
  prevBtn.setAttribute('aria-label', '이전 편지');
  prevBtn.innerHTML =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'friends-deck__nav';
  nextBtn.setAttribute('aria-label', '다음 편지');
  nextBtn.innerHTML =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const dots = document.createElement('div');
  dots.className = 'friends-deck__dots';
  dots.setAttribute('role', 'tablist');
  dots.setAttribute('aria-label', '편지 선택');

  friends.forEach((friend, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'friends-deck__dot';
    dot.dataset.friendId = friend.id;
    dot.setAttribute('aria-label', `${friend.name} 편지`);
    dot.setAttribute('aria-selected', friend.id === activeId ? 'true' : 'false');
    dot.addEventListener('click', () => selectFriend(friend.id));
    dots.appendChild(dot);
  });

  prevBtn.addEventListener('click', () => stepFriend(-1));
  nextBtn.addEventListener('click', () => stepFriend(1));
  controls.append(prevBtn, dots, nextBtn);
  deck.append(stage, controls);

  let pointerStartX = 0;
  let pointerDeltaX = 0;
  let pointerActive = false;

  stage.addEventListener(
    'pointerdown',
    (event) => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest('a, button')) return;
      pointerActive = true;
      pointerStartX = event.clientX;
      pointerDeltaX = 0;
      stage.setPointerCapture(event.pointerId);
    },
    { passive: true }
  );

  stage.addEventListener(
    'pointermove',
    (event) => {
      if (!pointerActive) return;
      pointerDeltaX = event.clientX - pointerStartX;
    },
    { passive: true }
  );

  stage.addEventListener('pointerup', (event) => {
    if (!pointerActive) return;
    pointerActive = false;
    try {
      stage.releasePointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }
    if (Math.abs(pointerDeltaX) < 48) return;
    stepFriend(pointerDeltaX < 0 ? 1 : -1);
  });

  stage.addEventListener('pointercancel', () => {
    pointerActive = false;
  });

  const body = document.createElement('div');
  body.className = 'friends-body';
  body.append(avatars, profile, deck);

  el.append(header, body);

  function activeIndex() {
    return Math.max(
      0,
      friends.findIndex((friend) => friend.id === activeId)
    );
  }

  /**
   * @param {number} delta
   */
  function stepFriend(delta) {
    if (!friends.length) return;
    const next = (activeIndex() + delta + friends.length) % friends.length;
    selectFriend(friends[next].id);
  }

  /**
   * @param {string} friendId
   */
  function selectFriend(friendId) {
    const friend = friends.find((item) => item.id === friendId);
    if (!friend) return;
    activeId = friendId;
    renderProfile(friend);
    syncSelection();
  }

  function syncSelection() {
    const index = activeIndex();

    avatars.querySelectorAll('.friends-avatar').forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      const selected = node.dataset.friendId === activeId;
      node.classList.toggle('is-active', selected);
      node.setAttribute('aria-selected', selected ? 'true' : 'false');
    });

    dots.querySelectorAll('.friends-deck__dot').forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      const selected = node.dataset.friendId === activeId;
      node.classList.toggle('is-active', selected);
      node.setAttribute('aria-selected', selected ? 'true' : 'false');
    });

    friends.forEach((friend, friendIndex) => {
      const card = cards.get(friend.id);
      if (!card) return;
      const offset = friendIndex - index;
      const abs = Math.abs(offset);
      const isFront = offset === 0;
      card.classList.toggle('is-front', isFront);
      card.classList.toggle('is-behind', !isFront);
      card.setAttribute('aria-hidden', isFront ? 'false' : 'true');
      card.style.setProperty('--deck-offset', String(offset));
      card.style.setProperty('--deck-abs', String(abs));
      card.style.zIndex = String(friends.length - abs);
      card.style.pointerEvents = isFront ? 'auto' : 'none';
    });

    prevBtn.disabled = friends.length < 2;
    nextBtn.disabled = friends.length < 2;
  }

  /**
   * @param {(typeof friends)[number]} friend
   */
  function renderProfile(friend) {
    const isCreator = friend.id === 'yaji';
    const avatarHtml = friend.image
      ? `<img class="friends-detail__photo" src="${escapeHtml(friend.image)}" alt="${escapeHtml(friend.alt || friend.name)}" />`
      : `<span class="friends-detail__initials" aria-hidden="true">${escapeHtml(friend.initials)}</span>`;

    const faceTag = isCreator ? 'button' : 'div';
    const faceAttrs = isCreator
      ? ' type="button" class="friends-detail__face friends-detail__face--creator" data-action="creator-support" aria-label="만든 사람 응원하기"'
      : ' class="friends-detail__face"';

    profile.innerHTML = `
      <div class="friends-detail__profile">
        <${faceTag}${faceAttrs}>${avatarHtml}</${faceTag}>
        <div class="friends-detail__meta">
          <h2 class="friends-detail__name">${escapeHtml(friend.name)}</h2>
          ${
            isCreator
              ? `<button type="button" class="friends-detail__support" data-action="creator-support">만든 사람 응원하기</button>`
              : ''
          }
        </div>
      </div>
    `;

    profile.querySelectorAll('[data-action="creator-support"]').forEach((node) => {
      node.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        openCreatorSupport();
      });
    });
  }

  const first = friends.find((item) => item.id === activeId) ?? friends[0];
  if (first) {
    renderProfile(first);
    syncSelection();
  }

  if (isPathChapter) {
    const footer = document.createElement('footer');
    footer.className = 'friends-path-footer';
    const completeBtn = document.createElement('button');
    completeBtn.type = 'button';
    completeBtn.className = 'cb-button cb-button--primary cb-button--fill';
    completeBtn.textContent =
      props.mode === 'replay' ? '맵으로 돌아가기' : '편지 읽기 완료';
    completeBtn.addEventListener('click', () => props.onComplete?.());
    footer.appendChild(completeBtn);
    el.appendChild(footer);
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
