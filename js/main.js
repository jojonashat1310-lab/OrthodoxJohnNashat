import { $, store, initReveals, closeModal } from "./lib/dom.js";
import { initLanguage, applyStatic, t, LANG_EVENT } from "./i18n.js";
import { openSettings } from "./lib/settings.js";
import { initAudioUI } from "./lib/audio-ui.js";
import { stop as stopSpeech, getState as getSpeechState } from "./lib/speech.js";
import * as home from "./pages/home.js";
import * as faith from "./pages/faith.js";
import * as bible from "./pages/bible.js";
import * as saints from "./pages/saints.js";
import * as seasons from "./pages/seasons.js";
import * as historyPage from "./pages/history.js";
import * as learn from "./pages/learn.js";
import * as about from "./pages/about.js";

const routes = { home, faith, bible, saints, seasons, history: historyPage, learn, about };

const view = $("#view");
const header = $("#site-header");
const themeToggle = $("#theme-toggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');
const mobileMenu = $("#mobile-menu");
const menuToggle = $("#menu-toggle");

let currentPage = null;
let currentKey = "";
let routeSeq = 0;

initLanguage();

/* ---------------- Theme ---------------- */

function applyTheme(theme, persist = true) {
  document.documentElement.dataset.theme = theme;
  if (themeMeta) themeMeta.setAttribute("content", theme === "dark" ? "#12100c" : "#f7f1e4");
  if (themeToggle) {
    const label = theme === "dark" ? t("theme.switchLight") : t("theme.switchDark");
    themeToggle.setAttribute("aria-label", label);
    themeToggle.setAttribute("title", t("theme.title"));
  }
  if (persist) store.set("theme", theme);
}

const savedTheme = store.get("theme");
const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme || (prefersDark ? "dark" : "light"), false);

themeToggle?.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
});

/* ---------------- Header & mobile menu ---------------- */

let scrollTicking = false;

function updateHeader() {
  if (!header) return;
  const solid = currentKey !== "home" || window.scrollY > 40;
  header.classList.toggle("is-solid", solid);
  scrollTicking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(updateHeader);
  },
  { passive: true }
);

let menuCloseTimer = 0;

function openMenu() {
  clearTimeout(menuCloseTimer);
  mobileMenu.hidden = false;
  // Force a frame so the transform transition runs from the closed position.
  void mobileMenu.offsetHeight;
  mobileMenu.classList.add("is-open");
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", t("menu.close"));
  document.body.classList.add("no-scroll");
  $("#menu-close")?.focus({ preventScroll: true });
}

function closeMenu({ restoreFocus = true } = {}) {
  if (!mobileMenu || mobileMenu.hidden) return;
  mobileMenu.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", t("menu.open"));
  document.body.classList.remove("no-scroll");
  menuCloseTimer = setTimeout(() => {
    if (!mobileMenu.classList.contains("is-open")) mobileMenu.hidden = true;
  }, 450);
  if (restoreFocus) menuToggle.focus({ preventScroll: true });
}

menuToggle?.addEventListener("click", () => {
  if (mobileMenu.hidden) openMenu();
  else closeMenu();
});
$("#menu-close")?.addEventListener("click", () => closeMenu());
mobileMenu?.addEventListener("click", (event) => {
  if (event.target === mobileMenu) closeMenu();
});
mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => closeMenu({ restoreFocus: false })));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mobileMenu && !mobileMenu.hidden) closeMenu();
});

/* ---------------- Settings ---------------- */

$("#settings-btn")?.addEventListener("click", openSettings);
$("#mobile-settings")?.addEventListener("click", () => {
  closeMenu({ restoreFocus: false });
  openSettings();
});

/* ---------------- Router ---------------- */

function parseRoute() {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const [path, query = ""] = raw.split("?");
  const key = (path || "home").toLowerCase();
  return { key, params: new URLSearchParams(query) };
}

function setActiveNav(key) {
  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === key) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function scrollToTop() {
  const html = document.documentElement;
  const previous = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  html.style.scrollBehavior = previous;
}

function renderError() {
  view.innerHTML = `
    <div class="page">
      <section class="page-hero">
        <div class="container">
          <p class="eyebrow">${t("error.eyebrow")}</p>
          <h1>${t("error.title")}</h1>
          <p class="lead">${t("error.lead")}</p>
          <div class="verse-actions">
            <button class="btn btn-primary" type="button" onclick="window.location.reload()">${t("error.reload")}</button>
            <a class="btn btn-ghost" href="#/">${t("error.home")}</a>
          </div>
        </div>
      </section>
    </div>`;
}

async function renderRoute({ focus = false, preserveScroll = false } = {}) {
  const seq = ++routeSeq;
  const { key, params } = parseRoute();
  const known = key in routes;

  if (!known) {
    window.history.replaceState(null, "", "#/");
    renderRoute({ focus });
    return;
  }

  const module = routes[key];

  closeModal();
  closeMenu({ restoreFocus: false });
  if (getSpeechState().playing) stopSpeech();
  if (currentPage && typeof currentPage.cleanup === "function") {
    try {
      currentPage.cleanup();
    } catch {
      /* a failing cleanup should not block navigation */
    }
  }

  currentKey = key;
  currentPage = module;
  document.body.dataset.page = key;

  view.innerHTML = "";
  const ctx = Object.fromEntries(params.entries());

  try {
    await module.render(view, ctx);
  } catch (error) {
    console.error("Page render failed", error);
    renderError();
    return;
  }
  if (seq !== routeSeq) return;

  setActiveNav(key);
  document.title = t(`titles.${key}`) || t("titles.home");
  if (!preserveScroll) scrollToTop();
  initReveals(view);
  updateHeader();

  if (focus) view.focus({ preventScroll: true });
}

window.addEventListener("hashchange", () => renderRoute({ focus: true }));

window.addEventListener(LANG_EVENT, () => {
  applyStatic();
  applyTheme(document.documentElement.dataset.theme, false);
  menuToggle?.setAttribute("aria-label", t("menu.open"));
  renderRoute({ preserveScroll: true });
});

/* ---------------- Global helpers ---------------- */

const yearEl = $("#footer-year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// If a deeper route is loaded directly, give it a clean first paint.
if (window.location.hash === "#" || window.location.hash === "#/") {
  window.history.replaceState(null, "", "#/");
}
initAudioUI();
renderRoute();
