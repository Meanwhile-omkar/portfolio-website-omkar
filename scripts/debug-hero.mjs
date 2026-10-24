import { chromium } from "playwright";
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:3100/", { waitUntil: "networkidle" });
console.log(await p.evaluate(() => {
  const el = document.querySelector('[aria-label^="Omkar, waving"]');
  if (!el) return "no element";
  const r = el.getBoundingClientRect(); const svg = el.querySelector("svg"); const sr = svg?.getBoundingClientRect();
  return JSON.stringify({ cls: el.className, r: [r.x, r.y, r.width, r.height], svg: sr && [sr.width, sr.height], paths: svg?.querySelectorAll("path").length, parent: el.parentElement.getBoundingClientRect().height });
}));
await b.close();
