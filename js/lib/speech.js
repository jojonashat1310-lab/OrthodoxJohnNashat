/* =========================================================
   Speech engine
   Browser-native text-to-speech (Web Speech API). One global
   queue so two readings can never overlap, saved preferences,
   and voice matching for Arabic / English male and female.
   ========================================================= */

import { store } from "./dom.js";
import { lang as uiLang } from "../i18n.js";

const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
const Utterance = typeof window !== "undefined" ? window.SpeechSynthesisUtterance : null;

export const SUPPORTED = Boolean(synth && Utterance);

const STORAGE_KEY = "audio";
const RATE_MIN = 0.6;
const RATE_MAX = 1.6;

const DEFAULTS = {
  enabled: false,
  language: "auto",
  gender: { ar: "female", en: "female" },
  rate: 1,
  continuous: true,
};

function clampRate(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 1;
  return Math.round(Math.min(RATE_MAX, Math.max(RATE_MIN, number)) * 10) / 10;
}

function normalizePrefs(raw) {
  const source = raw && typeof raw === "object" ? raw : {};
  const gender = source.gender && typeof source.gender === "object" ? source.gender : {};
  return {
    enabled: source.enabled === true,
    language: ["auto", "ar", "en"].includes(source.language) ? source.language : "auto",
    gender: {
      ar: gender.ar === "male" ? "male" : "female",
      en: gender.en === "male" ? "male" : "female",
    },
    rate: clampRate(source.rate),
    continuous: source.continuous !== false,
  };
}

let prefs = normalizePrefs(store.get(STORAGE_KEY));

/* ---------------- Voice inventory ---------------- */

const FEMALE_TOKENS = [
  "female",
  "woman",
  "زينة",
  "هدى",
  "ليلى",
  "سلمى",
  "فاطمة",
  "رنا",
  "سناء",
  "أمينة",
  "مريم",
  "نورة",
  "لطيفة",
  "عائشة",
  "منى",
  "سارة",
  "ريم",
  "دينا",
  "ياسمين",
  "أمل",
  "هالة",
  "نادية",
  "zira",
  "hoda",
  "salma",
  "laila",
  "layla",
  "zeina",
  "samantha",
  "victoria",
  "susan",
  "fiona",
  "karen",
  "moira",
  "tessa",
  "allison",
  "ava",
  "joanna",
  "salli",
  "kimberly",
  "ivy",
  "kendra",
  "aria",
  "jenny",
  "michelle",
  "shelley",
  "hazel",
  "natasha",
  "clara",
  "sonia",
  "libby",
  "maisie",
  "emily",
  "neerja",
  "molly",
  "rosa",
  "luna",
  "emma",
  "leah",
  "ana",
  "olivia",
  "sophia",
  "amelia",
  "isabella",
  "charlotte",
  "mia",
  "zoe",
];

const MALE_TOKENS = [
  "male",
  "man",
  "ذكر",
  "ديفيد",
  "نايف",
  "ماجد",
  "طارق",
  "شاكر",
  "حمدان",
  "علي",
  "إسماعيل",
  "باسل",
  "تيم",
  "خالد",
  "عمر",
  "فيصل",
  "سعود",
  "ناصر",
  "يوسف",
  "كريم",
  "حامد",
  "أحمد",
  "محمد",
  "عبدالله",
  "راشد",
  "سلطان",
  "david",
  "mark",
  "george",
  "james",
  "daniel",
  "alex",
  "fred",
  "naayf",
  "maged",
  "majed",
  "tarik",
  "tarek",
  "hamed",
  "shakir",
  "raul",
  "jorge",
  "diego",
  "rishi",
  "iwan",
  "william",
  "liam",
  "ryan",
  "thomas",
  "yan",
  "sam",
  "connor",
  "prabhat",
  "mitchell",
  "wayne",
  "elimu",
  "andrew",
  "brian",
  "guy",
  "christopher",
  "eric",
  "roger",
  "steffan",
  "luke",
  "jacob",
  "oliver",
  "jack",
  "harry",
  "noah",
  "ethan",
];

function tokenMatches(name, token) {
  if (/^[\u0600-\u06FF\u0750-\u077F]+$/.test(token)) {
    return name.split(/[^\u0600-\u06FF\u0750-\u077F]+/).includes(token);
  }
  return new RegExp(`(^|[^a-z])${token}([^a-z]|$)`, "i").test(name);
}

function genderOf(voice) {
  const name = `${voice.name || ""} ${voice.voiceURI || ""}`.toLowerCase();
  if (FEMALE_TOKENS.some((token) => tokenMatches(name, token))) return "female";
  if (MALE_TOKENS.some((token) => tokenMatches(name, token))) return "male";
  return "unknown";
}

let voices = [];
let primed = false;

