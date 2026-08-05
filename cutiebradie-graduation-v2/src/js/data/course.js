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
 * Only N1 is filled in this vertical slice.
 * @type {Readonly<Record<string, {
 *   choiceType: 'single' | 'multi',
 *   question: string,
 *   choices: ReadonlyArray<{ id: string, label: string }>,
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
});

export function getNodeById(id) {
  return COURSE_NODES.find((node) => node.id === id) ?? null;
}

export function getQuizByNodeId(id) {
  return QUIZZES[id] ?? null;
}
