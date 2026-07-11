#!/usr/bin/env node
/**
 * scripts/serve-boards.js
 *
 * Serve a single Slidev "board" (a deck under `src/decks/`) for local development.
 *
 * Usage:
 *   node scripts/serve-boards.js pro/bookmarklets  # serve one board (--open)
 *   node scripts/serve-boards.js                    # interactive picker (TTY)
 *   node scripts/serve-boards.js --list            # list boards and exit
 *
 * Slidev's dev server only handles one entry file at a time, so serving is
 * one deck at a time. With no slug, an interactive numbered picker is shown
 * (falls back to a plain list + exit when stdin isn't a terminal).
 */
import { spawn } from 'child_process';
import { createInterface } from 'readline/promises';
import { ROOT, discoverBoards, resolveBoard } from './boards.js';

const args = process.argv.slice(2);
const boards = discoverBoards();

if (boards.length === 0) {
  console.log('\n  ⚠️  No boards found (looked for slides.md / slides_*.md).\n');
  process.exit(0);
}

if (args.includes('--list')) {
  console.log('\n  🎬  Boards:');
  for (const b of boards) console.log(`      • ${b.slug}  (${b.name})`);
  console.log('');
  process.exit(0);
}

const SLIDEV = process.platform === 'win32' ? 'slidev.cmd' : 'slidev';
const BASE_PORT = 3030;

// npx-free: slidev is a local dependency, resolved via node_modules/.bin.
function serve(board, port, open) {
  const flags = [board.file, '--port', String(port)];
  if (open) flags.push('--open');
  return spawn(SLIDEV, flags, {
    cwd: ROOT,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
}

// Serving is one deck at a time: resolve a slug from the CLI, or prompt for one.
async function pickBoard() {
  // Not a terminal (piped/CI): can't prompt, so list and bail.
  if (!process.stdin.isTTY) {
    console.log('\n  🎬  Pick one board to serve:');
    for (const b of boards) console.log(`      • ${b.slug}`);
    console.log('\n  Usage: node scripts/serve-boards.js <slug>\n');
    process.exit(1);
  }

  console.log('\n  🎬  Which board do you want to serve?\n');
  boards.forEach((b, i) => console.log(`      ${String(i + 1).padStart(2)}. ${b.slug}`));
  console.log('');

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    while (true) {
      const answer = (await rl.question('  Enter a number (or q to quit): ')).trim();
      if (answer === 'q' || answer === '') process.exit(0);
      const n = Number(answer);
      if (Number.isInteger(n) && n >= 1 && n <= boards.length) return boards[n - 1];
      console.log(`  ⚠️  Please enter a number between 1 and ${boards.length}.`);
    }
  } finally {
    rl.close();
  }
}

const selector = args.find((a) => !a.startsWith('--'));
const board = selector ? resolveBoard(boards, selector) : await pickBoard();

console.log(`\n  🎬  Serving "${board.slug}" on http://localhost:${BASE_PORT}\n`);
const child = serve(board, BASE_PORT, true);
child.on('exit', (code) => process.exit(code ?? 0));
