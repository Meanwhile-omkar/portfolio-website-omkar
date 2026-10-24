import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVars } from "./fonts";
import { profile } from "@/data/profile";
import CanvasGlow from "@/components/canvas/CanvasGlow";
import SmoothScroll from "@/components/canvas/SmoothScroll";

export const metadata: Metadata = {
  title: `${profile.name} · Data Science & Strategy`,
  description: profile.line,
};

// Design direction contract (impeccable). Kept in the built HTML so the finish review can audit it.
const CONTRACT = `
THESIS: a portfolio drawn in a sketchbook. Two places to walk into (a club door, a library shelf) instead of the card grid of projects and timeline of jobs every portfolio ships.
OWN-WORLD: white canvas with a dotted grid (onlines.com.ar), ink #1d1d1f, Figma accents (#ffc700 #18a0fb #ee46d3 #1bc47d #ef5533 #6465ed) as hatched rough.js fills; marker caps (Just Another Hand), handwriting notes (Shantell Sans), Inter for reading; tape, polaroids, stickers, sticky notes.
STORY: visitor learns Omkar works in AI and data science with a product and business head, explores real internships, projects and case wins, then emails, opens LinkedIn, or asks for the résumé by email.
FIRST VIEWPORT: huge "Omkar Haryan." left, one-line intro, blue Email me + LinkedIn + Get my résumé; right, the character waving with a "that's me" arrow and tool stickers.
FORM: pinned by the user's brief (no concept roll).
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
`;

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVars}>
      <body>
        <div hidden dangerouslySetInnerHTML={{ __html: `<!--${CONTRACT}-->` }} />
        <CanvasGlow />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
