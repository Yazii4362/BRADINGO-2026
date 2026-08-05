import { getQuizByNodeId } from '../data/course.js';
import { createFeedbackSheet } from '../components/feedback-sheet.js';
import { openConfirmModal } from '../components/confirm-modal.js';

/**
 * Order-independent exact set match for answer grading.
 * @param {Iterable<string>} selectedIds
 * @param {ReadonlyArray<string>} correctIds
 */
export function isExactAnswerSet(selectedIds, correctIds) {
  const selected = [...new Set(selectedIds)];
  if (selected.length !== correctIds.length) return false;
  const correct = new Set(correctIds);
  return selected.every((id) => correct.has(id));
}

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

  if (!quiz || (quiz.choiceType !== 'single' && quiz.choiceType !== 'multi')) {
    return renderQuizPlaceholder(props);
  }

  // Prefer quiz data type; props.choiceType is a sanity check from the node.
  if (props.choiceType && props.choiceType !== quiz.choiceType) {
    return renderQuizPlaceholder(props);
  }

  return renderChoiceQuiz(props, quiz);
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
 * Shared single / multi choice quiz UI.
 * @param {Parameters<typeof renderQuiz>[0]} props
 * @param {NonNullable<ReturnType<typeof getQuizByNodeId>>} quiz
 */
function renderChoiceQuiz(props, quiz) {
  const isMulti = quiz.choiceType === 'multi';
  /** @type {'idle' | 'selected' | 'selecting' | 'grading' | 'correct' | 'incorrect'} */
  let phase = 'idle';
  /** @type {Set<string>} */
  const selectedIds = new Set();

  const el = document.createElement('section');
  el.className = 'screen screen--quiz';
  el.dataset.screen = 'quiz';
  el.dataset.nodeId = props.nodeId;
  el.dataset.mode = props.mode;
  el.dataset.choiceType = quiz.choiceType;
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

  /** @type {HTMLParagraphElement | null} */
  let instruction = null;
  if (quiz.instruction) {
    instruction = document.createElement('p');
    instruction.className = 'screen__body quiz-instruction';
    instruction.id = 'quiz-instruction';
    instruction.textContent = quiz.instruction;
  }

  const list = document.createElement('div');
  list.className = 'answer-list';
  list.setAttribute('role', 'group');
  list.setAttribute('aria-labelledby', 'quiz-question-title');
  if (instruction) {
    list.setAttribute('aria-describedby', 'quiz-instruction');
  }
  if (isMulti) {
    list.setAttribute('aria-multiselectable', 'true');
  }

  /** @type {Map<string, HTMLButtonElement>} */
  const cardButtons = new Map();

  quiz.choices.forEach((choice) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'answer-card is-default';
    btn.dataset.choiceId = choice.id;
    btn.setAttribute('aria-pressed', 'false');
    fillAnswerCardContent(btn, choice);
    btn.addEventListener('click', () => onCardTap(choice.id));
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

  if (instruction) {
    el.append(header, title, instruction, list, footer);
  } else {
    el.append(header, title, list, footer);
  }

  header.querySelector('[data-action="close"]')?.addEventListener('click', requestExit);

  function setPhase(next) {
    phase = next;
    el.dataset.phase = next;
    submitBtn.classList.toggle('is-loading', next === 'grading');
  }

  function selectingPhaseName() {
    return isMulti ? 'selecting' : 'selected';
  }

  function canChangeSelection() {
    return phase === 'idle' || phase === 'selected' || phase === 'selecting';
  }

  function syncSubmitEnabled() {
    const locked = phase === 'grading' || phase === 'correct' || phase === 'incorrect';
    submitBtn.disabled = locked || selectedIds.size === 0;
  }

  /**
   * @param {string} choiceId
   */
  function onCardTap(choiceId) {
    if (!canChangeSelection()) return;

    if (isMulti) {
      if (selectedIds.has(choiceId)) selectedIds.delete(choiceId);
      else selectedIds.add(choiceId);
    } else {
      selectedIds.clear();
      selectedIds.add(choiceId);
    }

    setPhase(selectedIds.size === 0 ? 'idle' : selectingPhaseName());
    syncCards();
    syncSubmitEnabled();
  }

  function syncCards() {
    const correctSet = new Set(quiz.correctChoiceIds);
    cardButtons.forEach((btn, id) => {
      btn.classList.remove('is-default', 'is-selected', 'is-correct', 'is-incorrect');
      const isSelected = selectedIds.has(id);

      if (phase === 'correct') {
        if (correctSet.has(id)) btn.classList.add('is-correct');
        else btn.classList.add('is-default');
        btn.disabled = true;
        btn.setAttribute('aria-pressed', correctSet.has(id) ? 'true' : 'false');
        return;
      }

      if (phase === 'incorrect') {
        if (isSelected) btn.classList.add('is-incorrect');
        else btn.classList.add('is-default');
        btn.disabled = true;
        btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
        return;
      }

      if (phase === 'grading') {
        if (isSelected) btn.classList.add('is-selected');
        else btn.classList.add('is-default');
        btn.disabled = true;
        btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
        return;
      }

      btn.disabled = false;
      btn.classList.add(isSelected ? 'is-selected' : 'is-default');
      btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    });
  }

  function resetToIdle() {
    selectedIds.clear();
    setPhase('idle');
    sheetHost.replaceChildren();
    submitBtn.hidden = false;
    submitBtn.textContent = '확인';
    syncCards();
    syncSubmitEnabled();
  }

  function submit() {
    const ready = phase === 'selected' || phase === 'selecting';
    if (!ready || selectedIds.size === 0 || submitBtn.disabled) return;

    setPhase('grading');
    submitBtn.disabled = true;
    syncCards();

    const isCorrect = isExactAnswerSet(selectedIds, quiz.correctChoiceIds);

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
  syncSubmitEnabled();
  return el;
}

/**
 * @param {HTMLButtonElement} btn
 * @param {{ id: string, label: string, image?: string, alt?: string }} choice
 */
function fillAnswerCardContent(btn, choice) {
  btn.replaceChildren();
  const imageValue = typeof choice.image === 'string' ? choice.image.trim() : '';
  const wantsMediaSlot = Object.prototype.hasOwnProperty.call(choice, 'image');

  if (imageValue) {
    btn.classList.add('has-image');
    const img = document.createElement('img');
    img.className = 'answer-card__image';
    img.alt = choice.alt || choice.label;
    img.decoding = 'async';

    const label = document.createElement('span');
    label.className = 'answer-card__label';
    label.textContent = choice.label;

    img.addEventListener('error', () => {
      img.replaceWith(createNamePlaceholder(choice));
    });

    btn.append(img, label);
    img.src = imageValue;
    return;
  }

  if (wantsMediaSlot) {
    btn.classList.add('has-image');
    const label = document.createElement('span');
    label.className = 'answer-card__label';
    label.textContent = choice.label;
    btn.append(createNamePlaceholder(choice), label);
    return;
  }

  btn.classList.remove('has-image');
  const label = document.createElement('span');
  label.className = 'answer-card__label';
  label.textContent = choice.label;
  btn.append(label);
}

/**
 * @param {{ label: string, alt?: string }} choice
 */
function createNamePlaceholder(choice) {
  const placeholder = document.createElement('span');
  placeholder.className = 'answer-card__placeholder';
  placeholder.setAttribute('role', 'img');
  placeholder.setAttribute('aria-label', choice.alt || choice.label);
  placeholder.textContent = choice.label.slice(0, 1);
  return placeholder;
}
