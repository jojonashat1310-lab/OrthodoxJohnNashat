import { openModal, closeModal, escapeHtml } from "./dom.js";
import { icon } from "./icons.js";
import { lang, num, setLanguage, t } from "../i18n.js";
import {
  SUPPORTED,
  getPrefs,
  getState,
  setPrefs,
  primeVoices,
  voiceCatalog,
  voiceSignature,
  subscribe,
  speak,
  pause,
  resume,
  stop,
} from "./speech.js";

function option(value, title, hint, active) {
  return `
    <button class="settings-option${active ? " is-active" : ""}" type="button" data-set-lang="${value}" aria-pressed="${active}">
      <span class="settings-option-text">
        <strong>${title}</strong>
        <span>${hint}</span>
      </span>
      <span class="settings-check" aria-hidden="true">${icon("check")}</span>
    </button>`;
}

function formatRate(rate) {
  return new Intl.NumberFormat(lang() === "ar" ? "ar-EG" : "en-GB", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(rate);
}

function switchMarkup(attribute, checked, label) {
  return `<button class="settings-switch${checked ? " is-on" : ""}" type="button" role="switch" aria-checked="${checked}" aria-label="${escapeHtml(
    label
  )}" ${attribute}><span class="sr-only">${escapeHtml(label)}</span></button>`;
}

function segment(value, label, active) {
  return `<button class="settings-seg-btn${active ? " is-active" : ""}" type="button" data-audio-lang="${value}" aria-pressed="${active}">${escapeHtml(
    label
  )}</button>`;
}

function voiceGridMarkup() {
  const prefs = getPrefs();
  return voiceCatalog()
    .map((group) => {
      const options = group.options
        .map((entry) => {
          const selected = prefs.gender[group.lang] === entry.gender;
          let name;
          if (entry.available) name = escapeHtml(entry.voice?.name || "");
          else if (entry.voice)
            name = escapeHtml(t("audio.fallback", { name: entry.voice.name }));
          else name = t("audio.unavailable");
          if (entry.voice && entry.voice.localService === false && !/online/i.test(entry.voice.name)) {
            name = `${name} · ${t("audio.online")}`;
          }
          return `
            <button class="settings-voice${selected ? " is-active" : ""}" type="button"
              data-audio-gender="${group.lang}:${entry.gender}" aria-pressed="${selected}">
              <span class="settings-voice-top">
                <strong>${t(`audio.${entry.gender}`)}</strong>
                ${selected ? icon("check") : ""}
              </span>
              <span class="settings-voice-name">${name}</span>
            </button>`;
        })
        .join("");
      return `
        <div class="settings-voice-group">
          <p class="settings-voice-lang">${t(`audio.${group.lang}`)}</p>
          <div class="settings-voice-grid">${options}</div>
          ${
            group.voices.length
              ? ""
              : `<p class="settings-hint settings-warning">${t("audio.noVoices", {
                  lang: t(`audio.${group.lang}`),
                })}</p>`
          }
        </div>`;
    })
    .join("");
}

function detectedMarkup() {
  const items = voiceCatalog().flatMap((group) =>
    group.voices.map((voice) => {
      const gender =
        voice.gender === "unknown"
          ? t("audio.genderUnknown")
          : t(`audio.${voice.gender}`);
      return `${escapeHtml(voice.name)} (${escapeHtml(voice.lang)} · ${gender})`;
    })
  );
  if (!items.length) {
    return `<p class="settings-voice-list">${t("audio.noVoicesDetected")}</p>`;
  }
  const shown = items.slice(0, 8);
  const list = shown.join(" · ");
  const more = items.length - shown.length;
  return `<p class="settings-voice-list">${t("audio.detected", {
    list: more > 0 ? `${list} ${t("audio.detectedMore", { n: num(more) })}` : list,
  })}</p>`;
}

function syncVoiceList(section) {
  const signature = voiceSignature();
  if (section.dataset.voiceSignature === signature) return;
  section.dataset.voiceSignature = signature;
  const holder = section.querySelector("[data-audio-voices]");
  if (holder) holder.innerHTML = `${voiceGridMarkup()}${detectedMarkup()}`;
}

function statusText(state) {
  const prefs = state.prefs;
  if (!prefs.enabled) return t("audio.ready");
  if (state.error) {
    if (state.error.startsWith("no-voice:")) {
      const language = state.error.split(":")[1];
      return t("audio.noVoice", { lang: t(`audio.${language}`) });
    }
    return t("audio.error");
  }
  const text = state.current?.label || state.current?.text || "";
  const preview = text.length > 70 ? `${text.slice(0, 68)}…` : text;
  if (state.playing && state.paused) return t("audio.paused", { text: preview });
  if (state.playing) return t("audio.reading", { text: preview });
  return t("audio.ready");
}

function syncAudioSection(section, state) {
  if (!SUPPORTED) return;
  syncVoiceList(section);
  const prefs = getPrefs();

  const toggle = section.querySelector("[data-audio-toggle]");
  if (toggle) {
    toggle.classList.toggle("is-on", prefs.enabled);
    toggle.setAttribute("aria-checked", String(prefs.enabled));
  }

  section.querySelectorAll("[data-audio-lang]").forEach((button) => {
    const active = button.dataset.audioLang === prefs.language;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  section.querySelectorAll("[data-audio-gender]").forEach((button) => {
    const [language, gender] = button.dataset.audioGender.split(":");
    const active = prefs.gender[language] === gender;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
    const check = button.querySelector(".settings-voice-top svg");
    if (active && !check) {
      button.querySelector(".settings-voice-top").insertAdjacentHTML("beforeend", icon("check"));
    } else if (!active && check) {
      check.remove();
    }
  });

  const continuous = section.querySelector("[data-audio-continuous]");
  if (continuous) {
    continuous.classList.toggle("is-on", prefs.continuous);
    continuous.setAttribute("aria-checked", String(prefs.continuous));
  }

  const rate = section.querySelector("[data-audio-rate]");
  if (rate && document.activeElement !== rate) rate.value = String(prefs.rate);
  const rateValue = section.querySelector("[data-audio-rate-value]");
  if (rateValue) rateValue.textContent = t("audio.rateValue", { n: formatRate(prefs.rate) });

  section.querySelectorAll("[data-audio-test]").forEach((button) => {
    button.disabled = !prefs.enabled;
  });

  const pauseButton = section.querySelector("[data-audio-pause]");
  if (pauseButton) {
    pauseButton.disabled = !state.playing;
    pauseButton.innerHTML = `${icon(state.playing && state.paused ? "play" : "pause")}<span>${escapeHtml(
      state.playing && state.paused ? t("audio.resume") : t("audio.pause")
    )}</span>`;
  }

  const stopButton = section.querySelector("[data-audio-test-stop]");
  if (stopButton) stopButton.disabled = !state.playing;

  const status = section.querySelector("[data-audio-settings-status]");
  if (status) status.textContent = statusText(state);

  section.classList.toggle("is-disabled", !prefs.enabled);
}

function buildAudioSection() {
  const section = document.createElement("section");
  section.className = "settings-section";
  section.id = "settings-audio";
  const prefs = getPrefs();

  section.innerHTML = `
    <div class="settings-section-head">
      <h3>${t("audio.title")}</h3>
      <p>${t("audio.hint")}</p>
    </div>
    ${
      SUPPORTED
        ? `
        <div class="settings-row">
          <div class="settings-row-text">
            <strong>${t("audio.enable")}</strong>
            <span>${t("audio.enableHint")}</span>
          </div>
          ${switchMarkup("data-audio-toggle", prefs.enabled, t("audio.enable"))}
        </div>
        <div class="settings-audio-body" data-audio-body>
          <div class="settings-field">
            <span class="settings-label">${t("audio.language")}</span>
            <div class="settings-seg" role="group" aria-label="${escapeHtml(t("audio.language"))}">
              ${segment("auto", t("audio.langAuto"), prefs.language === "auto")}
              ${segment("ar", t("audio.ar"), prefs.language === "ar")}
              ${segment("en", t("audio.en"), prefs.language === "en")}
            </div>
            <p class="settings-hint">${t("audio.languageHint")}</p>
          </div>
          <div class="settings-field">
            <span class="settings-label">${t("audio.voice")}</span>
            <div data-audio-voices>${voiceGridMarkup()}${detectedMarkup()}</div>
            <p class="settings-hint">${t("audio.voiceHint")}</p>
          </div>
          <div class="settings-field">
            <div class="settings-range-head">
              <span>${t("audio.rate")}</span>
              <output data-audio-rate-value>${t("audio.rateValue", { n: formatRate(prefs.rate) })}</output>
            </div>
            <input class="settings-range" type="range" min="0.6" max="1.6" step="0.1"
              value="${prefs.rate}" data-audio-rate aria-label="${escapeHtml(t("audio.rate"))}" />
            <p class="settings-hint">${t("audio.rateHint")}</p>
          </div>
          <div class="settings-row">
            <div class="settings-row-text">
              <strong>${t("audio.continue")}</strong>
              <span>${t("audio.continueHint")}</span>
            </div>
            ${switchMarkup("data-audio-continuous", prefs.continuous, t("audio.continue"))}
          </div>
          <div class="settings-audio-actions">
            <button class="btn btn-primary btn-sm" type="button" data-audio-test="en">
              ${icon("play")} ${t("audio.testEnglish")}
            </button>
            <button class="btn btn-ghost btn-sm" type="button" data-audio-test="ar">
              ${icon("play")} ${t("audio.testArabic")}
            </button>
            <button class="btn btn-ghost btn-sm" type="button" data-audio-pause disabled>
              ${icon("pause")} <span>${t("audio.pause")}</span>
            </button>
            <button class="btn btn-ghost btn-sm" type="button" data-audio-test-stop disabled>
              ${icon("stop")} ${t("audio.stop")}
            </button>
          </div>
          <p class="settings-audio-status" data-audio-settings-status role="status" aria-live="polite"></p>
        </div>`
        : `<div class="settings-unsupported">
            ${icon("speakerOff")}
            <p>${t("audio.unsupported")}</p>
          </div>`
    }`;

  section.addEventListener("click", (event) => {
    if (event.target.closest("[data-audio-toggle]")) {
      const enabled = !getPrefs().enabled;
      setPrefs({ enabled });
      if (enabled) primeVoices();
      return;
    }
    const languageButton = event.target.closest("[data-audio-lang]");
    if (languageButton) {
      setPrefs({ language: languageButton.dataset.audioLang });
      return;
    }
    const voiceButton = event.target.closest("[data-audio-gender]");
    if (voiceButton) {
      const [language, gender] = voiceButton.dataset.audioGender.split(":");
      setPrefs({ gender: { [language]: gender } });
      return;
    }
    if (event.target.closest("[data-audio-continuous]")) {
      setPrefs({ continuous: !getPrefs().continuous });
      return;
    }
    const testButton = event.target.closest("[data-audio-test]");
    if (testButton) {
      const language = testButton.dataset.audioTest === "ar" ? "ar" : "en";
      speak(
        [
          {
            text: language === "ar" ? t("audio.testAr") : t("audio.testEn"),
            lang: language,
          },
        ],
        { source: "sample" }
      );
      return;
    }
    if (event.target.closest("[data-audio-pause]")) {
      if (getState().paused) resume();
      else pause();
      return;
    }
    if (event.target.closest("[data-audio-test-stop]")) stop();
  });

  section.addEventListener("input", (event) => {
    if (!event.target.matches("[data-audio-rate]")) return;
    const rate = Number(event.target.value);
    setPrefs({ rate }, { restart: false });
    const output = section.querySelector("[data-audio-rate-value]");
    if (output) output.textContent = t("audio.rateValue", { n: formatRate(rate) });
  });

  section.addEventListener("change", (event) => {
    if (!event.target.matches("[data-audio-rate]")) return;
    setPrefs({ rate: Number(event.target.value) });
  });

  return section;
}

export function openSettings(section = "") {
  const body = document.createElement("div");
  body.className = "settings-body";

  const languageSection = document.createElement("section");
  languageSection.className = "settings-section";
  languageSection.id = "settings-language";
  languageSection.innerHTML = `
    <div class="settings-section-head">
      <h3>${t("settings.language")}</h3>
      <p>${t("settings.languageHint")}</p>
    </div>
    <div class="settings-options" role="group" aria-label="${t("settings.language")}">
      ${option("en", t("settings.english"), t("settings.englishHint"), lang() === "en")}
      ${option("ar", t("settings.arabic"), t("settings.arabicHint"), lang() === "ar")}
    </div>`;

  const audioSection = buildAudioSection();
  body.append(languageSection, audioSection);

  let unsubscribeAudio = () => {};
  openModal({
    eyebrow: t("settings.eyebrow"),
    title: t("settings.title"),
    body,
    className: "modal-settings",
    onClose: () => unsubscribeAudio(),
  });

  languageSection.querySelectorAll("[data-set-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = button.dataset.setLang;
      closeModal();
      if (next !== lang()) setLanguage(next);
    });
  });

  unsubscribeAudio = subscribe((state) => {
    if (!body.isConnected) {
      unsubscribeAudio();
      return;
    }
    syncAudioSection(audioSection, state);
  });

  primeVoices();
  syncAudioSection(audioSection, getState());

  if (section === "audio") {
    setTimeout(() => {
      audioSection.scrollIntoView({ behavior: "smooth", block: "start" });
      audioSection.querySelector("[data-audio-toggle]")?.focus({ preventScroll: true });
    }, 80);
  }
}
