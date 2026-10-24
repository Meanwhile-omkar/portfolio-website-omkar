import { Inter, JetBrains_Mono, Just_Another_Hand, Shantell_Sans } from "next/font/google";

// Inter with the optical-size axis gives the "Inter Display" cut at large sizes.
export const inter = Inter({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-inter",
  display: "swap",
});

export const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

// Condensed all-caps marker, closest Google match to TrashHand from the reference pack.
export const marker = Just_Another_Hand({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-marker",
  display: "swap",
});

// Readable handwriting for notes. INFM axis = how informal / wobbly it looks.
export const note = Shantell_Sans({
  subsets: ["latin"],
  axes: ["INFM", "BNCE"],
  variable: "--font-note",
  display: "swap",
});

export const fontVars = [inter.variable, mono.variable, marker.variable, note.variable].join(" ");
