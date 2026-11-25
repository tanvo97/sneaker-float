import { chromium } from "@playwright/test";
import { mkdir, rename, stat, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = "/workspace/web-studio/demos/sneaker-float-shots";
const base = process.env.BASE_URL ?? "http://127.0.0.1:3101";

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--disable-font-subpixel-positioning"],
});

async function withPage(viewport, fn, { reducedMotion = "reduce" } = {}) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    locale: "vi-VN",
    reducedMotion,
  });
  const page = await context.newPage();
  try {
    await fn(page);
  } finally {
    await context.close();
  }
}

await withPage({ width: 1440, height: 900 }, async (page) => {
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(1800);
  await page.screenshot({
    path: join(outDir, "gallery-desktop.png"),
    animations: "disabled",
  });
});

await withPage({ width: 1440, height: 900 }, async (page) => {
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const trace = page.getByRole('button', { name: /AURE TRACE\./ });
  await trace.hover({ force: true });
  await page.waitForTimeout(400);
  await page.screenshot({
    path: join(outDir, "gallery-desktop-selected.png"),
    animations: "disabled",
  });
});

await withPage({ width: 1440, height: 900 }, async (page) => {
  await page.goto(`${base}/product/trace`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({
    path: join(outDir, "product-desktop.png"),
    animations: "disabled",
  });
});

await withPage({ width: 390, height: 844 }, async (page) => {
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.screenshot({
    path: join(outDir, "gallery-mobile.png"),
    animations: "disabled",
  });
});

await withPage({ width: 390, height: 844 }, async (page) => {
  await page.goto(`${base}/product/trace`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({
    path: join(outDir, "product-mobile.png"),
    animations: "disabled",
  });
});

// Video: hover + click transition. Record with animations ON.
const videoDir = join(outDir, "_video-tmp");
await rm(videoDir, { recursive: true, force: true });
await mkdir(videoDir, { recursive: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  locale: "vi-VN",
  reducedMotion: "no-preference",
  recordVideo: { dir: videoDir, size: { width: 1440, height: 900 } },
});
const page = await context.newPage();
await page.goto(base, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
await page.getByRole('button', { name: /AURE 01\./ }).hover({ force: true });
await page.waitForTimeout(700);
await page.getByRole('button', { name: /AURE TRACE\./ }).hover({ force: true });
await page.waitForTimeout(700);
await page.getByRole('button', { name: /AURE VOID\./ }).hover({ force: true });
await page.waitForTimeout(600);
await page.getByRole('button', { name: /AURE SHIFT\./ }).hover({ force: true });
await page.waitForTimeout(500);
await page.getByRole('button', { name: /AURE SHIFT\./ }).click({ force: true });
await page.waitForTimeout(1800);
await page.getByRole("button", { name: "Quay lại cửa hàng" }).click({ force: true });
await page.waitForTimeout(1600);
await page.getByRole('button', { name: /AURE DRIFT\./ }).hover({ force: true });
await page.waitForTimeout(700);
await context.close();
await browser.close();

const { readdirSync } = await import("node:fs");
const videos = readdirSync(videoDir)
  .filter((f) => f.endsWith(".webm"))
  .map((f) => join(videoDir, f));
if (videos.length === 0) {
  console.warn("No video recorded");
  process.exit(0);
}
videos.sort();
const src = videos.at(-1);

const destMp4 = join(outDir, "hover-transition.mp4");
const result = spawnSync(
  "ffmpeg",
  [
    "-y",
    "-i",
    src,
    "-vf",
    "scale=1440:900",
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-an",
    "-crf",
    "23",
    destMp4,
  ],
  { stdio: "inherit" },
);
if (result.status !== 0) {
  const fallback = join(outDir, "hover-transition.webm");
  await rename(src, fallback);
  console.warn("ffmpeg failed, kept webm at", fallback);
} else {
  const info = await stat(destMp4);
  console.log("mp4 bytes", info.size);
}

console.log("done", outDir);
