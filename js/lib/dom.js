import { icon } from "./icons.js";
import { dateLocale, t } from "../i18n.js";

const PREFIX = "ojn.";

export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function debounce(fn, wait = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

export const store = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      /* storage may be unavailable */
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch {
      /* ignore */
    }
  },
};

export function toast(message, iconName = "info", duration = 4200) {
  const region = document.getElementById("toast-region");
  if (!region) return;
  const node = document.createElement("div");
  node.className = "toast";
  node.innerHTML = `${icon(iconName)}<span></span>`;
  node.querySelector("span").textContent = message;
  region.append(node);
  const remove = () => {
    node.classList.add("is-leaving");
    setTimeout(() => node.remove(), 320);
  };
  const timer = setTimeout(remove, duration);
  node.addEventListener("click", () => {
    clearTimeout(timer);
    remove();
  });
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.append(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

export function formatDate(date, options = {}) {
  return new Intl.DateTimeFormat(dateLocale(), {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  }).format(date);
}

export function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function daysBetween(a, b) {
  return Math.round((startOfDay(b) - startOfDay(a)) / 86400000);
}

export function initReveals(scope = document) {
  const items = $$(".reveal:not(.is-visible)", scope);
  if (!items.length) return;
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
  );
  items.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------
   Modal
   --------------------------------------------------------- */

let activeModal = null;
let lastFocused = null;

export function openModal({ eyebrow = "", title = "", body = "", actions = [], wide = false, className = "", onClose = null } = {}) {
  closeModal();
  lastFocused = document.activeElement;
  const root = document.getElementById("modal-root");
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal ${wide ? "modal-lg" : ""} ${className}" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button class="icon-btn modal-close" type="button" aria-label="${t("components.closeDialog")}">${icon("close")}</button>
      ${eyebrow ? `<p class="eyebrow modal-eyebrow">${eyebrow}</p>` : ""}
      <h2 id="modal-title"></h2>
      <div class="modal-body"></div>
    </div>`;
  overlay.querySelector("#modal-title").textContent = title;
  const bodyEl = overlay.querySelector(".modal-body");
  if (body instanceof Node) bodyEl.append(body);
  else bodyEl.innerHTML = body;

  const actionWrap = document.createElement("div");
  actionWrap.className = "modal-actions";
  actions.forEach((action) => {
    const node = document.createElement(action.href ? "a" : "button");
    node.className = `btn ${action.variant || "btn-ghost"}`;
    if (action.href) node.href = action.href;
    else node.type = "button";
    node.innerHTML = `${action.icon ? icon(action.icon) : ""}<span>${escapeHtml(action.label)}</span>`;
    node.addEventListener("click", (event) => {
      if (action.onClick) {
        event.preventDefault();
        action.onClick();
      }
    });
    actionWrap.append(node);
  });
  if (actions.length) bodyEl.append(actionWrap);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeModal();
  });
  overlay.querySelector(".modal-close").addEventListener("click", closeModal);

  const onKeydown = (event) => {
    if (event.key === "Escape") {
      closeModal();
      return;
    }
    if (event.key !== "Tab") return;
    const focusables = Array.from(
      overlay.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
    ).filter((el) => el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  document.addEventListener("keydown", onKeydown);
  root.append(overlay);
  document.body.classList.add("no-scroll");
  activeModal = { overlay, onKeydown, onClose };
  requestAnimationFrame(() => {
    const target = overlay.querySelector(".modal-close");
    if (target) target.focus({ preventScroll: true });
  });
  return { overlay, body: bodyEl, close: closeModal };
}

export function closeModal() {
  if (!activeModal) return;
  const { overlay, onKeydown, onClose } = activeModal;
  document.removeEventListener("keydown", onKeydown);
  overlay.remove();
  activeModal = null;
  document.body.classList.remove("no-scroll");
  if (lastFocused && lastFocused.isConnected) lastFocused.focus({ preventScroll: true });
  if (typeof onClose === "function") onClose();
}

export function confirmDialog({ title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", danger = false }) {
  return new Promise((resolve) => {
    const { close } = openModal({
      eyebrow: "",
      title,
      body: `<p>${message}</p>`,
      actions: [
        { label: cancelLabel, variant: "btn-ghost", onClick: () => { close(); resolve(false); } },
        { label: confirmLabel, variant: danger ? "btn-wine" : "btn-primary", onClick: () => { close(); resolve(true); } },
      ],
    });
  });
}
