/* =========================================================
   Audio interface
   Floating site-wide player, per-paragraph read buttons,
   modal reading controls and dynamic-content decoration.
   ========================================================= */

import { icon } from "./icons.js";
import { debounce, escapeHtml } from "./dom.js";
import { t, LANG_EVENT } from "../i18n.js";
import { openSettings } from "./settings.js";
import * as speech from "./speech.js";

const INLINE_SELECTOR = [
  "h1",
  "h2",
  "h3",
  "h4",
  "p",
  "blockquote",
  "li",
  ".quiz-feedback",
  ".note-panel > div",
].join(", ");

const INLINE_SKIP = [
  "button",
  "a",
  "nav",
  "form",
  "header",
  "footer",
  "[role='button']",
  ".reader-panel",
  ".verse",
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
  ".vnum",
  "[data-tts-skip]",
  "[aria-hidden='true']",
].join(", ");

let dock = null;
let observer = null;
let initialized = false;
let lastEnabled = null;
let selectionTimer = 0;

/* ---------------- Dock ---------------- */

function dockMarkup() {
  return `
    <button class="audio-dock-play" type="button" data-audio-main></button>
    <div class="audio-dock-info">
      <span class="audio-dock-eyebrow">${icon("headphones")}<span>${t("audio.label")}</span></span>
      <span class="audio-dock-status" data-audio-status role="status" aria-live="polite"></span>
      <span class="audio-dock-track" aria-hidden="true"><i data-audio-progress></i></span>
    </div>
    <div class="audio-dock-actions">
      <button class="audio-dock-btn" type="button" data-audio-selection aria-label="${escapeHtml(
        t("audio.readSelection")
      )}" title="${escapeHtml(t("audio.readSelection"))}">${icon("quote")}</button>
      <button class="audio-dock-btn" type="button" data-audio-prev aria-label="${escapeHtml(
        t("audio.previous")
      )}" title="${escapeHtml(t("audio.previous"))}">${icon("arrowLeft")}</button>
      <button class="audio-dock-btn" type="button" data-audio-next aria-label="${escapeHtml(
        t("audio.next")
      )}" title="${escapeHtml(t("audio.next"))}">${icon("arrowRight")}</button>
      <button class="audio-dock-btn" type="button" data-audio-stop aria-label="${escapeHtml(
        t("audio.stop")
      )}" title="${escapeHtml(t("audio.stop"))}">${icon("stop")}</button>
      <button class="audio-dock-btn" type="button" data-audio-settings aria-label="${escapeHtml(
        t("audio.settings")
      )}" title="${escapeHtml(t("audio.settings"))}">${icon("settings")}</button>
    </div>`;
}

function ensureDock() {
  if (!speech.SUPPORTED) return null;
  const existing = document.getElementById("audio-dock");
  if (existing) {
    dock = existing;
    return dock;
  }
  dock = document.createElement("div");
  dock.id = "audio-dock";
  dock.className = "audio-dock";
  dock.setAttribute("role", "region");
  dock.setAttribute("aria-label", t("audio.label"));
  dock.hidden = true;
  dock.innerHTML = dockMarkup();
  dock.addEventListener("mousedown", (event) => {
    if (event.target.closest("[data-audio-selection]")) event.preventDefault();
  });
  document.body.append(dock);
  return dock;
}

function errorText(state) {
  if (!state.error) return "";
  if (state.error.startsWith("no-voice:")) {
    const language = state.error.split(":")[1];
    return t("audio.noVoice", { lang: t(`audio.${language}`) });
  }
  if (state.error === "disabled") return t("audio.enableFirst");
  if (state.error === "unsupported") return t("audio.unsupported");
  return t("audio.error");
}

function previewOf(state) {
  const text = state.current?.label || state.current?.text || "";
  return text.length > 90 ? `${text.slice(0, 88)}…` : text;
}

function renderDock(state) {
  if (!dock) return;
  const visible = state.supported && state.enabled;
  dock.hidden = !visible;
  document.body.classList.toggle("has-audio-dock", visible);
  if (!visible) return;

  const main = dock.querySelector("[data-audio-main]");
  const status = dock.querySelector("[data-audio-status]");
  const progress = dock.querySelector("[data-audio-progress]");
  const previous = dock.querySelector("[data-audio-prev]");
  const next = dock.querySelector("[data-audio-next]");
  const stop = dock.querySelector("[data-audio-stop]");

  let action = "play";
  let label = t("audio.readPage");
  if (state.playing && state.paused) {
    action = "play";
    label = t("audio.resume");
  } else if (state.playing) {
    action = "pause";
    label = t("audio.pause");
  }
  main.innerHTML = `${icon(action)}<span>${escapeHtml(label)}</span>`;
  main.setAttribute("aria-label", label);
  main.setAttribute("aria-pressed", String(state.playing && !state.paused));

  let message = t("audio.ready");
  if (state.error) message = errorText(state);
  else if (state.playing && state.paused) message = t("audio.paused", { text: previewOf(state) });
  else if (state.playing) message = t("audio.reading", { text: previewOf(state) });
  else if (state.finished) message = t("audio.finished");
  status.textContent = message;

  const percent = state.total ? ((state.index + 1) / state.total) * 100 : 0;
  progress.style.width = `${state.playing ? Math.min(100, Math.max(0, percent)) : 0}%`;

  previous.disabled = !state.playing || state.index <= 0;
  next.disabled = !state.playing || state.index >= state.total - 1;
  stop.disabled = !state.playing;
}

