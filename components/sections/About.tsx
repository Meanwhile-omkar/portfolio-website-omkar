import Doodle from "@/components/sketch/Doodle";
import { Polaroid } from "@/components/sketch/Paper";
import Sketch from "@/components/sketch/Sketch";
import SectionTitle from "@/components/ui/SectionTitle";
import { education, profile } from "@/data/profile";

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative scroll-mt-20 py-28 md:py-36">
      <div className="mx-auto max-w-[1200px] px-5">
        <SectionTitle id="about-title" color="#fff1b8">
          About me
        </SectionTitle>

        <div className="mt-14 grid items-center gap-14 md:grid-cols-[0.95fr_1.05fr] md:gap-20">
          {education.photo ? (
            <Polaroid src={education.photo} alt={`${education.college} campus`} caption={`${education.short}, ${education.city}`} tilt={-2.5} ratio="5 / 4" sizes="(max-width: 768px) 90vw, 540px" />
          ) : (
            <figure className="relative rotate-[-2.5deg] bg-white p-3 pb-4 shadow-paper">
              <div className="relative grid aspect-[5/4] place-items-center bg-mist">
                <Doodle name="college" color="#ee46d3" size="44%" seed={9} title={`${education.short} (photo coming)`} />
              </div>
              <figcaption className="pt-3 text-center font-note text-[16px] text-ink">
                {education.short}, {education.city}
              </figcaption>
            </figure>
          )}

          <div className="space-y-5 text-[20px] leading-[1.6] text-ink-soft">
            {profile.about.map((para, i) => (
              <p key={i} className="max-w-[54ch]">
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* the degree */}
        <div id="education" className="mt-24 grid scroll-mt-24 items-start gap-14 md:grid-cols-[1fr_1fr] md:gap-20">
          <div>
            <p className="font-marker text-[clamp(52px,6.4vw,88px)] leading-[0.84] text-ink">{education.degree}</p>
            <p className="mt-5 text-[19px] font-medium text-ink">{education.college}</p>
            <p className="mt-1 text-[17px] text-ink-soft">
              {education.city} · {education.years}
            </p>
            <p className="mt-7 font-note text-[22px] text-ink">
              CGPA
              {/* drawn ring sized to the number itself, so it can't drift when fonts load */}
              <span className="relative mx-4 inline-block px-5 py-3 align-middle">
                <Sketch
                  w={140}
                  h={80}
                  stretch
                  seed={12}
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  shapes={[{ t: "ellipse", cx: 70, cy: 40, w: 136, h: 74, o: { stroke: "#ef5533", strokeWidth: 3, roughness: 1.4 } }]}
                />
                <span className="relative font-marker text-[52px] leading-none">{education.cgpa}</span>
              </span>
              <span className="text-ink-faint">/ 10</span>
            </p>
          </div>

          <div>
            <p className="font-marker text-[36px] leading-none text-ink">what I studied</p>
            <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              {education.curriculum.map((c, i) => (
                <li key={c} className="flex items-center gap-2.5 font-note text-[18px] text-ink">
                  <Sketch
                    w={22}
                    h={22}
                    seed={i + 4}
                    className="h-[22px] w-[22px] shrink-0"
                    shapes={[
                      { t: "rect", x: 1, y: 1, w: 20, h: 20, o: { strokeWidth: 1.6 } },
                      { t: "path", d: "M4 11 L9 17 L20 3", o: { stroke: "#1bc47d", strokeWidth: 2.8 } },
                    ]}
                  />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
