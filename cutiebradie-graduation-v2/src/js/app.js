import { COURSE_NODES, getNodeById } from './data/course.js';
import { completeNode, loadProgress, saveProgress } from './state.js';
import { createLockTooltip } from './components/lock-tooltip.js';
import { renderIntro } from './screens/intro.js';
import { renderMap } from './screens/map.js';
import { renderQuiz } from './screens/quiz.js';
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

const lockTooltip = createLockTooltip();

/**
 * @param {ScreenId} screen
 * @param {{ nodeId?: string, mode?: 'play' | 'replay' }} [options]
 */
function navigate(screen, options = {}) {
  route = {
    screen,
    nodeId: options.nodeId ?? null,
    mode: options.mode ?? null,
  };
  render();
}

/**
 * @param {{ highlightNodeId?: string | null }} [options]
 */
function goToMap(options = {}) {
  lockTooltip.hide();
  if (options.highlightNodeId) {
    mapHighlightNodeId = options.highlightNodeId;
  }
  navigate('map');
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
    lockTooltip.show('아직 잠겨 있어요. 이전 노드를 먼저 완료해 주세요.', anchor);
    return;
  }

  const mode = status === 'completed' ? 'replay' : 'play';

  if (node.screen === 'quiz') {
    navigate('quiz', { nodeId, mode });
    return;
  }
  if (node.screen === 'memory') {
    navigate('memory', { nodeId, mode });
    return;
  }
  if (node.screen === 'ending') {
    navigate('ending', { nodeId, mode });
  }
}

/**
 * Play-mode correct continue: complete node, unlock next, return to map.
 * Replay-mode: return to map without mutating progress.
 */
function handleQuizCorrectContinue() {
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

function render() {
  root.replaceChildren();

  if (route.screen === 'intro') {
    root.appendChild(
      renderIntro({
        onStart: () => goToMap(),
      })
    );
    return;
  }

  if (route.screen === 'map') {
    progress = loadProgress();
    const highlight = mapHighlightNodeId;
    root.appendChild(
      renderMap({
        nodeStatus: progress.nodeStatus,
        highlightNodeId: highlight,
        onNodeTap: handleNodeTap,
        onHighlightPlayed: () => {
          mapHighlightNodeId = null;
        },
      })
    );
    return;
  }

  const node = route.nodeId ? getNodeById(route.nodeId) : null;
  if (!node || !route.mode) {
    goToMap();
    return;
  }

  if (route.screen === 'quiz') {
    root.appendChild(
      renderQuiz({
        nodeId: node.id,
        title: node.title,
        mode: route.mode,
        choiceType: node.type === 'multi' ? 'multi' : 'single',
        onLeaveToMap: () => goToMap(),
        onCorrectContinue: handleQuizCorrectContinue,
      })
    );
    return;
  }

  if (route.screen === 'memory') {
    root.appendChild(
      renderMemory({
        nodeId: node.id,
        title: node.title,
        mode: route.mode,
        onBackToMap: () => goToMap(),
      })
    );
    return;
  }

  if (route.screen === 'ending') {
    root.appendChild(
      renderEnding({
        nodeId: node.id,
        title: node.title,
        mode: route.mode,
        onBackToMap: () => goToMap(),
      })
    );
  }
}

navigate('intro');
