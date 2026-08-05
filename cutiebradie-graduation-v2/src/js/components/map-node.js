/** Status label + icon glyph for map nodes (placeholder, not final art). */
const STATUS_UI = {
  locked: { label: '잠금', glyph: 'L' },
  active: { label: '현재', glyph: '★' },
  completed: { label: '완료', glyph: '✓' },
};

/**
 * @param {{
 *   id: string,
 *   title: string,
 *   typeLabel: string,
 *   status: 'locked' | 'active' | 'completed'
 * }} props
 * @param {(event: MouseEvent) => void} onClick
 */
export function createMapNodeButton(props, onClick) {
  const ui = STATUS_UI[props.status];
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `map-node is-${props.status}`;
  btn.dataset.nodeId = props.id;
  btn.dataset.status = props.status;
  btn.setAttribute('aria-label', `${props.title}, ${ui.label}`);

  btn.innerHTML = `
    <span class="map-node__badge" aria-hidden="true">${ui.glyph}</span>
    <span class="map-node__meta">
      <span class="map-node__title">${props.title}</span>
      <span class="map-node__type">${props.typeLabel}</span>
    </span>
    <span class="map-node__status">${ui.label}</span>
  `;

  btn.addEventListener('click', onClick);
  return btn;
}
