import { BRAND, COURSE_NODES } from '../data/course.js';
import { localizeNode, t } from '../i18n.js';
import { createAppHeader } from '../components/app-header.js';
import { createCharacterBubbleController } from '../components/character-bubble.js';
import { createCreatorPromoCard } from '../components/coffee-coupon.js';
import {
  createMapNodeButton,
  createMapPathConnector,
  getMapNodeAnchorRect,
  PATH_SLOTS,
} from '../components/map-node.js';
import { importFromCdns } from '../lib/cdn-import.js';

/**
 * @param {{
 *   nodeStatus: Record<string, 'locked' | 'active' | 'completed'>,
 *   highlightNodeId?: string | null,
 *   onNodeTap: (nodeId: string, status: string, anchor: DOMRect, anchorEl: HTMLElement) => void,
 *   onHighlightPlayed?: () => void
 * }} props
 */
export function renderMap(props) {
  const el = document.createElement('section');
  el.className = 'screen screen--map';
  el.dataset.screen = 'map';

  const top = document.createElement('div');
  top.className = 'map-top';
  top.appendChild(createAppHeader({ gems: 2026 }));

  const lastNodeReached =
    props.nodeStatus.n5 === 'active' || props.nodeStatus.n5 === 'completed';
  const profileSrc = lastNodeReached
    ? './assets/images/profile-end.webp'
    : './assets/images/profile.webp';

  const characterBubble = createCharacterBubbleController();

  const cover = document.createElement('button');
  cover.type = 'button';
  cover.className = 'cb-map-cover';
  cover.setAttribute('aria-label', t('map.coverAria', { title: t('brand.courseTitle') }));
  cover.innerHTML = `
    <div class="cb-map-cover__profile">
      <img
        class="cb-map-cover__profile-img"
        src="${profileSrc}"
        alt="${t('map.profileAlt')}"
        width="52"
        height="52"
        decoding="async"
      />
    </div>
    <div class="cb-map-cover__copy">
      <p class="cb-map-cover__period">${BRAND.coursePeriod}</p>
      <h1 class="cb-map-cover__title">${t('brand.courseTitle')}</h1>
    </div>
  `;

  const profile = cover.querySelector('.cb-map-cover__profile');
  cover.addEventListener('click', () => {
    if (profile instanceof HTMLElement) characterBubble.show(profile);
  });

  top.appendChild(cover);

  const canvas = document.createElement('div');
  canvas.className = 'map-canvas';

  const path = document.createElement('div');
  path.className = 'map-path';

  const bird = document.createElement('img');
  bird.className = 'map-path__bird';
  bird.src = './assets/images/map-irumae.svg';
  bird.alt = '';
  bird.width = 131;
  bird.height = 144;
  bird.setAttribute('aria-hidden', 'true');
  bird.decoding = 'async';
  path.appendChild(bird);

  COURSE_NODES.forEach((node, index) => {
    const status = props.nodeStatus[node.id] ?? 'locked';
    const localized = localizeNode(node);
    const slot = PATH_SLOTS[index] ?? PATH_SLOTS[0];

    if (index > 0) {
      const prev = PATH_SLOTS[index - 1] ?? PATH_SLOTS[0];
      path.appendChild(createMapPathConnector(prev.offset, slot.offset));
    }

    const nodeWrap = createMapNodeButton(
      {
        id: node.id,
        title: localized.title,
        status,
        pathIndex: index,
      },
      (event) => {
        const target = event.currentTarget;
        if (!(target instanceof HTMLElement)) return;
        const item = target.closest('.map-path__item');
        const anchorEl = item instanceof HTMLElement ? item : target;
        const anchor =
          item instanceof HTMLElement ? getMapNodeAnchorRect(item) : target.getBoundingClientRect();
        props.onNodeTap(node.id, status, anchor, anchorEl);
      }
    );
    nodeWrap.dataset.nodeId = node.id;
    path.appendChild(nodeWrap);
  });

  canvas.appendChild(path);

  const promo = createCreatorPromoCard();
  const promoMq = window.matchMedia('(min-width: 768px)');

  /** Desktop/tablet: under 병건이의 UOS LIFE. Mobile: after map path (one scroll). */
  const placeCreatorPromo = () => {
    if (promoMq.matches) {
      promo.classList.remove('creator-promo--dock');
      top.appendChild(promo);
    } else {
      promo.classList.add('creator-promo--dock');
      el.appendChild(promo);
    }
  };

  el.append(top, canvas);
  placeCreatorPromo();
  promoMq.addEventListener('change', placeCreatorPromo);

  const focusId =
    props.highlightNodeId ||
    COURSE_NODES.find((node) => props.nodeStatus[node.id] === 'active')?.id ||
    null;

  queueMicrotask(() => {
    if (focusId) scrollMapNodeIntoView(el, focusId);
  });

  if (props.highlightNodeId) {
    const target = el.querySelector(
      `.map-path__item[data-node-id="${props.highlightNodeId}"] .cb-map-node`
    );
    if (target instanceof HTMLElement) {
      playUnlockHighlight(target).finally(() => {
        props.onHighlightPlayed?.();
      });
    } else {
      props.onHighlightPlayed?.();
    }
  }

  return el;
}

/**
 * Scroll active/unlocked node into view within the correct scroll container.
 * Mobile: screen--map scrolls. Landscape ≥960: .map-canvas scrolls.
 * @param {HTMLElement} mapScreen
 * @param {string} nodeId
 */
function scrollMapNodeIntoView(mapScreen, nodeId) {
  const target = mapScreen.querySelector(`.map-path__item[data-node-id="${nodeId}"] .cb-map-node`);
  if (!(target instanceof HTMLElement) || !mapScreen.isConnected) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const behavior = reduceMotion ? 'auto' : 'smooth';
  const canvas = mapScreen.querySelector('.map-canvas');
  const landscape = window.matchMedia('(min-width: 960px)').matches;

  if (landscape && canvas instanceof HTMLElement) {
    const targetRect = target.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const nextTop =
      canvas.scrollTop +
      (targetRect.top - canvasRect.top) -
      canvas.clientHeight / 2 +
      targetRect.height / 2;
    canvas.scrollTo({ top: Math.max(0, nextTop), behavior });
    return;
  }

  target.scrollIntoView({
    block: 'center',
    inline: 'nearest',
    behavior,
  });
}

/**
 * @param {HTMLElement} target
 */
async function playUnlockHighlight(target) {
  target.classList.add('cb-map-node--unlocking');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    window.setTimeout(() => {
      if (target.isConnected) target.classList.remove('cb-map-node--unlocking');
    }, 450);
    return;
  }

  /** @type {{ killTweensOf: (t: HTMLElement) => void, fromTo: Function } | null} */
  let gsap = null;
  try {
    const mod = await importFromCdns(
      [
        'https://cdn.jsdelivr.net/npm/gsap@3.13.0/+esm',
        'https://unpkg.com/gsap@3.13.0/index.js',
        'https://esm.sh/gsap@3.13.0',
      ],
      'gsap'
    );
    gsap = mod.default;
    if (!target.isConnected || !gsap) return;
    gsap.killTweensOf(target);
    await gsap.fromTo(
      target,
      { scale: 0.88 },
      {
        scale: 1,
        duration: 0.45,
        ease: 'back.out(2)',
        clearProps: 'transform',
      }
    );
  } catch {
    await new Promise((resolve) => window.setTimeout(resolve, 450));
  } finally {
    if (gsap && target.isConnected) gsap.killTweensOf(target);
    if (target.isConnected) target.classList.remove('cb-map-node--unlocking');
  }
}
