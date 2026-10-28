import { icon } from "../lib/icons.js";
import { saintCardMarkup, openSaint } from "../lib/components.js";
import { upcomingFeasts, countdownLabel, formatShort } from "../lib/feasts.js";
import { escapeHtml, daysBetween, startOfDay } from "../lib/dom.js";
import { isRTL, t, pad2 } from "../i18n.js";
import { pack } from "../data/localized-content.js";

function verseOfDay(verses) {
  const now = startOfDay(new Date());
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const index = Math.floor(daysBetween(yearStart, now)) % verses.length;
  return verses[index];
}

export function render(root) {
  const { stats, verses, features, feasts, saints } = pack();
  const verse = verseOfDay(verses);
  const next = upcomingFeasts(feasts, 1)[0];
  const preview = ["mark", "anthony", "demiana"].map((id) => saints.find((s) => s.id === id)).filter(Boolean);
  const version = isRTL() ? t("home.svd") : t("home.kjv");

  root.innerHTML = `
    <section class="hero">
      <div class="hero-media">
        <img src="assets/img/hero-church.jpg" alt="${escapeHtml(t("home.heroAlt"))}" fetchpriority="high" />
      </div>
      <div class="hero-overlay"></div>
      <div class="hero-inner">
        <div class="hero-content">
          <p class="hero-eyebrow">${icon("cross")} ${t("home.eyebrow")}</p>
          <h1 class="hero-title">${t("home.title")}</h1>
          <p class="hero-sub">${t("home.sub")}</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#/bible">${icon("bookOpen")} ${t("home.readBible")}</a>
            <a class="btn btn-glass" href="#/faith">${t("home.exploreFaith")} ${icon("arrowRight", "arrow")}</a>
          </div>
          <div class="hero-foot">
            <strong>${t("home.founderLine")}</strong>
            <span class="dot" aria-hidden="true"></span>
            <span>${t("home.rooted")}</span>
          </div>
        </div>
        <aside class="hero-verse" aria-label="${escapeHtml(t("home.verseAria"))}">
          ${icon("quote")}
          <blockquote class="hero-verse-quote">${escapeHtml(verse.text)}</blockquote>
          <p class="hero-verse-ref">${escapeHtml(verse.ref)} · ${escapeHtml(version)}</p>
        </aside>
      </div>
      <button class="hero-scroll" type="button" data-scroll="welcome">
        ${t("home.begin")}
        <span aria-hidden="true"></span>
      </button>
    </section>

    <div class="container stats-wrap">
      <div class="stats-strip">
        ${stats
          .map(
            (s) => `
          <div class="stat">
            <p class="stat-num">${escapeHtml(s.num)}${s.suffix ? `<small>${escapeHtml(s.suffix)}</small>` : ""}</p>
            <p class="stat-label">${escapeHtml(s.label)}</p>
          </div>`
          )
          .join("")}
      </div>
    </div>

    <section class="section" id="welcome">
      <div class="container welcome-grid">
        <div class="welcome-copy reveal">
          <p class="eyebrow">${t("home.welcomeEyebrow")}</p>
          <h2>${t("home.welcomeTitle")}</h2>
          <p class="lead">${t("home.welcomeLead1")}</p>
          <p class="lead">${t("home.welcomeLead2")}</p>
          <div class="welcome-points">
            <div class="point">
              <span class="point-icon">${icon("bookOpen")}</span>
              <div><strong>${t("home.point1Title")}</strong><p>${t("home.point1Text")}</p></div>
            </div>
            <div class="point">
              <span class="point-icon">${icon("users")}</span>
              <div><strong>${t("home.point2Title")}</strong><p>${t("home.point2Text")}</p></div>
            </div>
            <div class="point">
              <span class="point-icon">${icon("dove")}</span>
              <div><strong>${t("home.point3Title")}</strong><p>${t("home.point3Text")}</p></div>
            </div>
          </div>
          <div class="verse-actions">
            <a class="btn btn-ghost" href="#/about">${t("home.aboutPlatform")} ${icon("arrowRight", "arrow")}</a>
          </div>
        </div>

        <aside class="founder-card reveal">
          <p class="eyebrow">${t("home.founderEyebrow")}</p>
          <p class="founder-quote">${t("home.founderQuote")}</p>
          <div class="founder-sign">
            <span class="founder-mono" aria-hidden="true">${escapeHtml(t("home.monogram"))}</span>
            <div>
              <p class="founder-name">${t("home.founderName")}</p>
              <p class="founder-role">${t("home.founderRole")}</p>
            </div>
          </div>
          <div class="ornament" aria-hidden="true">${icon("cross")}</div>
        </aside>
      </div>
    </section>

    <section class="section features-section">
      <div class="container">
        <div class="section-head section-head-center reveal">
          <p class="eyebrow">${t("home.featuresEyebrow")}</p>
          <h2>${t("home.featuresTitle")}</h2>
          <p class="lead">${t("home.featuresLead")}</p>
        </div>
        <div class="feature-grid">
          ${features
            .map(
              (f, i) => `
            <a class="feature-card reveal" href="${f.href}">
              <span class="feature-num">${pad2(i + 1)}</span>
              <span class="card-icon">${icon(f.icon)}</span>
              <h3>${escapeHtml(f.title)}</h3>
              <p>${escapeHtml(f.text)}</p>
              <span class="text-link">${escapeHtml(f.link)} ${icon("arrowRight", "arrow")}</span>
            </a>`
            )
            .join("")}
        </div>
      </div>
    </section>

    <section class="section verse-section">
      <div class="container verse-layout">
        <div class="verse-art reveal">
          <img src="assets/img/manuscript.jpg" alt="${escapeHtml(t("home.manuscriptAlt"))}" loading="lazy" />
          <span class="verse-art-badge">${icon("bookOpen")} ${t("home.verseBadge")}</span>
        </div>
        <div class="verse-copy reveal">
          <p class="eyebrow">${escapeHtml(verse.theme)}</p>
          <blockquote class="verse-text">${escapeHtml(verse.text)}</blockquote>
          <p class="verse-ref">${escapeHtml(verse.ref)}</p>
          <div class="verse-actions">
            <a class="btn btn-primary" href="#/bible">${t("home.openBible")} ${icon("arrowRight", "arrow")}</a>
          </div>
          <p class="verse-note">${t("home.verseNote")}</p>
        </div>
      </div>
    </section>

    <section class="feast-band">
      <div class="feast-band-bg">
        <img src="assets/img/monastery-dawn.jpg" alt="${escapeHtml(t("home.monasteryAlt"))}" loading="lazy" />
      </div>
      <div class="container feast-band-inner">
        <div class="reveal">
          <p class="eyebrow">${t("home.feastEyebrow")}</p>
          <h2>${t("home.feastTitle")}</h2>
          <p>${t("home.feastText")}</p>
          <div class="hero-actions">
            <a class="btn btn-light" href="#/seasons">${t("home.exploreSeasons")} ${icon("arrowRight", "arrow")}</a>
          </div>
        </div>
        ${
          next
            ? `
          <aside class="next-feast-card reveal">
            <div class="nf-top">
              <span class="nf-label">${t("home.nextFeast")}</span>
              <span class="nf-in">${escapeHtml(countdownLabel(next.days))}</span>
            </div>
            <p class="nf-date">${escapeHtml(formatShort(next.date))}</p>
            <p class="nf-name">${escapeHtml(next.feast.name)}</p>
            <p class="nf-coptic">${escapeHtml(next.feast.coptic)}</p>
            <p class="nf-desc">${escapeHtml(next.feast.desc)}</p>
            <a class="btn btn-glass" href="#/seasons">${t("home.seeYear")} ${icon("arrowRight", "arrow")}</a>
          </aside>`
            : ""
        }
      </div>
    </section>

    <section class="section saints-preview">
      <div class="container">
        <div class="section-head-row">
          <div class="reveal">
            <p class="eyebrow">${t("home.saintsEyebrow")}</p>
            <h2>${t("home.saintsTitle")}</h2>
            <p class="lead">${t("home.saintsLead")}</p>
          </div>
          <a class="text-link reveal" href="#/saints">${t("home.meetSaints")} ${icon("arrowRight")}</a>
        </div>
        <div class="saints-preview-grid">
          ${preview.map((s) => saintCardMarkup(s)).join("")}
        </div>
      </div>
    </section>`;

  root.querySelectorAll("[data-saint]").forEach((card) => {
    card.addEventListener("click", () => {
      const saint = saints.find((s) => s.id === card.dataset.saint);
      if (saint) openSaint(saint);
    });
  });

  const scrollBtn = root.querySelector("[data-scroll]");
  if (scrollBtn) {
    scrollBtn.addEventListener("click", () => {
      const target = document.getElementById(scrollBtn.dataset.scroll);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}

export function cleanup() {}
