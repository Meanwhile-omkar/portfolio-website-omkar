import { siNextdotjs, siPandas, siPython, siReact, siScikitlearn } from "simple-icons";
import Character from "@/components/character/Character";
import HandArrow from "@/components/sketch/HandArrow";
import { StickyNote, Sticker } from "@/components/sketch/Paper";
import { helloMailto, profile, resumeMailto } from "@/data/profile";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pb-16 pt-28 md:min-h-[100svh] md:pb-10 md:pt-32">
      <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 md:grid-cols-[1.25fr_0.75fr]">
        <div className="relative z-10">
          <p className="font-note text-[19px] text-ink-soft">Hi, I&apos;m</p>
          <h1 className="mt-1 text-[clamp(64px,10.5vw,148px)] font-semibold leading-[0.88] tracking-[-0.045em] text-ink">
            Omkar
            <br />
            Haryan<span className="text-blue">.</span>
          </h1>
          <p className="mt-7 max-w-[34ch] text-[clamp(19px,1.8vw,23px)] leading-[1.45] text-ink-soft">
            I work with <span className="hl">AI and data science</span>, and I care about the product and the business side of what I build.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a href={helloMailto} className="btn-blue">
              Email me
            </a>
            <a href={profile.contact.linkedin} target="_blank" rel="noreferrer" className="btn-ghost">
              LinkedIn
            </a>
            <a href={resumeMailto} className="btn-ghost">
              Get my résumé
            </a>
          </div>
          <p className="mt-3 max-w-[40ch] font-note text-[15px] text-ink-faint">The résumé button writes me an email. I reply with the PDF.</p>
        </div>

        {/* Character with its annotations */}
        <div className="relative mx-auto h-[520px] w-full max-w-[420px] md:h-[620px]">
          <Character src={profile.character.hero} alt="Omkar, waving" accent="#6465ed" pose="wave" seed={7} priority className="absolute inset-x-[12%] bottom-0 top-[8%]" sizes="(max-width: 768px) 70vw, 420px" />
          <div className="absolute left-0 top-[16%] sm:left-[-4%]">
            <p className="-rotate-6 font-note text-[22px] text-ink">that&apos;s me</p>
            <HandArrow w={130} h={70} pts={[[10, 6], [66, 22], [124, 58]]} size={4} delay={0.5} className="ml-6 w-[130px]" />
          </div>
          <Sticker icon={siPython} size={58} tilt={-12} className="absolute right-[4%] top-[6%]" />
          <Sticker icon={siReact} size={50} tilt={10} className="absolute right-[-2%] top-[34%]" />
          <Sticker icon={siPandas} size={46} tilt={-6} className="absolute left-[2%] top-[44%]" />
          <Sticker icon={siScikitlearn} size={54} tilt={8} className="absolute right-[-2%] bottom-[8%]" />
          <Sticker icon={siNextdotjs} size={44} tilt={-10} className="absolute right-[6%] bottom-[22%]" />
          <StickyNote tilt={-4} color="#c9ecff" className="absolute bottom-[4%] left-0 w-[190px] !text-[15px] md:left-[-16%]" tape="#ffc700">
            final year, Data Science Engineering
            <br />
            DJ Sanghvi, Mumbai
          </StickyNote>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-[1200px] px-5 md:mt-4">
        <p className="max-w-[60ch] font-note text-[17px] text-ink-soft">
          Inside: a club you can walk into, a library of things I built, and the trophies.{" "}
          <a href="#experience" className="text-ink underline decoration-wavy decoration-blue underline-offset-4">
            start at the door
          </a>
        </p>
      </div>
    </section>
  );
}
