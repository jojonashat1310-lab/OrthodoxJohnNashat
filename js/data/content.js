/* =========================================================
   Content for Orthodox John Nashat
   Wording is deliberately careful: defined doctrine, accepted
   history, and pastoral practice are kept distinct.
   ========================================================= */

export const stats = [
  { num: "2,000", suffix: "+", label: "years of Orthodox witness from Alexandria" },
  { num: "7", suffix: "", label: "holy mysteries at the heart of the Church" },
  { num: "210", suffix: "+", label: "days of fasting in the Coptic year" },
  { num: "24/7", suffix: "", label: "a quiet place to read and learn" },
];

export const verses = [
  { text: "The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?", ref: "Psalm 27:1", theme: "Courage" },
  { text: "Then spake Jesus again unto them, saying, I am the light of the world: he that followeth me shall not walk in darkness, but shall have the light of life.", ref: "John 8:12", theme: "Light" },
  { text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest.", ref: "Matthew 11:28", theme: "Rest" },
  { text: "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.", ref: "John 14:6", theme: "The Way" },
  { text: "The LORD is my shepherd; I shall not want.", ref: "Psalm 23:1", theme: "Providence" },
  { text: "And now abideth faith, hope, charity, these three; but the greatest of these is charity.", ref: "1 Corinthians 13:13", theme: "Love" },
  { text: "I can do all things through Christ which strengtheneth me.", ref: "Philippians 4:13", theme: "Strength" },
  { text: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.", ref: "Isaiah 40:31", theme: "Hope" },
  { text: "Create in me a clean heart, O God; and renew a right spirit within me.", ref: "Psalm 51:10", theme: "Repentance" },
  { text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.", ref: "Romans 8:28", theme: "Trust" },
  { text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.", ref: "John 3:16", theme: "Grace" },
  { text: "Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven.", ref: "Matthew 5:16", theme: "Witness" },
  { text: "Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.", ref: "Psalm 46:10", theme: "Stillness" },
  { text: "I will lift up mine eyes unto the hills, from whence cometh my help. My help cometh from the LORD, which made heaven and earth.", ref: "Psalm 121:1–2", theme: "Help" },
];

export const features = [
  {
    icon: "compass",
    title: "Learn the Faith",
    text: "Short lessons and quizzes on the foundations of the Orthodox faith, written for beginners and for anyone who wants to go deeper.",
    href: "#/learn",
    link: "Start learning",
  },
  {
    icon: "bookOpen",
    title: "The Holy Bible",
    text: "Read the Scriptures in a quiet reader, explore the books one by one, and begin with passages the Church returns to again and again.",
    href: "#/bible",
    link: "Open the Bible",
  },
  {
    icon: "star",
    title: "Lives of the Saints",
    text: "Meet the martyrs, monastics, and fathers whose lives still teach the Church how to follow Christ — from Alexandria to the desert.",
    href: "#/saints",
    link: "Meet the saints",
  },
  {
    icon: "chalice",
    title: "The Seven Mysteries",
    text: "Baptism, chrismation, Eucharist, repentance, unction, marriage, and priesthood — what the Church believes and how she celebrates.",
    href: "#/faith",
    link: "Explore the sacraments",
  },
  {
    icon: "calendar",
    title: "Feasts & Fasting",
    text: "The rhythm of the Church's year: the great feasts, the fasting seasons, and the meaning of time offered back to God.",
    href: "#/seasons",
    link: "Enter the seasons",
  },
  {
    icon: "scroll",
    title: "Church History",
    text: "From St. Mark in Alexandria to the global Coptic Church — two thousand years of councils, monasteries, persecution, and faithfulness.",
    href: "#/history",
    link: "Walk the timeline",
  },
];

export const creed = {
  label: "The Nicene Creed",
  intro: "As prayed in the Coptic Orthodox Church. This is the faith of Nicaea and Constantinople, without the later Western addition of the Filioque.",
  paragraphs: [
    "I believe in one God, the Father Almighty, Maker of heaven and earth, and of all things visible and invisible.",
    "And in one Lord Jesus Christ, the Only-Begotten Son of God, begotten of the Father before all ages; Light of Light, true God of true God; begotten, not created; of one essence with the Father, by whom all things were made; who for us men and for our salvation came down from heaven, and was incarnate of the Holy Spirit and the Virgin Mary, and became man. And He was crucified for us under Pontius Pilate, suffered and was buried. And the third day He rose again according to the Scriptures, and ascended into heaven, and sits at the right hand of the Father. And He shall come again in His glory to judge the living and the dead, whose kingdom shall have no end.",
    "Yes, we believe in the Holy Spirit, the Lord and Giver of life, who proceeds from the Father, who with the Father and the Son is worshipped and glorified, who spoke by the prophets. And in one holy, catholic and apostolic Church. We confess one baptism for the remission of sins. We look for the resurrection of the dead, and the life of the world to come. Amen.",
  ],
  arabic: "نؤمن بإله واحد، الآب ضابط الكل، خالق السماء والأرض، وكل ما يُرى وما لا يُرى.",
  arabicNote: "The Creed is prayed in Coptic and Arabic in the Coptic liturgy. Many parishes pray it in the language of the people as well.",
  note: "The word “catholic” here means the whole, universal Church — not a particular denomination.",
};

export const sacraments = [
  {
    id: "baptism",
    name: "Baptism",
    ar: "المعمودية",
    icon: "water",
    tagline: "New birth in water and the Holy Spirit.",
    desc: "The door into the Christian life: buried with Christ and raised with Him.",
    theology: [
      "Baptism is the beginning of the Christian life. The Church baptizes by triple immersion in the name of the Father, the Son, and the Holy Spirit, believing that this mystery buries the old life and raises the baptized into the resurrection of Christ.",
      "In the Coptic tradition, infants are baptized on the faith of the Church and with sponsors who promise to nurture them in the faith. Chrismation and first communion follow immediately.",
    ],
    scripture: ["John 3:5", "Matthew 28:19", "Romans 6:3–4", "Acts 2:38"],
    practice:
      "Celebrated in the church baptistery. The priest blesses the water, the candidate (or sponsor) renounces Satan, the candidate is anointed with oil and immersed three times, then sealed with holy myron and given first communion.",
    note:
      "Baptism is not repeated. Christians baptized in other traditions are received according to the pastoral norms of the Coptic Church, which the local bishop applies case by case.",
  },
  {
    id: "chrismation",
    name: "Chrismation",
    ar: "الميرون",
    icon: "sparkle",
    tagline: "The seal of the Holy Spirit.",
    desc: "The anointing that completes baptism and strengthens the new life in Christ.",
    theology: [
      "Immediately after baptism, the priest seals the newly baptized with holy myron, oil consecrated by the Patriarch, praying for the gift of the Holy Spirit. The Coptic Church sees this as the completion of baptism rather than a separate, later stage of Christian initiation.",
      "The seal is a gift and a responsibility: the Spirit who gives life also empowers witness, prayer, and holiness.",
    ],
    scripture: ["Acts 8:14–17", "2 Corinthians 1:21–22", "Ephesians 1:13", "1 John 2:20"],
    practice:
      "The priest anoints the forehead, eyes, ears, mouth, chest, hands, and feet. Holy myron is consecrated by the Pope and distributed to the parishes; the Coptic Church treats its preparation and consecration with great reverence.",
    note:
      "Eastern Orthodox churches call this mystery chrismation. In the Latin West, confirmation is ordinarily administered later, usually by a bishop.",
  },
  {
    id: "eucharist",
    name: "Eucharist",
    ar: "الإفخارستيا",
    icon: "chalice",
    tagline: "The Body and Blood of Christ.",
    desc: "The heart of the Church's life, offered and received in the Divine Liturgy.",
    theology: [
      "In the Divine Liturgy the Church offers bread and wine and asks the Holy Spirit to make them the Body and Blood of Christ. The Coptic Church confesses the real presence of Christ in the Eucharist, received in faith, love, and repentance.",
      "Communion is not a private reward but the bond of the one Body. The faithful approach the chalice as members of the Church, at peace with God and one another.",
    ],
    scripture: ["John 6:53–58", "1 Corinthians 11:23–29", "Luke 22:19–20"],
    practice:
      "The Eucharist is celebrated in the Divine Liturgy and received fasting, normally at the end of the Liturgy. Preparation includes prayer, examination of conscience, and — for many — confession. Communion is given under both kinds; the priest administers the precious Blood.",
    note:
      "The Coptic Church does not practice intercommunion with churches not in full communion with her. How often to commune is best discussed with your father of confession.",
  },
  {
    id: "repentance",
    name: "Repentance & Confession",
    ar: "التوبة والاعتراف",
    icon: "heart",
    tagline: "Returning to the Father.",
    desc: "Confession, absolution, and the grace of a changed life.",
    theology: [
      "Repentance is a continual turning of the heart toward God. In the mystery of confession the penitent confesses to a priest, who prays, counsels, and pronounces absolution in the name of Christ. The Church's tradition calls repentance a 'second baptism' of tears.",
      "Absolution is medicine, not permission: it restores the sinner to communion and calls forth a new life of prayer, honesty, and mercy.",
    ],
    scripture: ["1 John 1:8–9", "John 20:22–23", "2 Corinthians 5:18–20", "James 5:16"],
    practice:
      "Confession is made to a priest, who is bound by the seal of confession. He may offer guidance or a penance suited to the person. The grace of the mystery is received in faith, not in the mere recitation of sins.",
    note:
      "The Coptic Church normally expects personal confession to a priest, not merely a private prayer of repentance. Frequency and preparation are matters of pastoral counsel.",
  },
  {
    id: "unction",
    name: "Unction of the Sick",
    ar: "مسحة المرضى",
    icon: "oil",
    tagline: "Prayer and anointing for healing.",
    desc: "The Church accompanies the sick with oil, faith, and prayer for body and soul.",
    theology: [
      "The Church anoints the sick with oil and prays for healing, forgiveness, and peace, trusting God's power to restore in body or in spirit. The mystery unites the suffering person to Christ, who bore our infirmities.",
      "It is a prayer of the whole Church with the sick, not a magical guarantee. Healing, in God's wisdom, may come in this life or in the life to come.",
    ],
    scripture: ["James 5:14–15", "Mark 6:13", "Psalm 103:3"],
    practice:
      "Served by a priest with oil blessed in prayer, often in church or at home. The sick person is anointed on the forehead, hands, and other parts while the Church asks for healing and mercy.",
    note:
      "The mystery is not only for the dying, and it does not replace medical care. The Church honors medicine as a gift of God working alongside prayer.",
  },
  {
    id: "matrimony",
    name: "Matrimony",
    ar: "الإكليل",
    icon: "rings",
    tagline: "The crowning of a new family.",
    desc: "A man and a woman are joined in Christ and crowned as an icon of His love.",
    theology: [
      "Marriage is a holy mystery in which God unites a man and a woman for life, blesses their love, and makes their home a little church. The crowns proclaim the kingdom; the shared cup recalls the wedding at Cana.",
      "Christian marriage is a vocation of self-giving. It is ordered toward communion, faithfulness, and the raising of children in the faith.",
    ],
    scripture: ["Matthew 19:4–6", "Ephesians 5:25–32", "John 2:1–11"],
    practice:
      "The service includes betrothal, the exchange of rings, prayers, the crowning, the sharing of a common cup, and a procession. Marriages are celebrated in the Church after preparation with a priest.",
    note:
      "The Coptic Church does not remarry a divorced person without pastoral and canonical review under the bishop. Anyone planning marriage should speak with a priest first.",
  },
  {
    id: "priesthood",
    name: "Priesthood",
    ar: "الكهنوت",
    icon: "hands",
    tagline: "Ordination for service.",
    desc: "Bishops, priests, and deacons set apart by the laying on of hands.",
    theology: [
      "Through the laying on of hands in apostolic succession, the Church sets apart servants for the altar, the word, and the care of souls. Ordination is a call to sacrifice, not a rank of privilege.",
      "The ordained ministry exists for the upbuilding of the whole people of God. Every Christian shares in the royal priesthood of baptism and is called to service.",
    ],
    scripture: ["Acts 6:6", "1 Timothy 4:14", "2 Timothy 1:6", "Titus 1:5"],
    practice:
      "The Coptic Church knows three ranks: bishop, priest (presbyter), and deacon. Bishops stand in the apostolic succession, led by the Pope and Patriarch of Alexandria. The Church ordains men; monastic and married vocations are both honored.",
    note:
      "This mystery concerns the whole Church. Teaching, sacred music, charity, and quiet service by lay people are also true vocations within the Body of Christ.",
  },
];

export const worship = [
  {
    icon: "church",
    title: "The Divine Liturgy",
    text: "The Liturgy of St. Basil is the ordinary Sunday liturgy of the Coptic Church, along with the liturgies of St. Gregory and St. Cyril on particular days. In it the Church hears the Word and is fed at the Table of the Lord.",
    items: [
      "Liturgy of the Word: readings, psalmody, and the Gospel",
      "The anaphora: thanksgiving, narrative, and epiclesis",
      "Communion: the faithful share the one Bread and Cup",
    ],
  },
  {
    icon: "clock",
    title: "The Agpeya",
    text: "The Book of Hours, the Church's daily prayer. Seven hours mark the day with psalms, a Gospel reading, litanies, and the Lord's Prayer — sanctifying time rather than merely filling it.",
    items: [
      "First, Third, Sixth, and Ninth hours by day",
      "Vespers and Compline in the evening",
      "The Midnight praise and its watches",
    ],
  },
  {
    icon: "dove",
    title: "Tasbeha & Hymns",
    text: "The Coptic Church sings its theology. The midnight praise, the doxologies, and the seasonal hymns carry the faith in melodies that have shaped generations of prayer.",
    items: [
      "Annual, joyful, and fasting hymn traditions",
      "Coptic hymnody alongside Arabic and other languages",
      "The whole community formed by sung prayer",
    ],
  },
];

/* ---------------------------------------------------------
   Bible
   --------------------------------------------------------- */

const bookRows = [
  ["Genesis", "التكوين", 50, "Law", "Creation, the patriarchs, and God's covenant with Abraham."],
  ["Exodus", "الخروج", 40, "History", "Israel's deliverance from Egypt and the covenant at Sinai."],
  ["Leviticus", "اللاويين", 27, "Law", "Laws of worship, sacrifice, and holiness."],
  ["Numbers", "العدد", 36, "History", "Israel's wilderness journey and its tests."],
  ["Deuteronomy", "التثنية", 34, "Law", "Moses' farewell sermons and the renewal of the covenant."],
  ["Joshua", "يشوع", 24, "History", "The entry into the promised land."],
  ["Judges", "القضاة", 21, "History", "Cycles of sin, deliverance, and the judges."],
  ["Ruth", "راعوث", 4, "History", "Loyalty and redemption in the story of Ruth and Boaz."],
  ["1 Samuel", "صموئيل الأول", 31, "History", "Samuel, Saul, and the rise of David."],
  ["2 Samuel", "صموئيل الثاني", 24, "History", "David's reign, sin, and repentance."],
  ["1 Kings", "الملوك الأول", 22, "History", "Solomon, the temple, and the divided kingdom."],
  ["2 Kings", "الملوك الثاني", 25, "History", "The fall of the kingdoms and the prophets' witness."],
  ["1 Chronicles", "أخبار الأيام الأول", 29, "History", "Genealogies and David's reign retold for the temple community."],
  ["2 Chronicles", "أخبار الأيام الثاني", 36, "History", "The temple, the kings, and the call to return."],
  ["Ezra", "عزرا", 10, "History", "The return from exile and the rebuilding of the temple."],
  ["Nehemiah", "نحميا", 13, "History", "Rebuilding Jerusalem's walls and renewing the covenant."],
  ["Esther", "أستير", 10, "History", "God's hidden providence in the Persian court."],
  ["Job", "أيوب", 42, "Wisdom", "Suffering, faith, and the mystery of God's wisdom."],
  ["Psalms", "المزامير", 150, "Wisdom", "The Church's prayer book in song and lament."],
  ["Proverbs", "الأمثال", 31, "Wisdom", "Wisdom for a life ordered toward God."],
  ["Ecclesiastes", "الجامعة", 12, "Wisdom", "The limits of earthly things and the fear of God."],
  ["Song of Songs", "نشيد الأنشاد", 8, "Wisdom", "A poem of love, read in the Church as love between God and His people."],
  ["Isaiah", "إشعياء", 66, "Major Prophets", "Judgment and hope; the Holy One of Israel and the coming Servant."],
  ["Jeremiah", "إرميا", 52, "Major Prophets", "Judgment, lament, and the promise of a new covenant."],
  ["Lamentations", "مراثي إرميا", 5, "Major Prophets", "Laments over Jerusalem's destruction."],
  ["Ezekiel", "حزقيال", 48, "Major Prophets", "Visions of God's glory, exile, and restoration."],
  ["Daniel", "دانيال", 12, "Major Prophets", "Faithfulness in exile and apocalyptic visions."],
  ["Hosea", "هوشع", 14, "Minor Prophets", "God's steadfast love toward an unfaithful people."],
  ["Joel", "يوئيل", 3, "Minor Prophets", "The day of the Lord and the outpouring of the Spirit."],
  ["Amos", "عاموس", 9, "Minor Prophets", "Justice, judgment, and true worship."],
  ["Obadiah", "عوبديا", 1, "Minor Prophets", "Judgment on Edom and the Lord's kingdom."],
  ["Jonah", "يونان", 4, "Minor Prophets", "The reluctant prophet and God's mercy."],
  ["Micah", "ميخا", 7, "Minor Prophets", "Justice, mercy, and walking humbly with God."],
  ["Nahum", "ناحوم", 3, "Minor Prophets", "The fall of Nineveh and God's justice."],
  ["Habakkuk", "حبقوق", 3, "Minor Prophets", "The prophet's question and the answer of faith."],
  ["Zephaniah", "صفنيا", 3, "Minor Prophets", "The day of the Lord and the remnant."],
  ["Haggai", "حجي", 2, "Minor Prophets", "The call to rebuild the temple."],
  ["Zechariah", "زكريا", 14, "Minor Prophets", "Visions of restoration and the coming King."],
  ["Malachi", "ملاخي", 4, "Minor Prophets", "The last prophetic call to faithfulness."],
  ["Matthew", "متى", 28, "Gospels", "Jesus the Messiah: King and Teacher."],
  ["Mark", "مرقس", 16, "Gospels", "Jesus the suffering Servant, proclaimed by St. Mark."],
  ["Luke", "لوقا", 24, "Gospels", "Jesus the Saviour of all, with a heart for the poor."],
  ["John", "يوحنا", 21, "Gospels", "Jesus the eternal Word, Son of God."],
  ["Acts", "أعمال الرسل", 28, "Acts", "The Spirit's work in the early Church."],
  ["Romans", "رومية", 16, "Pauline", "The gospel of justification and life in the Spirit."],
  ["1 Corinthians", "كورنثوس الأولى", 16, "Pauline", "Order, gifts, and love in a divided church."],
  ["2 Corinthians", "كورنثوس الثانية", 13, "Pauline", "Paul's defense of his ministry and the power of grace."],
  ["Galatians", "غلاطية", 6, "Pauline", "Freedom in Christ beyond the law."],
  ["Ephesians", "أفسس", 6, "Pauline", "The Church as the body and mystery of Christ."],
  ["Philippians", "فيلبي", 4, "Pauline", "Joy and humility in the mind of Christ."],
  ["Colossians", "كولوسي", 4, "Pauline", "The supremacy and fullness of Christ."],
  ["1 Thessalonians", "تسالونيكي الأولى", 5, "Pauline", "Hope and holiness awaiting the Lord's return."],
  ["2 Thessalonians", "تسالونيكي الثانية", 3, "Pauline", "Steadfastness in hope and prayer."],
  ["1 Timothy", "تيموثاوس الأولى", 6, "Pauline", "Leadership and sound teaching in the household of God."],
  ["2 Timothy", "تيموثاوس الثانية", 4, "Pauline", "Paul's final encouragement to faithfulness."],
  ["Titus", "تيطس", 3, "Pauline", "Order, good works, and the grace of God."],
  ["Philemon", "فليمون", 1, "Pauline", "Reconciliation in Christ."],
  ["Hebrews", "العبرانيين", 13, "General", "Christ the high priest and the new covenant."],
  ["James", "يعقوب", 5, "General", "Faith that shows itself in action."],
  ["1 Peter", "بطرس الأولى", 5, "General", "Hope under suffering and holy living."],
  ["2 Peter", "بطرس الثانية", 3, "General", "Growth, false teaching, and the day of the Lord."],
  ["1 John", "يوحنا الأولى", 5, "General", "Light, love, and assurance in Christ."],
  ["2 John", "يوحنا الثانية", 1, "General", "Truth and love in the Church."],
  ["3 John", "يوحنا الثالثة", 1, "General", "Hospitality and faithfulness."],
  ["Jude", "يهوذا", 1, "General", "Contend for the faith, kept in God's mercy."],
  ["Revelation", "الرؤيا", 22, "Vision", "The victory of the Lamb and the new creation."],
];

export const bibleBooks = bookRows.map(([name, ar, chapters, group, summary], index) => ({
  name,
  ar,
  chapters,
  group,
  summary,
  testament: index < 39 ? "OT" : "NT",
}));

export const curatedPassages = [
  { ref: "Psalm 23", title: "The Lord is my shepherd", note: "The psalm of trust the Church prays at the bedside and in the Liturgy." },
  { ref: "John 1:1-18", title: "The Word became flesh", note: "The prologue to John's Gospel: the eternal Word enters history." },
  { ref: "Matthew 5:1-12", title: "The Beatitudes", note: "The Lord's blessing on the poor in spirit, the meek, and the merciful." },
  { ref: "Matthew 6:9-13", title: "The Lord's Prayer", note: "The prayer Jesus taught His disciples, prayed daily in the Agpeya." },
  { ref: "John 3:16-21", title: "God so loved the world", note: "The heart of the gospel in a single passage." },
  { ref: "Luke 1:46-55", title: "The Magnificat", note: "St. Mary's song of praise and God's mercy to the humble." },
  { ref: "John 15:1-11", title: "The vine and the branches", note: "Abide in Christ, and bear fruit that remains." },
  { ref: "Romans 8:28-39", title: "Nothing can separate us", note: "The security of God's love in Christ." },
  { ref: "1 Corinthians 13", title: "The hymn of love", note: "St. Paul's portrait of love, read at weddings and in every season." },
  { ref: "Philippians 2:5-11", title: "The mind of Christ", note: "The self-emptying of the Son, exalted as Lord." },
  { ref: "Psalm 51", title: "Have mercy on me, O God", note: "The great penitential psalm of David." },
  { ref: "Ephesians 6:10-18", title: "The armour of God", note: "The spiritual struggle and the whole armour of God." },
];

/* ---------------------------------------------------------
   Saints
   --------------------------------------------------------- */

export const saints = [
  {
    id: "mark",
    name: "St. Mark the Evangelist",
    ar: "مار مرقس الرسول",
    years: "1st century",
    feast: "30 Pashons",
    tag: "Apostolic",
    summary: "Evangelist, martyr, and founder of the Church of Alexandria.",
    life: [
      "According to the witness of the Church, St. Mark came to Alexandria around AD 42, preaching the gospel and establishing the community that would become the Coptic Orthodox Church. He is the author of the second Gospel and is remembered as the first bishop of Alexandria.",
      "He was martyred in Alexandria, dragged through its streets for his faith. The ancient Liturgy of St. Mark belongs to the heritage of the Alexandrian Church, and the Coptic patriarchs trace their succession to him.",
    ],
    legacy: "The gospel reached Egypt in the apostolic age; the Coptic Church calls St. Mark its first patriarch.",
  },
  {
    id: "anthony",
    name: "St. Anthony the Great",
    ar: "الأنبا أنطونيوس",
    years: "c. 251–356",
    feast: "22 Tobi",
    tag: "Monastic",
    summary: "The father of monasticism, who sought God alone in the desert.",
    life: [
      "After hearing the Gospel call to sell what he had and follow Christ, Anthony withdrew from his village into the Egyptian desert. He lived in ascetic struggle and prayer, gathering disciples without founding a formal community, and became the pattern for Christian monasticism.",
      "He supported St. Athanasius in the struggle against Arianism and is remembered for his humility and discernment. St. Athanasius wrote his Life, spreading his example across the Christian world.",
    ],
    quote: "I saw the snares of the enemy spread out over the world, and I sighed and said, ‘Who can escape them?’ And I heard a voice saying to me, ‘Humility.’",
    source: "Sayings of the Desert Fathers",
    legacy: "The monastic movement that shaped Coptic life was born in Egypt around him.",
  },
  {
    id: "athanasius",
    name: "St. Athanasius the Apostolic",
    ar: "البابا أثناسيوس الرسولي",
    years: "c. 296–373",
    feast: "7 Pashons",
    tag: "Fathers",
    summary: "The defender of Nicaea and a father of the Church.",
    life: [
      "A deacon at Nicaea in 325, Athanasius became Pope and Patriarch of Alexandria and spent his life defending the Church's confession that the Son is of one essence with the Father. For this he was exiled five times.",
      "His writings, especially On the Incarnation and the Orations against the Arians, shaped Christian theology. The Church remembers him as 'the Apostolic' and a pillar of Orthodoxy.",
    ],
    quote: "He was made man that we might be made God.",
    source: "On the Incarnation, 54",
    legacy: "The Nicene faith for which he suffered is the faith prayed in every Coptic liturgy.",
  },
  {
    id: "pachomius",
    name: "St. Pachomius the Great",
    ar: "الأنبا باخوميوس",
    years: "c. 292–348",
    feast: "14 Pashons",
    tag: "Monastic",
    summary: "Founder of the first Christian monasteries at Tabennisi.",
    life: [
      "Pachomius was a soldier before his conversion. Moved by the charity of Christians, he sought the monastic life under St. Palaemon, then gathered disciples into a community at Tabennisi with a common life of work, prayer, and mutual care.",
      "His rule became a foundation of cenobitic monasticism, spreading through Egypt and beyond. He insisted that no one should be turned away from the common life.",
    ],
    legacy: "His communal vision gave the Church a lasting model of shared prayer and service.",
  },
  {
    id: "macarius",
    name: "St. Macarius the Great",
    ar: "الأنبا مقار الكبير",
    years: "c. 300–390",
    feast: "27 Paremhat",
    tag: "Monastic",
    summary: "A father of the monks of Scetis and a teacher of the interior life.",
    life: [
      "St. Macarius lived in the desert of Scetis, where he became a spiritual father to many monks and a model of desert discernment. He is remembered as a founder of the monastic settlements of Scetis.",
      "The conferences and homilies associated with him explore prayer, purity of heart, and the struggle against sin with deep insight into the human soul.",
    ],
    quote: "The heart is but a small vessel, yet dragons are there and lions; there are poisonous beasts and all the treasures of evil. But there too is God, the angels, the life and the kingdom, the light and the apostles, the heavenly cities and the treasures of grace.",
    source: "Fifty Spiritual Homilies, 43",
    legacy: "Scetis became one of the great wells of monastic spirituality in the Christian world.",
  },
  {
    id: "cyril",
    name: "St. Cyril of Alexandria",
    ar: "البابا كيرلس عمود الدين",
    years: "c. 376–444",
    feast: "3 Abib",
    tag: "Fathers",
    summary: "Patriarch of Alexandria and champion of the Council of Ephesus.",
    life: [
      "Cyril became Pope of Alexandria in 412. When Nestorius of Constantinople denied that Mary could be called Theotokos, 'God-bearer', Cyril defended the unity of Christ's person and led the Council of Ephesus in 431.",
      "His letters and commentaries insist that the Word of God truly became man and that Mary is rightly honored as the Mother of God. The Church calls him a pillar of the faith.",
    ],
    legacy: "The title Theotokos, upheld at Ephesus, remains central to Coptic devotion to St. Mary.",
  },
  {
    id: "demiana",
    name: "St. Demiana",
    ar: "الشهيدة دميانة",
    years: "3rd–4th century",
    feast: "13 Tobi",
    tag: "Martyrs",
    summary: "Virgin and martyr, a model of courage for Coptic women.",
    life: [
      "St. Demiana, the daughter of a noble Egyptian family, chose to dedicate herself to Christ and led a community of virgins in prayer. During the persecutions of Diocletian she was threatened, tortured, and finally martyred with her companions.",
      "Her monastery in the Nile Delta bears her name and remains a place of pilgrimage. The Coptic Church remembers her as a witness of purity and fearless faith.",
    ],
    legacy: "Her witness shaped generations of devotion in the Delta and beyond.",
  },
  {
    id: "mary-of-egypt",
    name: "St. Mary of Egypt",
    ar: "القديسة مريم المصرية",
    years: "c. 344–421",
    feast: "6 Baramouda",
    tag: "Monastic",
    summary: "The penitent of the desert, whose repentance became a hymn of mercy.",
    life: [
      "Mary went to Jerusalem as a young woman living in sin. At the church of the Holy Sepulchre an unseen force kept her from entering; she looked at an icon of the Theotokos, repented, and was allowed in. Following the Virgin's direction, she crossed the Jordan and lived in the wilderness for decades in prayer and repentance.",
      "She was found by St. Zosimas, who gave her communion, and her story was told for the upbuilding of the Church. She is commemorated each year in Great Lent.",
    ],
    legacy: "Her memory is kept with special solemnity in Great Lent, as proof that no one is beyond mercy.",
  },
  {
    id: "george",
    name: "St. George the Martyr",
    ar: "مار جرجس",
    years: "c. 280–303",
    feast: "23 Baramouda",
    tag: "Martyrs",
    summary: "Soldier of Rome, martyr of Christ, and 'prince of the martyrs'.",
    life: [
      "St. George was a Roman soldier of Cappadocian origin serving in Egypt. During Diocletian's persecution he openly confessed Christ, gave away his possessions, and endured torture before his martyrdom.",
      "His veneration spread through the Christian East, and Coptic churches and monasteries were dedicated to him. Iconography shows him overcoming the dragon — an image of Christ's victory over evil in a faithful martyr.",
    ],
    legacy: "He is among the most beloved martyrs in Egypt, a sign of courage under empire.",
  },
  {
    id: "bishoy",
    name: "St. Bishoy",
    ar: "الأنبا بيشوي",
    years: "c. 320–417",
    feast: "7 Paoni",
    tag: "Monastic",
    summary: "A desert father of Scetis, remembered for humility and love.",
    life: [
      "St. Bishoy lived as an ascetic in Scetis and became a spiritual father to the monks. He is remembered for deep humility, unceasing prayer, and generous service.",
      "His monastery in Wadi al-Natrun bears his name and remains one of the great monastic communities of Egypt.",
    ],
    legacy: "The community bearing his name continues the life of prayer he began.",
  },
  {
    id: "shenouda",
    name: "St. Shenouda the Archimandrite",
    ar: "الأنبا شنودة رئيس المتوحدين",
    years: "c. 348–466",
    feast: "7 Abib",
    tag: "Fathers",
    summary: "Leader of the White Monastery and a father of Coptic literature.",
    life: [
      "St. Shenouda became abbot of the monastery at Atripe, the White Monastery, near Sohag, and led a vast monastic community. He was a tireless defender of the faith and a pastor of the poor.",
      "He wrote in Coptic when many educated Christians wrote in Greek, and his letters and rules shaped the Church. He is called the Archimandrite, the chief of the monks.",
    ],
    legacy: "His Coptic writings are among the treasures of the Church's heritage.",
  },
  {
    id: "nicholas",
    name: "St. Nicholas of Myra",
    ar: "القديس نيقولاوس",
    years: "c. 270–343",
    feast: "6 Kiahk",
    tag: "Fathers",
    summary: "Bishop of Myra, friend of the poor, and defender of the faith.",
    life: [
      "St. Nicholas served as bishop of Myra in Lycia. He is remembered for his charity — the secret gifts that gave rise to the later legends of Father Christmas — and for his defense of the faith.",
      "Tradition remembers him as a defender of the Nicene faith. In the Coptic Church he is commemorated on 6 Kiahk, and his life is held up as an example of generosity and courage.",
    ],
    legacy: "His secret generosity became a pattern for Christian giving.",
  },
  {
    id: "cyril-vi",
    name: "St. Pope Cyril VI",
    ar: "البابا كيرلس السادس",
    years: "1902–1971",
    feast: "30 Meshir",
    tag: "Modern",
    summary: "Pope of Alexandria in a time of renewal, canonized in 2013.",
    life: [
      "Pope Cyril VI, born Azer Youssef Atta, was a monk of the wilderness before being chosen Patriarch of Alexandria in 1959. He founded new monasteries, encouraged Coptic scholarship, and was known for simplicity and humility.",
      "He reposed in 1971 and was canonized by the Holy Synod in 2013. His memory is kept on 30 Meshir.",
    ],
    legacy: "A modern reminder that holiness is not confined to the ancient past.",
  },
];

/* ---------------------------------------------------------
   Feasts and fasting
   --------------------------------------------------------- */

export const feasts = [
  {
    id: "nayrouz",
    name: "Nayrouz — Coptic New Year",
    ar: "عيد النيروز",
    month: 9,
    day: 11,
    coptic: "1 Thout",
    desc: "The beginning of the Coptic year and the feast of the martyrs, whose witness gave the Church its calendar.",
    kind: "fixed",
  },
  {
    id: "cross",
    name: "Feast of the Holy Cross",
    ar: "عيد الصليب",
    month: 9,
    day: 27,
    coptic: "17 Thout",
    desc: "The Church honors the Cross as the sign of Christ's victory and the tree of life.",
    kind: "fixed",
  },
  {
    id: "nativity",
    name: "Nativity of Christ",
    ar: "عيد الميلاد المجيد",
    month: 1,
    day: 7,
    coptic: "29 Kiahk",
    desc: "The birth of Jesus Christ in Bethlehem, celebrated at the end of the 43-day Kiahk fast.",
    kind: "fixed",
  },
  {
    id: "theophany",
    name: "Theophany — Baptism of the Lord",
    ar: "عيد الغطاس",
    month: 1,
    day: 19,
    coptic: "11 Tobi",
    desc: "The revelation of the Holy Trinity at the Jordan, and the blessing of the waters.",
    kind: "fixed",
  },
  {
    id: "presentation",
    name: "Presentation of the Lord",
    ar: "عيد دخول المسيح الهيكل",
    month: 2,
    day: 15,
    coptic: "8 Meshir",
    desc: "The fortieth day after the Nativity, when the Child was presented in the Temple.",
    kind: "fixed",
  },
  {
    id: "annunciation",
    name: "Annunciation to St. Mary",
    ar: "عيد البشارة",
    month: 4,
    day: 7,
    coptic: "29 Paremhat",
    desc: "The angel Gabriel announces to Mary the conception of the Son of God.",
    kind: "fixed",
  },
  {
    id: "mark",
    name: "Feast of St. Mark the Evangelist",
    ar: "عيد مار مرقس",
    month: 5,
    day: 8,
    coptic: "30 Pashons",
    desc: "The Coptic Church remembers her evangelist, martyr, and first patriarch.",
    kind: "fixed",
  },
  {
    id: "holy-family",
    name: "Entry of the Holy Family into Egypt",
    ar: "عيد دخول العائلة المقدسة مصر",
    month: 6,
    day: 1,
    coptic: "24 Pashons",
    desc: "A feast of the Egyptian Church, remembering the flight of the Holy Family through the land.",
    kind: "fixed",
  },
  {
    id: "apostles",
    name: "Sts. Peter and Paul",
    ar: "عيد الرسل",
    month: 7,
    day: 12,
    coptic: "5 Epip",
    desc: "The chief apostles, and the close of the Apostles' Fast.",
    kind: "fixed",
  },
  {
    id: "transfiguration",
    name: "Transfiguration of the Lord",
    ar: "عيد التجلي",
    month: 8,
    day: 19,
    coptic: "13 Mesra",
    desc: "The glory of the Son revealed on Mount Tabor before His passion.",
    kind: "fixed",
  },
  {
    id: "dormition",
    name: "Dormition of the Theotokos",
    ar: "عيد انتقال العذراء",
    month: 8,
    day: 22,
    coptic: "16 Mesra",
    desc: "The Church celebrates the repose and translation of the Virgin Mary.",
    kind: "fixed",
  },
  {
    id: "palm-sunday",
    name: "Palm Sunday",
    ar: "أحد الزيتون",
    coptic: "Movable — one week before Pascha",
    desc: "The Lord's entry into Jerusalem, the beginning of Holy Week.",
    kind: "movable",
    offset: -7,
  },
  {
    id: "resurrection",
    name: "Resurrection of the Lord",
    ar: "عيد القيامة",
    coptic: "Movable — the Feast of feasts",
    desc: "The victory of Christ over death, the center of the Church's year.",
    kind: "movable",
    offset: 0,
  },
  {
    id: "ascension",
    name: "Ascension of the Lord",
    ar: "عيد الصعود",
    coptic: "Movable — 40 days after Pascha",
    desc: "Christ ascends to the Father, forty days after the Resurrection.",
    kind: "movable",
    offset: 39,
  },
  {
    id: "pentecost",
    name: "Pentecost",
    ar: "عيد العنصرة",
    coptic: "Movable — 50 days after Pascha",
    desc: "The descent of the Holy Spirit on the disciples, the birthday of the Church.",
    kind: "movable",
    offset: 49,
  },
];

export const fasts = [
  {
    id: "great-lent",
    name: "Great Lent",
    ar: "الصوم الكبير",
    duration: "55 days · movable",
    desc: "The forty days of Christ's fasting, joined to a preparatory week and the solemn days of Holy Week.",
    practices: [
      "Abstinence from all animal products, with fish permitted on some weekends in many local traditions",
      "More frequent liturgy, psalms, and works of mercy",
      "A season especially suited to confession and reconciliation",
    ],
    note: "The Coptic tradition counts the Great Fast as 55 days including its preparatory week and Holy Week. Local bishops may give particular guidance.",
  },
  {
    id: "holy-week",
    name: "Holy Week",
    ar: "البصخة المقدسة",
    duration: "7 days · movable",
    desc: "The final week of the Great Fast, walking with Christ from Bethany to the Cross and the tomb.",
    practices: [
      "The Church keeps vigil with long services of the Paschal hours",
      "A stricter fast observed by many faithful",
      "Silence, repentance, and expectation of the Resurrection",
    ],
    note: "Holy Week concludes the Great Fast and leads into the joy of Pascha.",
  },
  {
    id: "apostles",
    name: "Apostles' Fast",
    ar: "صوم الرسل",
    duration: "Variable · after Pentecost",
    desc: "From the day after Pentecost to the feast of Sts. Peter and Paul on 5 Epip (12 July).",
    practices: [
      "Abstinence from animal products",
      "A season of prayer for the Church's mission and witness",
      "Ends with the joyful feast of the apostles",
    ],
    note: "Its length changes each year with the date of Pascha.",
  },
  {
    id: "st-mary",
    name: "St. Mary's Fast",
    ar: "صوم العذراء",
    duration: "15 days · 7–21 August",
    desc: "A fast of preparation for the Dormition of the Theotokos on 22 August.",
    practices: [
      "Abstinence from animal products",
      "Special devotion to St. Mary and the Church's hymns in her honor",
      "A time of family prayer and intercession",
    ],
    note: "One of the most beloved fasts in Egypt, often kept with great care.",
  },
  {
    id: "nativity",
    name: "Nativity Fast (Kiahk)",
    ar: "صوم الميلاد",
    duration: "43 days · 25 Nov – 6 Jan",
    desc: "The fast of Advent, preparing for the Nativity of Christ on 29 Kiahk (7 January).",
    practices: [
      "Abstinence from animal products",
      "The Kiahk praises and nightly hymnody in many churches",
      "Works of charity and reconciliation",
    ],
    note: "The fast ends with the Nativity liturgy on the night of 6–7 January.",
  },
  {
    id: "nineveh",
    name: "Nineveh Fast",
    ar: "صوم نينوى",
    duration: "3 days · movable",
    desc: "A fast of repentance recalling Jonah's preaching and the repentance of Nineveh, kept about two weeks before Great Lent.",
    practices: [
      "Three days of fasting and prayer",
      "A call to repentance and mercy before the Great Fast",
      "Often observed by the whole household",
    ],
    note: "The exact dates move with the date of Pascha.",
  },
];

export const fastNote =
  "In the Coptic Church, fasting traditionally means abstaining from all animal products — meat, poultry, dairy, eggs, and usually fish, though fish is allowed on certain days. Fasting is joined to prayer and almsgiving. Illness, pregnancy, travel, and other circumstances call for pastoral guidance: speak with your father of confession, who can grant a dispensation. Fasting is medicine for the soul, never a burden to be forced on the sick.";

export const weeklyFast =
  "Wednesdays recall the Lord's betrayal and Fridays His crucifixion. The Church fasts on both days through most of the year, except in joyful seasons such as the fifty days after Pascha, when fasting is set aside.";

/* ---------------------------------------------------------
   History
   --------------------------------------------------------- */

export const timeline = [
  { year: "c. AD 42", title: "St. Mark comes to Alexandria", tag: "Apostolic", text: "By the Church's tradition, St. Mark the Evangelist preaches the gospel in Alexandria and establishes the community that becomes the Coptic Orthodox Church." },
  { year: "c. AD 68", title: "Martyrdom of St. Mark", tag: "Apostolic", text: "The evangelist is martyred in the streets of Alexandria. His tomb and the succession of bishops from him remain central to Coptic identity." },
  { year: "2nd century", title: "The Catechetical School of Alexandria", tag: "Learning", text: "Alexandria becomes a great center of Christian learning, associated with teachers such as Pantaenus, Clement, and Origen." },
  { year: "AD 284", title: "The Era of the Martyrs", tag: "Persecution", text: "The Coptic calendar begins with the accession of Diocletian. The years of persecution give the Church the name 'Church of the Martyrs.'" },
  { year: "c. 270–356", title: "The desert becomes a city", tag: "Monasticism", text: "St. Anthony withdraws to the desert, while St. Pachomius gathers monks into common life and St. Macarius establishes Scetis. Egyptian monasticism shapes the whole Church." },
  { year: "AD 325", title: "The Council of Nicaea", tag: "Councils", text: "The Church confesses the Son as of one essence with the Father. St. Athanasius, then a deacon, begins a lifetime of defense of the Nicene faith." },
  { year: "AD 381", title: "The Council of Constantinople", tag: "Councils", text: "The creed is completed with the Church's confession of the Holy Spirit. The Coptic Church accepts the first three ecumenical councils." },
  { year: "AD 431", title: "The Council of Ephesus", tag: "Councils", text: "Under St. Cyril of Alexandria, the Church upholds the title Theotokos for St. Mary and the unity of Christ's person." },
  { year: "AD 451", title: "Chalcedon and the Coptic Church", tag: "Councils", text: "The Coptic Church does not accept the christological definition of the Council of Chalcedon. She rejects both Nestorianism and Eutychianism, confessing one incarnate nature of the Word of God, fully divine and fully human." },
  { year: "5th–7th c.", title: "A church of liturgy and monasteries", tag: "Liturgy", text: "The Coptic liturgy, hymnody, and monastic centers flourish. The Patriarchate of Alexandria remains a spiritual heart for Christians far beyond Egypt." },
  { year: "AD 641", title: "The Arab conquest of Egypt", tag: "History", text: "A new political era begins. The Coptic Church lives through centuries of change, preserving her liturgy and faith under caliphates and empires." },
  { year: "11th century", title: "The patriarchate moves to Cairo", tag: "History", text: "The seat of the Coptic patriarchs moves from Alexandria to Cairo, where it remains today." },
  { year: "19th century", title: "Revival and reform", tag: "Modern", text: "Pope Cyril IV and later leaders promote education, printing, and church renewal, helping a new generation engage the modern world." },
  { year: "20th century", title: "A global Church", tag: "Modern", text: "The Sunday school movement, renewed monasticism, and Pope Shenouda III's long patriarchate strengthen the Church in Egypt and across the diaspora." },
  { year: "2012", title: "Pope Tawadros II", tag: "Modern", text: "His Holiness Pope Tawadros II is enthroned as the 118th Pope of Alexandria and Patriarch of the See of St. Mark." },
];

export const councils = [
  { year: "325", name: "Nicaea I", text: "Condemned Arianism and confessed the Son as homoousios, of one essence with the Father. The Creed begins here." },
  { year: "381", name: "Constantinople I", text: "Affirmed the divinity and worship of the Holy Spirit and completed the Nicene-Constantinopolitan Creed." },
  { year: "431", name: "Ephesus", text: "Under St. Cyril, affirmed one Christ and the title Theotokos for St. Mary against Nestorius." },
  { year: "451", name: "Chalcedon", text: "The Coptic Church did not accept its definition of two natures in Christ. The separation that followed endures to this day." },
];

export const fathers = [
  {
    quote: "I saw the snares of the enemy spread out over the world, and I sighed and said, ‘Who can escape them?’ And I heard a voice saying to me, ‘Humility.’",
    cite: "St. Anthony the Great · Sayings of the Desert Fathers",
  },
  {
    quote: "He was made man that we might be made God.",
    cite: "St. Athanasius · On the Incarnation, 54",
  },
  {
    quote: "The heart is but a small vessel, yet dragons are there and lions; there are poisonous beasts and all the treasures of evil. But there too is God, the angels, the life and the kingdom.",
    cite: "St. Macarius the Great · Fifty Spiritual Homilies, 43",
  },
  {
    quote: "What has not been assumed has not been healed; what is united to God is saved.",
    cite: "St. Gregory the Theologian · Letter 101",
  },
];

/* ---------------------------------------------------------
   Learn
   --------------------------------------------------------- */

export const lessons = [
  {
    id: "christ",
    title: "Who is Jesus Christ?",
    level: "Foundations",
    minutes: 9,
    summary: "The heart of the Christian faith: one person, truly God and truly man, confessed by the Church of Alexandria.",
    points: [
      "Christians confess Jesus as truly God and truly man, one person, not two.",
      "The Coptic Church speaks of one incarnate nature of the Word of God, without confusion, mixture, change, or division — rejecting both Nestorianism and Eutychianism.",
      "His death and resurrection heal human nature and open the way to communion with God.",
      "The title Theotokos protects the truth that the child born of Mary is God the Word.",
    ],
    reflection: "Why does it matter that Christ is fully human, and not merely God appearing among us?",
  },
  {
    id: "trinity",
    title: "The Holy Trinity",
    level: "Foundations",
    minutes: 11,
    summary: "One God in three Persons — Father, Son, and Holy Spirit — the mystery at the center of Christian worship.",
    points: [
      "God is one in essence and three in Persons: the Father, the Son, and the Holy Spirit.",
      "The Son is eternally begotten of the Father; the Spirit eternally proceeds from the Father.",
      "The three Persons are not three gods, and the distinctions are not merely roles God plays.",
      "Every analogy from created things is partial; the Church approaches the mystery in worship.",
    ],
    reflection: "How does the Church's worship of the Trinity shape the way we pray and live?",
  },
  {
    id: "scripture",
    title: "Scripture & Tradition",
    level: "Foundations",
    minutes: 10,
    summary: "The Bible is the Church's book, read within the living Tradition and the liturgy of the faithful.",
    points: [
      "The Scriptures are inspired by God and are the foundation of the Church's teaching.",
      "The canon of Scripture was recognized and received by the Church over time.",
      "Tradition is not an addition to Scripture but the life of the same faith handed down in worship, teaching, and the Fathers.",
      "Read in communion with the Church, not as a private starting point for a new religion.",
    ],
    reflection: "What changes when we read the Bible as the Church reads it, rather than alone?",
  },
  {
    id: "sacraments",
    title: "The Sacramental Life",
    level: "Growing",
    minutes: 12,
    summary: "Grace meets matter: the seven mysteries of the Church and the place of baptism and the Eucharist.",
    points: [
      "A sacrament is a visible sign and effective means of grace given by Christ and the Church.",
      "Baptism and chrismation initiate; the Eucharist sustains; confession restores; unction, marriage, and orders sustain particular callings.",
      "Sacraments are not magic: they call for faith, preparation, and a life that seeks to follow Christ.",
      "The Eucharist is the source and summit of the Church's life.",
    ],
    reflection: "Why does the Church insist that grace comes to us through physical signs?",
  },
  {
    id: "prayer",
    title: "Prayer, Fasting & the Desert",
    level: "Growing",
    minutes: 10,
    summary: "The Church's school of prayer: the Agpeya, fasting, stillness, and the wisdom of the desert fathers.",
    points: [
      "The Agpeya orders daily prayer around psalms, Gospel readings, and litanies.",
      "Fasting trains the soul to prefer God over comfort and is always joined to prayer and mercy.",
      "The desert fathers teach discernment, humility, and watchfulness of the heart.",
      "Stillness is not emptiness; it is attention to God.",
    ],
    reflection: "What simple practice could you adopt this week to make a little more room for prayer?",
  },
  {
    id: "saints",
    title: "The Communion of Saints",
    level: "Growing",
    minutes: 8,
    summary: "One Church in heaven and on earth: why Orthodox Christians honor the saints and ask their prayers.",
    points: [
      "The Church is one body in Christ; death does not sever the communion of the faithful.",
      "Veneration of saints is not worship, which belongs to God alone.",
      "The saints are examples, intercessors, and friends who pray for us.",
      "Icons are windows of remembrance and confession, not idols.",
    ],
    reflection: "How would a deeper sense of the Church's heavenly family change the way you face daily life?",
  },
];

export const quizzes = [
  {
    id: "foundations",
    title: "Foundations of the Faith",
    subtitle: "Eight questions on the Church, the sacraments, and the essentials.",
    questions: [
      {
        q: "According to the tradition of the Church, who founded the Church of Alexandria?",
        options: ["St. Peter", "St. Mark the Evangelist", "St. Athanasius", "St. Paul"],
        answer: 1,
        explain: "St. Mark is remembered as the evangelist, martyr, and first patriarch of Alexandria.",
      },
      {
        q: "Which council confessed that the Son is “of one essence with the Father”?",
        options: ["Chalcedon (451)", "Ephesus (431)", "Nicaea (325)", "Constantinople (381)"],
        answer: 2,
        explain: "The Council of Nicaea in 325 condemned Arianism and gave the Church the word homoousios, 'of one essence'.",
      },
      {
        q: "How many holy mysteries (sacraments) does the Coptic Orthodox Church traditionally recognize?",
        options: ["Three", "Five", "Seven", "Twelve"],
        answer: 2,
        explain: "The Church traditionally lists seven: baptism, chrismation, the Eucharist, repentance, unction of the sick, matrimony, and priesthood.",
      },
      {
        q: "In Coptic practice, what immediately follows baptism?",
        options: ["A period of instruction lasting a year", "Chrismation with holy myron", "Ordination to the diaconate", "Confirmation by a bishop at age twelve"],
        answer: 1,
        explain: "The newly baptized are sealed with holy myron and receive first communion, completing their initiation.",
      },
      {
        q: "What does “Theotokos” mean?",
        options: ["The beloved disciple", "God-bearer / Mother of God", "Queen of the desert", "Mother of the prophets"],
        answer: 1,
        explain: "The title was upheld at the Council of Ephesus in 431: the child born of Mary is God the Word incarnate.",
      },
      {
        q: "Which fast is the longest and leads the Church to Pascha (Easter)?",
        options: ["The Nineveh Fast", "The Apostles' Fast", "Great Lent", "The Nativity Fast"],
        answer: 2,
        explain: "Great Lent includes forty days of fasting and Holy Week, and ends in the joy of the Resurrection.",
      },
      {
        q: "Which language is the historic language of the Coptic liturgy?",
        options: ["Latin", "Greek", "Coptic", "Aramaic"],
        answer: 2,
        explain: "The liturgy is prayed in Coptic, with Arabic and other languages used widely today alongside it.",
      },
      {
        q: "Who is called the father of monasticism?",
        options: ["St. Pachomius", "St. Anthony the Great", "St. Basil the Great", "St. Macarius"],
        answer: 1,
        explain: "St. Anthony withdrew to the desert and became the pattern for Christian monasticism; St. Pachomius later organized communal monastic life.",
      },
    ],
  },
  {
    id: "history-scripture",
    title: "History & Scripture",
    subtitle: "Six questions on Alexandria, the councils, and the Bible.",
    questions: [
      {
        q: "In which city was the Coptic Orthodox Church born?",
        options: ["Jerusalem", "Antioch", "Alexandria", "Constantinople"],
        answer: 2,
        explain: "The Church of Alexandria traces her origin to the preaching of St. Mark in the first century.",
      },
      {
        q: "Which patriarch defended the Nicene faith through five exiles?",
        options: ["St. Cyril", "St. Athanasius", "St. Shenouda", "St. Macarius"],
        answer: 1,
        explain: "St. Athanasius of Alexandria was exiled five times for defending the confession of Nicaea.",
      },
      {
        q: "The Council of Ephesus (431) upheld which title for St. Mary?",
        options: ["Theotokos", "Christotokos", "Hagia Sophia", "Mater Ecclesiae"],
        answer: 0,
        explain: "Theotokos, 'God-bearer', safeguards the truth that the one born of Mary is God the Word.",
      },
      {
        q: "What followed the Council of Chalcedon in 451?",
        options: ["A complete union of all churches", "The Coptic Church rejected its christological definition, and a lasting separation followed", "The Coptic Church adopted Nestorianism", "The Church of Alexandria moved to Rome"],
        answer: 1,
        explain: "The Coptic Church did not accept Chalcedon's definition. She rejects both Nestorianism and Eutychianism, confessing one incarnate nature of the Word.",
      },
      {
        q: "Which Gospel opens with “In the beginning was the Word”?",
        options: ["Matthew", "Mark", "Luke", "John"],
        answer: 3,
        explain: "The prologue of John's Gospel confesses the eternal Word who became flesh.",
      },
      {
        q: "Which New Testament book narrates Pentecost and the early Church?",
        options: ["Romans", "Acts", "Hebrews", "Revelation"],
        answer: 1,
        explain: "The Acts of the Apostles tells of the descent of the Holy Spirit and the growth of the first communities.",
      },
    ],
  },
];

/* ---------------------------------------------------------
   About
   --------------------------------------------------------- */

export const principles = [
  {
    title: "Rooted in the Church",
    text: "The faith of the Coptic Orthodox Church is our home and our measure — the Scriptures, the liturgy, the councils, and the Fathers, received as one living Tradition.",
  },
  {
    title: "Clear with charity",
    text: "We explain difficult things plainly and speak of other Christians with fairness and respect, never misrepresenting what others believe in order to win an argument.",
  },
  {
    title: "Honest about sources",
    text: "We try to distinguish what the Church has defined from theological opinion and historical uncertainty, and we point readers to Scripture, the liturgy, and the Fathers rather than asking them to take our word for it.",
  },
  {
    title: "Serving the seeker",
    text: "The platform is offered freely for anyone who wants to learn — in English or Arabic, by reading, at any hour of the night or day.",
  },
];

export const aboutStory = [
  "Orthodox John Nashat began with a simple conviction: the treasures of the Orthodox faith should not feel locked away. The Scriptures, the lives of the saints, the meaning of the liturgy, the wisdom of the desert — these belong to every person who comes seeking.",
  "This platform gathers those treasures in one quiet place. It is built for the curious, the returning, the student, the parent, the seeker at midnight, and the faithful who simply want to understand their own Church more deeply. It does not replace the parish, the priest, or the sacraments. It is a doorway toward them.",
  "At its center are the texts and stories that matter: the Bible, the saints, the Church's year, and two thousand years of history — offered freely for anyone who wants to learn.",
];
