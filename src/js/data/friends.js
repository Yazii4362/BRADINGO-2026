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
      image: './assets/images/friends/gani.webp',
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
      image: './assets/images/friends/yazii.webp',
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
      image: './assets/images/friends/u.soap.webp',
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
      image: './assets/images/friends/poponuna.webp',
      alt: '예린 프로필',
    }),
  ]),
});

export function getFriendsFeed() {
  return FRIENDS_FEED;
}
