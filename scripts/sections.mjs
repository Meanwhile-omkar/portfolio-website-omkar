// Capture each section as its own viewport-sized crop, at the given width.
// usage: node scripts/sections.mjs <url> <outDir> <width> <height> [prefix]
import { chromium } from "playwright";
const [url, out, w, h, prefix = "s"] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(w), height: Number(h) } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 300)));
await page.goto(url, { waitUntil: "networkidle" });
for (const id of ["top", "about", "education", "experience", "library", "toolbox", "wins", "campus", "hobbies", "contact"]) {
  await page.evaluate((i) => document.getElementById(i)?.scrollIntoView({ block: "start" }), id);
  await page.waitForTimeout(1300);
  await page.screenshot({ path: `${out}/${prefix}-${id}.png` });
}
if (errors.length) console.log("ERRORS:\n" + [...new Set(errors)].join("\n"));
await browser.close();
console.log("done");
