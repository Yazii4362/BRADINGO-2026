import { getMemoryByNodeId } from '../data/course.js';
import { t } from '../i18n.js';

const BACK_ICON = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const CAMERA_ICON = `
<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <rect x="3.5" y="8" width="21" height="15" rx="3.5" stroke="currentColor" stroke-width="2.2"/>
  <path d="M10 8.2L11.4 5.5H16.6L18 8.2" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="14" cy="15.5" r="4.2" stroke="currentColor" stroke-width="2.2"/>
  <path d="M21.5 5.5V9.5M19.5 7.5H23.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
</svg>
`;

const CLOSE_ICON = `
<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M5.5 5.5L16.5 16.5M16.5 5.5L5.5 16.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
</svg>
`;

const CHEVRON_LEFT = `
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M12.5 4.5L7 10L12.5 15.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const CHEVRON_RIGHT = `
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M7.5 4.5L13 10L7.5 15.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

/**
 * N3 content screen — filterable photo gallery + lightbox viewer.
 * @param {{
 *   nodeId: string,
 *   title: string,
 *   mode: 'play' | 'replay',
 *   onBackToMap: () => void,
 *   onComplete: () => void
 * }} props
 */
export function renderMemory(props) {
  const content = getMemoryByNodeId(props.nodeId);
  if (!content) {
    return renderMemoryMissing(props);
  }

  /** @type {string} */
  let activeCategory = 'all';
  /** @type {ReturnType<typeof createMemoryViewer> | null} */
  let viewer = null;
  let reachedEnd = false;

  const el = document.createElement('section');
  el.className = 'screen screen--memory';
  el.dataset.screen = 'memory';
  el.dataset.nodeId = props.nodeId;
  el.dataset.mode = props.mode;

  const header = document.createElement('header');
  header.className = 'memory-album-header';
  header.innerHTML = `
    <button type="button" class="memory-album-header__back" aria-label="${t('memory.backAria')}" data-action="back">
      ${BACK_ICON}
    </button>
    <div class="memory-album-header__copy">
      <h1 class="memory-album-header__title">${t('memory.title')}</h1>
      <p class="memory-album-header__subtitle">${t('memory.subtitle')}</p>
    </div>
    <span class="memory-album-header__camera" aria-hidden="true">${CAMERA_ICON}</span>
  `;
  header.querySelector('[data-action="back"]')?.addEventListener('click', () => {
    viewer?.close();
    props.onBackToMap();
  });

  const filters = document.createElement('div');
  filters.className = 'memory-filters';
  filters.setAttribute('role', 'tablist');
  filters.setAttribute('aria-label', t('memory.filtersAria'));

  content.categories.forEach((category) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'memory-filter';
    chip.setAttribute('role', 'tab');
    chip.dataset.category = category.id;
    const catKey = `memory.cat.${category.id}`;
    const localized = t(catKey);
    chip.textContent = localized.startsWith('memory.cat.') ? category.label : localized;
    chip.addEventListener('click', () => {
      if (activeCategory === category.id) return;
      activeCategory = category.id;
      syncFilters();
      renderGrid();
    });
    filters.appendChild(chip);
  });

  const scroll = document.createElement('div');
  scroll.className = 'memory-scroll';

  const grid = document.createElement('div');
  grid.className = 'memory-grid';
  grid.setAttribute('role', 'list');

  const empty = document.createElement('p');
  empty.className = 'memory-empty';
  empty.hidden = true;
  empty.textContent = t('memory.empty');

  const sentinel = document.createElement('div');
  sentinel.className = 'memory-sentinel';
  sentinel.setAttribute('aria-hidden', 'true');

  scroll.append(grid, empty, sentinel);

  const footer = document.createElement('div');
  footer.className = 'memory-footer';

  const hint = document.createElement('p');
  hint.className = 'memory-complete-hint';
  hint.textContent = t('memory.hint');
  hint.hidden = props.mode !== 'play';

  const completeBtn = document.createElement('button');
  completeBtn.type = 'button';
  completeBtn.className = 'cb-button cb-button--primary cb-button--fill memory-complete';
  completeBtn.textContent =
    props.mode === 'replay' ? t('chapter.backToMap') : t('memory.complete');
  if (props.mode === 'play') {
    completeBtn.disabled = true;
  }
  completeBtn.addEventListener('click', () => {
    if (props.mode === 'replay') {
      viewer?.close();
      props.onBackToMap();
      return;
    }
    if (completeBtn.disabled || !reachedEnd) return;
    viewer?.close();
    props.onComplete();
  });

  footer.append(hint, completeBtn);

  const body = document.createElement('div');
  body.className = 'memory-body';
  body.append(filters, scroll, footer);

  el.append(header, body);

  function enableComplete() {
    if (reachedEnd) return;
    reachedEnd = true;
    if (props.mode === 'play') {
      completeBtn.disabled = false;
      hint.hidden = true;
    }
  }

  function syncFilters() {
    filters.querySelectorAll('.memory-filter').forEach((chip) => {
      if (!(chip instanceof HTMLElement)) return;
      const selected = chip.dataset.category === activeCategory;
      chip.classList.toggle('is-active', selected);
      chip.setAttribute('aria-selected', selected ? 'true' : 'false');
    });
  }

  function getFilteredMemories() {
    if (activeCategory === 'all') {
      return [...content.memories].sort((a, b) => {
        const ay = a.category === 'meme' ? '9999' : a.category;
        const by = b.category === 'meme' ? '9999' : b.category;
        return ay.localeCompare(by) || a.id.localeCompare(b.id);
      });
    }
    return content.memories.filter((memory) => memory.category === activeCategory);
  }

  function openViewer(memoryId) {
    const items = getFilteredMemories();
    const index = items.findIndex((memory) => memory.id === memoryId);
    if (index < 0) return;

    viewer?.close();
    viewer = createMemoryViewer({
      items,
      startIndex: index,
      host: el,
      onClose: () => {
        viewer = null;
      },
    });
  }

  function renderGrid() {
    const items = getFilteredMemories();
    grid.replaceChildren();
    empty.hidden = items.length > 0;

    items.forEach((memory) => {
      const card = createMemoryTile(memory, () => openViewer(memory.id));
      grid.appendChild(card);
    });
  }

  syncFilters();
  renderGrid();

  const cleanupScroll = observeEndReach(scroll, sentinel, enableComplete);
  el.__cleanup = () => {
    cleanupScroll();
    viewer?.close();
  };
  el.addEventListener(
    'memory:teardown',
    () => {
      el.__cleanup?.();
    },
    { once: true }
  );

  return el;
}

