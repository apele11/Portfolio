/**
 * Full-page stills of a running site, straight into the asset drop zone.
 *
 *   npm run capture -- <url> <Project>/<name>
 *
 * Writes public/assets/<Project>/<name>.png, which is exactly where
 * `npm run assets` expects to find it — so the pipeline for a new case-study
 * still is two commands:
 *
 *   npm run capture -- http://localhost:3000 PinkAhead/PinkAhead-Landing-Full
 *   npm run assets
 *
 * Drives the Chrome already installed on this machine through puppeteer-core,
 * so nothing downloads a second browser. Set CHROME_PATH if yours lives
 * somewhere unusual.
 *
 * The viewport is deliberately a normal 1440x900 rather than the height of the
 * page. Source pages routinely build sections on `min-height: 100dvh`, and a
 * page-tall window makes the first section swell to fill it while everything
 * below falls off the bottom of the capture. The page is scrolled through once
 * instead, so lazy images and IO-gated sections resolve, and the full height is
 * taken with `captureBeyondViewport`.
 *
 * A tall result belongs in <ScrollFigure>, not <Figure>.
 *
 * Usage:
 *   npm run capture -- <url> <Project>/<name>
 *   npm run capture -- <url> <Project>/<name> --width=1280
 *   npm run capture -- <url> <Project>/<name> --mobile      390x844 at 3x
 *   npm run capture -- <url> <Project>/<name> --viewport    first screen only
 *   npm run capture -- <url> <Project>/<name> --wait=2000   extra settle time
 *   npm run capture -- <url> <Project>/<name> --raw         no overlay/motion CSS
 */

import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DROP = path.join(ROOT, "public", "assets");

/** Desktop capture geometry. Matches the width the case-study figures assume. */
const DESKTOP = { width: 1440, height: 900, scale: 2 };
const MOBILE = { width: 390, height: 844, scale: 3 };

/** Ceiling on the wait for fonts and in-flight images. See the call site. */
const MEDIA_BUDGET_MS = 8000;

/** Where Chrome usually is. CHROME_PATH wins over all of them. */
const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  `${process.env.LOCALAPPDATA ?? ""}/Google/Chrome/Application/chrome.exe`,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

const args = process.argv.slice(2);
const flags = args.filter((a) => a.startsWith("--"));
const positional = args.filter((a) => !a.startsWith("--"));

const has = (name) => flags.includes(`--${name}`);
const value = (name, fallback) => {
  const hit = flags.find((f) => f.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};

const [url, target] = positional;

function usage(message) {
  console.error(`${message}\n`);
  console.error("  npm run capture -- <url> <Project>/<name>");
  console.error("  npm run capture -- http://localhost:3000 PinkAhead/PinkAhead-Landing-Full\n");
  console.error("Flags: --width= --height= --scale= --mobile --viewport --wait= --raw");
  process.exit(1);
}

if (!url || !target) usage("Need a url and a <Project>/<name> destination.");
if (!/^https?:\/\//.test(url)) usage(`Not a url: ${url}`);

const parts = target.split(/[\\/]/).filter(Boolean);
if (parts.length !== 2) {
  usage(`Destination must be <Project>/<name>, got: ${target}`);
}
const [project, rawName] = parts;
const name = rawName.replace(/\.(png|webp|jpe?g)$/i, "");
if (/\s/.test(project) || /\s/.test(name)) {
  usage("Avoid spaces in project or file names — they have to be URL-encoded at every reference.");
}

const base = has("mobile") ? MOBILE : DESKTOP;
const width = Number(value("width", base.width));
const height = Number(value("height", base.height));
const scale = Number(value("scale", base.scale));
const settle = Number(value("wait", 0));

for (const [label, n] of [["width", width], ["height", height], ["scale", scale], ["wait", settle]]) {
  if (!Number.isFinite(n) || n <= 0) {
    if (!(label === "wait" && n === 0)) usage(`--${label} must be a positive number.`);
  }
}

const chrome = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chrome) {
  console.error("Could not find Chrome. Set CHROME_PATH to the executable, e.g.\n");
  console.error('  CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe" npm run capture -- ...');
  process.exit(1);
}

let puppeteer;
try {
  puppeteer = (await import("puppeteer-core")).default;
} catch {
  console.error("puppeteer-core is not installed. Run:\n\n  npm install -D puppeteer-core");
  process.exit(1);
}

const outDir = path.join(DROP, project);
const outFile = path.join(outDir, `${name}.png`);
await mkdir(outDir, { recursive: true });

/**
 * Hide the dev-server furniture that is not part of the design, and freeze
 * motion so a still never lands mid-transition. Skipped under --raw.
 */
const QUIET_CSS = `
  nextjs-portal,
  #__next-build-watcher,
  [data-nextjs-toast],
  [data-next-badge-root],
  [data-nextjs-dev-tools-button],
  vite-error-overlay,
  #vite-error-overlay { display: none !important; }
  *, *::before, *::after {
    animation-play-state: paused !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
`;

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: "new",
  defaultViewport: { width, height, deviceScaleFactor: scale, isMobile: has("mobile"), hasTouch: has("mobile") },
  args: [`--force-device-scale-factor=${scale}`, "--hide-scrollbars"],
  // A very tall page can take a while to serialise; the default 180s is
  // generous but the screenshot is the one call that can legitimately approach it.
  protocolTimeout: 300000,
});

try {
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
  } catch (err) {
    throw new Error(`Could not load ${url} — is the dev server running?\n${err.message}`);
  }

  if (!has("raw")) await page.addStyleTag({ content: QUIET_CSS });

  // Walk the page so lazy <img>s and anything gated on an IntersectionObserver
  // actually render, then come back to the top before capturing.
  if (!has("viewport")) {
    await page.evaluate(async () => {
      const step = window.innerHeight;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 220));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 400));
    });
  }

  // Webfonts and any image still in flight, or the capture catches fallback
  // metrics and half-painted media.
  //
  // Bounded, because waiting on every image outright deadlocks: a lazy image
  // below the fold never starts loading until something scrolls to it, so under
  // --viewport (which skips the scroll pass) `complete` stays false forever and
  // neither load nor error ever fires.
  await page.evaluate(async (budget) => {
    const settled = Promise.all([
      document.fonts.ready,
      ...[...document.images]
        .filter((img) => !img.complete)
        .map((img) => new Promise((resolve) => { img.onload = img.onerror = resolve; })),
    ]);
    await Promise.race([settled, new Promise((resolve) => setTimeout(resolve, budget))]);
  }, MEDIA_BUDGET_MS);

  if (settle > 0) await new Promise((r) => setTimeout(r, settle));

  const page_ = await page.evaluate(() => ({
    w: document.documentElement.scrollWidth,
    h: document.documentElement.scrollHeight,
  }));

  await page.screenshot({
    path: outFile,
    fullPage: !has("viewport"),
    captureBeyondViewport: !has("viewport"),
  });

  const shot = has("viewport") ? { w: width, h: height } : page_;
  console.log("");
  console.log(`  ${url}`);
  console.log(`  ${shot.w} x ${shot.h} css px  ->  ${shot.w * scale} x ${shot.h * scale} px`);
  console.log(`  ${path.relative(ROOT, outFile).replace(/\\/g, "/")}`);
  console.log("");
  console.log("Run `npm run assets` to compress it into public/assets/compressed/.");
  if (!has("viewport") && shot.h > shot.w * 1.6) {
    console.log("Tall capture — reach for <ScrollFigure> rather than <Figure>.");
  }
} finally {
  await browser.close();
}
