/**
 * One-shot asset pipeline.
 *
 *   public/assets/<Project>/…            <- drop a project's raw files here
 *   public/assets/compressed/<Project>/  <- web-ready output. committed + deployed
 *
 * Drop a project's assets under public/assets/<Project>/ (nest them however you
 * like), run `npm run assets`, and each file is compressed into
 * compressed/<Project>/ and then removed from the drop zone. The project folder
 * is preserved; any nesting below it is flattened.
 *
 * Only compressed/ is tracked by git, so originals never reach the repo or the
 * deploy even if a run is interrupted.
 *
 * Images become WebP, videos become H.264 MP4 with audio dropped (every clip on
 * the site is muted) and +faststart so playback starts before the download
 * finishes. Files already lean enough are moved rather than re-encoded, so
 * running twice never degrades anything.
 *
 * Usage:
 *   npm run assets                  compress, then delete what was compressed
 *   npm run assets -- --dry         show the plan, touch nothing
 *   npm run assets -- --keep        compress but leave the originals in place
 *   npm run assets -- --force       replace files already in compressed/
 *   npm run assets -- --only=Bliss  limit to paths matching a substring
 */

import { execFile } from "node:child_process";
import { mkdir, readdir, stat, copyFile, unlink, rmdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import ffmpeg from "ffmpeg-static";

const run = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const DROP = path.join(ROOT, "public", "assets");
const OUT = path.join(DROP, "compressed");

/** Tune these; everything else follows. */
const IMAGE = { maxWidth: 1800, quality: 86 };
const VIDEO = { maxWidth: 1440, crf: 24, preset: "slow" };
/** A video already at or under this bitrate is moved, not re-encoded. */
const VIDEO_PASSTHROUGH_KBPS = 2600;

const IMAGE_IN = new Set([".png", ".jpg", ".jpeg", ".tif", ".tiff", ".bmp"]);
/**
 * .gif is here on purpose: a UI screen recording as a GIF runs 20-40x the size
 * of the same clip as H.264. Converting means the markup needs <video> rather
 * than <img> — use <CoverMedia>, which handles muted looping playback and pauses
 * off screen.
 */
const VIDEO_IN = new Set([".mp4", ".mov", ".m4v", ".webm", ".avi", ".mkv", ".gif"]);
/** Already web-ready, or lossless by intent — moved untouched. */
const MOVE_AS_IS = new Set([".webp", ".svg", ".avif", ".json", ".html", ".pdf", ".txt"]);

const args = process.argv.slice(2);
const dry = args.includes("--dry");
const keep = args.includes("--keep");
const force = args.includes("--force");
const only = args.find((a) => a.startsWith("--only="))?.slice("--only=".length) ?? "";

const fmt = (b) => `${(b / 1048576).toFixed(2)} MB`;

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (full === OUT) continue; // never treat output as input
    if (e.isDirectory()) out.push(...(await walk(full)));
    else if (!e.name.startsWith(".")) out.push(full);
  }
  return out;
}

/** Read width and bitrate off a video without needing a separate ffprobe binary. */
async function probe(file) {
  let text = "";
  try {
    await run(ffmpeg, ["-hide_banner", "-i", file]);
  } catch (err) {
    text = err.stderr ?? "";
  }
  const kbps = Number(text.match(/bitrate:\s*(\d+)\s*kb\/s/)?.[1] ?? 0);
  const dims = text.match(/Video:.*?,\s*(\d{2,5})x(\d{2,5})/);
  return { kbps, width: Number(dims?.[1] ?? 0) };
}

async function encodeImage(src, dest) {
  await run(ffmpeg, [
    "-y", "-hide_banner", "-loglevel", "error",
    "-i", src,
    // Downscale only when oversized; -1 keeps the aspect ratio.
    "-vf", `scale='min(${IMAGE.maxWidth},iw)':-1:flags=lanczos`,
    "-c:v", "libwebp",
    "-quality", String(IMAGE.quality),
    "-compression_level", "6",
    dest,
  ]);
}

async function encodeVideo(src, dest) {
  await run(ffmpeg, [
    "-y", "-hide_banner", "-loglevel", "error",
    "-i", src,
    // -2 forces an even height, which H.264 requires.
    "-vf", `scale='min(${VIDEO.maxWidth},iw)':-2:flags=lanczos`,
    "-c:v", "libx264",
    "-profile:v", "high",
    "-pix_fmt", "yuv420p",
    "-crf", String(VIDEO.crf),
    "-preset", VIDEO.preset,
    "-g", "60",
    "-an",
    "-movflags", "+faststart",
    dest,
  ]);
}

/** Remove directories left empty once their files have moved into compressed/. */
async function pruneEmptyDirs(dir) {
  if (dir === DROP || dir === OUT) return;
  try {
    const entries = await readdir(dir);
    if (entries.length > 0) return;
    await rmdir(dir);
    await pruneEmptyDirs(path.dirname(dir));
  } catch {
    /* already gone, or not empty */
  }
}

