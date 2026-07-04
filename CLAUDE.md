# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A monorepo for creating presentations using two systems side-by-side:
- **Slidev** (Vue 3 + Markdown) — the primary system, with a custom theme at `src/theme/`
- **Reveal.js** (Pandoc-based static builds) — used by legacy decks under `src/pro/` and `src/z-misc/`

## Commands

```bash
# Slidev development
pnpm dev              # Start Slidev dev server (auto-opens browser)
pnpm build            # Build Slidev presentation for production
pnpm export           # Export slides to PDF (requires playwright-chromium)

# Static builds (Reveal.js decks via Pandoc)
node scripts/build.js                        # Build all decks
node scripts/build.js --deck pro/bookmarklets  # Build single deck
node scripts/build.js --verbose              # Show pandoc commands

# Scaffold a new talk
npm run new -- pro/my-talk "My Talk Title"
npm run new -- z-misc/my-talk "My Talk Title"

# Format markdown
pnpm prettier --write "**/*.md"
```

## Architecture

**Custom Slidev theme** (`src/theme/`): Published as `slidev-theme-feoche`. Contains 19 layouts (cover, section, quote, fact, image variants, iframe variants, two-cols, etc.), design tokens in `styles/tokens.css`, and helper functions in `layoutHelper.ts` (`formatDate`, `handleBackground`).

**Presentation decks**: Slidev decks use root-level `slides*.md` files. Reveal.js decks live in `src/pro/<slug>/` and `src/z-misc/<slug>/`, each containing `slides.md`, `meta.yaml`, `index.html`, and `assets/`.

**Two build pipelines**:
- Slidev: `@slidev/cli` (Vite-based, used by root `slides.md` files)
- Reveal.js: `scripts/build.js` runs Pandoc with `_templates/revealjs.html` template and `_templates/default-meta.yaml` defaults, outputs `index-static.html`

## Key Conventions

- Package manager: **pnpm** (workspace configured in `pnpm-workspace.yaml`)
- Prettier with `prettier-plugin-slidev` reformats `.md` files using the slidev parser
- Fonts: Albert Sans (body), Outfit (headings), Cascadia Code (monospace)
- Theme supports both light and dark color schemes; primary color is `#00574a`
- Canvas: 980px wide, 16:9 aspect ratio
- Date frontmatter (`date: 2026-06-09`) is accessible in layouts via `$frontmatter.date`
- Reveal.js markdown uses `---` for horizontal slides and `--` for vertical slides
