import { chromium } from "playwright";

const url = "https://free-image-resizer.web-free.site/en/resize-image/";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const hits = [];
page.on("response", (res) => {
  const u = res.url();
  if (u.includes("highrevenueformat") || u.includes("profitableratecpmnetwork")) {
    hits.push({ u: u.slice(0, 90), status: res.status() });
  }
});

await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(4000);

const slots = await page.$$eval("[data-ad-slot]", (els) =>
  els.map((el) => ({
    slot: el.getAttribute("data-ad-slot"),
    iframes: el.querySelectorAll("iframe").length,
    hasContainer: Boolean(el.querySelector("[id^=container-]")),
  })),
);

const sponsored = await page.getByRole("link", { name: "Sponsored" }).count();
const scriptsInHtml = await page.content();
const hasPop = scriptsInHtml.includes("pl32319838");
const hasSocial = scriptsInHtml.includes("pl32319927");

console.log(JSON.stringify({ hits, slots, sponsored, hasPop, hasSocial, hitCount: hits.length }, null, 2));

await browser.close();
