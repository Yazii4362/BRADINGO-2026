import { MESSAGES } from './messages.js';

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
 * @param {import('../data/quiz.js').QuizItem} item
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
