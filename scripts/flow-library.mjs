// Library interaction check: hover a book, open it, flip, close; open a record.
// usage: node scripts/flow-library.mjs <baseUrl> <outDir> [width] [height]
import { chromium } from "playwright";

const [base, out, w = "1440", h = "900"] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(w), height: Number(h) } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await page.goto(base + "/#library", { waitUntil: "networkidle" });
await page.locator("#library").scrollIntoViewIfNeeded();
await page.waitForTimeout(900);

const book = page.getByRole("button", { name: /LawzyAI/ });
await book.scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await book.hover();
await page.waitForTimeout(700);
await page.screenshot({ path: `${out}/lib-hover.png` });

await book.click();
await page.waitForTimeout(500);
await page.screenshot({ path: `${out}/lib-book-opening.png` });
await page.waitForTimeout(1300);
await page.screenshot({ path: `${out}/lib-book-open.png` });
await page.keyboard.press("ArrowRight");
await page.waitForTimeout(800);
await page.screenshot({ path: `${out}/lib-book-next.png` });
await page.keyboard.press("Escape");
await page.waitForTimeout(500);

const rec = page.getByRole("button", { name: /Spotify India/ });
await rec.scrollIntoViewIfNeeded();
await rec.hover();
await page.waitForTimeout(700);
await page.screenshot({ path: `${out}/lib-record-hover.png` });
await rec.click();
await page.waitForTimeout(1500);
await page.screenshot({ path: `${out}/lib-record-open.png` });
await page.keyboard.press("Escape");

if (errors.length) console.log("ERRORS:\n" + errors.join("\n"));
await browser.close();
console.log("done");
