/* =========================================================
   Language layer — English / Arabic
   Stores the choice under ojn.lang, applies dir/lang to the
   document, and exposes a small dictionary for UI copy.
   ========================================================= */

const KEY = "ojn.lang";

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return "en";
    const value = JSON.parse(raw);
    return value === "ar" ? "ar" : "en";
  } catch {
    return "en";
  }
}

let current = read();

function persist(value) {
  try {
    localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    /* storage may be unavailable */
  }
}

export const LANG_EVENT = "ojn:langchange";

export function lang() {
  return current;
}

export function isRTL() {
  return current === "ar";
}

export function dateLocale() {
  return current === "ar" ? "ar-EG" : "en-GB";
}

export function pad2(value) {
  return new Intl.NumberFormat(dateLocale(), { minimumIntegerDigits: 2, useGrouping: false }).format(value);
}

export function num(value) {
  return new Intl.NumberFormat(dateLocale(), { useGrouping: false }).format(value);
}

export function t(path, vars) {
  const table = current === "ar" ? ar : en;
  let value = path.split(".").reduce((node, part) => (node == null ? node : node[part]), table);
  if (value == null) {
    value = path.split(".").reduce((node, part) => (node == null ? node : node[part]), en);
  }
  if (typeof value !== "string") return "";
  if (vars) {
    value = value.replace(/\{(\w+)\}/g, (match, key) => (vars[key] != null ? String(vars[key]) : match));
  }
  return value;
}

export function applyStatic(root = document) {
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  root.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.dataset.i18nAria));
  });
  root.querySelectorAll("[data-i18n-title]").forEach((el) => {
    el.setAttribute("title", t(el.dataset.i18nTitle));
  });
  root.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.setAttribute("placeholder", t(el.dataset.i18nPlaceholder));
  });

  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute("content", t("meta.description"));
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute("content", t("meta.ogTitle"));
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) ogDescription.setAttribute("content", t("meta.ogDescription"));
}

function applyDocument() {
  const html = document.documentElement;
  html.lang = current;
  html.dir = current === "ar" ? "rtl" : "ltr";
  html.classList.toggle("lang-ar", current === "ar");
  applyStatic();
}

export function setLanguage(next, { persistChoice = true, announce = true } = {}) {
  const normalized = next === "ar" ? "ar" : "en";
  current = normalized;
  if (persistChoice) persist(normalized);
  applyDocument();
  if (announce) {
    window.dispatchEvent(new CustomEvent(LANG_EVENT, { detail: { lang: normalized } }));
  }
}

export function initLanguage() {
  applyDocument();
}

/* =========================================================
   Dictionaries
   ========================================================= */

