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
 *   question: string,
 *   instruction?: string,
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
    question: '병건이가 지금까지 이어온 듀오링고 스트릭은 며칠일까요?',
    choices: Object.freeze([
      Object.freeze({ id: 'c100', label: '100일' }),
      Object.freeze({ id: 'c365', label: '365일' }),
      Object.freeze({ id: 'c700', label: '700일' }),
      Object.freeze({ id: 'c1000', label: '1000일' }),
    ]),
    correctChoiceIds: Object.freeze(['c700']),
    feedback: Object.freeze({
      correct: Object.freeze({
        title: '정답입니다!',
        body: '병건이는 듀오링고 스트릭을 700일 넘게 이어왔어요.',
      }),
      incorrect: Object.freeze({
        title: '아쉬워요!',
        body: '병건이의 듀오링고 스트릭은 700일이에요.',
      }),
    }),
  }),
  n2: Object.freeze({
    choiceType: 'single',
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
        title: '아쉬워요!',
        body: '병건이는 시카고 교환학생, 호주 워킹홀리데이,\n제주도와 강원대학교 학점교류를 모두 했어요.',
      }),
    }),
  }),
  n4: Object.freeze({
    choiceType: 'multi',
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
        title: '다 왔어요!',
        body: '병건이의 졸업을 축하하려고 친구들이 모두 모였어요.',
      }),
      incorrect: Object.freeze({
        title: '아직 누군가 빠졌어요!',
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
    title: '졸업을 축하해, 병건아!',
    subtitle: '길었던 학교생활의 마지막 레벨을 완료했어요.',
    exportSubtitle: '마지막 레벨을 클리어한 병건이에게',
    wordmark: '병건링고',
    /** Set a local path later, e.g. ./assets/images/ending-hero.png */
    heroImage: '',
    heroAlt: '졸업 축하 일러스트',
  };
}
