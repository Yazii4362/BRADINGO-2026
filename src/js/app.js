import { applyDocumentLocale, isLocaleId, localizeNode, setLocale } from './i18n/index.js';
import { COURSE_NODES, getNodeById } from './data/nodes.js';
import { getQuizByNodeId } from './data/quiz.js';
import {
  completeNode,
  loadProgress,
  resetProgress,
  saveProgress,
} from './state.js';
import {
  clearSavedRoute,
  commitRoute,
  getRoute,
  loadSavedRoute,
  persistRoute,
  setRoute,
} from './router.js';
import { unlockSpeech } from './lib/speech.js';
import { createAppGnb } from './components/app-gnb.js';
import { renderIntro } from './screens/intro.js';
import { renderLangSelect } from './screens/lang-select.js';
import { renderMap } from './screens/map.js';
import {
  closeQuizExitModal,
  isQuizExitModalOpen,
  openQuizExitModal,
  renderQuiz,
} from './screens/quiz.js';
import { renderMemory } from './screens/memory.js';
import { renderFriends } from './screens/friends.js';
import { renderChapter } from './screens/chapter.js';
import { renderEnding } from './screens/ending.js';
import { renderTimeline } from './screens/timeline.js';

applyDocumentLocale();

const root = document.getElementById('screen-root');
const appShell = document.getElementById('app');
if (!root) {
  throw new Error('#screen-root not found');
}
if (!appShell) {
  throw new Error('#app not found');
}

let progress = loadProgress();
saveProgress(progress);

/** Highlight newly unlocked node once after a play-mode completion. */
let mapHighlightNodeId = /** @type {string | null} */ (null);

/** When true, quiz popstate may navigate (leave/complete) instead of exit prompt. */
let skipQuizExitGuard = false;

/**
 * @param {import('./router.js').ScreenId} screen
 * @param {{ nodeId?: string, mode?: 'play' | 'replay' }} [options]
 * @param {{ replace?: boolean, skipHistory?: boolean }} [historyOptions]
 */
function navigate(screen, options = {}, historyOptions = {}) {
  commitRoute(
    {
      screen,
      nodeId: options.nodeId ?? null,
      mode: options.mode ?? null,
    },
    historyOptions
  );
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
  if (options.highlightNodeId) {
    mapHighlightNodeId = options.highlightNodeId;
  }

  const route = getRoute();

  // Completing or exiting a quiz should not leave the quiz screen in history.
  if (route.screen === 'quiz' && history.state?.screen === 'quiz') {
    leaveQuizViaHistoryBack({
      highlightNodeId: options.highlightNodeId ?? mapHighlightNodeId,
    });
    return;
  }

  // Path content / GNB timeline: pop back to the previous map entry instead of stacking another map.
  const canPopToMap =
    history.state?.screen === route.screen &&
    ((route.nodeId &&
      (route.screen === 'chapter' ||
        route.screen === 'memory' ||
        route.screen === 'friends' ||
        route.screen === 'ending')) ||
      route.screen === 'timeline');

  if (canPopToMap) {
    history.back();
    return;
  }

  navigate('map');
}

/**
 * Align route mode with current progress after back/forward.
 */
function syncRouteWithProgress() {
  progress = loadProgress();
  const route = getRoute();
  if (
    !route.nodeId ||
    route.screen === 'map' ||
    route.screen === 'intro' ||
    route.screen === 'lang' ||
    route.screen === 'timeline' ||
    (route.screen === 'friends' && !route.nodeId)
  ) {
    return;
  }

  const status = progress.nodeStatus[route.nodeId];
  if (!status || status === 'locked') {
    setRoute({ screen: 'map', nodeId: null, mode: null });
    return;
  }
  setRoute({ ...route, mode: status === 'completed' ? 'replay' : 'play' });
}

/**
 * @param {string} nodeId
 * @param {string} status
 */
