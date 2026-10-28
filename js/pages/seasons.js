import { icon } from "../lib/icons.js";
import { pageHero, sectionHead } from "../lib/components.js";
import { escapeHtml, startOfDay } from "../lib/dom.js";
import {
  upcomingFeasts,
  movableDates,
  orthodoxEaster,
  formatShort,
  countdownLabel,
} from "../lib/feasts.js";
import { dateLocale, isRTL, num, t } from "../i18n.js";
import { pack } from "../data/localized-content.js";

function addDays(date, days) {
  const next = new Date(date.getTime());
  next.setDate(next.getDate() + days);
  return next;
}

function dayMonth(date) {
  const locale = dateLocale();
  return {
    day: new Intl.DateTimeFormat(locale, { day: "numeric" }).format(date),
    month: new Intl.DateTimeFormat(locale, { month: "short" }).format(date).toUpperCase(),
  };
}

export function render(root, ctx = {}) {
  const { feasts, fasts, fastNote, weeklyFast } = pack();
  const today = startOfDay(new Date());
  const year = today.getFullYear();
  const cycleYear = orthodoxEaster(year) < today ? year + 1 : year;
  const movable = movableDates(cycleYear);
  const yearAhead = upcomingFeasts(feasts, feasts.length, today);
  const nextThree = yearAhead.slice(0, 3);

  const fastWindows = {
    "great-lent": t("seasons.begins", { date: formatShort(movable.lentStart) }),
    "holy-week": t("seasons.range", {
      start: formatShort(movable.palmSunday),
      end: formatShort(addDays(movable.easter, -1)),
    }),
    apostles: `${t("seasons.begins", { date: formatShort(movable.apostlesFastStart) })} · ${t("seasons.endsJuly")}`,
    nineveh: t("seasons.begins", { date: formatShort(addDays(movable.easter, -69)) }),
  };

  root.innerHTML = `
    ${pageHero({
      eyebrow: t("seasons.eyebrow"),
      title: t("seasons.title"),
      lead: t("seasons.lead"),
      aside: t("seasons.aside"),
    })}

    <section class="section-sm">
      <div class="container">
        <div class="tabs" role="tablist" aria-label="${escapeHtml(t("seasons.tabsAria"))}">
          <button class="tab" role="tab" id="tab-feasts" aria-controls="panel-feasts" aria-selected="true" tabindex="0">${t("seasons.feasts")}</button>
          <button class="tab" role="tab" id="tab-fasts" aria-controls="panel-fasts" aria-selected="false" tabindex="-1">${t("seasons.fasting")}</button>
        </div>

        <div class="season-panel" id="panel-feasts" role="tabpanel" aria-labelledby="tab-feasts">
          <div class="next-feasts">
            ${nextThree
              .map(
                (item, i) => {
                  const dm = dayMonth(item.date);
                  return `
                <article class="next-feast${i === 0 ? " is-primary" : ""}">
                  <div>
                    <p class="nf-day">${dm.day}</p>
                    <p class="nf-month">${dm.month}</p>
                  </div>
                  <div class="nf-info">
                    <h4>${escapeHtml(item.feast.name)}</h4>
                    <p>${escapeHtml(t("seasons.feastCountdown", { count: countdownLabel(item.days), coptic: item.feast.coptic }))}</p>
                  </div>
                </article>`;
                }
              )
              .join("")}
          </div>

          ${sectionHead({
            eyebrow: t("seasons.yearAheadEyebrow"),
            title: t("seasons.yearAheadTitle"),
            lead: t("seasons.yearAheadLead"),
          })}

          <div class="feast-grid">
            ${yearAhead
              .map(({ feast, date }) => {
                const dm = dayMonth(date);
                return `
                <article class="feast-card reveal">
                  <div class="feast-card-top">
                    <div class="feast-date">${dm.day}<small>${dm.month}</small></div>
                    <span class="tag">${t(feast.kind === "movable" ? "seasons.movable" : "seasons.fixed")}</span>
                  </div>
                  <h4>${escapeHtml(feast.name)}</h4>
                  ${!isRTL() && feast.ar ? `<p class="feast-ar ar" lang="ar" dir="rtl">${escapeHtml(feast.ar)}</p>` : ""}
                  <p>${escapeHtml(feast.desc)}</p>
                  <p class="feast-coptic">${escapeHtml(feast.coptic)} · ${escapeHtml(formatShort(date))}</p>
                </article>`;
              })
              .join("")}
          </div>

          <div class="movable-panel reveal">
            <h3>${escapeHtml(t("seasons.movableTitle", { year: num(cycleYear) }))}</h3>
            <p>${t("seasons.movableText")}</p>
            <div class="movable-rows">
              <div class="movable-row">
                <span>${t("seasons.palmSunday")}</span>
                <strong>${escapeHtml(formatShort(movable.palmSunday, { year: false }))}</strong>
              </div>
              <div class="movable-row">
                <span>${t("seasons.resurrection")}</span>
                <strong>${escapeHtml(formatShort(movable.easter, { year: false }))}</strong>
              </div>
              <div class="movable-row">
                <span>${t("seasons.ascension")}</span>
                <strong>${escapeHtml(formatShort(movable.ascension, { year: false }))}</strong>
              </div>
              <div class="movable-row">
                <span>${t("seasons.pentecost")}</span>
                <strong>${escapeHtml(formatShort(movable.pentecost, { year: false }))}</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="season-panel" id="panel-fasts" role="tabpanel" aria-labelledby="tab-fasts" hidden>
          <div class="note-panel reveal">
            ${icon("info")}
            <div><strong>${t("seasons.fastingTitle")}</strong><br />${escapeHtml(fastNote)}</div>
          </div>

          <div class="fast-grid mt-32">
            ${fasts
              .map(
                (fast) => `
              <article class="fast-card reveal">
                <div class="fast-card-top">
                  <h4>${escapeHtml(fast.name)}</h4>
                  <span class="fast-duration">${escapeHtml(fast.duration)}</span>
                </div>
                ${!isRTL() && fast.ar ? `<p class="fast-ar ar" lang="ar" dir="rtl">${escapeHtml(fast.ar)}</p>` : ""}
                <p>${escapeHtml(fast.desc)}</p>
                ${fastWindows[fast.id] ? `<p class="small muted">${escapeHtml(fastWindows[fast.id])}</p>` : ""}
                <ul class="fast-practices">
                  ${fast.practices.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}
                </ul>
                <p class="small muted">${escapeHtml(fast.note)}</p>
              </article>`
              )
              .join("")}
          </div>

          <div class="weekly-fast reveal">
            ${icon("calendar")}
            <div>
              <h4>${t("seasons.weeklyTitle")}</h4>
              <p>${escapeHtml(weeklyFast)}</p>
            </div>
          </div>

          <div class="verse-actions">
            <a class="btn btn-primary" href="#/faith">${t("seasons.faithBehind")} ${icon("arrowRight", "arrow")}</a>
          </div>
        </div>
      </div>
    </section>`;

  const tabs = Array.from(root.querySelectorAll("[role='tab']"));

  function selectTab(tab) {
    tabs.forEach((item) => {
      const active = item === tab;
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
      const panel = root.querySelector(`#${item.getAttribute("aria-controls")}`);
      if (panel) panel.hidden = !active;
    });
    if (tab.id === "tab-fasts") tab.focus({ preventScroll: true });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const next = tabs[(index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
      selectTab(next);
    });
  });

  if (ctx.tab === "fasting" || ctx.tab === "fasts") {
    selectTab(tabs[1]);
  }
}

export function cleanup() {}
