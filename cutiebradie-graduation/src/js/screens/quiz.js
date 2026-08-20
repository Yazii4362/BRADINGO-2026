import { getQuizQuestionsByNodeId } from '../data/course.js';
import { createFeedbackSheet } from '../components/feedback-sheet.js';
import { openConfirmModal } from '../components/confirm-modal.js';
import { createQuizProgressHeader } from '../components/quiz-progress-header.js';
import { createQuizPrompt } from '../components/quiz-prompt.js';
import { createAnswerTile } from '../components/answer-tile.js';

/** @type {{ close: () => void } | null} */
let quizExitModal = null;

export function isQuizExitModalOpen() {
  return quizExitModal !== null;
}

export function closeQuizExitModal() {
  if (!quizExitModal) return;
  const handle = quizExitModal;
  quizExitModal = null;
  handle.close();
}

/**
 * Shared exit confirm for quiz X button and browser back.
 * @param {() => void} onConfirmLeave
 */
export function openQuizExitModal(onConfirmLeave) {
  if (quizExitModal) return;

  const handle = openConfirmModal({
    title: '문제를 그만둘까요?',
    body: '선택한 답은 저장되지 않아요.',
    cancelLabel: '계속 풀기',
    confirmLabel: '맵으로 나가기',
    onCancel: () => {
      quizExitModal = null;
    },
    onConfirm: () => {
      quizExitModal = null;
      onConfirmLeave();
    },
  });

  quizExitModal = {
    close: () => {
      handle.close();
      quizExitModal = null;
    },
  };
}

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
 * Ordered sequence match for sentence-building quizzes.
 * @param {ReadonlyArray<string>} selectedIds
 * @param {ReadonlyArray<string>} correctIds
 */
export function isExactAnswerOrder(selectedIds, correctIds) {
  if (selectedIds.length !== correctIds.length) return false;
  return selectedIds.every((id, index) => id === correctIds[index]);
}

/**
 * @param {{
 *   nodeId: string,
 *   title: string,
 *   mode: 'play' | 'replay',
 *   choiceType: 'single' | 'multi' | 'sentence',
 *   onLeaveToMap: () => void,
 *   onCorrectContinue: () => void
 * }} props
 */
