---
# ================================================================
# SLIDES EXAMPLE — don't edit; create a new talk with:
#
#   npm run new -- pro/my-talk "My Talk Title"    (or misc/my-talk)
#   pnpm dev my-talk
#
# This creates talks/<category>/<slug>/slides.md from this file.
# Put images/videos in the talk's `img/` folder and reference
# them as `/my-image.jpg`. Delete the layout showcase slides you
# don't need.
# ================================================================

# === EDIT THESE INFORMATIONS ===
# title of your slide, will inferred from the first header if not specified
# (use search&replace to update)
title: My Talk Title

# slides description
# (use search&replace to update)
info: A short description of the talk.

# website card (see README "Website"): one-sentence summary (default: info) and where the talk is given
# summary: A one-sentence summary of the talk.
# event: My Meetup

# URL of the presentation (the cover QR code points to it)
url: https://francoiseoche.fr/

# date of the presentation (shown on the cover)
date: 2026-01-01

# keywords, comma-delimited: exported PDF and website card badges
keywords: slidev, talk

# force color schema for the slides, can be 'auto', 'light', or 'dark'
colorSchema: auto

# duration of the presentation
duration: 20min

# HTML tag attributes
htmlAttrs:
  dir: ltr
  lang: fr

# SEO meta tags
seoMeta:
  ogTitle: My Talk Title
  twitterTitle: My Talk Title
  ogDescription: A short description of the talk.
  twitterDescription: A short description of the talk.
  ogUrl: https://francoiseoche.fr/
  twitterCard: summary_large_image
  twitterSite: francoiseoche
  twitterUrl: https://x.com/francoiseoche

# theme id, package name, or local path
# Learn more: https://sli.dev/guide/theme-addon.html#use-theme
theme: "../../../src/theme"

# optional color overrides, all keys are optional (see README "Colors")
# palette: primary, secondary, light, link
# roles (prefix with `dark-` for the dark scheme): background, title, text,
#   text-shadow, highlight-background, highlight-title, highlight-text,
#   highlight-text-shadow, highlight-link; dark only: dark-link
# themeConfig:
#   primary: "#00574a"
#   secondary: "#003D34"
#   light: "#f8faf9"
#   link: "#3ab9d5"
layout: cover
hideInToc: true
addons:
  - slidev-addon-qrcode
---

# {{ $frontmatter.title }}

### {{ $slidev.configs.author }}

::qr-code::
<MediaEl :src="'qr:' + $frontmatter.url"/>

<!-- Speaker Notes -->

---
src: ../../../src/common/intro.md
---

---
src: ../../../src/common/disclaimer.md
---

---
src: ../../../src/common/toc.md
---

---
layout: section
---

# First Section

---

## Default Layout
### A cool subtitle

- Point one
- Point two
- Point three

<!-- Speaker Notes -->

---
layout: two-cols
---

## Left Column

This shows on the left

::right::

## Right Column

This shows on the right

---
layout: media-right
media: /my-image.jpg
backgroundSize: contain
---

## Media Right

- `media` accepts an image, a video (`.mp4`) or a YouTube URL
- Also available: `media`, `media-left`, `media-full`
- Add `window: true` to show it in a browser frame (`type: mobile` for a phone)

---
layout: quote
---

## Quote Layout

> "The only way to do great work is to love what you do."
>
> — Steve Jobs

---
layout: fact
---

## 42
### A striking number

---

## Code

```ts {2|3}
const greet = (name: string) => {
  const message = `Hello ${name}!`;
  return message;
};
```

---
layout: center
---

## Thank you

_Questions?_

---
src: ../../../src/common/end.md
# feedback QR code on the shared end slide: `qr:<url>` or an image (`/feedback.png`)
qrCode: qr:https://francoiseoche.fr
---
