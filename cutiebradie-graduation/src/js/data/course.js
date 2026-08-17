/** Shared brand / course copy used across intro, map, ending, and export card. */
export const BRAND = Object.freeze({
  wordmark: 'BRADINGO',
  courseName: 'UOS LIFE',
  courseTitle: '병건이의 UOS LIFE',
  coursePeriod: '2018.3 - 2026.8',
});

/** @typedef {'single' | 'multi' | 'content' | 'ending'} NodeType */

/**
 * Course nodes (intro is NOT a node).
 * @type {ReadonlyArray<{
 *   id: string,
 *   order: number,
 *   title: string,
 *   type: NodeType,
 *   typeLabel: string,
 *   screen: 'quiz' | 'memory' | 'ending'
 * }>}
 */
export const COURSE_NODES = Object.freeze([
  {
    id: 'n1',
    order: 1,
    title: '시작',
    type: 'single',
    typeLabel: '단일 선택',
    screen: 'quiz',
  },
  {
    id: 'n2',
    order: 2,
    title: '병건이의 학교생활',
    type: 'single',
    typeLabel: '듣기 · 탭',
    screen: 'quiz',
  },
  {
    id: 'n3',
    order: 3,
    title: '우리의 추억',
    type: 'content',
    typeLabel: '콘텐츠',
    screen: 'memory',
  },
  {
    id: 'n4',
    order: 4,
    title: '졸업축하 메시지',
    type: 'multi',
    typeLabel: '복수 선택',
    screen: 'quiz',
  },
  {
    id: 'n5',
    order: 5,
    title: '엔딩',
    type: 'ending',
    typeLabel: '엔딩 · PNG',
    screen: 'ending',
  },
]);

/**
 * Quiz payloads keyed by node id.
 * A node may be a single quiz object, or `{ questions: [...] }` for multi-step lessons.
 * `choiceType` drives single / multi / sentence behavior in the shared quiz engine.
 * @typedef {{
 *   choiceType: 'single' | 'multi' | 'sentence',
 *   layout?: 'image' | 'text' | 'character' | 'listen',
 *   question: string,
 *   instruction?: string,
 *   badge?: string,
 *   badgeVariant?: 'new-word' | 'hard',
 *   promptWord?: string,
 *   characterImage?: string,
 *   characterAlt?: string,
 *   listenText?: string,
 *   tokens?: ReadonlyArray<{ id: string, label: string }>,
 *   bankOrder?: ReadonlyArray<string>,
 *   correctOrder?: ReadonlyArray<string>,
 *   choices?: ReadonlyArray<{ id: string, label: string, image?: string, alt?: string }>,
 *   correctChoiceIds?: ReadonlyArray<string>,
 *   feedback: {
 *     correct: { title: string, body: string },
 *     incorrect: { title: string, body: string }
 *   }
 * }} QuizItem
 * @type {Readonly<Record<string, QuizItem | { questions: ReadonlyArray<QuizItem> }>>}
 */
