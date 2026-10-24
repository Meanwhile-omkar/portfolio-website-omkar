import ExperienceClub from "@/components/experience/ExperienceClub";
import Library from "@/components/library/Library";
import About from "@/components/sections/About";
import Campus from "@/components/sections/Campus";
import Contact from "@/components/sections/Contact";
import Hero from "@/components/sections/Hero";
import Hobbies from "@/components/sections/Hobbies";
import Nav from "@/components/sections/Nav";
import Toolbox from "@/components/sections/Toolbox";
import Wins from "@/components/sections/Wins";
import StructuredData from "@/components/seo/StructuredData";

export default function Home() {
  return (
    <>
      <StructuredData />
      <Nav />
      <main className="relative">
        <Hero />
        <About />
        <ExperienceClub />
        <Library />
        <Toolbox />
        <Wins />
        <Campus />
        <Hobbies />
        <Contact />
      </main>
    </>
  );
}
