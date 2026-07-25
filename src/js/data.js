/** 축하 편지 본문 최대 글자 수 */
export const MESSAGE_MAX = 300;

export const invitation = {
  name: '병건',
  toLabel: 'TO. 병건',
  school: 'University of Illinois Chicago',
  date: '2027.02.18',
  dateLabel: '2027. 02. 18',
  quote: '우리의 청춘은 끝나지 않아',
  heroPhoto: '../src/assets/images/campus/hero.png',
  memoryPhoto: '../src/assets/images/campus/01.jpg',
  closing: '우리의 청춘은\n여기서 끝이 아니라\n새로운 시작입니다.',
};

/**
 * message: 최대 300자
 * contact: tel / kakao / instagram (없으면 숨김)
 */
export const messages = [
  {
    name: '민수',
    initial: '민',
    message: '4년 동안 정말 고생했어. 같이 밤샘하던 날이 벌써 추억이라니 신기하다. 졸업 진심으로 축하하고, 어디 가든 잘할 거야. 앞으로도 자주 보자!',
    contact: { tel: 'tel:', kakao: '#', instagram: '#' },
  },
  {
    name: '지은',
    initial: '지',
    message: '앞으로 더 행복하자. 너라서 더 특별했던 시간들, 절대 안 잊을게. 졸업을 진심으로 축하해!',
    contact: { tel: 'tel:', kakao: '#', instagram: '#' },
  },
  {
    name: '혜린',
    initial: '혜',
    message: '언제나 응원할게. 시험기간에 서로 붙잡고 버틴 날들이 제일 그립다. 새 시작도 응원할게. 졸업 축하해!',
    contact: { tel: 'tel:', kakao: '#', instagram: '#' },
  },
  {
    name: '준호',
    initial: '준',
    message: '앞날이 반짝이길. 축제에서 뛰어다니던 네 모습 기억나. 어디서든 네 페이스로 가. 또 만나자!',
    contact: { tel: 'tel:', kakao: '#', instagram: '#' },
  },
];

export function clampMessage(text, max = MESSAGE_MAX) {
  const t = String(text || '');
  return t.length > max ? `${t.slice(0, max)}…` : t;
}
