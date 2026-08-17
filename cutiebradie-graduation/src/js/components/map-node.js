/**
 * Map path slots — Figma 390 canvas node centers:
 * n1 193 / n2 148 / n3 117 / n4 148 / n5 207  (offset from 195)
 */
const PATH_SLOTS = [
  { className: 'map-path__item--slot-1', lane: 'c', offset: '0%' },
  { className: 'map-path__item--slot-2', lane: 'l1', offset: '-12%' },
  { className: 'map-path__item--slot-3', lane: 'l2', offset: '-20%' },
  { className: 'map-path__item--slot-4', lane: 'l1', offset: '-12%' },
  { className: 'map-path__item--slot-5', lane: 'c', offset: '3%' },
];

const NODE_ACTIVE_SRC = './assets/images/node-active.svg';
const NODE_ACTIVE_PRESSED_SRC = './assets/images/node-active-pressed.svg';
const NODE_LOCKED_SRC = './assets/images/node-locked.svg';
const NODE_LOCKED_PRESSED_SRC = './assets/images/node-locked-pressed.svg';
const NODE_ENDING_SRC = './assets/images/node-ending.svg';
const ENDING_NODE_ID = 'n5';

/**
 * @param {HTMLImageElement} asset
 * @param {string} defaultSrc
 * @param {string} pressedSrc
 * @param {HTMLButtonElement} btn
 */
function bindPressSwap(asset, defaultSrc, pressedSrc, btn) {
  const setPressed = (pressed) => {
    if (pressedSrc !== defaultSrc) {
      asset.src = pressed ? pressedSrc : defaultSrc;
    }
    btn.classList.toggle('is-pressed', pressed);
  };

  btn.addEventListener('pointerdown', () => setPressed(true));
  btn.addEventListener('pointerup', () => setPressed(false));
  btn.addEventListener('pointercancel', () => setPressed(false));
  btn.addEventListener('pointerleave', () => setPressed(false));
}

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
  wrap.style.setProperty('--lane-offset', slot.offset);

  const stack = document.createElement('div');
  stack.className = 'cb-map-node-stack';

  const isEnding = props.id === ENDING_NODE_ID;
  const isLocked = props.status === 'locked';

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `cb-map-node cb-map-node--${props.status}${isEnding ? ' cb-map-node--ending' : ''}`;
  btn.dataset.nodeId = props.id;
  btn.dataset.status = props.status;
  btn.setAttribute('aria-label', props.title);

  if (isLocked) {
    btn.setAttribute('aria-disabled', 'true');
  }

  let defaultSrc;
  let pressedSrc;
  if (isEnding) {
    defaultSrc = NODE_ENDING_SRC;
    pressedSrc = NODE_ENDING_SRC;
  } else if (isLocked) {
    defaultSrc = NODE_LOCKED_SRC;
    pressedSrc = NODE_LOCKED_PRESSED_SRC;
  } else {
    defaultSrc = NODE_ACTIVE_SRC;
    pressedSrc = NODE_ACTIVE_PRESSED_SRC;
  }

  const asset = document.createElement('img');
  asset.className = 'cb-map-node__asset';
  asset.src = defaultSrc;
  asset.alt = '';
  asset.width = isEnding ? 80 : 71;
  asset.height = isEnding ? 90 : 65;
  asset.setAttribute('aria-hidden', 'true');
  asset.decoding = 'async';
  btn.appendChild(asset);
  bindPressSwap(asset, defaultSrc, pressedSrc, btn);

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
 * @param {string} fromLane
 * @param {string} toLane
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
