import { icon } from "../lib/icons.js";
import { pageHero, sectionHead } from "../lib/components.js";
import { escapeHtml, openModal, closeModal, store } from "../lib/dom.js";
import { isRTL, num, pad2, t } from "../i18n.js";
import { pack } from "../data/localized-content.js";

function openLesson(lesson, index) {
  const body = document.createElement("div");
  body.innerHTML = `
    <p class="lead">${escapeHtml(lesson.summary)}</p>
    <ol class="lesson-modal-points">
      ${lesson.points
        .map(
          (point, i) => `
        <li><span aria-hidden="true">${pad2(i + 1)}</span><div>${escapeHtml(point)}</div></li>`
        )
        .join("")}
    </ol>
    <div class="note-panel mt-24">
      ${icon("heart")}
      <div><strong>${t("learn.reflection")}</strong><br />${escapeHtml(lesson.reflection)}</div>
    </div>`;
  openModal({
    eyebrow: t("learn.lessonEyebrow", {
      level: t(`tags.${lesson.level}`),
      minutes: num(lesson.minutes),
      n: pad2(index + 1),
    }),
    title: lesson.title,
    body,
    wide: true,
    actions: [
      {
        label: t("learn.takeQuiz"),
        icon: "compass",
        variant: "btn-primary",
        onClick: () => {
          closeModal();
          document.getElementById("quizzes")?.scrollIntoView({ behavior: "smooth", block: "start" });
        },
      },
    ],
  });
}

