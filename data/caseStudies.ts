import type { DoodleName } from "@/components/sketch/doodles";

export type Badge = "Winner" | "Runner-up" | "Top 5" | "Top 10" | "Finalist" | "Recognised";

export interface CaseStudy {
  id: string;
  title: string;
  event: string;
  host: string;
  date: string;
  badge: Badge;
  /** Extra detail next to the badge, e.g. "of 600+". */
  field?: string;
  teaser: string;
  problem: string;
  approach: string;
  result: string;
  images: string[];
  /** Slide decks and other public material. */
  links?: { label: string; href: string }[];
  sleeve: { color: string; icon: DoodleName };
}

export const caseStudies: CaseStudy[] = [
  {
    id: "spotify",
    title: "Spotify India",
    event: "Datazen",
    host: "KJ Somaiya College",
    date: "Jan 2026",
    badge: "Winner",
    teaser: "Spotify India had growth but weak revenue. We moved the plan from growth to making money.",
    problem: "User growth in India was slowing even though people listened a lot. Big cities were saturated and few users paid.",
    approach: "Ran large-scale analysis and listener segmentation on consumption data, then moved the strategy from user growth to monetisation, efficiency and margins: premium tiers, regional content partnerships, and tier-2 city segments.",
    result: "Won. We sized a ₹500 Cr+ revenue opportunity from upselling and regional content.",
    images: ["/photos/spotify-case/screen.png", "/photos/spotify-case/team-1.jpeg", "/photos/spotify-case/team-2.jpeg"],
    links: [{ label: "see the deck", href: "https://drive.google.com/file/d/1WqcadloC1vJ9RofudcAUL1zV75_hYoGp/view?usp=sharing" }],
    sleeve: { color: "#1bc47d", icon: "music" },
  },
  {
    id: "analytrix",
    title: "Segmenting students for an AI study app",
    event: "Analytrix Datathon",
    host: "Thakur College of Engineering",
    date: "2026",
    badge: "Winner",
    teaser: "Grouped the users of an AI study companion and found what keeps each group studying.",
    problem: "An AI study companion wanted to understand its Indian student users across very different backgrounds.",
    approach: "Customer segmentation and behaviour analysis on their data: study patterns, what keeps students engaged, and early churn signals per group.",
    result: "Won the datathon, with recommendations for product positioning.",
    images: [],
    sleeve: { color: "#18a0fb", icon: "people" },
  },
  {
    id: "unhinged",
    title: "Axiom Circular",
    event: "Unhinged",
    host: "E-Cell, DJ Sanghvi College of Engineering",
    date: "Feb 2026",
    badge: "Winner",
    teaser: "Topic given on the spot: a best-out-of-waste startup. We pitched a 15-minute health check that keeps old EV batteries from being scrapped.",
    problem: "Topic on the spot: a \"best out of waste\" startup, built in a few hours. We picked old EV batteries. They still hold value, but testing one takes 6 to 24 hours, so most get scrapped.",
    approach: "A handheld scanner that reads battery health in under 15 minutes, plus a tamper-proof digital passport buyers can trust. It earns from scanner leasing, a platform subscription and a small marketplace fee.",
    result: "Won first place.",
    images: [],
    links: [{ label: "see the deck", href: "https://drive.google.com/file/d/1hz_N14fMHoIWQPjyczCiuhPUugxNBvG-/view?usp=sharing" }],
    sleeve: { color: "#ee46d3", icon: "battery" },
  },
  {
    id: "ies-retail",
    title: "Retail margins",
    event: "Consulting Case Competition",
    host: "IES Business School",
    date: "Oct 2025",
    badge: "Runner-up",
    teaser: "A retailer losing margin across regions. We cut the weak products and moved stock to where it sells.",
    problem: "A multi-region retailer with falling margins and uneven sales across regions and categories.",
    approach: "Cut weak SKUs using the data, ran campaigns per sales channel, and moved inventory toward high-margin categories.",
    result: "Runner-up. Projected: 18% better margins and 25% less dead stock.",
    images: ["/photos/cases/ies-case-win.jpg"],
    links: [{ label: "see the deck", href: "https://drive.google.com/file/d/1J_sdxmgLxNNlMn6-Q2RsxqcEUtGUiXsR/view?usp=sharing" }],
    sleeve: { color: "#ffc700", icon: "cart" },
  },
  {
    id: "iit-bhu",
    title: "Ride-hailing driver allocation",
    event: "Technalytics",
    host: "IIT BHU",
    date: "2025",
    badge: "Top 10",
    field: "of 340+",
    teaser: "Too many missed rides. We matched driver shifts to when people actually book.",
    problem: "A ride-hailing platform was missing many ride requests because drivers and shifts didn't match demand.",
    approach: "Place drivers using demand heatmaps, redesign shifts around peak hours, and add incentives to fill the gaps.",
    result: "Top 10 out of 340+ participants.",
    images: [],
    links: [{ label: "see the deck", href: "https://drive.google.com/file/d/19V3r3Fv1Uq4AwOe6QrE5zpRE7wHh5tET/view?usp=sharing" }, { label: "final round deck", href: "https://drive.google.com/file/d/1OP2NtsRWJtTaycvhz3Y3p4pWS2aa-hpr/view?usp=sharing" }],
    sleeve: { color: "#ef5533", icon: "pin" },
  },
  {
    id: "iim-sambalpur",
    title: "Uber's annual revenue, live",
    event: "Guesstimate",
    host: "IIM Sambalpur",
    date: "2025",
    badge: "Top 10",
    field: "of 600+",
    teaser: "Final round: estimate Uber's yearly revenue in 5 minutes, on stage.",
    problem: "Final round, live: \"Estimate the annual revenue of Uber.\" Five minutes to answer.",
    approach: "Bottom-up: rides per day per city × average fare × Uber's cut × number of cities, adjusted for regional prices, plus Uber Eats and Freight.",
    result: "Top 10 out of 600+. It was my first guesstimate.",
    images: [],
    links: [{ label: "see the deck", href: "https://drive.google.com/file/d/1rPx2cBVmNCvhuJ7GqwSVl-VaqUSG3aL-/view?usp=sharing" }],
    sleeve: { color: "#00b5ce", icon: "calculator" },
  },
  {
    id: "virgin-galactic",
    title: "Virgin Galactic",
    event: "Finance Case Competition",
    host: "SPIT",
    date: "2025",
    badge: "Finalist",
    teaser: "Burning cash with no profit in sight. We pointed it at defence payloads, where the money is going.",
    problem: "Virgin Galactic was burning cash, spending more than it earned, and its cost of capital was rising. It needed new funding and new revenue.",
    approach: "Studied competitors and where VC money was going. Space defence payloads were attracting big funding, so we proposed using the passenger spaceships for defence payloads in the near term, while passenger flights continue in parallel.",
    result: "Finalist. Two tracks: stable cash flow now, the passenger brand kept for later.",
    images: [],
    links: [{ label: "see the deck", href: "https://drive.google.com/file/d/14HMS4R01XMeMiJO99qn9GbCOdsaP3vDL/view?usp=sharing" }, { label: "financial analysis", href: "https://drive.google.com/file/d/1j5QJCkrrbeJQZI4d64Kh8YXWNy7L4kqX/view?usp=sharing" }],
    sleeve: { color: "#6465ed", icon: "rocket" },
  },
  {
    id: "iim-raichur",
    title: "AgeTech: first 1,000 customers",
    event: "Product Management Case",
    host: "IIM Raichur",
    date: "2025",
    badge: "Finalist",
    teaser: "A product connecting elderly parents with their NRI children. We planned how to get the first 1,000 users.",
    problem: "A new product to connect elderly parents in India with their children abroad needed a plan from 0 to 1,000 customers.",
    approach: "Looked at loneliness among the elderly, compared existing options (family apps, health monitors), found a gap, and planned experiments in community, companionship and safety, launched in phases through NRI communities.",
    result: "Finalist, with a go-to-market roadmap and the first feature bets.",
    images: [],
    links: [{ label: "see the deck", href: "https://drive.google.com/file/d/1LhvbpMABfOOFwXwLPAyyAgya1X0nmGcS/view?usp=sharing" }],
    sleeve: { color: "#ee46d3", icon: "plane" },
  },
  {
    id: "iit-bombay",
    title: "Post-merger workforce",
    event: "Ace The Case",
    host: "IIT Bombay",
    date: "Feb 2025",
    badge: "Top 5",
    field: "4th of 400+",
    teaser: "Two merged firms with duplicate roles. We decided who to keep based on output, cost and culture fit.",
    problem: "Two firms merged and ended up with duplicate roles, culture clashes and rising staff costs.",
    approach: "A retention plan based on output-to-cost ratio, culture-fit scoring and succession planning, to remove overlap without losing key people.",
    result: "4th out of 400+ teams. Projected: 22.4% better output-to-cost ratio and 25% lower staff costs.",
    images: [],
    links: [{ label: "see the deck", href: "https://drive.google.com/file/d/1bW-zRfGA-bCMo_Ull6dJLLZJnZQUBi09/view?usp=sharing" }],
    sleeve: { color: "#18a0fb", icon: "venn" },
  },
  {
    id: "iim-ahmedabad",
    title: "Inclusion at work for people with disabilities",
    event: "Case Competition",
    host: "IIM Ahmedabad",
    date: "Sep 2025",
    badge: "Recognised",
    teaser: "40% of employees with disabilities were leaving, and none were promoted. We planned how to fix that.",
    problem: "A tech firm was losing 40% of its employees with disabilities, and none had been promoted, despite diversity hiring goals.",
    approach: "A ₹75 lakh Universal Design plan: accessible offices, mentorship, and programmes to make people part of the team.",
    result: "Recognised. Projected: 60% lower attrition and clear promotion paths.",
    images: [],
    links: [{ label: "see the deck", href: "https://drive.google.com/file/d/11RN_tkOjuUjoC7KjpZs9kTml-Y0DyivI/view?usp=sharing" }],
    sleeve: { color: "#1bc47d", icon: "steps" },
  },
];
