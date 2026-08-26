/**
 * Web Speech helpers.
 * Chrome drops utterences spoken immediately after cancel(); iOS needs a
 * prior user-gesture unlock before autoplay works.
 */

/** @type {boolean} */
let unlocked = false;

/** @type {Promise<SpeechSynthesisVoice[]> | null} */
let voicesPromise = null;

/**
 * Warm the speech engine inside a user gesture (tap / click).
 */
export function unlockSpeech() {
  if (!window.speechSynthesis || unlocked) return;
  unlocked = true;
  try {
    window.speechSynthesis.cancel();
    const warm = new SpeechSynthesisUtterance(' ');
    warm.volume = 0;
    warm.rate = 1;
    window.speechSynthesis.speak(warm);
    window.speechSynthesis.cancel();
  } catch {
    // Ignore engines that reject empty utterances.
  }
  void loadVoices();
}

/**
 * @returns {Promise<SpeechSynthesisVoice[]>}
 */
function loadVoices() {
  if (!window.speechSynthesis) return Promise.resolve([]);
  if (!voicesPromise) {
    voicesPromise = new Promise((resolve) => {
      const current = window.speechSynthesis.getVoices();
      if (current.length) {
        resolve(current);
        return;
      }
      const finish = () => resolve(window.speechSynthesis.getVoices());
      window.speechSynthesis.addEventListener('voiceschanged', finish, { once: true });
      window.setTimeout(finish, 300);
    });
  }
  return voicesPromise;
}

/**
 * @param {SpeechSynthesisVoice[]} voices
 * @param {string} lang
 */
function pickVoice(voices, lang) {
  const exact = voices.find((voice) => voice.lang === lang);
  if (exact) return exact;
  const prefix = lang.slice(0, 2).toLowerCase();
  return voices.find((voice) => voice.lang.toLowerCase().startsWith(prefix)) ?? null;
}

/**
 * @param {string} text
 * @param {{ rate?: number }} [options]
 */
export function speakText(text, options = {}) {
  const value = text.trim();
  if (!value || !window.speechSynthesis) return;

  unlockSpeech();

  void loadVoices().then((voices) => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(value);
    const lang = /[가-힣]/.test(value) ? 'ko-KR' : 'en-US';
    utter.lang = lang;
    utter.rate = Math.max(0.5, Math.min(1.2, options.rate ?? 1));
    const voice = pickVoice(voices, lang);
    if (voice) utter.voice = voice;

    // Chrome quirk: speak() right after cancel() is often dropped.
    window.setTimeout(() => {
      try {
        window.speechSynthesis.speak(utter);
      } catch {
        // Some WebViews throw when speech is unavailable.
      }
    }, 40);
  });
}
