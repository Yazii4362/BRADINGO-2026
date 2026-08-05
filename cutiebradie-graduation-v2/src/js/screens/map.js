import { COURSE_NODES } from '../data/course.js';
import { createMapNodeButton } from '../components/map-node.js';

/**
 * @param {{
 *   nodeStatus: Record<string, 'locked' | 'active' | 'completed'>,
 *   highlightNodeId?: string | null,
 *   onNodeTap: (nodeId: string, status: string, anchor: DOMRect) => void,
 *   onHighlightPlayed?: () => void
 * }} props
 */
export function renderMap(props) {
  const el = document.createElement('section');
  el.className = 'screen screen--map';
  el.dataset.screen = 'map';

  const list = document.createElement('ul');
  list.className = 'map-list';

  COURSE_NODES.forEach((node) => {
    const status = props.nodeStatus[node.id] ?? 'locked';
    const item = document.createElement('li');
    const button = createMapNodeButton(
      {
        id: node.id,
        title: node.title,
        typeLabel: node.typeLabel,
        status,
      },
      (event) => {
        const target = event.currentTarget;
        if (!(target instanceof HTMLElement)) return;
        props.onNodeTap(node.id, status, target.getBoundingClientRect());
      }
    );
    item.appendChild(button);
    list.appendChild(item);
  });

  el.innerHTML = `
    <p class="screen__eyebrow">S02 · Course Map</p>
    <h1 class="screen__title">코스 맵</h1>
    <p class="screen__body">유일한 허브. 노드를 탭해 진행하세요.</p>
  `;
  el.appendChild(list);

  if (props.highlightNodeId) {
    const target = el.querySelector(`[data-node-id="${props.highlightNodeId}"]`);
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
 * @param {HTMLElement} target
 */
async function playUnlockHighlight(target) {
  target.classList.add('is-unlock-highlight');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    window.setTimeout(() => target.classList.remove('is-unlock-highlight'), 600);
    return;
  }

  try {
    const { default: gsap } = await import('https://cdn.jsdelivr.net/npm/gsap@3.13.0/+esm');
    await gsap.fromTo(
      target,
      { scale: 0.94, boxShadow: '0 0 0 0 rgba(88, 204, 2, 0)' },
      {
        scale: 1,
        boxShadow: '0 0 0 6px rgba(88, 204, 2, 0.28)',
        duration: 0.45,
        ease: 'back.out(1.6)',
        yoyo: true,
        repeat: 1,
        clearProps: 'transform,boxShadow',
      }
    );
  } catch {
    // CDN unavailable — CSS class still provides a brief highlight.
    await new Promise((resolve) => window.setTimeout(resolve, 700));
  } finally {
    target.classList.remove('is-unlock-highlight');
  }
}
