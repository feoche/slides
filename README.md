# Slidev Templates

This repository contains templates for creating presentations using [Slidev](https://sli.dev/), a presentation framework that uses Markdown with Vue components.

## Template Files

### `_templates/` Directory

The `_templates/` directory contains all the template files needed for Slidev presentations:

- `index.html` - Simple index template for Slidev presentations
- `slidev.html` - Slidev-specific HTML template
- `default-meta.yaml` - Default metadata configuration for presentations
- `palette.yaml` - Color palette definitions for different themes
- `custom.css` - Custom styling rules with design tokens and theme variables

## Usage

1. Create a new presentation by copying the `slides/` directory structure
2. Use one of the template files as your base:
   - For Slidev presentations, use `slidev.html`
   - For simple index pages, use `index.html`

## Date Parameter

You can pass a date parameter in your slides.md frontmatter:

```yaml
---
date: 2026-06-09
---
```

This date will be accessible in all layouts using `$frontmatter.date` and will automatically be formatted for display.

### Usage Examples

In any slide, you can access the date like this:
- `{{ $frontmatter.date }}` - Raw date value
- `{{ new Date($frontmatter.date).toLocaleDateString() }}` - Formatted date
- `{{ formatDate($frontmatter.date) }}` - Using helper function (if available)

The date parameter is automatically used in the cover layout and can be used anywhere in your slides.

## Features

- **Theme Support**: Multiple color themes defined in `palette.yaml`
- **Custom Styling**: Extensive CSS customization through `custom.css`
- **Responsive Design**: Adapts to different screen sizes
- **Code Highlighting**: Syntax highlighting for code blocks
- **Slide Navigation**: Arrow key and touch support
- **Speaker Notes**: Built-in speaker note support

## Document Export (Pandoc)

Export any Slidev deck to reading formats (flat Markdown + HTML handout +
PDF) via Pandoc:

    npm run export:docs                            # all decks
    npm run export:docs -- --deck misc/speedrun    # one deck

Outputs land in `<deck>/export/`. PDF requires a LaTeX engine; if none is
installed, Markdown and HTML are still produced and PDF is skipped.
Requires Pandoc: https://pandoc.org/installing.html

## Customization

### Color Themes

The `palette.yaml` file defines several color themes:
- Default (blue-based)
- Teal
- Purple-blue
- Red-warm
- Green
- Orange
- Gray

A new custom theme has been added with light and dark palettes:

**Light Palette:**
- Primary color: `#00574a`
- Primary hover: `#003D34`
- Text primary: `#001f1b`
- Text secondary: `#002b25`
- Background primary: `#ffffff`
- Background secondary: `#f8faf9`
- Background alt: `#f0f5f3`
- Border color: `#d5e0dc`
- On primary: `#ffffff`
- Switch off: `#b0c4bf`
- Switch on: `#00574a`
- Switch knob: `#ffffff`

**Dark Palette:**
- Primary color: `#ffffff`
- Primary hover: `#ffffff`
- Text primary: `#ffffff`
- Text secondary: `#ffffff`
- Background primary: `#0c1f1b`
- Background secondary: `#00574a`
- Background alt: `#003D34`
- Border color: `#006B57`
- On primary: `#001f1b`
- Switch off: `#006B57`
- Switch on: `#4fd1b8`
- Switch knob: `#0c1f1b`

### Styling

The `custom.css` file contains:
- Design tokens for consistent styling
- Typography fixes
- Code block styling
- Blockquote styling
- Layout helpers (columns, cards, centered content)
- Utility classes
- Speaker notes support
- Markdown rendering improvements

## Requirements

- Node.js 16+ (for Slidev)
- npm or pnpm for package management

## Installation

```bash
# Install Slidev globally
npm install -g @slidev/cli

# Or use pnpm
pnpm add -g @slidev/cli
```

## Building Presentations

To build a presentation:

```bash
# Start the development server
slidev

# Build for production
slidev build
```

## Contributing

Feel free to contribute by submitting issues or pull requests to improve these templates.
