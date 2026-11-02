import { markSubtitles } from './markdownHelper'

// Merged by Slidev into every deck using this theme.
// Static assets live in each deck's `img/` folder (instead of Vite's default `public/`)
// and are still referenced from the root: `/my-image.jpg`.
// Relative to Vite's `root`, which Slidev sets to the deck folder.
export default {
  publicDir: 'img',
  // Pre-bundled for MediaEl's `qr:` media, even when a deck doesn't list the QR code addon
  optimizeDeps: {
    include: ['slidev-addon-qrcode > qr-code-styling'],
  },
  slidev: {
    markdown: {
      // `###` right under a `#`/`##` title (no blank line) gets the `subtitle` class
      markdownSetup(md: any) {
        md.core.ruler.push('subtitle', (state: any) => markSubtitles(state.tokens))
      },
    },
  },
}
