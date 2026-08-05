/**
 * Memory content placeholder (N3).
 * @param {{
 *   nodeId: string,
 *   title: string,
 *   mode: 'play' | 'replay',
 *   onBackToMap: () => void
 * }} props
 */
export function renderMemory(props) {
  const el = document.createElement('section');
  el.className = 'screen screen--memory';
  el.dataset.screen = 'memory';
  el.dataset.nodeId = props.nodeId;
  el.dataset.mode = props.mode;

  el.innerHTML = `
    <p class="screen__eyebrow">S04 · Memory · ${props.nodeId.toUpperCase()}</p>
    <h1 class="screen__title">${props.title}</h1>
    <p class="screen__body">콘텐츠 노드 placeholder · 모드: ${props.mode}</p>
    <div class="placeholder-box">
      이미지 3장 placeholder · 스크롤 끝 CTA · 이미지 오류 시에도 완료 가능<br>
      (다음 단계에서 구현)
    </div>
    <div class="btn-row">
      <button type="button" class="btn btn--ghost" data-action="back">맵으로 돌아가기</button>
    </div>
  `;

  el.querySelector('[data-action="back"]')?.addEventListener('click', props.onBackToMap);
  return el;
}