export function render(root) {
  const { lessons, quizzes } = pack();
  let activeQuiz = null;
  let index = 0;
  let score = 0;
  let answered = false;

  root.innerHTML = `
    ${pageHero({
      eyebrow: t("learn.eyebrow"),
      title: t("learn.title"),
      lead: t("learn.lead"),
      aside: t("learn.aside"),
    })}

    <section class="section-sm" id="lessons">
      <div class="container">
        ${sectionHead({
          eyebrow: t("learn.lessonsEyebrow"),
          title: t("learn.lessonsTitle"),
          lead: t("learn.lessonsLead"),
        })}
        <div class="lesson-grid">
          ${lessons
            .map(
              (lesson, i) => `
            <button class="lesson-card reveal" type="button" data-lesson="${lesson.id}">
              <span class="lesson-top">
                <span class="lesson-num">${pad2(i + 1)}</span>
                <span class="lesson-meta">${icon("clock")} ${t("learn.minutesShort", { n: num(lesson.minutes) })} · ${escapeHtml(
                  t(`tags.${lesson.level}`)
                )}</span>
              </span>
              <h3>${escapeHtml(lesson.title)}</h3>
              <p>${escapeHtml(lesson.summary)}</p>
              <span class="text-link">${t("learn.openLesson")} ${icon("arrowRight")}</span>
            </button>`
            )
            .join("")}
        </div>
      </div>
    </section>

    <section class="section" id="quizzes">
      <div class="container">
        ${sectionHead({
          eyebrow: t("learn.quizzesEyebrow"),
          title: t("learn.quizzesTitle"),
          lead: t("learn.quizzesLead"),
        })}
        <div class="quiz-grid">
          ${quizzes
            .map((quiz) => {
              const best = store.get(`quiz.best.${quiz.id}`, 0) || 0;
              return `
              <article class="quiz-card reveal">
                <h3>${escapeHtml(quiz.title)}</h3>
                <p>${escapeHtml(quiz.subtitle)}</p>
                <div class="quiz-meta">
                  <span><strong>${num(quiz.questions.length)}</strong> ${t("learn.questions")}</span>
                  <span>${t("learn.minutesEstimate", { n: num(Math.max(2, Math.round((quiz.questions.length * 30) / 60))) })}</span>
                  <span data-best="${quiz.id}">${
                    best ? t("learn.best", { score: num(best), total: num(quiz.questions.length) }) : ""
                  }</span>
                </div>
                <button class="btn btn-primary btn-sm" type="button" data-quiz="${quiz.id}">
                  ${t("learn.beginQuiz")} ${icon("arrowRight")}
                </button>
              </article>`;
            })
            .join("")}
        </div>
        <div class="quiz-shell" id="quiz-shell" hidden></div>
      </div>
    </section>

    <section class="section-sm">
      <div class="container">
        <div class="verse-actions">
          <a class="btn btn-primary" href="#/faith">${t("learn.reviewFaith")} ${icon("arrowRight", "arrow")}</a>
        </div>
      </div>
    </section>`;

  const shell = root.querySelector("#quiz-shell");

  root.querySelectorAll("[data-lesson]").forEach((card) => {
    card.addEventListener("click", () => {
      const i = lessons.findIndex((l) => l.id === card.dataset.lesson);
      if (i >= 0) openLesson(lessons[i], i);
    });
  });

  function exitQuiz() {
    activeQuiz = null;
    shell.hidden = true;
    shell.innerHTML = "";
  }

  function saveBest() {
    const key = `quiz.best.${activeQuiz.id}`;
    const previous = store.get(key, 0) || 0;
    if (score > previous) {
      store.set(key, score);
      const slot = root.querySelector(`[data-best="${activeQuiz.id}"]`);
      if (slot) slot.innerHTML = t("learn.best", { score: num(score), total: num(activeQuiz.questions.length) });
    }
  }

  function renderResult() {
    const total = activeQuiz.questions.length;
    const percent = Math.round((score / total) * 100);
    const message =
      percent === 100
        ? t("learn.cleanSweep")
        : percent >= 75
        ? t("learn.wellGrounded")
        : percent >= 50
        ? t("learn.goodBeginning")
        : t("learn.placeToStart");
    const note = percent >= 75 ? t("learn.noteHigh") : t("learn.noteLow");

    shell.innerHTML = `
      <div class="quiz-top">
        <h3>${escapeHtml(activeQuiz.title)}</h3>
        <span class="quiz-step">${t("learn.results")}</span>
      </div>
      <div class="quiz-result">
        <div class="score-ring"><strong>${num(score)}<small>/${num(total)}</small></strong></div>
        <h3>${escapeHtml(message)}</h3>
        <p>${escapeHtml(note)}</p>
        <div class="quiz-actions">
          <button class="btn btn-primary" type="button" data-quiz-again>${icon("retry")} ${t("learn.tryAgain")}</button>
          <button class="btn btn-ghost" type="button" data-quiz-exit>${t("learn.backToQuizzes")}</button>
        </div>
      </div>`;
    shell.querySelector(".score-ring").style.setProperty("--score", percent);
    saveBest();

    shell.querySelector("[data-quiz-again]").addEventListener("click", () => startQuiz(activeQuiz));
    shell.querySelector("[data-quiz-exit]").addEventListener("click", () => {
      exitQuiz();
      document.getElementById("quizzes")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function renderQuestion() {
    const total = activeQuiz.questions.length;
    const question = activeQuiz.questions[index];
    const letters = isRTL() ? ["أ", "ب", "ج", "د"] : ["A", "B", "C", "D"];
    answered = false;

    shell.innerHTML = `
      <div class="quiz-top">
        <h3>${escapeHtml(activeQuiz.title)}</h3>
        <span class="quiz-step">${t("learn.questionOf", { n: num(index + 1), total: num(total) })} · <button class="text-link" type="button" data-quiz-exit>${t("learn.exit")}</button></span>
      </div>
      <div class="quiz-progress" aria-hidden="true"><i style="width: ${(index / total) * 100}%"></i></div>
      <p class="quiz-q">${escapeHtml(question.q)}</p>
      <div class="quiz-options" role="group" aria-label="${escapeHtml(t("learn.answerOptions"))}">
        ${question.options
          .map(
            (option, i) => `
          <button class="quiz-option" type="button" data-option="${i}">
            <span class="letter" aria-hidden="true">${letters[i]}</span>
            <span>${escapeHtml(option)}</span>
          </button>`
          )
          .join("")}
      </div>
      <div class="quiz-feedback" hidden></div>
      <div class="quiz-actions" data-next-wrap hidden>
        <button class="btn btn-primary" type="button" data-next>
          ${index === total - 1 ? t("learn.seeResults") : t("learn.nextQuestion")} ${icon("arrowRight")}
        </button>
      </div>`;

    shell.querySelector("[data-quiz-exit]").addEventListener("click", () => {
      exitQuiz();
      document.getElementById("quizzes")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    shell.querySelectorAll("[data-option]").forEach((button) => {
      button.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        const chosen = Number(button.dataset.option);
        const correct = question.answer;
        if (chosen === correct) score += 1;

        shell.querySelectorAll("[data-option]").forEach((b) => {
          const i = Number(b.dataset.option);
          b.disabled = true;
          if (i === correct) b.classList.add("is-correct");
          else if (i === chosen) b.classList.add("is-wrong");
        });

        const feedback = shell.querySelector(".quiz-feedback");
        feedback.hidden = false;
        feedback.innerHTML = `<strong>${chosen === correct ? t("learn.correct") : t("learn.notQuite")}</strong>${escapeHtml(
          question.explain
        )}`;

        shell.querySelector(".quiz-progress i").style.width = `${((index + 1) / total) * 100}%`;
        const nextWrap = shell.querySelector("[data-next-wrap]");
        nextWrap.hidden = false;
        nextWrap.querySelector("[data-next]").addEventListener("click", () => {
          if (index < total - 1) {
            index += 1;
            renderQuestion();
          } else {
            renderResult();
          }
        });
      });
    });
  }

  function startQuiz(quiz) {
    activeQuiz = quiz;
    index = 0;
    score = 0;
    shell.hidden = false;
    renderQuestion();
    shell.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  root.querySelectorAll("[data-quiz]").forEach((button) => {
    button.addEventListener("click", () => {
      const quiz = quizzes.find((q) => q.id === button.dataset.quiz);
      if (quiz) startQuiz(quiz);
    });
  });
}

export function cleanup() {}
