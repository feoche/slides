// scripts/lib/slidev-normalize.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalizeDeck, normalizeSlide, resolveBindings } from './slidev-normalize.js';

test('normalizeSlide keeps plain content unchanged', () => {
  const out = normalizeSlide({ frontmatter: {}, content: '## Title\n\nBody text.' });
  assert.equal(out, '## Title\n\nBody text.');
});

test('normalizeDeck drops headmatter and joins slides with blank line', async () => {
  const raw = [
    '---', 'theme: ../theme', 'title: T', '---', '',
    '## One', '', '---', '', '## Two',
  ].join('\n');
  const out = await normalizeDeck(raw, 'slides.md');
  assert.match(out, /## One/);
  assert.match(out, /## Two/);
  assert.doesNotMatch(out, /theme:/);
  assert.doesNotMatch(out, /^title: T$/m);
  assert.ok(out.endsWith('\n'));
});

test('normalizeSlide removes slot markers but keeps content', () => {
  const content = '::left::\n\n## A\n\n- x\n\n::right::\n\n## B\n\n- y';
  const out = normalizeSlide({ frontmatter: { layout: 'two-cols' }, content });
  assert.match(out, /## A/);
  assert.match(out, /## B/);
  assert.doesNotMatch(out, /::left::|::right::/);
});

test('normalizeSlide strips <style> blocks', () => {
  const content = '<style>\nul { margin: 0; }\n</style>\n\n## Title';
  const out = normalizeSlide({ frontmatter: {}, content });
  assert.doesNotMatch(out, /<style>|margin/);
  assert.match(out, /## Title/);
});

test('normalizeSlide unwraps Window and strips v-click', () => {
  const content = '<Window title="demo">\n\n<div v-click>Hi</div>\n\n</Window>';
  const out = normalizeSlide({ frontmatter: {}, content });
  assert.doesNotMatch(out, /<Window|<\/Window>|v-click/);
  assert.match(out, /Hi/);
});

test('normalizeSlide promotes media-layout image into body', () => {
  const out = normalizeSlide({
    frontmatter: { layout: 'media-right', media: '/html-codesniffer.jpg' },
    content: '## [HTML CodeSniffer](https://x)\n\n- item',
  });
  assert.match(out, /!\[\]\(html-codesniffer\.jpg\)/);
  assert.match(out, /## \[HTML CodeSniffer\]/);
});

test('normalizeSlide promotes section heading to level 1', () => {
  const out = normalizeSlide({ frontmatter: { layout: 'section' }, content: '# Le Speedrun' });
  assert.match(out, /^# Le Speedrun/m);
});

test('normalizeSlide demotes section subheading from h2 to h1', () => {
  const out = normalizeSlide({ frontmatter: { layout: 'section' }, content: '## Le lexique' });
  assert.match(out, /^# Le lexique/m);
});

test('resolveBindings resolves frontmatter and configs, drops unknown', () => {
  const cfg = { title: 'My Talk', author: 'François' };
  assert.equal(resolveBindings('# {{ $frontmatter.title }}', cfg), '# My Talk');
  assert.equal(resolveBindings('### {{ $slidev.configs.author }}', cfg), '### François');
  assert.equal(resolveBindings('{{ someExpr() }}', cfg), '');
});

test('normalizeSlide resolves bindings and strips custom Vue components', () => {
  const content = '# {{ $frontmatter.title }}\n\n<QRCode\n:data="url"\n/>\n\n<a href="/x">link</a>';
  const out = normalizeSlide({ frontmatter: { layout: 'cover' }, content }, { title: 'T' });
  assert.match(out, /# T/);
  assert.doesNotMatch(out, /QRCode|\{\{/);
  assert.match(out, /<a href="\/x">link<\/a>/); // lowercase HTML preserved
});

test('normalizeDeck inlines src: includes', async () => {
  const raw = [
    '---', 'theme: ../../../theme', 'title: T', '---', '',
    '# Cover', '', '---', 'src: ../../_common/intro.md', '---',
  ].join('\n');
  const out = await normalizeDeck(raw, 'src/decks/pro/x/slides.md');
  // intro.md contributes the author heading; the src placeholder must be gone.
  assert.doesNotMatch(out, /===\s*INTRODUCTION\s*===/);
  assert.match(out, /Web cabinetmaker/);
});

test('real speedrun deck normalizes with no Slidev residue', async () => {
  const path = 'src/decks/misc/speedrun/slides.md';
  const out = await normalizeDeck(readFileSync(path, 'utf8'), path);
  assert.doesNotMatch(out, /^layout:/m);
  assert.doesNotMatch(out, /::left::|::right::/);
  assert.doesNotMatch(out, /<style>/);
  assert.match(out, /# Le Speedrun/);
});
