/* =========================================================
   Bible source
   English: bible-api.com (KJV, public domain)
   Arabic: getbible.net (Smith & Van Dyke)
   ========================================================= */

import { lang, num } from "../i18n.js";

const EN_API = "https://bible-api.com";
const AR_API = "https://api.getbible.net/v2/arabicsv";
const EN_TRANSLATION = "kjv";
const CACHE_LIMIT = 24;

const chapterCache = new Map();

export class BibleError extends Error {
  constructor(code, cause) {
    super(code);
    this.name = "BibleError";
    this.code = code;
    this.cause = cause;
  }
}

const ARABIC_DIGITS = { "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9", "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4", "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9" };

function normalizeText(value) {
  return String(value)
    .replace(/[٠-٩۰-۹]/g, (d) => ARABIC_DIGITS[d] || d)
    .replace(/[–—−]/g, "-")
    .replace(/[٫،]/g, ".")
    .replace(/\s+/g, " ")
    .trim();
}

const ALIASES = [
  [/^psalm\b/i, "Psalms"],
  [/^psalms\b/i, "Psalms"],
  [/^مزمور/, "المزامير"],
  [/^مزامير/, "المزامير"],
  [/^song of solomon\b/i, "Song of Songs"],
  [/^canticles\b/i, "Song of Songs"],
  [/^revelations\b/i, "Revelation"],
];

function applyAlias(text) {
  for (const [pattern, replacement] of ALIASES) {
    if (pattern.test(text)) return text.replace(pattern, replacement);
  }
  return text;
}

function uniqueNames(book) {
  return Array.from(new Set([book.name, book.en, book.ar].filter(Boolean)));
}

export function parseReference(raw, books) {
  let text = applyAlias(normalizeText(raw));
  if (!text) return null;

  const sorted = [...books].sort(
    (a, b) => Math.max(b.name.length, b.en.length, b.ar.length) - Math.max(a.name.length, a.en.length, a.ar.length)
  );

  for (const book of sorted) {
    for (const name of uniqueNames(book)) {
      const normalizedName = applyAlias(normalizeText(name));
      if (!text.toLowerCase().startsWith(normalizedName.toLowerCase())) continue;
      const rest = text.slice(normalizedName.length).trim();
      if (rest && !/^\d/.test(rest) && !/^[:.]/.test(rest)) continue;

      let chapter = 1;
      let verseStart = null;
      let verseEnd = null;

      if (rest) {
        const match = rest.match(/^[:.]?\s*(\d+)(?:\s*[:.]\s*(\d+)(?:\s*-\s*(\d+))?)?$/);
        if (!match) continue;
        chapter = Number(match[1]);
        verseStart = match[2] ? Number(match[2]) : null;
        verseEnd = match[3] ? Number(match[3]) : verseStart;
      }

      if (!chapter || chapter > book.chapters) {
        throw new BibleError("invalid");
      }

      return { book, chapter, verseStart, verseEnd };
    }
  }
  return null;
}

export function chaptersOf(book) {
  return Array.from({ length: book.chapters }, (_, i) => i + 1);
}

export function referenceLabel(parsed) {
  if (!parsed || !parsed.book) return "";
  let label = `${parsed.book.name} ${num(parsed.chapter)}`;
  if (parsed.verseStart != null) {
    label += `:${num(parsed.verseStart)}`;
    if (parsed.verseEnd != null && parsed.verseEnd !== parsed.verseStart) {
      label += `-${num(parsed.verseEnd)}`;
    }
  }
  return label;
}

function cacheSet(key, value) {
  if (chapterCache.size >= CACHE_LIMIT) {
    const first = chapterCache.keys().next().value;
    chapterCache.delete(first);
  }
  chapterCache.set(key, value);
}

async function fetchArabicChapter(book, chapter, signal) {
  const key = `ar:${book.nr}:${chapter}`;
  if (chapterCache.has(key)) return chapterCache.get(key);

  const response = await fetch(`${AR_API}/${book.nr}/${chapter}.json`, {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new BibleError(response.status === 404 ? "not-found" : "network");
  const data = await response.json();
  if (!data || !Array.isArray(data.verses) || !data.verses.length) throw new BibleError("not-found");
  const chapterData = {
    verses: data.verses.map((verse) => ({ verse: verse.verse, text: String(verse.text || "").trim() })),
    translationName: data.translation || "Smith & Van Dyke",
  };
  cacheSet(key, chapterData);
  return chapterData;
}

async function fetchEnglishReference(parsed, signal) {
  const key = `en:${parsed.book.en}:${parsed.chapter}:${parsed.verseStart || ""}:${parsed.verseEnd || ""}`;
  if (chapterCache.has(key)) return chapterCache.get(key);

  const ref = parsed.verseStart != null
    ? `${parsed.book.en} ${parsed.chapter}:${parsed.verseStart}${parsed.verseEnd != null ? `-${parsed.verseEnd}` : ""}`
    : `${parsed.book.en} ${parsed.chapter}`;
  const response = await fetch(`${EN_API}/${encodeURIComponent(ref)}?translation=${EN_TRANSLATION}`, {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new BibleError(response.status === 404 ? "not-found" : "network");
  const data = await response.json();
  if (!data || !Array.isArray(data.verses) || !data.verses.length || data.error) throw new BibleError("not-found");
  const payload = {
    reference: data.reference || ref,
    verses: data.verses.map((verse) => ({ verse: verse.verse, text: String(verse.text || "").replace(/\s+/g, " ").trim() })),
    translationName: data.translation_name || "King James Version",
  };
  cacheSet(key, payload);
  return payload;
}

/**
 * Load a passage. The parsed reference must come from parseReference()
 * or from the book/chapter selectors.
 */
export async function loadPassage(parsed, { signal } = {}) {
  if (!parsed || !parsed.book) throw new BibleError("not-found");

  try {
    if (lang() === "ar") {
      const chapterData = await fetchArabicChapter(parsed.book, parsed.chapter, signal);
      let verses = chapterData.verses;
      if (parsed.verseStart != null) {
        const end = parsed.verseEnd != null ? parsed.verseEnd : parsed.verseStart;
        verses = verses.filter((v) => v.verse >= parsed.verseStart && v.verse <= end);
      }
      if (!verses.length) throw new BibleError("not-found");
      return {
        reference: referenceLabel(parsed),
        verses,
        translationName: chapterData.translationName,
        source: "getbible.net",
        direction: "rtl",
      };
    }

    const payload = await fetchEnglishReference(parsed, signal);
    return {
      ...payload,
      source: "bible-api.com",
      direction: "ltr",
    };
  } catch (error) {
    if (error instanceof BibleError) throw error;
    if (error && error.name === "AbortError") throw error;
    throw new BibleError("network", error);
  }
}
