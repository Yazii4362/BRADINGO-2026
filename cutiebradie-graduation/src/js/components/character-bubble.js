/**
 * CB / Map / Character Bubble — speech over profile when tapping map cover.
 * Lines cycle in order on each open.
 */

export const CHARACTER_LINES = Object.freeze([
  '안녕, 난 브래디야!',
  '졸업 축하해줘서 고마워! 🎓',
  "Hi, I'm Bradie!",
  "I've finally graduated!",
]);

/**
 * @param {{
 *   lines?: ReadonlyArray<string>,
 * }} [options]
 */
export function createCharacterBubbleController(options = {}) {
  const lines = options.lines ?? CHARACTER_LINES;
  let index = 0;
  /** @type {HTMLElement | null} */
  let activeAnchor = null;
  /** @type {number} */
  let hideTimer = 0;

  function hide() {
    window.clearTimeout(hideTimer);
    document.removeEventListener('pointerdown', onOutside, true);
    if (activeAnchor) {
      activeAnchor.querySelector('.cb-character-bubble')?.remove();
      activeAnchor.classList.remove('is-speaking');
      activeAnchor = null;
    }
  }

  /**
   * @param {Event} event
   */
  function onOutside(event) {
    const target = event.target;
    if (!(target instanceof Node) || !activeAnchor) return;
    if (activeAnchor.contains(target) || activeAnchor.closest('.cb-map-cover')?.contains(target)) {
      return;
    }
    hide();
  }

  /**
   * @param {HTMLElement} anchor — profile element to attach bubble to
   */
  function show(anchor) {
    hide();

    const line = lines[index % lines.length];
    index = (index + 1) % lines.length;

    const bubble = document.createElement('div');
    bubble.className = 'cb-character-bubble';
    bubble.setAttribute('role', 'status');
    bubble.setAttribute('aria-live', 'polite');
    bubble.innerHTML = `
      <p class="cb-character-bubble__text">${line}</p>
      <span class="cb-character-bubble__tail" aria-hidden="true"></span>
    `;

    activeAnchor = anchor;
    anchor.classList.add('is-speaking');
    anchor.appendChild(bubble);

    requestAnimationFrame(() => {
      bubble.classList.add('is-visible');
    });

    hideTimer = window.setTimeout(() => hide(), 2800);
    window.setTimeout(() => {
      document.addEventListener('pointerdown', onOutside, true);
    }, 0);
  }

  return { show, hide };
}
