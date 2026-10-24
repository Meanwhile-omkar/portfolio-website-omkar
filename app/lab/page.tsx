import type { Metadata } from "next";
import { Gochi_Hand, Kalam, Patrick_Hand, Permanent_Marker } from "next/font/google";
import { siPython, siReact } from "simple-icons";
import Annotate from "@/components/sketch/Annotate";
import Doodle from "@/components/sketch/Doodle";
import { doodles, type DoodleName } from "@/components/sketch/doodles";
import HandArrow from "@/components/sketch/HandArrow";
import { Polaroid, StickyNote, Sticker, WordSticker } from "@/components/sketch/Paper";
import RoughFrame from "@/components/sketch/RoughFrame";

// Dev-only specimen page: compare hand fonts and check every sketch primitive in one place.
export const metadata: Metadata = { title: "Lab · type & primitives", robots: { index: false } };

const gochi = Gochi_Hand({ subsets: ["latin"], weight: "400" });
const kalam = Kalam({ subsets: ["latin"], weight: ["400", "700"] });
const patrick = Patrick_Hand({ subsets: ["latin"], weight: "400" });
const permanent = Permanent_Marker({ subsets: ["latin"], weight: "400" });

const headings = [
  { name: "Just Another Hand (current marker)", cls: "font-marker" },
  { name: "Permanent Marker", cls: permanent.className },
  { name: "Gochi Hand", cls: gochi.className },
];
const notes = [
  { name: "Shantell Sans (current notes)", cls: "font-note" },
  { name: "Kalam", cls: kalam.className },
  { name: "Patrick Hand", cls: patrick.className },
];

const sample = "Pitched sponsorships for a rap battle concert to brands and media partners.";

export default function Lab() {
  return (
    <main className="relative mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-5xl font-semibold tracking-tight">Lab</h1>
      <p className="mt-2 max-w-xl">Pick the hand fonts here. Each row is the same text in a different face.</p>

      <h2 className="mt-14 text-2xl font-semibold">Marker headings</h2>
      <div className="mt-6 grid gap-10">
        {headings.map((h) => (
          <div key={h.name}>
            <p className="label">{h.name}</p>
            <p className={`${h.cls} mt-2 text-[64px] leading-none text-ink`}>EXPERIENCE CLUB · Buzz Entertainment</p>
          </div>
        ))}
      </div>

      <h2 className="mt-16 text-2xl font-semibold">Note text</h2>
      <div className="mt-6 grid gap-8 md:grid-cols-3">
        {notes.map((n) => (
          <div key={n.name}>
            <p className="label">{n.name}</p>
            <p className={`${n.cls} mt-2 text-[22px] leading-snug text-ink`}>{sample}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-16 text-2xl font-semibold">Primitives</h2>
      <div className="mt-8 flex flex-wrap items-start gap-12">
        <RoughFrame className="px-6 py-4" seed={4}>
          <p className="font-note text-xl text-ink">a rough box that follows its text</p>
        </RoughFrame>
        <RoughFrame className="px-6 py-4" seed={9} o={{ fill: "#ffc700" }}>
          <p className="font-marker text-4xl text-ink">HATCHED FILL</p>
        </RoughFrame>
        <p className="font-note text-2xl text-ink">
          I <Annotate type="circle" color="#ef5533">won</Annotate> the case and{" "}
          <Annotate type="highlight" color="#ffe27a" delay={400}>
            learned a lot
          </Annotate>{" "}
          <Annotate type="underline" color="#18a0fb" delay={800}>
            doing it
          </Annotate>
        </p>
        <HandArrow w={220} h={120} pts={[[10, 100], [90, 30], [210, 40]]} className="w-[220px]" />
        <StickyNote tilt={-3} tape="#18a0fb">
          what I liked most:
          <br />
          real clients
        </StickyNote>
        <Polaroid src="/photos/wins/iiit-surat.jpeg" alt="Team at IIIT Surat" caption="IIIT Surat" tilt={3} className="w-56" />
        <div className="flex items-center gap-4">
          <Sticker icon={siPython} tilt={-8} />
          <Sticker icon={siReact} tilt={6} />
          <WordSticker color="#fff1b8" tilt={-4}>
            Power BI
          </WordSticker>
        </div>
      </div>

      <h2 className="mt-16 text-2xl font-semibold">Doodles</h2>
      <div className="mt-6 grid grid-cols-4 gap-6 sm:grid-cols-8">
        {(Object.keys(doodles) as DoodleName[]).map((n, i) => (
          <div key={n} className="flex flex-col items-center gap-1">
            <Doodle name={n} size={64} color={["#ffc700", "#18a0fb", "#ee46d3", "#1bc47d", "#ef5533", "#6465ed"][i % 6]} />
            <span className="label normal-case">{n}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
