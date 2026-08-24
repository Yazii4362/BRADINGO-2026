/** @typedef {'single' | 'multi' | 'content' | 'ending'} NodeType */

/**
 * Course nodes (intro is NOT a node).
 * All quizzes live on n1. Path stays 5 nodes (n1→n5) at original map slots.
 * Friends letters: n4 path chapter + GNB tab.
 * @type {ReadonlyArray<{
 *   id: string,
 *   order: number,
 *   title: string,
 *   type: NodeType,
 *   typeLabel: string,
 *   screen: 'quiz' | 'chapter' | 'memory' | 'friends' | 'ending'
 * }>}
 */
export const COURSE_NODES = Object.freeze([
  {
    id: 'n1',
    order: 1,
    title: '시작',
    type: 'single',
    typeLabel: '퀴즈',
    screen: 'quiz',
  },
  {
    id: 'n2',
    order: 2,
    title: '졸업 자격 심사',
    type: 'content',
    typeLabel: '콘텐츠',
    screen: 'chapter',
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
    type: 'content',
    typeLabel: '콘텐츠',
    screen: 'friends',
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

export function getNodeById(id) {
  return COURSE_NODES.find((node) => node.id === id) ?? null;
}
