import { COURSE_NODES, getNodeById } from './data/course.js';
import {
  completeNode,
  loadProgress,
  resetProgress,
  saveProgress,
} from './state.js';
import { createLockTooltip } from './components/lock-tooltip.js';
import { openNodeStartSheet } from './components/node-start-sheet.js';
import { renderIntro } from './screens/intro.js';
import { renderMap } from './screens/map.js';
import {
  closeQuizExitModal,
  isQuizExitModalOpen,
  openQuizExitModal,
  renderQuiz,
} from './screens/quiz.js';
import { renderMemory } from './screens/memory.js';
import { renderEnding } from './screens/ending.js';

/** @typedef {'intro' | 'map' | 'quiz' | 'memory' | 'ending'} ScreenId */

const root = document.getElementById('screen-root');
if (!root) {
  throw new Error('#screen-root not found');
}

let progress = loadProgress();
saveProgress(progress);

/** @type {{ screen: ScreenId, nodeId: string | null, mode: 'play' | 'replay' | null }} */
let route = { screen: 'intro', nodeId: null, mode: null };

/** Highlight newly unlocked node once after a play-mode completion. */
let mapHighlightNodeId = /** @type {string | null} */ (null);

/** When true, quiz popstate may navigate (leave/complete) instead of exit prompt. */
let skipQuizExitGuard = false;

const lockTooltip = createLockTooltip();

/**
 * @param {ScreenId} screen
 * @param {{ nodeId?: string, mode?: 'play' | 'replay' }} [options]
 * @param {{ replace?: boolean, skipHistory?: boolean }} [historyOptions]
 */
function navigate(screen, options = {}, historyOptions = {}) {
  route = {
    screen,
    nodeId: options.nodeId ?? null,
    mode: options.mode ?? null,
  };

  if (!historyOptions.skipHistory) {
    const state = { ...route };
    if (historyOptions.replace) history.replaceState(state, '');
    else history.pushState(state, '');
  }

  render();
}

/**
 * Leave quiz by popping its history entry so it does not linger after map return.
 * @param {{ highlightNodeId?: string | null }} [options]
 */
function leaveQuizViaHistoryBack(options = {}) {
  if (options.highlightNodeId) {
    mapHighlightNodeId = options.highlightNodeId;
  }
  skipQuizExitGuard = true;
  closeQuizExitModal();
  history.back();
}

/**
 * @param {{ highlightNodeId?: string | null }} [options]
 */
function goToMap(options = {}) {
  lockTooltip.hide();
  if (options.highlightNodeId) {
    mapHighlightNodeId = options.highlightNodeId;
  }

  // Completing or exiting a quiz should not leave the quiz screen in history.
  if (route.screen === 'quiz' && history.state?.screen === 'quiz') {
    leaveQuizViaHistoryBack({
      highlightNodeId: options.highlightNodeId ?? mapHighlightNodeId,
    });
    return;
  }

  navigate('map');
}

/**
 * Align route mode with current progress after back/forward.
 */
function syncRouteWithProgress() {
  progress = loadProgress();
  if (!route.nodeId || route.screen === 'map' || route.screen === 'intro') return;

  const status = progress.nodeStatus[route.nodeId];
  if (!status || status === 'locked') {
    route = { screen: 'map', nodeId: null, mode: null };
    return;
  }
  route.mode = status === 'completed' ? 'replay' : 'play';
}

/**
 * @param {string} nodeId
 * @param {string} status
 * @param {DOMRect} anchor
 */
function handleNodeTap(nodeId, status, anchor) {
  const node = getNodeById(nodeId);
  if (!node) return;

  if (status === 'locked') {
    lockTooltip.show('아직 잠겨 있어요. 이전 여정을 먼저 완료해 주세요.', anchor);
    return;
  }

  const mode = status === 'completed' ? 'replay' : 'play';

  // Active node: show chapter start sheet first; CTA enters the chapter.
  if (status === 'active') {
    openNodeStartSheet({
      title: node.title,
      actionLabel: '시작하기',
      onStart: () => enterNode(node, mode),
    });
    return;
  }

  // Completed node: replay immediately.
  enterNode(node, mode);
}

/**
 * @param {{ id: string, screen: string }} node
 * @param {'play' | 'replay'} mode
 */
function enterNode(node, mode) {
  if (node.screen === 'quiz') {
    navigate('quiz', { nodeId: node.id, mode });
    return;
  }
  if (node.screen === 'memory') {
    navigate('memory', { nodeId: node.id, mode });
    return;
  }
  if (node.screen === 'ending') {
    navigate('ending', { nodeId: node.id, mode });
  }
}

