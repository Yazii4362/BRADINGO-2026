import { invitation, messages } from './data.js';
import { initAnimations } from './animations.js';

/**
 * data.js 내용을 섹션에 렌더링하는 진입점
 * 마크업이 채워지면 여기서 DOM에 바인딩하면 됩니다.
 */
function render() {
  // invitation, messages 사용
  void invitation;
  void messages;
}

function init() {
  render();
  initAnimations();
}

document.addEventListener('DOMContentLoaded', init);
