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
  return {
    ...node,
    title: title.startsWith('node.') ? node.title : title,
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
    'lang.ko': '한국어',
    'lang.en': '영어',
    'lang.ja': '일본어',
    'lang.es': '스페인어',

    'intro.eggAria': '숨겨진 쿠폰',
    'intro.lead': '병건이의 <strong>{course}</strong>,<br>마지막 코스가 열렸어요. 🎓',
    'intro.start': '여정 시작하기',

    'map.coverAria': '{title} — 병건이에게 인사하기',
    'map.profileAlt': '병건이 프로필',

    'node.lockedBody': '이 레벨을 잠금 해제하려면 이전 레벨을 모두 완료하세요!',
    'node.lockedAction': '잠김',
    'node.startAction': '시작하기',

    'node.n1.title': '시작',
    'node.n1.typeLabel': '퀴즈',
    'node.n2.title': '병건이의 학교생활',
    'node.n2.typeLabel': '콘텐츠',
    'node.n3.title': '우리의 추억',
    'node.n4.title': '졸업축하 메시지',
    'node.n4.typeLabel': '콘텐츠',
    'node.n3.typeLabel': '콘텐츠',
    'node.n5.title': '엔딩',
    'node.n5.typeLabel': '엔딩 · PNG',

    'gnb.aria': '주요 메뉴',
    'gnb.home': '홈',
    'gnb.friends': '피드',

    'header.aria': '학습 현황',
    'header.streakAria': '스트릭 {streak}일',
    'header.streakBadge': '연속 학습 명예의 전당',
    'header.streakTitle': '{streak}일 연속 학습',
    'header.streakDesc': '병건이는 입학부터 졸업까지 하루도 쉬지 않았어요!',
    'header.friendsAria': '친구 무한대',
    'header.friendsTitle': '친구',
    'header.friendsDesc': '친구가 무한대 명이에요.',
    'header.week': '일,월,화,수,목,금,토',
    'header.travelAria': '다녀온 나라 {count}개국',
    'header.travelTitle': '여행',
    'header.travelDesc': '병건이는 호주, 미국, 일본, 중국…… 또 어디 다녀왔지…… {count}개국을 다녀왔어요.',

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

    'quiz.n1.q0.question': '맞는 이미지를 고르세요',
    'quiz.n1.q0.promptWord': '정병건',
    'quiz.n1.q0.choice.jeong.alt': '정병건',
    'quiz.n1.q0.choice.pong.alt': '뽕꼬니',
    'quiz.n1.q0.choice.bbang.alt': '시립대건빵',
    'quiz.n1.q0.choice.bradie.alt': 'Bradie',
    'quiz.n1.q0.feedback.correct.title': '정답입니다!',
    'quiz.n1.q0.feedback.correct.body': '병건이의 본명은 정병건이에요.',
    'quiz.n1.q0.feedback.incorrect.title': '오답입니다!',
    'quiz.n1.q0.feedback.incorrect.body': '정답은 정병건이에요.',

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

    'memory.title': '우리의 추억',
    'memory.subtitle': '함께한 순간들이 너무 소중해 💚',
    'memory.cat.all': '전체',
    'memory.cat.running': '달리기',
    'memory.cat.morning': '아침',
    'memory.cat.travel': '여행',
    'memory.cat.school': '학교',
    'memory.cat.diary': '일기',
    'memory.cat.meme': '밈',
    'memory.complete': '계속하기',

    'friends.title': '졸업축하 메시지',
    'friends.subtitle': '카드를 넘겨 편지를 읽어보세요',
    'friends.profilesAria': '친구 프로필',
    'friends.creatorAria': '만든 사람 응원하기',

    'bubble.1': '안녕, 난 병건이야!',
    'bubble.2': '졸업 축하해줘서 고마워! 🎓',

    'brand.courseTitle': '병건이의 UOS LIFE',

    'ending.lead': '병건이의 UOS LIFE가 완료되었어요.',
    'ending.tagline': '이제 새로운 챕터가 열렸어요.',
    'ending.heroAlt': '졸업가운을 입고 기뻐하는 병건이',
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

    'node.lockedBody': 'Complete the previous levels to unlock this one!',
    'node.lockedAction': 'Locked',
    'node.startAction': 'Start',

    'node.n1.title': 'Start',
    'node.n1.typeLabel': 'Quiz',
    'node.n2.title': "Byeonggeon's campus life",
    'node.n2.typeLabel': 'Content',
    'node.n3.title': 'Our memories',
    'node.n4.title': 'Graduation messages',
    'node.n4.typeLabel': 'Content',
    'node.n3.typeLabel': 'Content',
    'node.n5.title': 'Ending',
    'node.n5.typeLabel': 'Ending · PNG',

    'gnb.aria': 'Main menu',
    'gnb.home': 'Home',
    'gnb.friends': 'Feed',

    'header.aria': 'Learning status',
    'header.streakAria': '{streak}-day streak',
    'header.streakBadge': 'Streak Hall of Fame',
    'header.streakTitle': '{streak}-day streak',
    'header.streakDesc': 'Bradie never missed a day from enrollment to graduation!',
    'header.friendsAria': 'Unlimited friends',
    'header.friendsTitle': 'Friends',
    'header.friendsDesc': 'You have unlimited friends.',
    'header.week': 'S,M,T,W,T,F,S',
    'header.travelAria': '{count} countries visited',
    'header.travelTitle': 'Travel',
    'header.travelDesc': 'Byeonggeon has been to Australia, the US, Japan, and China…… where else was it…… {count} countries so far.',

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

    'quiz.n1.q0.question': 'Choose the matching image',
    'quiz.n1.q0.promptWord': 'Jeong Byeonggeon',
    'quiz.n1.q0.choice.jeong.alt': 'Jeong Byeonggeon',
    'quiz.n1.q0.choice.pong.alt': 'Pongkkoni',
    'quiz.n1.q0.choice.bbang.alt': 'UOS bread',
    'quiz.n1.q0.choice.bradie.alt': 'Bradie',
    'quiz.n1.q0.feedback.correct.title': 'Correct!',
    'quiz.n1.q0.feedback.correct.body': "Byeonggeon's real name is Jeong Byeonggeon.",
    'quiz.n1.q0.feedback.incorrect.title': 'Incorrect!',
    'quiz.n1.q0.feedback.incorrect.body': 'The answer is Jeong Byeonggeon.',

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

    'memory.title': 'Our memories',
    'memory.subtitle': 'These moments mean so much 💚',
    'memory.cat.all': 'All',
    'memory.cat.running': 'Running',
    'memory.cat.morning': 'Morning',
    'memory.cat.travel': 'Travel',
    'memory.cat.school': 'School',
    'memory.cat.diary': 'Diary',
    'memory.cat.meme': 'Meme',
    'memory.complete': 'Continue',

    'friends.title': 'Graduation messages',
    'friends.subtitle': 'Swipe the cards to read letters',
    'friends.profilesAria': 'Friend profiles',
    'friends.creatorAria': 'Support the creator',

    'bubble.1': "Hi, I'm Byeonggeon!",
    'bubble.2': 'Thanks for celebrating my graduation! 🎓',

    'brand.courseTitle': "Bradie's UOS Life",

    'ending.lead': "Bradie's UOS Life is complete.",
    'ending.tagline': 'A new chapter is opening now.',
    'ending.heroAlt': 'Bradie celebrating in a graduation gown',
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

    'node.lockedBody': 'このレベルを解除するには、前のレベルをすべて完了してください！',
    'node.lockedAction': 'ロック中',
    'node.startAction': 'はじめる',

    'node.n1.title': 'スタート',
    'node.n1.typeLabel': 'クイズ',
    'node.n2.title': 'ビョンゴンのキャンパスライフ',
    'node.n2.typeLabel': 'コンテンツ',
    'node.n3.title': 'わたしたちの思い出',
    'node.n4.title': '卒業お祝いメッセージ',
    'node.n4.typeLabel': 'コンテンツ',
    'node.n3.typeLabel': 'コンテンツ',
    'node.n5.title': 'エンディング',
    'node.n5.typeLabel': 'エンディング · PNG',

    'gnb.aria': 'メインメニュー',
    'gnb.home': 'ホーム',
    'gnb.friends': 'フィード',

    'header.aria': '学習状況',
    'header.streakAria': '{streak}日連続ストリーク',
    'header.streakBadge': '連続学習の殿堂',
    'header.streakTitle': '{streak}日連続学習',
    'header.streakDesc': 'ビョンゴンは入学から卒業まで一日も休みませんでした！',
    'header.friendsAria': '友達むげん',
    'header.friendsTitle': '友達',
    'header.friendsDesc': '友達はむげん人です。',
    'header.week': '日,月,火,水,木,金,土',
    'header.travelAria': '訪れた国 {count}か国',
    'header.travelTitle': '旅行',
    'header.travelDesc': 'ビョンゴンはオーストラリア、アメリカ、日本、中国……ほかはどこだっけ…… {count}か国を旅しました。',

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

    'quiz.n1.q0.question': '正しい画像を選んでください',
    'quiz.n1.q0.promptWord': 'チョン・ビョンゴン',
    'quiz.n1.q0.choice.jeong.alt': 'チョン・ビョンゴン',
    'quiz.n1.q0.choice.pong.alt': 'ポンッコニ',
    'quiz.n1.q0.choice.bbang.alt': '市立大パン',
    'quiz.n1.q0.choice.bradie.alt': 'Bradie',
    'quiz.n1.q0.feedback.correct.title': '正解です！',
    'quiz.n1.q0.feedback.correct.body': 'ビョンゴンの本名はチョン・ビョンゴンです。',
    'quiz.n1.q0.feedback.incorrect.title': '不正解です！',
    'quiz.n1.q0.feedback.incorrect.body': '正解はチョン・ビョンゴンです。',

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

    'memory.title': 'わたしたちの思い出',
    'memory.subtitle': '一緒の時間がとっても大切 💚',
    'memory.cat.all': 'すべて',
    'memory.cat.running': 'ランニング',
    'memory.cat.morning': '朝',
    'memory.cat.travel': '旅行',
    'memory.cat.school': '学校',
    'memory.cat.diary': '日記',
    'memory.cat.meme': 'ミーム',
    'memory.complete': 'つづける',

    'friends.title': '卒業お祝いメッセージ',
    'friends.subtitle': 'カードを送って手紙を読もう',
    'friends.profilesAria': '友達プロフィール',
    'friends.creatorAria': '制作者を応援する',

    'bubble.1': 'こんにちは、僕はビョンゴン！',
    'bubble.2': '卒業をお祝いしてくれてありがとう！🎓',

    'brand.courseTitle': "Bradie's UOS Life",

    'ending.lead': "Bradie's UOS Life is complete.",
    'ending.tagline': '新しいチャプターが始まります。',
    'ending.heroAlt': '卒業ガウンを着て喜ぶ Bradie',
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

    'node.lockedBody': '¡Completa los niveles anteriores para desbloquear este!',
    'node.lockedAction': 'Bloqueado',
    'node.startAction': 'Empezar',

    'node.n1.title': 'Inicio',
    'node.n1.typeLabel': 'Quiz',
    'node.n2.title': 'Vida universitaria de Byeonggeon',
    'node.n2.typeLabel': 'Contenido',
    'node.n3.title': 'Nuestros recuerdos',
    'node.n4.title': 'Mensajes de graduación',
    'node.n4.typeLabel': 'Contenido',
    'node.n3.typeLabel': 'Contenido',
    'node.n5.title': 'Final',
    'node.n5.typeLabel': 'Final · PNG',

    'gnb.aria': 'Menú principal',
    'gnb.home': 'Inicio',
    'gnb.friends': 'Feed',

    'header.aria': 'Estado de aprendizaje',
    'header.streakAria': 'Racha de {streak} días',
    'header.streakBadge': 'Salón de la fama de rachas',
    'header.streakTitle': 'Racha de {streak} días',
    'header.streakDesc': '¡Bradie no se saltó ni un día desde el ingreso hasta la graduación!',
    'header.friendsAria': 'Amigos ilimitados',
    'header.friendsTitle': 'Amigos',
    'header.friendsDesc': 'Tienes amigos ilimitados.',
    'header.week': 'D,L,M,X,J,V,S',
    'header.travelAria': '{count} países visitados',
    'header.travelTitle': 'Viajes',
    'header.travelDesc': 'Byeonggeon ha estado en Australia, EE. UU., Japón y China…… ¿y dónde más era……? {count} países por ahora.',

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

    'quiz.n1.q0.question': 'Elige la imagen correcta',
    'quiz.n1.q0.promptWord': 'Jeong Byeonggeon',
    'quiz.n1.q0.choice.jeong.alt': 'Jeong Byeonggeon',
    'quiz.n1.q0.choice.pong.alt': 'Pongkkoni',
    'quiz.n1.q0.choice.bbang.alt': 'Pan UOS',
    'quiz.n1.q0.choice.bradie.alt': 'Bradie',
    'quiz.n1.q0.feedback.correct.title': '¡Correcto!',
    'quiz.n1.q0.feedback.correct.body': 'El nombre real de Byeonggeon es Jeong Byeonggeon.',
    'quiz.n1.q0.feedback.incorrect.title': '¡Incorrecto!',
    'quiz.n1.q0.feedback.incorrect.body': 'La respuesta es Jeong Byeonggeon.',

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

    'memory.title': 'Nuestros recuerdos',
    'memory.subtitle': 'Estos momentos son muy especiales 💚',
    'memory.cat.all': 'Todo',
    'memory.cat.running': 'Correr',
    'memory.cat.morning': 'Mañana',
    'memory.cat.travel': 'Viaje',
    'memory.cat.school': 'Escuela',
    'memory.cat.diary': 'Diario',
    'memory.cat.meme': 'Meme',
    'memory.complete': 'Continuar',

    'friends.title': 'Mensajes de graduación',
    'friends.subtitle': 'Desliza las cartas para leer',
    'friends.profilesAria': 'Perfiles de amigos',
    'friends.creatorAria': 'Apoyar al creador',

    'bubble.1': '¡Hola, soy Byeonggeon!',
    'bubble.2': '¡Gracias por celebrar mi graduación! 🎓',

    'brand.courseTitle': "Bradie's UOS Life",

    'ending.lead': "Bradie's UOS Life está completo.",
    'ending.tagline': 'Ahora se abre un nuevo capítulo.',
    'ending.heroAlt': 'Bradie celebrando con toga de graduación',
  },
};
