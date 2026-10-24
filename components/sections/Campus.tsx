import { StickyNote } from "@/components/sketch/Paper";
import PhotoStrip from "@/components/ui/PhotoStrip";
import SectionTitle from "@/components/ui/SectionTitle";
import { roles } from "@/data/campus";
import { campusPhotos } from "@/data/gallery";

export default function Campus() {
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

      <div className="mt-14">
        <PhotoStrip photos={campusPhotos} rows={2} height={230} alt="College life, fests and visits" seed={11} reverseFirst />
      </div>
    </section>
  );
}
