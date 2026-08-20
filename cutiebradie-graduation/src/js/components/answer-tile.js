/**
 * Shared selection tile — Figma 170×219 card (white / #EBEBEB edge / bottom ledge).
 * Used by language select and quiz answer grids.
 *
 * @param {{
 *   id: string,
 *   label?: string,
 *   image?: string,
 *   alt?: string,
 *   selected?: boolean,
 *   role?: string,
 *   ariaSelected?: boolean,
 *   ariaPressed?: boolean,
 *   className?: string
 * }} props
 * @returns {HTMLButtonElement}
 */
export function createAnswerTile(props) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `cb-answer-card cb-answer-card--tile${props.selected ? ' is-selected cb-answer-card--selected' : ''}${
    props.className ? ` ${props.className}` : ''
  }`;
  btn.dataset.choiceId = props.id;
  if (props.role) btn.setAttribute('role', props.role);
  if (props.ariaSelected != null) {
    btn.setAttribute('aria-selected', props.ariaSelected ? 'true' : 'false');
  }
  if (props.ariaPressed != null) {
    btn.setAttribute('aria-pressed', props.ariaPressed ? 'true' : 'false');
  }
  btn.setAttribute('aria-label', props.alt || props.label || props.id);

  fillAnswerTile(btn, props);
  return btn;
}

/**
 * @param {HTMLButtonElement} btn
 * @param {{ label?: string, image?: string, alt?: string }} choice
 */
export function fillAnswerTile(btn, choice) {
  btn.replaceChildren();
  const imageValue = typeof choice.image === 'string' ? choice.image.trim() : '';
  const wantsMedia = Object.prototype.hasOwnProperty.call(choice, 'image');

  const media = document.createElement('span');
  media.className = 'cb-answer-card__media';

  if (imageValue) {
    btn.classList.add('cb-answer-card--has-image');
    const img = document.createElement('img');
    img.className = 'cb-answer-card__image';
    img.alt = choice.alt || choice.label || '';
    img.decoding = 'async';
    img.addEventListener('error', () => {
      img.replaceWith(createTilePlaceholder(choice));
    });
    media.appendChild(img);
    img.src = imageValue;
  } else if (wantsMedia) {
    btn.classList.remove('cb-answer-card--has-image');
    media.appendChild(createTilePlaceholder(choice));
  } else {
    btn.classList.remove('cb-answer-card--has-image');
  }

  if (media.childNodes.length) {
    btn.appendChild(media);
  }

  const labelText = (choice.label || '').trim();
  if (labelText) {
    const label = document.createElement('span');
    label.className = 'cb-answer-card__label';
    label.textContent = labelText;
    btn.appendChild(label);
  } else {
    btn.classList.add('cb-answer-card--media-only');
  }
}

/**
 * @param {{ label?: string, alt?: string, id?: string }} choice
 */
function createTilePlaceholder(choice) {
  const placeholder = document.createElement('span');
  placeholder.className = 'cb-answer-card__placeholder';
  placeholder.setAttribute('role', 'img');
  placeholder.setAttribute('aria-label', choice.alt || choice.label || choice.id || '');
  placeholder.textContent = (choice.label || choice.alt || choice.id || '?').slice(0, 1);
  return placeholder;
}
