import { COURSE_NODES } from './data/nodes.js';
import { LEGACY_STORAGE_KEYS, STORAGE_KEY } from './constants.js';

export { STORAGE_KEY } from './constants.js';

/** @typedef {'locked' | 'active' | 'completed'} NodeStatus */
/** @typedef {{ version: number, nodeStatus: Record<string, NodeStatus>, endingViewed: boolean }} Progress */

/**
 * Copy legacy progress into the current key when needed.
 * Errors never interrupt app startup.
 */
function migrateLegacyProgress() {
  try {
    if (localStorage.getItem(STORAGE_KEY)) return;

    for (const legacyKey of LEGACY_STORAGE_KEYS) {
      const raw = localStorage.getItem(legacyKey);
      if (!raw) continue;

      localStorage.setItem(STORAGE_KEY, raw);
      localStorage.removeItem(legacyKey);
      return;
    }
  } catch {
    // Keep running even if migration fails.
  }
}

/**
 * @returns {Progress}
 */
export function createInitialProgress() {
  /** @type {Record<string, NodeStatus>} */
  const nodeStatus = {};
  COURSE_NODES.forEach((node, index) => {
    nodeStatus[node.id] = index === 0 ? 'active' : 'locked';
  });
  return {
    version: 1,
    nodeStatus,
    endingViewed: false,
  };
}

/**
 * Repair corrupted / legacy progress into a valid node machine.
 * @param {Progress} progress
 * @returns {Progress}
 */
export function normalizeProgress(progress) {
  /** @type {Record<string, NodeStatus>} */
  const nodeStatus = {};
  COURSE_NODES.forEach((node) => {
    const status = progress.nodeStatus?.[node.id];
    nodeStatus[node.id] =
      status === 'locked' || status === 'active' || status === 'completed'
        ? status
        : 'locked';
  });

  const actives = COURSE_NODES.filter((node) => nodeStatus[node.id] === 'active');
  if (actives.length > 1) {
    actives.slice(1).forEach((node) => {
      nodeStatus[node.id] = 'locked';
    });
  }

  const hasActive = COURSE_NODES.some((node) => nodeStatus[node.id] === 'active');
  const allCompleted = COURSE_NODES.every((node) => nodeStatus[node.id] === 'completed');
  if (!hasActive && !allCompleted) {
    const next = COURSE_NODES.find((node) => nodeStatus[node.id] !== 'completed');
    if (next) nodeStatus[next.id] = 'active';
  }

  return {
    version: 1,
    nodeStatus,
    endingViewed: nodeStatus.n5 === 'completed',
  };
}

/**
 * @returns {Progress}
 */
export function loadProgress() {
  migrateLegacyProgress();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialProgress();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.nodeStatus) {
      return createInitialProgress();
    }
    const base = createInitialProgress();
    COURSE_NODES.forEach((node) => {
      const status = parsed.nodeStatus[node.id];
      if (status === 'locked' || status === 'active' || status === 'completed') {
        base.nodeStatus[node.id] = status;
      }
    });
    base.endingViewed = Boolean(parsed.endingViewed);
    return normalizeProgress(base);
  } catch {
    return createInitialProgress();
  }
}

/**
 * @param {Progress} progress
 * @returns {boolean}
 */
export function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeProgress(progress)));
    return true;
  } catch (error) {
    console.warn('[state] saveProgress failed', error);
    return false;
  }
}

/**
 * Removes only this app's progress key (and leftover legacy keys).
 * @returns {boolean}
 */
export function clearProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    for (const legacyKey of LEGACY_STORAGE_KEYS) {
      try {
        localStorage.removeItem(legacyKey);
      } catch (error) {
        console.warn('[state] clearProgress legacy key failed', legacyKey, error);
      }
    }
    return true;
  } catch (error) {
    console.warn('[state] clearProgress failed', error);
    return false;
  }
}

/**
 * Complete a node in play mode (not replay). Unlocks the next locked node.
 * @param {Progress} progress
 * @param {string} nodeId
 */
export function completeNode(progress, nodeId) {
  if (!COURSE_NODES.some((node) => node.id === nodeId)) {
    return progress;
  }
  if (progress.nodeStatus[nodeId] !== 'active') {
    return progress;
  }

  /** @type {Progress} */
  const next = {
    version: progress.version,
    nodeStatus: { ...progress.nodeStatus, [nodeId]: 'completed' },
    endingViewed: progress.endingViewed,
  };

  const index = COURSE_NODES.findIndex((node) => node.id === nodeId);
  const following = COURSE_NODES[index + 1];
  if (following && next.nodeStatus[following.id] === 'locked') {
    next.nodeStatus[following.id] = 'active';
  }

  if (nodeId === 'n5') {
    next.endingViewed = true;
  }

  const normalized = normalizeProgress(next);
  saveProgress(normalized);
  return normalized;
}

/**
 * Reset all progress (used by "처음부터 다시").
 * @returns {Progress}
 */
export function resetProgress() {
  clearProgress();
  const initial = createInitialProgress();
  saveProgress(initial);
  return initial;
}
