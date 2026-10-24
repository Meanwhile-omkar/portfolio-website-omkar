// Opens every book and reports pages whose content overflows, at several laptop sizes.
// usage: node scripts/check-books.mjs <baseUrl> [outDir]
import { chromium } from "playwright";
const [base, out] = process.argv.slice(2);
const sizes = [[1591, 870], [1440, 900], [1366, 768], [1280, 720]];
const b = await chromium.launch();
for (const [w, h] of sizes) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto(base + "/", { waitUntil: "networkidle" });
  const first = p.getByRole("button", { name: /LawzyAI/ });
  await first.scrollIntoViewIfNeeded();
  await first.click();
  if (out && w === 1591) { await p.waitForTimeout(700); await p.screenshot({ path: `${out}/book-opening.png` }); }
  await p.waitForTimeout(2200);
  const bad = [];
  for (let i = 0; i < 11; i++) {
    const r = await p.evaluate(() => {
      const d = document.querySelector('[role="dialog"]');
      const card = d.querySelector(".grid");
      const pages = [...card.children].slice(0, 2).map((c) => c.firstElementChild ?? c);
      const name = d.querySelector("h3")?.textContent;
      const cr = card.getBoundingClientRect();
      return { name, over: pages.map((pg) => pg.scrollHeight - pg.clientHeight), cardBottom: Math.round(cr.bottom), vh: innerHeight };
    });
    if (r.over.some((o) => o > 2) || r.cardBottom > r.vh - 60) bad.push(`${r.name}: left+${r.over[0]} right+${r.over[1]} bottom=${r.cardBottom}/${r.vh}`);
    if (out && w === 1591 && i === 0) await p.screenshot({ path: `${out}/book-open.png` });
    await p.keyboard.press("ArrowRight");
    await p.waitForTimeout(700);
  }
  console.log(`${w}x${h}:`, bad.length ? "\n  " + bad.join("\n  ") : "all books fit");
  await p.close();
}
await b.close();
