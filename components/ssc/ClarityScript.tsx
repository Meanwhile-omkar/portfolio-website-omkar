"use client";

import Script from "next/script";
import { useEffect } from "react";
import { track } from "./track";

// Microsoft Clarity project ID (public; it appears in the page anyway). Empty = tracking off.
// Create one free at clarity.microsoft.com → New project → Settings → Overview → Project ID.
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID ?? "";

// Loads Clarity on the SSC pages and records every paper open/download, wherever the link is
// (folder cards, the quick table on subject pages, the full list at the bottom).
export default function ClarityScript() {
  useEffect(() => {
    if (!CLARITY_ID) return;
    track("page_view", { page_type: pageType(location.pathname) });
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (href.includes("/ssc-board-papers/pdf/")) {
        const file = decodeURIComponent(href.split("/").pop() ?? "").replace(/\.pdf$/, "");
        const where = a.closest("table") ? "quick_table" : a.closest("#library") ? "folder_card" : "full_list";
        track(a.hasAttribute("download") ? "paper_download" : "paper_view", { last_paper: file, clicked_from: where });
      } else if (href.startsWith("/ssc-board-papers/") || href.startsWith("https://omkarharyan.paperkitelabs.com/ssc-board-papers/")) {
        track("internal_link", { link_to: href.replace(/^https?:\/\/[^/]+/, "") });
      } else if (href.includes("archive/refs/heads/main.zip")) {
        track("download_everything_zip");
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  if (!CLARITY_ID) return null;
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
