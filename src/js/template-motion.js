import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MESSAGE_MAX } from './data.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * minimoremax.com 벤치마크 모션 키트
 * - fade-up: y 36→0 / 0.65s / power2.out
 * - slide-left|right: x ±40→0 / 0.75s / power3.out
 * - 자식 스태거 0.1s
 * - 미디어: 살짝 scale + fade
 * - 과하지 않은 섹션 단위 등장
 * @see https://minimoremax.com/
 */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE_FADE = 'power2.out';
const EASE_SLIDE = 'power3.out';
const STAGGER = 0.1;
const START = 'top 86%';

function markIn(el) {
  el.classList.add('is-in');
  el.style.opacity = '1';
  el.style.filter = 'none';
  el.style.transform = 'none';
}

function showAllInstantly() {
  document.querySelectorAll('[data-animate], [data-reveal], [data-media]').forEach(markIn);
  document.querySelectorAll('[data-story-accent]').forEach((el) => el.classList.add('is-lit'));
}

function animateSection(el) {
  const type = el.dataset.animate || 'fade-up';
  const from = { opacity: 0 };
  let duration = 0.65;
  let ease = EASE_FADE;

  if (type === 'slide-left') {
    from.x = -40;
    duration = 0.75;
    ease = EASE_SLIDE;
  } else if (type === 'slide-right') {
    from.x = 40;
    duration = 0.75;
    ease = EASE_SLIDE;
  } else if (type === 'scale-in') {
    from.scale = 0.94;
    duration = 0.7;
  } else {
    from.y = 36;
  }

  gsap.fromTo(el, from, {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    duration,
    ease,
    scrollTrigger: {
      trigger: el,
      start: START,
      toggleActions: 'play none none none',
      once: true,
    },
    onStart: () => {
      markIn(el);
      staggerChildren(el);
    },
  });
}

function staggerChildren(scope) {
  const container = scope.querySelector('[data-stagger]');
  if (!container) return;
  const kids = Array.from(container.children);
  if (!kids.length) return;
  gsap.from(kids, {
    opacity: 0,
    y: 18,
    duration: 0.55,
    stagger: STAGGER,
    ease: EASE_FADE,
    delay: 0.08,
  });
}

/** 컨테이너 자체가 data-stagger 인 경우 (갤러리 등) */
function initStaggerGroups() {
  document.querySelectorAll('[data-stagger]').forEach((container) => {
    if (container.closest('[data-animate]')) return; // animateSection이 처리
    const kids = Array.from(container.children);
    if (!kids.length) return;

    gsap.set(kids, { opacity: 0, y: 22 });
    ScrollTrigger.create({
      trigger: container,
      start: START,
      once: true,
      onEnter: () => {
        gsap.to(kids, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: STAGGER,
          ease: EASE_FADE,
          onStart: () => kids.forEach(markIn),
        });
      },
    });
  });
}

/** 이미지 소프트 줌 인 (minimoremax 미디어 등장감) */
function initMediaReveal() {
  document.querySelectorAll('[data-media]').forEach((el) => {
    const img = el.matches('img') ? el : el.querySelector('img');
    if (!img) return;

    gsap.fromTo(
      img,
      { scale: 1.08, opacity: 0.35 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.9,
        ease: EASE_FADE,
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
          once: true,
        },
        onStart: () => markIn(el),
      },
    );
  });
}

/**
 * V1 — Pinterest/Canva envelope: tap → flap opens → letter rises out
 */