/**
 * Play-mode completion: complete node, unlock next, return to map with highlight.
 * Replay-mode: return to map without mutating progress.
 */
function handleNodeComplete() {
  const nodeId = route.nodeId;
  if (!nodeId) {
    goToMap();
    return;
  }

  if (route.mode === 'play') {
    const before = { ...progress.nodeStatus };
    progress = completeNode(progress, nodeId);
    const unlockedId =
      COURSE_NODES.find(
        (node) => progress.nodeStatus[node.id] === 'active' && before[node.id] === 'locked'
      )?.id ?? null;
    goToMap({ highlightNodeId: unlockedId });
    return;
  }

  goToMap();
}

/** Mark N5 complete once when ending content has rendered (no navigation). */
function handleEndingRendered() {
  if (route.mode !== 'play') return;
  if (progress.nodeStatus.n5 !== 'active') return;
  progress = completeNode(progress, 'n5');
}

function handleResetConfirmed() {
  progress = resetProgress();
  mapHighlightNodeId = null;
  navigate('intro', {}, { replace: true });
}

function cleanupCurrentScreen() {
  const current = root.firstElementChild;
  if (current && typeof current.__cleanup === 'function') {
    current.__cleanup();
  }
}

function render() {
  cleanupCurrentScreen();
  root.replaceChildren();

  /** @type {HTMLElement | null} */
  let screenEl = null;

  if (route.screen === 'intro') {
    screenEl = renderIntro({
      onStart: () => goToMap(),
    });
  } else if (route.screen === 'map') {
    progress = loadProgress();
    const highlight = mapHighlightNodeId;
    screenEl = renderMap({
      nodeStatus: progress.nodeStatus,
      highlightNodeId: highlight,
      onNodeTap: handleNodeTap,
      onHighlightPlayed: () => {
        mapHighlightNodeId = null;
      },
    });
  } else {
    const node = route.nodeId ? getNodeById(route.nodeId) : null;
    if (!node || !route.mode) {
      route = { screen: 'map', nodeId: null, mode: null };
      progress = loadProgress();
      screenEl = renderMap({
        nodeStatus: progress.nodeStatus,
        highlightNodeId: null,
        onNodeTap: handleNodeTap,
      });
    } else if (route.screen === 'quiz') {
      screenEl = renderQuiz({
        nodeId: node.id,
        title: node.title,
        mode: route.mode,
        choiceType: node.type === 'multi' ? 'multi' : 'single',
        onLeaveToMap: () => goToMap(),
        onCorrectContinue: handleNodeComplete,
      });
    } else if (route.screen === 'memory') {
      screenEl = renderMemory({
        nodeId: node.id,
        title: node.title,
        mode: route.mode,
        onBackToMap: () => goToMap(),
        onComplete: handleNodeComplete,
      });
    } else if (route.screen === 'ending') {
      progress = loadProgress();
      screenEl = renderEnding({
        nodeId: node.id,
        title: node.title,
        mode: route.mode,
        progress,
        onReviewMap: () => goToMap(),
        onEndingRendered: handleEndingRendered,
        onResetConfirmed: handleResetConfirmed,
      });
    }
  }

  if (screenEl) {
    screenEl.classList.add('screen--enter');
    root.appendChild(screenEl);
  }
}

/**
 * Restore the current quiz entry after a intercepted back gesture.
 */
function restoreQuizHistoryEntry() {
  history.pushState(
    {
      screen: 'quiz',
      nodeId: route.nodeId,
      mode: route.mode,
    },
    ''
  );
}

window.addEventListener('popstate', (event) => {
  // Quiz in progress: browser back / swipe-back should confirm exit, not leave immediately.
  if (route.screen === 'quiz') {
    if (isQuizExitModalOpen()) {
      closeQuizExitModal();
      restoreQuizHistoryEntry();
      return;
    }

    if (!skipQuizExitGuard) {
      restoreQuizHistoryEntry();
      openQuizExitModal(() => goToMap());
      return;
    }

    skipQuizExitGuard = false;
  }

  const state = event.state;
  if (state && typeof state.screen === 'string') {
    route = {
      screen: state.screen,
      nodeId: state.nodeId ?? null,
      mode: state.mode ?? null,
    };
    syncRouteWithProgress();
    render();
    return;
  }
  route = { screen: 'map', nodeId: null, mode: null };
  render();
});

navigate('intro', {}, { replace: true });
