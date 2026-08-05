/**
 * Ending placeholder (N5). PNG export comes later.
 * @param {{
 *   nodeId: string,
 *   title: string,
 *   mode: 'play' | 'replay',
 *   onBackToMap: () => void
 * }} props
 */
export function renderEnding(props) {
  const el = document.createElement('section');
  el.className = 'screen screen--ending';
  el.dataset.screen = 'ending';
  el.dataset.nodeId = props.nodeId;
  el.dataset.mode = props.mode;

  el.innerHTML = `
    <p class="screen__eyebrow">S05 · Ending · ${props.nodeId.toUpperCase()}</p>
    <h1 class="screen__title">${props.title}</h1>
    <p class="screen__body">엔딩 placeholder · 모드: ${props.mode}</p>
    <div class="placeholder-box">
      다시 보기 / PNG 저장(1080×1920) / 처음부터 다시<br>
      html-to-image · 파일명 byeonggeon-graduation.png<br>
      (다음 단계에서 구현)
    </div>
    <div class="btn-row">
      <button type="button" class="btn btn--ghost" data-action="back">맵으로 돌아가기</button>
    </div>
  `;

  el.querySelector('[data-action="back"]')?.addEventListener('click', props.onBackToMap);
  return el;
}