const en = {
  meta: {
    description:
      "Orthodox John Nashat is a digital home for the Orthodox Christian faith: Scripture, the saints, the sacraments, feasts and fasting, and church history. Founded and managed by Servant John Nashat.",
    ogTitle: "Orthodox John Nashat — A Home for Holy Questions",
    ogDescription:
      "Explore Orthodox Christianity through Scripture, the saints, the sacraments, feasts and fasting, and church history.",
  },
  skip: "Skip to content",
  brandHome: "Orthodox John Nashat — home",
  nav: {
    home: "Home",
    faith: "The Faith",
    bible: "Bible",
    saints: "Saints",
    seasons: "Seasons",
    history: "History",
    learn: "Learn",
    about: "About",
    primary: "Primary",
    mobile: "Mobile",
    footerExplore: "Explore",
    footerLearn: "Learn",
  },
  menu: { open: "Open menu", close: "Close menu", mobileLabel: "Mobile", note: "A quiet corner of the internet for the ancient faith of Alexandria." },
  theme: { switchLight: "Switch to light theme", switchDark: "Switch to dark theme", title: "Switch theme" },
  cta: { explore: "Explore the Faith" },
  footer: {
    about: "A digital home for the Orthodox faith — built to help every seeker draw nearer to Christ.",
    founder: "Founded & managed by",
    founderName: "Servant John Nashat",
    holyBible: "Holy Bible",
    saints: "Lives of the Saints",
    seasons: "Feasts & Fasting",
    faith: "The Faith",
    lessons: "Lessons & Quizzes",
    history: "Church History",
    aboutPlatform: "About the Platform",
    word: "A word",
    quote:
      "“Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven.”",
    quoteRef: "Matthew 5:16 · KJV",
    disclaimer: "For spiritual direction and the sacraments, please speak with your father of confession.",
    copy: "Orthodox John Nashat",
    peace: "Peace be with you.",
  },
  settings: {
    eyebrow: "Settings",
    title: "Make yourself at home.",
    language: "Language",
    languageHint: "The whole site switches immediately. Your choice is remembered on this device.",
    english: "English",
    englishHint: "Read the interface and Scripture in English.",
    arabic: "العربية",
    arabicHint: "اقرأ الواجهة والكتاب المقدس بالعربية.",
    theme: "Theme",
    themeHint: "Light or dark, whichever helps you read.",
    light: "Light",
    dark: "Dark",
    close: "Close settings",
    saved: "Language updated",
  },
  audio: {
    label: "Audio reader",
    title: "Audio & voice",
    hint: "Listen with the voices built into your browser. Nothing plays until you press a read button.",
    unsupported:
      "This browser does not support speech synthesis, so audio reading is unavailable. Try a recent version of Chrome, Edge, or Safari.",
    enable: "Enable audio reading",
    enableShort: "Enable audio",
    enableHint: "Adds a read control on every page and in the Bible reader.",
    language: "Reading language",
    languageHint:
      "“Match text” is recommended: Arabic passages use an Arabic voice and English passages an English voice. A fixed choice applies only when the language of the text is unclear.",
    langAuto: "Match text",
    ar: "Arabic",
    en: "English",
    male: "Male",
    female: "Female",
    voice: "Voice",
    online: "Online",
    voiceHint:
      "Only voices installed in this browser are listed. Voices marked Online come from your browser vendor and need an internet connection. Each language keeps its own choice; an unavailable voice falls back to another voice in the same language.",
    unavailable: "Not available on this device",
    fallback: "Unavailable — using {name}",
    noVoices: "No {lang} voice is installed on this device.",
    detected: "Voices detected: {list}",
    detectedMore: "…and {n} more",
    noVoicesDetected:
      "No compatible voices detected yet. Reopen this panel in a moment if your system is still loading them.",
    genderUnknown: "gender not stated",
    rate: "Speed",
    rateHint: "From slower to faster. Changes apply to the sentence being read.",
    rateValue: "{n}×",
    continue: "Continue between paragraphs and verses",
    continueHint: "When off, playback pauses after each paragraph or verse until you resume.",
    test: "Read a sample",
    testEnglish: "Test English voice",
    testArabic: "Test Arabic voice",
    testEn: "Peace be with you. This is a test of the audio reader.",
    testAr: "السلام لكم. هذا اختبار لقارئ الصوت.",
    pause: "Pause",
    resume: "Resume",
    stop: "Stop",
    play: "Play",
    readPage: "Read page",
    readSelection: "Read selection",
    readBlock: "Read this paragraph aloud",
    readDialog: "Read this dialog",
    previous: "Previous",
    next: "Next",
    settings: "Audio settings",
    ready: "Ready.",
    reading: "Reading: {text}",
    paused: "Paused: {text}",
    finished: "Finished.",
    enableFirst: "Enable audio reading in Settings first.",
    noVoice: "No {lang} voice is available on this device.",
    error: "The browser could not start speech. Try another voice or browser.",
    readerAria: "Bible audio controls",
    readChapter: "Read chapter",
    readVerse: "Read verse",
    previousVerse: "Previous verse",
    nextVerse: "Next verse",
    speed: "Speed",
    verseOf: "Verse {n} of {total}",
    verseNo: "Verse {n}",
    verseSelected: "Verse {n} selected",
    otherReading: "Another section is being read.",
    readerReady: "Choose a verse or read the chapter.",
    readVerseN: "Read verse {n}",
    chapterRangeNote: "Opening the full chapter…",
  },
  titles: {
    home: "Orthodox John Nashat — A Home for Holy Questions",
    faith: "The Faith — Orthodox John Nashat",
    bible: "Holy Bible — Orthodox John Nashat",
    saints: "Lives of the Saints — Orthodox John Nashat",
    seasons: "Feasts & Fasting — Orthodox John Nashat",
    history: "Church History — Orthodox John Nashat",
    learn: "Learn — Orthodox John Nashat",
    about: "About — Orthodox John Nashat",
  },
  error: {
    eyebrow: "Something went wrong",
    title: "This page could not be opened.",
    lead: "Please reload the page, or return to the home page and try again.",
    reload: "Reload",
    home: "Go home",
  },
  home: {
    eyebrow: "A home for holy questions",
    title: "Seek the <em>ancient</em> faith in a modern world.",
    sub: "Scripture, the saints, the sacraments, and two thousand years of the Church of Alexandria — gathered in one quiet place.",
    readBible: "Read the Bible",
    exploreFaith: "Explore the faith",
    founderLine: "Founded & managed by Servant John Nashat",
    rooted: "Rooted in the Coptic Orthodox tradition",
    verseAria: "Verse of the day",
    begin: "Begin",
    welcomeEyebrow: "Welcome",
    welcomeTitle: "An ancient faith, <em>made approachable</em>.",
    welcomeLead1:
      "Orthodox John Nashat exists for the seeker, the student, the returning, and the faithful who want to understand their own Church more deeply.",
    welcomeLead2:
      "Everything here is offered freely: the Scriptures, the lives of the saints, the meaning of the liturgy, and honest answers to difficult questions.",
    point1Title: "Scripture at the centre",
    point1Text: "Read the Bible in a quiet reader and discover the passages the Church returns to again and again.",
    point2Title: "A cloud of witnesses",
    point2Text: "Meet the martyrs, monastics, and fathers whose lives still teach us how to follow Christ.",
    point3Title: "A living tradition",
    point3Text: "Explore the sacraments, the feasts, and the prayers that have shaped Christian worship for centuries.",
    aboutPlatform: "About the platform",
    founderEyebrow: "From the founder",
    founderQuote: "The treasures of the faith should not feel locked away. <em>Come and see.</em>",
    founderName: "Servant John Nashat",
    founderRole: "Founder & servant of the platform",
    featuresEyebrow: "Begin here",
    featuresTitle: "Everything the Church has received, <em>within reach</em>.",
    featuresLead:
      "Six doorways into the Orthodox faith — each one leads deeper into Scripture, worship, and the wisdom of the Fathers.",
    verseBadge: "Verse of the day",
    verseNote: "Scripture quotations are from the King James Version (public domain). A new verse is shown each day.",
    openBible: "Open the Bible",
    feastEyebrow: "The Church's year",
    feastTitle: "Time itself belongs to <em>God</em>.",
    feastText:
      "Feasts and fasts turn the calendar into a prayer. They retell the life of Christ, form the habits of the soul, and remind us that every season — even the difficult ones — is held within the mercy of God.",
    exploreSeasons: "Explore feasts & fasting",
    nextFeast: "Next feast",
    seeYear: "See the whole year",
    saintsEyebrow: "The communion of saints",
    saintsTitle: "Friends who still <em>pray for us</em>.",
    saintsLead:
      "The Church is one body in heaven and on earth. These are a few of the witnesses who have gone before us.",
    meetSaints: "Meet all the saints",
    kjv: "KJV",
    svd: "Smith & Van Dyke",
    heroAlt: "The iconostasis and sanctuary of a Coptic Orthodox church, lit by candlelight",
    manuscriptAlt: "An illuminated manuscript page with gold lettering and ornament",
    monasteryAlt: "A Coptic monastery at dawn in the Egyptian desert",
    monogram: "JN",
  },
  faith: {
    eyebrow: "The faith once delivered",
    title: "What the Church <em>believes</em>.",
    lead:
      "The Coptic Orthodox Church holds the faith of the apostles, the councils, and the Fathers. Here is the creed she prays, the mysteries she celebrates, and the worship that shapes her life.",
    aside:
      "The Church of Alexandria is one of the oldest Christian communities in the world, founded — by her tradition — by St. Mark the Evangelist.",
    creedLabelFallback: "The Nicene Creed",
    prayedTitle: "Prayed, not merely read",
    arabicTitle: "In Arabic",
    wordTitle: "One word to know",
    sacramentsEyebrow: "The seven holy mysteries",
    sacramentsTitle: "Grace that meets us in <em>matter</em>.",
    sacramentsLead:
      "A sacrament is a visible sign through which Christ gives His grace to His Church. The Coptic Orthodox tradition names seven mysteries at the heart of Christian life.",
    explore: "Explore",
    theology: "What the Church teaches",
    scripture: "In Scripture",
    practice: "How it is celebrated",
    seekerNote: "A note for the seeker",
    sacramentEyebrow: "The seven mysteries · {n}",
    worshipEyebrow: "Worship",
    worshipTitle: "The Church at <em>prayer</em>.",
    worshipLead:
      "Orthodox life is woven from liturgy, daily prayer, and sung theology. These are the three wells the faithful return to.",
    teacherTitle: "The Church remains the teacher.",
    teacherText:
      "This page is a beginning, not a substitute for the parish. For the sacraments, spiritual direction, and matters of conscience, please speak with your father of confession or your bishop.",
    study: "Study the foundations",
  },
  bible: {
    eyebrow: "The Holy Scriptures",
    title: "The Bible, <em>read slowly</em>.",
    lead:
      "The Scriptures are the Church's book. Read a passage here, explore the books one by one, or begin with the readings the Church returns to again and again.",
    aside:
      "In English the text is served by bible-api.com (King James Version, public domain). In Arabic it is the Smith & Van Dyke translation, served by getbible.net. The Church also reads Scripture in Coptic and modern translations.",
    readerTitle: "Scripture reader",
    readerHelp: "Choose a book and chapter, or enter an advanced reference — a chapter, a verse, or a range.",
    bookLabel: "Book",
    chapterLabel: "Chapter",
    advanced: "Advanced reference",
    advancedHint: "Type any reference, e.g. “John 3:16-21”.",
    refLabel: "Passage reference",
    placeholder: "e.g. John 3:16-21",
    read: "Read",
    sourceEn: "King James Version · bible-api.com",
    sourceAr: "Smith & Van Dyke · getbible.net",
    canonEyebrow: "The canon",
    canonTitle: "Sixty-six books, <em>one story</em>.",
    canonLead: "Search the library or choose a book to begin reading at its first chapter.",
    filterAria: "Filter by testament",
    allBooks: "All books",
    ot: "Old Testament",
    nt: "New Testament",
    searchBook: "Search for a book",
    searchPlaceholder: "Search a book…",
    noBooks: "No books match that search.",
    chapters: "{n} ch.",
    curatedEyebrow: "Begin here",
    curatedTitle: "Passages the Church <em>returns to</em>.",
    curatedLead:
      "Twelve readings that carry the heart of the gospel, chosen for prayer, study, and quiet reading.",
    opening: "Opening {ref}…",
    tooLong: "That reference is too long. Try something like “Romans 8:28-39”.",
    notFound: "We couldn't find that passage. Try a reference like “John 3:16” or “Psalm 23”.",
    offline: "We couldn't reach the Bible service just now. Check your connection and try again.",
    timeout: "The request took too long. Check your connection and try again.",
    unavailable: "The reading service is unavailable",
    tryAgain: "Try again",
    verseLabel: "Verse {n}",
    chapterOption: "Chapter {n}",
  },
  saints: {
    eyebrow: "The communion of saints",
    title: "Lives that still <em>teach us</em>.",
    lead:
      "Martyrs, monastics, bishops, and ordinary believers whose lives became a confession of Christ. Meet the witnesses of the Church of Alexandria and beyond.",
    aside:
      "The Coptic Synaxarium remembers a saint for every day of the year. This library is a beginning, not the whole calendar.",
    filterAria: "Filter saints",
    searchLabel: "Search the saints",
    searchPlaceholder: "Search a name…",
    noMatch: "No saints match that search.",
    countAll: "{n} witnesses · select one to read their life",
    countFiltered: "{n} of {total} witnesses",
    noteTitle: "Reading hagiography honestly.",
    noteText:
      "The lives of the saints are remembered by the Church in worship and passed down through the Synaxarium. Details sometimes vary between sources and traditions. These accounts are offered for devotion and encouragement, not as a substitute for the Church's fuller calendar or pastoral guidance.",
    walkHistory: "Walk the Church's history",
  },
  seasons: {
    eyebrow: "The Church's year",
    title: "Sacred <em>time</em>.",
    lead:
      "The feasts and fasts of the Coptic Orthodox Church turn the calendar into a prayer. They retell the life of Christ and form the habits of the soul.",
    aside:
      "Dates follow the Coptic Orthodox (Julian) calculation. Local parishes may keep additional commemorations and customs.",
    tabsAria: "Seasons of the Church",
    feasts: "Feasts",
    fasting: "Fasting",
    yearAheadEyebrow: "The year ahead",
    yearAheadTitle: "Feasts of the <em>Lord</em> and His Church.",
    yearAheadLead:
      "Fixed feasts fall on the same civil date each year; movable feasts follow the date of Orthodox Pascha.",
    fixed: "Fixed",
    movable: "Movable",
    movableTitle: "Movable feasts of {year}",
    movableText: "Calculated from the Orthodox date of Pascha, which follows the Julian calendar.",
    palmSunday: "Palm Sunday",
    resurrection: "Resurrection",
    ascension: "Ascension",
    pentecost: "Pentecost",
    fastingTitle: "What fasting means",
    weeklyTitle: "The weekly fast",
    faithBehind: "The faith behind the practice",
    begins: "Begins {date}",
    endsJuly: "ends 12 July",
    range: "{start} – {end}",
    feastCountdown: "{count} · {coptic}",
  },
  history: {
    eyebrow: "Two thousand years",
    title: "A Church that has <em>seen everything</em>.",
    lead:
      "From St. Mark in Alexandria to a global diaspora, the Coptic Orthodox Church has carried the gospel through councils, persecutions, monasteries, and empires. This is her story.",
    aside:
      "History is remembered, not merely recorded. Where dates and details are disputed, this timeline follows the Church's received account and says so plainly.",
    storyEyebrow: "The story",
    storyTitle: "From the Evangelist to <em>today</em>.",
    storyLead: "Fifteen moments that shaped the Church of Alexandria — and the Christian world around her.",
    councilsEyebrow: "The councils",
    councilsTitle: "Councils that <em>defined the faith</em>.",
    councilsLead:
      "The Coptic Church accepts the first three ecumenical councils. Her relationship to the fourth, Chalcedon, remains one of the deepest wounds in Christian history.",
    chalcedonTitle: "On Chalcedon, stated carefully.",
    chalcedonText:
      "The Coptic Church did not accept the definition of Chalcedon (451). She rejects Nestorianism, which divides Christ into two persons, and Eutychianism, which denies the fullness of His humanity. She confesses one incarnate nature of God the Word — fully divine and fully human. The Eastern Orthodox and Catholic churches explain the same mystery in different words. Fair study lets each tradition speak for itself.",
    desertEyebrow: "The desert",
    desertTitle: "The desert became a city of God.",
    desertText:
      "Egypt gave the whole Church the monastic life. Antony withdrew in pursuit of God alone; Pachomius gathered monks into common life; Macarius made Scetis a fountain of spiritual wisdom. Their descendants still pray in the monasteries of Wadi al-Natrun and beyond.",
    meetFathers: "Meet the desert fathers",
    fathersEyebrow: "Voices of the Fathers",
    fathersTitle: "Wisdom that has <em>not aged</em>.",
    fathersLead:
      "The Church's teachers did not write for an age; they wrote for the soul. A few words that still carry weight.",
    study: "Study the foundations",
    manuscriptAlt: "An illuminated Christian manuscript with gold and red ornament",
  },
  learn: {
    eyebrow: "Learn the faith",
    title: "Study it <em>slowly</em>.",
    lead:
      "Short lessons on the foundations of the Orthodox faith, with questions to test what you have understood. Return whenever you want to go deeper.",
    aside:
      "Lessons are written for beginners. They point toward Scripture, the liturgy, and the Fathers — and toward the parish, where the faith is lived.",
    lessonsEyebrow: "Six lessons",
    lessonsTitle: "Foundations for a <em>thoughtful faith</em>.",
    lessonsLead:
      "Each lesson takes about ten minutes. Read the points, sit with the reflection, then ask your own questions.",
    minutesShort: "{n} min",
    minRead: "{n} min read",
    openLesson: "Open lesson",
    lessonEyebrow: "{level} · {minutes} min read · Lesson {n}",
    reflection: "For reflection",
    takeQuiz: "Take a quiz",
    quizzesEyebrow: "Test yourself",
    quizzesTitle: "A little <em>examination</em>.",
    quizzesLead:
      "Two short quizzes on the faith and the Church's history. No scores are shared anywhere — this is for your own learning.",
    questions: "questions",
    minutesEstimate: "~{n} min",
    best: "Best <strong>{score}/{total}</strong>",
    beginQuiz: "Begin quiz",
    reviewFaith: "Review the faith",
    results: "Results",
    questionOf: "Question {n} of {total}",
    exit: "Exit",
    answerOptions: "Answer options",
    correct: "Correct",
    notQuite: "Not quite",
    nextQuestion: "Next question",
    seeResults: "See results",
    tryAgain: "Try again",
    backToQuizzes: "Back to quizzes",
    cleanSweep: "A clean sweep.",
    wellGrounded: "Well grounded.",
    goodBeginning: "A good beginning.",
    placeToStart: "A place to start.",
    noteHigh:
      "You have a firm grasp of these foundations. Keep reading the Scriptures and the Fathers — and ask the questions that remain.",
    noteLow: "Learning is not a test of worth. Review the lessons, and come back when you are ready.",
  },
  about: {
    eyebrow: "About the platform",
    title: "A quiet place for <em>holy questions</em>.",
    lead:
      "Orthodox John Nashat is a digital home for the Orthodox faith — built to help every seeker draw nearer to Christ, in English or Arabic, by reading.",
    aside:
      "Founded and managed by Servant John Nashat. Offered freely, and ordered toward the Church rather than around her.",
    founderName: "Servant John Nashat",
    founderRole: "Founder & manager",
    founderText:
      "This platform began as a work of service: an attempt to gather the treasures of the Orthodox faith into one clear, welcoming place. The aim is not to replace the parish, the priest, or the sacraments, but to lead people toward them — with honesty, beauty, and charity.",
    whyEyebrow: "Why this exists",
    whyTitle: "A doorway, not a substitute.",
    principlesEyebrow: "What guides the work",
    principlesTitle: "Four <em>convictions</em>.",
    principlesLead:
      "These principles shape what is published here, how it is written, and what it refuses to pretend.",
    contactEyebrow: "Contact",
    contactTitle: "Corrections, questions, and encouragement.",
    contactText:
      "If you find an error — a misquoted verse, a misdated feast, an unfair description of another tradition — it matters. Corrections help this platform become more truthful.",
    write: "Write to us",
    exploreLessons: "Explore the lessons",
    transparencyTitle: "Transparency about the technology.",
    transparencyText1:
      "This site does not use an AI assistant, and it sends no questions to any AI service. Every page here is written and edited by hand.",
    transparencyText2:
      "In English, Scripture in the reader comes from bible-api.com in the King James Version, a public-domain translation. In Arabic, it comes from getbible.net in the Smith & Van Dyke translation. Artwork on this site was created for the platform and is not a reproduction of any venerated icon.",
  },
  components: {
    feast: "Feast · {feast}",
    feastShort: "Feast",
    legacy: "Their legacy",
    closeDialog: "Close dialog",
    explore: "Explore",
  },
  tags: {
    All: "All",
    Apostolic: "Apostolic",
    Monastic: "Monastic",
    Fathers: "Fathers",
    Martyrs: "Martyrs",
    Modern: "Modern",
    Foundations: "Foundations",
    Growing: "Growing",
  },
  groups: {
    Law: "Law",
    History: "History",
    Wisdom: "Wisdom",
    "Major Prophets": "Major Prophets",
    "Minor Prophets": "Minor Prophets",
    Gospels: "Gospels",
    Acts: "Acts",
    Pauline: "Pauline",
    General: "General",
    Vision: "Vision",
  },
};

