import Doodle from "@/components/sketch/Doodle";
import RoughFrame from "@/components/sketch/RoughFrame";
import Sketch from "@/components/sketch/Sketch";
import SectionTitle from "@/components/ui/SectionTitle";
import { achievements, podiumTotal, recognitions } from "@/data/achievements";
import { caseStudies } from "@/data/caseStudies";
import { winsPhotos } from "@/data/gallery";
import type { Shape } from "@/lib/rough";
import PhotoWall from "./PhotoWall";

// Every number here is counted from the data files, so it stays true when they change.
const podiums = Math.max(podiumTotal, achievements.length);
const topTens = caseStudies.filter((c) => c.badge === "Top 10" || c.badge === "Top 5").length;
const tallies = [
  { n: podiums, label: "podium finishes, hackathons and cases" },
  { n: caseStudies.length, label: "case competitions on the record shelf" },
  { n: topTens, label: "top-10 finishes, one of them out of 600+" },
];

function Tally({ n, seed }: { n: number; seed: number }) {
  const shapes: Shape[] = [];
  for (let i = 0; i < n; i++) {
    const group = Math.floor(i / 5);
    const k = i % 5;
    const gx = group * 46;
    if (k < 4) shapes.push({ t: "line", x1: gx + k * 8 + 2, y1: 2, x2: gx + k * 8 + 4, y2: 30, o: { strokeWidth: 2.4 } });
    else shapes.push({ t: "line", x1: gx - 4, y1: 24, x2: gx + 34, y2: 6, o: { strokeWidth: 2.4, stroke: "#ef5533" } });
  }
  const w = Math.ceil(n / 5) * 46;
  return <Sketch w={w} h={32} shapes={shapes} seed={seed} className="h-8" style={{ width: w }} />;
}

export default function Wins() {
  return (
    <section id="wins" aria-labelledby="wins-title" className="section-mist relative scroll-mt-20 overflow-hidden py-28 md:py-36">
      <div className="mx-auto max-w-[1200px] px-5">
        <SectionTitle id="wins-title" color="#ffe27a" aside="Hackathons, case competitions and datathons, counted.">
          Wins
        </SectionTitle>

        <div className="mt-14 grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* notepad of tallies */}
          <RoughFrame className="self-start bg-white px-7 py-7" seed={22} o={{ strokeWidth: 2.2 }}>
            <ul className="space-y-5">
              {tallies.map((t, i) => (
                <li key={t.label} className="flex items-center gap-4">
                  <span className="w-[54px] shrink-0 font-marker text-[52px] leading-none text-ink">{t.n}</span>
                  <span className="min-w-0">
                    <span className="block font-note text-[17px] leading-tight text-ink">{t.label}</span>
                    <Tally n={t.n} seed={i + 2} />
                  </span>
                </li>
              ))}
            </ul>
          </RoughFrame>

          {/* the list itself */}
          <ul className="grid gap-x-10 gap-y-4 self-start sm:grid-cols-2">
            {recognitions.map((r) => (
              <li key={r} className="flex gap-3">
                <Doodle name="sparkle" color="#ee46d3" size={30} seed={3} className="mt-0.5 shrink-0" />
                <span className="font-note text-[17px] leading-tight text-ink">{r}</span>
              </li>
            ))}
            {achievements.map((a) => (
              <li key={a.title} className="flex gap-3">
                <Doodle name={a.place === "Winner" ? "trophy" : "star"} color={a.place === "Winner" ? "#ffc700" : "#18a0fb"} size={30} seed={a.year} className="mt-0.5 shrink-0" />
                <span>
                  <span className="font-note text-[17px] leading-tight text-ink">
                    <span className="font-semibold">{a.place}</span> · {a.title}
                  </span>
                  <span className="block text-[14px] leading-snug text-ink-faint">
                    {a.host}, {a.year}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <PhotoWall photos={winsPhotos} />
    </section>
  );
}
