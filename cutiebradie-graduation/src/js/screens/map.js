import { BRAND, COURSE_NODES } from '../data/course.js';
import { localizeNode, t } from '../i18n.js';
import { createAppHeader } from '../components/app-header.js';
import { createCharacterBubbleController } from '../components/character-bubble.js';
import { createCreatorPromoCard } from '../components/coffee-coupon.js';
import { createMapNodeButton } from '../components/map-node.js';
import {
  EASE,
  MOTION,
  createMotionScope,
  loadGsap,
  prefersReducedMotion,
} from '../lib/motion.js';

/**
 * @param {{
 *   nodeStatus: Record<string, 'locked' | 'active' | 'completed'>,
 *   highlightNodeId?: string | null,
 *   onNodeTap: (nodeId: string, status: string) => void,
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

  const characterBubble = createCharacterBubbleController();

  const cover = document.createElement('button');
  cover.type = 'button';
  cover.className = 'cb-map-cover';
  cover.setAttribute('aria-label', t('map.coverAria', { title: t('brand.courseTitle') }));
  cover.innerHTML = `
    <div class="cb-map-cover__profile">
      <img
        class="cb-map-cover__profile-img"
        src="./assets/images/profile-end.webp"
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
  bird.className = 'map-path__bird map-path__bird--bradie';
  bird.src = './assets/images/lotties/bradie-lang.webp';
  bird.alt = '';
  bird.width = 360;
  bird.height = 360;
  bird.setAttribute('aria-hidden', 'true');
  bird.decoding = 'async';
  path.appendChild(bird);

  COURSE_NODES.forEach((node, index) => {
    const status = props.nodeStatus[node.id] ?? 'locked';
    const localized = localizeNode(node);

    const nodeWrap = createMapNodeButton(
      {
        id: node.id,
        title: localized.title,
        mapLabel: localized.mapLabel,
        status,
        pathIndex: index,
      },
      () => {
        props.onNodeTap(node.id, status);
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

  const scope = createMotionScope();
  scope.listen(promoMq, 'change', placeCreatorPromo);

  const focusId =
    props.highlightNodeId ||
    COURSE_NODES.find((node) => props.nodeStatus[node.id] === 'active')?.id ||
    null;

  queueMicrotask(() => {
    if (scope.disposed) return;
    if (focusId) scrollMapNodeIntoView(el, focusId);
  });

  if (props.highlightNodeId) {
    const target = el.querySelector(
      `.map-path__item[data-node-id="${props.highlightNodeId}"] .cb-map-node`
    );
    if (target instanceof HTMLElement) {
      playUnlockHighlight(target, scope).finally(() => {
        props.onHighlightPlayed?.();
      });
    } else {
      props.onHighlightPlayed?.();
    }
  }

  el.__cleanup = () => scope.dispose();
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
 * One-shot celebration on the node that just became available.
 * Never replays on refresh — app.js only passes highlightNodeId right after a completion.
 * @param {HTMLElement} target
 * @param {ReturnType<typeof createMotionScope>} scope
 */
async function playUnlockHighlight(target, scope) {
  target.classList.add('cb-map-node--unlocking');

  const reduceMotion = prefersReducedMotion();
  if (reduceMotion) {
    await wait(200);
    if (target.isConnected) target.classList.remove('cb-map-node--unlocking');
    return;
  }

  spawnUnlockSparkles(target, scope);

  const gsap = await loadGsap();
  if (!target.isConnected || scope.disposed) return;

  if (!gsap) {
    target.classList.add('cb-map-node--unlock-fallback');
    await wait(MOTION.unlock * 1000);
    if (target.isConnected) target.classList.remove('cb-map-node--unlock-fallback');
  } else {
    scope.onDispose(() => gsap.killTweensOf(target));
    gsap.killTweensOf(target);
    try {
      await gsap.fromTo(
        target,
        { scale: 0.8, opacity: 0.5 },
        {
          keyframes: [
            { scale: 1.08, opacity: 1, duration: MOTION.unlock * 0.6, ease: EASE.standard },
            { scale: 1, duration: MOTION.unlock * 0.4, ease: EASE.standard },
          ],
          clearProps: 'transform,opacity',
        }
      );
    } finally {
      if (target.isConnected) gsap.killTweensOf(target);
    }
  }

  if (target.isConnected) target.classList.remove('cb-map-node--unlocking');
}

/** @param {number} ms */
function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

/**
 * 4 sparkles around the node — deliberately small, self-removing.
 * @param {HTMLElement} target
 * @param {ReturnType<typeof createMotionScope>} scope
 */
function spawnUnlockSparkles(target, scope) {
  const burst = document.createElement('div');
  burst.className = 'map-node-sparkles';
  burst.setAttribute('aria-hidden', 'true');
  const offsets = [
    [-34, -26],
    [34, -30],
    [-28, 24],
    [30, 20],
  ];
  offsets.forEach(([dx, dy], index) => {
    const spark = document.createElement('span');
    spark.className = 'map-node-sparkles__item';
    spark.style.setProperty('--dx', `${dx}px`);
    spark.style.setProperty('--dy', `${dy}px`);
    spark.style.setProperty('--d', `${index * 55}ms`);
    burst.appendChild(spark);
  });
  target.appendChild(burst);
  scope.onDispose(() => burst.remove());
  scope.after(() => burst.remove(), MOTION.unlock * 1000 + 300);
}
