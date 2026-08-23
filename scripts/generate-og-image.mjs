/**
 * Renders the social preview card at public/og-image.jpg (1200x630).
 *
 * The background is not a screenshot — it is the site's own hero shader
 * (src/components/FragmentShader.tsx) ported to CPU and evaluated per pixel, so
 * the card and the live page come from one source of truth. Change the palette
 * or the field constants there and re-run this to keep the two in step.
 *
 *   node scripts/generate-og-image.mjs [--time=<seconds>] [--out=<path>]
 *
 * --time picks the frame of the animation to freeze; it is the only knob worth
 * turning for a different-looking card.
 *
 * Text is composited by ffmpeg's drawtext (ffmpeg-static ships libfreetype), so
 * no headless browser or native canvas is involved.
 */
import { spawn } from "node:child_process";
import { mkdtempSync, copyFileSync, writeFileSync, rmSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const WIDTH = 1200;
const HEIGHT = 630;

// The four stops Hero resets the shader to when the page is at the top. This is
// the palette a visitor sees on the landing frame, so it is the one the card
// should wear.
const PALETTE = ["#19053d", "#2f7687", "#40aba2", "#6c6597"];

const WORDMARK = "EMILY APEL";
const SUBTITLE = "Immersive Experience Designer & Creative Technologist";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v = "true"] = a.replace(/^--/, "").split("=");
    return [k, v];
  })
);
const TIME = Number(args.time ?? 3.2);
const OUT = path.resolve(ROOT, args.out ?? "public/og-image.jpg");

/* ------------------------------------------------------------------ *
 * The shader, ported. Names and constants match the GLSL deliberately.
 * ------------------------------------------------------------------ */

const fract = (x) => x - Math.floor(x);

function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function rand(x, y) {
  return fract(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453);
}

const bound01 = (v) => v.map((c) => fract((c + 1) * 0.5) * 2 - 1);

function warpSineFeedback(px, py, t, mouse01) {
  const scale = 2.5;
  const freq = 2.5;
  const gain = 1.23;

  const phaseX = (mouse01 - 0.5) * Math.PI + 0.15 * Math.sin(t * 0.4);
  const phaseY = (mouse01 - 0.5) * Math.PI + 0.15 * Math.cos(t * 0.4);

  let x = (px + 3) * scale;
  let y = (py + 3) * scale;

  for (let i = 0; i < 3; i++) {
    // Both components read the pre-update vector — this is a vec2 op in GLSL,
    // and folding it into two sequential scalar updates changes the result.
    const cx = Math.cos(y * freq + t + phaseX) / 3;
    const cy = Math.cos(x * freq + 1.57 + phaseY) / 3;
    x += cx;
    y += cy;

    const sx = Math.sin(y + t + 1.57 - phaseY) / 2;
    const sy = Math.sin(x + t + 0.0 - phaseX) / 2;
    x += sx;
    y += sy;

    x *= gain;
    y *= gain;
  }

  return bound01([x, y]);
}

/* Three sets outputColorSpace = SRGBColorSpace and manages colour by default,
 * so uColor1..4 reach the shader linearised, the weighted blend happens in
 * linear light, and the framebuffer is encoded back to sRGB on the way out.
 * Blending the hex values directly would give visibly muddier midtones. */
const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const linearToSrgb = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

const hexToLinear = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => srgbToLinear(v / 255));
};

/* A shader frame is a poor typographic ground on its own: the bright teal lobes
 * wander, so white text is high-contrast in one crop and nearly gone in the
 * next. This darkens the middle band the type sits in and the outer edge, which
 * fixes the floor without flattening the image into a plain overlay. */
function scrimAt(u, v) {
  const band = 1 - 0.42 * Math.exp(-Math.pow((v - 0.52) / 0.3, 2));
  const dx = (u - 0.5) * 1.15;
  const dy = v - 0.5;
  const vignette = 1 - 0.3 * Math.min(1, Math.pow(Math.hypot(dx, dy) / 0.72, 2.2));
  return band * vignette;
}

