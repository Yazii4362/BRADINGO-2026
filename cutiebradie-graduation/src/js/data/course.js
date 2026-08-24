/** Shared brand / course copy used across intro, map, ending, and export card. */
import { t } from '../i18n.js';

export const BRAND = Object.freeze({
  wordmark: 'BRADINGO',
  courseName: 'UOS LIFE',
  courseTitle: '브래디의 UOS LIFE',
  coursePeriod: '2018.3 - 2026.8',
});

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
            image: './assets/images/quiz/n1-pong.png',
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
            image: './assets/images/quiz/n1-bradie.png',
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
        characterImage: './assets/images/quiz/n2-character-full.png',
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

/**
 * Lightweight chapter copy for non-quiz / non-memory path nodes.
 * @type {Readonly<Record<string, {
 *   body: string,
 *   highlights?: ReadonlyArray<{ id: string, label: string, image: string }>
 * }>>}
 */
export const CHAPTER_CONTENTS = Object.freeze({
  n2: Object.freeze({
    body: '캠퍼스에서 보낸 날들을 떠올려 보세요',
    highlights: Object.freeze([
      Object.freeze({
        id: 'chicago',
        label: '시카고 교환학생',
        image: './assets/images/quiz/campus-chicago.webp',
      }),
      Object.freeze({
        id: 'australia',
        label: '호주 워홀 1년',
        image: './assets/images/quiz/campus-australia.webp',
      }),
      Object.freeze({
        id: 'jeju',
        label: '제주·강원대 학점교류',
        image: './assets/images/quiz/campus-jeju.webp',
      }),
    ]),
  }),
});

export function getChapterByNodeId(id) {
  return CHAPTER_CONTENTS[id] ?? null;
}

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
 *   subtitle: string,
 *   categories: ReadonlyArray<{ id: string, label: string }>,
 *   memories: ReadonlyArray<{
 *     id: string,
 *     image: string,
 *     alt: string,
 *     caption: string,
 *     date: string,
 *     category: string
 *   }>
 * }>>}
 */
