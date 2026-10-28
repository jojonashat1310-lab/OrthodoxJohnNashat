import { icon } from "../lib/icons.js";
import { pageHero, sectionHead } from "../lib/components.js";
import { escapeHtml } from "../lib/dom.js";
import { isRTL, pad2, t } from "../i18n.js";
import { CONFIG } from "../config.js";
import { pack } from "../data/localized-content.js";

export function render(root) {
  const { principles, aboutStory } = pack();

  root.innerHTML = `
    ${pageHero({
      eyebrow: t("about.eyebrow"),
      title: t("about.title"),
      lead: t("about.lead"),
      aside: t("about.aside"),
    })}

    <section class="section-sm">
      <div class="container">
        <div class="founder-profile reveal">
          <div class="monogram-seal" aria-hidden="true"><span>${isRTL() ? "جن" : "JN"}</span></div>
          <div>
            <h2 class="profile-name">${t("about.founderName")}</h2>
            <p class="profile-role">${t("about.founderRole")}</p>
            <p class="profile-text">${t("about.founderText")}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container-narrow">
        <p class="eyebrow">${t("about.whyEyebrow")}</p>
        <h2>${t("about.whyTitle")}</h2>
        <div class="mt-24">
          ${aboutStory
            .map((paragraph, i) => `<p class="${i === 0 ? "dropcap lead" : "lead mt-16"}">${escapeHtml(paragraph)}</p>`)
            .join("")}
        </div>
        <div class="ornament mt-32" aria-hidden="true">${icon("cross")}</div>
      </div>
    </section>

    <section class="section features-section">
      <div class="container">
        ${sectionHead({
          eyebrow: t("about.principlesEyebrow"),
          title: t("about.principlesTitle"),
          lead: t("about.principlesLead"),
        })}
        <div class="principles-grid">
          ${principles
            .map(
              (principle, i) => `
            <article class="principle reveal">
              <p class="p-num">${pad2(i + 1)}</p>
              <h4>${escapeHtml(principle.title)}</h4>
              <p>${escapeHtml(principle.text)}</p>
            </article>`
            )
            .join("")}
        </div>
      </div>
    </section>

    <section class="section-sm">
      <div class="container">
        <div class="split">
          <div class="contact-panel reveal">
            <p class="eyebrow">${t("about.contactEyebrow")}</p>
            <h3>${t("about.contactTitle")}</h3>
            <p>${t("about.contactText")}</p>
            ${
              CONFIG.contactEmail
                ? `<a class="btn btn-primary" href="mailto:${CONFIG.contactEmail}">${icon("send")} ${t("about.write")}</a>`
                : ""
            }
            <a class="text-link" href="#/learn">${t("about.exploreLessons")} ${icon("arrowRight")}</a>
          </div>

          <div class="note-panel reveal">
            ${icon("shield")}
            <div>
              <strong>${t("about.transparencyTitle")}</strong>
              <p class="mt-16">${t("about.transparencyText1")}</p>
              <p class="mt-16">${t("about.transparencyText2")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>`;
}

export function cleanup() {}
