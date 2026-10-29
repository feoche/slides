#!/usr/bin/env node
/**
 * scripts/export-board.js
 *
 * Export one Slidev "board" (a deck under `talks/`) to PDF with `slidev export`
 * (requires playwright-chromium). The PDF lands next to the deck's slides.md.
 *
 * Usage:
 *   node scripts/export-board.js bookmarklets                 # by folder name when unique
 *   node scripts/export-board.js pro/bookmarklets --dark      # extra flags go to `slidev export`
 */
import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { ROOT, discoverBoards, resolveBoard } from './boards.js';

const args = process.argv.slice(2);
const selector = args.find((a) => !a.startsWith('--'));

if (!selector) {
  console.error('Usage: pnpm export <slug> [slidev export flags]');
  console.error('  e.g. pnpm export bookmarklets');
  process.exit(1);
}

const board = resolveBoard(discoverBoards(), selector);
const SLIDEV = process.platform === 'win32' ? 'slidev.cmd' : 'slidev';
const output = join(dirname(board.file), 'export', `${board.slug.split('/').pop()}.pdf`);
const flags = ['export', board.file, '--output', output, ...args.filter((a) => a !== selector)];

console.log(`\n  🖨️  Exporting "${board.slug}" → ${output}\n`);
const child = spawn(SLIDEV, flags, { cwd: ROOT, stdio: 'inherit', shell: process.platform === 'win32' });
child.on('exit', (code) => process.exit(code ?? 0));