export const MEMORY_CONTENTS = Object.freeze({
  n3: Object.freeze({
    title: '우리의 추억',
    subtitle: '함께한 순간들이 참 소중해요 💚',
    categories: Object.freeze([
      Object.freeze({ id: 'all', label: '전체' }),
      Object.freeze({ id: '2023', label: '2023' }),
      Object.freeze({ id: '2024', label: '2024' }),
      Object.freeze({ id: '2025', label: '2025~' }),
      Object.freeze({ id: 'running', label: '달리기' }),
      Object.freeze({ id: 'meme', label: '밈' }),
    ]),
    memories: Object.freeze([
      Object.freeze({
        id: 'memory-1',
        image: './assets/images/memory/01-hangout.webp',
        alt: '방에서 친구들과 찍은 단체 셀카',
        caption: '방구석 평화의 손',
        date: '2023',
        category: '2023',
      }),
      Object.freeze({
        id: 'memory-2',
        image: './assets/images/memory/02-mirror.webp',
        alt: '거울 앞에서 찍은 친구들 셀카',
        caption: '거울 셀카',
        date: '2023',
        category: '2023',
      }),
      Object.freeze({
        id: 'memory-3',
        image: './assets/images/memory/03-goodbye.webp',
        alt: 'GOODBYE 풍선 앞에서 건배하는 친구들',
        caption: 'GOODBYE 파티',
        date: '2024',
        category: '2024',
      }),
      Object.freeze({
        id: 'memory-4',
        image: './assets/images/memory/04-picnic.webp',
        alt: '숲속 피크닉에서 음료를 든 친구들',
        caption: '숲속 피크닉',
        date: '2023',
        category: '2023',
      }),
      Object.freeze({
        id: 'memory-5',
        image: './assets/images/memory/05-outdoor.webp',
        alt: '나무 다리 위에서 포즈 잡은 친구들',
        caption: '산책 나들이',
        date: '2023',
        category: '2023',
      }),
      Object.freeze({
        id: 'memory-6',
        image: './assets/images/memory/06-convex-mirror.webp',
        alt: '볼록 거울에 비친 친구들 셀카',
        caption: '볼록 거울 셀카',
        date: '2024',
        category: '2024',
      }),
      Object.freeze({
        id: 'memory-7',
        image: './assets/images/memory/07-photobooth-strip.webp',
        alt: '네컷 사진 부스에서 위에서 찍은 단체 사진',
        caption: '네컷 사진',
        date: '2024',
        category: '2024',
      }),
      Object.freeze({
        id: 'memory-8',
        image: './assets/images/memory/08-convex-loopy.webp',
        alt: '잔망루피 스티커가 있는 거울 셀카',
        caption: '잔망루피 거울',
        date: '2024',
        category: '2024',
      }),
      Object.freeze({
        id: 'memory-9',
        image: './assets/images/memory/09-cafe-selfie.webp',
        alt: '카페에서 찍은 친구들 셀카',
        caption: '카페 셀카',
        date: '2024',
        category: '2024',
      }),
      Object.freeze({
        id: 'memory-10',
        image: './assets/images/memory/10-floor-mirror.webp',
        alt: '전신 거울 앞에서 찍은 단체 사진',
        caption: '전신 거울',
        date: '2024',
        category: '2024',
      }),
      Object.freeze({
        id: 'memory-11',
        image: './assets/images/memory/11-table-peek.webp',
        alt: '테이블 너머로 고개 내민 친구들',
        caption: '테이블 피크',
        date: '2025',
        category: '2025',
      }),
      Object.freeze({
        id: 'memory-12',
        image: './assets/images/memory/12-restaurant.webp',
        alt: '식당에서 찍은 단체 셀카',
        caption: '밥 먹고 셀카',
        date: '2025',
        category: '2025',
      }),
      Object.freeze({
        id: 'memory-13',
        image: './assets/images/memory/13-video-call.webp',
        alt: '네 명이 함께한 화상 통화 화면',
        caption: '화상 통화',
        date: '2025',
        category: '2025',
      }),
      Object.freeze({
        id: 'memory-14',
        image: './assets/images/memory/14-meme-is-this.webp',
        alt: '이거 밈이에요? 합성 짤',
        caption: '이거 밈이에요?',
        date: '',
        category: 'meme',
      }),
      Object.freeze({
        id: 'memory-15',
        image: './assets/images/memory/15-meme-bag.webp',
        alt: '졸업가운 입고 가방에 친구들을 담은 원근법 사진',
        caption: '가방 속 친구들',
        date: '',
        category: 'meme',
      }),
      Object.freeze({
        id: 'memory-16',
        image: './assets/images/memory/16-photo.webp',
        alt: '친구들과 찍은 사진',
        caption: '친구들과의 추억',
        date: '2024',
        category: '2024',
      }),
      Object.freeze({
        id: 'memory-17',
        image: './assets/images/memory/17-photo.webp',
        alt: '일상 사진',
        caption: '일상 한 컷',
        date: '2024',
        category: '2024',
      }),
      Object.freeze({
        id: 'memory-18',
        image: './assets/images/memory/18-photo.webp',
        alt: '주차장에서 찍은 단체 셀카',
        caption: '주차장 셀카',
        date: '2024',
        category: '2024',
      }),
      Object.freeze({
        id: 'memory-19',
        image: './assets/images/memory/19-photo.webp',
        alt: 'BeReal 화면 캡처',
        caption: 'BeReal 피드',
        date: '2024',
        category: '2024',
      }),
      Object.freeze({
        id: 'memory-20',
        image: './assets/images/memory/20-photo.webp',
        alt: '야간 러닝 후 단체 사진',
        caption: '러닝 후',
        date: '2024',
        category: '2024',
      }),
      Object.freeze({
        id: 'memory-21',
        image: './assets/images/memory/21-photo.webp',
        alt: '창가에서 찍은 브래디',
        caption: '창가 초상',
        date: '2024',
        category: '2024',
      }),
      Object.freeze({
        id: 'memory-22',
        image: './assets/images/memory/22-photo.webp',
        alt: '돌계단에서 찍은 BeReal',
        caption: '돌계단 BeReal',
        date: '2024',
        category: '2024',
      }),
      Object.freeze({
        id: 'memory-23',
        image: './assets/images/memory/23-photo.webp',
        alt: '나들이 사진',
        caption: '나들이',
        date: '2024',
        category: '2024',
      }),
      Object.freeze({
        id: 'memory-24',
        image: './assets/images/memory/24-photo.webp',
        alt: '포토부스 프레임',
        caption: '모드 빈티크',
        date: '2024',
        category: '2024',
      }),
      Object.freeze({
        id: 'memory-25',
        image: './assets/images/memory/25-photo.webp',
        alt: '운동장에서 찍은 단체 셀카',
        caption: '운동장 셀카',
        date: '2023',
        category: 'running',
      }),
      Object.freeze({
        id: 'memory-26',
        image: './assets/images/memory/26-photo.webp',
        alt: '트랙에서 찍은 단체 사진',
        caption: '트랙 단체',
        date: '2023',
        category: 'running',
      }),
      Object.freeze({
        id: 'memory-27',
        image: './assets/images/memory/27-photo.webp',
        alt: '트랙에서 주먹 인사',
        caption: '주먹 인사',
        date: '2023',
        category: 'running',
      }),
      Object.freeze({
        id: 'memory-28',
        image: './assets/images/memory/28-photo.webp',
        alt: '주차장에서 카트와 함께',
        caption: '카트 푸시',
        date: '2024',
        category: '2024',
      }),
      Object.freeze({
        id: 'memory-29',
        image: './assets/images/memory/29-photo.webp',
        alt: '주차장에서 음료 든 브래디',
        caption: '음료 들고',
        date: '2024',
        category: '2024',
      }),
      Object.freeze({
        id: 'memory-30',
        image: './assets/images/memory/30-photo.webp',
        alt: '차 뒷유리에 비친 친구들',
        caption: '차창 반사',
        date: '2024',
        category: '2024',
      }),
      Object.freeze({
        id: 'memory-31',
        image: './assets/images/memory/31-photo.webp',
        alt: '나들이 사진',
        caption: '나들이 한 컷',
        date: '2024',
        category: '2024',
      }),
      Object.freeze({
        id: 'memory-32',
        image: './assets/images/memory/32-photo.webp',
        alt: '꽃무늬 조끼 입고 엄지척',
        caption: '꽃무늬 조끼',
        date: '2025',
        category: '2025',
      }),
      Object.freeze({
        id: 'memory-34',
        image: './assets/images/memory/34-osong.webp',
        alt: '오송역 표지판 앞에서 찍은 셀카',
        caption: '오송역',
        date: '2026.1',
        category: '2025',
      }),
      Object.freeze({
        id: 'memory-35',
        image: './assets/images/memory/35-collage.webp',
        alt: '공방에서 만든 것과 거울 셀카 네 컷',
        caption: '공방 나들이',
        date: '2026.1',
        category: '2025',
      }),
      Object.freeze({
        id: 'memory-36',
        image: './assets/images/memory/36-costco.webp',
        alt: '코스트코에서 장보는 친구들',
        caption: '코스트코',
        date: '2026.1',
        category: '2025',
      }),
      Object.freeze({
        id: 'memory-38',
        image: './assets/images/memory/38-fruit.webp',
        alt: '포도 딸기 그릇과 와인참 피규어',
        caption: '과일 파티',
        date: '2026.1',
        category: '2025',
      }),
      Object.freeze({
        id: 'memory-39',
        image: './assets/images/memory/39-meme-song.webp',
        alt: '아름다운 음악 워로미루기 밈',
        caption: '워로미루기',
        date: '',
        category: 'meme',
      }),
      Object.freeze({
        id: 'memory-40',
        image: './assets/images/memory/40-ktx.webp',
        alt: 'KTX 안에서 찍은 사진',
        caption: 'KTX',
        date: '2026.1',
        category: '2025',
      }),
      Object.freeze({
        id: 'memory-41',
        image: './assets/images/memory/41-finger.webp',
        alt: '손가락에 올린 와인참 피규어들',
        caption: '손가락 아저씨',
        date: '2026.1',
        category: '2025',
      }),
      Object.freeze({
        id: 'memory-42',
        image: './assets/images/memory/42-playground.webp',
        alt: '놀이터 회전 기구에 탄 친구들',
        caption: '놀이터',
        date: '2026.1',
        category: '2025',
      }),
      Object.freeze({
        id: 'memory-43',
        image: './assets/images/memory/43-climb.webp',
        alt: '책상 모서리를 오르는 피규어',
        caption: '책상 등반',
        date: '2026.1',
        category: '2025',
      }),
      Object.freeze({
        id: 'memory-44',
        image: './assets/images/memory/44-housewarming.webp',
        alt: '친구 집들이',
        caption: '세종 집들이',
        date: '2026.1',
        category: '2025',
      }),
      Object.freeze({
        id: 'memory-45',
        image: './assets/images/memory/45-gifts.webp',
        alt: '꼬치의 달인과 와인참 등 집들이 선물',
        caption: '집들이 선물',
        date: '2026.1',
        category: '2025',
      }),
      Object.freeze({
        id: 'memory-46',
        image: './assets/images/memory/46-shadow.webp',
        alt: '눈 위에 비친 친구들 그림자',
        caption: '눈 위 그림자',
        date: '2026.1',
        category: '2025',
      }),
      Object.freeze({
        id: 'memory-47',
        image: './assets/images/memory/47-hut.webp',
        alt: '눈 쌓인 나무 오두막',
        caption: '눈 오두막',
        date: '2026.1',
        category: '2025',
      }),
      Object.freeze({
        id: 'memory-48',
        image: './assets/images/memory/48-apron.webp',
        alt: '근육 앞치마를 한 모습',
        caption: '근육 앞치마',
        date: '2026.1',
        category: '2025',
      }),
      Object.freeze({
        id: 'memory-49',
        image: './assets/images/memory/49-fishbread.webp',
        alt: '행복한 잉어빵을 나눠 먹는 손들',
        caption: '잉어빵',
        date: '2026.1',
        category: '2025',
      }),
      Object.freeze({
        id: 'memory-50',
        image: './assets/images/memory/50-kushi.webp',
        alt: '꼬치의 달인 보드게임을 하는 모습',
        caption: '꼬치의 달인',
        date: '2026.1',
        category: '2025',
      }),
      Object.freeze({
        id: 'memory-51',
        image: './assets/images/memory/51-freddie.webp',
        alt: '귤 위에 올라간 프레디 피규어',
        caption: '귤 위 프레디',
        date: '2026',
        category: '2025',
      }),
      Object.freeze({
        id: 'memory-52',
        image: './assets/images/memory/52-bungeoppang.webp',
        alt: '붕어빵 틀에서 익는 잉어빵',
        caption: '잉어빵 굽기',
        date: '2026',
        category: '2025',
      }),
      Object.freeze({
        id: 'memory-53',
        image: './assets/images/memory/53-snacks.webp',
        alt: '음료와 간식 위에 올라간 피규어들',
        caption: '간식 파티',
        date: '2026',
        category: '2025',
      }),
      Object.freeze({
        id: 'memory-54',
        image: './assets/images/memory/54-train-stack.webp',
        alt: '기차 테이블 위에서 포개진 피규어',
        caption: 'KTX 아저씨',
        date: '2026',
        category: '2025',
      }),
      Object.freeze({
        id: 'memory-55',
        image: './assets/images/memory/55-burger.webp',
        alt: '버거 네 접시',
        caption: '버거 클럽',
        date: '2026',
        category: '2025',
      }),
      Object.freeze({
        id: 'memory-57',
        image: './assets/images/memory/57-misutgaru.webp',
        alt: '달콤한 미숫가루 슬러시 기계',
        caption: '미숫가루 슬러시',
        date: '2026',
        category: '2025',
      }),
    ]),
  }),
});