export const QUIZZES = Object.freeze({
  n1: Object.freeze({
    questions: Object.freeze([
      Object.freeze({
        choiceType: 'single',
        layout: 'image',
        badge: 'NEW WORD',
        question: '맞는 이미지를 고르세요',
        promptWord: '정병건',
        choices: Object.freeze([
          Object.freeze({ id: 'jeong', label: '정병건', image: '', alt: '정병건' }),
          Object.freeze({ id: 'pong', label: '뽕꼬니', image: '', alt: '뽕꼬니' }),
          Object.freeze({ id: 'bbang', label: '시립대건빵', image: '', alt: '시립대건빵' }),
          Object.freeze({ id: 'bradie', label: 'Bradie', image: '', alt: 'Bradie' }),
        ]),
        correctChoiceIds: Object.freeze(['jeong']),
        feedback: Object.freeze({
          correct: Object.freeze({
            title: '정답입니다!',
            body: '병건이의 본명은 정병건이에요.',
          }),
          incorrect: Object.freeze({
            title: '오답입니다!',
            body: '정답은 정병건이에요.',
          }),
        }),
      }),
      Object.freeze({
        choiceType: 'single',
        layout: 'image',
        badge: 'NEW WORD',
        question: '맞는 이미지를 고르세요',
        promptWord: 'Bradie',
        choices: Object.freeze([
          Object.freeze({ id: 'jeong', label: '정병건', image: '', alt: '정병건' }),
          Object.freeze({ id: 'pong', label: '뽕꼬니', image: '', alt: '뽕꼬니' }),
          Object.freeze({ id: 'bbang', label: '시립대건빵', image: '', alt: '시립대건빵' }),
          Object.freeze({ id: 'bradie', label: 'Bradie', image: '', alt: 'Bradie' }),
        ]),
        correctChoiceIds: Object.freeze(['bradie']),
        feedback: Object.freeze({
          correct: Object.freeze({
            title: '정답입니다!',
            body: '병건이의 영어 이름은 Bradie예요.',
          }),
          incorrect: Object.freeze({
            title: '오답입니다!',
            body: '정답은 Bradie예요.',
          }),
        }),
      }),
      Object.freeze({
        choiceType: 'single',
        layout: 'image',
        badge: 'NEW WORD',
        question: '맞는 이미지를 고르세요',
        promptWord: '시립대건빵',
        choices: Object.freeze([
          Object.freeze({ id: 'jeong', label: '정병건', image: '', alt: '정병건' }),
          Object.freeze({ id: 'pong', label: '뽕꼬니', image: '', alt: '뽕꼬니' }),
          Object.freeze({ id: 'bbang', label: '시립대건빵', image: '', alt: '시립대건빵' }),
          Object.freeze({ id: 'bradie', label: 'Bradie', image: '', alt: 'Bradie' }),
        ]),
        correctChoiceIds: Object.freeze(['bbang']),
        feedback: Object.freeze({
          correct: Object.freeze({
            title: '정답입니다!',
            body: '시립대건빵은 병건이의 대표 별명이에요.',
          }),
          incorrect: Object.freeze({
            title: '오답입니다!',
            body: '정답은 시립대건빵이에요.',
          }),
        }),
      }),
    ]),
  }),
  n2: Object.freeze({
    choiceType: 'sentence',
    layout: 'listen',
    badge: '어려운 문제',
    badgeVariant: 'hard',
    question: '들은 내용을 탭하세요',
    characterImage: './assets/images/quiz/n2-character-full.png',
    characterAlt: '병건이 캐릭터',
    listenText: '병건아 졸업을 축하해',
    tokens: Object.freeze([
      Object.freeze({ id: 'byeong', label: '병건아' }),
      Object.freeze({ id: 'jol', label: '졸업을' }),
      Object.freeze({ id: 'chuk', label: '축하해' }),
      Object.freeze({ id: 'ip', label: '입학을' }),
      Object.freeze({ id: 'grad', label: '대학원' }),
      Object.freeze({ id: 'an', label: '안' }),
      Object.freeze({ id: 'cham', label: '참' }),
    ]),
    bankOrder: Object.freeze(['ip', 'byeong', 'grad', 'jol', 'an', 'chuk', 'cham']),
    correctOrder: Object.freeze(['byeong', 'jol', 'chuk']),
    feedback: Object.freeze({
      correct: Object.freeze({
        title: '정답입니다!',
        body: '병건아, 졸업을 축하해!',
      }),
      incorrect: Object.freeze({
        title: '오답입니다!',
        body: '정답은 「병건아 졸업을 축하해」예요.',
      }),
    }),
  }),
  n4: Object.freeze({
    choiceType: 'multi',
    layout: 'character',
    question: '누가 병건이 졸업을 축하하러 왔나요?',
    instruction: '해당하는 답을 모두 선택하세요.',
    choices: Object.freeze([
      Object.freeze({ id: 'dabin', label: '이다빈', image: '', alt: '이다빈 캐릭터' }),
      Object.freeze({ id: 'yaji', label: '야지', image: '', alt: '야지 캐릭터' }),
      Object.freeze({ id: 'yubinu', label: '유비누', image: '', alt: '유비누 캐릭터' }),
      Object.freeze({ id: 'gaeuni', label: '가으니', image: '', alt: '가으니 캐릭터' }),
    ]),
    correctChoiceIds: Object.freeze(['dabin', 'yaji', 'yubinu', 'gaeuni']),
    feedback: Object.freeze({
      correct: Object.freeze({
        title: '정답입니다!',
        body: '병건이의 졸업을 축하하려고 친구들이 모두 모였어요.',
      }),
      incorrect: Object.freeze({
        title: '오답입니다!',
        body: '병건이를 축하하러 온 친구 네 명을 모두 선택해 주세요.',
      }),
    }),
  }),
});

