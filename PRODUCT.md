# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Anyone evaluating Omkar Haryan for an internship or early role: startup founders, product and consulting recruiters, and data science / ML teams. The audience is deliberately mixed, so the site speaks broadly: Omkar works around AI and data science, his technical skill is real, and he is data-driven, product-focused and business-minded.

## Product Purpose
A personal portfolio that shows what Omkar has actually done (internships, projects, case competitions, wins) in a way people remember and enjoy exploring. Success: a visitor understands who he is within one screen, explores the experience and projects, and then emails him, messages him on LinkedIn, or asks for his résumé.

## Positioning
A data science engineering student who also wins business case competitions. Both halves are backed by real work: 5 internships across ML, research, product and marketing; 8 built projects; 9+ case competitions.

## Operating Context
- Visitors arrive from LinkedIn, résumés, hackathon and case-competition networks. They often skim on a phone first.
- Main actions:
  - **Email** (omkar.djsce27@gmail.com).
  - **LinkedIn** (linkedin.com/in/omkar-haryan).
  - **"Get résumé":** opens a prefilled email to Omkar from the visitor, saying they visited the portfolio and would like his résumé. Omkar then replies with it. There is deliberately no résumé download.
- GitHub: github.com/Meanwhile-omkar.

## Capabilities and Constraints
- Next.js 16 / React 19 / Tailwind 3 / framer-motion. Single page.
- The content lives in `data/*.ts`, and Omkar edits it himself.
- Two signature interactions are required: the **Experience Club** and the **Library**. Every other section stays simple.
- Phones get the same layout as desktop, scaled down (Omkar's decision).
- Undecided / pending from Omkar:
  - Updated experience, project and case-study text.
  - Company logos.
  - 3D character art and per-company doodle backgrounds.
  - College photo, hobby photos, curriculum.
  - Project links.

## Brand Commitments
- Copy is plain, simple English: what the company does, what Omkar did, what came out of it.
- No AI-sounding storytelling, filler or made-up numbers. Projected figures are labelled as projected.
- The old chess / "knight" theme is retired.

## Evidence on Hand
- `data/experience.ts`: 5 internships (Buzz Entertainment, IIT Bombay KCDH, Sereno Volante, Bigul, CypherSOL).
- `data/projects.ts`: 8 projects.
- `data/caseStudies.ts`: 9 case competitions.
- `data/achievements.ts`: 7 awards and 2 leadership roles.
- `public/photos/wins/`: competition and hackathon photos.
- Education: DJ Sanghvi College of Engineering, B.E. Data Science, 2023–27, CGPA 8.82.
- Absent, so never fabricate: testimonials, project links, company logos, hobby photos, curriculum details, and the "what I liked most" lines for each internship.

## Product Principles
1. Real over impressive: every claim traces to something Omkar did.
2. Exploration is the reward: the two signature sections should be fun to poke at, never a chore.
3. One screen tells the story: who he is and how to reach him is obvious without exploring.
4. Omkar can maintain it: content changes are data edits, not code changes.

## Accessibility & Inclusion
- Keyboard paths through both signature sections, plus Esc to close.
- `prefers-reduced-motion` respected.
- Alt text on all photos.
- Handwriting fonts only where text stays short; longer text stays in a readable sans.
