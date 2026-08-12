/** Staggered center path — slot offsets match CB / Map / Path (Figma). */
const PATH_SLOTS = [
  { className: 'map-path__item--slot-0' },
  { className: 'map-path__item--slot-1' },
  { className: 'map-path__item--slot-2' },
  { className: 'map-path__item--slot-3' },
  { className: 'map-path__item--slot-4' },
];

const LOCK_ICON = `<svg class="cb-map-node__lock" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 10V8a5 5 0 0 1 10 0v2" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><rect x="5" y="10" width="14" height="11" rx="2.5" fill="currentColor"/></svg>`;

/**
 * CB / Map / Node — basic skill button (Duolingo path unit without progress ring).
 * Structure: path item > stack > button + label
 *
 * @param {{
 *   id: string,
 *   title: string,
 *   status: 'locked' | 'active' | 'completed',
 *   pathIndex: number
 * }} props
 * @param {(event: MouseEvent) => void} onClick
 */
export function createMapNodeButton(props, onClick) {
  const slot = PATH_SLOTS[props.pathIndex] ?? PATH_SLOTS[0];
  const wrap = document.createElement('div');
  wrap.className = `map-path__item ${slot.className}`;

  const stack = document.createElement('div');
  stack.className = 'cb-map-node-stack';

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `cb-map-node cb-map-node--${props.status}`;
  btn.dataset.nodeId = props.id;
  btn.dataset.status = props.status;
  btn.setAttribute('aria-label', props.title);

  if (props.status === 'locked') {
    btn.disabled = true;
    btn.insertAdjacentHTML('beforeend', LOCK_ICON);
  } else {
    const glyph = document.createElement('span');
    glyph.className = 'cb-map-node__glyph';
    glyph.setAttribute('aria-hidden', 'true');
    glyph.textContent = props.status === 'completed' ? '✓' : '★';
    btn.appendChild(glyph);
  }

  btn.addEventListener('click', onClick);

  const label = document.createElement('span');
  label.className = 'cb-map-node__label';
  label.textContent = props.title;

  stack.append(btn, label);
  wrap.appendChild(stack);

  return wrap;
}

/**
 * @param {HTMLElement} wrap
 */
export function getMapNodeAnchorRect(wrap) {
  const circle = wrap.querySelector('.cb-map-node');
  if (circle instanceof HTMLElement) {
    return circle.getBoundingClientRect();
  }
  return wrap.getBoundingClientRect();
}
