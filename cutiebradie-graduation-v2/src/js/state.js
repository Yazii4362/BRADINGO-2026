import { COURSE_NODES } from './data/course.js';

export const STORAGE_KEY = 'byeonggeon-graduation-v2:progress';

/** @typedef {'locked' | 'active' | 'completed'} NodeStatus */

/**
 * @returns {{ version: number, nodeStatus: Record<string, NodeStatus> }}
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
  };
}

/**
 * @returns {{ version: number, nodeStatus: Record<string, NodeStatus> }}
 */
export function loadProgress() {
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
    return base;
  } catch {
    return createInitialProgress();
  }
}

/**
 * @param {{ version: number, nodeStatus: Record<string, NodeStatus> }} progress
 */
export function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function clearProgress() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Complete a node in play mode (not replay). Unlocks the next locked node.
 * @param {{ version: number, nodeStatus: Record<string, NodeStatus> }} progress
 * @param {string} nodeId
 */
export function completeNode(progress, nodeId) {
  if (progress.nodeStatus[nodeId] !== 'active') {
    return progress;
  }

  const next = {
    version: progress.version,
    nodeStatus: { ...progress.nodeStatus, [nodeId]: 'completed' },
  };

  const index = COURSE_NODES.findIndex((node) => node.id === nodeId);
  const following = COURSE_NODES[index + 1];
  if (following && next.nodeStatus[following.id] === 'locked') {
    next.nodeStatus[following.id] = 'active';
  }

  saveProgress(next);
  return next;
}

/**
 * Reset all progress (used by "처음부터 다시").
 */
export function resetProgress() {
  const initial = createInitialProgress();
  saveProgress(initial);
  return initial;
}
