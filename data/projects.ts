import type { DoodleName } from "@/components/sketch/doodles";

export interface Project {
  id: string;
  name: string;
  /** Shelf row: things built on my own vs. built at a hackathon. */
  shelf: "built" | "hackathon";
  /** Short line under the name, e.g. where it was built or what it won. */
  tagline: string;
  /** Two short lines shown in the hover note. */
  teaser: string;
  what: string;
  how: string[];
  result: string;
  stack: string[];
  links: { label: string; href: string }[];
  image: string | null;
  spine: { color: string; icon: DoodleName; width: number; height: number };
}

const GH = "https://github.com/Meanwhile-omkar";

export const projects: Project[] = [
  // ── things I built ──
  {
    id: "lawzyai",
    name: "LawzyAI",
    shelf: "built",
    tagline: "Legal help in plain language, in any Indian language",
    teaser: "Describe your problem in your own words. It finds the IPC and BNS sections that apply and drafts the complaint.",
    what: "A legal help app for people who can't easily get a lawyer. You describe the problem in plain words, in any Indian language, and get the laws that apply, what to do next, and a complaint or legal notice ready to file.",
    how: [
      "An LLM first rewrites your words into formal legal phrasing, then TF-IDF matching finds the closest sections in both the IPC and the new BNS, since both apply during India's switch-over.",
      "The answer must list what information is missing and when a section would not apply, so it doesn't sound more certain than it is.",
      "\"Authority QnA\" asks you the 10 questions a police officer or cross-examiner might, and explains why they ask each one.",
      "Nothing you type is stored.",
    ],
    result: "Live, with free first-step legal guidance. It gives information, not legal advice.",
    stack: ["FastAPI", "React", "scikit-learn", "OpenRouter", "Render", "Vercel"],
    links: [
      { label: "open the app", href: "https://lawzy-legal-assistant.vercel.app/" },
      { label: "code", href: `${GH}/AI-legal-Assistant` },
    ],
    image: null,
    spine: { color: "#6465ed", icon: "scales", width: 92, height: 300 },
  },
  {
    id: "feedback-platform",
    name: "AI Feedback Platform",
    shelf: "built",
    tagline: "Feedback that answers back",
    teaser: "Customers get a personal reply the moment they submit. Admins see what to fix first, city by city.",
    what: "A feedback tool that turns free-text reviews into clear product insight. Each customer gets an instant reply written for their review, and the team gets a dashboard of what to do next.",
    how: [
      "The reply's tone follows the rating: apologetic for 1–2 stars, attentive for 3, thankful for 4–5.",
      "Admins see totals, ratings over time and a map of feedback across Indian cities. Click a star rating to get the top 5 things to act on.",
      "The AI is an extra, never a blocker: every review is saved even if the AI call fails, with retries and a plain fallback reply.",
    ],
    result: "Two live apps, one for customers and one for the admin team.",
    stack: ["FastAPI", "React", "Firestore", "OpenRouter", "Vercel"],
    links: [
      { label: "customer app", href: "https://ai-feedback-user.vercel.app/" },
      { label: "admin dashboard", href: "https://ai-feedback-admin-portal.vercel.app/" },
      { label: "code", href: `${GH}/AI-feedback_fynd_T2` },
    ],
    image: null,
    spine: { color: "#18a0fb", icon: "chat", width: 88, height: 288 },
  },
  {
    id: "cricket-manager",
    name: "Cricket Tournament Manager",
    shelf: "built",
    tagline: "Live scoring for corporate tournaments",
    teaser: "One app to score matches ball by ball, one app to watch them live. Runs many matches at once.",
    what: "A live scoring system built from scratch for corporate cricket tournaments.",
    how: [
      "Scorer app: the match admin enters every ball as it happens.",
      "Viewer app: anyone can follow live scores, player stats and the full bracket, like watching the IPL.",
      "One scorer locks one match, so several admins can run parallel matches without clashing.",
    ],
    result: "Runs several matches at the same time without conflicts.",
    stack: ["React", "Node.js", "WebSockets", "PostgreSQL"],
    links: [],
    image: null,
    spine: { color: "#1bc47d", icon: "cricket", width: 104, height: 322 },
  },
  {
    id: "gambit",
    name: "Gambit",
    shelf: "built",
    tagline: "A notes app for people who think out loud",
    teaser: "Talk and type in the same note. Capture a full idea in under 20 seconds, on phone or laptop.",
    what: "A personal writing space for content creators, made for capturing raw ideas fast.",
    how: [
      "Hybrid input: speak freely, then type in between to fix words, without switching modes.",
      "Mobile and web stay in sync across tabs and devices.",
      "Notes are searchable and filterable by topic or date.",
    ],
    result: "Design goal: a full idea saved in under 20 seconds.",
    stack: ["React Native", "Next.js", "Speech-to-text"],
    links: [],
    image: null,
    spine: { color: "#ef5533", icon: "mic", width: 78, height: 270 },
  },
  {
    id: "astrology",
    name: "Jyotisha Engine",
    shelf: "built",
    tagline: "In progress · with a research paper",
    teaser: "Computes a real birth chart, then explains it by quoting the classical texts. The AI never decides anything.",
    what: "A birth-chart system where every answer traces back to a passage in a classical Sanskrit text. I'm building it and writing a research paper on it.",
    how: [
      "Planet positions come from real ephemeris maths, from date, time and place of birth.",
      "Your question is matched to classical rules, and each rule points to the exact source passage.",
      "The LLM only explains that passage at your reading level. It reports what the texts say, not whether they are true.",
    ],
    result: "In development. The interesting part is the design: maths, then cited sources, then a plain explanation.",
    stack: ["Python", "Swiss Ephemeris", "LLMs"],
    links: [],
    image: null,
    spine: { color: "#ffc700", icon: "planet", width: 82, height: 280 },
  },

  // ── built at hackathons ──
  {
    id: "kop-ai",
    name: "KOP AI",
    shelf: "hackathon",
    tagline: "2nd Runner-up · IIIT Surat Hackathon · also built for KES IndiaNext",
    teaser: "Turns your PDFs and YouTube lectures into a study plan. Teachers can practise on a class of 10 AI students.",
    what: "A study platform with two parts. Students upload their own PDFs, YouTube lectures and slides and get a personal study system in minutes. Teachers get a practice classroom of 10 AI students who react as they teach.",
    how: [
      "Everything is split, embedded and stored in ChromaDB, and every answer cites the PDF page or video timestamp it came from.",
      "Quick Mode for last-minute revision, Comprehensive Mode for long study with chapters and checkpoint quizzes.",
      "The 10 student agents run in parallel, so a class responds in about 8–12 seconds instead of 60–90. Each one remembers its mood: the quiet student stays confused until you actually call on her.",
    ],
    result: "2nd Runner-up at the IIIT Surat Hackathon (GDG on Campus).",
    stack: ["FastAPI", "Next.js", "ChromaDB", "Llama 3.1", "SQLAlchemy"],
    links: [{ label: "watch the demo", href: "https://youtu.be/x7SIlYwrECw" }],
    image: null,
    spine: { color: "#00b5ce", icon: "layers", width: 100, height: 316 },
  },
  {
    id: "gitlane",
    name: "GitLane",
    shelf: "hackathon",
    tagline: "Built at SPIT Hackathon",
    teaser: "Git on your phone with no internet. Sync repositories with a nearby phone over local Wi-Fi.",
    what: "A mobile Git client for developers working where there is no internet. Clone, commit, branch and diff on the phone, then sync with a nearby phone directly.",
    how: [
      "I wrote a small HTTP server on raw TCP sockets so two phones can swap real Git packfiles over local Wi-Fi or a hotspot.",
      "Pushes made offline wait in a saved queue and go out on their own when the internet comes back. The login token is never stored in that queue.",
      "Clones are shallow and single-branch, to save space on the phone.",
    ],
    result: "Version control that works with zero connectivity.",
    stack: ["React Native", "isomorphic-git", "TCP sockets", "Zustand"],
    links: [{ label: "code", href: `${GH}/spit-hack-gitlane` }],
    image: null,
    spine: { color: "#1bc47d", icon: "branch", width: 86, height: 296 },
  },
  {
    id: "learnsphere",
    name: "LearnSphere",
    shelf: "hackathon",
    tagline: "Team project · team CodeBlooded",
    teaser: "Reads exam stress from how much your head moves, not where you look, and adjusts test difficulty live.",
    what: "An adaptive learning platform that watches webcam signals during a test and changes the difficulty in real time.",
    how: [
      "Looking down at the paper means focused, not distracted. So head-movement steadiness counts for 65% of the stress score and facial emotion for 35%.",
      "Each student can calibrate it with about 60 frames of themselves calm and stressed, which corrects the emotion model's bias.",
      "A dropout-risk model shows a heatmap for teachers. It was trained on synthetic data as a proof of concept.",
    ],
    result: "A working prototype of the full pipeline, from webcam to difficulty change.",
    stack: ["Python", "ONNX Runtime", "OpenCV", "scikit-learn", "FastAPI", "Next.js"],
    links: [{ label: "code", href: "https://github.com/rish1710/LearnSphere" }],
    image: null,
    spine: { color: "#ee46d3", icon: "eye", width: 90, height: 284 },
  },
  {
    id: "ml-quest",
    name: "Fake Job Classifier",
    shelf: "hackathon",
    tagline: "Winner · ML Quest, GHRCE Nagpur",
    teaser: "Flags fake job posts from their wording and company signals. Built in 24 hours.",
    what: "An ML model that spots fraudulent job postings.",
    how: [
      "NLP features from the posting text, plus signals about the company and the post's structure.",
      "Ensemble models trained on those features.",
    ],
    result: "94% accuracy. Won the hackathon, and the organising college used it as a screening tool.",
    stack: ["Python", "scikit-learn", "NLP"],
    links: [],
    image: null,
    spine: { color: "#ffc700", icon: "magnifier", width: 96, height: 306 },
  },
  {
    id: "murph",
    name: "Murph",
    shelf: "hackathon",
    tagline: "Built at TSEC Hacks",
    teaser: "Courses for people switching careers. Try a teacher before you pay, then pay only for what you watch.",
    what: "An on-demand course platform for people switching careers.",
    how: [
      "A chat assistant suggests courses based on the role you want.",
      "Pay per use, with free first modules, so you find the right teacher before paying.",
      "Teachers get fair pay per content watched, and see where learners drop off.",
    ],
    result: "Solves the \"wrong teacher\" problem: you try before you pay.",
    stack: ["React", "Node.js", "LLMs", "Stripe"],
    links: [],
    image: null,
    spine: { color: "#ef5533", icon: "cap", width: 80, height: 274 },
  },
  {
    id: "enterprise-ai",
    name: "Enterprise AI Layer",
    shelf: "hackathon",
    tagline: "Built at Datathon · KJ Somaiya",
    teaser: "Reads Slack, Jira and GitHub, then tells each person only what their role needs to know.",
    what: "An AI layer that turns the same project updates into different summaries for each role.",
    how: [
      "Connects to Slack, Jira and GitHub.",
      "Engineers get code-level context, PMs get timelines and blockers, the CEO gets product and money status, HR gets team health.",
    ],
    result: "Less noise and fewer cross-team mix-ups.",
    stack: ["Python", "LLMs", "Slack API", "GitHub API", "Jira API"],
    links: [],
    image: null,
    spine: { color: "#6465ed", icon: "org", width: 84, height: 290 },
  },
];
