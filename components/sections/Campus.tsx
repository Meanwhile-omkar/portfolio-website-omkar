import { Polaroid, StickyNote } from "@/components/sketch/Paper";
import SectionTitle from "@/components/ui/SectionTitle";
import Marquee from "@/components/ui/Marquee";
import { campusPhotos, roles } from "@/data/campus";

const TAPES = ["#ee46d3", "#18a0fb", "#ffc700", "#1bc47d"];
const MIN_TILES = 8;

export default function Campus() {
  // Until more photos arrive, empty taped frames keep the strip full.
  const tiles = [
    ...campusPhotos,
    ...Array.from({ length: Math.max(0, MIN_TILES - campusPhotos.length) }, (_, i) => ({
      src: "",
      alt: "more photos coming",
      caption: i % 2 ? "Trinity" : "S4DS",
    })),
  ];

  return (
    <section id="campus" aria-labelledby="campus-title" className="relative scroll-mt-20 overflow-hidden py-28 md:py-36">
      <div className="mx-auto max-w-[1200px] px-5">
        <SectionTitle id="campus-title" color="#ffd9f6" aside="Outside class, I also help run two student groups at DJ Sanghvi.">
          On campus
        </SectionTitle>

        <div className="mt-12 flex flex-wrap gap-8">
          {roles.map((r, i) => (
            <StickyNote key={r.title} tilt={i ? 2 : -2} color={i ? "#ffd9f6" : "#fff1b8"} tape={i ? "#18a0fb" : "#ee46d3"} className="w-full max-w-[330px]">
              <p className="font-marker text-[32px] leading-none">{r.title}</p>
              <p className="mt-1 text-[16px] leading-snug">{r.org}</p>
              <p className="mt-2 text-[16px] leading-snug text-ink-soft">{r.what}</p>
              <p className="mt-2 text-[14px] text-ink-faint">since {r.since}</p>
            </StickyNote>
          ))}
        </div>
      </div>

      <Marquee duration={Math.max(40, tiles.length * 7)} reverse className="mt-14" label="Photos from Trinity and S4DS">
        {tiles.map((p, i) => (
          <div key={i} className="mx-4 shrink-0 py-5" style={{ width: i % 3 === 1 ? 280 : 220 }}>
            <Polaroid
              src={p.src || undefined}
              alt={p.alt}
              caption={p.caption}
              tilt={[-3, 2, -1.5, 3][i % 4]}
              tape={TAPES[i % TAPES.length]}
              ratio={i % 3 === 1 ? "4 / 3" : "4 / 5"}
              sizes="280px"
            />
          </div>
        ))}
      </Marquee>
    </section>
  );
}
