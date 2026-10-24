import Character from "@/components/character/Character";
import Sketch from "@/components/sketch/Sketch";
import { helloMailto, profile, resumeMailto } from "@/data/profile";
import CopyEmail from "./CopyEmail";

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative scroll-mt-20 overflow-hidden pb-10 pt-28 md:pt-36">
      <div className="mx-auto grid max-w-[1200px] items-end gap-10 px-5 md:grid-cols-[1.2fr_0.8fr]">
        <div className="pb-10">
          <h2 id="contact-title" className="text-[clamp(56px,9vw,128px)] font-semibold leading-[0.9] tracking-[-0.045em] text-ink">
            Let&apos;s talk<span className="text-blue">.</span>
          </h2>
          <p className="mt-6 max-w-[42ch] text-[20px] leading-relaxed text-ink-soft">
            If you are hiring for AI, data or product work, or just want to swap notes on a case, write to me. I reply to every email.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a href={helloMailto} className="btn-blue">
              Email me
            </a>
            <a href={profile.contact.linkedin} target="_blank" rel="noreferrer" className="btn-ghost">
              LinkedIn
            </a>
            <a href={profile.contact.github} target="_blank" rel="noreferrer" className="btn-ghost">
              GitHub
            </a>
            <a href={resumeMailto} className="btn-ghost">
              Get my résumé
            </a>
          </div>
          <div className="mt-6">
            <CopyEmail email={profile.contact.email} />
          </div>
        </div>

        <div className="relative mx-auto h-[440px] w-full max-w-[340px]">
          <Character src={profile.character.contact} alt="Omkar about to throw a paper plane" accent="#18a0fb" pose="plane" seed={5} className="absolute inset-x-[10%] bottom-0 top-0" sizes="340px" />
          <Sketch
            w={160}
            h={90}
            seed={6}
            className="absolute -left-[150px] top-[2px] h-[90px] w-[160px] opacity-70"
            shapes={[{ t: "curve", pts: [[150, 80], [100, 30], [40, 40], [10, 6]], o: { strokeLineDash: [6, 8], strokeWidth: 2 } }]}
          />
        </div>
      </div>

      <footer className="mx-auto mt-6 flex max-w-[1200px] flex-wrap items-center justify-between gap-3 border-t border-dashed border-ink/20 px-5 pt-6 text-[14px] text-ink-faint">
        <p>Drawn and built by {profile.name}, 2026.</p>
        <a href="#top" className="font-note text-[16px] text-ink-soft hover:text-ink">
          back to the top
        </a>
      </footer>
    </section>
  );
}
