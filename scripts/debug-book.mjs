import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3100/", { waitUntil: "networkidle" });
const book = page.getByRole("button", { name: /LawzyAI/ });
await book.scrollIntoViewIfNeeded();
await book.click();
for (const t of [100, 300, 600, 900, 1400]) {
  await page.waitForTimeout(t === 100 ? 100 : 300);
  const info = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    const cover = d?.querySelector(".origin-left");
    return { dialog: !!d, cover: !!cover, coverTransform: cover ? getComputedStyle(cover).transform : null };
  });
  console.log(t, JSON.stringify(info));
}
await browser.close();
