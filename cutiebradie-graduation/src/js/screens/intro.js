/**
 * @param {{ onStart: () => void }} props
 */
export function renderIntro(props) {
  const el = document.createElement('section');
  el.className = 'screen screen--intro';
  el.dataset.screen = 'intro';
  el.innerHTML = `
    <p class="screen__eyebrow">S01 · Intro</p>
    <h1 class="screen__title">병건링고</h1>
    <p class="screen__body">졸업 축하 코스에 오신 걸 환영해요. (placeholder)</p>
    <div class="placeholder-box">언어 선택 없음 · 하단 내비 없음 · 시작 시 코스 맵으로 이동</div>
    <div class="btn-row">
      <button type="button" class="btn btn--primary" data-action="start">시작하기</button>
    </div>
  `;
  el.querySelector('[data-action="start"]')?.addEventListener('click', props.onStart);
  return el;
}
