/**
 * Convert all PNG images in public/imags and public/logos to WebP format.
 * Run: node scripts/convert-images.mjs
 */
import { execSync } from "node:child_process";
import { readdirSync, statSync, unlinkSync, existsSync } from "node:fs";
import { join, extname, basename, dirname } from "node:path";

const PUBLIC_DIR = join(import.meta.dirname, "..", "public");
const DIRS = ["imags", "logos"];
const QUALITY = 80;

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

for (const sub of DIRS) {
  const root = join(PUBLIC_DIR, sub);
  if (!existsSync(root)) continue;

  const files = walk(root);
  for (const file of files) {
    const dir = dirname(file);
    const name = basename(file, extname(file));
    const out = join(dir, `${name}.webp`);

    if (existsSync(out)) {
      skipped++;
      continue;
    }

    try {
      execSync(
        `npx sharp-cli -i "${file}" -o "${out}" --format webp --quality ${QUALITY}`,
        { stdio: "pipe" }
      );
      console.log(`✅ ${file} → ${out}`);
      converted++;
    } catch (err) {
      console.error(`❌ Failed: ${file}`, err.message);
    }
  }
}

console.log(`\nDone! Converted: ${converted}, Skipped: ${skipped}`);
