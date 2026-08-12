/** 3-lane path: Center → Left → Center → Right → Center */
const PATH_SLOTS = [
  { className: 'map-path__item--lane-center', lane: 'center' },
  { className: 'map-path__item--lane-left', lane: 'left' },
  { className: 'map-path__item--lane-center', lane: 'center' },
  { className: 'map-path__item--lane-right', lane: 'right' },
  { className: 'map-path__item--lane-center', lane: 'center' },
];

const LOCK_ICON = `<svg class="cb-map-node__lock" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 10V8a5 5 0 0 1 10 0v2" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><rect x="5" y="10" width="14" height="11" rx="2.5" fill="currentColor"/></svg>`;

/**
 * CB / Map / Node — basic skill button.
 * Locked nodes stay clickable (aria-disabled) so lock tooltip can show.
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
  wrap.dataset.lane = slot.lane;

  const stack = document.createElement('div');
  stack.className = 'cb-map-node-stack';

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `cb-map-node cb-map-node--${props.status}`;
  btn.dataset.nodeId = props.id;
  btn.dataset.status = props.status;
  btn.setAttribute('aria-label', props.title);

  if (props.status === 'locked') {
    btn.setAttribute('aria-disabled', 'true');
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
 * Thin connector between two path lanes.
 * @param {'left' | 'center' | 'right'} fromLane
 * @param {'left' | 'center' | 'right'} toLane
 */
export function createMapPathConnector(fromLane, toLane) {
  const el = document.createElement('div');
  el.className = 'map-path__connector';
  el.dataset.from = fromLane;
  el.dataset.to = toLane;
  el.setAttribute('aria-hidden', 'true');
  return el;
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

export { PATH_SLOTS };