function refreshVoices() {
  try {
    voices = (synth?.getVoices() || []).filter((voice) => voice && voice.lang);
  } catch {
    voices = [];
  }
  emit();
  return voices;
}

/**
 * Chrome on some systems returns an empty voice list until speech has
 * been requested once. A silent, empty utterance warms the list without
 * producing audible output.
 */
export function primeVoices() {
  if (!SUPPORTED) return;
  refreshVoices();
  if (voices.length || primed) return;
  primed = true;
  try {
    const utterance = new Utterance(" ");
    utterance.volume = 0;
    utterance.rate = 2;
    utterance.onend = () => {
      primed = false;
      refreshVoices();
    };
    utterance.onerror = () => {
      primed = false;
      refreshVoices();
    };
    synth.speak(utterance);
  } catch {
    primed = false;
  }
  [250, 700, 1500, 3000].forEach((delay) => {
    setTimeout(() => {
      if (!voices.length) refreshVoices();
    }, delay);
  });
  setTimeout(() => {
    primed = false;
    if (!playing && voices.length === 0) {
      try {
        synth.cancel();
      } catch {
        /* ignore */
      }
    }
    refreshVoices();
  }, 4000);
}

function voicesFor(language) {
  return voices.filter((voice) => String(voice.lang || "").toLowerCase().startsWith(language));
}

function voiceRank(voice) {
  let score = 0;
  if (voice.localService) score += 10;
  if (voice.default) score += 2;
  const code = String(voice.lang || "").toLowerCase();
  if (code.startsWith("ar-eg")) score += 4;
  if (/^en-(us|gb)/.test(code)) score += 3;
  return score;
}

function ranked(list) {
  return [...list].sort((a, b) => voiceRank(b) - voiceRank(a));
}

export function resolveVoice(language, gender) {
  const list = voicesFor(language);
  const exact = ranked(list.filter((voice) => genderOf(voice) === gender));
  if (exact.length) return { voice: exact[0], fallback: false, reason: "exact" };
  if (list.length) {
    const known = ranked(list.filter((voice) => genderOf(voice) !== "unknown"));
    const voice = known[0] || ranked(list)[0];
    return {
      voice,
      fallback: true,
      reason: known.length ? "other-gender" : "unknown-gender",
    };
  }
  return { voice: null, fallback: false, reason: "no-voice" };
}

export function voiceCatalog() {
  return ["ar", "en"].map((language) => ({
    lang: language,
    voices: voicesFor(language).map((voice) => ({
      name: voice.name,
      lang: voice.lang,
      gender: genderOf(voice),
      local: Boolean(voice.localService),
    })),
    options: ["male", "female"].map((gender) => {
      const match = resolveVoice(language, gender);
      return {
        gender,
        available: Boolean(match.voice && !match.fallback),
        voice: match.voice,
        fallback: match.fallback,
        reason: match.reason,
      };
    }),
  }));
}

export function voiceSignature() {
  return voices
    .map((voice) => `${voice.name}|${voice.lang}|${voice.localService ? "l" : "r"}`)
    .join("::");
}

/* ---------------- Language detection ---------------- */

export function detectLanguage(text) {
  const value = String(text || "");
  const arabic = (value.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g) || []).length;
  const latin = (value.match(/[A-Za-z\u00C0-\u024F]/g) || []).length;
  if (arabic && arabic >= latin) return "ar";
  if (latin) return "en";
  return null;
}

export function languageFor(text, hint = null) {
  if (hint === "ar" || hint === "en") return hint;
  const detected = detectLanguage(text);
  if (detected) return detected;
  if (prefs.language !== "auto") return prefs.language;
  return uiLang();
}

/* ---------------- Text collection ---------------- */

const BLOCK_SELECTOR = [
  "h1",
  "h2",
  "h3",
  "h4",
  "p",
  "blockquote",
  "li",
  ".note-panel",
  ".quiz-feedback",
].join(", ");

const TEXT_SKIP = [
  "button",
  ".tts-inline",
  ".vnum",
  "[aria-hidden='true']",
  ".sr-only",
  "svg",
  "script",
  "style",
  "input",
  "select",
  "textarea",
  ".audio-dock",
  ".modal-audio",
].join(", ");

const SKIP_CONTEXT = [
  "nav",
  "form",
  "header",
  "footer",
  "button",
  "a",
  "[role='button']",
  ".reader-panel",
  ".audio-dock",
  ".modal-audio",
  ".toast-region",
  ".quiz-options",
  ".quiz-actions",
  ".saints-count",
  ".eyebrow",
  ".p-num",
  ".lesson-num",
  ".quiz-step",
  ".empty-state",
  ".sr-only",
  ".tts-inline",
  "[data-tts-skip]",
  "[aria-hidden='true']",
].join(", ");