const ar = {
  meta: {
    description:
      "أرثوذكسية جون نشأت بيت رقمي للإيمان المسيحي الأرثوذكسي: الكتاب المقدس، والقديسون، والأسرار، والمواسم والأصوام، وتاريخ الكنيسة. أسَّسه ويديره الخادم جون نشأت.",
    ogTitle: "أرثوذكسية جون نشأت — بيت للأسئلة المقدسة",
    ogDescription:
      "اكتشف المسيحية الأرثوذكسية من خلال الكتاب المقدس والقديسين والأسرار والمواسم والأصوام وتاريخ الكنيسة.",
  },
  skip: "تخطَّ إلى المحتوى",
  brandHome: "أرثوذكسية جون نشأت — الرئيسية",
  nav: {
    home: "الرئيسية",
    faith: "الإيمان",
    bible: "الكتاب المقدس",
    saints: "القديسون",
    seasons: "المواسم",
    history: "التاريخ",
    learn: "تعلّم",
    about: "عن الموقع",
    primary: "التنقل الرئيسي",
    mobile: "التنقل",
    footerExplore: "استكشف",
    footerLearn: "تعلّم",
  },
  menu: {
    open: "افتح القائمة",
    close: "أغلق القائمة",
    mobileLabel: "القائمة",
    note: "زاوية هادئة على الإنترنت لإيمان الإسكندرية القديم.",
  },
  theme: { switchLight: "التبديل إلى الوضع الفاتح", switchDark: "التبديل إلى الوضع الداكن", title: "تبديل المظهر" },
  cta: { explore: "اكتشف الإيمان" },
  footer: {
    about: "بيت رقمي للإيمان الأرثوذكسي — بُني ليساعد كل باحث على الاقتراب من المسيح.",
    founder: "أسَّسه ويديره",
    founderName: "الخادم جون نشأت",
    holyBible: "الكتاب المقدس",
    saints: "سير القديسين",
    seasons: "المواسم والأصوام",
    faith: "الإيمان",
    lessons: "الدروس والاختبارات",
    history: "تاريخ الكنيسة",
    aboutPlatform: "عن المنصة",
    word: "كلمة",
    quote: "«فَلْيُضِئْ نُورُكُمْ هكَذَا قُدَّامَ النَّاسِ، لِكَيْ يَرَوْا أَعْمَالَكُمُ الْحَسَنَةَ، وَيُمَجِّدُوا أَبَاكُمُ الَّذِي فِي السَّمَاوَاتِ.»",
    quoteRef: "متى ٥:١٦ · سميث وفان دايك",
    disclaimer: "للإرشاد الروحي والأسرار، يُرجى التحدث مع أب اعترافك.",
    copy: "أرثوذكسية جون نشأت",
    peace: "السلام لكم.",
  },
  settings: {
    eyebrow: "الإعدادات",
    title: "اجعل نفسك في بيتك.",
    language: "اللغة",
    languageHint: "يتغيّر الموقع كله فورًا، ويُحفظ اختيارك على هذا الجهاز.",
    english: "English",
    englishHint: "اقرأ الواجهة والكتاب المقدس بالإنجليزية.",
    arabic: "العربية",
    arabicHint: "اقرأ الواجهة والكتاب المقدس بالعربية.",
    theme: "المظهر",
    themeHint: "فاتح أو داكن، ما يساعدك على القراءة.",
    light: "فاتح",
    dark: "داكن",
    close: "أغلق الإعدادات",
    saved: "تم تحديث اللغة",
  },
  audio: {
    label: "قارئ الصوت",
    title: "الصوت والقارئ",
    hint: "استمع بالأصوات المدمجة في متصفحك. لا يبدأ أي صوت حتى تضغط زر القراءة.",
    unsupported:
      "هذا المتصفح لا يدعم تحويل النص إلى كلام، لذا القراءة الصوتية غير متاحة. جرّب إصدارًا حديثًا من Chrome أو Edge أو Safari.",
    enable: "تفعيل القراءة الصوتية",
    enableShort: "تفعيل الصوت",
    enableHint: "يضيف زر قراءة في كل صفحة وفي قارئ الكتاب المقدس.",
    language: "لغة القراءة",
    languageHint:
      "يُستحسن «مطابقة النص»: الفصول العربية بصوت عربي والإنجليزية بصوت إنجليزي. أما الاختيار الثابت فيُستخدم فقط عندما تكون لغة النص غير واضحة.",
    langAuto: "مطابقة النص",
    ar: "العربية",
    en: "الإنجليزية",
    male: "ذكر",
    female: "أنثى",
    voice: "الصوت",
    online: "عبر الإنترنت",
    voiceHint:
      "تُعرض فقط الأصوات المثبّتة في هذا المتصفح. الأصوات المعلَّمة بـ«عبر الإنترنت» تأتي من مزوّد المتصفح وتحتاج اتصالًا بالإنترنت. ولكل لغة اختيارها؛ وإذا لم يتوفر الصوت المطلوب يُستخدم صوت آخر من اللغة نفسها.",
    unavailable: "غير متاح على هذا الجهاز",
    fallback: "غير متاح — يُستخدم {name}",
    noVoices: "لا يوجد صوت {lang} مثبّت على هذا الجهاز.",
    detected: "الأصوات المكتشفة: {list}",
    detectedMore: "…و{n} أصوات أخرى",
    noVoicesDetected:
      "لم تُكتشف أصوات متوافقة بعد. أعد فتح هذه اللوحة بعد لحظات إذا كان النظام ما زال يحمّلها.",
    genderUnknown: "الجنس غير محدد",
    rate: "السرعة",
    rateHint: "من الأبطأ إلى الأسرع. يُطبَّق التغيير على الجملة التي تُقرأ.",
    rateValue: "{n}×",
    continue: "المتابعة بين الفقرات والآيات",
    continueHint: "عند الإيقاف، يتوقف التشغيل بعد كل فقرة أو آية حتى تستأنف.",
    test: "اقرأ نموذجًا",
    testEnglish: "اختبار الصوت الإنجليزي",
    testArabic: "اختبار الصوت العربي",
    testEn: "Peace be with you. This is a test of the audio reader.",
    testAr: "السلام لكم. هذا اختبار لقارئ الصوت.",
    pause: "إيقاف مؤقت",
    resume: "متابعة",
    stop: "إيقاف",
    play: "تشغيل",
    readPage: "اقرأ الصفحة",
    readSelection: "اقرأ التحديد",
    readBlock: "اقرأ هذه الفقرة بصوت مسموع",
    readDialog: "اقرأ هذه النافذة",
    previous: "السابق",
    next: "التالي",
    settings: "إعدادات الصوت",
    ready: "جاهز.",
    reading: "يُقرأ: {text}",
    paused: "متوقف مؤقتًا: {text}",
    finished: "انتهى.",
    enableFirst: "فعّل القراءة الصوتية من الإعدادات أولًا.",
    noVoice: "لا يوجد صوت {lang} متاح على هذا الجهاز.",
    error: "تعذّر على المتصفح بدء الكلام. جرّب صوتًا آخر أو متصفحًا آخر.",
    readerAria: "أدوات صوت قارئ الكتاب المقدس",
    readChapter: "اقرأ الفصل",
    readVerse: "اقرأ الآية",
    previousVerse: "الآية السابقة",
    nextVerse: "الآية التالية",
    speed: "السرعة",
    verseOf: "الآية {n} من {total}",
    verseNo: "الآية {n}",
    verseSelected: "الآية {n} محددة",
    otherReading: "يُقرأ قسم آخر الآن.",
    readerReady: "اختر آية أو اقرأ الفصل.",
    readVerseN: "اقرأ الآية {n}",
    chapterRangeNote: "جارٍ فتح الفصل كاملًا…",
  },
  titles: {
    home: "أرثوذكسية جون نشأت — بيت للأسئلة المقدسة",
    faith: "الإيمان — أرثوذكسية جون نشأت",
    bible: "الكتاب المقدس — أرثوذكسية جون نشأت",
    saints: "سير القديسين — أرثوذكسية جون نشأت",
    seasons: "المواسم والأصوام — أرثوذكسية جون نشأت",
    history: "تاريخ الكنيسة — أرثوذكسية جون نشأت",
    learn: "تعلّم — أرثوذكسية جون نشأت",
    about: "عن الموقع — أرثوذكسية جون نشأت",
  },
  error: {
    eyebrow: "حدث خطأ ما",
    title: "تعذّر فتح هذه الصفحة.",
    lead: "يُرجى إعادة تحميل الصفحة، أو العودة إلى الرئيسية والمحاولة مرة أخرى.",
    reload: "إعادة التحميل",
    home: "العودة إلى الرئيسية",
  },
  home: {
    eyebrow: "بيت للأسئلة المقدسة",
    title: "اطلب الإيمان <em>القديم</em> في عالم حديث.",
    sub: "الكتاب المقدس، والقديسون، والأسرار، وألفا عام من تاريخ كنيسة الإسكندرية — مجموعة في مكان هادئ واحد.",
    readBible: "اقرأ الكتاب المقدس",
    exploreFaith: "اكتشف الإيمان",
    founderLine: "أسَّسه ويديره الخادم جون نشأت",
    rooted: "متجذّر في التقليد القبطي الأرثوذكسي",
    verseAria: "آية اليوم",
    begin: "ابدأ",
    welcomeEyebrow: "مرحبًا",
    welcomeTitle: "إيمان قديم، <em>قريب من القلب</em>.",
    welcomeLead1:
      "وُجد موقع أرثوذكسية جون نشأت من أجل الباحث، والطالب، والعائد، والمؤمن الذي يريد أن يفهم كنيسته بعمق أكبر.",
    welcomeLead2:
      "كل ما هنا مقدَّم مجانًا: الكتاب المقدس، وسير القديسين، ومعنى الليتورجيا، وإجابات صادقة عن أسئلة صعبة.",
    point1Title: "الكتاب في المركز",
    point1Text: "اقرأ الكتاب المقدس في قارئ هادئ واكتشف الفصول التي تعود إليها الكنيسة دائمًا.",
    point2Title: "سحابة شهود",
    point2Text: "تعرَّف على الشهداء والرهبان والآباء الذين ما زالت حياتهم تعلّمنا كيف نتبع المسيح.",
    point3Title: "تقليد حيّ",
    point3Text: "تأمَّل الأسرار والمواسم والصلوات التي شكّلت العبادة المسيحية عبر القرون.",
    aboutPlatform: "عن المنصة",
    founderEyebrow: "من المؤسس",
    founderQuote: "كنوز الإيمان يجب ألّا تبقى مقفلة. <em>تعال وانظر.</em>",
    founderName: "الخادم جون نشأت",
    founderRole: "مؤسس المنصة وخادمها",
    featuresEyebrow: "ابدأ من هنا",
    featuresTitle: "كل ما تسلَّمته الكنيسة، <em>في متناول يدك</em>.",
    featuresLead:
      "ستة أبواب إلى الإيمان الأرثوذكسي — كل باب يقودك أعمق إلى الكتاب المقدس والعبادة وحكمة الآباء.",
    verseBadge: "آية اليوم",
    verseNote: "اقتباسات الكتاب المقدس من ترجمة سميث وفان دايك (ملكية عامة). تُعرض آية جديدة كل يوم.",
    openBible: "افتح الكتاب المقدس",
    feastEyebrow: "سنة الكنيسة",
    feastTitle: "الزمن نفسه <em>لله</em>.",
    feastText:
      "المواسم والأصوام تحوّل التقويم إلى صلاة. تروي حياة المسيح، وتشكّل عادات النفس، وتذكّرنا أن كل موسم — حتى الصعب منه — محفوظ في رحمة الله.",
    exploreSeasons: "استكشف المواسم والأصوام",
    nextFeast: "العيد القادم",
    seeYear: "اطّلع على السنة كلها",
    saintsEyebrow: "شركة القديسين",
    saintsTitle: "أصدقاء ما زالوا <em>يصلّون لأجلنا</em>.",
    saintsLead: "الكنيسة جسد واحد في السماء وعلى الأرض. هؤلاء بعض الشهود الذين سبقونا.",
    meetSaints: "تعرَّف على جميع القديسين",
    kjv: "KJV",
    svd: "سميث وفان دايك",
    heroAlt: "أيقونستاس كنيسة قبطية أرثوذكسية ومذبحها على ضوء الشموع",
    manuscriptAlt: "صفحة مخطوط مضيء بحروف وذهن وزخرفة",
    monasteryAlt: "دير قبطي عند الفجر في صحراء مصر",
    monogram: "جن",
  },
  faith: {
    eyebrow: "الإيمان المُسلَّم مرة للقديسين",
    title: "ما <em>تؤمن</em> به الكنيسة.",
    lead:
      "تحفظ الكنيسة القبطية الأرثوذكسية إيمان الرسل والمجامع والآباء. هذا هو قانون الإيمان الذي تصلّيه، والأسرار التي تحتفل بها، والعبادة التي تشكّل حياتها.",
    aside:
      "كنيسة الإسكندرية من أقدم الجماعات المسيحية في العالم، أسسها — بحسب تقليدها — مار مرقس الإنجيلي.",
    creedLabelFallback: "قانون الإيمان النيقاوي",
    prayedTitle: "يُصلَّى، لا يُقرأ فقط",
    arabicTitle: "بالعربية",
    wordTitle: "كلمة واحدة يجب معرفتها",
    sacramentsEyebrow: "الأسرار السبعة المقدسة",
    sacramentsTitle: "نعمة تلقانا في <em>المادة</em>.",
    sacramentsLead:
      "السرّ علامة مرئية يمنح بها المسيح نعمته لكنيسته. ويُسمّي التقليد القبطي الأرثوذكسي سبعة أسرار في قلب الحياة المسيحية.",
    explore: "تأمَّل",
    theology: "ما تعلّمه الكنيسة",
    scripture: "في الكتاب المقدس",
    practice: "كيف يُحتفل به",
    seekerNote: "ملاحظة للباحث",
    sacramentEyebrow: "الأسرار السبعة · {n}",
    worshipEyebrow: "العبادة",
    worshipTitle: "الكنيسة في <em>الصلاة</em>.",
    worshipLead:
      "حياة الأرثوذكسية منسوجة من الليتورجيا والصلاة اليومية واللاهوت المرتَّل. هذه ثلاثة آبار يعود إليها المؤمنون.",
    teacherTitle: "الكنيسة تبقى المعلّمة.",
    teacherText:
      "هذه الصفحة بداية، وليست بديلًا عن الرعية. أما الأسرار والإرشاد الروحي وأمور الضمير، فيُرجى التحدث مع أب اعترافك أو أسقفك.",
    study: "ادرس الأسس",
  },
  bible: {
    eyebrow: "الكتاب المقدس",
    title: "الكتاب المقدس، <em>يُقرأ بتأنٍّ</em>.",
    lead:
      "الكتاب المقدس هو كتاب الكنيسة. اقرأ فصلًا هنا، أو تصفَّح الأسفار سفرًا سفرًا، أو ابدأ بالقراءات التي تعود إليها الكنيسة دائمًا.",
    aside:
      "في الوضع الإنجليزي يُقدَّم النص من bible-api.com بترجمة الملك جيمس (KJV)، وفي الوضع العربي بترجمة سميث وفان دايك من getbible.net. وتقرأ الكنيسة الكتاب أيضًا بالقبطية والترجمات الحديثة.",
    readerTitle: "قارئ الكتاب المقدس",
    readerHelp: "اختر سفرًا وفصلًا، أو أدخل مرجعًا متقدمًا — فصلًا أو آية أو نطاقًا.",
    bookLabel: "السفر",
    chapterLabel: "الفصل",
    advanced: "مرجع متقدم",
    advancedHint: "اكتب أي مرجع، مثل «يوحنا ٣:١٦-٢١».",
    refLabel: "مرجع الفصل",
    placeholder: "مثال: يوحنا 3:16-21",
    read: "اقرأ",
    sourceEn: "ترجمة الملك جيمس · bible-api.com",
    sourceAr: "ترجمة سميث وفان دايك · getbible.net",
    canonEyebrow: "الأسفار",
    canonTitle: "ستة وستون سفرًا، <em>قصة واحدة</em>.",
    canonLead: "ابحث في المكتبة أو اختر سفرًا لتبدأ من فصله الأول.",
    filterAria: "تصفية بحسب العهد",
    allBooks: "كل الأسفار",
    ot: "العهد القديم",
    nt: "العهد الجديد",
    searchBook: "ابحث عن سفر",
    searchPlaceholder: "ابحث عن سفر…",
    noBooks: "لا توجد أسفار تطابق بحثك.",
    chapters: "{n} فصلًا",
    curatedEyebrow: "ابدأ هنا",
    curatedTitle: "فصول تعود إليها <em>الكنيسة</em>.",
    curatedLead: "اثنا عشر فصلًا تحمل قلب الإنجيل، اختيرت للصلاة والدراسة والقراءة الهادئة.",
    opening: "جارٍ فتح {ref}…",
    tooLong: "هذا المرجع طويل جدًا. جرّب شيئًا مثل «رومية 8:28-39».",
    notFound: "لم نجد هذا الفصل. جرّب مرجعًا مثل «يوحنا 3:16» أو «مزمور 23».",
    offline: "تعذّر الوصول إلى خدمة الكتاب المقدس الآن. تحقّق من اتصالك وحاول مرة أخرى.",
    timeout: "استغرق الطلب وقتًا طويلًا. تحقّق من اتصالك وحاول مرة أخرى.",
    unavailable: "خدمة القراءة غير متاحة",
    tryAgain: "حاول مرة أخرى",
    verseLabel: "الآية {n}",
    chapterOption: "الفصل {n}",
  },
  saints: {
    eyebrow: "شركة القديسين",
    title: "حياة ما زالت <em>تعلّمنا</em>.",
    lead:
      "شهداء ورهبان وأساقفة ومؤمنون عاديون صارت حياتهم اعترافًا بالمسيح. تعرَّف على شهود كنيسة الإسكندرية وما وراءها.",
    aside: "يذكر السنكسار القبطي قديسًا لكل يوم من أيام السنة. هذه المكتبة بداية، وليست التقويم كله.",
    filterAria: "تصفية القديسين",
    searchLabel: "ابحث في القديسين",
    searchPlaceholder: "ابحث عن اسم…",
    noMatch: "لا يوجد قديسون يطابقون بحثك.",
    countAll: "{n} شاهدًا · اختر واحدًا لتقرأ حياته",
    countFiltered: "{n} من {total} شاهدًا",
    noteTitle: "قراءة سير القديسين بأمانة.",
    noteText:
      "تحفظ الكنيسة سير القديسين في عبادتها وتنقلها عبر السنكسار. وقد تختلف بعض التفاصيل بين المصادر والتقاليد. هذه السير مقدَّمة للتعبد والتشجيع، وليست بديلًا عن تقويم الكنيسة الكامل أو الإرشاد الرعوي.",
    walkHistory: "سِر في تاريخ الكنيسة",
  },
  seasons: {
    eyebrow: "سنة الكنيسة",
    title: "الزمن <em>المقدس</em>.",
    lead:
      "مواسم الكنيسة القبطية الأرثوذكسية وأصوامها تحوّل التقويم إلى صلاة. تروي حياة المسيح وتشكّل عادات النفس.",
    aside: "تتبع التواريخ الحساب القبطي الأرثوذكسي (اليولياني). وقد تحفظ الرعايا المحلية تذكارات وعادات إضافية.",
    tabsAria: "مواسم الكنيسة",
    feasts: "الأعياد",
    fasting: "الأصوام",
    yearAheadEyebrow: "السنة القادمة",
    yearAheadTitle: "أعياد <em>الرب</em> وكنيسته.",
    yearAheadLead: "الأعياد الثابتة تقع في التاريخ المدني نفسه كل سنة؛ والأعياد المتحركة تتبع تاريخ الفصح الأرثوذكسي.",
    fixed: "ثابت",
    movable: "متحرك",
    movableTitle: "أعياد {year} المتحركة",
    movableText: "محسوبة من تاريخ الفصح الأرثوذكسي، الذي يتبع التقويم اليولياني.",
    palmSunday: "أحد الزيتون",
    resurrection: "عيد القيامة",
    ascension: "عيد الصعود",
    pentecost: "عيد العنصرة",
    fastingTitle: "ما معنى الصوم",
    weeklyTitle: "الصوم الأسبوعي",
    faithBehind: "الإيمان وراء الممارسة",
    begins: "يبدأ {date}",
    endsJuly: "وينتهي ١٢ يوليو",
    range: "{start} – {end}",
    feastCountdown: "{count} · {coptic}",
  },
  history: {
    eyebrow: "ألفا عام",
    title: "كنيسة <em>رأت كل شيء</em>.",
    lead:
      "من مار مرقس في الإسكندرية إلى الشتات العالمي، حملت الكنيسة القبطية الأرثوذكسية الإنجيل عبر المجامع والاضطهادات والأديرة والإمبراطوريات. هذه قصتها.",
    aside:
      "التاريخ يُتذكَّر، لا يُسجَّل فقط. وحيث تختلف التواريخ والتفاصيل، يتبع هذا الخط الزمني الرواية التي تسلَّمتها الكنيسة ويقول ذلك بوضوح.",
    storyEyebrow: "القصة",
    storyTitle: "من الإنجيلي إلى <em>اليوم</em>.",
    storyLead: "خمس عشرة لحظة شكّلت كنيسة الإسكندرية — والعالم المسيحي حولها.",
    councilsEyebrow: "المجامع",
    councilsTitle: "مجامع <em>حدّدت الإيمان</em>.",
    councilsLead:
      "تقبل الكنيسة القبطية أول ثلاثة مجامع مسكونية. أما علاقتها بالرابع، خلقيدونية، فما زالت من أعمق الجروح في التاريخ المسيحي.",
    chalcedonTitle: "عن خلقيدونية، بكلمات دقيقة.",
    chalcedonText:
      "لم تقبل الكنيسة القبطية تعريف خلقيدونية (451). وهي ترفض النسطورية التي تقسم المسيح إلى شخصين، وأوطاخية التي تنكر كمال إنسانيته. وتعترف بإنسان واحد متجسّد لله الكلمة — إله كامل وإنسان كامل. وتشرح الكنائس الأرثوذكسية الشرقية والكاثوليكية السر نفسه بكلمات مختلفة. والدراسة المنصفة تترك كل تقليد يتكلم عن نفسه.",
    desertEyebrow: "الصحراء",
    desertTitle: "صارت الصحراء مدينة لله.",
    desertText:
      "أعطت مصر الكنيسة كلها الحياة الرهبانية. انسحب أنطونيوس طلبًا لله وحده؛ وجمع باخوميوس الرهبان في حياة مشتركة؛ وجعل مقار السقيط ينبوعًا للحكمة الروحية. وما زال أحفادهم يصلّون في أديرة وادي النطرون وما وراءه.",
    meetFathers: "تعرَّف على آباء الصحراء",
    fathersEyebrow: "أصوات الآباء",
    fathersTitle: "حكمة <em>لم تشِخ</em>.",
    fathersLead: "لم يكتب معلّمو الكنيسة لعصر، بل للنفس. كلمات قليلة ما زالت تحمل وزنًا.",
    study: "ادرس الأسس",
    manuscriptAlt: "مخطوط مسيحي مزخرف بالذهب والأحمر",
  },
  learn: {
    eyebrow: "تعلّم الإيمان",
    title: "ادرسه <em>بتأنٍّ</em>.",
    lead:
      "دروس قصيرة في أسس الإيمان الأرثوذكسي، مع أسئلة لاختبار ما فهمته. عُد متى أردت أن تتعمّق.",
    aside: "الدروس مكتوبة للمبتدئين، وتشير إلى الكتاب المقدس والليتورجيا والآباء — وإلى الرعية حيث يُعاش الإيمان.",
    lessonsEyebrow: "ستة دروس",
    lessonsTitle: "أسس <em>لإيمان متأمّل</em>.",
    lessonsLead: "يستغرق كل درس نحو عشر دقائق. اقرأ النقاط، وتأمّل في السؤال، ثم اطرح أسئلتك.",
    minutesShort: "{n} دقيقة",
    minRead: "{n} دقيقة قراءة",
    openLesson: "افتح الدرس",
    lessonEyebrow: "{level} · {minutes} دقيقة قراءة · الدرس {n}",
    reflection: "للتأمل",
    takeQuiz: "ابدأ اختبارًا",
    quizzesEyebrow: "اختبر نفسك",
    quizzesTitle: "<em>فحص</em> صغير.",
    quizzesLead: "اختباران قصيران في الإيمان وتاريخ الكنيسة. لا تُشارك النتائج في أي مكان — هذا لتعلّمك الشخصي.",
    questions: "أسئلة",
    minutesEstimate: "~{n} دقيقة",
    best: "أفضل نتيجة <strong>{score}/{total}</strong>",
    beginQuiz: "ابدأ الاختبار",
    reviewFaith: "راجع الإيمان",
    results: "النتيجة",
    questionOf: "السؤال {n} من {total}",
    exit: "خروج",
    answerOptions: "خيارات الإجابة",
    correct: "صحيح",
    notQuite: "ليس تمامًا",
    nextQuestion: "السؤال التالي",
    seeResults: "اعرض النتيجة",
    tryAgain: "حاول مرة أخرى",
    backToQuizzes: "العودة إلى الاختبارات",
    cleanSweep: "إجابة كاملة.",
    wellGrounded: "أساس متين.",
    goodBeginning: "بداية طيبة.",
    placeToStart: "نقطة بداية.",
    noteHigh: "لديك إمساك متين بهذه الأسس. واصل قراءة الكتاب المقدس والآباء — واطرح الأسئلة الباقية.",
    noteLow: "التعلّم ليس اختبارًا لقيمتك. راجع الدروس، وعُد حين تكون مستعدًا.",
  },
  about: {
    eyebrow: "عن المنصة",
    title: "مكان هادئ <em>للأسئلة المقدسة</em>.",
    lead:
      "أرثوذكسية جون نشأت بيت رقمي للإيمان الأرثوذكسي — بُني ليساعد كل باحث على الاقتراب من المسيح، بالإنجليزية أو العربية، بالقراءة.",
    aside: "أسَّسه ويديره الخادم جون نشأت. مقدَّم مجانًا، وموجَّه نحو الكنيسة لا حولها.",
    founderName: "الخادم جون نشأت",
    founderRole: "المؤسس والمدير",
    founderText:
      "بدأت هذه المنصة عملًا من أعمال الخدمة: محاولة لجمع كنوز الإيمان الأرثوذكسي في مكان واحد واضح ومُرحِّب. الهدف ليس أن تحلّ محل الرعية أو الكاهن أو الأسرار، بل أن تقود الناس إليها — بصدق وجمال ومحبة.",
    whyEyebrow: "لماذا وُجد هذا",
    whyTitle: "باب، لا بديل.",
    principlesEyebrow: "ما يوجّه العمل",
    principlesTitle: "أربع <em>قناعات</em>.",
    principlesLead: "هذه المبادئ تشكّل ما يُنشر هنا، وكيف يُكتب، وما يرفض أن يتظاهر به.",
    contactEyebrow: "تواصل",
    contactTitle: "تصحيحات وأسئلة وتشجيع.",
    contactText:
      "إن وجدت خطأً — آية منقولة خطأً، أو عيدًا بتاريخ خاطئ، أو وصفًا غير منصف لتقليد آخر — فهذا مهم. التصحيحات تساعد هذه المنصة على أن تصير أكثر صدقًا.",
    write: "راسلنا",
    exploreLessons: "استكشف الدروس",
    transparencyTitle: "شفافية بشأن التقنية.",
    transparencyText1:
      "لا يستخدم هذا الموقع مساعدًا ذكيًا، ولا يرسل أي أسئلة إلى أي خدمة ذكاء اصطناعي. كل صفحة هنا مكتوبة ومحرَّرة يدويًا.",
    transparencyText2:
      "في الإنجليزية يُؤخذ الكتاب المقدس في القارئ من bible-api.com بترجمة الملك جيمس، وهي ترجمة في الملكية العامة. وفي العربية يُؤخذ من getbible.net بترجمة سميث وفان دايك. أما الأعمال الفنية في هذا الموقع فقد أُنشئت للمنصة وليست نسخًا لأي أيقونة مكرَّمة.",
  },
  components: {
    feast: "العيد · {feast}",
    feastShort: "العيد",
    legacy: "أثرهم",
    closeDialog: "أغلق النافذة",
    explore: "تأمَّل",
  },
  tags: {
    All: "الكل",
    Apostolic: "رسولي",
    Monastic: "رهباني",
    Fathers: "آبائي",
    Martyrs: "شهيد",
    Modern: "حديث",
    Foundations: "الأسس",
    Growing: "النمو",
  },
  groups: {
    Law: "الشريعة",
    History: "التاريخ",
    Wisdom: "الحكمة",
    "Major Prophets": "الأنبياء الكبار",
    "Minor Prophets": "الأنبياء الصغار",
    Gospels: "الأناجيل",
    Acts: "الأعمال",
    Pauline: "الرسائل البولسية",
    General: "الرسائل الجامعة",
    Vision: "الرؤيا",
  },
};
