import { startOfDay, daysBetween } from "./dom.js";
import { dateLocale, lang } from "../i18n.js";

const DAY = 86400000;

/**
 * Orthodox (Julian) Easter, returned as a civil date.
 * Meeus Julian algorithm plus the Julian–Gregorian offset.
 */
export function orthodoxEaster(year) {
  const a = year % 4;
  const b = year % 7;
  const c = year % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const month = Math.floor((d + e + 114) / 31);
  const day = ((d + e + 114) % 31) + 1;
  const offset = year < 1900 ? 12 : year < 2100 ? 13 : 14;
  return new Date(year, month - 1, day + offset);
}

function addDays(date, days) {
  const next = new Date(date.getTime());
  next.setDate(next.getDate() + days);
  return next;
}

export function feastDate(feast, year) {
  if (feast.kind === "movable") {
    return addDays(orthodoxEaster(year), feast.offset ?? 0);
  }
  return new Date(year, feast.month - 1, feast.day);
}

export function upcomingFeasts(list, count = 3, from = new Date()) {
  const today = startOfDay(from);
  const year = today.getFullYear();
  const items = [];
  [year, year + 1, year + 2].forEach((y) => {
    list.forEach((feast) => {
      const date = feastDate(feast, y);
      if (date >= today) items.push({ feast, date, days: daysBetween(today, date) });
    });
  });
  items.sort((a, b) => a.date - b.date);
  return items.slice(0, count);
}

export function movableDates(year) {
  const easter = orthodoxEaster(year);
  return {
    easter,
    palmSunday: addDays(easter, -7),
    ascension: addDays(easter, 39),
    pentecost: addDays(easter, 49),
    lentStart: addDays(easter, -55),
    holyWeekStart: addDays(easter, -7),
    apostlesFastStart: addDays(easter, 50),
  };
}

export function formatShort(date, { year = true } = {}) {
  return new Intl.DateTimeFormat(dateLocale(), {
    day: "numeric",
    month: "short",
    ...(year ? { year: "numeric" } : {}),
  }).format(date);
}

export function formatLong(date) {
  return new Intl.DateTimeFormat(dateLocale(), {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function countdownLabel(days) {
  if (lang() === "ar") {
    if (days === 0) return "اليوم";
    if (days === 1) return "غدًا";
    if (days === -1) return "منذ يوم";
    if (days === -2) return "منذ يومين";
    const abs = Math.abs(days);
    const word = abs <= 10 ? "أيام" : "يومًا";
    return days > 0 ? `بعد ${abs} ${word}` : `منذ ${abs} ${word}`;
  }
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 0) return `${Math.abs(days)} days ago`;
  return `In ${days} days`;
}

export function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export { DAY };
