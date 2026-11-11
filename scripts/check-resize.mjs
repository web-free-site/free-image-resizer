import { chromium } from "playwright";
import fs from "fs";

const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mP8z8BQz0AEYBxVSF+FABJADveWkH6aAAAAAElFTkSuQmCC",
  "base64",
);
fs.writeFileSync("/tmp/tiny.png", png);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto("https://free-image-resizer.gentillenoir075.workers.dev/en/resize-image/");
await page.setInputFiles("#fir-image-upload", "/tmp/tiny.png");
await page.fill("#fir-width", "5");
await page.click('button:has-text("Apply")');
await page.waitForSelector('a:has-text("Download")', { timeout: 120000 });
const nativeHits = [];
page.on("response", (r) => {
  if (r.url().includes("pl32315563")) nativeHits.push(r.status());
});
await page.waitForTimeout(3000);
const hasNativeContainer = (await page.locator("#container-4dd8ed256da14cb9419ff27bbbabc1b4").count()) > 0;
console.log(JSON.stringify({ download: true, hasNativeContainer, nativeHits }));
await browser.close();
