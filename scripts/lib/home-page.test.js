// scripts/lib/home-page.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { escapeHtml, formatDate, hasDescription, readHomeTalks, renderHome, toKeywords } from './home-page.js';
import { injectRestoreScript, render404 } from './spa-fallback.js';

const DECKS = [
  { slug: 'squad', meta: { title: 'Squad', info: 'Long info.', event: 'RennesJS', date: new Date('2026-11-19'), keywords: 'agile, team' } },
  { slug: 'tas', meta: { title: 'TAS', info: 'Talk description', summary: 'Short.' } },
];

function homeYaml(text) {
  const file = join(mkdtempSync(join(tmpdir(), 'home-')), 'home.yaml');
  writeFileSync(file, text);
  return file;
}

test('hasDescription skips missing and placeholder descriptions', () => {
  assert.equal(hasDescription({ info: 'Un talk sur les bookmarklets.' }), true);
  assert.equal(hasDescription({}), false);
  assert.equal(hasDescription({ info: 'Talk description' }), false);
  assert.equal(hasDescription({ info: 'A short description of the talk.' }), false);
});

test('formatDate gives the month and year, in French, read in UTC', () => {
  assert.equal(formatDate(new Date('2026-11-01')), 'Novembre 2026');
  assert.equal(formatDate(undefined), undefined);
  assert.equal(formatDate('bientôt'), 'bientôt');
});

test('toKeywords splits a comma-separated list', () => {
  assert.deepEqual(toKeywords('ux,  design , '), ['ux', 'design']);
  assert.deepEqual(toKeywords(undefined), []);
});

test('readHomeTalks keeps the file order and builds each card from the deck headmatter', () => {
  const talks = readHomeTalks(homeYaml('talks:\n  - tas\n  - squad\n'), DECKS);
  assert.deepEqual(talks.map((t) => t.slug), ['tas', 'squad']);
  assert.equal(talks[0].summary, 'Short.');
  assert.deepEqual(talks[0].keywords, []);
  assert.equal(talks[1].summary, 'Long info.');
  assert.deepEqual(talks[1].keywords, ['agile', 'team']);
  assert.equal(talks[1].event, 'RennesJS');
  assert.equal(talks[1].date, 'Novembre 2026');
});

test('readHomeTalks fails on an unknown talk', () => {
  assert.throws(() => readHomeTalks(homeYaml('talks:\n  - nope\n'), DECKS), /no talk "nope"/);
});

test('renderHome renders clickable cards with escaped content and badges', () => {
  const html = renderHome([
    { slug: 'squad', title: 'A <b>', summary: 'S', keywords: ['agile'], event: 'RennesJS', date: 'Mai 2024' },
    { slug: 'tas', title: 'TAS', keywords: [] },
  ], { author: 'Me' });
  assert.ok(html.includes('<a class="talk-card" href="./squad/">'));
  assert.ok(html.includes('A &lt;b&gt;'));
  assert.ok(html.includes('à RennesJS — Mai 2024'));
  assert.ok(html.includes('<li class="tech-tag">agile</li>'));
  assert.equal(html.match(/class="talk-tags"/g).length, 1);
});

test('escapeHtml escapes markup', () => {
  assert.equal(escapeHtml('<a href="x">&</a>'), '&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;');
});

test('render404 redirects deep links of the given decks', () => {
  const html = render404(['bookmarklets'], '/slides/');
  assert.ok(html.includes('var base = "/slides/";'));
  assert.ok(html.includes('var decks = ["bookmarklets"];'));
});

test('injectRestoreScript runs first in the head', () => {
  const html = injectRestoreScript('<html><head><script type="module" src="x.js"></script></head></html>');
  assert.ok(html.indexOf('slidev-path') < html.indexOf('x.js'));
});
