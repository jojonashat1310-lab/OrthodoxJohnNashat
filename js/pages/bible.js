import { icon } from "../lib/icons.js";
import { pageHero, sectionHead } from "../lib/components.js";
import { escapeHtml, debounce } from "../lib/dom.js";
import { isRTL, num, t } from "../i18n.js";
import { pack } from "../data/localized-content.js";
import { openSettings } from "../lib/settings.js";
import {
  SUPPORTED as AUDIO_SUPPORTED,
  getPrefs,
  getState,
  pause as pauseSpeech,
  resume as resumeSpeech,
  segmentFor,
  setPrefs,
  speak,
  stop as stopSpeech,
  subscribe,
} from "../lib/speech.js";
import {
  BibleError,
  chaptersOf,
  loadPassage,
  parseReference,
  referenceLabel,
} from "../lib/bible-source.js";

let lastSelection = null;

const READER_RATES = Array.from({ length: 11 }, (_, i) => Math.round((0.6 + i * 0.1) * 10) / 10);

export function render(root, ctx = {}) {
  const { bibleBooks, curatedPassages } = pack();
  const findBook = (nr) => bibleBooks.find((book) => book.nr === Number(nr)) || null;
  const safeParse = (raw) => {
    try {
      return parseReference(raw, bibleBooks);
    } catch {
      return null;
    }
  };

  let controller = null;
  let bookFilter = { testament: "all", query: "" };

  root.innerHTML = `
    ${pageHero({
      eyebrow: t("bible.eyebrow"),
      title: t("bible.title"),
      lead: t("bible.lead"),
      aside: t("bible.aside"),
    })}

    <section class="section-sm" id="reader">
      <div class="container">
        <div class="reader-panel reveal">
          <div class="reader-head">
            <div>
              <h3>${t("bible.readerTitle")}</h3>
              <p>${t("bible.readerHelp")}</p>
            </div>
          </div>
          <div class="reader-audio" id="reader-audio" role="group" aria-label="${escapeHtml(
            t("audio.readerAria")
          )}">
            <div class="reader-audio-row">
              <button class="btn btn-primary btn-sm" type="button" data-reader-audio="chapter">
                ${icon("bookOpen")} <span>${t("audio.readChapter")}</span>
              </button>
              <button class="btn btn-ghost btn-sm" type="button" data-reader-audio="verse" disabled>
                ${icon("play")} <span>${t("audio.readVerse")}</span>
              </button>
              <div class="reader-audio-nav" role="group" aria-label="${escapeHtml(
                t("audio.readerAria")
              )}">
                <button class="icon-btn" type="button" data-reader-audio="prev" aria-label="${escapeHtml(
                  t("audio.previousVerse")
                )}" title="${escapeHtml(t("audio.previousVerse"))}" disabled>${icon("arrowLeft")}</button>
                <button class="icon-btn" type="button" data-reader-audio="next" aria-label="${escapeHtml(
                  t("audio.nextVerse")
                )}" title="${escapeHtml(t("audio.nextVerse"))}" disabled>${icon("arrowRight")}</button>
              </div>
              <button class="icon-btn" type="button" data-reader-audio="pause" aria-label="${escapeHtml(
                t("audio.pause")
              )}" title="${escapeHtml(t("audio.pause"))}" disabled>${icon("pause")}</button>
              <button class="icon-btn" type="button" data-reader-audio="stop" aria-label="${escapeHtml(
                t("audio.stop")
              )}" title="${escapeHtml(t("audio.stop"))}" disabled>${icon("stop")}</button>
              <label class="reader-audio-rate">
                <span>${t("audio.speed")}</span>
                <select class="select" data-reader-rate aria-label="${escapeHtml(t("audio.speed"))}">
                  ${READER_RATES.map(
                    (rate) =>
                      `<option value="${rate}">${escapeHtml(`${num(rate.toFixed(1))}×`)}</option>`
                  ).join("")}
                </select>
              </label>
            </div>
            <p class="reader-audio-status" data-reader-status role="status" aria-live="polite"></p>
          </div>
          <div class="reader-controls">
            <label class="reader-field">
              <span>${t("bible.bookLabel")}</span>
              <select class="input" id="reader-book">
                ${bibleBooks
                  .map(
                    (book) =>
                      `<option value="${book.nr}">${escapeHtml(book.name)}</option>`
                  )
                  .join("")}
              </select>
            </label>
            <label class="reader-field">
              <span>${t("bible.chapterLabel")}</span>
              <select class="input" id="reader-chapter"></select>
            </label>
          </div>
          <form class="reader-form reader-advanced" id="reader-form" role="search">
            <label class="reader-form-label" for="reader-ref">
              <strong>${t("bible.advanced")}</strong>
              <span>${t("bible.advancedHint")}</span>
            </label>
            <div class="reader-advanced-row">
              <label class="sr-only" for="reader-ref">${t("bible.refLabel")}</label>
              <input class="input" id="reader-ref" name="ref" list="book-list" placeholder="${t("bible.placeholder")}" autocomplete="off" spellcheck="false" />
              <button class="btn btn-primary btn-sm" type="submit">${icon("bookOpen")} ${t("bible.read")}</button>
            </div>
            <datalist id="book-list">
              ${Array.from(new Set(bibleBooks.flatMap((b) => [b.name, b.en])))
                .map((name) => `<option value="${escapeHtml(name)} 1"></option>`)
                .join("")}
            </datalist>
          </form>
          <div class="reader-body" id="reader-body" aria-live="polite"></div>
          <div class="reader-foot">
            <span id="reader-source">${isRTL() ? t("bible.sourceAr") : t("bible.sourceEn")}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        ${sectionHead({
          eyebrow: t("bible.canonEyebrow"),
          title: t("bible.canonTitle"),
          lead: t("bible.canonLead"),
        })}
        <div class="book-toolbar">
          <div class="chip-row" role="group" aria-label="${t("bible.filterAria")}">
            <button class="chip is-active" type="button" data-testament="all" aria-pressed="true">${t("bible.allBooks")}</button>
            <button class="chip" type="button" data-testament="OT" aria-pressed="false">${t("bible.ot")}</button>
            <button class="chip" type="button" data-testament="NT" aria-pressed="false">${t("bible.nt")}</button>
          </div>
          <label class="search-field">
            ${icon("search")}
            <span class="sr-only">${t("bible.searchBook")}</span>
            <input class="input" id="book-search" type="search" placeholder="${t("bible.searchPlaceholder")}" autocomplete="off" />
          </label>
        </div>
        <div class="book-grid" id="book-grid"></div>
        <p class="empty-state" id="book-empty" hidden>${t("bible.noBooks")}</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        ${sectionHead({
          eyebrow: t("bible.curatedEyebrow"),
          title: t("bible.curatedTitle"),
          lead: t("bible.curatedLead"),
        })}
        <div class="curated-grid">
          ${curatedPassages
            .map(
              (passage, index) => `
            <button class="passage-card reveal" type="button" data-passage="${index}">
              <span class="pc-ref">${escapeHtml(passage.ref.replace("-", "–"))}</span>
              <span class="pc-desc"><strong>${escapeHtml(passage.title)}</strong> — ${escapeHtml(passage.note)}</span>
              <span class="pc-arrow">${icon("arrowUpRight")}</span>
            </button>`
            )
            .join("")}
        </div>
      </div>
    </section>`;

  const form = root.querySelector("#reader-form");
  const input = root.querySelector("#reader-ref");
  const bookSelect = root.querySelector("#reader-book");
  const chapterSelect = root.querySelector("#reader-chapter");
  const body = root.querySelector("#reader-body");
  const source = root.querySelector("#reader-source");
  const grid = root.querySelector("#book-grid");
  const empty = root.querySelector("#book-empty");
  const search = root.querySelector("#book-search");
  const audioBar = root.querySelector("#reader-audio");
  const audioChapter = audioBar.querySelector('[data-reader-audio="chapter"]');
  const audioVerse = audioBar.querySelector('[data-reader-audio="verse"]');
  const audioPrev = audioBar.querySelector('[data-reader-audio="prev"]');
  const audioNext = audioBar.querySelector('[data-reader-audio="next"]');
  const audioPause = audioBar.querySelector('[data-reader-audio="pause"]');
  const audioStop = audioBar.querySelector('[data-reader-audio="stop"]');
  const audioRate = audioBar.querySelector("[data-reader-rate]");
  const audioStatus = audioBar.querySelector("[data-reader-status]");

  let readerSegments = [];
  let selectedVerse = null;
  let currentParsed = null;
  let lastReaderSource = false;

  function fillChapters(book, selected = 1) {
    chapterSelect.innerHTML = chaptersOf(book)
      .map(
        (chapter) =>
          `<option value="${chapter}">${t("bible.chapterOption", { n: num(chapter) })}</option>`
      )
      .join("");
    chapterSelect.value = String(selected);
  }

  function syncSelection(parsed) {
    bookSelect.value = String(parsed.book.nr);
    if (chapterSelect.dataset.bookNr !== String(parsed.book.nr)) {
      fillChapters(parsed.book, parsed.chapter);
      chapterSelect.dataset.bookNr = String(parsed.book.nr);
    }
    chapterSelect.value = String(parsed.chapter);
    input.value = referenceLabel(parsed);
  }

  function status(message, { loading = false, iconName = "search", retry = null } = {}) {
    body.innerHTML = `
      <div class="reader-status">
        ${loading ? '<span class="spinner" aria-hidden="true"></span>' : icon(iconName)}
        <div>
          <p>${escapeHtml(message)}</p>
          ${
            retry
              ? `<button class="btn btn-ghost btn-sm mt-16" type="button" data-retry>${icon("retry")} ${t("bible.tryAgain")}</button>`
              : ""
          }
        </div>
      </div>`;
    body.querySelector("[data-retry]")?.addEventListener("click", () => load(retry));
  }

  /* ---------------- Chapter audio ---------------- */

  function readerStatusText(state) {
    if (!AUDIO_SUPPORTED) return t("audio.unsupported");
    if (!state.enabled) return t("audio.enableFirst");
    if (state.error) {
      if (state.error.startsWith("no-voice:")) {
        const language = state.error.split(":")[1];
        return t("audio.noVoice", { lang: t(`audio.${language}`) });
      }
      if (state.error === "unsupported") return t("audio.unsupported");
      return t("audio.error");
    }
    if (state.playing && state.source === "bible") {
      const verse = state.current?.verse;
      const isChapter = readerSegments[0]?.verse === 1;
      const total = isChapter ? readerSegments[readerSegments.length - 1]?.verse : null;
      const text =
        verse != null
          ? total != null
            ? t("audio.verseOf", { n: num(verse), total: num(total) })
            : t("audio.verseNo", { n: num(verse) })
          : state.current?.text || "";
      return state.paused ? t("audio.paused", { text }) : t("audio.reading", { text });
    }
    if (state.playing) return t("audio.otherReading");
    if (state.finished && lastReaderSource) return t("audio.finished");
    return selectedVerse != null
      ? t("audio.verseSelected", { n: num(selectedVerse) })
      : t("audio.readerReady");
  }

  function renderReaderAudio(state = getState()) {
    const firstVerse = readerSegments[0]?.verse ?? null;
    const lastVerse = readerSegments[readerSegments.length - 1]?.verse ?? null;
    const fromReader = state.playing && state.source === "bible";

    audioChapter.disabled = !AUDIO_SUPPORTED || !readerSegments.length;
    audioVerse.disabled = !AUDIO_SUPPORTED || selectedVerse == null;
    audioPrev.disabled =
      !AUDIO_SUPPORTED || selectedVerse == null || firstVerse == null || selectedVerse <= firstVerse;
    audioNext.disabled =
      !AUDIO_SUPPORTED || selectedVerse == null || lastVerse == null || selectedVerse >= lastVerse;
    audioPause.disabled = !fromReader;
    audioStop.disabled = !state.playing;
    audioRate.disabled = !AUDIO_SUPPORTED;

    const pauseLabel = state.paused ? t("audio.resume") : t("audio.pause");
    audioPause.innerHTML = icon(state.paused ? "play" : "pause");
    audioPause.setAttribute("aria-label", pauseLabel);
    audioPause.setAttribute("title", pauseLabel);

    const rate = getPrefs().rate;
    if (audioRate.value !== String(rate)) audioRate.value = String(rate);

    audioStatus.textContent = readerStatusText(state);
  }

  function setSelectedVerse(verse, { updateToolbar = true } = {}) {
    selectedVerse = Number.isFinite(verse) ? verse : null;
    body.querySelectorAll(".verse.is-selected").forEach((el) => {
      el.classList.remove("is-selected");
      el.removeAttribute("data-selected");
    });
    if (selectedVerse != null) {
      const el = body.querySelector(`.verse[data-verse="${selectedVerse}"]`);
      if (el) {
        el.classList.add("is-selected");
        el.setAttribute("data-selected", "1");
      }
    }
    if (updateToolbar) renderReaderAudio(getState());
  }

  function startChapterReading() {
    if (!readerSegments.length) return;
    setSelectedVerse(readerSegments[0].verse);
    if (speak(readerSegments, { source: "bible" })) lastReaderSource = true;
  }

  function readChapter() {
    if (!AUDIO_SUPPORTED || !currentParsed) return;
    if (!getState().enabled) {
      openSettings("audio");
      return;
    }
    const { book, chapter, verseStart } = currentParsed;
    if (verseStart != null) {
      document.getElementById("reader").scrollIntoView({ behavior: "smooth", block: "start" });
      load(
        { book, chapter, verseStart: null, verseEnd: null },
        { autoplay: "chapter", loadingMessage: t("audio.chapterRangeNote") }
      );
      return;
    }
    startChapterReading();
  }

  function readVerse(verse) {
    if (!AUDIO_SUPPORTED || verse == null) return;
    if (!getState().enabled) {
      openSettings("audio");
      return;
    }
    const segment = readerSegments.find((item) => item.verse === verse);
    if (!segment) return;
    setSelectedVerse(verse);
    if (speak([segment], { source: "bible" })) lastReaderSource = true;
  }

  function stepVerse(delta) {
    if (!readerSegments.length) return;
    const currentIndex = readerSegments.findIndex((item) => item.verse === selectedVerse);
    const base = currentIndex >= 0 ? currentIndex : 0;
    const target = readerSegments[Math.max(0, Math.min(readerSegments.length - 1, base + delta))];
    if (!target) return;
    readVerse(target.verse);
  }

  function toggleReaderPause() {
    const state = getState();
    if (!state.playing || state.source !== "bible") return;
    if (state.paused) resumeSpeech();
    else pauseSpeech();
  }

  body.addEventListener("click", (event) => {
    const play = event.target.closest("[data-verse-play]");
    if (play) {
      event.preventDefault();
      const verse = Number(play.dataset.versePlay);
      setSelectedVerse(verse);
      readVerse(verse);
      return;
    }
    const verseEl = event.target.closest(".verse");
    if (verseEl) setSelectedVerse(Number(verseEl.dataset.verse));
  });

  audioBar.addEventListener("click", (event) => {
    const button = event.target.closest("[data-reader-audio]");
    if (!button) return;
    const action = button.dataset.readerAudio;
    if (action === "chapter") readChapter();
    else if (action === "verse") readVerse(selectedVerse);
    else if (action === "prev") stepVerse(-1);
    else if (action === "next") stepVerse(1);
    else if (action === "pause") toggleReaderPause();
    else if (action === "stop") stopSpeech();
  });

  audioRate.addEventListener("change", () => {
    setPrefs({ rate: Number(audioRate.value) }, { restart: true });
  });

  const unsubscribeAudio = subscribe((state) => {
    if (state.playing && state.source === "bible") {
      lastReaderSource = true;
      const verse = state.current?.verse;
      if (verse != null && verse !== selectedVerse) setSelectedVerse(verse, { updateToolbar: false });
    } else if (state.playing) {
      lastReaderSource = false;
    }
    renderReaderAudio(state);
  });

  async function load(parsed, { autoplay = null, loadingMessage = null } = {}) {
    if (!parsed || !parsed.book) {
      input.focus();
      return;
    }

    if (getState().playing && getState().source === "bible") stopSpeech();
    lastReaderSource = false;
    selectedVerse = null;
    readerSegments = [];
    currentParsed = {
      book: parsed.book,
      chapter: parsed.chapter,
      verseStart: parsed.verseStart ?? null,
      verseEnd: parsed.verseEnd ?? null,
    };
    renderReaderAudio();

    lastSelection = parsed;
    if (controller) controller.abort();
    controller = new AbortController();
    const thisController = controller;
    const timer = setTimeout(() => thisController.abort(), 15000);

    const label = referenceLabel(parsed);
    status(loadingMessage || t("bible.opening", { ref: label }), { loading: true });
    syncSelection(parsed);
    body.setAttribute("aria-busy", "true");

    try {
      const result = await loadPassage(parsed, { signal: thisController.signal });
      if (thisController.signal.aborted) return;

      body.innerHTML = `
        <div class="passage-head">
          <h4>${escapeHtml(result.reference || label)}</h4>
          <span class="passage-meta">${escapeHtml(result.translationName)}</span>
        </div>
        <div class="passage-rule" aria-hidden="true">${icon("cross")}</div>
        <div class="passage-text"></div>`;
      const textEl = body.querySelector(".passage-text");
      textEl.setAttribute("dir", result.direction);
      textEl.setAttribute("lang", result.direction === "rtl" ? "ar" : "en");
      result.verses.forEach((verse) => {
        const p = document.createElement("p");
        p.className = "verse";
        p.dataset.verse = String(verse.verse);
        p.id = `verse-${verse.verse}`;
        const verseNum = document.createElement("span");
        verseNum.className = "vnum";
        verseNum.textContent = num(verse.verse);
        const text = document.createTextNode(String(verse.text || "").replace(/\s+/g, " ").trim());
        const play = document.createElement("button");
        play.type = "button";
        play.className = "verse-play";
        play.dataset.versePlay = String(verse.verse);
        const label = t("audio.readVerseN", { n: num(verse.verse) });
        play.setAttribute("aria-label", label);
        play.setAttribute("title", label);
        play.innerHTML = icon("speaker");
        p.append(verseNum, text, play);
        textEl.append(p);
      });

      readerSegments = Array.from(textEl.querySelectorAll(".verse"))
        .map((element) => {
          const segment = segmentFor(element);
          return segment ? { ...segment, verse: Number(element.dataset.verse) } : null;
        })
        .filter(Boolean);
      selectedVerse = null;
      renderReaderAudio();

      source.textContent = `${result.translationName} · ${result.source}`;

      if (autoplay === "chapter") startChapterReading();
    } catch (error) {
      if (thisController.signal.aborted) {
        if (controller === thisController) {
          status(t("bible.timeout"), { iconName: "alert", retry: parsed });
        }
        return;
      }
      if (error instanceof BibleError && error.code === "not-found") {
        status(t("bible.notFound"), { iconName: "search" });
      } else {
        status(t("bible.offline"), { iconName: "alert", retry: parsed });
      }
      source.textContent = t("bible.unavailable");
    } finally {
      clearTimeout(timer);
      if (controller === thisController) body.removeAttribute("aria-busy");
    }
  }

  function loadChapter(book, chapter = 1) {
    return load({ book, chapter, verseStart: null, verseEnd: null });
  }

  function renderBooks() {
    const query = bookFilter.query.toLowerCase();
    const books = bibleBooks.filter((book) => {
      if (bookFilter.testament !== "all" && book.testament !== bookFilter.testament) return false;
      if (!query) return true;
      return [book.name, book.en, book.ar].some(
        (name) => name && name.toLowerCase().includes(query)
      );
    });
    grid.innerHTML = books
      .map(
        (book) => `
      <button class="book-card" type="button" data-book="${book.nr}">
        <span class="book-name">${escapeHtml(book.name)}</span>
        ${isRTL() ? "" : `<span class="book-ar ar" lang="ar" dir="rtl">${escapeHtml(book.ar)}</span>`}
        <span class="book-meta">
          <span class="book-group">${escapeHtml(book.group)}</span>
          <span>${t("bible.chapters", { n: num(book.chapters) })}</span>
        </span>
      </button>`
      )
      .join("");
    empty.hidden = books.length > 0;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const raw = input.value.trim();
    if (!raw) {
      input.focus();
      return;
    }
    if (raw.length > 80) {
      status(t("bible.tooLong"), { iconName: "info" });
      return;
    }
    const parsed = safeParse(raw);
    if (!parsed) {
      status(t("bible.notFound"), { iconName: "search" });
      return;
    }
    document.getElementById("reader").scrollIntoView({ behavior: "smooth", block: "start" });
    load(parsed);
  });

  bookSelect.addEventListener("change", () => {
    const book = findBook(bookSelect.value);
    if (!book) return;
    fillChapters(book, 1);
    chapterSelect.dataset.bookNr = String(book.nr);
    loadChapter(book, 1);
  });

  chapterSelect.addEventListener("change", () => {
    const book = findBook(bookSelect.value);
    const chapter = Number(chapterSelect.value);
    if (!book || !chapter) return;
    loadChapter(book, chapter);
  });

  grid.addEventListener("click", (event) => {
    const card = event.target.closest("[data-book]");
    if (!card) return;
    const book = findBook(card.dataset.book);
    if (!book) return;
    fillChapters(book, 1);
    chapterSelect.dataset.bookNr = String(book.nr);
    document.getElementById("reader").scrollIntoView({ behavior: "smooth", block: "start" });
    loadChapter(book, 1);
  });

  root.querySelectorAll("[data-testament]").forEach((chip) => {
    chip.addEventListener("click", () => {
      bookFilter.testament = chip.dataset.testament;
      root.querySelectorAll("[data-testament]").forEach((c) => {
        const active = c === chip;
        c.classList.toggle("is-active", active);
        c.setAttribute("aria-pressed", String(active));
      });
      renderBooks();
    });
  });

  search.addEventListener(
    "input",
    debounce(() => {
      bookFilter.query = search.value.trim();
      renderBooks();
    }, 120)
  );

  root.querySelectorAll("[data-passage]").forEach((card) => {
    card.addEventListener("click", () => {
      const passage = curatedPassages[Number(card.dataset.passage)];
      const parsed = passage ? safeParse(passage.ref) : null;
      if (!parsed) return;
      document.getElementById("reader").scrollIntoView({ behavior: "smooth", block: "start" });
      load(parsed);
    });
  });

  renderBooks();

  let initial = ctx.passage ? safeParse(ctx.passage) : null;
  if (!initial && lastSelection) {
    const book = findBook(lastSelection.book.nr);
    if (book) initial = { ...lastSelection, book };
  }
  if (!initial) initial = safeParse("John 1:1-18");

  fillChapters(initial.book, initial.chapter);
  chapterSelect.dataset.bookNr = String(initial.book.nr);
  load(initial);

  root._bibleCleanup = () => {
    if (controller) controller.abort();
    unsubscribeAudio();
    if (getState().playing && getState().source === "bible") stopSpeech();
  };
}

export function cleanup() {
  const root = document.getElementById("view");
  if (root && root._bibleCleanup) root._bibleCleanup();
}
