/** Shared brand / course copy used across intro, map, ending, and export card. */
import { t } from '../i18n.js';

export const BRAND = Object.freeze({
  wordmark: 'BRADINGO',
  courseName: 'UOS LIFE',
  courseTitle: '병건이의 UOS LIFE',
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
    title: '병건이의 학교생활',
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
        question: '틀린 것을 고르시오',
        promptWord: '정병건',
        choices: Object.freeze([
          Object.freeze({
            id: 'jeong',
            label: '',
            image: './assets/images/quiz/n1-jeong.webp',
            alt: '정병건',
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
            alt: '정병건',
          }),
          Object.freeze({
            id: 'bradie',
            label: '',
            image: './assets/images/quiz/n1-bradie-real.webp',
            alt: '정병건',
          }),
        ]),
        correctChoiceIds: Object.freeze(['pong']),
        feedback: Object.freeze({
          correct: Object.freeze({
            title: '정답입니다!',
            body: '노란색 이미지는 정병건이 아니에요.',
          }),
          incorrect: Object.freeze({
            title: '오답입니다!',
            body: '틀린 것은 노란색 이미지예요.',
          }),
        }),
      }),
      Object.freeze({
        choiceType: 'single',
        layout: 'image',
        question: '병건이의 학교생활이 아닌 것은?',
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
            title: '정답입니다!',
            body: '병건이는 새벽 조깅과 아침 식사를 마친 뒤에도 1교시 수업을 성실하게 들었어요.',
          }),
          incorrect: Object.freeze({
            title: '오답입니다!',
            body: '병건이는 시카고 교환학생, 호주 워킹홀리데이, 제주도와 강원대학교 학점교류를 모두 경험했어요.',
          }),
        }),
      }),
      Object.freeze({
        choiceType: 'sentence',
        layout: 'listen',
        badge: '어려운 문제',
        badgeVariant: 'hard',
        question: '들은 내용을 탭하세요',
        characterImage: './assets/images/quiz/n2-character-full.png',
        characterAlt: '병건이 캐릭터',
        listenText: '병건아 졸업을 축하해',
        listenRate: 0.65,
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
      Object.freeze({
        choiceType: 'single',
        layout: 'image',
        badge: 'FOOD',
        question: '병건이가 먹어보지 못한 음식은?',
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
            label: '삶은고기(수육)',
            image: './assets/images/quiz/food-suyuk.webp',
            alt: '삶은고기(수육)',
          }),
        ]),
        correctChoiceIds: Object.freeze(['suyuk']),
        feedback: Object.freeze({
          correct: Object.freeze({
            title: '정답입니다!',
            body: '병건이는 아직 삶은고기(수육)를 먹어보지 못했어요.',
          }),
          incorrect: Object.freeze({
            title: '오답입니다!',
            body: '병건이가 먹어보지 못한 음식은 삶은고기(수육)이에요.',
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
    body: '캠퍼스에서 보낸 날들을 떠올리며 다음 스테이지로 넘어가 보세요.',
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
    subtitle: '함께한 순간들이 너무 소중해 💚',
    categories: Object.freeze([
      Object.freeze({ id: 'all', label: '전체' }),
      Object.freeze({ id: '2023', label: '2023' }),
      Object.freeze({ id: '2024', label: '2024' }),
      Object.freeze({ id: '2025', label: '2025~' }),
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
        alt: '창가에서 찍은 병건이',
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
        category: '2023',
      }),
      Object.freeze({
        id: 'memory-26',
        image: './assets/images/memory/26-photo.webp',
        alt: '트랙에서 찍은 단체 사진',
        caption: '트랙 단체',
        date: '2023',
        category: '2023',
      }),
      Object.freeze({
        id: 'memory-27',
        image: './assets/images/memory/27-photo.webp',
        alt: '트랙에서 주먹 인사',
        caption: '주먹 인사',
        date: '2023',
        category: '2023',
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
        alt: '주차장에서 음료 든 병건이',
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
        id: 'memory-33',
        image: './assets/images/memory/33-photo.webp',
        alt: '꽃무늬 조끼 입고 브이',
        caption: '꽃무늬 브이',
        date: '2025',
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
  subtitle: '카드를 넘겨 편지를 읽어보세요',
  friends: Object.freeze([
    Object.freeze({
      id: 'dabin',
      name: 'poponuna',
      initials: 'po',
      phone: '',
      email: '',
      group: 'Today',
      preview: '졸업을 축하합니다 병건씨🥳🎓🎊💐',
      letter:
        '졸업을 축하합니다 병건씨🥳🎓🎊💐\n뭔가 자네 졸업한다고 하니깐 이상해요\n계속 학교에 있어주세요 같은 나쁜말은 하면 안되겠지\n학교에서 만나서 덕분에 재밌었던 대학생활이었습니다\n띠듀 모임이 이렇게까지 이어지다니~~상상도 못했지 뭐야\n이젠 각자 다른 삶을 살고 더더욱 다양해지겠지만 가끔 자주 이렇게 모여주세요\n오랜만에 만나도 마치 어제 만난 사람들처럼 대화할 거 생각하니 재밌네요\n초등학교보다 오래 다닌 학교를 떠나 새롭게 시작할 앞으로의 삶을 응원합니다😆 from. 다빈',
      image: './assets/images/friends/dabin.png',
      alt: 'poponuna 프로필',
    }),
    Object.freeze({
      id: 'yaji',
      name: 'yazii',
      initials: 'ya',
      phone: '',
      email: '',
      group: 'Today',
      preview: '졸업 축하해, 병건! BRADINGO로 네 여정을 남겨봤어.',
      letter:
        '병건, 졸업 축하해!\n\n네 UOS LIFE를 따라가다 보니 웃음이 많이 나더라. 앞으로도 네 페이스로 잘 걸어가길 바랄게.\n\n언제든 연락해. 커피 한잔하자.',
      image: './assets/images/friends/yaji.png',
      alt: 'yazii 프로필',
    }),
    Object.freeze({
      id: 'yubinu',
      name: 'u.soap',
      initials: 'us',
      phone: '',
      email: '',
      group: 'Yesterday',
      preview: '빵건오빠 ~ 졸업을 축하해 ⁺◟( ᵒ̴̶̷̥́ ·̫ ᵒ̴̶̷̣̥̀ )',
      letter:
        '빵건오빠 ~ 졸업을 축하해 ⁺◟( ᵒ̴̶̷̥́ ·̫ ᵒ̴̶̷̣̥̀ )\n2023년, 트랙에서 만난 게 엊그제같은데 벌써 3년이라는 시간이 흘렀다니 !! 다같이 뛰고, 먹고, 공부하고, 놀러다니구 ㅋㅋㅋ 덕분에 너무 즐거운 대학생활을 했어 좋은 추억을 함께해줘서 고마워 ~  이거 읽을 때 쯤 졸업여행이 코앞이겠구나 !! 늘 용감히 떠나는 모습에 자극 참 많이 받아 ㅎㅎㅎ 담에 우리랑도 여행 또 가자자 ~ 즐거운 추억 많이 만들고 오길 바라고 또 여행하는 동안 안전하고 건강하길 (ง •̀ω•́)ง✧ !!\n\n- 유빈이가 -',
      image: './assets/images/friends/yubinu.png',
      alt: 'u.soap 프로필',
    }),
    Object.freeze({
      id: 'gaeuni',
      name: 'HGE',
      initials: 'HG',
      phone: '',
      email: '',
      group: 'Yesterday',
      preview: '병건오빠 졸업축하해~ 작년에 같이 캠퍼스를 누비며…',
      letter:
        'To 병건오빠\n\n병건오빠 졸업축하해~\n작년에 같이 캠퍼스를 누비며 자주 나온 대화거리가 "졸업식"이었는데 이렇게 그 날이 됐네 ㅎㅎㅎ 같이 수험생활을 하면서 정말 많이 의지됐고 덕분에 즐거웠어! 정말 행복했던 추억으로 남을 것 같아! 내가 요즘 연락을 잘 못했네..ㅜㅜ 우리 앞으로 종종 보면서 즐거운 추억 많이 쌓자!! 졸업 후 새로운 시작을 응원해!\n\n-가은-',
      image: './assets/images/friends/gaeuni.png',
      alt: 'HGE 프로필',
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

  const courseValue = `${completedCount} / ${totalNodes}`;

  /** @type {ReadonlyArray<{ id: string, label: string, value: string, valueHtml?: string, icon: string }>} */
  const summaryRows = [
    {
      id: 'period',
      label: t('ending.stat.period'),
      value: '2018 → 2026',
      icon: './assets/images/ending/icon-calendar.svg',
    },
    {
      id: 'courses',
      label: t('ending.stat.chapters'),
      value: courseValue,
      icon: './assets/images/ending/icon-book.svg',
    },
    {
      id: 'memories',
      label: t('ending.stat.memories'),
      value: t('ending.stat.memoriesValue'),
      valueHtml: `${t('ending.stat.memoriesValue')} <span class="ending-infinity">∞</span>`,
      icon: './assets/images/icons/heart.svg',
    },
  ];

  return {
    totalNodes,
    completedCount,
    title: 'BRADUATION COMPLETE!',
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
