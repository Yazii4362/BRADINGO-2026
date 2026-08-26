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
 *   listenRate?: number,
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
        question: '틀린 것을 골라 주세요',
        promptWord: '브래디',
        choices: Object.freeze([
          Object.freeze({
            id: 'jeong',
            label: '',
            image: './assets/images/quiz/n1-jeong.webp',
            alt: '브래디',
          }),
          Object.freeze({
            id: 'pong',
            label: '',
            image: './assets/images/quiz/n1-pong.webp',
            alt: '뽕꼬니',
          }),
          Object.freeze({
            id: 'bbang',
            label: '',
            image: './assets/images/quiz/n1-bbang.webp',
            alt: '브래디',
          }),
          Object.freeze({
            id: 'bradie',
            label: '',
            image: './assets/images/quiz/n1-bradie.webp',
            alt: '브래디',
          }),
        ]),
        correctChoiceIds: Object.freeze(['pong']),
        feedback: Object.freeze({
          correct: Object.freeze({
            title: '정답이에요',
            body: '로고 속 인물은 백종원이에요',
          }),
          incorrect: Object.freeze({
            title: '다시 생각해 볼까요?',
            body: '',
          }),
        }),
      }),
      Object.freeze({
        choiceType: 'single',
        layout: 'image',
        badge: '학교생활',
        question: '브래디의 학교생활이 아닌 것은?',
        choices: Object.freeze([
          Object.freeze({
            id: 'chicago',
            label: '시카고 교환학생',
            image: './assets/images/quiz/campus-chicago.webp',
            alt: '시카고 교환학생',
          }),
          Object.freeze({
            id: 'australia',
            label: '호주 워홀 1년',
            image: './assets/images/quiz/campus-australia.webp',
            alt: '호주 워홀 1년',
          }),
          Object.freeze({
            id: 'jeju',
            label: '제주도/강원대 학점교류',
            image: './assets/images/quiz/campus-jeju.webp',
            alt: '제주도/강원대 학점교류',
          }),
          Object.freeze({
            id: 'skip',
            label: '1교시 지각',
            image: './assets/images/quiz/campus-skip.webp',
            alt: '1교시 지각',
          }),
        ]),
        correctChoiceIds: Object.freeze(['skip']),
        feedback: Object.freeze({
          correct: Object.freeze({
            title: '정답이에요',
            body: '',
          }),
          incorrect: Object.freeze({
            title: '다시 생각해 볼까요?',
            body: '',
          }),
        }),
      }),
      Object.freeze({
        choiceType: 'sentence',
        layout: 'listen',
        badge: '어려운 문제',
        badgeVariant: 'hard',
        question: '들은 내용을 눌러 주세요',
        characterImage: './assets/images/quiz/n2-character-full.webp',
        characterAlt: '브래디 캐릭터',
        listenText: '브래디야 졸업을 축하해',
        listenRate: 0.65,
        tokens: Object.freeze([
          Object.freeze({ id: 'byeong', label: '브래디야' }),
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
            title: '정답이에요',
            body: '',
          }),
          incorrect: Object.freeze({
            title: '다시 생각해 볼까요?',
            body: '',
          }),
        }),
      }),
      Object.freeze({
        choiceType: 'single',
        layout: 'image',
        badge: '어려운 문제',
        badgeVariant: 'hard',
        question: '브래디가 먹어보지 못한 음식은?',
        choices: Object.freeze([
          Object.freeze({
            id: 'tempt',
            label: '템트',
            image: './assets/images/quiz/food-tempt.webp',
            alt: '템트',
          }),
          Object.freeze({
            id: 'katsudon',
            label: '학관 가츠동',
            image: './assets/images/quiz/food-katsudon.webp',
            alt: '학관 가츠동',
          }),
          Object.freeze({
            id: 'shanghai',
            label: '아느칸 상하이 스파게티',
            image: './assets/images/quiz/food-shanghai.webp',
            alt: '아느칸 상하이 스파게티',
          }),
          Object.freeze({
            id: 'suyuk',
            label: '삶은고기',
            image: './assets/images/quiz/food-suyuk.webp',
            alt: '삶은고기',
          }),
        ]),
        correctChoiceIds: Object.freeze(['suyuk']),
        feedback: Object.freeze({
          correct: Object.freeze({
            title: '정답이에요',
            body: '',
          }),
          incorrect: Object.freeze({
            title: '다시 생각해 볼까요?',
            body: '',
          }),
        }),
      }),
    ]),
  }),
});

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
