/**
 * Bottom feedback sheet (correct / incorrect).
 * @param {{
 *   variant: 'correct' | 'incorrect',
 *   title: string,
 *   body: string,
 *   actionLabel: string,
 *   onAction: () => void
 * }} props
 */
export function createFeedbackSheet(props) {
  const el = document.createElement('div');
  el.className = `feedback-sheet is-${props.variant}`;
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.setAttribute('aria-atomic', 'true');

  const content = document.createElement('div');
  content.className = 'feedback-sheet__content';

  const title = document.createElement('p');
  title.className = 'feedback-sheet__title';
  title.textContent = props.title;

  const body = document.createElement('p');
  body.className = 'feedback-sheet__body';
  body.textContent = props.body;

  content.append(title, body);

  const action = document.createElement('button');
  action.type = 'button';
  action.className = `btn ${props.variant === 'correct' ? 'btn--primary' : 'btn--danger'} feedback-sheet__action`;
  action.textContent = props.actionLabel;
  action.addEventListener('click', props.onAction);

  el.append(content, action);
  return el;
}
