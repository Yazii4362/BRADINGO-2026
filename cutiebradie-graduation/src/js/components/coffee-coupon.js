/**
 * Creator support — map promo card + shared modal (yazii).
 */

export const DEVELOPER = Object.freeze({
  handle: 'yazii',
  displayName: '야지',
  githubUrl: 'https://github.com/Yazii4362',
  githubLabel: 'github.com/Yazii4362',
  email: 'image4362@gmail.com',
  /** Placeholder — replace with real coffee-chat booking URL */
  coffeeChatUrl: 'mailto:image4362@gmail.com?subject=yazii%20%EC%BB%A4%ED%94%BC%EC%B1%97%20%EC%9A%94%EC%B2%AD',
  coffeeChatLabel: '커피챗 요청하기',
  /** Placeholder — replace with real Instagram URL */
  instagramUrl: 'https://instagram.com/',
  instagramLabel: 'Instagram',
  duolingoInviteUrl: 'https://invite.duolingo.com/BDHTZTB5CWWKTR26THJHW7DZIA',
  duolingoInviteLabel: '듀오링고 친구 맺기',
});

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
  const title =
    variant === 'easter' ? '☕ yazii 커피챗 쿠폰' : '만든 사람 응원하기';
  const body =
    variant === 'easter'
      ? `이 초대장을 만든 개발자 <strong>${DEVELOPER.handle}</strong>에게<br />커피챗을 요청할 수 있어요.`
      : `이 초대장을 만든 <strong>${DEVELOPER.displayName}</strong> (${DEVELOPER.handle})를<br />커피챗·인스타·듀오링고로 응원해 주세요.`;

  dialog.innerHTML = `
    <div class="cb-coffee-coupon__ticket">
      <p class="cb-coffee-coupon__eyebrow">${eyebrow}</p>
      <h2 id="creator-support-title" class="cb-coffee-coupon__title">${title}</h2>
      <p class="cb-coffee-coupon__body">${body}</p>
      <div class="cb-coffee-coupon__perks">
        <a
          class="cb-coffee-coupon__link"
          href="${DEVELOPER.coffeeChatUrl}"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="cb-coffee-coupon__link-label">Coffee chat</span>
          <span class="cb-coffee-coupon__link-value">${DEVELOPER.coffeeChatLabel}</span>
        </a>
        <a
          class="cb-coffee-coupon__link"
          href="${DEVELOPER.duolingoInviteUrl}"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="cb-coffee-coupon__link-label">Duolingo</span>
          <span class="cb-coffee-coupon__link-value">${DEVELOPER.duolingoInviteLabel}</span>
        </a>
        <a
          class="cb-coffee-coupon__link"
          href="${DEVELOPER.instagramUrl}"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="cb-coffee-coupon__link-label">Instagram</span>
          <span class="cb-coffee-coupon__link-value">${DEVELOPER.instagramLabel}</span>
        </a>
        <a
          class="cb-coffee-coupon__link"
          href="${DEVELOPER.githubUrl}"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="cb-coffee-coupon__link-label">GitHub</span>
          <span class="cb-coffee-coupon__link-value">${DEVELOPER.githubLabel}</span>
        </a>
        <a
          class="cb-coffee-coupon__link"
          href="mailto:${DEVELOPER.email}?subject=${encodeURIComponent('yazii 응원 / 커피챗')}"
        >
          <span class="cb-coffee-coupon__link-label">Email</span>
          <span class="cb-coffee-coupon__link-value">${DEVELOPER.email}</span>
        </a>
      </div>
      <p class="cb-coffee-coupon__note">
        개인 졸업 축하 프로젝트 · Duolingo와 무관합니다.<br />
        진행 기록은 이 기기(localStorage)에만 저장됩니다.
      </p>
    </div>
    <div class="cb-coffee-coupon__actions">
      <button type="button" class="cb-button cb-button--primary cb-button--fill" data-action="close">
        닫기
      </button>
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
 * Duolingo-style promo card for map.
 * Placed under the course cover on tablet/PC; docked at map bottom on mobile.
 */
export function createCreatorPromoCard() {
  const card = document.createElement('aside');
  card.className = 'creator-promo';
  card.setAttribute('aria-label', '만든 사람 응원하기');

  card.innerHTML = `
    <div class="creator-promo__badge" aria-hidden="true">AD</div>
    <p class="creator-promo__title">만든 사람 응원하기</p>
    <p class="creator-promo__body">이 초대장을 만든 ${DEVELOPER.displayName}를 응원해 주세요</p>
    <button type="button" class="creator-promo__cta">응원하러 가기</button>
  `;

  card.querySelector('.creator-promo__cta')?.addEventListener('click', () => {
    openCreatorSupport();
  });

  return card;
}