/* ---------------- Modal controls ---------------- */

function decorateModals() {
  if (!speech.getState().enabled) {
    document.querySelectorAll("[data-modal-audio]").forEach((bar) => bar.remove());
    return;
  }
  document.querySelectorAll(".modal").forEach((modal) => {
    if (modal.classList.contains("modal-settings")) return;
    if (modal.querySelector("[data-modal-audio]")) return;
    const body = modal.querySelector(".modal-body");
    if (!body) return;
    const bar = document.createElement("div");
    bar.className = "modal-audio";
    bar.setAttribute("data-modal-audio", "");
    bar.innerHTML = `
      <button class="btn btn-ghost btn-sm" type="button" data-modal-audio-main>
        ${icon("play")}<span>${escapeHtml(t("audio.readDialog"))}</span>
      </button>
      <button class="icon-btn" type="button" data-modal-audio-stop aria-label="${escapeHtml(
        t("audio.stop")
      )}" title="${escapeHtml(t("audio.stop"))}">${icon("stop")}</button>`;
    body.prepend(bar);
  });
}

function renderModalBars(state) {
  document.querySelectorAll("[data-modal-audio]").forEach((bar) => {
    const modal = bar.closest(".modal");
    const main = bar.querySelector("[data-modal-audio-main]");
    const stop = bar.querySelector("[data-modal-audio-stop]");
    if (!modal || !main) return;
    const active =
      state.playing &&
      state.source === "modal" &&
      state.current?.el &&
      modal.contains(state.current.el);
    const label = active
      ? state.paused
        ? t("audio.resume")
        : t("audio.pause")
      : t("audio.readDialog");
    main.innerHTML = `${icon(active && !state.paused ? "pause" : "play")}<span>${escapeHtml(label)}</span>`;
    main.disabled = false;
    stop.disabled = !active;
  });
}

/* ---------------- Inline read buttons ---------------- */

function inlineEligible(element) {
  if (!element || !element.isConnected) return false;
  if (element.closest(INLINE_SKIP)) return false;
  if (element.closest(".modal")?.classList.contains("modal-settings")) return false;
  if (element.matches(".modal h2")) return false;
  if (element.getClientRects().length === 0) return false;
  if (element.querySelector("button, a, input, select, textarea")) return false;
  return speech.textOf(element).length >= 8;
}

function enhance(scope) {
  if (!scope || !speech.getState().enabled) return;
  scope.querySelectorAll(INLINE_SELECTOR).forEach((element) => {
    const existing = Array.from(element.children).some((child) =>
      child.classList.contains("tts-inline")
    );
    if (existing || !inlineEligible(element)) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tts-inline";
    button.setAttribute("data-tts-inline", "");
    button.setAttribute("aria-label", t("audio.readBlock"));
    button.setAttribute("title", t("audio.readBlock"));
    button.innerHTML = icon("speaker");
    element.append(button);
    element.setAttribute("data-tts-host", "1");
  });
}

function enhanceAll() {
  if (!speech.getState().enabled) {
    document.querySelectorAll(".tts-inline").forEach((button) => button.remove());
    document.querySelectorAll("[data-tts-host]").forEach((element) => {
      element.removeAttribute("data-tts-host");
    });
    return;
  }
  const view = document.getElementById("view");
  if (view) enhance(view);
  document.querySelectorAll(".modal:not(.modal-settings) .modal-body").forEach(enhance);
}

/* ---------------- Reading actions ---------------- */

function readPage() {
  const state = speech.getState();
  if (!state.enabled) {
    openSettings("audio");
    return;
  }
  const modal = document.querySelector(".modal:not(.modal-settings)");
  const scope = modal || document.getElementById("view");
  if (!scope) return;
  const segments = speech.collectSegments(scope);
  if (segments.length) speech.speak(segments, { source: modal ? "modal" : "page" });
}

