import { helloMailto } from "@/data/profile";

const links = [
  ["about", "#about"],
  ["experience", "#experience"],
  ["library", "#library"],
  ["toolbox", "#toolbox"],
  ["wins", "#wins"],
  ["campus", "#campus"],
  ["hobbies", "#hobbies"],
] as const;

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-3 z-50 flex justify-center px-3">
      <nav
        aria-label="Sections"
        className="flex items-center gap-1 rounded-full border border-ink/10 bg-white/80 py-1.5 pl-4 pr-1.5 shadow-paper backdrop-blur-md"
      >
        <a href="#top" className="mr-2 font-marker text-[28px] leading-none text-ink">
          omkar.
        </a>
        <ul className="hidden items-center md:flex">
          {links.map(([label, href]) => (
            <li key={href}>
              <a href={href} className="rounded-full px-3 py-1.5 text-[14px] text-ink-soft transition-colors hover:bg-mist hover:text-ink">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a href={helloMailto} className="btn-blue ml-1 !px-4 !py-2 !text-[14px]">
          Let&apos;s talk
        </a>
      </nav>
    </header>
  );
}
