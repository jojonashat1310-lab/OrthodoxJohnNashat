/* =========================================================
   Localized content — one entry point per language
   ========================================================= */

import { lang } from "../i18n.js";
import * as en from "./content.js";
import * as arCore from "./content.ar.js";
import * as arSaints from "./content.ar.saints.js";
import * as arLearn from "./content.ar.learn.js";

function withBookNumbers(list) {
  return list.map((book, i) => ({ ...book, nr: i + 1, en: book.en || book.name }));
}

const english = {
  ...en,
  bibleBooks: withBookNumbers(en.bibleBooks),
};

const arabic = {
  ...en,
  ...arCore,
  ...arSaints,
  ...arLearn,
  saints: arSaints.saints.map((saint) => ({ ...saint, name: saint.ar })),
  sacraments: arCore.sacraments.map((sacrament) => ({ ...sacrament, name: sacrament.ar })),
  bibleBooks: withBookNumbers(arCore.bibleBooks),
};

export function pack() {
  return lang() === "ar" ? arabic : english;
}

export { english as englishContent, arabic as arabicContent };
