// Experience Club check: knock, enter, step through every company (wheel, keys, button), exit.
// usage: node scripts/flow-club.mjs <baseUrl> <outDir> [width] [height] [--reduce]
import { chromium } from "playwright";

const [base, out, w = "1440", h = "900", ...flags] = process.argv.slice(2);
const tag = `${w}x${h}${flags.includes("--reduce") ? "-reduce" : ""}`;
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: Number(w), height: Number(h) },
  reducedMotion: flags.includes("--reduce") ? "reduce" : "no-preference",
  hasTouch: Number(w) < 900,
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await page.goto(base + "/", { waitUntil: "networkidle" });

const door = page.getByRole("button", { name: /Knock on the door/ });
await door.scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
await page.screenshot({ path: `${out}/club-door-${tag}.png` });
await door.click();
await page.waitForTimeout(450);
await page.screenshot({ path: `${out}/club-knock-${tag}.png` });
await page.waitForTimeout(1100);
await page.screenshot({ path: `${out}/club-opening-${tag}.png` });
await page.waitForTimeout(2600);
await page.screenshot({ path: `${out}/club-0-${tag}.png` });

// 1: wheel, 2: keyboard, 3: next button, 4: keyboard
await page.mouse.move(Number(w) / 2, Number(h) / 2);
await page.mouse.wheel(0, 120);
await page.waitForTimeout(450);
await page.screenshot({ path: `${out}/club-wipe-${tag}.png` });
await page.waitForTimeout(2400);
await page.screenshot({ path: `${out}/club-1-${tag}.png` });
await page.keyboard.press("ArrowDown");
await page.waitForTimeout(2800);
await page.screenshot({ path: `${out}/club-2-${tag}.png` });
await page.getByRole("button", { name: /^next:/ }).click();
await page.waitForTimeout(2800);
await page.screenshot({ path: `${out}/club-3-${tag}.png` });
await page.keyboard.press("ArrowDown");
await page.waitForTimeout(2800);
await page.screenshot({ path: `${out}/club-4-${tag}.png` });
const current = await page.locator('[aria-current="step"]').getAttribute("class").catch(() => null);
await page.keyboard.press("Escape");
await page.waitForTimeout(900);
const stillOpen = await page.locator('[aria-label="The experience club"]').count();
console.log("rail current found:", current !== null, "| overlay after Esc:", stillOpen);
if (errors.length) console.log("ERRORS:\n" + [...new Set(errors)].join("\n").slice(0, 3000));
await browser.close();
console.log("done", tag);
