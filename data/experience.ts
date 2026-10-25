import type { DoodleName } from "@/components/sketch/doodles";

export interface Experience {
  id: string;
  company: string;
  website: string | null;
  role: string;
  /** Empty string = not confirmed yet; the tag then shows only role and mode. */
  dates: string;
  location: string;
  /** e.g. "remote", "on-site", "on and off". */
  mode: string;
  /** One or two plain lines: what the company does. */
  aboutCompany: string;
  whatIDid: string[];
  /** What Omkar liked most. null = not written yet, the speech bubble stays hidden. */
  likedMost: string | null;
  skills: string[];
  accent: string;
  /** Drop files at these paths and they replace the placeholders automatically (see ASSET_PROMPTS.md). */
  logo: string | null;
  /** Background behind the logo, for logos drawn in white. */
  logoBg?: string;
  /** Certificates, letters of recommendation: shown as small buttons under the website link. */
  docs?: { label: string; href: string }[];
  /** Square logos get a square card instead of the wide wordmark card. */
  logoSquare?: boolean;
  background: string | null;
  character: string | null;
  /** Doodles used for the placeholder background when there are no stickers. */
  doodles: DoodleName[];
  /** Sticker cut-outs placed around the slide, in slot order (see STICKER_SLOTS in Scene.tsx). */
  stickers?: string[];
}