function renderField() {
  const [c1, c2, c3, c4] = PALETTE.map(hexToLinear);
  const buf = Buffer.allocUnsafe(WIDTH * HEIGHT * 3);
  const aspect = WIDTH / HEIGHT;
  const mouse01 = 0.5; // uMouse rests at centre; mix(0.5, uMouse, 0.2) is 0.5.

  for (let row = 0; row < HEIGHT; row++) {
    // vUv counts up from the bottom of the canvas, image rows count down.
    const v = 1 - (row + 0.5) / HEIGHT;

    for (let col = 0; col < WIDTH; col++) {
      const u = (col + 0.5) / WIDTH;

      const px = ((u - 0.5) * aspect) / 7.0; // 7.0 is the shader's hardcoded zoom
      const py = (v - 0.5) / 7.0;

      const w = warpSineFeedback(px, py, TIME, mouse01);

      let field = Math.hypot(w[0], w[1]) / 1.41421356;
      field = smoothstep(0.12, 0.95, field);

      const blend = 0.15;
      const k1 = smoothstep(0.28 - blend, 0.28 + blend, field);
      const k2 = smoothstep(0.58 - blend, 0.58 + blend, field);
      const k3 = smoothstep(0.82 - blend, 0.82 + blend, field);

      const w1 = 1 - k1;
      const w2 = k1 * (1 - k2);
      const w3 = k2 * (1 - k3);
      const w4 = k3;

      const grain = (rand(u * WIDTH, v * HEIGHT) - 0.5) * 0.08;
      const scrim = scrimAt(u, v);

      const i = (row * WIDTH + col) * 3;
      for (let ch = 0; ch < 3; ch++) {
        const lin = c1[ch] * w1 + c2[ch] * w2 + c3[ch] * w3 + c4[ch] * w4 + grain;
        const out = linearToSrgb(Math.min(1, Math.max(0, lin))) * scrim;
        buf[i + ch] = Math.round(Math.min(255, Math.max(0, out * 255)));
      }
    }
  }

  return buf;
}

/* drawtext has no tracking control, so the spacing is baked into the string.
 * Aetherin's space is narrow enough that one per gap reads as roughly the
 * 0.2em the hero sets in CSS. */
const track = (s, gap = " ") => s.split("").join(gap).replace(/ {3}/g, gap.repeat(4));

async function main() {
  const work = mkdtempSync(path.join(tmpdir(), "og-"));
  try {
    copyFileSync(path.join(ROOT, "src/fonts/Aetherin.otf"), path.join(work, "display.otf"));
    copyFileSync(
      path.join(ROOT, "scripts/assets/SpaceGrotesk-Regular.ttf"),
      path.join(work, "sans.ttf")
    );

    // Passed as files, not filter arguments: it keeps ffmpeg's escaping rules
    // (and Windows drive colons) out of the picture entirely.
    writeFileSync(path.join(work, "wordmark.txt"), track(WORDMARK), "utf8");
    writeFileSync(path.join(work, "subtitle.txt"), SUBTITLE, "utf8");

    // No URL on the card. Every surface that renders it already prints the
    // domain in its own chrome underneath, so putting it in the artwork only
    // duplicates it — and hardcodes a host into a binary that has to be
    // re-rendered if the domain ever changes.
    const filters = [
      "drawtext=fontfile=display.otf:textfile=wordmark.txt:fontcolor=white:fontsize=96:x=(w-text_w)/2:y=232",
      "drawtext=fontfile=sans.ttf:textfile=subtitle.txt:fontcolor=white@0.9:fontsize=28:x=(w-text_w)/2:y=372",
    ].join(",");

    mkdirSync(path.dirname(OUT), { recursive: true });

    const ff = spawn(
      ffmpegPath,
      [
        "-y", "-hide_banner", "-loglevel", "error",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", `${WIDTH}x${HEIGHT}`, "-i", "pipe:0",
        "-vf", filters,
        // q:v 4 rather than 2. The shader's grain is real per-pixel noise, which
        // is the most expensive thing a JPEG can be asked to hold; at 2 it tripled
        // the file for detail no one sees in a 600px-wide card.
        "-frames:v", "1", "-q:v", "4",
        OUT,
      ],
      { cwd: work, stdio: ["pipe", "inherit", "inherit"] }
    );

    const done = new Promise((resolve, reject) => {
      ff.on("error", reject);
      ff.on("close", (code) =>
        code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))
      );
    });

    ff.stdin.end(renderField());
    await done;
    console.log(`og image → ${path.relative(ROOT, OUT)} (${WIDTH}x${HEIGHT}, t=${TIME})`);
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
