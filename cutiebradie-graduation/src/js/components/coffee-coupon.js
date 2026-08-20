/**
 * Creator support — map promo card + shared modal (yazii).
 */

export const DEVELOPER = Object.freeze({
  handle: 'yazii',
  displayName: '야지',
  igHandle: '@yazii_home',
  githubUrl: 'https://github.com/Yazii4362',
  githubLabel: 'github.com/Yazii4362',
  email: 'image4362@gmail.com',
  /** Placeholder — replace with real coffee-chat booking URL */
  coffeeChatUrl: 'mailto:image4362@gmail.com?subject=yazii%20%EC%BB%A4%ED%94%BC%EC%B1%97%20%EC%9A%94%EC%B2%AD',
  coffeeChatLabel: '커피챗 요청하기',
  instagramUrl: 'https://instagram.com/yazii_home',
  instagramLabel: 'Instagram',
  portraitSrc: './assets/images/creator/yazii-portrait.webp',
  duolingoInviteUrl: 'https://invite.duolingo.com/BDHTZTB5CWWKTR26THJHW7DZIA',
  duolingoInviteLabel: '듀오링고 친구 맺기',
});

const ICONS = {
  coffee: `<svg class="cb-coffee-coupon__icon-svg" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <path fill="none" stroke="#b8b8b8" stroke-width="2.2" stroke-linecap="round" d="M22.5 21c-1.2-3.2.8-5.4-.2-8.4"/>
    <path fill="none" stroke="#c4c4c4" stroke-width="2.2" stroke-linecap="round" d="M31.5 19.5c-1.4-3.6 1-6.2-.2-9.8"/>
    <path fill="none" stroke="#b8b8b8" stroke-width="2.2" stroke-linecap="round" d="M40.5 21c-1.2-3.2.8-5.4-.2-8.4"/>
    <path fill="#ebebeb" d="M12 25h30a2.5 2.5 0 0 1 2.5 2.5V29H9.5v-1.5A2.5 2.5 0 0 1 12 25Z"/>
    <path fill="none" stroke="#d0d0d0" stroke-width="3.6" stroke-linejoin="round" stroke-linecap="round" d="M12.5 28.5h29c.9 0 1.6.8 1.5 1.7l-1.3 15.8A8.2 8.2 0 0 1 33.5 54h-9a8.2 8.2 0 0 1-8.2-7.9l-1.3-15.9c-.1-.9.6-1.7 1.5-1.7Z"/>
    <path fill="none" stroke="#d0d0d0" stroke-width="3.6" stroke-linecap="round" d="M44 32.5h3.6a6.2 6.2 0 0 1 0 12.4H43.5"/>
    <path fill="none" stroke="#d0d0d0" stroke-width="3.4" stroke-linecap="round" d="M19 56.5h20"/>
    <path fill="#a8642a" d="M16.2 32h21.6c.7 0 1.2.6 1.1 1.2l-1.2 13.2A5.8 5.8 0 0 1 32 52h-6a5.8 5.8 0 0 1-5.7-5.6l-1.2-13.2c-.1-.6.4-1.2 1.1-1.2Z"/>
    <path fill="#c07a3a" opacity=".4" d="M16.2 32h5.4l-1 18.5h-2.2a4.6 4.6 0 0 1-4.5-4.2L12.8 33.2c-.1-.7.4-1.2 1.1-1.2Z"/>
    <path fill="#7a4518" d="M34.8 38.2c1.7-.2 3.1 1.4 2.6 3.1-.4 1.2-1.3 1.9-2 2.8-.4.5-1.3.4-1.7-.2-.6-1-1.2-2-1.3-3.2-.1-1.4 1-2.4 2.4-2.5Z"/>
  </svg>`,
  instagram: `<svg class="cb-coffee-coupon__icon-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><defs><linearGradient id="igGrad" x1="0" y1="24" x2="24" y2="0"><stop stop-color="#feda75"/><stop offset=".3" stop-color="#fa7e1e"/><stop offset=".6" stop-color="#d62976"/><stop offset="1" stop-color="#962fbf"/></linearGradient></defs><rect x="3" y="3" width="18" height="18" rx="5" fill="url(#igGrad)"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="17.2" cy="6.8" r="1.2" fill="#fff"/></svg>`,
  github: `<svg class="cb-coffee-coupon__icon-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="#24292f" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.61.07-.61 1 .07 1.52 1.03 1.52 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85 0 1.7.11 2.5.33 1.9-1.29 2.74-1.02 2.74-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .26.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>`,
  email: `<svg class="cb-coffee-coupon__icon-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="5" width="18" height="14" rx="2.5" fill="none" stroke="#7B68EE" stroke-width="1.8"/><path d="M4.2 7.2 12 12.4l7.8-5.2" fill="none" stroke="#7B68EE" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  chevron: `<svg class="cb-coffee-coupon__chevron" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M7.5 4.5 13 10l-5.5 5.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  close: `<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M5.5 5.5 14.5 14.5M14.5 5.5 5.5 14.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  info: `<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><circle cx="10" cy="10" r="9" fill="#7B68EE"/><path d="M10 8.2V14M10 5.8v.4" stroke="#fff" stroke-width="2.1" stroke-linecap="round"/></svg>`,
  sparkle: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="#F5C84C" d="M12 1.2 13.8 9 21.5 12 13.8 15 12 22.8 10.2 15 2.5 12 10.2 9Z"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="#FF5A7A" d="M12 20.4S3.6 14.7 3.6 9.6A4.5 4.5 0 0 1 12 7.1a4.5 4.5 0 0 1 8.4 2.5c0 5.1-8.4 10.8-8.4 10.8Z"/></svg>`,
};

