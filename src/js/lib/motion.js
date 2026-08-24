/**
 * Shared motion rhythm for the whole app.
 * Durations are seconds (GSAP) — CSS mirrors them via --motion-* in tokens.css.
 */
import { importFromCdns } from './cdn-import.js';

export const MOTION = Object.freeze({
  /** Micro interaction / press feedback */
  fast: 0.13,
  /** Tooltip, small UI */
  base: 0.2,
  /** Card / panel entrance */
  panel: 0.32,
  /** Important state change (PASS, result reveal) */
  state: 0.42,
  /** Node unlock */
  unlock: 0.55,
});

export const EASE = Object.freeze({
  standard: 'power2.out',
  move: 'power2.inOut',
  pop: 'back.out(1.6)',
  idle: 'sine.inOut',
});

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** @type {Promise<any> | null} */
let gsapPromise = null;

/**
 * Load GSAP once per session. Callers must tolerate `null` (offline / blocked CDN).
 * @returns {Promise<any | null>}
 */
export function loadGsap() {
  if (!gsapPromise) {
    gsapPromise = importFromCdns(
      [
        'https://cdn.jsdelivr.net/npm/gsap@3.13.0/+esm',
        'https://unpkg.com/gsap@3.13.0/index.js',
        'https://esm.sh/gsap@3.13.0',
      ],
      'gsap'
    )
      .then((mod) => mod.default ?? null)
      .catch(() => null);
  }
  return gsapPromise;
}

/**
 * Collects every timer / frame / listener / tween a screen starts so a single
 * `dispose()` on screen teardown guarantees nothing fires against a dead DOM.
 */
export function createMotionScope() {
  /** @type {Set<number>} */
  const timers = new Set();
  /** @type {Set<number>} */
  const frames = new Set();
  /** @type {Array<() => void>} */
  const teardowns = [];
  let disposed = false;

  return {
    get disposed() {
      return disposed;
    },

    /**
     * @param {() => void} fn
     * @param {number} ms
     */
    after(fn, ms) {
      if (disposed) return -1;
      const id = window.setTimeout(() => {
        timers.delete(id);
        if (!disposed) fn();
      }, ms);
      timers.add(id);
      return id;
    },

    /** @param {() => void} fn */
    frame(fn) {
      if (disposed) return -1;
      const id = window.requestAnimationFrame(() => {
        frames.delete(id);
        if (!disposed) fn();
      });
      frames.add(id);
      return id;
    },

    /**
     * @param {EventTarget} target
     * @param {string} type
     * @param {EventListenerOrEventListenerObject} handler
     * @param {AddEventListenerOptions | boolean} [options]
     */
    listen(target, type, handler, options) {
      if (disposed) return;
      target.addEventListener(type, handler, options);
      teardowns.push(() => target.removeEventListener(type, handler, options));
    },

    /** @param {() => void} fn */
    onDispose(fn) {
      if (disposed) fn();
      else teardowns.push(fn);
    },

    dispose() {
      if (disposed) return;
      disposed = true;
      timers.forEach((id) => window.clearTimeout(id));
      timers.clear();
      frames.forEach((id) => window.cancelAnimationFrame(id));
      frames.clear();
      while (teardowns.length) {
        const fn = teardowns.pop();
        try {
          fn?.();
        } catch {
          // Teardown must never block the next screen.
        }
      }
    },
  };
}

/**
 * Restart a one-shot CSS animation class without waiting a frame.
 * @param {HTMLElement} el
 * @param {string} className
 */
export function replayClass(el, className) {
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
}
