// Contact sheet of extracted stickers with their index numbers, for picking.
// usage: node scripts/sticker-sheet.mjs <dir> <out.png>
import { chromium } from "playwright";
import { readdirSync, writeFileSync } from "fs";
const [dir, out] = process.argv.slice(2);
const files = readdirSync(dir).filter((f) => f.endsWith(".webp")).sort();
const html = `<body style="margin:0;padding:10px;display:flex;flex-wrap:wrap;gap:10px;background:repeating-conic-gradient(#e6e6e6 0 25%,#fff 0 50%) 0 0/16px 16px;font:bold 14px sans-serif">${files
  .map((f) => `<div style="text-align:center"><img src="file:///${dir}/${f}" style="height:150px;max-width:230px;object-fit:contain;display:block"><span>${f.replace(".webp", "")}</span></div>`)
  .join("")}</body>`;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 600 } });
// file:// images only load from a file:// page, not from setContent's about:blank
writeFileSync(`${dir}/_sheet.html`, html);
await p.goto(`file:///${dir}/_sheet.html`);
await p.waitForTimeout(800);
await p.screenshot({ path: out, fullPage: true });
await b.close();