export function getNodeById(id) {
  return COURSE_NODES.find((node) => node.id === id) ?? null;
}

/**
 * Normalize a quiz node into an ordered question list.
 * @param {string} id
 * @returns {ReadonlyArray<QuizItem> | null}
 */
export function getQuizQuestionsByNodeId(id) {
  const quiz = QUIZZES[id];
  if (!quiz) return null;
  if ('questions' in quiz && Array.isArray(quiz.questions)) {
    return quiz.questions;
  }
  return Object.freeze([quiz]);
}

export function getQuizByNodeId(id) {
  const questions = getQuizQuestionsByNodeId(id);
  return questions?.[0] ?? null;
}

/**
 * Memory content payloads keyed by node id.
 * Set `image` to a path under assets/images when real photos are ready.
 * @type {Readonly<Record<string, {
 *   title: string,
 *   memories: ReadonlyArray<{
 *     id: string,
 *     image: string,
 *     alt: string,
 *     caption: string,
 *     date: string
 *   }>
 * }>>}
 */
export const MEMORY_CONTENTS = Object.freeze({
  n3: Object.freeze({
    title: '우리의 추억',
    memories: Object.freeze([
      Object.freeze({
        id: 'memory-1',
        image: '',
        alt: '추억 사진 1',
        caption: '추억 문구를 입력할 자리',
        date: '',
      }),
      Object.freeze({
        id: 'memory-2',
        image: '',
        alt: '추억 사진 2',
        caption: '추억 문구를 입력할 자리',
        date: '',
      }),
      Object.freeze({
        id: 'memory-3',
        image: '',
        alt: '추억 사진 3',
        caption: '추억 문구를 입력할 자리',
        date: '',
      }),
    ]),
  }),
});

export function getMemoryByNodeId(id) {
  return MEMORY_CONTENTS[id] ?? null;
}

/**
 * Shared graduation stats for Ending UI and ExportCard.
 * @param {{ nodeStatus?: Record<string, string> } | null} [progress]
 */
export function getGraduationStats(progress = null) {
  const totalNodes = COURSE_NODES.length;
  const completedCount = progress?.nodeStatus
    ? COURSE_NODES.filter((node) => progress.nodeStatus[node.id] === 'completed').length
    : totalNodes;

  const courseValue = `${completedCount} / ${totalNodes}`;
  const badgeValue = `${totalNodes} 개`;

  /** @type {ReadonlyArray<{ id: string, label: string, value: string, valueHtml?: string, icon: string }>} */
  const summaryRows = [
    {
      id: 'period',
      label: '여정 기간',
      value: '2018 → 2026',
      icon: './assets/images/ending/icon-calendar.svg',
    },
    {
      id: 'courses',
      label: '완료한 코스',
      value: courseValue,
      icon: './assets/images/ending/icon-book.svg',
    },
    {
      id: 'badges',
      label: '획득한 배지',
      value: badgeValue,
      icon: './assets/images/ending/icon-star.svg',
    },
    {
      id: 'memories',
      label: '함께한 추억',
      value: '무한대 ∞',
      valueHtml: '무한대 <span class="ending-infinity">∞</span>',
      icon: './assets/images/heart.svg',
    },
  ];

  return {
    totalNodes,
    completedCount,
    title: 'BRADUATION COMPLETE!',
    lead: '병건이의 UOS LIFE가 완료되었어요.',
    tagline: '이제 새로운 챕터가 열렸어요.',
    subtitle: '병건이의 UOS LIFE가 완료되었어요.\n이제 새로운 챕터가 열렸어요.',
    exportSubtitle: `${BRAND.courseTitle} · ${BRAND.coursePeriod}`,
    wordmark: BRAND.wordmark,
    summaryTitle: '여정 요약',
    summaryRows,
    heroImage: './assets/images/node-ending.svg',
    heroAlt: '졸업 보물상자',
    ctaLabel: '새로운 챕터로 가기',
  };
}
