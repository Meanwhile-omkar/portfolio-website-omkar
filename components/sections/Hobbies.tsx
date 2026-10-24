import Image from "next/image";
import { Tape } from "@/components/sketch/Paper";
import SectionTitle from "@/components/ui/SectionTitle";
import Marquee from "@/components/ui/Marquee";
import { hobbies } from "@/data/gallery";
import { jitter } from "@/lib/rough";

type Tile = { src?: string; alt: string; label: string };

// Pinterest-style: columns of photos with different shapes, each bobbing a little, and the
// whole board drifting sideways.
const SHAPES = [
  { w: 160, ratio: "3 / 4" },
  { w: 190, ratio: "1 / 1" },
  { w: 150, ratio: "4 / 5" },
  { w: 220, ratio: "4 / 3" },
  { w: 165, ratio: "2 / 3" },
  { w: 185, ratio: "5 / 4" },
];
const TAPES = ["#ffc700", "#ee46d3", "#1bc47d", "#18a0fb"];

function tiles(): Tile[] {
  const real = hobbies.flatMap((h) => h.photos.map((p) => ({ src: p.src, alt: p.alt, label: h.label })));
  if (real.length) return real;
  // No photos yet: empty frames, labelled, so the layout is visible.
  return Array.from({ length: 12 }, (_, i) => {
    const label = hobbies[i % hobbies.length].label;
    return { alt: `${label} photo coming soon`, label };
  });
}

export default function Hobbies() {
  const all = tiles();
  const r = jitter(77);
  // pair tiles into columns of two, alternating big/small so the board looks hand-pinned
  const columns: Tile[][] = [];
  for (let i = 0; i < all.length; i += 2) columns.push(all.slice(i, i + 2));

  return (
    <section id="hobbies" aria-labelledby="hobbies-title" className="relative scroll-mt-20 overflow-hidden py-28 md:py-36">
      <div className="mx-auto max-w-[1200px] px-5">
        <SectionTitle id="hobbies-title" color="#c9ecff" aside="What I do when I'm not building or pitching.">
          Off the clock
        </SectionTitle>
      </div>

      <Marquee duration={Math.max(50, columns.length * 10)} className="mt-14" label="Hobby photos">
        {columns.map((col, ci) => (
          <div key={ci} className="flex shrink-0 flex-col gap-7 px-4 pt-6" style={{ marginTop: ci % 2 ? 40 : 0 }}>
            {col.map((t, ti) => {
              const shape = SHAPES[(ci * 2 + ti) % SHAPES.length];
              const tilt = Math.round((r() * 2 - 1) * 3.5 * 10) / 10;
              return (
                <figure
                  key={ti}
                  className="bob relative"
                  style={{ width: shape.w, ["--bob-dur" as string]: `${5 + ((ci + ti) % 4)}s`, ["--bob-delay" as string]: `${-(ci * 0.7 + ti)}s` }}
                >
                  <div className="relative overflow-hidden rounded-[14px] bg-mist shadow-paper" style={{ aspectRatio: shape.ratio, transform: `rotate(${tilt}deg)` }}>
                    {t.src ? (
                      <Image src={t.src} alt={t.alt} fill sizes="300px" className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center rounded-[14px] border-2 border-dashed border-ink/20 font-note text-[15px] text-ink-faint">
                        photo coming
                      </div>
                    )}
                  </div>
                  <Tape color={TAPES[(ci + ti) % TAPES.length]} className="-top-3 left-1/2 -translate-x-1/2" style={{ transform: `translateX(-50%) rotate(${tilt * 2}deg)` }} />
                  <figcaption className="mt-2 font-note text-[16px] text-ink">{t.label}</figcaption>
                </figure>
              );
            })}
          </div>
        ))}
      </Marquee>
    </section>
  );
}
