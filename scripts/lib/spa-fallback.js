/**
 * scripts/lib/spa-fallback.js
 *
 * Deep links (`/slides/bookmarklets/7`, `/…/presenter/7`) on a static host without SPA fallback,
 * like GitHub Pages, which only serves the site's root `404.html` for unknown paths:
 *
 *   1. `404.html` finds the deck the path belongs to and redirects to its index.html, the rest of the path
 *      kept in a `slidev-path` query parameter;
 *   2. the script injected at the top of each deck's index.html puts the path back before Slidev starts.
 *
 * Slidev's hash router can't replace this: its slide links include the base, which breaks once reloaded.
 */
import { FONTS, escapeHtml } from './home-page.js';

export const PATH_PARAM = 'slidev-path';

/** Inline script restoring the URL saved by 404.html, injected at the top of each deck's `<head>`. */
export const RESTORE_SCRIPT = `<script>
(function () {
  var query = new URLSearchParams(location.search);
  var path = query.get('${PATH_PARAM}');
  if (path === null) return;
  query.delete('${PATH_PARAM}');
  var search = query.toString();
  history.replaceState(null, '', location.pathname + path + (search ? '?' + search : '') + location.hash);
})();
</script>`;

/** Add the restore script to a built deck's index.html. */
export function injectRestoreScript(html) {
  return html.replace(/<head>/, `<head>\n${RESTORE_SCRIPT}`);
}

/**
 * @param {string[]} slugs decks of the site
 * @param {string} base site base path, with a trailing slash
 */
export function render404(slugs, base) {
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Page introuvable</title>
  <script>
  (function () {
    var base = ${JSON.stringify(base)};
    var decks = ${JSON.stringify(slugs)};
    var path = location.pathname;
    for (var i = 0; i < decks.length; i++) {
      var root = base + decks[i] + '/';
      if (path.indexOf(root) === 0) {
        var query = new URLSearchParams(location.search);
        query.set('${PATH_PARAM}', path.slice(root.length));
        location.replace(root + '?' + query.toString() + location.hash);
        return;
      }
    }
  })();
  </script>
  <link rel="stylesheet" href="${FONTS}" />
  <link rel="stylesheet" href="${escapeHtml(base)}site.css" />
</head>
<body>
  <main class="not-found">
    <h1 class="section-title">Page introuvable</h1>
    <a class="btn" href="${escapeHtml(base)}">Retour aux talks</a>
  </main>
</body>
</html>
`;
}
