#!/usr/bin/env node
/**
 * scripts/export-standalone.js
 *
 * Export one Slidev "board" (a deck under `talks/`) to a single self-contained HTML file that opens
 * offline by double-click (e.g. from a USB flash drive). `slidev build` output can't do that: browsers
 * block its JavaScript modules on `file://`, so it needs a web server.
 *
 * Every slide (and click step) is rendered to PNG with `slidev export --with-clicks` (requires
 * playwright-chromium), then embedded as a data URI in a minimal viewer:
 *   →, ↓, Space, Enter, PageDown: next   ←, ↑, Backspace, PageUp: previous   Home / End   f: fullscreen
 *   click on the right two thirds: next, on the left third: previous   URL hash = slide number
 *
 * The file lands next to the deck's slides.md, in `export/<name>.html`.
 *
 * Usage:
 *   node scripts/export-standalone.js bookmarklets                # by folder name when unique
 *   node scripts/export-standalone.js pro/bookmarklets --dark     # extra flags go to `slidev export`
 */
import {spawnSync} from 'child_process';
import {mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync} from 'fs';
import {tmpdir} from 'os';
import {dirname, join} from 'path';
import {ROOT, discoverBoards, resolveBoard} from './boards.js';

const args = process.argv.slice(2);
const selector = args.find((a) => !a.startsWith('--'));

if (!selector) {
    console.error('Usage: pnpm export:standalone <slug> [slidev export flags]');
    console.error('  e.g. pnpm export:standalone bookmarklets');
    process.exit(1);
}

const board = resolveBoard(discoverBoards(), selector);
const name = board.slug.split('/').pop();
const output = join(dirname(board.file), 'export', `${name}.html`);
const pngDir = mkdtempSync(join(tmpdir(), `slides-${name}-`));

/** Deck title from the headmatter (`title: ...`), falling back to the folder name. */
function deckTitle(file) {
    const match = readFileSync(file, 'utf8').match(/^title:\s*(.+)$/m);
    return match ? match[1].trim().replace(/^(['"])(.*)\1$/, '$2') : name;
}

const escapeHtml = (s) => s.replace(/[&<>"]/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c]);

/** Natural order on the numbers in a file name: 2.png < 10.png, 001-02.png < 002-01.png. */
const naturalKey = (f) => (f.match(/\d+/g) || []).map(Number);
const byNaturalKey = (a, b) => {
    const [ka, kb] = [naturalKey(a), naturalKey(b)];
    for (let i = 0; i < Math.max(ka.length, kb.length); i++) {
        if ((ka[i] ?? -1) !== (kb[i] ?? -1)) return (ka[i] ?? -1) - (kb[i] ?? -1);
    }
    return 0;
};

function renderViewer(title, images) {
    return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
html,body{margin:0;height:100%;background:#000;overflow:hidden;font-family:sans-serif}
img{position:absolute;inset:0;margin:auto;max-width:100%;max-height:100%}
#n{position:fixed;right:12px;bottom:8px;color:#888;font-size:13px}
</style>
</head>
<body>
<img id="s" alt="">
<div id="n"></div>
<script>
const S = ${JSON.stringify(images)};
const im = document.getElementById('s'), n = document.getElementById('n');
let i = 0;
function go(k) {
  i = Math.max(0, Math.min(S.length - 1, k));
  im.src = S[i];
  n.textContent = (i + 1) + ' / ' + S.length;
  history.replaceState(null, '', '#' + (i + 1));
}
addEventListener('keydown', (e) => {
  if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) go(i + 1);
  else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(e.key)) go(i - 1);
  else if (e.key === 'Home') go(0);
  else if (e.key === 'End') go(S.length - 1);
  else if (e.key === 'f') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
  else return;
  e.preventDefault();
});
addEventListener('click', (e) => go(e.clientX < innerWidth / 3 ? i - 1 : i + 1));
go((parseInt(location.hash.slice(1)) || 1) - 1);
</script>
</body>
</html>
`;
}

console.log(`\n  🖼️  Rendering "${board.slug}" slides to PNG…\n`);
const SLIDEV = process.platform === 'win32' ? 'slidev.cmd' : 'slidev';
const flags = ['export', board.file, '--format', 'png', '--with-clicks', '--output', pngDir,
    ...args.filter((a) => a !== selector)];
const result = spawnSync(SLIDEV, flags, {cwd: ROOT, stdio: 'inherit', shell: process.platform === 'win32'});

try {
    const files = result.status === 0
        ? readdirSync(pngDir).filter((f) => f.endsWith('.png')).sort(byNaturalKey)
        : [];
    if (!files.length) {
        if (result.status === 0) console.error('\n  ❌  slidev export produced no PNG.\n');
        process.exitCode = result.status || 1;
    } else {
        writeViewer(files);
    }
} finally {
    rmSync(pngDir, {recursive: true, force: true});
}

function writeViewer(files) {
    const images = files.map((f) => `data:image/png;base64,${readFileSync(join(pngDir, f)).toString('base64')}`);
    mkdirSync(dirname(output), {recursive: true});
    writeFileSync(output, renderViewer(deckTitle(board.file), images));
    const size = (statSync(output).size / 1024 / 1024).toFixed(1);
    console.log(`\n  📦  ${files.length} slides → ${output} (${size} MB)\n`);
}