function handleNodeTap(nodeId, status) {
  if (status === 'locked') return;
  const node = getNodeById(nodeId);
  if (!node) return;
  enterNode(node, status === 'completed' ? 'replay' : 'play');
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
  if (node.screen === 'chapter') {
    navigate('chapter', { nodeId: node.id, mode });
    return;
  }
  if (node.screen === 'memory') {
    navigate('memory', { nodeId: node.id, mode });
    return;
  }
  if (node.screen === 'friends') {
    navigate('friends', { nodeId: node.id, mode });
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
  const route = getRoute();
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
  const route = getRoute();
  if (route.mode !== 'play') return;
  if (progress.nodeStatus.n5 !== 'active') return;
  progress = completeNode(progress, 'n5');
}

function handleResetConfirmed() {
  progress = resetProgress();
  mapHighlightNodeId = null;
  clearSavedRoute();
  navigate('intro', {}, { replace: true });
}

/**
 * Pin GNB to the app shell (always visible under the screen).
 * @param {'map' | 'timeline'} active
 */
function mountGnb(active) {
  clearGnb();
  appShell.classList.add('app-shell--with-gnb');
  appShell.appendChild(
    createAppGnb({
      active,
      onHome: () => {
        if (getRoute().screen === 'map') return;
        navigate('map');
      },
      onTimeline: () => {
        if (getRoute().screen === 'timeline') return;
        navigate('timeline');
      },
    })
  );
}

function clearGnb() {
  appShell.classList.remove('app-shell--with-gnb');
  document.getElementById('app-gnb')?.remove();
}

function cleanupCurrentScreen() {
  const current = root.firstElementChild;
  if (current && typeof current.__cleanup === 'function') {
    current.__cleanup();
  }
}

function render() {
  cleanupCurrentScreen();
  clearGnb();
  root.replaceChildren();

  const route = getRoute();

  /** @type {HTMLElement | null} */
  let screenEl = null;
  /** @type {'map' | 'timeline' | null} */
  let gnbActive = null;

  if (route.screen === 'intro') {
    screenEl = renderIntro({
      onStart: () => {
        unlockSpeech();
        navigate('lang');
      },
    });
  } else if (route.screen === 'lang') {
    screenEl = renderLangSelect({
      onContinue: (langId) => {
        unlockSpeech();
        if (isLocaleId(langId)) setLocale(langId);
        goToMap();
      },
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
    gnbActive = 'map';
  } else if (route.screen === 'timeline') {
    screenEl = renderTimeline();
    gnbActive = 'timeline';
  } else if (route.screen === 'friends') {
    if (route.nodeId && route.mode) {
      screenEl = renderFriends({
        mode: route.mode,
        onBackToMap: () => goToMap(),
        onComplete: handleNodeComplete,
      });
    } else {
      // Legacy feed route → redirect to timeline archive
      setRoute({ screen: 'timeline', nodeId: null, mode: null });
      screenEl = renderTimeline();
      gnbActive = 'timeline';
    }
  } else {
    const node = route.nodeId ? getNodeById(route.nodeId) : null;
    if (!node || !route.mode) {
      setRoute({ screen: 'map', nodeId: null, mode: null });
      progress = loadProgress();
      screenEl = renderMap({
        nodeStatus: progress.nodeStatus,
        highlightNodeId: null,
        onNodeTap: handleNodeTap,
      });
      gnbActive = 'map';
    } else if (route.screen === 'quiz') {
      const localized = localizeNode(node);
      screenEl = renderQuiz({
        nodeId: node.id,
        title: localized.title,
        mode: route.mode,
        choiceType:
          getQuizByNodeId(node.id)?.choiceType ??
          (node.type === 'multi' ? 'multi' : 'single'),
        onLeaveToMap: () => goToMap(),
        onCorrectContinue: handleNodeComplete,
      });
    } else if (route.screen === 'chapter') {
      const localized = localizeNode(node);
      screenEl = renderChapter({
        nodeId: node.id,
        title: localized.title,
        mode: route.mode,
        onBackToMap: () => goToMap(),
        onComplete: handleNodeComplete,
      });
    } else if (route.screen === 'memory') {
      const localized = localizeNode(node);
      screenEl = renderMemory({
        nodeId: node.id,
        title: localized.title,
        mode: route.mode,
        onBackToMap: () => goToMap(),
        onComplete: handleNodeComplete,
      });
    } else if (route.screen === 'ending') {
      const localized = localizeNode(node);
      progress = loadProgress();
      screenEl = renderEnding({
        nodeId: node.id,
        title: localized.title,
        mode: route.mode,
        progress,
        onEndingRendered: handleEndingRendered,
        onResetConfirmed: handleResetConfirmed,
      });
    }
  }

  if (screenEl) {
    if (gnbActive) screenEl.classList.add('screen--with-gnb');
    screenEl.classList.add('screen--enter');
    root.appendChild(screenEl);
  }
  if (gnbActive) mountGnb(gnbActive);
}

/**
 * Restore the current quiz entry after a intercepted back gesture.
 */
function restoreQuizHistoryEntry() {
  const route = getRoute();
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
  if (getRoute().screen === 'quiz') {
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
    setRoute({
      screen: state.screen,
      nodeId: state.nodeId ?? null,
      mode: state.mode ?? null,
    });
    syncRouteWithProgress();
    persistRoute();
    render();
    return;
  }
  setRoute({ screen: 'intro', nodeId: null, mode: null });
  persistRoute();
  render();
});

const savedRoute = loadSavedRoute();
const resumeScreens = new Set(['quiz', 'chapter', 'memory', 'friends', 'ending', 'lang']);
if (savedRoute && resumeScreens.has(savedRoute.screen)) {
  setRoute(savedRoute);
  syncRouteWithProgress();
  const route = getRoute();
  navigate(
    route.screen,
    {
      ...(route.nodeId ? { nodeId: route.nodeId } : {}),
      ...(route.mode ? { mode: route.mode } : {}),
    },
    { replace: true }
  );
} else {
  navigate('intro', {}, { replace: true });
}
