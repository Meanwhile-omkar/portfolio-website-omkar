"use client";

import Script from "next/script";
import { useEffect } from "react";
import { tag, track } from "./track";

// Microsoft Clarity project "SSC Board Papers" (the ID is public; it appears in the page anyway).
// Loaded only on /ssc-board-papers pages, so the portfolio is not tracked. Override with NEXT_PUBLIC_CLARITY_ID.
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID ?? "zjqnpkixqz";

// Sections whose first appearance on screen is recorded as an event (how far down students get).
const SECTIONS: [string, string][] = [
  ["#library", "saw_library"],
  ["#matrix-h", "saw_subject_year_grid"],
  ["#faq-h", "saw_faq"],
  ["#talk", "saw_contact_form"],
  ["#index-h", "saw_full_list"],
];

export default function ClarityScript() {
  useEffect(() => {
    if (!CLARITY_ID) return;
    const start = performance.now();
    let firstPaper = false;

    // Who is this visitor? (all anonymous)
    tag("page_type", pageType(location.pathname));
    tag("source", sourceOf(document.referrer, new URLSearchParams(location.search)));
    tag("device", matchMedia("(pointer: coarse)").matches ? "phone_or_tablet" : "desktop");
    tag("came_with_filters", location.search ? "yes" : "no");
    let visits = 1;
    try {
      visits = Number(localStorage.getItem("ssc-visits") ?? "0") + 1;
      localStorage.setItem("ssc-visits", String(visits));
    } catch {}
    tag("visitor", visits === 1 ? "new" : "returning");
    tag("visit_number", Math.min(visits, 20));
    try {
      const s = JSON.parse(localStorage.getItem("ssc-papers-prefs") ?? "{}");
      tag("lang", s.lang === "mr" ? "mr" : "en");
    } catch {}
    track("page_view");

    // Paper opens/downloads and other link clicks, wherever the link is on the page.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (href.includes("/ssc-board-papers/pdf/")) {
        const file = decodeURIComponent(href.split("/").pop() ?? "").replace(/\.pdf$/, "");
        const where = a.closest("table") ? "quick_table" : a.closest("#library") ? "folder_card" : "full_list";
        if (!firstPaper) {
          firstPaper = true;
          tag("seconds_to_first_paper", Math.round((performance.now() - start) / 1000));
        }
        track(a.hasAttribute("download") ? "paper_download" : "paper_view", { last_paper: file, clicked_from: where });
      } else if (href.startsWith("/ssc-board-papers/") || href.startsWith("https://omkarharyan.paperkitelabs.com/ssc-board-papers/")) {
        track("internal_link", { link_to: href.replace(/^https?:\/\/[^/]+/, "") });
      } else if (href.includes("archive/refs/heads/main.zip")) {
        track("download_everything_zip");
      } else if (href.startsWith("mailto:")) {
        track("email_link");
      }
    };
    document.addEventListener("click", onClick, true);

    // Which FAQ questions get opened.
    const onToggle = (e: Event) => {
      const d = e.target as HTMLDetailsElement;
      if (d.tagName !== "DETAILS" || !d.open) return;
      const q = d.querySelector("summary")?.childNodes;
      const text = q ? Array.from(q).find((n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim())?.textContent?.trim() : "";
      track(d.closest("#index-h") || d.querySelector("#index-h") ? "open_full_list" : "faq_open", { faq: text?.slice(0, 70) });
    };
    document.addEventListener("toggle", onToggle, true);

    // How far down the page students get.
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const ev = SECTIONS.find(([sel]) => en.target.matches(sel))?.[1];
          if (ev && !seen.has(ev)) {
            seen.add(ev);
            track(ev);
          }
        }),
      { threshold: 0.15 },
    );
    const watch = () => SECTIONS.forEach(([sel]) => document.querySelectorAll(sel).forEach((el) => io.observe(el)));
    watch();
    const late = setTimeout(watch, 2500);

    // Phone back button inside the folders.
    const onPop = () => track("browser_back");
    window.addEventListener("popstate", onPop);

    // Leaving without opening any paper.
    const onHide = () => {
      if (document.visibilityState === "hidden" && !firstPaper) tag("left_without_paper", Math.round((performance.now() - start) / 1000));
    };
    document.addEventListener("visibilitychange", onHide);

    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("toggle", onToggle, true);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("popstate", onPop);
      io.disconnect();
      clearTimeout(late);
    };
  }, []);

  if (!CLARITY_ID) return null;
  // Clarity's standard snippet, loaded right after the page becomes interactive.
  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", ${JSON.stringify(CLARITY_ID)});`}
    </Script>
  );
}

function pageType(path: string) {
  const s = path.replace(/^\/ssc-board-papers\/?/, "");
  if (!s) return "main";
  if (/^ssc-board-paper-\d{4}$/.test(s)) return "year";
  if (/^ssc-semi-english-question-paper-\d{4}$/.test(s)) return "semi_year";
  if (/question-paper-\d{4}$/.test(s)) return "subject_year";
  if (s.includes("medium")) return "medium";
  if (s.endsWith("question-papers")) return "subject";
  return s;
}

// Where the visit came from, in plain words.
function sourceOf(ref: string, sp: URLSearchParams) {
  const utm = sp.get("utm_source");
  if (utm) return `utm:${utm}`.slice(0, 40);
  if (!ref) return "direct_or_app"; // WhatsApp/Telegram/Instagram apps usually send no referrer
  const h = (() => {
    try {
      return new URL(ref).hostname;
    } catch {
      return "";
    }
  })();
  if (h.endsWith("omkarharyan.paperkitelabs.com")) return "internal";
  if (/google\./.test(h)) return "google";
  if (/bing\.com|duckduckgo|yahoo/.test(h)) return "bing_ddg_yahoo";
  if (/chatgpt|openai|perplexity|gemini|copilot|claude/.test(h)) return "ai_assistant";
  if (/whatsapp|wa\.me/.test(h)) return "whatsapp";
  if (/t\.me|telegram/.test(h)) return "telegram";
  if (/instagram|facebook|fb\.|threads/.test(h)) return "instagram_facebook";
  if (/youtube|youtu\.be/.test(h)) return "youtube";
  if (/reddit|quora/.test(h)) return "reddit_quora";
  if (/paperkitelabs\.com/.test(h)) return "paperkitelabs_site";
  return h.slice(0, 40);
}