export function textOf(element) {
  if (!element) return "";
  const clone = element.cloneNode(true);
  clone.querySelectorAll(TEXT_SKIP).forEach((node) => node.remove());
  return clone.textContent.replace(/\s+/g, " ").trim();
}

function langHintFor(element, fallback) {
  const holder = element.closest?.("[lang]");
  const value = holder?.getAttribute("lang");
  if (value && /^ar\b/i.test(value)) return "ar";
  if (value && /^en\b/i.test(value)) return "en";
  return fallback;
}

function eligible(element) {
  if (!element || !element.isConnected) return false;
  if (element.closest(SKIP_CONTEXT)) return false;
  if (element.getClientRects().length === 0) return false;
  return textOf(element).length > 1;
}

export function collectSegments(scope, { hint = null } = {}) {
  if (!scope) return [];
  const found = Array.from(scope.querySelectorAll(BLOCK_SELECTOR));
  if (scope.matches?.(BLOCK_SELECTOR)) found.unshift(scope);
  const usable = found.filter((element) => eligible(element));
  const outermost = usable.filter(
    (element) => !usable.some((other) => other !== element && other.contains(element))
  );
  return outermost
    .map((element) => {
      const text = textOf(element);
      return {
        el: element,
        text,
        lang: languageFor(text, langHintFor(element, hint)),
      };
    })
    .filter((segment) => segment.text.length > 1);
}

export function segmentFor(element, { hint = null } = {}) {
  const text = textOf(element);
  if (!text) return null;
  return {
    el: element,
    text,
    lang: languageFor(text, langHintFor(element, hint)),
  };
}

/* ---------------- Playback state ---------------- */

const listeners = new Set();

let queue = [];
let index = -1;
let playing = false;
let paused = false;
let boundaryPaused = false;
let finished = false;
let currentSegment = null;
let activeElement = null;
let source = null;
let lastError = "";
let token = 0;

function snapshot() {
  return {
    supported: SUPPORTED,
    enabled: prefs.enabled,
    playing,
    paused,
    finished,
    index,
    total: queue.length,
    current: currentSegment,
    source,
    error: lastError,
    prefs: { ...prefs, gender: { ...prefs.gender } },
    voiceCount: voices.length,
  };
}

function emit() {
  const state = snapshot();
  listeners.forEach((listener) => {
    try {
      listener(state);
    } catch {
      /* a broken listener must not stop playback */
    }
  });
}

export function subscribe(listener) {
  if (typeof listener !== "function") return () => {};
  listeners.add(listener);
  listener(snapshot());
  return () => listeners.delete(listener);
}

export function getState() {
  return snapshot();
}

export function getPrefs() {
  return { ...prefs, gender: { ...prefs.gender } };
}

function reducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
}

function ensureVisible(element) {
  if (!element || !element.isConnected) return;
  const rect = element.getBoundingClientRect();
  const viewport = window.innerHeight || 0;
  if (rect.top >= 70 && rect.bottom <= viewport - 70) return;

  let parent = element.parentElement;
  while (parent && parent !== document.body) {
    const style = window.getComputedStyle(parent);
    if (/(auto|scroll)/.test(style.overflowY) && parent.scrollHeight > parent.clientHeight + 4) {
      const box = parent.getBoundingClientRect();
      if (rect.top < box.top + 8 || rect.bottom > box.bottom - 8) {
        const offset = rect.top - box.top - box.height / 2 + rect.height / 2;
        parent.scrollTo({
          top: Math.max(0, parent.scrollTop + offset),
          behavior: reducedMotion() ? "auto" : "smooth",
        });
      }
      return;
    }
    parent = parent.parentElement;
  }

  element.scrollIntoView({
    behavior: reducedMotion() ? "auto" : "smooth",
    block: "center",
  });
}

function setActive(element) {
  if (activeElement) {
    activeElement.classList.remove("is-speaking");
    activeElement.removeAttribute("data-tts-current");
  }
  activeElement = element || null;
  if (activeElement) {
    activeElement.classList.add("is-speaking");
    activeElement.setAttribute("data-tts-current", "");
    ensureVisible(activeElement);
  }
}

function resetPlayback() {
  token += 1;
  try {
    synth.cancel();
  } catch {
    /* ignore */
  }
  playing = false;
  paused = false;
  boundaryPaused = false;
  queue = [];
  index = -1;
  currentSegment = null;
  source = null;
  lastError = "";
  setActive(null);
}

function finish() {
  playing = false;
  paused = false;
  boundaryPaused = false;
  finished = true;
  index = -1;
  queue = [];
  currentSegment = null;
  source = null;
  setActive(null);
  emit();
}

