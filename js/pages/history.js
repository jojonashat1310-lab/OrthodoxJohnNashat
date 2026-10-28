import { icon } from "../lib/icons.js";
import { pageHero, sectionHead } from "../lib/components.js";
import { escapeHtml } from "../lib/dom.js";
import { isRTL, num, t } from "../i18n.js";
import { pack } from "../data/localized-content.js";

export function render(root) {
  const { timeline, councils, fathers } = pack();

  root.innerHTML = `
    ${pageHero({
      eyebrow: t("history.eyebrow"),
      title: t("history.title"),
      lead: t("history.lead"),
      aside: t("history.aside"),
    })}

    <section class="section-sm">
      <div class="container">
        ${sectionHead({
          eyebrow: t("history.storyEyebrow"),
          title: t("history.storyTitle"),
          lead: t("history.storyLead"),
        })}

        <div class="timeline">
          ${timeline
            .map(
              (item) => `
            <div class="timeline-item">
              <span class="timeline-dot" aria-hidden="true"></span>
              <article class="timeline-card reveal">
                <span class="timeline-year">${escapeHtml(item.year)}</span>
                <h4>${escapeHtml(item.title)}</h4>
                <p>${escapeHtml(item.text)}</p>
                <span class="tag">${escapeHtml(item.tag)}</span>
              </article>
            </div>`
            )
            .join("")}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        ${sectionHead({
          eyebrow: t("history.councilsEyebrow"),
          title: t("history.councilsTitle"),
          lead: t("history.councilsLead"),
        })}
        <div class="councils-grid">
          ${councils
            .map(
              (c) => `
            <article class="council-card reveal">
              <p class="council-year">${escapeHtml(num(c.year))}</p>
              <h4>${escapeHtml(c.name)}</h4>
              <p>${escapeHtml(c.text)}</p>
            </article>`
            )
            .join("")}
        </div>

        <div class="note-panel mt-32 reveal">
          ${icon("info")}
          <div>
            <strong>${t("history.chalcedonTitle")}</strong>
            ${t("history.chalcedonText")}
          </div>
        </div>
      </div>
    </section>

    <section class="image-band">
      <img src="assets/img/manuscript.jpg" alt="${escapeHtml(t("history.manuscriptAlt"))}" loading="lazy" />
      <div class="container">
        <div class="image-band-content reveal">
          <p class="eyebrow">${t("history.desertEyebrow")}</p>
          <h2>${t("history.desertTitle")}</h2>
          <p>${t("history.desertText")}</p>
          <div class="hero-actions">
            <a class="btn btn-light" href="#/saints">${t("history.meetFathers")} ${icon("arrowRight", "arrow")}</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        ${sectionHead({
          eyebrow: t("history.fathersEyebrow"),
          title: t("history.fathersTitle"),
          lead: t("history.fathersLead"),
        })}
        <div class="fathers-grid">
          ${fathers
            .slice(0, 3)
            .map(
              (f) => `
            <article class="father-card reveal">
              <blockquote>${isRTL() ? `«${escapeHtml(f.quote)}»` : `“${escapeHtml(f.quote)}”`}</blockquote>
              <cite>${escapeHtml(f.cite)}</cite>
            </article>`
            )
            .join("")}
        </div>

        <div class="container-narrow">
          <blockquote class="quote-block mt-40 reveal">
            ${isRTL() ? `«${escapeHtml(fathers[3].quote)}»` : `“${escapeHtml(fathers[3].quote)}”`}
            <footer>${escapeHtml(fathers[3].cite)}</footer>
          </blockquote>
        </div>

        <div class="verse-actions">
          <a class="btn btn-primary" href="#/learn">${t("history.study")} ${icon("arrowRight", "arrow")}</a>
        </div>
      </div>
    </section>`;
}

export function cleanup() {}
