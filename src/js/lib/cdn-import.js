/**
 * Try several ESM CDN URLs in order. First success wins.
 * @param {string[]} urls
 * @param {string} label
 */
export async function importFromCdns(urls, label = 'module') {
  /** @type {unknown} */
  let lastError;
  for (const url of urls) {
    try {
      return await import(/* @vite-ignore */ url);
    } catch (error) {
      lastError = error;
      console.warn(`[cdn] ${label} failed @ ${url}`, error);
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error(`${label} could not be loaded from any CDN`);
}
