import { icon } from "../lib/icons.js";
import { pageHero, saintCardMarkup, openSaint } from "../lib/components.js";
import { escapeHtml, debounce } from "../lib/dom.js";
import { num, t } from "../i18n.js";
import { pack } from "../data/localized-content.js";

export function render(root, ctx = {}) {
  const { saints } = pack();
  const tags = ["All", ...Array.from(new Set(saints.map((s) => s.tag)))];
  let state = { tag: "All", query: "" };

  root.innerHTML = `
    ${pageHero({
      eyebrow: t("saints.eyebrow"),
      title: t("saints.title"),
      lead: t("saints.lead"),
      aside: t("saints.aside"),
    })}

    <section class="section-sm">
      <div class="container">
        <div class="saints-toolbar">
          <div class="chip-row" role="group" aria-label="${escapeHtml(t("saints.filterAria"))}">
            ${tags
              .map(
                (tag) => `
              <button class="chip${tag === "All" ? " is-active" : ""}" type="button" data-tag="${escapeHtml(tag)}" aria-pressed="${tag === "All"}">${escapeHtml(t(`tags.${tag}`) || tag)}</button>`
              )
              .join("")}
          </div>
          <label class="search-field">
            ${icon("search")}
            <span class="sr-only">${t("saints.searchLabel")}</span>
            <input class="input" id="saint-search" type="search" placeholder="${escapeHtml(t("saints.searchPlaceholder"))}" autocomplete="off" />
          </label>
        </div>
        <p class="saints-count" id="saints-count" aria-live="polite"></p>
        <div class="saint-grid" id="saint-grid"></div>
        <p class="empty-state" id="saints-empty" hidden>${t("saints.noMatch")}</p>
      </div>
    </section>

    <section class="section-sm">
      <div class="container">
        <div class="note-panel reveal">
          ${icon("info")}
          <div>
            <strong>${t("saints.noteTitle")}</strong>
            ${t("saints.noteText")}
          </div>
        </div>
        <div class="verse-actions">
          <a class="btn btn-primary" href="#/history">${t("saints.walkHistory")} ${icon("arrowRight", "arrow")}</a>
        </div>
      </div>
    </section>`;

  const grid = root.querySelector("#saint-grid");
  const count = root.querySelector("#saints-count");
  const empty = root.querySelector("#saints-empty");
  const search = root.querySelector("#saint-search");

  function renderList() {
    const query = state.query.toLowerCase();
    const list = saints.filter((s) => {
      if (state.tag !== "All" && s.tag !== state.tag) return false;
      if (!query) return true;
      return (
        s.name.toLowerCase().includes(query) ||
        s.summary.toLowerCase().includes(query) ||
        s.ar.includes(state.query) ||
        s.feast.toLowerCase().includes(query)
      );
    });

    grid.innerHTML = list.map((s) => saintCardMarkup(s, { reveal: false })).join("");
    empty.hidden = list.length > 0;
    count.textContent =
      list.length === saints.length
        ? t("saints.countAll", { n: num(list.length) })
        : t("saints.countFiltered", { n: num(list.length), total: num(saints.length) });
  }

  grid.addEventListener("click", (event) => {
    const card = event.target.closest("[data-saint]");
    if (!card) return;
    const saint = saints.find((s) => s.id === card.dataset.saint);
    if (saint) openSaint(saint);
  });

  root.querySelectorAll("[data-tag]").forEach((chip) => {
    chip.addEventListener("click", () => {
      state.tag = chip.dataset.tag;
      root.querySelectorAll("[data-tag]").forEach((c) => {
        const active = c === chip;
        c.classList.toggle("is-active", active);
        c.setAttribute("aria-pressed", String(active));
      });
      renderList();
    });
  });

  search.addEventListener(
    "input",
    debounce(() => {
      state.query = search.value.trim();
      renderList();
    }, 120)
  );

  renderList();

  if (ctx.open) {
    const saint = saints.find((s) => s.id === ctx.open);
    if (saint) openSaint(saint);
  }
}

export function cleanup() {}