/**
 * @param {Parameters<typeof renderMemory>[0]} props
 */
function renderMemoryMissing(props) {
  const el = document.createElement('section');
  el.className = 'screen screen--memory';
  el.dataset.screen = 'memory';
  el.innerHTML = `
    <p class="screen__eyebrow">S04 · Memory</p>
    <h1 class="screen__title">${props.title}</h1>
    <div class="placeholder-box">추억을 불러오지 못했어요</div>
    <div class="cb-button-row">
      <button type="button" class="cb-button cb-button--ghost" data-action="back">맵으로 돌아가기</button>
    </div>
  `;
  el.querySelector('[data-action="back"]')?.addEventListener('click', props.onBackToMap);
  return el;
}

/**
 * @param {{ id: string, image: string, alt: string, caption: string, date: string, category: string }} memory
 * @param {() => void} onOpen
 */
function createMemoryTile(memory, onOpen) {
  const item = document.createElement('button');
  item.type = 'button';
  item.className = 'cb-memory-card';
  item.dataset.memoryId = memory.id;
  item.setAttribute('role', 'listitem');
  item.setAttribute('aria-label', '사진 크게 보기');

  const media = document.createElement('div');
  media.className = 'cb-memory-card__media';

  if (memory.image) {
    const img = document.createElement('img');
    img.className = 'cb-memory-card__image';
    img.src = memory.image;
    img.alt = memory.alt || '';
    img.loading = 'lazy';
    img.decoding = 'async';
    media.appendChild(img);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'cb-memory-card__placeholder';
    placeholder.setAttribute('aria-hidden', 'true');
    placeholder.innerHTML = `<span class="cb-memory-card__placeholder-label"></span>`;
    media.appendChild(placeholder);
  }

  item.append(media);
  item.addEventListener('click', onOpen);
  return item;
}

/**
 * @param {{
 *   items: ReadonlyArray<{ id: string, image: string, alt: string, caption: string, date: string }>,
 *   startIndex: number,
 *   host: HTMLElement,
 *   onClose: () => void,
 *   onNavigate?: () => void
 * }} props
 */
