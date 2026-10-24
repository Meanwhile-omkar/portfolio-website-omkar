// Opens every record and reports text that overflows, at several laptop sizes.
// usage: node scripts/check-records.mjs <baseUrl> [outDir]
import { chromium } from "playwright";
const [base, out] = process.argv.slice(2);
const sizes = [[1591, 870], [1440, 900], [1366, 768], [1280, 720]];
const b = await chromium.launch();
for (const [w, h] of sizes) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto(base + "/", { waitUntil: "networkidle" });
  const first = p.getByRole("button", { name: /Spotify India/ });
  await first.scrollIntoViewIfNeeded();
  await first.click();
  await p.waitForTimeout(2000);
  const bad = [];
  for (let i = 0; i < 9; i++) {
    const r = await p.evaluate(() => {
      const card = document.querySelector('[role="dialog"] .grid');
      const cols = [...card.children];
      const cr = card.getBoundingClientRect();
      return { name: card.querySelector("h3")?.textContent, over: cols.map((c) => c.scrollHeight - c.clientHeight), bottom: Math.round(cr.bottom), top: Math.round(cr.top), vh: innerHeight };
    });
    if (r.over.some((o) => o > 2) || r.bottom > r.vh - 60 || r.top < 0) bad.push(`${r.name}: left+${r.over[0]} right+${r.over[1]} top=${r.top} bottom=${r.bottom}/${r.vh}`);
    if (out && w === 1591 && i === 0) await p.screenshot({ path: `${out}/record-spotify.png` });
    await p.keyboard.press("ArrowRight");
    await p.waitForTimeout(1600);
  }
  console.log(`${w}x${h}:`, bad.length ? "\n  " + bad.join("\n  ") : "all records fit");
  await p.close();
}
await b.close();
