/** @typedef {'ko' | 'en' | 'ja' | 'es'} LocaleId */

export const LOCALE_STORAGE_KEY = 'cutiebradie-graduation:locale';
export const DEFAULT_LOCALE = /** @type {LocaleId} */ ('ko');

/** @type {ReadonlyArray<LocaleId>} */
export const SUPPORTED_LOCALES = Object.freeze(['ko', 'en', 'ja', 'es']);

/** @type {LocaleId} */
let currentLocale = loadStoredLocale();

/**
 * @returns {LocaleId}
 */
function loadStoredLocale() {
  try {
    const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (raw && SUPPORTED_LOCALES.includes(/** @type {LocaleId} */ (raw))) {
      return /** @type {LocaleId} */ (raw);
    }
  } catch {
    // ignore
  }
  return DEFAULT_LOCALE;
}

/**
 * @returns {LocaleId}
 */
export function getLocale() {
  return currentLocale;
}

/**
 * @param {string} locale
 * @returns {locale is LocaleId}
 */
export function isLocaleId(locale) {
  return SUPPORTED_LOCALES.includes(/** @type {LocaleId} */ (locale));
}

/**
 * @param {LocaleId} locale
 */
export function setLocale(locale) {
  if (!isLocaleId(locale)) return;
  currentLocale = locale;
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // ignore
  }
  document.documentElement.lang = localeToHtmlLang(locale);
}

/**
 * @param {LocaleId} locale
 */
function localeToHtmlLang(locale) {
  if (locale === 'zh') return 'zh-CN';
  return locale;
}

/**
 * Apply stored locale to <html lang> on boot.
 */
export function applyDocumentLocale() {
  document.documentElement.lang = localeToHtmlLang(currentLocale);
}

/**
 * @param {string} key
 * @param {Record<string, string | number>} [vars]
 * @returns {string}
 */
export function t(key, vars) {
  return tFor(currentLocale, key, vars);
}

/**
 * Translate without changing the active locale (e.g. language picker preview).
 * @param {LocaleId | string} locale
 * @param {string} key
 * @param {Record<string, string | number>} [vars]
 * @returns {string}
 */
export function tFor(locale, key, vars) {
  const id = isLocaleId(locale) ? locale : DEFAULT_LOCALE;
  const table = MESSAGES[id] ?? MESSAGES.ko;
  let text = table[key] ?? MESSAGES.ko[key] ?? key;
  if (vars) {
    Object.entries(vars).forEach(([name, value]) => {
      text = text.replaceAll(`{${name}}`, String(value));
    });
  }
  return text;
}

/**
 * @template {Record<string, any>} T
 * @param {T} node
 * @returns {T}
 */
export function localizeNode(node) {
  const title = t(`node.${node.id}.title`);
  const typeLabel = t(`node.${node.id}.typeLabel`);
  const mapLabelRaw = t(`node.${node.id}.mapLabel`);
  const resolvedTitle = title.startsWith('node.') ? node.title : title;
  const mapLabel = mapLabelRaw.startsWith('node.') ? resolvedTitle : mapLabelRaw;
  return {
    ...node,
    title: resolvedTitle,
    mapLabel,
    typeLabel: typeLabel.startsWith('node.') ? node.typeLabel : typeLabel,
  };
}

/**
 * @param {import('./data/course.js').QuizItem} item
 * @param {string} nodeId
 * @param {number} [questionIndex]
 */
export function localizeQuizItem(item, nodeId, questionIndex = 0) {
  const prefix =
    nodeId === 'n1' ? `quiz.n1.q${questionIndex}` : `quiz.${nodeId}`;

  const question = pick(prefix, 'question', item.question);
  const instruction = item.instruction
    ? pick(prefix, 'instruction', item.instruction)
    : item.instruction;
  const badge = item.badge ? pick(prefix, 'badge', item.badge) : item.badge;
  const promptWord = item.promptWord
    ? pick(prefix, 'promptWord', item.promptWord)
    : item.promptWord;
  const characterAlt = item.characterAlt
    ? pick(prefix, 'characterAlt', item.characterAlt)
    : item.characterAlt;
  const listenText = item.listenText
    ? pick(prefix, 'listenText', item.listenText)
    : item.listenText;

  const tokens = item.tokens
    ? item.tokens.map((token) => ({
        ...token,
        label: pick(prefix, `token.${token.id}`, token.label),
      }))
    : item.tokens;

  const choices = item.choices
    ? item.choices.map((choice) => ({
        ...choice,
        label: choice.label
          ? pick(prefix, `choice.${choice.id}.label`, choice.label)
          : choice.label,
        alt: choice.alt ? pick(prefix, `choice.${choice.id}.alt`, choice.alt) : choice.alt,
      }))
    : item.choices;

  return {
    ...item,
    question,
    instruction,
    badge,
    promptWord,
    characterAlt,
    listenText,
    tokens,
    choices,
    feedback: {
      correct: {
        title: pick(prefix, 'feedback.correct.title', item.feedback.correct.title),
        body: pick(prefix, 'feedback.correct.body', item.feedback.correct.body),
      },
      incorrect: {
        title: pick(prefix, 'feedback.incorrect.title', item.feedback.incorrect.title),
        body: pick(prefix, 'feedback.incorrect.body', item.feedback.incorrect.body),
      },
    },
  };
}

/**
 * @param {string} prefix
 * @param {string} suffix
 * @param {string} fallback
 */
function pick(prefix, suffix, fallback) {
  const key = `${prefix}.${suffix}`;
  const value = t(key);
  return value === key ? fallback : value;
}