function initEnvelope() {
  const hero = document.querySelector('[data-envelope-hero]');
  const openBtn = document.querySelector('[data-open-letter]');
  const wrap = document.querySelector('[data-letter-wrap]');
  const paper = document.querySelector('[data-letter-paper]');
  if (!hero || !openBtn || !wrap || !paper) return;

  const afterEls = document.querySelectorAll('[data-after-letter]');
  let opened = false;

  const wireLetterMotions = () => {
    afterEls.forEach((el) => { el.hidden = false; });
    document.querySelectorAll('[data-animate]').forEach(animateSection);
    initReveal();
    initStaggerGroups();
    initMediaReveal();
    initStoryAccents();
    ScrollTrigger.refresh();
  };

  const openLetter = () => {
    if (opened) return;
    opened = true;

    openBtn.setAttribute('aria-expanded', 'true');
    hero.classList.add('is-open');
    document.body.classList.add('v1-opened');
    wrap.hidden = false;
    wrap.classList.add('is-visible');

    if (reduced) {
      gsap.set(paper, { clearProps: 'all' });
      const stage = hero.querySelector('[data-env-stage]');
      if (stage) stage.style.display = 'none';
      wireLetterMotions();
      return;
    }

    // Letter rises from the pocket; envelope stage collapses away
    const stage = hero.querySelector('[data-env-stage]');
    if (stage) {
      gsap.to(stage, {
        opacity: 0,
        height: 0,
        marginBottom: 0,
        duration: 0.55,
        delay: 0.45,
        ease: 'power2.inOut',
        onComplete: () => { stage.style.display = 'none'; },
      });
    }

    gsap.fromTo(
      paper,
      { y: 120, opacity: 0, scale: 0.92 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.05,
        delay: 0.28,
        ease: 'power3.out',
        onComplete: () => {
          wireLetterMotions();
          wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },
      },
    );

    gsap.from(paper.querySelectorAll('.letter-sec'), {
      opacity: 0,
      y: 28,
      duration: 0.6,
      stagger: STAGGER,
      delay: 0.55,
      ease: EASE_FADE,
    });
  };

  openBtn.addEventListener('click', openLetter);
}

function initLoadIn() {
  const hero = document.querySelector('[data-stagger-load]');
  if (!hero) return;

  gsap.from(hero.children, {
    opacity: 0,
    y: 28,
    duration: 0.7,
    stagger: STAGGER,
    ease: EASE_FADE,
  });

  const arrow = document.querySelector('[data-arrow]');
  if (arrow) {
    gsap.to(arrow, {
      y: 8,
      duration: 0.95,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 0.85,
    });
  }
}

/** 메시지/라인: soft blur → clear (읽기 우선) */
function initReveal() {
  gsap.utils.toArray('[data-reveal]').forEach((el, i) => {
    const isLine = el.hasAttribute('data-line');
    const fromY = isLine ? 10 : 20;
    gsap.set(el, {
      opacity: isLine ? 0.35 : 0.45,
      filter: isLine ? 'blur(2px)' : 'blur(3px)',
      y: fromY,
    });

    ScrollTrigger.create({
      trigger: el,
      start: isLine ? 'top 90%' : 'top 84%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 0.65,
          delay: (i % 4) * 0.04,
          ease: EASE_FADE,
          onStart: () => {
            markIn(el);
            el.querySelectorAll('[data-story-accent]').forEach((accent, ai) => {
              window.setTimeout(() => accent.classList.add('is-lit'), 180 + ai * 120);
            });
          },
        });
      },
    });
  });
}

/** Story 핵심 구절: 밑줄 드로우 + 탭 펄스 */
function initStoryAccents() {
  const accents = document.querySelectorAll('[data-story-accent]');
  if (!accents.length) return;

  accents.forEach((el, i) => {
    if (el.dataset.accentWired === '1') return;
    el.dataset.accentWired = '1';

    if (reduced) {
      el.classList.add('is-lit');
    } else if (!el.closest('[data-reveal]')) {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          window.setTimeout(() => el.classList.add('is-lit'), i * 140);
        },
      });
    }

    el.addEventListener('click', () => {
      el.classList.add('is-lit');
      el.classList.remove('is-pulse');
      // reflow to restart animation
      void el.offsetWidth;
      el.classList.add('is-pulse');
    });
  });
}

