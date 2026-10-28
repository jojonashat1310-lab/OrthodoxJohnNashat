import { icon } from "../lib/icons.js";
import { pageHero, sectionHead } from "../lib/components.js";
import { openModal, escapeHtml } from "../lib/dom.js";
import { isRTL, t, pad2 } from "../i18n.js";
import { pack } from "../data/localized-content.js";

function openSacrament(sacrament, index, { creedLabel }) {
  const body = document.createElement("div");
  body.innerHTML = `
    ${!isRTL() && sacrament.ar ? `<p class="sacrament-ar ar" lang="ar" dir="rtl">${escapeHtml(sacrament.ar)}</p>` : ""}
    <p class="lead"><strong>${escapeHtml(sacrament.tagline)}</strong> ${escapeHtml(sacrament.desc)}</p>
    <h4>${t("faith.theology")}</h4>
    ${sacrament.theology.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}
    <h4>${t("faith.scripture")}</h4>
    <ul class="scripture-list">
      ${sacrament.scripture.map((ref) => `<li>${escapeHtml(ref)}</li>`).join("")}
    </ul>
    <h4>${t("faith.practice")}</h4>
    <p>${escapeHtml(sacrament.practice)}</p>
    <div class="note-panel">
      ${icon("info")}
      <div><strong>${t("faith.seekerNote")}</strong><br />${escapeHtml(sacrament.note)}</div>
    </div>`;
  openModal({
    eyebrow: t("faith.sacramentEyebrow", { n: pad2(index + 1) }),
    title: sacrament.name,
    body,
    wide: true,
  });
  return creedLabel;
}

export function render(root) {
  const { creed, sacraments, worship } = pack();
  const creedLabel = isRTL() ? t("faith.creedLabelFallback") : creed.label;

  root.innerHTML = `
    ${pageHero({
      eyebrow: t("faith.eyebrow"),
      title: t("faith.title"),
      lead: t("faith.lead"),
      aside: t("faith.aside"),
    })}

    <section class="section-sm">
      <div class="container">
        <div class="creed-layout">
          <article class="creed-panel reveal">
            <p class="creed-label">${icon("scroll")} ${escapeHtml(creedLabel)}</p>
            <div class="creed-text">
              ${creed.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}
            </div>
          </article>
          <aside class="creed-aside">
            <div class="creed-aside-card reveal">
              <h4>${t("faith.prayedTitle")}</h4>
              <p>${escapeHtml(creed.intro)}</p>
            </div>
            ${
              !isRTL()
                ? `<div class="creed-aside-card reveal">
              <h4>${t("faith.arabicTitle")}</h4>
              <p class="creed-arabic" lang="ar" dir="rtl">${escapeHtml(creed.arabic)}</p>
              <p class="small muted mt-16">${escapeHtml(creed.arabicNote)}</p>
            </div>`
                : ""
            }
            <div class="creed-aside-card reveal">
              <h4>${t("faith.wordTitle")}</h4>
              <p>${escapeHtml(creed.note)}</p>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        ${sectionHead({
          eyebrow: t("faith.sacramentsEyebrow"),
          title: t("faith.sacramentsTitle"),
          lead: t("faith.sacramentsLead"),
        })}
        <div class="sacrament-grid">
          ${sacraments
            .map(
              (s, i) => `
            <button class="sacrament-card reveal" type="button" data-sacrament="${escapeHtml(s.id)}">
              <span class="sacrament-top">
                <span class="sacrament-icon">${icon(s.icon)}</span>
                <span class="sacrament-num">${pad2(i + 1)}</span>
              </span>
              <span>
                <span class="sacrament-name">${escapeHtml(s.name)}</span>
                ${!isRTL() && s.ar ? `<span class="sacrament-ar ar" lang="ar" dir="rtl">${escapeHtml(s.ar)}</span>` : ""}
              </span>
              <span class="sacrament-desc">${escapeHtml(s.desc)}</span>
              <span class="sacrament-more">${t("faith.explore")} ${icon("arrowRight")}</span>
            </button>`
            )
            .join("")}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        ${sectionHead({
          eyebrow: t("faith.worshipEyebrow"),
          title: t("faith.worshipTitle"),
          lead: t("faith.worshipLead"),
        })}
        <div class="worship-grid">
          ${worship
            .map(
              (w) => `
            <article class="worship-card reveal">
              <span class="card-icon">${icon(w.icon)}</span>
              <h3>${escapeHtml(w.title)}</h3>
              <p>${escapeHtml(w.text)}</p>
              <ul class="worship-list">
                ${w.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
              </ul>
            </article>`
            )
            .join("")}
        </div>

        <div class="note-panel mt-32 reveal">
          ${icon("heart")}
          <div>
            <strong>${t("faith.teacherTitle")}</strong>
            ${t("faith.teacherText")}
          </div>
        </div>

        <div class="verse-actions">
          <a class="btn btn-primary" href="#/learn">${t("faith.study")} ${icon("arrowRight", "arrow")}</a>
        </div>
      </div>
    </section>`;

  root.querySelectorAll("[data-sacrament]").forEach((card) => {
    card.addEventListener("click", () => {
      const index = sacraments.findIndex((s) => s.id === card.dataset.sacrament);
      if (index >= 0) openSacrament(sacraments[index], index, { creedLabel });
    });
  });
}

export function cleanup() {}