function speakCurrent() {
  if (!playing) return;
  index += 1;
  if (index >= queue.length) {
    finish();
    return;
  }

  const segment = queue[index];
  const language = segment.lang || languageFor(segment.text);
  const wantedGender = prefs.gender[language] || "female";
  const match = resolveVoice(language, wantedGender);

  if (!match.voice) {
    lastError = `no-voice:${language}`;
    playing = false;
    paused = false;
    setActive(null);
    emit();
    return;
  }

  const localToken = token;
  const utterance = new Utterance(segment.text);
  utterance.lang = match.voice.lang || (language === "ar" ? "ar-EG" : "en-US");
  utterance.voice = match.voice;
  utterance.rate = prefs.rate;
  utterance.pitch = 1;
  utterance.volume = 1;

  currentSegment = {
    ...segment,
    lang: language,
    voiceName: match.voice.name,
    fallback: match.fallback,
  };
  setActive(segment.el || null);
  emit();

  utterance.onstart = () => {
    if (localToken !== token) return;
    if (paused) {
      try {
        synth.pause();
      } catch {
        /* ignore */
      }
    }
    emit();
  };

  utterance.onend = () => {
    if (localToken !== token || !playing) return;
    setActive(null);
    if (!prefs.continuous) {
      paused = true;
      boundaryPaused = true;
      emit();
      return;
    }
    speakCurrent();
  };

  utterance.onerror = (event) => {
    if (localToken !== token) return;
    const error = event?.error || "speech-error";
    if (error === "interrupted" || error === "canceled") return;
    lastError = error;
    playing = false;
    paused = false;
    setActive(null);
    emit();
  };

  try {
    synth.speak(utterance);
  } catch {
    lastError = "speech-error";
    playing = false;
    setActive(null);
    emit();
  }
}

function startQueue(list, sourceName, startIndex) {
  token += 1;
  queue = list;
  index = Math.max(0, Math.min(startIndex, list.length - 1)) - 1;
  playing = true;
  paused = false;
  boundaryPaused = false;
  finished = false;
  source = sourceName;
  lastError = "";
  speakCurrent();
}

function restartAt(target) {
  if (!playing || target < 0 || target >= queue.length) return false;
  const list = queue.slice();
  const sourceName = source;
  resetPlayback();
  startQueue(list, sourceName, target);
  return true;
}

/* ---------------- Public playback controls ---------------- */

export function speak(segments, { source: sourceName = "page", startIndex = 0 } = {}) {
  if (!SUPPORTED) {
    lastError = "unsupported";
    emit();
    return false;
  }
  if (!prefs.enabled) {
    lastError = "disabled";
    emit();
    return false;
  }
  const list = (segments || [])
    .map((segment) => (typeof segment === "string" ? { text: segment } : segment))
    .filter((segment) => segment && String(segment.text || "").trim());
  if (!list.length) return false;

  resetPlayback();
  startQueue(list, sourceName, startIndex);
  return true;
}

export function pause() {
  if (!SUPPORTED || !playing || paused) return;
  paused = true;
  try {
    if (synth.speaking && !synth.paused) synth.pause();
  } catch {
    /* ignore */
  }
  emit();
}

export function resume() {
  if (!SUPPORTED || !playing || !paused) return;
  if (boundaryPaused) {
    boundaryPaused = false;
    paused = false;
    speakCurrent();
    return;
  }
  paused = false;
  try {
    if (synth.paused) synth.resume();
  } catch {
    /* ignore */
  }
  emit();
}

export function stop() {
  if (!SUPPORTED) return;
  resetPlayback();
  finished = false;
  emit();
}

export function previous() {
  return restartAt(index - 1);
}

export function next() {
  return restartAt(index + 1);
}

function restartCurrent() {
  if (!playing || index < 0) return;
  const list = queue.slice();
  const sourceName = source;
  const target = index;
  const wasPaused = paused;
  resetPlayback();
  startQueue(list, sourceName, target);
  if (wasPaused) pause();
}

export function setPrefs(patch = {}, { restart = true } = {}) {
  const before = prefs;
  const next = normalizePrefs({
    ...before,
    ...patch,
    gender: { ...before.gender, ...(patch.gender || {}) },
  });
  prefs = next;
  store.set(STORAGE_KEY, prefs);

  if (!prefs.enabled && playing) resetPlayback();
  if (prefs.enabled && !before.enabled) primeVoices();

  const affectVoice =
    patch.rate != null || patch.language != null || patch.gender != null;
  if (restart && prefs.enabled && playing && affectVoice) restartCurrent();

  emit();
  return snapshot();
}

if (SUPPORTED) {
  refreshVoices();
  try {
    synth.addEventListener?.("voiceschanged", refreshVoices);
  } catch {
    /* older browsers may not support the event */
  }
}
