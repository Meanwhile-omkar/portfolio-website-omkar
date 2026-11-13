// All words on the SSC papers page, in English and Marathi.
export type Lang = "en" | "mr";

export const SUBJECTS = [
  { key: "algebra", color: "#18a0fb", en: "Maths 1 · Algebra", mr: "गणित भाग १ · बीजगणित" },
  { key: "geometry", color: "#6465ed", en: "Maths 2 · Geometry", mr: "गणित भाग २ · भूमिती" },
  { key: "science1", color: "#1bc47d", en: "Science 1", mr: "विज्ञान भाग १" },
  { key: "science2", color: "#00b5ce", en: "Science 2", mr: "विज्ञान भाग २" },
  { key: "history", color: "#ef5533", en: "History & Pol. Science", mr: "इतिहास व राज्यशास्त्र" },
  { key: "geography", color: "#c48a00", en: "Geography", mr: "भूगोल" },
  { key: "marathi", color: "#ee46d3", en: "Marathi", mr: "मराठी" },
  { key: "hindi", color: "#ff8a3d", en: "Hindi", mr: "हिंदी" },
  { key: "english", color: "#0859d4", en: "English", mr: "इंग्रजी" },
  { key: "sanskrit", color: "#b2560d", en: "Sanskrit", mr: "संस्कृत" },
  { key: "urdu", color: "#2e8b57", en: "Urdu", mr: "उर्दू" },
  { key: "arabic", color: "#7a5c2e", en: "Arabic", mr: "अरबी" },
  { key: "german", color: "#444", en: "German", mr: "जर्मन" },
  { key: "maths", color: "#18a0fb", en: "Maths 1 & 2", mr: "गणित भाग १ व २" },
  { key: "science", color: "#1bc47d", en: "Science 1 & 2", mr: "विज्ञान भाग १ व २" },
] as const;
export type SubjectKey = (typeof SUBJECTS)[number]["key"];

export const MEDIUMS = [
  { key: "English", en: "English medium", mr: "इंग्रजी माध्यम" },
  { key: "Marathi", en: "Marathi medium", mr: "मराठी माध्यम" },
  { key: "Hindi", en: "Hindi medium", mr: "हिंदी माध्यम" },
  { key: "Urdu", en: "Urdu medium", mr: "उर्दू माध्यम" },
  { key: "Kannada", en: "Kannada medium", mr: "कन्नड माध्यम" },
] as const;

const VARIANTS: Record<string, string> = {
  "First Language": "प्रथम भाषा",
  "Second or Third Language": "द्वितीय / तृतीय भाषा",
  "Third Language": "तृतीय भाषा",
  Composite: "संयुक्त",
  "Composite (English version)": "संयुक्त (इंग्रजी आवृत्ती)",
  "Composite (Urdu version)": "संयुक्त (उर्दू आवृत्ती)",
};

const MONTHS: Record<string, string> = {
  February: "फेब्रुवारी",
  March: "मार्च",
  June: "जून",
  "June-July": "जून-जुलै",
  July: "जुलै",
  August: "ऑगस्ट",
};

export function variantLabel(v: string, lang: Lang) {
  return lang === "mr" ? VARIANTS[v] ?? v : v;
}

// "March 2026" -> "मार्च 2026"
export function examLabel(exam: string, lang: Lang) {
  if (lang === "en") return exam;
  const m = exam.match(/^(.*) (\d{4})$/);
  return m && MONTHS[m[1]] ? `${MONTHS[m[1]]} ${m[2]}` : exam;
}

