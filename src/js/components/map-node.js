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

const NODE_ACTIVE_SRC = './assets/images/map/node-active.svg';
const NODE_ACTIVE_PRESSED_SRC = './assets/images/map/node-active-pressed.svg';
const NODE_LOCKED_SRC = './assets/images/map/node-locked.svg';
const NODE_LOCKED_PRESSED_SRC = './assets/images/map/node-locked-pressed.svg';
const NODE_ENDING_LOCKED_SRC = './assets/images/map/node-ending.svg';
const NODE_ENDING_ACTIVE_SRC = './assets/images/map/node-ending-active.webp';
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
 * Locked nodes stay clickable but do not enter the chapter.
 *
 * @param {{
 *   id: string,
 *   title: string,
 *   mapLabel?: string,
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
  const mapLabel = props.mapLabel || props.title;

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
    const endingUnlocked = props.status === 'active' || props.status === 'completed';
    defaultSrc = endingUnlocked ? NODE_ENDING_ACTIVE_SRC : NODE_ENDING_LOCKED_SRC;
    pressedSrc = defaultSrc;
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
  asset.width = isEnding ? 130 : 71;
  asset.height = isEnding ? 130 : 65;
  asset.setAttribute('aria-hidden', 'true');
  asset.decoding = 'async';
  btn.appendChild(asset);
  bindPressSwap(asset, defaultSrc, pressedSrc, btn);

  btn.addEventListener('click', onClick);

  const label = document.createElement('span');
  label.className = 'cb-map-node__label';
  label.textContent = mapLabel;

  stack.append(btn, label);
  wrap.appendChild(stack);

  return wrap;
}