export function getMemoryByNodeId(id) {
  return MEMORY_CONTENTS[id] ?? null;
}

/**
 * Friends / congratulation letters (GNB tab — not a course node).
 * @type {{
 *   title: string,
 *   subtitle: string,
 *   friends: ReadonlyArray<{
 *     id: string,
 *     name: string,
 *     initials: string,
 *     phone: string,
 *     email: string,
 *     group: string,
 *     preview: string,
 *     letter: string,
 *     image?: string,
 *     alt?: string
 *   }>
 * }}
 */
export const FRIENDS_FEED = Object.freeze({
  title: '졸업축하 메시지',
  subtitle: '카드를 넘겨 편지를 읽어 보세요',
  friends: Object.freeze([
    Object.freeze({
      id: 'dabin',
      name: '수아',
      initials: '수',
      phone: '',
      email: '',
      group: '졸업식 아침',
      preview: '브래디, 졸업 축하해! 🥳🎓',
      letter:
        '브래디, 졸업 축하해! 🥳🎓\n\n입학식 때 캠퍼스 지도를 같이 들고 헤맸던 게 엊그제 같은데, 벌써 가운을 입네. 수업 끝나고 학식 줄 서면서 수다 떨던 날들이 제일 그리울 것 같아.\n각자 다른 길로 가도, 오랜만에 만나면 또 바로 웃을 수 있으면 좋겠다. 새 출발 응원할게.\n\n— 수아',
      image: './assets/images/friends/dabin.png',
      alt: '수아 프로필',
    }),
    Object.freeze({
      id: 'yaji',
      name: '지은',
      initials: '지',
      phone: '',
      email: '',
      group: '졸업식 아침',
      preview: '네 UOS LIFE를 작은 퀘스트로 남겨봤어.',
      letter:
        '브래디, 졸업 축하해!\n\n네 학교생활을 따라가다 보니 웃음이 많이 나더라. 그래서 길 따라 걷는 퀘스트처럼 남겨봤어. 앞으로의 페이스도 네 리듬으로 잘 걸어가길.\n언제든 커피 한잔하자.\n\n— 지은',
      image: './assets/images/friends/yaji.png',
      alt: '지은 프로필',
    }),
    Object.freeze({
      id: 'yubinu',
      name: '하준',
      initials: '하',
      phone: '',
      email: '',
      group: '8월 초',
      preview: '브래디, 졸업 축하해. 트랙에서 만난 게 엊그제 같아.',
      letter:
        '브래디, 졸업 축하해!\n\n운동장에서 같이 뛰고, 끝나고 배고프다고 우동 먹으러 가던 게 아직도 생생해. 시험 기간엔 도서관에서 서로 간식 나눠 먹던 것도. 덕분에 대학이 훨씬 즐거웠어.\n여행 가면 사진 많이 찍어와. 다음에 우리랑도 꼭 가자.\n\n— 하준',
      image: './assets/images/friends/yubinu.png',
      alt: '하준 프로필',
    }),
    Object.freeze({
      id: 'gaeuni',
      name: '예린',
      initials: '예',
      phone: '',
      email: '',
      group: '여름방학',
      preview: '졸업식이 대화로만 남더니 진짜 그날이 왔네.',
      letter:
        '브래디에게\n\n작년에 캠퍼스 걸으면서 “우리 진짜 졸업하려나” 하고 웃던 게 생각나. 같이 공부할 때 많이 의지됐고, 덕분에 힘든 학기도 버텼어.\n앞으로는 연락 뜸해져도 종종 보자. 새로운 시작을 진심으로 응원해!\n\n— 예린',
      image: './assets/images/friends/gaeuni.png',
      alt: '예린 프로필',
    }),
  ]),
});

