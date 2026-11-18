/**
 * Convert PNG/JPEG images in public/imags and public/logos to WebP format.
 * Run: node scripts/convert-images.mjs [--dir imags/properties] [--delete-originals]
 */
import sharp from "sharp";
import { readdirSync, statSync, unlinkSync, existsSync } from "node:fs";
import { join, extname, basename, dirname, relative, resolve, sep } from "node:path";

const PUBLIC_DIR = join(import.meta.dirname, "..", "public");
const QUALITY = 80;
const args = process.argv.slice(2);
const directoryIndex = args.indexOf("--dir");
const requestedDirectory =
  directoryIndex >= 0 ? args[directoryIndex + 1] : null;
const deleteOriginals = args.includes("--delete-originals");

function isInsidePublic(directory) {
  const path = resolve(PUBLIC_DIR, directory);
  const relativePath = relative(PUBLIC_DIR, path);
  return (
    relativePath !== "" &&
    relativePath !== ".." &&
    !relativePath.startsWith(`..${sep}`) &&
    resolve(path).startsWith(`${resolve(PUBLIC_DIR)}${sep}`)
  );
}

if (directoryIndex >= 0 && !requestedDirectory) {
  throw new Error("پس از --dir یک مسیر داخل public وارد کنید.");
}

if (requestedDirectory && !isInsidePublic(requestedDirectory)) {
  throw new Error("مسیر ورودی باید داخل پوشه public باشد.");
}

const DIRS = requestedDirectory ? [requestedDirectory] : ["imags", "logos"];

function walk(dir) {
  const entries = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      entries.push(...walk(full));
    } else if (/\.(png|jpe?g)$/i.test(name)) {
      entries.push(full);
    }
  }
  return entries;
}

let converted = 0;
let skipped = 0;
let failed = 0;

function removeSource(file) {
  try {
    unlinkSync(file);
    console.log(`Removed source: ${file}`);
  } catch (err) {
    failed++;
    console.error(`Converted output exists, but source could not be removed ${file}:`, err.message);
  }
}

for (const sub of DIRS) {
  const root = join(PUBLIC_DIR, sub);
  if (!existsSync(root)) {
    if (requestedDirectory) {
      throw new Error(`پوشهٔ public/${requestedDirectory} پیدا نشد.`);
    }
    continue;
  }

  const files = walk(root);
  for (const file of files) {
    const dir = dirname(file);
    const name = basename(file, extname(file));
    const out = join(dir, `${name}.webp`);

    if (existsSync(out)) {
      let validOutput = false;
      try {
        validOutput = (await sharp(out).metadata()).format === "webp";
      } catch {
        console.warn(`Invalid WebP output will be replaced: ${out}`);
      }

      if (validOutput) {
        if (deleteOriginals) removeSource(file);
        skipped++;
        continue;
      }

      unlinkSync(out);
    }

    try {
      await sharp(file).webp({ quality: QUALITY }).toFile(out);
      console.log(`Converted: ${file} -> ${out}`);
      converted++;
    } catch (err) {
      failed++;
      console.error(`Failed to convert ${file}:`, err.message);
      continue;
    }

    if (deleteOriginals) removeSource(file);
  }
}

console.log(`\nDone! Converted: ${converted}, Skipped: ${skipped}, Failed: ${failed}`);
if (failed > 0) process.exitCode = 1;
