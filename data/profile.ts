export const profile = {
  name: "Omkar Haryan",
  first: "Omkar",
  line: "I work with AI and data science, and I care about the product and the business side of what I build.",
  location: "Mumbai",
  about: [
    "I'm in my final year of Data Science Engineering at DJ Sanghvi College in Mumbai.",
    "My technical side is ML, data pipelines and building apps with LLMs. The other side of me likes business problems: I take part in case competitions, and I've worked in a founder's office, in product, and on live events.",
    "I like work where both meet: using data to decide what to build, and then building it.",
  ],
  /** 3D character art. null = sketched placeholder. */
  character: {
    hero: "/character/hero.webp" as string | null,
    contact: "/character/contact.webp" as string | null,
  },
  contact: {
    email: "omkar.djsce27@gmail.com",
    linkedin: "https://www.linkedin.com/in/omkar-haryan-596a33280/",
    github: "https://github.com/Meanwhile-omkar",
  },
};

export const education = {
  degree: "B.Tech, CSE (Data Science)",
  college: "Dwarkadas J. Sanghvi College of Engineering",
  short: "DJ Sanghvi College of Engineering",
  city: "Mumbai",
  years: "2023 – 2027",
  // Newest résumé (Oct 2026) says 8.80; an older one says 8.82.
  cgpa: "8.80",
  // Draft list. Omkar to confirm or replace with the real curriculum.
  curriculum: [
    "Machine Learning",
    "Deep Learning",
    "Data Structures & Algorithms",
    "Database Management",
    "Statistics & Probability",
    "Big Data Analytics",
    "Natural Language Processing",
    "Data Visualisation",
  ],
  photo: null as string | null,
};

const resumeBody = [
  "Hi Omkar,",
  "",
  "I was going through your portfolio and now I'd like to see your résumé.",
  "Could you send it over?",
  "",
  "Thanks,",
].join("\n");

export const resumeMailto = `mailto:${profile.contact.email}?subject=${encodeURIComponent(
  "Résumé request (from your portfolio)",
)}&body=${encodeURIComponent(resumeBody)}`;

export const helloMailto = `mailto:${profile.contact.email}?subject=${encodeURIComponent("Hello from your portfolio")}`;
