#!/usr/bin/env node
/**
 * Generates small, display-sized derivatives of every board member photo and
 * records them back into board-members.json.
 *
 * The originals in "Board Member Photos/{png,webp}" are camera-resolution files
 * (154MB of PNG + 56MB of WebP, up to 23MB each) that the homepage renders into
 * a 224px circle. This script emits 256px/512px AVIF + WebP crops plus a tiny
 * inline LQIP so the circles paint immediately instead of sitting white.
 *
 * Usage:
 *   npm run optimize:photos          # only rebuild what changed
 *   npm run optimize:photos -- --force
 */
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, stat, readdir, unlink } from 'node:fs/promises';
import { dirname, join, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
// Originals live outside public/ so Vite never copies 210MB into dist; they are
// build inputs, not servable assets. See boardPhotoOriginalsPlugin in vite.config.js
// for the handful blog/wiki posts still reference directly.
const SOURCE_DIR = join(root, 'board-photo-originals');
const MANIFEST = join(root, 'public', 'Board Member Photos', 'board-members.json');
// No spaces in the output dir so the URLs need no percent-encoding.
const OUT_DIR = join(root, 'public', 'board-photos');
const PUBLIC_BASE = '/board-photos';
const CACHE_FILE = join(OUT_DIR, '.build-cache.json');

// The circle renders at 176px (mobile) / 192px (sm) / 224px (lg), so 512px
// covers 2x DPR at the largest breakpoint with room to spare.
const WIDTHS = [256, 512];
const FALLBACK_PHOTO = 'png/None.png';

const force = process.argv.includes('--force');

/** "Sera-Savaş.png" -> "Sera-Savas" so the URL is plain ASCII. */
const slugify = (photoPath) =>
  basename(photoPath, extname(photoPath))
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '');

async function sourceFingerprint(absPath) {
  const s = await stat(absPath);
  return `${s.size}:${Math.floor(s.mtimeMs)}`;
}

/**
 * Short digest of the source file, embedded in every derivative's name. That
 * makes the output URLs content-addressed, so vercel.json can serve
 * /board-photos/* as immutable and a refresh costs zero revalidation requests -
 * while a replaced photo still gets a brand new URL.
 */
async function sourceDigest(absPath) {
  return createHash('sha256').update(await readFile(absPath)).digest('hex').slice(0, 8);
}

/**
 * 16px blurred square, inlined as a data URI. Ships inside board-members.json
 * so the avatar has something to show on the very first paint.
 */
async function makeLqip(pipeline) {
  const buf = await pipeline
    .clone()
    .resize(16, 16, { fit: 'cover', position: 'centre' })
    .blur(1.2)
    .webp({ quality: 28, alphaQuality: 40, effort: 6 })
    .toBuffer();
  return `data:image/webp;base64,${buf.toString('base64')}`;
}

/** Average color of the image, used as the paint-0 background under the LQIP. */
async function dominantColor(pipeline) {
  const { data } = await pipeline
    .clone()
    .resize(1, 1, { fit: 'cover', position: 'centre' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const hex = [...data.subarray(0, 3)].map((v) => v.toString(16).padStart(2, '0')).join('');
  return `#${hex}`;
}

async function processPhoto(photoPath) {
  const abs = join(SOURCE_DIR, photoPath);
  const slug = `${slugify(photoPath)}.${await sourceDigest(abs)}`;

  // .rotate() with no args honours EXIF orientation, matching what the browser
  // does with the originals today.
  const pipeline = sharp(abs, { failOn: 'none' }).rotate();

  await Promise.all(
    WIDTHS.flatMap((w) => {
      // fit:cover + centre reproduces the existing `object-cover` circle crop
      // exactly, so nobody's head moves.
      const resized = () =>
        pipeline.clone().resize(w, w, { fit: 'cover', position: 'centre', withoutEnlargement: false });
      return [
        resized().webp({ quality: 78, effort: 5 }).toFile(join(OUT_DIR, `${slug}-${w}.webp`)),
        resized().avif({ quality: 55, effort: 4 }).toFile(join(OUT_DIR, `${slug}-${w}.avif`)),
      ];
    })
  );

  const [lqip, color] = await Promise.all([makeLqip(pipeline), dominantColor(pipeline)]);
  return { srcBase: `${PUBLIC_BASE}/${slug}`, blur: lqip, blurColor: color };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'));
  const groups = ['members', 'alumni'].filter((k) => Array.isArray(manifest[k]));

  let cache = {};
  if (!force) {
    try {
      cache = JSON.parse(await readFile(CACHE_FILE, 'utf8'));
    } catch {
      cache = {};
    }
  }

  // Dedupe: several entries can point at the same file (e.g. the None placeholder).
  const wanted = new Map();
  for (const key of groups) {
    for (const m of manifest[key]) {
      const photo = typeof m.photo === 'string' && m.photo ? m.photo : FALLBACK_PHOTO;
      wanted.set(photo, null);
    }
  }
  wanted.set(FALLBACK_PHOTO, null);

  const results = new Map();
  const nextCache = {};
  let built = 0;
  let reused = 0;
  const failures = [];

  const entries = [...wanted.keys()];
  const CONCURRENCY = 6;
  let cursor = 0;

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, entries.length) }, async () => {
      while (cursor < entries.length) {
        const photo = entries[cursor++];
        try {
          const fp = await sourceFingerprint(join(SOURCE_DIR, photo));
          const hit = cache[photo];
          if (hit && hit.fingerprint === fp && hit.result) {
            results.set(photo, hit.result);
            nextCache[photo] = hit;
            reused++;
            continue;
          }
          const result = await processPhoto(photo);
          results.set(photo, result);
          nextCache[photo] = { fingerprint: fp, result };
          built++;
          process.stdout.write(`  built ${result.srcBase.split('/').pop()}\n`);
        } catch (err) {
          failures.push(`${photo}: ${err.message}`);
        }
      }
    })
  );

  const fallback = results.get(FALLBACK_PHOTO);

  for (const key of groups) {
    manifest[key] = manifest[key].map((m) => {
      const photo = typeof m.photo === 'string' && m.photo ? m.photo : FALLBACK_PHOTO;
      const r = results.get(photo) || fallback;
      if (!r) return m;
      return { ...m, srcBase: r.srcBase, blur: r.blur, blurColor: r.blurColor };
    });
  }
  if (fallback) manifest.fallback = fallback;

  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  await writeFile(CACHE_FILE, JSON.stringify(nextCache, null, 2));

  // Drop derivatives from previous runs; content-hashed names would otherwise
  // accumulate a new set every time a photo is replaced.
  const keep = new Set();
  for (const r of results.values()) {
    const slug = r.srcBase.slice(PUBLIC_BASE.length + 1);
    for (const w of WIDTHS) for (const ext of ['webp', 'avif']) keep.add(`${slug}-${w}.${ext}`);
  }
  let pruned = 0;
  for (const name of await readdir(OUT_DIR)) {
    if (name.startsWith('.') || keep.has(name)) continue;
    await unlink(join(OUT_DIR, name));
    pruned++;
  }

  console.log(`\nbuilt ${built}, reused ${reused}, pruned ${pruned}, output -> public/board-photos`);
  if (failures.length) {
    console.error(`\n${failures.length} photo(s) failed:`);
    for (const f of failures) console.error(`  ${f}`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