/** @type {Record<LocaleId, Record<string, string>>} */
const MESSAGES = {
  ko: {
    'lang.bubble': '어떤 언어로<br>진행할까요?',
    'lang.listAria': '언어 선택',
    'lang.continue': '계속',
    'lang.partialNote': '일부 추억과 친구 메시지는 원문으로 표시됩니다.',
    'lang.ko': '한국어',
    'lang.en': '영어',
    'lang.ja': '일본어',
    'lang.es': '스페인어',

    'intro.eggAria': '숨겨진 쿠폰',
    'intro.lead': '병건이의 <strong>{course}</strong>,<br>마지막 코스가 열렸어요. 🎓',
    'intro.start': '여정 시작하기',

    'map.coverAria': '{title} — 병건이에게 인사하기',
    'map.profileAlt': '병건이 프로필',

    'node.lockedBody': '이전 스테이지를 먼저 완료해 주세요.',
    'node.lockedAction': '잠김',
    'node.startAction': '시작하기',

    'node.n1.title': '시작',
    'node.n1.mapLabel': '시작',
    'node.n1.typeLabel': '퀴즈',
    'node.n2.title': '졸업 자격 심사',
    'node.n2.mapLabel': '자격 심사',
    'node.n2.typeLabel': '콘텐츠',
    'node.n3.title': '우리의 추억',
    'node.n3.mapLabel': '추억',
    'node.n4.title': '졸업축하 메시지',
    'node.n4.mapLabel': '메시지',
    'node.n4.typeLabel': '콘텐츠',
    'node.n3.typeLabel': '콘텐츠',
    'node.n5.title': '엔딩',
    'node.n5.mapLabel': '엔딩',
    'node.n5.typeLabel': '엔딩 · PNG',

    'gnb.aria': '주요 메뉴',
    'gnb.home': '홈',
    'gnb.friends': '피드',
    'gnb.timeline': '타임라인',

    'timeline.title': '타임라인',
    'timeline.friendsAria': '친구들',
    'timeline.bannerTitle': '🎓 병건이의 8년 여정',
    'timeline.bannerRange': '2018 — 2026',
    'timeline.listAria': '연도별 타임라인',
    'timeline.y2018.tag': '입학',
    'timeline.y2018.l1': '서울시립대학교 융합전공학부 18학번으로',
    'timeline.y2018.l2': '병건이의 UOS LIFE가 시작됐어요!',
    'timeline.y2019.tag': '적응기',
    'timeline.y2019.l1': '학교생활에 적응하며 친구들과',
    'timeline.y2019.l2': '추억을 쌓기 시작했어요!',
    'timeline.y2020.tag': '공군',
    'timeline.y2020.l1': '공군에 입대해',
    'timeline.y2020.l2': '또 다른 성장의 시간을 보냈어요!',
    'timeline.y2021.tag': '복학생 모드',
    'timeline.y2021.l1': '다시 학교로 돌아와',
    'timeline.y2021.l2': 'UOS LIFE 시즌 2 시작!',
    'timeline.y2022.tag': '도전',
    'timeline.y2022.l1': '캠퍼스를 넘어 새로운 경험으로',
    'timeline.y2022.l2': '한 걸음 더 나아갔어요.',
    'timeline.y2023.tag': '친구',
    'timeline.y2023.l1': '트랙에서 만난 친구들과',
    'timeline.y2023.l2': '함께하는 시간이 늘어났어요.',
    'timeline.y2024.tag': '추억',
    'timeline.y2024.l1': '사진 속에 남은 순간들이',
    'timeline.y2024.l2': '하나씩 쌓여 갔어요.',
    'timeline.y2025.tag': '준비',
    'timeline.y2025.l1': '졸업을 향해',
    'timeline.y2025.l2': '마지막 학기를 달려왔어요.',
    'timeline.y2026.tag': '졸업',
    'timeline.y2026.l1': '드디어 도착한 졸업의 해!',
    'timeline.y2026.l2': 'UOS LIFE, 완주 완료.',

    'review.progress': '🎓 졸업 여정 2/5',
    'review.title': '졸업 자격 심사',
    'review.desc': '병건이가 정말 졸업할 준비가 되었는지 확인합니다',
    'review.listAria': '심사 항목',
    'review.item.survive': '8년 생존력',
    'review.item.adapt': '타지 적응력',
    'review.item.friends': '친구 만들기',
    'review.item.will': '졸업 의지',
    'review.measuring': '측정중...',
    'review.pass': 'PASS',
    'review.resultLabel': '심사 결과:',
    'review.resultTitle': '졸업시켜도 될 것 같습니다.',
    'review.resultBody': '졸업 속도는 조금 느렸지만 결과는 완벽!',
    'review.approve': '💗 졸업 승인 받기',

    'header.aria': '학습 현황',
    'header.streakAria': '연속 재학 {streak}일',
    'header.streakBadge': '연속 재학',
    'header.streakTitle': '{streak}일 연속 재학',
    'header.streakDesc': '병건이는 입학부터 졸업까지 하루도 쉬지 않았어요!',
    'header.friendsAria': '친구',
    'header.friendsTitle': '친구',
    'header.friendsDesc': '친구가 참 많아요.',
    'header.week': '일,월,화,수,목,금,토',
    'header.travelAria': '다녀온 나라 {count}개국',
    'header.travelTitle': '여행',
    'header.travelDesc': '병건이는 학교 생활동안 여러 국가들을 다녀왔어요.',

    'quiz.close': '닫기',
    'quiz.closeProgress': '문제 닫기',
    'quiz.progress': '진행도',
    'quiz.check': '확인',
    'quiz.continue': '계속',
    'quiz.retry': '다시 선택하기',
    'quiz.retrySentence': '다시 시도하기',
    'quiz.exitTitle': '문제를 그만둘까요?',
    'quiz.exitBody': '선택한 답은 저장되지 않아요.',
    'quiz.exitCancel': '계속 풀기',
    'quiz.exitConfirm': '맵으로 나가기',
    'quiz.playListen': '들은 내용 재생',
    'quiz.playSlow': '느린 속도로 재생',
    'quiz.selectedWords': '선택한 단어',
    'quiz.correct': '정답입니다!',
    'quiz.incorrect': '오답입니다!',

    'quiz.n1.q0.question': '틀린 것을 고르시오',
    'quiz.n1.q0.promptWord': '정병건',
    'quiz.n1.q0.choice.jeong.alt': '정병건',
    'quiz.n1.q0.choice.pong.alt': '뽕꼬니',
    'quiz.n1.q0.choice.bbang.alt': '정병건',
    'quiz.n1.q0.choice.bradie.alt': '정병건',
    'quiz.n1.q0.feedback.correct.title': '정답입니다!',
    'quiz.n1.q0.feedback.correct.body': '노란색 이미지는 정병건이 아니에요.',
    'quiz.n1.q0.feedback.incorrect.title': '오답입니다!',
    'quiz.n1.q0.feedback.incorrect.body': '틀린 것은 노란색 이미지예요.',

    'quiz.n1.q1.question': '병건이의 학교생활이 아닌 것은?',
    'quiz.n1.q1.choice.chicago.label': '시카고 교환학생',
    'quiz.n1.q1.choice.chicago.alt': '시카고 교환학생',
    'quiz.n1.q1.choice.australia.label': '호주 워홀 1년',
    'quiz.n1.q1.choice.australia.alt': '호주 워홀 1년',
    'quiz.n1.q1.choice.jeju.label': '제주도/강원대 학점교류',
    'quiz.n1.q1.choice.jeju.alt': '제주도/강원대 학점교류',
    'quiz.n1.q1.choice.skip.label': '1교시 지각',
    'quiz.n1.q1.choice.skip.alt': '1교시 지각',
    'quiz.n1.q1.feedback.correct.title': '정답입니다!',
    'quiz.n1.q1.feedback.correct.body':
      '병건이는 새벽 조깅과 아침 식사를 마친 뒤에도 1교시 수업을 성실하게 들었어요.',
    'quiz.n1.q1.feedback.incorrect.title': '오답입니다!',
    'quiz.n1.q1.feedback.incorrect.body':
      '병건이는 시카고 교환학생, 호주 워킹홀리데이, 제주도와 강원대학교 학점교류를 모두 경험했어요.',

    'quiz.n1.q2.badge': '어려운 문제',
    'quiz.n1.q2.question': '들은 내용을 탭하세요',
    'quiz.n1.q2.characterAlt': '병건이 캐릭터',
    'quiz.n1.q2.listenText': '병건아 졸업을 축하해',
    'quiz.n1.q2.token.byeong': '병건아',
    'quiz.n1.q2.token.jol': '졸업을',
    'quiz.n1.q2.token.chuk': '축하해',
    'quiz.n1.q2.token.ip': '입학을',
    'quiz.n1.q2.token.grad': '대학원',
    'quiz.n1.q2.token.an': '안',
    'quiz.n1.q2.token.cham': '참',
    'quiz.n1.q2.feedback.correct.title': '정답입니다!',
    'quiz.n1.q2.feedback.correct.body': '병건아, 졸업을 축하해!',
    'quiz.n1.q2.feedback.incorrect.title': '오답입니다!',
    'quiz.n1.q2.feedback.incorrect.body': '정답은 「병건아 졸업을 축하해」예요.',

    'quiz.n1.q3.badge': 'FOOD',
    'quiz.n1.q3.question': '병건이가 먹어보지 못한 음식은?',
    'quiz.n1.q3.choice.tempt.label': '템트',
    'quiz.n1.q3.choice.tempt.alt': '템트',
    'quiz.n1.q3.choice.katsudon.label': '학관 가츠동',
    'quiz.n1.q3.choice.katsudon.alt': '학관 가츠동',
    'quiz.n1.q3.choice.shanghai.label': '아느칸 상하이 스파게티',
    'quiz.n1.q3.choice.shanghai.alt': '아느칸 상하이 스파게티',
    'quiz.n1.q3.choice.suyuk.label': '삶은고기(수육)',
    'quiz.n1.q3.choice.suyuk.alt': '삶은고기(수육)',
    'quiz.n1.q3.feedback.correct.title': '정답입니다!',
    'quiz.n1.q3.feedback.correct.body': '병건이는 아직 삶은고기(수육)를 먹어보지 못했어요.',
    'quiz.n1.q3.feedback.incorrect.title': '오답입니다!',
    'quiz.n1.q3.feedback.incorrect.body': '병건이가 먹어보지 못한 음식은 삶은고기(수육)이에요.',


    'chapter.complete': '계속하기',
    'chapter.backToMap': '맵으로 돌아가기',
    'chapter.n2.body': '캠퍼스에서 보낸 날들을 떠올리며 다음 스테이지로 넘어가 보세요.',
    'chapter.n2.highlightsAria': '학교생활 하이라이트',
    'chapter.n2.chicago': '시카고 교환학생',
    'chapter.n2.australia': '호주 워홀 1년',
    'chapter.n2.jeju': '제주·강원대 학점교류',

    'memory.title': '우리의 추억',
    'memory.subtitle': '함께한 순간들이 너무 소중해 💚',
    'memory.filtersAria': '연도별 추억',
    'memory.backAria': '맵으로 돌아가기',
    'memory.cat.all': '전체',
    'memory.cat.2023': '2023',
    'memory.cat.2024': '2024',
    'memory.cat.2025': '2025~',
    'memory.cat.running': '달리기',
    'memory.cat.morning': '아침',
    'memory.cat.travel': '나들이',
    'memory.cat.school': '학교',
    'memory.cat.diary': '일상',
    'memory.cat.meme': '밈',
    'memory.hint': '사진을 둘러보면 완료할 수 있어요',
    'memory.empty': '이 연도의 추억이 아직 없어요.',
    'memory.complete': '추억 감상 완료',

    'friends.title': '졸업축하 메시지',
    'friends.subtitle': '카드를 넘겨 편지를 읽어보세요',
    'friends.profilesAria': '친구 프로필',
    'friends.creatorAria': '만든 사람 응원하기',
    'friends.complete': '편지 읽기 완료',

    'feed.lockedTitle': '피드는 아직 잠겨 있어요',
    'feed.lockedBody': '졸업축하 메시지는 조금만 더 진행하면 열려요!',
    'feed.lockedCancel': '닫기',
    'feed.lockedAction': '알겠어요',

    'bubble.1': '안녕, 난 병건이야!',
    'bubble.2': '졸업 축하해줘서 고마워! 🎓',

    'brand.courseTitle': '병건이의 UOS LIFE',

    'ending.stageLabel': 'FINAL STAGE',
    'ending.lead': '병건아, 진짜 졸업이다! 🎓',
    'ending.tagline': '2018년부터 2026년까지, 길고 길었던 UOS LIFE 완주 완료.',
    'ending.congrats': '서울시립대 도시공학과 학사과정을 마치신 것을 축하합니다!',
    'ending.heroAlt': '졸업가운을 입고 기뻐하는 병건이',
    'ending.summaryTitle': '여정 요약',
    'ending.stat.period': '여정 기간',
    'ending.stat.stages': '완료한 스테이지',
    'ending.stat.uosLife': 'UOS LIFE',
    'ending.stat.chapters': '완료한 챕터',
    'ending.stat.memories': '함께한 추억',
    'ending.stat.memoriesValue': '15장',
    'ending.stat.letters': '도착한 편지',
    'ending.stat.lettersValue': '4통',
    'ending.cheerTitle': '병건아 축하해! 💚',
    'ending.cheerCta': '💚 하트 남기기',
    'ending.cheerHint': '졸업을 축하하는 마음을 눌러주세요',
    'ending.cheerToast': '축하 마음을 남겼어요 💚',
    'ending.saveCta': '졸업 카드 저장하기',
    'ending.saveHint': '1080 × 1920 PNG로 저장돼요',
    'ending.saveRetry': '다시 시도',
    'ending.savePreparing': '이미지 준비 중',
    'ending.savePreparingMsg': '이미지를 준비하고 있어요',
    'ending.saveReady': '이미지가 준비됐어요',
    'ending.saveLongPress': '이미지를 길게 눌러 저장해 주세요',
    'ending.saveFail': '이미지를 만들지 못했어요',
    'ending.eggAria': '숨겨진 쿠폰',
    'ending.saveAria': '졸업 카드 저장하기',
    'ending.resetTitle': '정말 처음부터 시작할까요?',
    'ending.resetBody': '지금까지의 진행 기록이 모두 지워져요.',
    'ending.resetCancel': '취소',
    'ending.resetConfirm': '처음부터 다시',
  },

  en: {
    'lang.bubble': 'Which language<br>would you like?',
    'lang.listAria': 'Language selection',
    'lang.continue': 'Continue',
    'lang.ko': 'Korean',
    'lang.en': 'English',
    'lang.ja': 'Japanese',
    'lang.es': 'Spanish',

    'intro.eggAria': 'Hidden coupon',
    'intro.lead': "Bradie's <strong>{course}</strong>,<br>the final course is open. 🎓",
    'intro.start': 'Start the journey',

    'map.coverAria': '{title} — say hi to Byeonggeon',
    'map.profileAlt': 'Byeonggeon profile',

    'node.lockedBody': 'Finish the previous stage first.',
    'node.lockedAction': 'Locked',
    'node.startAction': 'Start',

    'node.n1.title': 'Start',
    'node.n1.mapLabel': 'Start',
    'node.n1.typeLabel': 'Quiz',
    'node.n2.title': 'Graduation review',
    'node.n2.mapLabel': 'Check',
    'node.n2.typeLabel': 'Content',
    'node.n3.title': 'Our memories',
    'node.n3.mapLabel': 'Memories',
    'node.n4.title': 'Graduation messages',
    'node.n4.mapLabel': 'Messages',
    'node.n4.typeLabel': 'Content',
    'node.n3.typeLabel': 'Content',
    'node.n5.title': 'Ending',
    'node.n5.mapLabel': 'Ending',
    'node.n5.typeLabel': 'Ending · PNG',

    'gnb.aria': 'Main menu',
    'gnb.home': 'Home',
    'gnb.friends': 'Feed',
    'gnb.timeline': 'Timeline',

    'timeline.title': 'Timeline',
    'timeline.friendsAria': 'Friends',
    'timeline.bannerTitle': "🎓 Byeonggeon's 8-year journey",
    'timeline.bannerRange': '2018 — 2026',
    'timeline.listAria': 'Year-by-year timeline',
    'timeline.y2018.tag': 'Enrollment',
    'timeline.y2018.l1': 'UOS Interdisciplinary Studies, class of ’18 —',
    'timeline.y2018.l2': 'Byeonggeon’s UOS LIFE begins!',
    'timeline.y2019.tag': 'Settling in',
    'timeline.y2019.l1': 'Finding a rhythm on campus',
    'timeline.y2019.l2': 'and making memories with friends!',
    'timeline.y2020.tag': 'Air Force',
    'timeline.y2020.l1': 'Serving in the Air Force —',
    'timeline.y2020.l2': 'another season of growth!',
    'timeline.y2021.tag': 'Back to campus',
    'timeline.y2021.l1': 'Returning to school —',
    'timeline.y2021.l2': 'UOS LIFE season 2!',
    'timeline.y2022.tag': 'Challenge',
    'timeline.y2022.l1': 'Stepping beyond campus',
    'timeline.y2022.l2': 'into new experiences.',
    'timeline.y2023.tag': 'Friends',
    'timeline.y2023.l1': 'Friends met on the track —',
    'timeline.y2023.l2': 'more time spent together.',
    'timeline.y2024.tag': 'Memories',
    'timeline.y2024.l1': 'Moments captured in photos',
    'timeline.y2024.l2': 'kept stacking up.',
    'timeline.y2025.tag': 'Prep',
    'timeline.y2025.l1': 'Toward graduation —',
    'timeline.y2025.l2': 'the final stretch.',
    'timeline.y2026.tag': 'Graduate',
    'timeline.y2026.l1': 'Graduation year at last!',
    'timeline.y2026.l2': 'UOS LIFE — complete.',

    'review.progress': '🎓 Graduation path 2/5',
    'review.title': 'Graduation review',
    'review.desc': 'Checking if Byeonggeon is really ready to graduate',
    'review.listAria': 'Review checklist',
    'review.item.survive': '8-year survival',
    'review.item.adapt': 'Adaptability abroad',
    'review.item.friends': 'Making friends',
    'review.item.will': 'Will to graduate',
    'review.measuring': 'Measuring…',
    'review.pass': 'PASS',
    'review.resultLabel': 'Result:',
    'review.resultTitle': 'Looks good to graduate.',
    'review.resultBody': 'A little slow — but a perfect finish!',
    'review.approve': '💗 Approve graduation',

    'header.aria': 'Learning status',
    'header.streakAria': '{streak} days enrolled',
    'header.streakBadge': 'Continuous enrollment',
    'header.streakTitle': '{streak} days enrolled',
    'header.streakDesc': 'Bradie never missed a day from enrollment to graduation!',
    'header.friendsAria': 'Friends',
    'header.friendsTitle': 'Friends',
    'header.friendsDesc': 'So many friends.',
    'header.week': 'S,M,T,W,T,F,S',
    'header.travelAria': '{count} countries visited',
    'header.travelTitle': 'Travel',
    'header.travelDesc': 'During school life, Byeonggeon visited many countries.',

    'quiz.close': 'Close',
    'quiz.closeProgress': 'Close quiz',
    'quiz.progress': 'Progress',
    'quiz.check': 'Check',
    'quiz.continue': 'Continue',
    'quiz.retry': 'Try again',
    'quiz.retrySentence': 'Try again',
    'quiz.exitTitle': 'Leave this quiz?',
    'quiz.exitBody': 'Your answers will not be saved.',
    'quiz.exitCancel': 'Keep going',
    'quiz.exitConfirm': 'Back to map',
    'quiz.playListen': 'Play audio',
    'quiz.playSlow': 'Play slowly',
    'quiz.selectedWords': 'Selected words',
    'quiz.correct': 'Correct!',
    'quiz.incorrect': 'Incorrect!',

    'quiz.n1.q0.question': 'Choose the incorrect one',
    'quiz.n1.q0.promptWord': 'Jeong Byeonggeon',
    'quiz.n1.q0.choice.jeong.alt': 'Jeong Byeonggeon',
    'quiz.n1.q0.choice.pong.alt': 'Pongkkoni',
    'quiz.n1.q0.choice.bbang.alt': 'Jeong Byeonggeon',
    'quiz.n1.q0.choice.bradie.alt': 'Jeong Byeonggeon',
    'quiz.n1.q0.feedback.correct.title': 'Correct!',
    'quiz.n1.q0.feedback.correct.body': 'The yellow image is not Jeong Byeonggeon.',
    'quiz.n1.q0.feedback.incorrect.title': 'Incorrect!',
    'quiz.n1.q0.feedback.incorrect.body': 'The incorrect one is the yellow image.',

    'quiz.n1.q1.question': "Which is NOT part of Byeonggeon's school life?",
    'quiz.n1.q1.choice.chicago.label': 'Chicago exchange',
    'quiz.n1.q1.choice.chicago.alt': 'Chicago exchange',
    'quiz.n1.q1.choice.australia.label': '1-year Australia WH',
    'quiz.n1.q1.choice.australia.alt': '1-year Australia WH',
    'quiz.n1.q1.choice.jeju.label': 'Jeju / Kangwon credit exchange',
    'quiz.n1.q1.choice.jeju.alt': 'Jeju / Kangwon credit exchange',
    'quiz.n1.q1.choice.skip.label': 'Late to 1st period',
    'quiz.n1.q1.choice.skip.alt': 'Late to 1st period',
    'quiz.n1.q1.feedback.correct.title': 'Correct!',
    'quiz.n1.q1.feedback.correct.body':
      'Even after early jogging and breakfast, Byeonggeon still attended 1st period faithfully.',
    'quiz.n1.q1.feedback.incorrect.title': 'Incorrect!',
    'quiz.n1.q1.feedback.incorrect.body':
      'Byeonggeon did Chicago exchange, an Australia working holiday, and Jeju / Kangwon credit exchange.',

    'quiz.n1.q2.badge': 'Hard exercise',
    'quiz.n1.q2.question': 'Tap what you hear',
    'quiz.n1.q2.characterAlt': 'Byeonggeon character',
    'quiz.n1.q2.listenText': 'Byeonggeon, congrats on graduating',
    'quiz.n1.q2.token.byeong': 'Byeonggeon,',
    'quiz.n1.q2.token.jol': 'congrats on',
    'quiz.n1.q2.token.chuk': 'graduating',
    'quiz.n1.q2.token.ip': 'enrolling',
    'quiz.n1.q2.token.grad': 'grad school',
    'quiz.n1.q2.token.an': 'not',
    'quiz.n1.q2.token.cham': 'really',
    'quiz.n1.q2.feedback.correct.title': 'Correct!',
    'quiz.n1.q2.feedback.correct.body': 'Byeonggeon, congrats on graduating!',
    'quiz.n1.q2.feedback.incorrect.title': 'Incorrect!',
    'quiz.n1.q2.feedback.incorrect.body': 'The answer is “Byeonggeon, congrats on graduating”.',

    'quiz.n1.q3.badge': 'FOOD',
    'quiz.n1.q3.question': 'Which food has Byeonggeon never tried?',
    'quiz.n1.q3.choice.tempt.label': 'Tempt',
    'quiz.n1.q3.choice.tempt.alt': 'Tempt',
    'quiz.n1.q3.choice.katsudon.label': 'Cafeteria katsudon',
    'quiz.n1.q3.choice.katsudon.alt': 'Cafeteria katsudon',
    'quiz.n1.q3.choice.shanghai.label': 'Anukan Shanghai spaghetti',
    'quiz.n1.q3.choice.shanghai.alt': 'Anukan Shanghai spaghetti',
    'quiz.n1.q3.choice.suyuk.label': 'Boiled pork (suyuk)',
    'quiz.n1.q3.choice.suyuk.alt': 'Boiled pork (suyuk)',
    'quiz.n1.q3.feedback.correct.title': 'Correct!',
    'quiz.n1.q3.feedback.correct.body': 'Byeonggeon still hasn’t tried boiled pork (suyuk).',
    'quiz.n1.q3.feedback.incorrect.title': 'Incorrect!',
    'quiz.n1.q3.feedback.incorrect.body': 'The food Byeonggeon hasn’t tried is boiled pork (suyuk).',


    'chapter.complete': 'Continue',
    'chapter.backToMap': 'Back to map',
    'chapter.n2.body': 'Recall the campus days, then move on to the next stage.',
    'chapter.n2.highlightsAria': 'Campus highlights',
    'chapter.n2.chicago': 'Chicago exchange',
    'chapter.n2.australia': 'Australia working holiday',
    'chapter.n2.jeju': 'Jeju · Kangwon credit exchange',

    'memory.title': 'Our memories',
    'memory.subtitle': 'These moments mean so much 💚',
    'memory.filtersAria': 'Memories by year',
    'memory.backAria': 'Back to map',
    'memory.cat.all': 'All',
    'memory.cat.2023': '2023',
    'memory.cat.2024': '2024',
    'memory.cat.2025': '2025~',
    'memory.cat.running': 'Running',
    'memory.cat.morning': 'Morning',
    'memory.cat.travel': 'Outings',
    'memory.cat.school': 'School',
    'memory.cat.diary': 'Everyday',
    'memory.cat.meme': 'Meme',
    'memory.hint': 'Browse the photos to finish',
    'memory.empty': 'No memories for this year yet.',
    'memory.complete': 'Finish memories',

    'friends.title': 'Graduation messages',
    'friends.subtitle': 'Swipe the cards to read letters',
    'friends.profilesAria': 'Friend profiles',
    'friends.creatorAria': 'Support the creator',
    'friends.complete': 'Finish reading letters',

    'feed.lockedTitle': 'Feed is still locked',
    'feed.lockedBody': 'Graduation messages open after a bit more progress!',
    'feed.lockedCancel': 'Close',
    'feed.lockedAction': 'Got it',

    'lang.partialNote': 'Some memories and friend messages stay in the original language.',

    'bubble.1': "Hi, I'm Byeonggeon!",
    'bubble.2': 'Thanks for celebrating my graduation! 🎓',

    'brand.courseTitle': "Bradie's UOS Life",

    'ending.stageLabel': 'FINAL STAGE',
    'ending.lead': 'Byeonggeon, you really graduated! 🎓',
    'ending.tagline': 'From 2018 to 2026 — UOS LIFE complete.',
    'ending.congrats': 'Congratulations on completing your bachelor’s in Urban Planning at the University of Seoul!',
    'ending.heroAlt': 'Bradie celebrating in a graduation gown',
    'ending.summaryTitle': 'Journey summary',
    'ending.stat.period': 'Journey years',
    'ending.stat.stages': 'Stages cleared',
    'ending.stat.uosLife': 'UOS LIFE',
    'ending.stat.chapters': 'Chapters cleared',
    'ending.stat.memories': 'Shared memories',
    'ending.stat.memoriesValue': '15',
    'ending.stat.letters': 'Letters received',
    'ending.stat.lettersValue': '4',
    'ending.cheerTitle': 'Congrats, Byeonggeon! 💚',
    'ending.cheerCta': '💚 Leave a heart',
    'ending.cheerHint': 'Tap to send your congratulations',
    'ending.cheerToast': 'You left a cheer 💚',
    'ending.saveCta': 'Save graduation card',
    'ending.saveHint': 'Saves as 1080 × 1920 PNG',
    'ending.saveRetry': 'Try again',
    'ending.savePreparing': 'Preparing image',
    'ending.savePreparingMsg': 'Preparing your image…',
    'ending.saveReady': 'Image is ready',
    'ending.saveLongPress': 'Long-press the image to save',
    'ending.saveFail': 'Could not create the image',
    'ending.eggAria': 'Hidden coupon',
    'ending.saveAria': 'Save graduation card',
    'ending.resetTitle': 'Start over from the beginning?',
    'ending.resetBody': 'All progress on this device will be cleared.',
    'ending.resetCancel': 'Cancel',
    'ending.resetConfirm': 'Start over',
  },

  ja: {
    'lang.bubble': 'どの言語で<br>進めますか？',
    'lang.listAria': '言語選択',
    'lang.continue': 'つづける',
    'lang.ko': '韓国語',
    'lang.en': '英語',
    'lang.ja': '日本語',
    'lang.es': 'スペイン語',

    'intro.eggAria': '隠しクーポン',
    'intro.lead': "Bradie's <strong>{course}</strong>、<br>最後のコースが開きました。🎓",
    'intro.start': '旅をはじめる',

    'map.coverAria': '{title} — ビョンゴンに挨拶',
    'map.profileAlt': 'ビョンゴンのプロフィール',

    'node.lockedBody': '先に前のステージをクリアしてください。',
    'node.lockedAction': 'ロック中',
    'node.startAction': 'はじめる',

    'node.n1.title': 'スタート',
    'node.n1.mapLabel': 'スタート',
    'node.n1.typeLabel': 'クイズ',
    'node.n2.title': '卒業資格審査',
    'node.n2.mapLabel': '資格審査',
    'node.n2.typeLabel': 'コンテンツ',
    'node.n3.title': 'わたしたちの思い出',
    'node.n3.mapLabel': '思い出',
    'node.n4.title': '卒業お祝いメッセージ',
    'node.n4.mapLabel': 'メッセージ',
    'node.n4.typeLabel': 'コンテンツ',
    'node.n3.typeLabel': 'コンテンツ',
    'node.n5.title': 'エンディング',
    'node.n5.mapLabel': 'エンディング',
    'node.n5.typeLabel': 'エンディング · PNG',

    'gnb.aria': 'メインメニュー',
    'gnb.home': 'ホーム',
    'gnb.friends': 'フィード',
    'gnb.timeline': 'タイムライン',

    'timeline.title': 'タイムライン',
    'timeline.friendsAria': '友だち',
    'timeline.bannerTitle': '🎓 ビョンゴンの8年の旅',
    'timeline.bannerRange': '2018 — 2026',
    'timeline.listAria': '年ごとのタイムライン',
    'timeline.y2018.tag': '入学',
    'timeline.y2018.l1': 'ソウル市立大 融合専攻学部 18期として',
    'timeline.y2018.l2': 'UOS LIFEがスタート！',
    'timeline.y2019.tag': '適応期',
    'timeline.y2019.l1': 'キャンパスに慣れながら友だちと',
    'timeline.y2019.l2': '思い出を積み重ね始めました！',
    'timeline.y2020.tag': '空軍',
    'timeline.y2020.l1': '空軍に入隊し',
    'timeline.y2020.l2': 'また別の成長の時間を過ごしました！',
    'timeline.y2021.tag': '復学モード',
    'timeline.y2021.l1': '再びキャンパスへ戻り',
    'timeline.y2021.l2': 'UOS LIFE シーズン2 スタート！',
    'timeline.y2022.tag': '挑戦',
    'timeline.y2022.l1': 'キャンパスを越えた新しい経験へ',
    'timeline.y2022.l2': 'もう一歩進みました。',
    'timeline.y2023.tag': '友だち',
    'timeline.y2023.l1': 'トラックで出会った友だちと',
    'timeline.y2023.l2': '一緒の時間が増えていきました。',
    'timeline.y2024.tag': '思い出',
    'timeline.y2024.l1': '写真に残った瞬間が',
    'timeline.y2024.l2': '少しずつ積み重なっていきました。',
    'timeline.y2025.tag': '準備',
    'timeline.y2025.l1': '卒業に向かって',
    'timeline.y2025.l2': '最後の学期を走り抜けました。',
    'timeline.y2026.tag': '卒業',
    'timeline.y2026.l1': 'ついに卒業の年！',
    'timeline.y2026.l2': 'UOS LIFE、完走完了。',

    'review.progress': '🎓 卒業の旅 2/5',
    'review.title': '卒業資格審査',
    'review.desc': 'ビョンゴンが本当に卒業できるか確認します',
    'review.listAria': '審査項目',
    'review.item.survive': '8年サバイバル',
    'review.item.adapt': '他地適応力',
    'review.item.friends': '友だちづくり',
    'review.item.will': '卒業の意志',
    'review.measuring': '測定中…',
    'review.pass': 'PASS',
    'review.resultLabel': '審査結果:',
    'review.resultTitle': '卒業させてよさそうです。',
    'review.resultBody': 'スピードは少し遅めでも、結果はパーフェクト！',
    'review.approve': '💗 卒業を承認する',

    'header.aria': '学習状況',
    'header.streakAria': '連続在学 {streak}日',
    'header.streakBadge': '連続在学',
    'header.streakTitle': '{streak}日連続在学',
    'header.streakDesc': 'ビョンゴンは入学から卒業まで一日も休みませんでした！',
    'header.friendsAria': '友達',
    'header.friendsTitle': '友達',
    'header.friendsDesc': '友達がとっても多いです。',
    'header.week': '日,月,火,水,木,金,土',
    'header.travelAria': '訪れた国 {count}か国',
    'header.travelTitle': '旅行',
    'header.travelDesc': 'ビョンゴンは学校生活のあいだ、いろいろな国を訪れました。',

    'quiz.close': '閉じる',
    'quiz.closeProgress': '問題を閉じる',
    'quiz.progress': '進捗',
    'quiz.check': '確認',
    'quiz.continue': 'つづける',
    'quiz.retry': '選びなおす',
    'quiz.retrySentence': 'もう一度',
    'quiz.exitTitle': '問題をやめますか？',
    'quiz.exitBody': '選んだ答えは保存されません。',
    'quiz.exitCancel': 'つづける',
    'quiz.exitConfirm': 'マップへ戻る',
    'quiz.playListen': '音声を再生',
    'quiz.playSlow': 'ゆっくり再生',
    'quiz.selectedWords': '選んだ単語',
    'quiz.correct': '正解です！',
    'quiz.incorrect': '不正解です！',

    'quiz.n1.q0.question': '間違っているものを選んでください',
    'quiz.n1.q0.promptWord': 'チョン・ビョンゴン',
    'quiz.n1.q0.choice.jeong.alt': 'チョン・ビョンゴン',
    'quiz.n1.q0.choice.pong.alt': 'ポンッコニ',
    'quiz.n1.q0.choice.bbang.alt': 'チョン・ビョンゴン',
    'quiz.n1.q0.choice.bradie.alt': 'チョン・ビョンゴン',
    'quiz.n1.q0.feedback.correct.title': '正解です！',
    'quiz.n1.q0.feedback.correct.body': '黄色い画像はビョンゴンではありません。',
    'quiz.n1.q0.feedback.incorrect.title': '不正解です！',
    'quiz.n1.q0.feedback.incorrect.body': '間違っているのは黄色い画像です。',

    'quiz.n1.q1.question': 'ビョンゴンの学校生活でないものは？',
    'quiz.n1.q1.choice.chicago.label': 'シカゴ交換留学',
    'quiz.n1.q1.choice.chicago.alt': 'シカゴ交換留学',
    'quiz.n1.q1.choice.australia.label': 'オーストラリアWH1年',
    'quiz.n1.q1.choice.australia.alt': 'オーストラリアWH1年',
    'quiz.n1.q1.choice.jeju.label': '済州／江原大単位交流',
    'quiz.n1.q1.choice.jeju.alt': '済州／江原大単位交流',
    'quiz.n1.q1.choice.skip.label': '1限遅刻',
    'quiz.n1.q1.choice.skip.alt': '1限遅刻',
    'quiz.n1.q1.feedback.correct.title': '正解です！',
    'quiz.n1.q1.feedback.correct.body':
      'ビョンゴンは早朝ジョギングと朝食のあとでも、1限の授業をきちんと受けていました。',
    'quiz.n1.q1.feedback.incorrect.title': '不正解です！',
    'quiz.n1.q1.feedback.incorrect.body':
      'ビョンゴンはシカゴ交換留学、オーストラリアのワーキングホリデー、済州と江原大学の単位交流をすべて経験しました。',

    'quiz.n1.q2.badge': 'むずかしい問題',
    'quiz.n1.q2.question': '聞いた内容をタップしてください',
    'quiz.n1.q2.characterAlt': 'ビョンゴンキャラクター',
    'quiz.n1.q2.listenText': 'ビョンゴン 卒業おめでとう',
    'quiz.n1.q2.token.byeong': 'ビョンゴン',
    'quiz.n1.q2.token.jol': '卒業',
    'quiz.n1.q2.token.chuk': 'おめでとう',
    'quiz.n1.q2.token.ip': '入学を',
    'quiz.n1.q2.token.grad': '大学院',
    'quiz.n1.q2.token.an': 'しない',
    'quiz.n1.q2.token.cham': 'ほんと',
    'quiz.n1.q2.feedback.correct.title': '正解です！',
    'quiz.n1.q2.feedback.correct.body': 'ビョンゴン、卒業おめでとう！',
    'quiz.n1.q2.feedback.incorrect.title': '不正解です！',
    'quiz.n1.q2.feedback.incorrect.body': '正解は「ビョンゴン 卒業おめでとう」です。',

    'quiz.n1.q3.badge': 'FOOD',
    'quiz.n1.q3.question': 'ビョンゴンがまだ食べたことのない食べ物は？',
    'quiz.n1.q3.choice.tempt.label': 'テンプト',
    'quiz.n1.q3.choice.tempt.alt': 'テンプト',
    'quiz.n1.q3.choice.katsudon.label': '学食カツ丼',
    'quiz.n1.q3.choice.katsudon.alt': '学食カツ丼',
    'quiz.n1.q3.choice.shanghai.label': 'アヌカン上海スパゲティ',
    'quiz.n1.q3.choice.shanghai.alt': 'アヌカン上海スパゲティ',
    'quiz.n1.q3.choice.suyuk.label': 'ゆで肉（スユク）',
    'quiz.n1.q3.choice.suyuk.alt': 'ゆで肉（スユク）',
    'quiz.n1.q3.feedback.correct.title': '正解です！',
    'quiz.n1.q3.feedback.correct.body': 'ビョンゴンはまだゆで肉（スユク）を食べたことがありません。',
    'quiz.n1.q3.feedback.incorrect.title': '不正解です！',
    'quiz.n1.q3.feedback.incorrect.body': 'ビョンゴンが食べたことのない食べ物はゆで肉（スユク）です。',


    'chapter.complete': 'つづける',
    'chapter.backToMap': 'マップに戻る',
    'chapter.n2.body': 'キャンパスでの日々を思い出しながら、次のステージへ進みましょう。',
    'chapter.n2.highlightsAria': 'キャンパスハイライト',
    'chapter.n2.chicago': 'シカゴ交換留学',
    'chapter.n2.australia': 'オーストラリア・ワーホリ',
    'chapter.n2.jeju': '済州・江原大単位交流',

    'memory.title': 'わたしたちの思い出',
    'memory.subtitle': '一緒の時間がとっても大切 💚',
    'memory.filtersAria': '年別の思い出',
    'memory.backAria': 'マップに戻る',
    'memory.cat.all': 'すべて',
    'memory.cat.2023': '2023',
    'memory.cat.2024': '2024',
    'memory.cat.2025': '2025~',
    'memory.cat.running': 'ランニング',
    'memory.cat.morning': '朝',
    'memory.cat.travel': 'おでかけ',
    'memory.cat.school': '学校',
    'memory.cat.diary': '日常',
    'memory.cat.meme': 'ミーム',
    'memory.hint': '写真を見てまわりましょう',
    'memory.empty': 'この年の思い出はまだありません。',
    'memory.complete': '思い出を見終わる',

    'friends.title': '卒業お祝いメッセージ',
    'friends.subtitle': 'カードを送って手紙を読もう',
    'friends.profilesAria': '友達プロフィール',
    'friends.creatorAria': '制作者を応援する',
    'friends.complete': '手紙を読み終わる',

    'feed.lockedTitle': 'フィードはまだロック中',
    'feed.lockedBody': '卒業メッセージはもう少し進むと開きます！',
    'feed.lockedCancel': '閉じる',
    'feed.lockedAction': 'わかった',

    'lang.partialNote': '一部の思い出と友達メッセージは原文のまま表示されます。',

    'bubble.1': 'こんにちは、僕はビョンゴン！',
    'bubble.2': '卒業をお祝いしてくれてありがとう！🎓',

    'brand.courseTitle': "Bradie's UOS Life",

    'ending.stageLabel': 'FINAL STAGE',
    'ending.lead': 'ビョンゴン、本当に卒業だよ！ 🎓',
    'ending.tagline': '2018年から2026年まで、長かった UOS LIFE 完走完了。',
    'ending.congrats': 'ソウル市立大学 都市工学科の学士課程修了、おめでとうございます！',
    'ending.heroAlt': '卒業ガウンを着て喜ぶ Bradie',
    'ending.summaryTitle': '旅のまとめ',
    'ending.stat.period': '旅の期間',
    'ending.stat.stages': 'クリアしたステージ',
    'ending.stat.uosLife': 'UOS LIFE',
    'ending.stat.chapters': 'クリアしたチャプター',
    'ending.stat.memories': '一緒の思い出',
    'ending.stat.memoriesValue': '15枚',
    'ending.stat.letters': '届いた手紙',
    'ending.stat.lettersValue': '4通',
    'ending.cheerTitle': 'ビョンゴン、おめでとう！ 💚',
    'ending.cheerCta': '💚 ハートを残す',
    'ending.cheerHint': '卒業を祝う気持ちをタップしてね',
    'ending.cheerToast': 'お祝いの気持ちを残しました 💚',
    'ending.saveCta': '卒業カードを保存',
    'ending.saveHint': '1080 × 1920 PNGで保存されます',
    'ending.saveRetry': 'もう一度',
    'ending.savePreparing': '画像を準備中',
    'ending.savePreparingMsg': '画像を準備しています',
    'ending.saveReady': '画像の準備ができました',
    'ending.saveLongPress': '画像を長押しして保存してください',
    'ending.saveFail': '画像を作れませんでした',
    'ending.eggAria': 'かくしクーポン',
    'ending.saveAria': '卒業カードを保存',
    'ending.resetTitle': 'ほんとうに最初から始めますか？',
    'ending.resetBody': 'この端末の進行記録がすべて消えます。',
    'ending.resetCancel': 'キャンセル',
    'ending.resetConfirm': '最初から',
  },

  es: {
    'lang.bubble': '¿En qué idioma<br>quieres continuar?',
    'lang.listAria': 'Selección de idioma',
    'lang.continue': 'Continuar',
    'lang.ko': 'Coreano',
    'lang.en': 'Inglés',
    'lang.ja': 'Japonés',
    'lang.es': 'Español',

    'intro.eggAria': 'Cupón oculto',
    'intro.lead': "Bradie's <strong>{course}</strong>,<br>el curso final ya está abierto. 🎓",
    'intro.start': 'Empezar el viaje',

    'map.coverAria': '{title} — saluda a Byeonggeon',
    'map.profileAlt': 'Perfil de Byeonggeon',

    'node.lockedBody': 'Completa la etapa anterior primero.',
    'node.lockedAction': 'Bloqueado',
    'node.startAction': 'Empezar',

    'node.n1.title': 'Inicio',
    'node.n1.mapLabel': 'Inicio',
    'node.n1.typeLabel': 'Quiz',
    'node.n2.title': 'Revisión de graduación',
    'node.n2.mapLabel': 'Revisión',
    'node.n2.typeLabel': 'Contenido',
    'node.n3.title': 'Nuestros recuerdos',
    'node.n3.mapLabel': 'Recuerdos',
    'node.n4.title': 'Mensajes de graduación',
    'node.n4.mapLabel': 'Mensajes',
    'node.n4.typeLabel': 'Contenido',
    'node.n3.typeLabel': 'Contenido',
    'node.n5.title': 'Final',
    'node.n5.mapLabel': 'Final',
    'node.n5.typeLabel': 'Final · PNG',

    'gnb.aria': 'Menú principal',
    'gnb.home': 'Inicio',
    'gnb.friends': 'Feed',
    'gnb.timeline': 'Línea',

    'timeline.title': 'Timeline',
    'timeline.friendsAria': 'Amigos',
    'timeline.bannerTitle': '🎓 8 años de Byeonggeon',
    'timeline.bannerRange': '2018 — 2026',
    'timeline.listAria': 'Timeline por años',
    'timeline.y2018.tag': 'Ingreso',
    'timeline.y2018.l1': 'UOS Estudios Interdisciplinarios, promo ’18 —',
    'timeline.y2018.l2': '¡Empieza el UOS LIFE de Byeonggeon!',
    'timeline.y2019.tag': 'Adaptación',
    'timeline.y2019.l1': 'Adaptándose al campus con amigos',
    'timeline.y2019.l2': 'y creando recuerdos.',
    'timeline.y2020.tag': 'Fuerza Aérea',
    'timeline.y2020.l1': 'Sirviendo en la Fuerza Aérea —',
    'timeline.y2020.l2': '¡otra etapa de crecimiento!',
    'timeline.y2021.tag': 'De vuelta',
    'timeline.y2021.l1': 'Regreso a la universidad —',
    'timeline.y2021.l2': '¡UOS LIFE temporada 2!',
    'timeline.y2022.tag': 'Reto',
    'timeline.y2022.l1': 'Más allá del campus',
    'timeline.y2022.l2': 'hacia nuevas experiencias.',
    'timeline.y2023.tag': 'Amigos',
    'timeline.y2023.l1': 'Amigos del atletismo —',
    'timeline.y2023.l2': 'más tiempo juntos.',
    'timeline.y2024.tag': 'Recuerdos',
    'timeline.y2024.l1': 'Momentos en fotos',
    'timeline.y2024.l2': 'que se fueron acumulando.',
    'timeline.y2025.tag': 'Prep',
    'timeline.y2025.l1': 'Hacia la graduación —',
    'timeline.y2025.l2': 'la recta final.',
    'timeline.y2026.tag': 'Graduación',
    'timeline.y2026.l1': '¡Por fin el año de graduarse!',
    'timeline.y2026.l2': 'UOS LIFE — completo.',

    'review.progress': '🎓 Camino 2/5',
    'review.title': 'Revisión de graduación',
    'review.desc': 'Comprobamos si Byeonggeon está listo para graduarse',
    'review.listAria': 'Lista de revisión',
    'review.item.survive': 'Supervivencia 8 años',
    'review.item.adapt': 'Adaptarse lejos',
    'review.item.friends': 'Hacer amigos',
    'review.item.will': 'Voluntad de graduarse',
    'review.measuring': 'Midiendo…',
    'review.pass': 'PASS',
    'review.resultLabel': 'Resultado:',
    'review.resultTitle': 'Parece listo para graduarse.',
    'review.resultBody': 'Un poco lento… ¡pero un final perfecto!',
    'review.approve': '💗 Aprobar graduación',

    'header.aria': 'Estado de aprendizaje',
    'header.streakAria': '{streak} días matriculado',
    'header.streakBadge': 'Matrícula continua',
    'header.streakTitle': '{streak} días matriculado',
    'header.streakDesc': '¡Bradie no se saltó ni un día desde el ingreso hasta la graduación!',
    'header.friendsAria': 'Amigos',
    'header.friendsTitle': 'Amigos',
    'header.friendsDesc': 'Tiene muchísimos amigos.',
    'header.week': 'D,L,M,X,J,V,S',
    'header.travelAria': '{count} países visitados',
    'header.travelTitle': 'Viajes',
    'header.travelDesc': 'Durante la vida escolar, Byeonggeon visitó muchos países.',

    'quiz.close': 'Cerrar',
    'quiz.closeProgress': 'Cerrar ejercicio',
    'quiz.progress': 'Progreso',
    'quiz.check': 'Comprobar',
    'quiz.continue': 'Continuar',
    'quiz.retry': 'Elegir de nuevo',
    'quiz.retrySentence': 'Intentar de nuevo',
    'quiz.exitTitle': '¿Salir del ejercicio?',
    'quiz.exitBody': 'Tus respuestas no se guardarán.',
    'quiz.exitCancel': 'Seguir',
    'quiz.exitConfirm': 'Volver al mapa',
    'quiz.playListen': 'Reproducir audio',
    'quiz.playSlow': 'Reproducir despacio',
    'quiz.selectedWords': 'Palabras seleccionadas',
    'quiz.correct': '¡Correcto!',
    'quiz.incorrect': '¡Incorrecto!',

    'quiz.n1.q0.question': 'Elige el incorrecto',
    'quiz.n1.q0.promptWord': 'Jeong Byeonggeon',
    'quiz.n1.q0.choice.jeong.alt': 'Jeong Byeonggeon',
    'quiz.n1.q0.choice.pong.alt': 'Pongkkoni',
    'quiz.n1.q0.choice.bbang.alt': 'Jeong Byeonggeon',
    'quiz.n1.q0.choice.bradie.alt': 'Jeong Byeonggeon',
    'quiz.n1.q0.feedback.correct.title': '¡Correcto!',
    'quiz.n1.q0.feedback.correct.body': 'La imagen amarilla no es Jeong Byeonggeon.',
    'quiz.n1.q0.feedback.incorrect.title': '¡Incorrecto!',
    'quiz.n1.q0.feedback.incorrect.body': 'El incorrecto es la imagen amarilla.',

    'quiz.n1.q1.question': '¿Qué NO forma parte de la vida escolar de Byeonggeon?',
    'quiz.n1.q1.choice.chicago.label': 'Intercambio en Chicago',
    'quiz.n1.q1.choice.chicago.alt': 'Intercambio en Chicago',
    'quiz.n1.q1.choice.australia.label': 'WH 1 año en Australia',
    'quiz.n1.q1.choice.australia.alt': 'WH 1 año en Australia',
    'quiz.n1.q1.choice.jeju.label': 'Créditos Jeju / Kangwon',
    'quiz.n1.q1.choice.jeju.alt': 'Créditos Jeju / Kangwon',
    'quiz.n1.q1.choice.skip.label': 'Llegar tarde a 1ª clase',
    'quiz.n1.q1.choice.skip.alt': 'Llegar tarde a 1ª clase',
    'quiz.n1.q1.feedback.correct.title': '¡Correcto!',
    'quiz.n1.q1.feedback.correct.body':
      'Aunque hacía footing al amanecer y desayunaba, Byeonggeon asistía fielmente a la 1ª clase.',
    'quiz.n1.q1.feedback.incorrect.title': '¡Incorrecto!',
    'quiz.n1.q1.feedback.incorrect.body':
      'Byeonggeon hizo intercambio en Chicago, un working holiday en Australia y el intercambio de créditos Jeju / Kangwon.',

    'quiz.n1.q2.badge': 'Ejercicio difícil',
    'quiz.n1.q2.question': 'Toca lo que oyes',
    'quiz.n1.q2.characterAlt': 'Personaje de Byeonggeon',
    'quiz.n1.q2.listenText': 'Byeonggeon, felicidades por graduarte',
    'quiz.n1.q2.token.byeong': 'Byeonggeon,',
    'quiz.n1.q2.token.jol': 'felicidades por',
    'quiz.n1.q2.token.chuk': 'graduarte',
    'quiz.n1.q2.token.ip': 'matricularte',
    'quiz.n1.q2.token.grad': 'posgrado',
    'quiz.n1.q2.token.an': 'no',
    'quiz.n1.q2.token.cham': 'muy',
    'quiz.n1.q2.feedback.correct.title': '¡Correcto!',
    'quiz.n1.q2.feedback.correct.body': '¡Byeonggeon, felicidades por graduarte!',
    'quiz.n1.q2.feedback.incorrect.title': '¡Incorrecto!',
    'quiz.n1.q2.feedback.incorrect.body': 'La respuesta es “Byeonggeon, felicidades por graduarte”.',

    'quiz.n1.q3.badge': 'FOOD',
    'quiz.n1.q3.question': '¿Qué comida no ha probado Byeonggeon?',
    'quiz.n1.q3.choice.tempt.label': 'Tempt',
    'quiz.n1.q3.choice.tempt.alt': 'Tempt',
    'quiz.n1.q3.choice.katsudon.label': 'Katsudon del comedor',
    'quiz.n1.q3.choice.katsudon.alt': 'Katsudon del comedor',
    'quiz.n1.q3.choice.shanghai.label': 'Spaghetti Shanghái Anukan',
    'quiz.n1.q3.choice.shanghai.alt': 'Spaghetti Shanghái Anukan',
    'quiz.n1.q3.choice.suyuk.label': 'Cerdo hervido (suyuk)',
    'quiz.n1.q3.choice.suyuk.alt': 'Cerdo hervido (suyuk)',
    'quiz.n1.q3.feedback.correct.title': '¡Correcto!',
    'quiz.n1.q3.feedback.correct.body': 'Byeonggeon aún no ha probado el cerdo hervido (suyuk).',
    'quiz.n1.q3.feedback.incorrect.title': '¡Incorrecto!',
    'quiz.n1.q3.feedback.incorrect.body': 'La comida que no ha probado es el cerdo hervido (suyuk).',


    'chapter.complete': 'Continuar',
    'chapter.backToMap': 'Volver al mapa',
    'chapter.n2.body': 'Recuerda los días en el campus y pasa a la siguiente etapa.',
    'chapter.n2.highlightsAria': 'Momentos del campus',
    'chapter.n2.chicago': 'Intercambio en Chicago',
    'chapter.n2.australia': 'Working holiday en Australia',
    'chapter.n2.jeju': 'Créditos Jeju · Kangwon',

    'memory.title': 'Nuestros recuerdos',
    'memory.subtitle': 'Estos momentos son muy especiales 💚',
    'memory.filtersAria': 'Recuerdos por año',
    'memory.backAria': 'Volver al mapa',
    'memory.cat.all': 'Todo',
    'memory.cat.2023': '2023',
    'memory.cat.2024': '2024',
    'memory.cat.2025': '2025~',
    'memory.cat.running': 'Correr',
    'memory.cat.morning': 'Mañana',
    'memory.cat.travel': 'Salidas',
    'memory.cat.school': 'Escuela',
    'memory.cat.diary': 'Cotidiano',
    'memory.cat.meme': 'Meme',
    'memory.hint': 'Mira las fotos para completar',
    'memory.empty': 'Aún no hay recuerdos de este año.',
    'memory.complete': 'Terminar recuerdos',

    'friends.title': 'Mensajes de graduación',
    'friends.subtitle': 'Desliza las cartas para leer',
    'friends.profilesAria': 'Perfiles de amigos',
    'friends.creatorAria': 'Apoyar al creador',
    'friends.complete': 'Terminar de leer',

    'feed.lockedTitle': 'El feed aún está cerrado',
    'feed.lockedBody': '¡Los mensajes de graduación se abren con un poco más de progreso!',
    'feed.lockedCancel': 'Cerrar',
    'feed.lockedAction': 'Entendido',

    'lang.partialNote': 'Algunos recuerdos y mensajes de amigos se muestran en el idioma original.',

    'bubble.1': '¡Hola, soy Byeonggeon!',
    'bubble.2': '¡Gracias por celebrar mi graduación! 🎓',

    'brand.courseTitle': "Bradie's UOS Life",

    'ending.stageLabel': 'FINAL STAGE',
    'ending.lead': '¡Byeonggeon, de verdad te graduaste! 🎓',
    'ending.tagline': 'De 2018 a 2026 — UOS LIFE completo.',
    'ending.congrats': '¡Felicidades por completar el grado en Ingeniería Urbana en la Universidad de Seúl!',
    'ending.heroAlt': 'Bradie celebrando con toga de graduación',
    'ending.summaryTitle': 'Resumen del viaje',
    'ending.stat.period': 'Periodo',
    'ending.stat.stages': 'Etapas completadas',
    'ending.stat.uosLife': 'UOS LIFE',
    'ending.stat.chapters': 'Capítulos completados',
    'ending.stat.memories': 'Recuerdos juntos',
    'ending.stat.memoriesValue': '15',
    'ending.stat.letters': 'Cartas recibidas',
    'ending.stat.lettersValue': '4',
    'ending.cheerTitle': '¡Felicidades, Byeonggeon! 💚',
    'ending.cheerCta': '💚 Dejar un corazón',
    'ending.cheerHint': 'Toca para enviar tu felicitación',
    'ending.cheerToast': 'Dejaste un mensaje de ánimo 💚',
    'ending.saveCta': 'Guardar tarjeta de graduación',
    'ending.saveHint': 'Se guarda como PNG 1080 × 1920',
    'ending.saveRetry': 'Reintentar',
    'ending.savePreparing': 'Preparando imagen',
    'ending.savePreparingMsg': 'Preparando la imagen…',
    'ending.saveReady': 'La imagen está lista',
    'ending.saveLongPress': 'Mantén pulsada la imagen para guardar',
    'ending.saveFail': 'No se pudo crear la imagen',
    'ending.eggAria': 'Cupón oculto',
    'ending.saveAria': 'Guardar tarjeta de graduación',
    'ending.resetTitle': '¿Empezar desde el principio?',
    'ending.resetBody': 'Se borrará todo el progreso de este dispositivo.',
    'ending.resetCancel': 'Cancelar',
    'ending.resetConfirm': 'Empezar de nuevo',
  },
};