/**
 * @param {{
 *   taps?: number,
 *   windowMs?: number,
 *   onUnlock: () => void
 * }} options
 */
export function createTapUnlock(options) {
  const need = options.taps ?? 5;
  const windowMs = options.windowMs ?? 2200;
  let count = 0;
  /** @type {ReturnType<typeof setTimeout> | null} */
  let timer = null;

  return () => {
    count += 1;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      count = 0;
      timer = null;
    }, windowMs);

    if (count >= need) {
      count = 0;
      if (timer) clearTimeout(timer);
      timer = null;
      options.onUnlock();
    }
  };
}

/** @deprecated Prefer openCreatorSupport — kept for ending/intro easter eggs */
export function openCoffeeCoupon() {
  openCreatorSupport({ variant: 'easter' });
}

function createPortraitFrame(extraClass = '') {
  return `
    <div class="creator-frame ${extraClass}">
      <div class="creator-frame__sparkle creator-frame__sparkle--tl" aria-hidden="true">${ICONS.sparkle}</div>
      <div class="creator-frame__sparkle creator-frame__sparkle--tr" aria-hidden="true">${ICONS.sparkle}</div>
      <div class="creator-frame__sparkle creator-frame__sparkle--br" aria-hidden="true">${ICONS.sparkle}</div>
      <div class="creator-frame__heart" aria-hidden="true">${ICONS.heart}</div>
      <img
        class="creator-frame__img"
        src="${DEVELOPER.portraitSrc}"
        alt="${DEVELOPER.displayName} ${DEVELOPER.igHandle}"
        width="360"
        height="360"
        decoding="async"
      />
    </div>
  `;
}

/**
 * @param {{ variant?: 'default' | 'easter' }} [options]
 */