export function getFriendsFeed() {
  return FRIENDS_FEED;
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

  const stageValue = `${completedCount} / ${totalNodes}`;

  /** @type {ReadonlyArray<{ id: string, tone: 'xp' | 'time' | 'lessons', head: string, label: string, value: string }>} */
  const summaryRows = [
    {
      id: 'stages',
      tone: 'xp',
      head: t('ending.stat.xpHead'),
      label: t('ending.stat.stages'),
      value: stageValue,
    },
    {
      id: 'period',
      tone: 'time',
      head: t('ending.stat.timeHead'),
      label: t('ending.stat.uosLife'),
      value: t('ending.stat.timeValue'),
    },
    {
      id: 'memories',
      tone: 'lessons',
      head: t('ending.stat.lessonsHead'),
      label: t('ending.stat.memories'),
      value: t('ending.stat.memoriesValue'),
    },
  ];

  return {
    totalNodes,
    completedCount,
    title: 'BRADUATION COMPLETE!',
    stageLabel: t('ending.stageLabel'),
    lead: t('ending.lead'),
    tagline: t('ending.tagline'),
    subtitle: `${t('ending.lead')}\n${t('ending.tagline')}`,
    exportSubtitle: `${t('brand.courseTitle')} · ${BRAND.coursePeriod}`,
    wordmark: BRAND.wordmark,
    summaryTitle: t('ending.summaryTitle'),
    summaryRows,
    heroImage: './assets/images/ending/hero.webp',
    heroAlt: t('ending.heroAlt'),
  };
}
