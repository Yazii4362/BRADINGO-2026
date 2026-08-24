import { ROUTE_STORAGE_KEY } from './constants.js';

/** @typedef {'intro' | 'lang' | 'map' | 'quiz' | 'chapter' | 'memory' | 'friends' | 'ending' | 'timeline'} ScreenId */
/** @typedef {{ screen: ScreenId, nodeId: string | null, mode: 'play' | 'replay' | null }} AppRoute */

/** @type {ReadonlyArray<ScreenId>} */
export const SCREEN_IDS = Object.freeze([
  'intro',
  'lang',
  'map',
  'quiz',
  'chapter',
  'memory',
  'friends',
  'ending',
  'timeline',
]);

/**
 * @param {unknown} value
 * @returns {value is ScreenId}
 */
export function isScreenId(value) {
  return typeof value === 'string' && SCREEN_IDS.includes(/** @type {ScreenId} */ (value));
}

/** @type {AppRoute} */
let route = { screen: 'intro', nodeId: null, mode: null };

export function getRoute() {
  return route;
}

/**
 * @param {AppRoute} next
 */
export function setRoute(next) {
  route = next;
}

/**
 * @returns {AppRoute | null}
 */
export function loadSavedRoute() {
  try {
    const fromHistory = history.state;
    if (fromHistory && isScreenId(fromHistory.screen)) {
      return {
        screen: fromHistory.screen,
        nodeId: typeof fromHistory.nodeId === 'string' ? fromHistory.nodeId : null,
        mode:
          fromHistory.mode === 'play' || fromHistory.mode === 'replay'
            ? fromHistory.mode
            : null,
      };
    }

    const raw = sessionStorage.getItem(ROUTE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !isScreenId(parsed.screen)) return null;
    return {
      screen: parsed.screen,
      nodeId: typeof parsed.nodeId === 'string' ? parsed.nodeId : null,
      mode: parsed.mode === 'play' || parsed.mode === 'replay' ? parsed.mode : null,
    };
  } catch {
    return null;
  }
}

export function persistRoute() {
  try {
    sessionStorage.setItem(ROUTE_STORAGE_KEY, JSON.stringify(route));
  } catch {
    // Ignore quota / private-mode failures.
  }
}

export function clearSavedRoute() {
  try {
    sessionStorage.removeItem(ROUTE_STORAGE_KEY);
  } catch {
    // Ignore.
  }
}

/**
 * @param {AppRoute} next
 * @param {{ replace?: boolean, skipHistory?: boolean }} [historyOptions]
 */
export function commitRoute(next, historyOptions = {}) {
  route = next;
  if (!historyOptions.skipHistory) {
    const state = { ...route };
    if (historyOptions.replace) history.replaceState(state, '');
    else history.pushState(state, '');
  }
  persistRoute();
}
