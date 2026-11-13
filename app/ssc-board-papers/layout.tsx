import { Kalam, Mukta } from "next/font/google";

// Devanagari fonts, loaded only under /ssc-board-papers: Mukta for reading, Kalam (handwritten) for headings.
const mukta = Mukta({ subsets: ["devanagari", "latin"], weight: ["400", "500", "600"], variable: "--font-deva", display: "swap" });
const kalam = Kalam({ subsets: ["devanagari", "latin"], weight: ["400", "700"], variable: "--font-deva-hand", display: "swap" });

export default function SscLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${mukta.variable} ${kalam.variable}`}>{children}</div>;
}