async function main() {
  const files = (await walk(DROP)).filter((f) => !only || f.includes(only));

  if (files.length === 0) {
    console.log(`Nothing to do. Drop a project's files into ${path.relative(ROOT, DROP)}/<Project>/ and re-run.`);
    return;
  }

  // Resolve every destination before touching anything: a name clash inside a
  // project should stop the run, not surface halfway through a migration.
  const jobs = [];
  const claimed = new Map();
  const collisions = [];
  const looseFiles = [];

  for (const src of files) {
    const rel = path.relative(DROP, src);
    const segments = rel.split(path.sep);

    // Everything must live under a project folder — that folder is what keeps
    // same-named files from different projects apart.
    if (segments.length < 2) {
      looseFiles.push(rel);
      continue;
    }

    const project = segments[0];
    const ext = path.extname(src).toLowerCase();
    const stem = path.basename(src, path.extname(src));
    let kind;
    let outName;

    if (IMAGE_IN.has(ext)) [kind, outName] = ["image", `${stem}.webp`];
    else if (VIDEO_IN.has(ext)) [kind, outName] = ["video", `${stem}.mp4`];
    else if (MOVE_AS_IS.has(ext)) [kind, outName] = ["move", path.basename(src)];
    else {
      console.warn(`  ! unrecognised type, left in place: ${rel}`);
      continue;
    }

    const dest = path.join(OUT, project, outName);
    const prev = claimed.get(dest);
    if (prev) collisions.push([prev, src, path.join(project, outName)]);
    claimed.set(dest, src);
    jobs.push({ src, kind, dest, project, outName });
  }

  if (looseFiles.length > 0) {
    console.error("These sit directly in public/assets/ with no project folder:\n");
    for (const f of looseFiles) console.error(`  ${f}`);
    console.error("\nMove each into public/assets/<Project>/ and re-run. Nothing was changed.");
    process.exitCode = 1;
    return;
  }

  if (collisions.length > 0) {
    console.error("Name collisions — these would overwrite each other:\n");
    for (const [a, b, name] of collisions) {
      console.error(`  compressed/${name}`);
      console.error(`    ${path.relative(DROP, a)}`);
      console.error(`    ${path.relative(DROP, b)}`);
    }
    console.error("\nRename one of each pair and re-run. Nothing was changed.");
    process.exitCode = 1;
    return;
  }

  let totalIn = 0;
  let totalOut = 0;
  let done = 0;
  let deleted = 0;
  const conflicts = [];

  for (const job of jobs) {
    const label = path.relative(DROP, job.src);

    if (existsSync(job.dest) && !force) {
      conflicts.push(path.join(job.project, job.outName));
      continue;
    }

    const srcSize = (await stat(job.src)).size;
    let { kind } = job;

    // Re-encoding an already-lean video only loses quality — move it instead.
    // GIFs are excluded: the container genuinely changes, so copying the bytes
    // under an .mp4 name would produce a file nothing can play.
    if (kind === "video" && path.extname(job.src).toLowerCase() !== ".gif") {
      const { kbps, width } = await probe(job.src);
      if (kbps > 0 && kbps <= VIDEO_PASSTHROUGH_KBPS && width <= VIDEO.maxWidth) {
        kind = "move";
      }
    }

    if (dry) {
      console.log(`  would ${kind.padEnd(5)} ${label}  ->  compressed/${job.project}/${job.outName}`);
      totalIn += srcSize;
      done++;
      continue;
    }

    await mkdir(path.dirname(job.dest), { recursive: true });
    if (kind === "image") await encodeImage(job.src, job.dest);
    else if (kind === "video") await encodeVideo(job.src, job.dest);
    else await copyFile(job.src, job.dest);

    // Only give up the original once the result is on disk and non-empty.
    const destSize = existsSync(job.dest) ? (await stat(job.dest)).size : 0;
    if (destSize === 0) {
      console.error(`  ! produced nothing for ${label} — original kept`);
      continue;
    }

    totalIn += srcSize;
    totalOut += destSize;
    done++;

    if (!keep) {
      await unlink(job.src);
      await pruneEmptyDirs(path.dirname(job.src));
      deleted++;
    }

    const pct = ((100 * destSize) / srcSize).toFixed(0);
    const note = kind === "move" ? "  (moved, already lean)" : "";
    console.log(
      `  ${label.padEnd(40)} ${fmt(srcSize).padStart(9)} -> ${fmt(destSize).padStart(9)}  ${pct.padStart(3)}%${note}`
    );
  }

  console.log("");
  if (dry) {
    console.log(`${done} file(s) would be processed.${keep ? "" : " Originals would then be deleted."}`);
  } else if (done > 0) {
    console.log(`${done} file(s): ${fmt(totalIn)} -> ${fmt(totalOut)}  (saved ${fmt(totalIn - totalOut)})`);
    if (deleted > 0) console.log(`${deleted} original(s) removed from the drop zone.`);
    if (keep) console.log("Originals kept (--keep).");
  }

  if (conflicts.length > 0) {
    console.log(`\nAlready in compressed/, skipped (originals kept):`);
    for (const c of conflicts) console.log(`  ${c}`);
    console.log("Use --force to replace them.");
  }
}

main().catch((err) => {
  console.error(err.stderr || err.message);
  process.exitCode = 1;
});
