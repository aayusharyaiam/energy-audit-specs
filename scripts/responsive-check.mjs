import { chromium } from "playwright-core";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const viewports = [
  { width: 320, height: 760 },
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1024, height: 900 },
  { width: 1440, height: 1000 },
];

const browser = await chromium.launch({ channel: "msedge", headless: true });
const failures = [];

async function inspect(page, label, viewport) {
  await page.waitForTimeout(250);
  const result = await page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    const offenders = [...document.body.querySelectorAll("*")]
      .filter((element) => {
        if (element.closest("details:not([open])")) return false;
        const style = window.getComputedStyle(element);
        if (style.display === "none" || style.visibility === "hidden") return false;
        const rect = element.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return false;
        return rect.left < -1 || rect.right > viewportWidth + 1;
      })
      .slice(0, 10)
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          element: `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ""}${
            element.classList.length ? `.${[...element.classList].slice(0, 3).join(".")}` : ""
          }`,
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        };
      });

    return {
      clientWidth: viewportWidth,
      scrollWidth: document.documentElement.scrollWidth,
      offenders,
    };
  });

  const overflow = result.scrollWidth > result.clientWidth || result.offenders.length > 0;
  const status = overflow ? "FAIL" : "PASS";
  console.log(`${status} ${label} @ ${viewport.width}px`, result);
  if (overflow) failures.push({ label, viewport, ...result });
}

async function inspectScrollToTop(page, viewport) {
  await page.evaluate(() => window.scrollTo({ top: 900, behavior: "auto" }));
  const button = page.getByRole("button", { name: "Scroll back to top" });
  await button.waitFor({ state: "visible" });
  await button.click();
  await page.waitForTimeout(50);
  const scrollY = await page.evaluate(() => window.scrollY);
  const passed = scrollY === 0;
  console.log(`${passed ? "PASS" : "FAIL"} scroll-to-top @ ${viewport.width}px`, { scrollY });
  if (!passed) failures.push({ label: "scroll-to-top", viewport, scrollY });
}

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  await page.emulateMedia({ reducedMotion: "reduce" });

  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await inspect(page, "public", viewport);
  if (viewport.width === 375) await inspectScrollToTop(page, viewport);

  await page.goto(`${baseUrl}/admin`, { waitUntil: "networkidle" });
  await inspect(page, "admin login", viewport);

  await page.getByRole("button", { name: "Preview editor interface" }).click();
  await inspect(page, "admin workspace", viewport);

  await page.getByRole("tab", { name: /History/ }).click();
  await inspect(page, "admin history", viewport);

  await context.close();
}

await browser.close();

if (failures.length > 0) {
  console.error(`\nResponsive audit found ${failures.length} overflow case(s).`);
  process.exit(1);
}

console.log("\nResponsive audit passed at all tested widths.");
