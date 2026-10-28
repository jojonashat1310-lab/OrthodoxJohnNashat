import { icon, copticCross } from "./icons.js";
import { escapeHtml, openModal } from "./dom.js";
import { isRTL, t } from "../i18n.js";

const MONOGRAMS = {
  mark: "Mk",
  anthony: "An",
  athanasius: "Ath",
  pachomius: "Pch",
  macarius: "Mak",
  cyril: "Cyr",
  demiana: "Dem",
  "mary-of-egypt": "Mry",
  george: "G",
  bishoy: "B",
  shenouda: "Sh",
  nicholas: "N",
  "cyril-vi": "C6",
};

const ARABIC_MONOGRAMS = {
  mark: "مر",
  anthony: "أن",
  athanasius: "أث",
  pachomius: "با",
  macarius: "مق",
  cyril: "كي",
  demiana: "دم",
  "mary-of-egypt": "مي",
  george: "جر",
  bishoy: "بي",
  shenouda: "شن",
  nicholas: "ني",
  "cyril-vi": "ك٦",
};

export function monogram(saint) {
  if (isRTL()) {
    if (ARABIC_MONOGRAMS[saint.id]) return ARABIC_MONOGRAMS[saint.id];
    const words = String(saint.name)
      .split(/\s+/)
      .filter((w) => !["القديس", "القديسة", "مار", "البابا", "الأنبا", "من", "ال"].includes(w));
    return (words[0]?.[0] || "ق") + (words[1]?.[0] || "");
  }
  if (MONOGRAMS[saint.id]) return MONOGRAMS[saint.id];
  const words = saint.name.replace(/^St\.\s*/, "").split(/\s+/).filter((w) => !["the", "of"].includes(w));
  return (words[0]?.[0] || "S") + (words[1]?.[0] || "");
}

export function pageHero({ eyebrow = "", title = "", lead = "", aside = "" } = {}) {
  return `
    <div class="page">
      <section class="page-hero">
        <div class="container">
          <div class="page-hero-row">
            <div>
              ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ""}
              <h1>${title}</h1>
              ${lead ? `<p class="lead">${lead}</p>` : ""}
            </div>
            ${aside ? `<aside class="page-hero-aside">${aside}</aside>` : ""}
          </div>
        </div>
      </section>`;
}

export function sectionHead({ eyebrow = "", title = "", lead = "", center = false, id = "" } = {}) {
  return `
    <div class="section-head${center ? " section-head-center" : ""}"${id ? ` id="${id}"` : ""}>
      ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ""}
      <h2>${title}</h2>
      ${lead ? `<p class="lead">${lead}</p>` : ""}
    </div>`;
}

export function saintCardMarkup(saint, { reveal = true } = {}) {
  return `
    <button type="button" class="saint-card${reveal ? " reveal" : ""}" data-saint="${escapeHtml(saint.id)}">
      <span class="saint-head">
        <span class="saint-mono" aria-hidden="true">${escapeHtml(monogram(saint))}</span>
        <span class="saint-names">
          <span class="saint-name">${escapeHtml(saint.name)}</span>
          ${!isRTL() && saint.ar ? `<span class="saint-ar ar">${escapeHtml(saint.ar)}</span>` : ""}
        </span>
      </span>
      <span class="saint-meta">
        <span>${escapeHtml(t(`tags.${saint.tag}`) || saint.tag)}</span>
        <span class="dot" aria-hidden="true"></span>
        <span>${escapeHtml(saint.years)}</span>
      </span>
      <span class="saint-line">${escapeHtml(saint.summary)}</span>
      <span class="saint-card-foot">
        <span>${escapeHtml(t("components.feast", { feast: saint.feast }))}</span>
        ${icon("arrowRight")}
      </span>
    </button>`;
}

export function openSaint(saint) {
  const body = document.createElement("div");
  body.innerHTML = `
    <div class="saint-detail-grid">
      <aside class="saint-detail-portrait">
        <span class="saint-mono" aria-hidden="true">${escapeHtml(monogram(saint))}</span>
        ${!isRTL() && saint.ar ? `<p class="ar" lang="ar" dir="rtl">${escapeHtml(saint.ar)}</p>` : ""}
        <p class="saint-detail-feast">${escapeHtml(t("components.feast", { feast: saint.feast }))}</p>
        <p class="small muted">${escapeHtml(saint.years)}</p>
      </aside>
      <div class="saint-detail-body">
        ${saint.life.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}
        ${
          saint.quote
            ? `<blockquote class="saint-quote">${
                isRTL() ? `«${escapeHtml(saint.quote)}»` : `“${escapeHtml(saint.quote)}”`
              }${saint.source ? `<cite>${escapeHtml(saint.source)}</cite>` : ""}</blockquote>`
            : ""
        }
        <div class="note-panel saint-legacy">
          ${icon("heart")}
          <div><strong>${escapeHtml(t("components.legacy"))}</strong><br />${escapeHtml(saint.legacy)}</div>
        </div>
      </div>
    </div>`;
  openModal({
    eyebrow: `${escapeHtml(t(`tags.${saint.tag}`) || saint.tag)} · ${escapeHtml(saint.years)}`,
    title: saint.name,
    body,
    wide: true,
  });
}

export function copticMark(className = "") {
  return `<span class="ornament ${className}" aria-hidden="true">${copticCross()}</span>`;
}