export const T = {
  en: {
    back: "← omkar.",
    kicker: "Maharashtra State Board · Class 10",
    title: "SSC board papers,",
    titleHl: "all in one place.",
    intro:
      "Real board exam papers from 2019 to 2026, school prelims, and the official SCERT question banks. Free to open and download. I checked every paper's code and date by hand.",
    stats: (b: number, y: number, p: number) => [`${b} board papers`, `${y} years`, `${p} practice papers`],
    tabs: { pyq: "Board papers", prelim: "Prelims & practice", qbank: "Question banks", model: "Model papers" },
    tabHints: {
      pyq: "The actual papers from the board exam, March and supplementary.",
      prelim: "Full prelim and practice exams set by schools. Same pattern as the board paper.",
      qbank: "Chapter-wise practice questions from SCERT Maharashtra.",
      model: "Practice papers written in the board pattern by AglaSem. These open on AglaSem's site.",
    },
    medium: "Your medium",
    all: "All",
    subject: "Subject",
    allSubjects: "All subjects",
    year: "Year",
    allYears: "All years",
    supplementary: "Supplementary exam",
    showSupp: "Show supplementary exams",
    search: "Search a subject, year or code…",
    open: "Open paper",
    pages: "pages",
    count: (n: number) => (n === 1 ? "1 paper" : `${n} papers`),
    empty: "Nothing here. Try another medium, subject or year.",
    reset: "Clear filters",
    languageNote: "Language papers (Marathi, Hindi, English…) are the same for every medium.",
    tipTitle: "How to use these",
    tips: [
      "Solve on paper with a timer. Languages: 3 hours. Maths, Science, Social Science: 2 hours.",
      "Start with the latest year, then go back. Recent papers show the current pattern best.",
      "Check your answers with your textbook, then redo the questions you got wrong a week later.",
    ],
    zip: "Download everything (ZIP)",
    repo: "Browse all folders on GitHub",
    credits:
      "Papers are published by MSBSHSE (Maharashtra State Board). Scans collected from maharashtrastudy.com, AglaSem, CareerIndia and Careers360; question banks by SCERT Maharashtra. Shared free for students.",
    wrong: "Found a wrong or missing paper? Tell me",
    session: "Session",
    langToggle: "मराठी",
    everything: "Everything",
    contents: "Contents",
    contentsHint: "Newest board papers first, then prelims, question banks and model papers. Tap to jump.",
    yearTitle: (y: number) => `SSC Board Papers ${y}`,
    yearSub: (exam: string) => `${exam} board exam`,
    languageH: "Language papers",
    suppH: (exam: string) => `Supplementary exam · ${exam}`,
    prelimTitle: "Prelim & practice papers",
    qbTitle: "Question banks (SCERT Maharashtra)",
    modelTitle: "Model papers",
    sessionH: (s: string) => `Session ${s}`,
    qbYear: (y: number) => `Question bank ${y}`,
    type: "Type",
    toTop: "↑ Contents",
    faqTitle: "Questions students ask",
  },
  mr: {
    back: "← omkar.",
    kicker: "महाराष्ट्र राज्य मंडळ · इयत्ता १०वी",
    title: "दहावी बोर्ड प्रश्नपत्रिका,",
    titleHl: "एकाच ठिकाणी.",
    intro:
      "२०१९ ते २०२६ मधील बोर्ड परीक्षेच्या खऱ्या प्रश्नपत्रिका, शाळांच्या सराव परीक्षा आणि SCERT ची अधिकृत प्रश्नपेढी. उघडणे व डाउनलोड करणे मोफत. प्रत्येक प्रश्नपत्रिकेचा कोड व तारीख मी स्वतः तपासली आहे.",
    stats: (b: number, y: number, p: number) => [`${b} बोर्ड प्रश्नपत्रिका`, `${y} वर्षे`, `${p} सराव प्रश्नपत्रिका`],
    tabs: { pyq: "बोर्ड प्रश्नपत्रिका", prelim: "सराव / पूर्व परीक्षा", qbank: "प्रश्नपेढी", model: "नमुना प्रश्नपत्रिका" },
    tabHints: {
      pyq: "बोर्ड परीक्षेतील खऱ्या प्रश्नपत्रिका, मार्च आणि पुरवणी परीक्षा.",
      prelim: "शाळांनी घेतलेल्या पूर्ण पूर्व / सराव परीक्षा. बोर्डाच्याच पद्धतीने.",
      qbank: "SCERT महाराष्ट्रची धडानिहाय सराव प्रश्नपेढी.",
      model: "AglaSem ने बोर्डाच्या पद्धतीने तयार केलेल्या सराव प्रश्नपत्रिका. या AglaSem च्या साइटवर उघडतात.",
    },
    medium: "तुमचे माध्यम",
    all: "सर्व",
    subject: "विषय",
    allSubjects: "सर्व विषय",
    year: "वर्ष",
    allYears: "सर्व वर्षे",
    supplementary: "पुरवणी परीक्षा",
    showSupp: "पुरवणी परीक्षा दाखवा",
    search: "विषय, वर्ष किंवा कोड शोधा…",
    open: "प्रश्नपत्रिका उघडा",
    pages: "पाने",
    count: (n: number) => `${n} प्रश्नपत्रिका`,
    empty: "इथे काहीही नाही. दुसरे माध्यम, विषय किंवा वर्ष निवडून पहा.",
    reset: "फिल्टर काढा",
    languageNote: "भाषा विषयांच्या (मराठी, हिंदी, इंग्रजी…) प्रश्नपत्रिका सर्व माध्यमांसाठी सारख्याच असतात.",
    tipTitle: "यांचा वापर कसा करावा",
    tips: [
      "घड्याळ लावून कागदावर सोडवा. भाषा: ३ तास. गणित, विज्ञान, सामाजिकशास्त्र: २ तास.",
      "आधी सर्वात नवीन वर्ष सोडवा, मग मागे जा. नवीन प्रश्नपत्रिकांमध्ये सध्याचा पॅटर्न दिसतो.",
      "उत्तरे पाठ्यपुस्तकातून तपासा, आणि चुकलेले प्रश्न एका आठवड्याने पुन्हा सोडवा.",
    ],
    zip: "सर्व एकत्र डाउनलोड करा (ZIP)",
    repo: "GitHub वर सर्व फोल्डर पहा",
    credits:
      "प्रश्नपत्रिका MSBSHSE (महाराष्ट्र राज्य मंडळ) यांनी प्रकाशित केल्या आहेत. स्कॅन maharashtrastudy.com, AglaSem, CareerIndia व Careers360 वरून गोळा केले; प्रश्नपेढी SCERT महाराष्ट्र यांची. विद्यार्थ्यांसाठी मोफत.",
    wrong: "चुकीची किंवा नसलेली प्रश्नपत्रिका दिसली? मला सांगा",
    session: "सत्र",
    langToggle: "English",
    everything: "सर्व",
    contents: "अनुक्रमणिका",
    contentsHint: "आधी नवीन बोर्ड प्रश्नपत्रिका, मग सराव परीक्षा, प्रश्नपेढी आणि नमुना प्रश्नपत्रिका. थेट जाण्यासाठी टॅप करा.",
    yearTitle: (y: number) => `बोर्ड प्रश्नपत्रिका ${y}`,
    yearSub: (exam: string) => `${exam} बोर्ड परीक्षा`,
    languageH: "भाषा विषय",
    suppH: (exam: string) => `पुरवणी परीक्षा · ${exam}`,
    prelimTitle: "सराव व पूर्व परीक्षा प्रश्नपत्रिका",
    qbTitle: "प्रश्नपेढी (SCERT महाराष्ट्र)",
    modelTitle: "नमुना प्रश्नपत्रिका",
    sessionH: (s: string) => `सत्र ${s}`,
    qbYear: (y: number) => `प्रश्नपेढी ${y}`,
    type: "प्रकार",
    toTop: "↑ अनुक्रमणिका",
    faqTitle: "विद्यार्थ्यांचे नेहमीचे प्रश्न",
  },
} as const;
