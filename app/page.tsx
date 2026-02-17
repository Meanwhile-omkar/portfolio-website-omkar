import BottomNav from '@/components/ui/BottomNav';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Worlds from '@/components/sections/Worlds';
import CaseStudies from '@/components/sections/CaseStudies';
import Internships from '@/components/sections/Internships';
import Projects from '@/components/sections/Projects';
import Winnings from '@/components/sections/Winnings';
import Gallery from '@/components/sections/Gallery';
import Contact from '@/components/sections/Contact';

export default function Home() {
  return (
    <main className="relative">
      <BottomNav />

      <Hero />

      {/* Chess Divider */}
      <div className="flex items-center gap-0 overflow-hidden opacity-[0.08] select-none pointer-events-none text-xl tracking-[8px] text-gold whitespace-nowrap py-4 border-t border-b border-[rgba(201,168,76,0.1)]">
        ♔ &nbsp; ♕ &nbsp; ♖ &nbsp; ♗ &nbsp; ♘ &nbsp; ♙ &nbsp; ♚ &nbsp; ♛ &nbsp; ♜ &nbsp; ♝ &nbsp; ♞ &nbsp; ♟ &nbsp; ♔ &nbsp; ♕ &nbsp; ♖ &nbsp; ♗ &nbsp; ♘ &nbsp; ♙ &nbsp; ♚ &nbsp; ♛ &nbsp; ♜ &nbsp; ♝ &nbsp; ♞ &nbsp; ♟
      </div>

      <About />
      <Worlds />

      {/* Chess Divider */}
      <div className="flex items-center gap-0 overflow-hidden opacity-[0.08] select-none pointer-events-none text-xl tracking-[8px] text-gold whitespace-nowrap py-4 border-t border-b border-[rgba(201,168,76,0.1)]">
        ♙ &nbsp; ♙ &nbsp; ♙ &nbsp; ♙ &nbsp; ♙ &nbsp; ♙ &nbsp; ♙ &nbsp; ♙ &nbsp; ♙ &nbsp; ♙ &nbsp; ♙ &nbsp; ♙ &nbsp; ♙ &nbsp; ♙ &nbsp; ♙ &nbsp; ♙
      </div>

      <CaseStudies />
      <Internships />
      <Projects />
      <Winnings />
      <Gallery />
      <Contact />
    </main>
  );
}
