/**
 * scripts/lib/home-page.js
 *
 * Home page of the built site: clickable cards to the talks listed in `talks/home.yaml`, in its order,
 * each one made of its deck's headmatter, styled after https://francoiseoche.fr/ (`site.css`, copied next to it by build-boards.js).
 */
import { readFileSync } from 'node:fs';
import { parseSync } from '@slidev/parser';
import { parse as parseYaml } from 'yaml';

const PLACEHOLDER_INFOS = ['Talk description', 'A short description of the talk.'];

const LINKS = [
  { label: 'Mon site', href: 'https://francoiseoche.fr/' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/feoche/' },
  { label: 'GitHub', href: 'https://github.com/feoche' },
];

const AVATAR = 'https://francoiseoche.fr/assets/avatar.webp';

export const FONTS = 'https://fonts.googleapis.com/css2?family=Albert+Sans:wght@500;700;800&family=Outfit:wght@400;500;600&display=swap';

/** Headmatter fields used by the home page. */
export function readDeckMeta(file) {
  const { slides } = parseSync(readFileSync(file, 'utf8'), file);
  const fm = slides[0]?.frontmatter ?? {};
  return {
    title: fm.title ? String(fm.title) : undefined,
    info: fm.info ? String(fm.info).trim() : undefined,
    summary: fm.summary ? String(fm.summary).trim() : undefined,
    event: fm.event ? String(fm.event) : undefined,
    date: fm.date,
    keywords: fm.keywords ? String(fm.keywords) : undefined,
  };
}

/** A real `info`, not the example's placeholder. */
export function hasDescription(meta) {
  return Boolean(meta.info) && !PLACEHOLDER_INFOS.includes(meta.info);
}

/** `2026-11-19` → `Novembre 2026` (YAML dates are UTC midnight: read them in UTC). */
export function formatDate(date) {
  if (!date) return undefined;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return String(date);
  const text = d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  return text[0].toUpperCase() + text.slice(1);
}

/** `a, b` → `['a', 'b']` */
export function toKeywords(keywords) {
  return String(keywords ?? '').split(',').map((k) => k.trim()).filter(Boolean);
}

/**
 * Talks of `talks/home.yaml`, in its order, each one made of its deck's headmatter.
 * @param {string} file path of home.yaml
 * @param {{slug: string, meta: ReturnType<typeof readDeckMeta>}[]} decks every deck of the site
 */
export function readHomeTalks(file, decks) {
  const { talks = [] } = parseYaml(readFileSync(file, 'utf8')) ?? {};
  return talks.map((slug) => {
    const deck = decks.find((d) => d.slug === slug);
    if (!deck) {
      throw new Error(`talks/home.yaml: no talk "${slug}" (known: ${decks.map((d) => d.slug).join(', ')})`);
    }
    const { meta } = deck;
    return {
      slug,
      title: meta.title ?? slug,
      summary: meta.summary ?? (hasDescription(meta) ? meta.info : undefined),
      keywords: toKeywords(meta.keywords),
      event: meta.event,
      date: formatDate(meta.date),
    };
  });
}

export function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function renderTalk(talk) {
  const when = [talk.event && `à ${escapeHtml(talk.event)}`, talk.date && escapeHtml(talk.date)]
    .filter(Boolean)
    .join(' — ');
  const tags = talk.keywords.map((k) => `<li class="tech-tag">${escapeHtml(k)}</li>`).join('');
  return `
        <li>
          <a class="talk-card" href="./${escapeHtml(talk.slug)}/">
            <h3 class="talk-title"><q>${escapeHtml(talk.title)}</q></h3>
            ${when ? `<p class="talk-event">${when}</p>` : ''}
            ${talk.summary ? `<p class="talk-description">${escapeHtml(talk.summary)}</p>` : ''}
            <div class="talk-footer">
              ${tags ? `<ul class="talk-tags" aria-label="Mots-clés">${tags}</ul>` : ''}
              <span class="talk-link" aria-hidden="true">Voir les slides →</span>
            </div>
          </a>
        </li>`;
}

/**
 * @param {ReturnType<typeof readHomeTalks>} talks
 * @param {{author: string}} options
 */
export function renderHome(talks, { author }) {
  const links = LINKS
    .map((l) => `<li><a class="btn" href="${l.href}" target="_blank" rel="noopener">${l.label}</a></li>`)
    .join('\n          ');

  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Talks — ${escapeHtml(author)}</title>
  <meta name="description" content="Les talks de ${escapeHtml(author)} et leurs slides." />
  <link rel="icon" href="${AVATAR}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="${FONTS}" />
  <link rel="stylesheet" href="./site.css" />
</head>
<body>
  <header class="hero">
    <div class="container">
      <h1 class="hero-title">
        <img class="hero-avatar" src="${AVATAR}" alt="" />
        <span class="hero-name">
          <span class="name">${escapeHtml(author)}</span>
          <span class="role">Mes talks et leurs slides</span>
        </span>
      </h1>
      <ul class="hero-actions">
        ${links}
      </ul>
    </div>
  </header>
  <main class="section" aria-labelledby="talks-title">
    <div class="container">
      <h2 id="talks-title" class="section-title">Talks</h2>
      <ul class="talks-grid">${talks.map(renderTalk).join('')}
      </ul>
    </div>
  </main>
  <footer class="footer">
    <p>Slides faites avec <a href="https://sli.dev/" target="_blank" rel="noopener">Slidev</a></p>
  </footer>
</body>
</html>
`;
}