// Order is Omkar's: most recent first.
export const experience: Experience[] = [
  {
    id: "infiheal",
    company: "Infiheal",
    website: "https://infiheal.com/",
    docs: [{ label: "completion certificate", href: "https://drive.google.com/file/d/1dIBo83a7E2o7-or9tKPwC7QCuHzjH-gV/view?usp=sharing" }],
    role: "Founder's Office Intern",
    dates: "Mar – Jul 2026",
    location: "Mumbai",
    mode: "remote",
    aboutCompany: "Infiheal makes Healo, an AI companion for mental health and emotional wellbeing.",
    whatIDid: [
      "Built and presented the Series A pitch deck, and helped close three co-investors: Colossa Ventures, Aeroflex VC and Nepean Capital.",
      "Wrote market-entry proposals for Europe, Saudi Arabia, Brazil, South Korea and North America. We got into the Korea Market Access Program and the HEC Paris / Station F accelerator.",
      "Pitched Healo to IndiGo, Zepto, HDFC Bank, Lupin, L'Oréal, Glenmark, Mr. Med, KPMG and Deloitte, and worked on state health projects in five Indian states.",
    ],
    likedMost:
      "I worked directly with the founder. In pitches and big decisions I was the youngest in the room, and my ideas were still heard, and some were used. I also met international delegates and represented Infiheal at tech fests and conferences.",
    skills: ["Fundraising", "Pitch decks", "Market entry", "B2B sales"],
    accent: "#1bc47d",
    logo: "/experience/infiheal/logo.webp",
    background: null,
    character: "/character/infiheal.webp",
    stickers: ["pitch-deck", "globe", "ai-head", "ai-companion", "heart-chat", "handshake", "rocket"].map((n) => `/experience/infiheal/stickers/${n}.webp`),
    doodles: ["rocket", "plane", "chat", "people", "pie", "star"],
  },
  {
    id: "cyphersol",
    company: "CypherSOL",
    website: "https://cyphersol.co.in/",
    role: "Data Science Intern",
    dates: "Dec 2025 – Feb 2026",
    location: "Mumbai",
    mode: "on-site",
    aboutCompany: "A fintech company. Its software reads bank statements for CAs, tax professionals and government agencies who need to trace money.",
    whatIDid: [
      "Built a pattern engine that learns a bank statement layout from one example, then reads every statement in that format.",
      "Unrecognised rows went from about 40–50% to under 0.5%. Manual checks dropped from ~450 rows per 1,000 to under 5.",
      "Used fixed rules instead of an ML model on purpose: CAs and investigators need to see exactly why each row was read the way it was.",
    ],
    likedMost:
      "My first in-office startup job. I could see every team at work and talk to anyone. The product runs fully offline on low-resource machines, with no cloud, so every model was a puzzle. My manager was relaxed and I learned a lot from him.",
    skills: ["Python", "Pandas", "Rule engines", "Document parsing"],
    accent: "#18a0fb",
    logo: "/experience/cyphersol/logo.png",
    background: null,
    character: "/character/cyphersol.webp",
    stickers: ["bank-statements", "rule-flow", "bank", "statement-magnifier", "category-tags", "pie-chart", "padlock"].map((n) => `/experience/cyphersol/stickers/${n}.webp`),
    doodles: ["doc", "bank", "magnifier", "pie", "shield", "tag"],
  },
  {
    id: "bigul",
    company: "Bigul",
    website: "https://bigul.co/",
    docs: [
      { label: "completion certificate", href: "https://drive.google.com/file/d/1Qlx7iBgHN89CisfURMxbbgdhO7rHb39q/view?usp=sharing" },
      { label: "recommendation letter", href: "https://drive.google.com/file/d/13Nz224Ec9YNAnYNATJrVHnT0HjTQQQp7/view?usp=sharing" },
    ],
    role: "Product Manager Intern",
    dates: "Nov – Dec 2025",
    location: "Mumbai",
    mode: "remote",
    aboutCompany: "A stock trading app for retail investors, with algo trading built in.",
    whatIDid: [
      "Reviewed Bigul's domestic, international and commodity apps, then went deep on the domestic equity app, where demand and competition are highest.",
      "Compared features, algo trading and trade calls with Zerodha, Groww and other brokers, and sent a weekly report on the gaps.",
      "Used the app every day and logged where it got in the way. Prototyped a chatbot that answers questions about your own portfolio, and a market news feature.",
    ],
    likedMost:
      "Our weekly check-in was booked for 15–30 minutes and sometimes ran for 2 hours, because the analysis went that deep. My manager said he trusted me more than his IT team, and wrote my recommendation letter himself.",
    skills: ["Product management", "Competitor analysis", "UX research", "Prototyping"],
    accent: "#ffc700",
    logo: "/experience/bigul/logo.svg",
    background: null,
    character: "/character/bigul.webp",
    stickers: ["trading-phone", "candle-magnifier", "bull", "bear", "algo-flow", "trader-screen", "trend-arrows"].map((n) => `/experience/bigul/stickers/${n}.webp`),
    doodles: ["candles", "rise", "phone", "coin", "flow", "magnifier"],
  },
  {
    id: "sereno-volante",
    company: "Sereno Volante",
    website: "https://www.serenovolante.com/",
    role: "Machine Learning Engineer Intern",
    dates: "Jun – Aug 2025",
    location: "Mumbai",
    mode: "remote",
    aboutCompany: "Builds custom AI, from LLMs to computer vision, for large Indian companies in manufacturing, finance and retail.",
    whatIDid: [
      "Built a vision pipeline for JSW Steel that reads vendor CAD drawings and saves 23 engineering values to their database. Unsure readings go to a person to check.",
      "Built a sales analytics chatbot for JSW's management, where each person only sees the data their role allows.",
      "Researched how to automate feasibility checks for car parts from CATIA files.",
    ],
    likedMost:
      "My first technical internship, and I owned the product end to end. I ran the meetings with JSW, took their feedback and rebuilt it. It showed me where AI adds real value in steel, automobiles and sales.",
    skills: ["Computer vision", "LLMs", "Python", "Access control"],
    accent: "#6465ed",
    logo: "/experience/sereno-volante/logo.png",
    background: null,
    character: "/character/sereno.webp",
    stickers: ["control-panel", "gears", "vision-camera", "robot-arm", "sales-chatbot", "steel-coil", "cad-ruler"].map((n) => `/experience/sereno-volante/stickers/${n}.webp`),
    doodles: ["factory", "gear", "chat", "blueprint", "flow", "stack"],
  },
  {
    id: "iitb-kcdh",
    company: "IIT Bombay · KCDH",
    website: "https://www.kcdh.iitb.ac.in/",
    role: "ML Research Intern",
    dates: "Apr – May 2025",
    location: "Mumbai",
    mode: "on-site",
    aboutCompany: "The Koita Centre for Digital Health at IIT Bombay. It researches cheaper, non-invasive ways to diagnose patients.",
    whatIDid: [
      "Studied whether hemoglobin can be estimated from photos of the blood vessels in the white of the eye.",
      "Used image processing and ML to compare vessel features with blood test data.",
      "Checked whether this could work as a low-cost screening test for anaemia.",
    ],
    likedMost:
      "My first internship in data science, and hard to get: a lot of cold emails to professors before one said yes. I learned how research really works: framing the problem, reading the literature, finding what's new, testing hypotheses, and writing it all down.",
    skills: ["Python", "Image processing", "Machine learning", "Research"],
    accent: "#ef5533",
    logo: "/experience/iitb-kcdh/logo.png",
    background: null,
    character: "/character/iitb.webp",
    stickers: ["eye-study", "eye", "retina-scan", "microscope", "test-tubes", "ml-network", "data-chart"].map((n) => `/experience/iitb-kcdh/stickers/${n}.webp`),
    doodles: ["eye", "microscope", "drop", "pulse", "magnifier", "doc"],
  },
  {
    id: "outcry",
    company: "Outcry Entertainment",
    website: "https://outcryentertainment.in/",
    role: "Event management volunteer",
    dates: "",
    location: "Mumbai",
    mode: "on and off",
    aboutCompany: "An experiential and marketing agency. It runs events, brand activations, award shows and luxury weddings.",
    whatIDid: [
      "I volunteer at their events whenever I can. I started about two years ago and still go.",
      "Work with clients, stakeholders and vendors to put large-scale events together.",
      "Hands-on with show flow, production, music, DJ setups and lights on event days.",
    ],
    likedMost: "It made me more outgoing. Talking to clients, vendors and crew every day built my people skills.",
    skills: ["Event management", "Vendor coordination", "Show production"],
    accent: "#ee46d3",
    logo: "/experience/outcry/logo.svg",
    logoBg: "#1d1d1f",
    background: null,
    character: "/character/outcry.webp",
    stickers: ["spotlight", "run-of-show", "award-trophy", "dj-deck", "speakers", "crew-headset", "string-lights"].map((n) => `/experience/outcry/stickers/${n}.webp`),
    doodles: ["spotlight", "speaker", "music", "ticket", "mic", "star"],
  },
  {
    id: "buzz",
    company: "Buzz Entertainment",
    website: null,
    role: "Marketing Intern",
    dates: "Jun – Aug 2024",
    location: "Mumbai",
    mode: "on-site",
    aboutCompany: "An events company. They run stand-up comedy tours, concerts and summits.",
    whatIDid: [
      "Pitched sponsorships for a rap battle concert to brands and media partners.",
      "Helped manage stand-up comedy shows with Zakir Khan.",
      "Handled logistics and marketing material for live events.",
    ],
    likedMost: null,
    skills: ["Sponsorship pitching", "Event marketing", "Brand partnerships"],
    accent: "#00b5ce",
    logo: "/experience/buzz/logo.jpg",
    logoBg: "#000000",
    logoSquare: true,
    background: null,
    character: "/character/buzz.webp",
    stickers: ["standup-mic", "comedy-masks", "laughing", "crowd", "spotlight", "music-note", "speaker"].map((n) => `/experience/buzz/stickers/${n}.webp`),
    doodles: ["mic", "spotlight", "ticket", "music", "mask", "speaker"],
  },
];