export function renderQuiz(props) {
  const questions = getQuizQuestionsByNodeId(props.nodeId);
  const first = questions?.[0];
  const supported = first && ['single', 'multi', 'sentence'].includes(first.choiceType);

  if (!supported) {
    return renderQuizPlaceholder(props);
  }

  if (props.choiceType && props.choiceType !== first.choiceType) {
    return renderQuizPlaceholder(props);
  }

  return renderChoiceQuiz(props, questions);
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
      <button type="button" class="cb-close-btn" aria-label="닫기" data-action="close">X</button>
      <p class="screen__eyebrow">S03 · Quiz · ${props.nodeId.toUpperCase()}</p>
    </header>
    <h1 class="screen__title">${props.title}</h1>
    <p class="screen__body">
      ${props.choiceType === 'multi' ? '복수 선택' : '단일 선택'} · 준비 중
      · 모드: ${props.mode === 'replay' ? '다시 보기' : '진행'}
    </p>
    <div class="placeholder-box">이 노드의 문제 UI는 다음 단계에서 구현합니다.</div>
    <div class="cb-button-row">
      <button type="button" class="cb-button cb-button--ghost" data-action="back">맵으로 돌아가기</button>
    </div>
  `;

  const leave = () => props.onLeaveToMap();
  el.querySelector('[data-action="back"]')?.addEventListener('click', leave);
  el.querySelector('[data-action="close"]')?.addEventListener('click', () => {
    openQuizExitModal(leave);
  });

  return el;
}

/**
 * Shared single / multi choice quiz UI (supports multi-question lessons).
 * @param {Parameters<typeof renderQuiz>[0]} props
 * @param {NonNullable<ReturnType<typeof getQuizQuestionsByNodeId>>} questions
 */
function renderChoiceQuiz(props, questions) {
  let questionIndex = 0;
  /** @type {'idle' | 'selected' | 'selecting' | 'grading' | 'correct' | 'incorrect'} */
  let phase = 'idle';
  /** @type {Set<string>} */
  const selectedIds = new Set();
  /** @type {(string | null)[]} */
  let bankSlots = [];
  /** @type {string[]} */
  let answerOrder = [];
  /** @type {Map<string, number>} */
  const tokenHomeIndex = new Map();
  /** @type {Map<string, { id: string, label: string }>} */
  const tokenById = new Map();

  const el = document.createElement('section');
  el.className = 'screen screen--quiz';
  el.dataset.screen = 'quiz';
  el.dataset.nodeId = props.nodeId;
  el.dataset.mode = props.mode;

  const header = createQuizProgressHeader({
    progress: lessonProgress(0),
    onClose: () => requestExit(),
  });

  const promptPane = document.createElement('div');
  promptPane.className = 'quiz-pane quiz-pane--prompt';

  const actionPane = document.createElement('div');
  actionPane.className = 'quiz-pane quiz-pane--actions';

  const body = document.createElement('div');
  body.className = 'quiz-body';
  body.append(promptPane, actionPane);

  const sheetHost = document.createElement('div');
  sheetHost.className = 'quiz-sheet-host';

  el.append(header, body, sheetHost);

  /** @type {HTMLButtonElement | null} */
  let submitBtn = null;
  /** @type {Map<string, HTMLButtonElement>} */
  let cardButtons = new Map();
  /** @type {HTMLElement | null} */
  let answerStripEl = null;
  /** @type {HTMLElement | null} */
  let bankEl = null;

  function currentQuiz() {
    return questions[questionIndex];
  }

  function isSentenceQuiz() {
    return currentQuiz().choiceType === 'sentence';
  }

  /**
   * @param {number} index
   */
  function lessonProgress(index) {
    const total = Math.max(questions.length, 1);
    return Math.min(1, (index + 0.12) / total);
  }

  function setPhase(next) {
    phase = next;
    el.dataset.phase = next;
    if (submitBtn) {
      submitBtn.classList.toggle('cb-button--loading', next === 'grading');
    }
  }

  function selectingPhaseName() {
    if (isSentenceQuiz()) return 'selected';
    return currentQuiz().choiceType === 'multi' ? 'selecting' : 'selected';
  }

  function canChangeSelection() {
    return phase === 'idle' || phase === 'selected' || phase === 'selecting';
  }

  function syncSubmitEnabled() {
    if (!submitBtn) return;
    const locked = phase === 'grading' || phase === 'correct' || phase === 'incorrect';
    const hasAnswer = isSentenceQuiz() ? answerOrder.length > 0 : selectedIds.size > 0;
    submitBtn.disabled = locked || !hasAnswer;
  }

  /**
   * @param {string} choiceId
   */
  function onCardTap(choiceId) {
    if (!canChangeSelection() || isSentenceQuiz()) return;
    const quiz = currentQuiz();
    const isMulti = quiz.choiceType === 'multi';

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

  /**
   * @param {number} bankIndex
   */
  function onBankChipTap(bankIndex) {
    if (!canChangeSelection()) return;
    const tokenId = bankSlots[bankIndex];
    if (!tokenId) return;
    bankSlots[bankIndex] = null;
    answerOrder.push(tokenId);
    setPhase('selected');
    syncSentenceUI();
    syncSubmitEnabled();
  }

  /**
   * @param {number} answerIndex
   */
  function onAnswerChipTap(answerIndex) {
    if (!canChangeSelection()) return;
    const tokenId = answerOrder[answerIndex];
    if (!tokenId) return;
    answerOrder.splice(answerIndex, 1);
    const home = tokenHomeIndex.get(tokenId);
    if (typeof home === 'number' && bankSlots[home] === null) {
      bankSlots[home] = tokenId;
    } else {
      const empty = bankSlots.findIndex((slot) => slot === null);
      if (empty >= 0) bankSlots[empty] = tokenId;
      else bankSlots.push(tokenId);
    }
    setPhase(answerOrder.length === 0 ? 'idle' : 'selected');
    syncSentenceUI();
    syncSubmitEnabled();
  }

  function syncCards() {
    const quiz = currentQuiz();
    if (quiz.choiceType === 'sentence' || !quiz.correctChoiceIds) return;
    const correctSet = new Set(quiz.correctChoiceIds);
    cardButtons.forEach((btn, id) => {
      btn.classList.remove(
        'cb-answer-card--default',
        'cb-answer-card--selected',
        'cb-answer-card--correct',
        'cb-answer-card--incorrect'
      );
      const isSelected = selectedIds.has(id);

      if (phase === 'correct') {
        if (correctSet.has(id)) btn.classList.add('cb-answer-card--correct');
        else btn.classList.add('cb-answer-card--default');
        btn.disabled = true;
        btn.setAttribute('aria-pressed', correctSet.has(id) ? 'true' : 'false');
        return;
      }

      if (phase === 'incorrect') {
        if (isSelected) btn.classList.add('cb-answer-card--incorrect');
        else btn.classList.add('cb-answer-card--default');
        btn.disabled = true;
        btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
        return;
      }

      if (phase === 'grading') {
        if (isSelected) btn.classList.add('cb-answer-card--selected');
        else btn.classList.add('cb-answer-card--default');
        btn.disabled = true;
        btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
        return;
      }

      btn.disabled = false;
      btn.classList.add(isSelected ? 'cb-answer-card--selected' : 'cb-answer-card--default');
      btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    });
  }

  function syncSentenceUI() {
    if (!answerStripEl || !bankEl) return;
    const locked = phase === 'grading' || phase === 'correct' || phase === 'incorrect';
    const correct = currentQuiz().correctOrder ?? [];

    answerStripEl.replaceChildren();
    answerOrder.forEach((tokenId, index) => {
      const token = tokenById.get(tokenId);
      if (!token) return;
      const chip = createWordChip(token.label, {
        locked,
        state:
          phase === 'correct' && correct[index] === tokenId
            ? 'correct'
            : phase === 'incorrect'
              ? 'incorrect'
              : 'active',
      });
      if (!locked) {
        chip.addEventListener('click', () => onAnswerChipTap(index));
      }
      answerStripEl?.appendChild(chip);
    });

    bankEl.replaceChildren();
    bankSlots.forEach((tokenId, index) => {
      if (!tokenId) {
        const placeholder = document.createElement('span');
        placeholder.className = 'quiz-word-chip quiz-word-chip--slot';
        placeholder.setAttribute('aria-hidden', 'true');
        bankEl?.appendChild(placeholder);
        return;
      }
      const token = tokenById.get(tokenId);
      if (!token) return;
      const chip = createWordChip(token.label, { locked, state: 'active' });
      if (!locked) {
        chip.addEventListener('click', () => onBankChipTap(index));
      }
      bankEl?.appendChild(chip);
    });
  }

  function resetToIdle() {
    selectedIds.clear();
    if (isSentenceQuiz()) {
      initSentenceState(currentQuiz());
    }
    setPhase('idle');
    sheetHost.replaceChildren();
    if (submitBtn) submitBtn.textContent = '확인';
    syncCards();
    syncSentenceUI();
    syncSubmitEnabled();
  }

  function goNextQuestion() {
    questionIndex += 1;
    if (questionIndex >= questions.length) {
      props.onCorrectContinue();
      return;
    }
    if (typeof header.setProgress === 'function') {
      header.setProgress(lessonProgress(questionIndex));
    }
    mountQuestion();
  }

  /**
   * @param {ReturnType<typeof currentQuiz>} quiz
   */
  function initSentenceState(quiz) {
    tokenById.clear();
    tokenHomeIndex.clear();
    (quiz.tokens ?? []).forEach((token) => tokenById.set(token.id, token));
    const order = quiz.bankOrder ?? (quiz.tokens ?? []).map((t) => t.id);
    bankSlots = order.map((id, index) => {
      tokenHomeIndex.set(id, index);
      return id;
    });
    answerOrder = [];
  }

  function submit() {
    const ready = phase === 'selected' || phase === 'selecting';
    const hasAnswer = isSentenceQuiz() ? answerOrder.length > 0 : selectedIds.size > 0;
    if (!ready || !hasAnswer || !submitBtn || submitBtn.disabled) return;

    const quiz = currentQuiz();
    setPhase('grading');
    submitBtn.disabled = true;
    syncCards();
    syncSentenceUI();

    const isCorrect = isSentenceQuiz()
      ? isExactAnswerOrder(answerOrder, quiz.correctOrder ?? [])
      : isExactAnswerSet(selectedIds, quiz.correctChoiceIds ?? []);

    queueMicrotask(() => {
      if (isCorrect) {
        setPhase('correct');
        syncCards();
        syncSentenceUI();
        const fb = quiz.feedback.correct;
        const isLast = questionIndex >= questions.length - 1;
        sheetHost.replaceChildren(
          createFeedbackSheet({
            variant: 'correct',
            title: fb.title,
            body: fb.body,
            actionLabel: '계속',
            onAction: () => {
              if (isLast) props.onCorrectContinue();
              else goNextQuestion();
            },
          })
        );
      } else {
        setPhase('incorrect');
        syncCards();
        syncSentenceUI();
        const fb = quiz.feedback.incorrect;
        sheetHost.replaceChildren(
          createFeedbackSheet({
            variant: 'incorrect',
            title: fb.title,
            body: fb.body,
            actionLabel: isSentenceQuiz() ? '다시 시도하기' : '다시 선택하기',
            onAction: () => resetToIdle(),
          })
        );
      }
    });
  }

  function mountQuestion() {
    const quiz = currentQuiz();
    const layout = quiz.layout ?? (quiz.promptWord ? 'image' : 'text');

    el.dataset.choiceType = quiz.choiceType;
    el.dataset.layout = layout;
    selectedIds.clear();
    answerStripEl = null;
    bankEl = null;
    setPhase('idle');
    sheetHost.replaceChildren();

    const prompt = createQuizPrompt({
      badge: quiz.badge,
      badgeVariant: quiz.badgeVariant,
      instruction: quiz.question,
      promptWord: quiz.promptWord,
      promptId: 'quiz-question-title',
    });

    promptPane.replaceChildren(prompt);

    if (quiz.instruction) {
      const instruction = document.createElement('p');
      instruction.className = 'screen__body quiz-instruction';
      instruction.id = 'quiz-instruction';
      instruction.textContent = quiz.instruction;
      promptPane.append(instruction);
    }

    if (quiz.choiceType === 'sentence') {
      mountSentenceQuestion(quiz);
      return;
    }

    const isMulti = quiz.choiceType === 'multi';
    const list = document.createElement('div');
    list.className =
      layout === 'text' ? 'answer-list answer-list--stack' : 'answer-list answer-list--grid-2x2';
    list.setAttribute('role', 'group');
    list.setAttribute('aria-labelledby', 'quiz-question-title');
    if (quiz.instruction) {
      list.setAttribute('aria-describedby', 'quiz-instruction');
    }
    if (isMulti) {
      list.setAttribute('aria-multiselectable', 'true');
    }

    cardButtons = new Map();
    (quiz.choices ?? []).forEach((choice) => {
      const btn = createAnswerTile({
        id: choice.id,
        label: choice.label,
        image: choice.image,
        alt: choice.alt,
        ariaPressed: false,
      });
      btn.addEventListener('click', () => onCardTap(choice.id));
      cardButtons.set(choice.id, btn);
      list.appendChild(btn);
    });

    const footer = document.createElement('div');
    footer.className = 'quiz-footer';

    submitBtn = document.createElement('button');
    submitBtn.type = 'button';
    submitBtn.className = 'cb-button cb-button--primary cb-button--fill quiz-submit';
    submitBtn.textContent = '확인';
    submitBtn.disabled = true;
    submitBtn.addEventListener('click', submit);
    footer.appendChild(submitBtn);

    actionPane.replaceChildren(list, footer);
    syncCards();
    syncSubmitEnabled();
  }

  /**
   * @param {ReturnType<typeof currentQuiz>} quiz
   */
  function mountSentenceQuestion(quiz) {
    initSentenceState(quiz);

    const stage = document.createElement('div');
    stage.className = 'quiz-listen-stage';

    if (quiz.characterImage) {
      const figure = document.createElement('div');
      figure.className = 'quiz-listen-stage__character';
      const img = document.createElement('img');
      img.src = quiz.characterImage;
      img.alt = quiz.characterAlt || '';
      img.decoding = 'async';
      figure.appendChild(img);
      stage.appendChild(figure);
    }

    const bubbleWrap = document.createElement('div');
    bubbleWrap.className = 'quiz-listen-bubble-wrap';

    const bubble = document.createElement('div');
    bubble.className = 'quiz-listen-bubble';

    const speakBtn = document.createElement('button');
    speakBtn.type = 'button';
    speakBtn.className = 'quiz-listen-bubble__speak';
    speakBtn.setAttribute('aria-label', '들은 내용 재생');
    speakBtn.innerHTML = `
      <img class="quiz-listen-bubble__speaker" src="./assets/images/quiz/icon-speaker.svg" alt="" width="40" height="36" decoding="async" />
      <img class="quiz-listen-bubble__wave" src="./assets/images/quiz/icon-waveform.svg" alt="" width="136" height="68" decoding="async" />
    `;
    speakBtn.addEventListener('click', () => speakText(quiz.listenText ?? ''));

    const slowBtn = document.createElement('button');
    slowBtn.type = 'button';
    slowBtn.className = 'quiz-listen-bubble__slow';
    slowBtn.textContent = '느린 속도로 재생';
    slowBtn.addEventListener('click', () => speakText(quiz.listenText ?? '', { rate: 0.65 }));

    bubble.appendChild(speakBtn);
    bubbleWrap.append(bubble, slowBtn);
    stage.appendChild(bubbleWrap);

    promptPane.appendChild(stage);

    const builder = document.createElement('div');
    builder.className = 'quiz-sentence-builder';

    answerStripEl = document.createElement('div');
    answerStripEl.className = 'quiz-answer-strip';
    answerStripEl.setAttribute('role', 'list');
    answerStripEl.setAttribute('aria-label', '선택한 단어');

    bankEl = document.createElement('div');
    bankEl.className = 'quiz-word-bank';
    bankEl.setAttribute('role', 'group');
    bankEl.setAttribute('aria-labelledby', 'quiz-question-title');

    const footer = document.createElement('div');
    footer.className = 'quiz-footer';

    submitBtn = document.createElement('button');
    submitBtn.type = 'button';
    submitBtn.className = 'cb-button cb-button--primary cb-button--fill quiz-submit';
    submitBtn.textContent = '확인';
    submitBtn.disabled = true;
    submitBtn.addEventListener('click', submit);
    footer.appendChild(submitBtn);

    builder.append(answerStripEl, bankEl);
    actionPane.replaceChildren(builder, footer);

    syncSentenceUI();
    syncSubmitEnabled();

    queueMicrotask(() => speakText(quiz.listenText ?? ''));
  }

  function requestExit() {
    openQuizExitModal(() => props.onLeaveToMap());
  }

  mountQuestion();
  return el;
}

/**
 * @param {string} text
 * @param {{ rate?: number }} [options]
 */
function speakText(text, options = {}) {
  const value = text.trim();
  if (!value || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(value);
  utter.lang = /[가-힣]/.test(value) ? 'ko-KR' : 'en-US';
  utter.rate = Math.max(0.5, Math.min(1.2, options.rate ?? 1));
  window.speechSynthesis.speak(utter);
}

/**
 * @param {string} label
 * @param {{ locked?: boolean, state?: 'active' | 'correct' | 'incorrect' }} options
 */
function createWordChip(label, options = {}) {
  const chip = document.createElement('button');
  chip.type = 'button';
  chip.className = 'quiz-word-chip';
  chip.textContent = label;
  chip.setAttribute('role', 'listitem');
  if (options.state === 'correct') chip.classList.add('quiz-word-chip--correct');
  if (options.state === 'incorrect') chip.classList.add('quiz-word-chip--incorrect');
  if (options.locked) chip.disabled = true;
  return chip;
}
