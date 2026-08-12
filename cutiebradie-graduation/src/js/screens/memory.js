import { getMemoryByNodeId } from '../data/course.js';

/**
 * N3 content screen — scrollable memories + end-gated complete CTA.
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

  let reachedEnd = false;

  const el = document.createElement('section');
  el.className = 'screen screen--memory';
  el.dataset.screen = 'memory';
  el.dataset.nodeId = props.nodeId;
  el.dataset.mode = props.mode;

  const header = document.createElement('header');
  header.className = 'memory-header';
  header.innerHTML = `
    <button type="button" class="cb-close-btn" aria-label="닫기" data-action="close">X</button>
    <div class="quiz-header__meta">
      <p class="screen__eyebrow">S04 · ${props.nodeId.toUpperCase()}</p>
      ${props.mode === 'replay' ? '<span class="cb-replay-badge">다시 보기</span>' : ''}
    </div>
  `;

  const title = document.createElement('h1');
  title.className = 'screen__title';
  title.textContent = content.title || props.title;

  const scroll = document.createElement('div');
  scroll.className = 'memory-scroll';

  content.memories.forEach((memory) => {
    scroll.appendChild(createMemoryItem(memory));
  });

  const sentinel = document.createElement('div');
  sentinel.className = 'memory-sentinel';
  sentinel.setAttribute('aria-hidden', 'true');
  scroll.appendChild(sentinel);

  const footer = document.createElement('div');
  footer.className = 'memory-footer';

  const completeBtn = document.createElement('button');
  completeBtn.type = 'button';
  completeBtn.className = 'cb-button cb-button--primary cb-button--fill memory-complete';
  completeBtn.textContent = props.mode === 'replay' ? '맵으로 돌아가기' : '추억 감상 완료';
  if (props.mode === 'play') {
    completeBtn.disabled = true;
  }
  completeBtn.addEventListener('click', () => {
    if (props.mode === 'replay') {
      props.onBackToMap();
      return;
    }
    if (completeBtn.disabled || !reachedEnd) return;
    props.onComplete();
  });

  footer.appendChild(completeBtn);
  el.append(header, title, scroll, footer);

  header.querySelector('[data-action="close"]')?.addEventListener('click', props.onBackToMap);

  function enableComplete() {
    if (reachedEnd) return;
    reachedEnd = true;
    if (props.mode === 'play') {
      completeBtn.disabled = false;
    }
  }

  const cleanup = observeEndReach(scroll, sentinel, enableComplete);
  el.__cleanup = cleanup;
  el.addEventListener(
    'memory:teardown',
    () => {
      cleanup();
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
    <div class="placeholder-box">추억 데이터가 없습니다.</div>
    <div class="cb-button-row">
      <button type="button" class="cb-button cb-button--ghost" data-action="back">맵으로 돌아가기</button>
    </div>
  `;
  el.querySelector('[data-action="back"]')?.addEventListener('click', props.onBackToMap);
  return el;
}

/**
 * @param {{ id: string, image: string, alt: string, caption: string, date: string }} memory
 */
function createMemoryItem(memory) {
  /** @type {'empty' | 'loading' | 'loaded' | 'error'} */
  let mediaState = memory.image ? 'loading' : 'empty';

  const item = document.createElement('article');
  item.className = 'cb-memory-card';
  item.dataset.memoryId = memory.id;
  item.dataset.mediaState = mediaState;

  const media = document.createElement('div');
  media.className = 'cb-memory-card__media';

  const meta = document.createElement('div');
  meta.className = 'cb-memory-card__meta';

  const caption = document.createElement('p');
  caption.className = 'cb-memory-card__caption';
  caption.textContent = memory.caption;

  meta.appendChild(caption);
  if (memory.date) {
    const date = document.createElement('p');
    date.className = 'cb-memory-card__date';
    date.textContent = memory.date;
    meta.appendChild(date);
  }

  item.append(media, meta);
  renderMedia();

  function setMediaState(next) {
    mediaState = next;
    item.dataset.mediaState = next;
  }

  function renderMedia() {
    media.replaceChildren();

    if (!memory.image) {
      setMediaState('empty');
      const placeholder = document.createElement('div');
      placeholder.className = 'cb-memory-card__placeholder';
      placeholder.textContent = '사진 placeholder';
      placeholder.setAttribute('role', 'img');
      placeholder.setAttribute('aria-label', memory.alt || '추억 사진 placeholder');
      media.appendChild(placeholder);
      return;
    }

    setMediaState('loading');
    const skeleton = document.createElement('div');
    skeleton.className = 'cb-memory-card__skeleton';
    skeleton.setAttribute('aria-hidden', 'true');
    media.appendChild(skeleton);

    const img = document.createElement('img');
    img.className = 'cb-memory-card__image';
    img.alt = memory.alt || '';
    img.decoding = 'async';
    img.hidden = true;

    img.addEventListener('load', () => {
      setMediaState('loaded');
      skeleton.remove();
      img.hidden = false;
    });

    img.addEventListener('error', () => {
      setMediaState('error');
      media.replaceChildren();
      const errorBox = document.createElement('div');
      errorBox.className = 'cb-memory-card__error';
      errorBox.innerHTML = `
        <p class="cb-memory-card__error-text">이미지를 불러오지 못했어요</p>
        <button type="button" class="cb-button cb-button--ghost cb-memory-card__retry">다시 시도</button>
      `;
      errorBox.querySelector('.cb-memory-card__retry')?.addEventListener('click', () => {
        renderMedia();
      });
      media.appendChild(errorBox);
    });

    media.appendChild(img);
    img.src = memory.image;
  }

  return item;
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
  // Defer fit/bottom check until after layout so short content still unlocks.
  requestAnimationFrame(() => {
    requestAnimationFrame(onScroll);
  });

  return () => {
    root.removeEventListener('scroll', onScroll);
    observer?.disconnect();
  };
}
