// Quick screenshot helper for visual checks.
// usage: node scripts/shot.mjs <url> <out.png> [width] [height] [--full] [--reduce] [--wait=ms]
import { chromium } from "playwright";

const [url, out, w = "1440", h = "900", ...flags] = process.argv.slice(2);
const full = flags.includes("--full");
const reduce = flags.includes("--reduce");
const wait = Number((flags.find((f) => f.startsWith("--wait=")) || "--wait=1200").split("=")[1]);

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: Number(w), height: Number(h) },
  deviceScaleFactor: 1,
  reducedMotion: reduce ? "reduce" : "no-preference",
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await page.goto(url, { waitUntil: "networkidle" });
if (full) {
  // Scroll through once so in-view animations fire before the full-page capture.
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 500) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
}
await page.waitForTimeout(wait);
await page.screenshot({ path: out, fullPage: full });
if (errors.length) console.log("ERRORS:\n" + errors.join("\n"));
await browser.close();
console.log("saved", out);
