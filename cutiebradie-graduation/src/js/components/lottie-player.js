/** @type {Promise<typeof import('lottie-web').default> | null} */
let lottiePromise = null;

/**
 * Lazy-load lottie-web from CDN (no bundler in this project).
 * @returns {Promise<typeof import('lottie-web').default>}
 */
function loadLottie() {
  if (!lottiePromise) {
    lottiePromise = import('https://cdn.jsdelivr.net/npm/lottie-web@5.12.2/+esm').then(
      (mod) => mod.default || mod
    );
  }
  return lottiePromise;
}

/**
 * Mount a looping Lottie animation into `container`.
 * @param {{
 *   container: HTMLElement,
 *   path: string,
 *   assetsPath?: string,
 *   renderer?: 'svg' | 'canvas' | 'html',
 *   loop?: boolean,
 *   autoplay?: boolean,
 * }} opts
 * @returns {Promise<{ destroy: () => void }>}
 */
export async function mountLottie(opts) {
  const lottie = await loadLottie();
  /** @type {Record<string, unknown>} */
  const config = {
    container: opts.container,
    renderer: opts.renderer ?? 'canvas',
    loop: opts.loop !== false,
    autoplay: opts.autoplay !== false,
    path: opts.path,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid meet',
      progressiveLoad: true,
      clearCanvas: true,
    },
  };
  if (opts.assetsPath) config.assetsPath = opts.assetsPath;
  const anim = lottie.loadAnimation(config);
  return {
    destroy() {
      try {
        anim.destroy();
      } catch {
        // ignore
      }
    },
  };
}
