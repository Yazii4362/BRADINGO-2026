import { getQuizByNodeId } from '../data/course.js';
import { createFeedbackSheet } from '../components/feedback-sheet.js';
import { openConfirmModal } from '../components/confirm-modal.js';

/**
 * @param {{
 *   nodeId: string,
 *   title: string,
 *   mode: 'play' | 'replay',
 *   choiceType: 'single' | 'multi',
 *   onLeaveToMap: () => void,
 *   onCorrectContinue: () => void
 * }} props
 */
export function renderQuiz(props) {
  const quiz = getQuizByNodeId(props.nodeId);

  // Only N1 single-choice is implemented in this slice.
  if (!quiz || quiz.choiceType !== 'single' || props.choiceType !== 'single') {
    return renderQuizPlaceholder(props);
  }

  return renderSingleChoiceQuiz(props, quiz);
}

/**
 * @param {Parameters<typeof renderQuiz>[0]} props
 */
function renderQuizPlaceholder(props) {
  const el = document.createElement('section');
  el.className = 'screen screen--quiz';
  el.dataset.screen = 'quiz';
  el.dataset.nodeId = props.nodeId;
  el.dataset.mode = props.mode;

  el.innerHTML = `
    <header class="quiz-header">
      <button type="button" class="quiz-close" aria-label="닫기" data-action="close">X</button>
      <p class="screen__eyebrow">S03 · Quiz · ${props.nodeId.toUpperCase()}</p>
    </header>
    <h1 class="screen__title">${props.title}</h1>
    <p class="screen__body">
      ${props.choiceType === 'multi' ? '복수 선택' : '단일 선택'} placeholder
      · 모드: ${props.mode}
    </p>
    <div class="placeholder-box">이 노드의 문제 UI는 다음 단계에서 구현합니다.</div>
    <div class="btn-row">
      <button type="button" class="btn btn--ghost" data-action="back">맵으로 돌아가기</button>
    </div>
  `;

  const leave = () => props.onLeaveToMap();
  el.querySelector('[data-action="back"]')?.addEventListener('click', leave);
  el.querySelector('[data-action="close"]')?.addEventListener('click', () => {
    openConfirmModal({
      title: '문제를 그만둘까요?',
      body: '선택한 답은 저장되지 않아요.',
      cancelLabel: '계속 풀기',
      confirmLabel: '맵으로 나가기',
      onCancel: () => {},
      onConfirm: leave,
    });
  });

  return el;
}

/**
 * @param {Parameters<typeof renderQuiz>[0]} props
 * @param {NonNullable<ReturnType<typeof getQuizByNodeId>>} quiz
 */