function createMemoryViewer(props) {
  let index = Math.max(0, Math.min(props.items.length - 1, props.startIndex));
  let touchStartX = 0;
  let touchDeltaX = 0;

  const overlay = document.createElement('div');
  overlay.className = 'cb-memory-viewer';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', '추억 사진 보기');

  overlay.innerHTML = `
    <div class="cb-memory-viewer__chrome">
      <button type="button" class="cb-memory-viewer__close" aria-label="닫기" data-action="close">
        ${CLOSE_ICON}
      </button>
      <span class="cb-memory-viewer__count" data-role="count"></span>
    </div>
    <div class="cb-memory-viewer__stage" data-role="stage">
      <div class="cb-memory-viewer__media" data-role="media"></div>
    </div>
    <div class="cb-memory-viewer__footer">
      <button type="button" class="cb-memory-viewer__nav" aria-label="이전 사진" data-action="prev">
        ${CHEVRON_LEFT}
      </button>
      <div class="cb-memory-viewer__meta">
        <p class="cb-memory-viewer__date" data-role="date"></p>
      </div>
      <button type="button" class="cb-memory-viewer__nav" aria-label="다음 사진" data-action="next">
        ${CHEVRON_RIGHT}
      </button>
    </div>
  `;

  const countEl = overlay.querySelector('[data-role="count"]');
  const mediaEl = overlay.querySelector('[data-role="media"]');
  const dateEl = overlay.querySelector('[data-role="date"]');
  const stageEl = overlay.querySelector('[data-role="stage"]');
  const prevBtn = overlay.querySelector('[data-action="prev"]');
  const nextBtn = overlay.querySelector('[data-action="next"]');

  function render() {
    const item = props.items[index];
    if (!item || !(mediaEl instanceof HTMLElement)) return;

    if (countEl instanceof HTMLElement) {
      countEl.textContent = `${index + 1} / ${props.items.length}`;
    }
    if (dateEl instanceof HTMLElement) {
      dateEl.textContent = item.date || '';
      dateEl.hidden = !item.date;
    }

    mediaEl.replaceChildren();
    if (item.image) {
      const img = document.createElement('img');
      img.className = 'cb-memory-viewer__image';
      img.src = item.image;
      img.alt = item.alt || '';
      img.decoding = 'async';
      mediaEl.appendChild(img);
    } else {
      const placeholder = document.createElement('div');
      placeholder.className = 'cb-memory-viewer__placeholder';
      placeholder.textContent = '';
      mediaEl.appendChild(placeholder);
    }

    const atStart = index <= 0;
    const atEnd = index >= props.items.length - 1;
    if (prevBtn instanceof HTMLButtonElement) prevBtn.disabled = atStart;
    if (nextBtn instanceof HTMLButtonElement) nextBtn.disabled = atEnd;
  }

  function go(delta) {
    const next = index + delta;
    if (next < 0 || next >= props.items.length) return;
    index = next;
    render();
    props.onNavigate?.();
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(-1);
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(1);
    }
  }

  function onTouchStart(event) {
    const touch = event.changedTouches[0];
    if (!touch) return;
    touchStartX = touch.clientX;
    touchDeltaX = 0;
  }

  function onTouchMove(event) {
    const touch = event.changedTouches[0];
    if (!touch) return;
    touchDeltaX = touch.clientX - touchStartX;
  }

  function onTouchEnd() {
    if (Math.abs(touchDeltaX) < 48) return;
    if (touchDeltaX > 0) go(-1);
    else go(1);
    touchDeltaX = 0;
  }

  function close() {
    document.removeEventListener('keydown', onKeyDown);
    stageEl?.removeEventListener('touchstart', onTouchStart);
    stageEl?.removeEventListener('touchmove', onTouchMove);
    stageEl?.removeEventListener('touchend', onTouchEnd);
    overlay.remove();
    props.onClose();
  }

  overlay.querySelector('[data-action="close"]')?.addEventListener('click', close);
  prevBtn?.addEventListener('click', () => go(-1));
  nextBtn?.addEventListener('click', () => go(1));
  stageEl?.addEventListener('touchstart', onTouchStart, { passive: true });
  stageEl?.addEventListener('touchmove', onTouchMove, { passive: true });
  stageEl?.addEventListener('touchend', onTouchEnd, { passive: true });
  document.addEventListener('keydown', onKeyDown);

  render();
  props.host.appendChild(overlay);
  overlay.querySelector('.cb-memory-viewer__close')?.focus();

  return { close };
}

/**
 * @param {HTMLElement} root
 * @param {HTMLElement} sentinel
 * @param {() => void} onReach
 */
function observeEndReach(root, sentinel, onReach) {
  let done = false;
  const mark = () => {
    if (done) return;
    done = true;
    onReach();
  };

  /** @type {IntersectionObserver | null} */
  let observer = null;

  if (typeof IntersectionObserver === 'function') {
    observer = new IntersectionObserver(
      (entries) => {
        if (!root.isConnected) {
          observer?.disconnect();
          return;
        }
        if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.5)) {
          mark();
          observer?.disconnect();
        }
      },
      {
        root,
        threshold: [0.5, 1],
      }
    );
    observer.observe(sentinel);
  }

  const onScroll = () => {
    if (!root.isConnected) {
      root.removeEventListener('scroll', onScroll);
      observer?.disconnect();
      return;
    }
    const nearBottom = root.scrollTop + root.clientHeight >= root.scrollHeight - 16;
    if (nearBottom) {
      mark();
      root.removeEventListener('scroll', onScroll);
      observer?.disconnect();
    }
  };

  root.addEventListener('scroll', onScroll, { passive: true });
  requestAnimationFrame(() => {
    requestAnimationFrame(onScroll);
  });

  return () => {
    root.removeEventListener('scroll', onScroll);
    observer?.disconnect();
  };
}
