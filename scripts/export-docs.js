#!/usr/bin/env node
/**
 * scripts/export-docs.js
 * Export Slidev decks to document formats via @slidev/parser + Pandoc.
 * Usage: node scripts/export-docs.js [--deck pro/bookmarklets] [--verbose]
 */
import { execSync } from 'node:child_process';
import { readdirSync, existsSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeDeck } from './lib/slidev-normalize.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DECKS = join(ROOT, 'decks');
const TEMPLATES = join(ROOT, '_templates');
const META = join(TEMPLATES, 'default-meta.yaml');
const HTML_TEMPLATE = join(TEMPLATES, 'handout.html');
const HTML_CSS = join(TEMPLATES, 'handout.css');

const args = process.argv.slice(2);
const VERBOSE = args.includes('--verbose');
const SINGLE = args.includes('--deck') ? args[args.indexOf('--deck') + 1] : null;
const SKIP = new Set(['node_modules', '.git', '.idea', '.github', 'dist']);

// ── Pandoc check ──
try {
  const ver = execSync('pandoc --version', { encoding: 'utf8' }).split('\n')[0];
  console.log(`\n  📖  ${ver}`);
} catch {
  console.error('\n  ❌  pandoc not found. Install: https://pandoc.org/installing.html');
  console.error('  Windows: winget install --id JohnMacFarlane.Pandoc');
  process.exit(1);
}

// A Slidev deck declares `theme:` in its leading frontmatter.
function isSlidevDeck(file) {
  const txt = readFileSync(file, 'utf8');
  if (!txt.startsWith('---')) return false;
  const end = txt.indexOf('\n---', 3);
  const fm = end === -1 ? txt : txt.slice(0, end);
  return /^\s*theme\s*:/m.test(fm);
}

function findDecks(dir, depth = 0) {
  if (depth > 1) return [];
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory() || SKIP.has(e.name)) continue;
    const full = join(dir, e.name);
    const slides = join(full, 'slides.md');
    if (existsSync(slides)) {
      if (isSlidevDeck(slides)) out.push(full);
    } else {
      out.push(...findDecks(full, depth + 1));
    }
  }
  return out;
}

let decks = existsSync(DECKS) ? findDecks(DECKS) : [];
if (SINGLE) {
  const want = SINGLE.replace(/\\/g, '/');
  decks = decks.filter((p) => relative(DECKS, p).replace(/\\/g, '/') === want);
}
if (decks.length === 0) { console.log('\n  ⚠️  No Slidev decks found.'); process.exit(0); }

function run(parts, cwd) {
  const cmd = parts.join(' ');
  if (VERBOSE) console.log(`\n      ${cmd}`);
  execSync(cmd, { cwd, stdio: VERBOSE ? 'inherit' : 'pipe', encoding: 'utf8' });
}

console.log(`\n  🔨  Exporting ${decks.length} deck(s)…\n`);
let ok = 0, fail = 0, pdfSkipped = 0;

for (const deck of decks) {
  const rel = relative(ROOT, deck);
  const outDir = join(deck, 'export');
  mkdirSync(outDir, { recursive: true });
  process.stdout.write(`  📦  ${rel} … `);

  try {
    const raw = readFileSync(join(deck, 'slides.md'), 'utf8');
    const clean = await normalizeDeck(raw, join(deck, 'slides.md'));
    const intermediate = join(outDir, '_clean.md');
    writeFileSync(intermediate, clean, 'utf8');

    const localMeta = join(deck, 'meta.yaml');
    const metaArgs = [`--metadata-file="${META}"`];
    if (existsSync(localMeta)) metaArgs.push(`--metadata-file="${localMeta}"`);

    const base = ['pandoc', `"${intermediate}"`, ...metaArgs, `--resource-path="${deck}"`];

    // 1. Flat GFM markdown
    run([...base, '--to=gfm', `-o "${join(outDir, 'slides.md')}"`], deck);
    // 2. Standalone HTML handout
    run([...base, '--to=html5', '--standalone', '--embed-resources',
      `--template="${HTML_TEMPLATE}"`, `--css="${HTML_CSS}"`,
      `-o "${join(outDir, 'handout.html')}"`], deck);
    // 3. PDF (best-effort — skip if no engine)
    try {
      run([...base, `-o "${join(outDir, 'handout.pdf')}"`], deck);
    } catch (e) {
      pdfSkipped++;
      if (VERBOSE) console.log(`\n      (pdf skipped: ${String(e.message).split('\n')[0]})`);
    }
    console.log('✅');
    ok++;
  } catch (err) {
    console.log('❌');
    if (err.stderr) console.error(`      ${String(err.stderr).trim()}`);
    else console.error(`      ${err.message}`);
    fail++;
  }
}

console.log(`\n  ✨  Exported: ${ok}  Failed: ${fail}  PDF skipped: ${pdfSkipped}\n`);
if (fail > 0) process.exit(1);