function initHeroParallax() {
  const img = document.querySelector('[data-hero-parallax]');
  if (!img || reduced) return;
  gsap.to(img, {
    yPercent: 16,
    ease: 'none',
    scrollTrigger: {
      trigger: img.closest('section') || img,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });
}

function burstConfetti(originEl) {
  const canvas = document.getElementById('congrats-confetti');
  if (!canvas || reduced) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const rect = originEl?.getBoundingClientRect();
  const ox = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
  const oy = rect ? rect.top + rect.height / 2 : window.innerHeight * 0.4;
  const colors = ['#FF2D55', '#FFD60A', '#34C759', '#007AFF', '#AF52DE', '#FF9F0A'];

  const pieces = Array.from({ length: 64 }, () => ({
    x: ox,
    y: oy,
    vx: (Math.random() - 0.5) * 14,
    vy: Math.random() * -12 - 4,
    g: 0.28 + Math.random() * 0.12,
    w: 5 + Math.random() * 5,
    h: 7 + Math.random() * 7,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.35,
    color: colors[(Math.random() * colors.length) | 0],
    life: 1,
  }));

  let raf = 0;
  const tick = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    let alive = false;
    pieces.forEach((p) => {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= 0.012;
      if (p.life <= 0) return;
      alive = true;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (alive) raf = requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  };
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(tick);
}

function initCongrats() {
  const btn = document.querySelector('[data-congrats-btn]');
  if (!btn) return;

  const heart = btn.querySelector('[data-heart]');
  const icon = btn.querySelector('[data-heart-icon]');
  const countEls = document.querySelectorAll('[data-congrats-count]');
  const SEED = 27;
  const COUNT_KEY = 'congrats-count';
  const DONE_KEY = 'congrats-done';

  let count = Number(localStorage.getItem(COUNT_KEY)) || SEED;
  let done = localStorage.getItem(DONE_KEY) === '1';

  function render() {
    countEls.forEach((el) => { el.textContent = String(count); });
    if (done) {
      btn.setAttribute('aria-pressed', 'true');
      if (icon) icon.setAttribute('fill', 'currentColor');
    }
  }
  render();

  btn.addEventListener('click', () => {
    if (!done) {
      count += 1;
      done = true;
      localStorage.setItem(COUNT_KEY, String(count));
      localStorage.setItem(DONE_KEY, '1');
    }
    render();
    burstConfetti(heart || btn);
    if (!reduced && heart) {
      gsap.fromTo(heart, { scale: 1 }, { scale: 1.18, duration: 0.16, yoyo: true, repeat: 1, ease: 'power1.inOut' });
    }
  });
}

function initNavContrast() {
  const nav = document.querySelector('[data-nav-contrast]');
  const hero = document.querySelector('#hero');
  if (!nav || !hero) return;

  const io = new IntersectionObserver(
    ([entry]) => {
      nav.classList.toggle('is-solid', !entry.isIntersecting);
    },
    { rootMargin: '-52px 0px 0px 0px', threshold: 0 },
  );
  io.observe(hero);
}

function enforceMessageMax() {
  document.querySelectorAll('.msg__text').forEach((el) => {
    const raw = el.textContent.trim().replace(/^["“]|["”]$/g, '');
    if (raw.length > MESSAGE_MAX) el.textContent = `${raw.slice(0, MESSAGE_MAX)}…`;
  });
}

function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    });
  });
}

function init() {
  enforceMessageMax();
  initSmoothAnchors();
  initCongrats();
  initNavContrast();

  const isEnvelope = Boolean(document.querySelector('[data-open-letter]'));

  if (reduced) {
    showAllInstantly();
    if (isEnvelope) {
      document.querySelector('[data-envelope-hero]')?.classList.add('is-open');
      document.body.classList.add('v1-opened');
      const wrap = document.querySelector('[data-letter-wrap]');
      if (wrap) {
        wrap.hidden = false;
        wrap.classList.add('is-visible');
      }
      document.querySelectorAll('[data-after-letter]').forEach((el) => { el.hidden = false; });
    }
    return;
  }

  document.documentElement.classList.add('motion-on');

  initEnvelope();
  initLoadIn();
  initHeroParallax();

  if (!isEnvelope) {
    initReveal();
    initStaggerGroups();
    initMediaReveal();
    initStoryAccents();
    document.querySelectorAll('[data-animate]').forEach(animateSection);
  }

  window.addEventListener('load', () => ScrollTrigger.refresh());
}

document.addEventListener('DOMContentLoaded', init);
