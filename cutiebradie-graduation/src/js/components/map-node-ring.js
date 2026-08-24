/**
 * CB / Map / Node Ring — Duolingo-style progress ring geometry.
 * viewBox 0 0 100 100, outer R=50 / inner R=42 (grey track).
 */

/** @param {string} [ringId] Unique clip id when multiple rings mount. */
export function createMapNodeRingSvg(ringId = `ring-${Math.random().toString(36).slice(2, 9)}`) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'cb-map-node-ring');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = `
    <defs>
      <clipPath id="clip-${ringId}">
        <path d="M0,-50L0,-42Z"></path>
      </clipPath>
    </defs>
    <g transform="translate(50, 50)">
      <path
        class="cb-map-node-ring__track"
        d="M0,-50A50,50,0,1,1,0,50A50,50,0,1,1,0,-50M0,-42A42,42,0,1,0,0,42A42,42,0,1,0,0,-42Z"
        fill="currentColor"
      ></path>
      <circle
        class="cb-map-node-ring__cap"
        clip-path="url(#clip-${ringId})"
        cx="0"
        cy="-46"
        r="4"
        fill="var(--neutral-100)"
      ></circle>
      <path
        class="cb-map-node-ring__progress"
        d="M0,-50L0,-42Z"
        fill="var(--map-node-green)"
      ></path>
    </g>
  `;
  return svg;
}