export function openCreatorSupport(options = {}) {
  if (document.querySelector('.cb-coffee-coupon__overlay')) return;

  const variant = options.variant ?? 'default';
  const previouslyFocused =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;

  const overlay = document.createElement('div');
  overlay.className = 'cb-coffee-coupon__overlay';
  overlay.setAttribute('role', 'presentation');

  const dialog = document.createElement('div');
  dialog.className = 'cb-coffee-coupon';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'creator-support-title');

  const eyebrow =
    variant === 'easter' ? 'EASTER EGG UNLOCKED' : 'SUPPORT THE CREATOR';
  const body =
    variant === 'easter'
      ? `이 초대장을 만든 개발자 <strong>${DEVELOPER.handle}</strong>에게<br />커피챗을 요청할 수 있어요.`
      : `이 초대장을 만든 <strong>${DEVELOPER.displayName}</strong> (${DEVELOPER.handle})를<br />커피챗·인스타로 응원해 주세요.`;

  dialog.innerHTML = `
    <div class="cb-coffee-coupon__sheet">
      <button type="button" class="cb-coffee-coupon__close" data-action="close" aria-label="닫기">
        ${ICONS.close}
      </button>
      <p class="cb-coffee-coupon__eyebrow">${eyebrow}</p>
      <h2 id="creator-support-title" class="cb-coffee-coupon__title">
        만든 사람 <span>응원하기</span>
      </h2>
      <p class="cb-coffee-coupon__body">${body}</p>
      ${createPortraitFrame('creator-frame--modal')}
      <div class="cb-coffee-coupon__links">
        <a
          class="cb-coffee-coupon__link"
          href="${DEVELOPER.coffeeChatUrl}"
          target="_blank"
          rel="noopener noreferrer"
          title="${DEVELOPER.coffeeChatLabel}"
          aria-label="${DEVELOPER.coffeeChatLabel}"
        >
          <span class="cb-coffee-coupon__link-icon">${ICONS.coffee}</span>
        </a>
        <a
          class="cb-coffee-coupon__link"
          href="${DEVELOPER.instagramUrl}"
          target="_blank"
          rel="noopener noreferrer"
          title="${DEVELOPER.instagramLabel}"
          aria-label="${DEVELOPER.instagramLabel}"
        >
          <span class="cb-coffee-coupon__link-icon">${ICONS.instagram}</span>
        </a>
        <a
          class="cb-coffee-coupon__link"
          href="${DEVELOPER.githubUrl}"
          target="_blank"
          rel="noopener noreferrer"
          title="${DEVELOPER.githubLabel}"
          aria-label="GitHub ${DEVELOPER.githubLabel}"
        >
          <span class="cb-coffee-coupon__link-icon">${ICONS.github}</span>
        </a>
        <a
          class="cb-coffee-coupon__link"
          href="mailto:${DEVELOPER.email}?subject=${encodeURIComponent('yazii 응원 / 커피챗')}"
          title="${DEVELOPER.email}"
          aria-label="이메일 ${DEVELOPER.email}"
        >
          <span class="cb-coffee-coupon__link-icon">${ICONS.email}</span>
        </a>
      </div>
      <div class="cb-coffee-coupon__note">
        <span class="cb-coffee-coupon__note-icon">${ICONS.info}</span>
        <p>
          개인 졸업 축하 프로젝트 · Duolingo와 무관합니다.
          진행 기록은 이 기기(localStorage)에만 저장됩니다.
        </p>
      </div>
    </div>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  const closeBtn = dialog.querySelector('[data-action="close"]');

  function close() {
    document.removeEventListener('keydown', onKeyDown);
    overlay.remove();
    previouslyFocused?.focus();
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  }

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close();
  });

  closeBtn?.addEventListener('click', close);
  document.addEventListener('keydown', onKeyDown);
  queueMicrotask(() => {
    if (closeBtn instanceof HTMLElement) closeBtn.focus();
  });
}

/**
 * Map AD promo — quiet card under map cover (opens creator coupon modal).
 */
export function createCreatorPromoCard() {
  const card = document.createElement('aside');
  card.className = 'creator-promo';
  card.setAttribute('aria-label', '만든 사람 응원하기');

  card.innerHTML = `
    <div class="creator-promo__badge" aria-hidden="true">AD</div>
    <div class="creator-promo__row">
      <div class="creator-promo__copy">
        <p class="creator-promo__title">만든 사람 응원하기</p>
        <p class="creator-promo__body">열심히 개발한 야지님을 응원해주세요!</p>
      </div>
      <div class="creator-promo__art" aria-hidden="true">
        ${ICONS.coffee.replace('cb-coffee-coupon__icon-svg', 'creator-promo__cup')}
      </div>
    </div>
    <button type="button" class="creator-promo__cta">응원하러 가기</button>
  `;

  card.querySelector('.creator-promo__cta')?.addEventListener('click', () => {
    openCreatorSupport();
  });

  return card;
}