function renderSingleChoiceQuiz(props, quiz) {
  /** @type {'idle' | 'selected' | 'grading' | 'correct' | 'incorrect'} */
  let phase = 'idle';
  /** @type {string | null} */
  let selectedId = null;

  const el = document.createElement('section');
  el.className = 'screen screen--quiz';
  el.dataset.screen = 'quiz';
  el.dataset.nodeId = props.nodeId;
  el.dataset.mode = props.mode;
  el.dataset.phase = phase;

  const header = document.createElement('header');
  header.className = 'quiz-header';
  header.innerHTML = `
    <button type="button" class="quiz-close" aria-label="문제 닫기" data-action="close">X</button>
    <div class="quiz-header__meta">
      <p class="screen__eyebrow">S03 · ${props.nodeId.toUpperCase()}</p>
      ${props.mode === 'replay' ? '<span class="quiz-replay-badge">다시 보기</span>' : ''}
    </div>
  `;

  const title = document.createElement('h1');
  title.className = 'screen__title quiz-question';
  title.id = 'quiz-question-title';
  title.textContent = quiz.question;

  const list = document.createElement('div');
  list.className = 'answer-list';
  list.setAttribute('role', 'group');
  list.setAttribute('aria-labelledby', 'quiz-question-title');

  /** @type {Map<string, HTMLButtonElement>} */
  const cardButtons = new Map();

  quiz.choices.forEach((choice) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'answer-card is-default';
    btn.dataset.choiceId = choice.id;
    btn.setAttribute('aria-pressed', 'false');
    btn.textContent = choice.label;
    btn.addEventListener('click', () => selectChoice(choice.id));
    cardButtons.set(choice.id, btn);
    list.appendChild(btn);
  });

  const footer = document.createElement('div');
  footer.className = 'quiz-footer';

  const submitBtn = document.createElement('button');
  submitBtn.type = 'button';
  submitBtn.className = 'btn btn--primary quiz-submit';
  submitBtn.textContent = '확인';
  submitBtn.disabled = true;
  submitBtn.addEventListener('click', submit);

  const sheetHost = document.createElement('div');
  sheetHost.className = 'quiz-sheet-host';

  footer.appendChild(submitBtn);
  footer.appendChild(sheetHost);

  el.append(header, title, list, footer);

  header.querySelector('[data-action="close"]')?.addEventListener('click', requestExit);

  function setPhase(next) {
    phase = next;
    el.dataset.phase = next;
  }

  function canChangeSelection() {
    return phase === 'idle' || phase === 'selected';
  }

  function selectChoice(choiceId) {
    if (!canChangeSelection()) return;
    selectedId = choiceId;
    setPhase('selected');
    syncCards();
    submitBtn.disabled = false;
  }

  function syncCards() {
    const correctId = quiz.correctChoiceIds[0];
    cardButtons.forEach((btn, id) => {
      btn.classList.remove('is-default', 'is-selected', 'is-correct', 'is-incorrect');
      const pressed = selectedId === id && (phase === 'selected' || phase === 'grading');
      btn.setAttribute('aria-pressed', pressed || (phase === 'correct' && id === correctId) || (phase === 'incorrect' && id === selectedId) ? 'true' : 'false');

      if (phase === 'correct') {
        if (id === correctId) btn.classList.add('is-correct');
        else btn.classList.add('is-default');
        btn.disabled = true;
        return;
      }

      if (phase === 'incorrect') {
        if (id === selectedId) btn.classList.add('is-incorrect');
        else btn.classList.add('is-default');
        btn.disabled = true;
        return;
      }

      if (phase === 'grading') {
        if (id === selectedId) btn.classList.add('is-selected');
        else btn.classList.add('is-default');
        btn.disabled = true;
        return;
      }

      btn.disabled = false;
      if (selectedId === id) btn.classList.add('is-selected');
      else btn.classList.add('is-default');
    });
  }

  function resetToIdle() {
    selectedId = null;
    setPhase('idle');
    sheetHost.replaceChildren();
    submitBtn.hidden = false;
    submitBtn.disabled = true;
    submitBtn.textContent = '확인';
    syncCards();
  }

  function submit() {
    if (phase !== 'selected' || !selectedId || submitBtn.disabled) return;

    setPhase('grading');
    submitBtn.disabled = true;
    syncCards();

    const isCorrect = quiz.correctChoiceIds.includes(selectedId);

    // Microtask keeps grading phase briefly for double-submit guard.
    queueMicrotask(() => {
      if (isCorrect) {
        setPhase('correct');
        syncCards();
        submitBtn.hidden = true;
        const fb = quiz.feedback.correct;
        sheetHost.replaceChildren(
          createFeedbackSheet({
            variant: 'correct',
            title: fb.title,
            body: fb.body,
            actionLabel: '계속하기',
            onAction: () => props.onCorrectContinue(),
          })
        );
      } else {
        setPhase('incorrect');
        syncCards();
        submitBtn.hidden = true;
        const fb = quiz.feedback.incorrect;
        sheetHost.replaceChildren(
          createFeedbackSheet({
            variant: 'incorrect',
            title: fb.title,
            body: fb.body,
            actionLabel: '다시 선택하기',
            onAction: () => resetToIdle(),
          })
        );
      }
    });
  }

  function requestExit() {
    openConfirmModal({
      title: '문제를 그만둘까요?',
      body: '선택한 답은 저장되지 않아요.',
      cancelLabel: '계속 풀기',
      confirmLabel: '맵으로 나가기',
      onCancel: () => {},
      onConfirm: () => props.onLeaveToMap(),
    });
  }

  syncCards();
  return el;
}