function toggleMain() {
  const state = speech.getState();
  if (state.playing) {
    if (state.paused) speech.resume();
    else speech.pause();
    return;
  }
  readPage();
}

function readDialog(modal) {
  const state = speech.getState();
  if (!state.enabled) {
    openSettings("audio");
    return;
  }
  const active =
    state.playing &&
    state.source === "modal" &&
    state.current?.el &&
    modal.contains(state.current.el);
  if (active) {
    if (state.paused) speech.resume();
    else speech.pause();
    return;
  }
  const segments = speech.collectSegments(modal);
  if (segments.length) speech.speak(segments, { source: "modal" });
}

function readBlock(host) {
  if (!host) return;
  const state = speech.getState();
  if (!state.enabled) {
    openSettings("audio");
    return;
  }
  const segment = speech.segmentFor(host);
  if (!segment) return;
  speech.speak([segment], {
    source: host.closest(".modal") ? "modal" : "page",
  });
}

function selectionText() {
  const selection = window.getSelection?.();
  if (!selection || selection.isCollapsed || !selection.rangeCount) return "";
  const text = selection.toString().replace(/\s+/g, " ").trim();
  if (text.length < 2) return "";
  const node = selection.anchorNode;
  const element = node?.nodeType === 1 ? node : node?.parentElement;
  if (!element) return "";
  if (!element.closest("#view, .modal-body")) return "";
  if (element.closest("input, textarea, select, [contenteditable='true']")) return "";
  return text.slice(0, 4000);
}

function readSelection() {
  const state = speech.getState();
  if (!state.enabled) {
    openSettings("audio");
    return;
  }
  const text = selectionText();
  if (!text) return;
  speech.speak([{ text, lang: speech.languageFor(text) }], { source: "selection" });
}

function updateSelectionButton() {
  if (!dock) return;
  const button = dock.querySelector("[data-audio-selection]");
  if (button) button.disabled = !selectionText();
}

/* ---------------- Events ---------------- */

function onDocumentClick(event) {
  const dockButton = event.target.closest("#audio-dock");
  if (dockButton) {
    if (event.target.closest("[data-audio-main]")) toggleMain();
    else if (event.target.closest("[data-audio-prev]")) speech.previous();
    else if (event.target.closest("[data-audio-next]")) speech.next();
    else if (event.target.closest("[data-audio-stop]")) speech.stop();
    else if (event.target.closest("[data-audio-selection]")) readSelection();
    else if (event.target.closest("[data-audio-settings]")) openSettings("audio");
    return;
  }

  const modalBar = event.target.closest("[data-modal-audio]");
  if (modalBar) {
    const modal = modalBar.closest(".modal");
    if (event.target.closest("[data-modal-audio-main]") && modal) readDialog(modal);
    else if (event.target.closest("[data-modal-audio-stop]")) speech.stop();
    return;
  }

  const inline = event.target.closest("[data-tts-inline]");
  if (inline) {
    readBlock(inline.closest("[data-tts-host='1']"));
  }
}

function observe() {
  if (observer) return;
  const run = debounce(() => {
    const state = speech.getState();
    const currentElement = state.current?.el;
    if (state.playing && currentElement && !currentElement.isConnected) {
      speech.stop();
    }
    enhanceAll();
    decorateModals();
  }, 90);

  observer = new MutationObserver(run);
  const view = document.getElementById("view");
  const modalRoot = document.getElementById("modal-root");
  if (view) observer.observe(view, { childList: true, subtree: true });
  if (modalRoot) observer.observe(modalRoot, { childList: true, subtree: true });
}

/* ---------------- Boot ---------------- */

export function initAudioUI() {
  if (initialized || !speech.SUPPORTED) return;
  initialized = true;
  ensureDock();
  observe();

  speech.subscribe((state) => {
    renderDock(state);
    renderModalBars(state);
    if (state.enabled !== lastEnabled) {
      lastEnabled = state.enabled;
      enhanceAll();
      decorateModals();
      updateSelectionButton();
    }
  });

  document.addEventListener("click", onDocumentClick);
  document.addEventListener(
    "selectionchange",
    debounce(() => {
      clearTimeout(selectionTimer);
      selectionTimer = setTimeout(updateSelectionButton, 60);
    }, 120)
  );

  window.addEventListener(LANG_EVENT, () => {
    document.querySelectorAll(".tts-inline").forEach((button) => button.remove());
    document.querySelectorAll("[data-modal-audio]").forEach((bar) => bar.remove());
    const previous = document.getElementById("audio-dock");
    if (previous) previous.remove();
    dock = null;
    ensureDock();
    renderDock(speech.getState());
    enhanceAll();
    decorateModals();
  });

  enhanceAll();
  decorateModals();
  updateSelectionButton();
}
