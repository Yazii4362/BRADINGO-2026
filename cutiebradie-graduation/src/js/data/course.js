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
    typeLabel: '단일 선택',
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
 * `choiceType` drives single vs multi behavior in the shared quiz engine.
 * @type {Readonly<Record<string, {
 *   choiceType: 'single' | 'multi',
 *   layout?: 'image' | 'text' | 'character',
 *   question: string,
 *   instruction?: string,
 *   badge?: string,
 *   promptWord?: string,
 *   choices: ReadonlyArray<{ id: string, label: string, image?: string, alt?: string }>,
 *   correctChoiceIds: ReadonlyArray<string>,
 *   feedback: {
 *     correct: { title: string, body: string },
 *     incorrect: { title: string, body: string }
 *   }
 * }>>}
 */
export const QUIZZES = Object.freeze({
  n1: Object.freeze({
    choiceType: 'single',
    layout: 'image',
    badge: 'NEW WORD',
    question: 'Select the correct image',
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
  n2: Object.freeze({
    choiceType: 'single',
    layout: 'text',
    question: '병건이가 한 일이 아닌 것은?',
    choices: Object.freeze([
      Object.freeze({ id: 'chicago', label: '시카고 교환학생' }),
      Object.freeze({ id: 'australia', label: '호주 워킹홀리데이 1년' }),
      Object.freeze({ id: 'exchange', label: '제주도와 강원대학교 학점교류' }),
      Object.freeze({ id: 'skip', label: '매일 1교시 결석' }),
    ]),
    correctChoiceIds: Object.freeze(['skip']),
    feedback: Object.freeze({
      correct: Object.freeze({
        title: '정답입니다!',
        body: '병건이는 새벽 조깅과 아침 식사를 마친 뒤에도\n1교시 수업을 성실하게 들었어요.',
      }),
      incorrect: Object.freeze({
        title: '오답입니다!',
        body: '병건이는 시카고 교환학생, 호주 워킹홀리데이,\n제주도와 강원대학교 학점교류를 모두 했어요.',
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

export function getQuizByNodeId(id) {
  return QUIZZES[id] ?? null;
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
  const completedCount = progress?.nodeStatus
    ? COURSE_NODES.filter((node) => progress.nodeStatus[node.id] === 'completed').length
    : COURSE_NODES.length;

  const memoryContent = MEMORY_CONTENTS.n3;
  const multiQuiz = QUIZZES.n4;

  return {
    totalNodes: COURSE_NODES.length,
    completedCount,
    streakDays: 700,
    memoryCount: memoryContent?.memories.length ?? 0,
    friendMessageCount: multiQuiz?.correctChoiceIds.length ?? 0,
    title: 'BRADUATION COMPLETE! 🎓',
    subtitle: '병건이의 UOS LIFE가 완료되었어요.\n이제 새로운 챕터가 열렸어요.',
    exportSubtitle: `${BRAND.courseTitle} · ${BRAND.coursePeriod}`,
    wordmark: BRAND.wordmark,
    /** Set a local path later, e.g. ./assets/images/ending-hero.png */
    heroImage: '',
    heroAlt: '졸업 축하 일러스트',
  };
}
