---
# === EDIT THESE INFORMATIONS ===
# title of your slide, will inferred from the first header if not specified
# (use search&replace to update)
title: Comment une mauvaise UX a sauvé mon voyage

# slides description
# (use search&replace to update)
info: Ah, les vacances, on se dit que le travail est loin, on laisse ses préoccupations derrière nous...Mais chassez le naturel, il revient au galop ! Tiré d'une histoire vraie d'un 'Ébéniste du Web' en galère ultime, laissez-moi vous narrer comment il ne faut pas prendre à la légère les sujets d'ergonomie des interfaces !

# URL of the presentation
# (use search&replace to update)
url: https://slides.com/feoche/les-bookmarklets-c-est-chouette

# date of the presentation
date: 2024-06-21

# keywords field for exported PDF, comma-delimited
keywords: ux, user-experience, design, reservation, tokyo, humor

# force color schema for the slides, can be 'auto', 'light', or 'dark'
colorSchema: auto

# duration of the presentation
duration: 15min

# HTML tag attributes
htmlAttrs:
  dir: ltr
  lang: fr

# SEO meta tags
seoMeta:
  ogTitle: Comment une mauvaise UX a sauvé mon voyage
  twitterTitle: Comment une mauvaise UX a sauvé mon voyage
  ogDescription: Ah, les vacances, on se dit que le travail est loin, on laisse ses préoccupations derrière nous...Mais chassez le naturel, il revient au galop ! Tiré d'une histoire vraie d'un 'Ébéniste du Web' en galère ultime, laissez-moi vous narrer comment il ne faut pas prendre à la légère les sujets d'ergonomie des interfaces !
  twitterDescription: Ah, les vacances, on se dit que le travail est loin, on laisse ses préoccupations derrière nous...Mais chassez le naturel, il revient au galop ! Tiré d'une histoire vraie d'un 'Ébéniste du Web' en galère ultime, laissez-moi vous narrer comment il ne faut pas prendre à la légère les sujets d'ergonomie des interfaces !

  ogImage: https://www.iamfy.co/cdn/shop/files/m_2Fx1000_2F25dccac9-6ec7-490d-9c7d-5b02facba143_fe3c11a6-046f-402a-bdfa-38a1dcdbc0e4.jpg?crop=center&height=1000&v=1761237025&width=750&quality=60
  ogUrl: https://slides.com/feoche/les-bookmarklets-c-est-chouette
  twitterCard: summary_large_image
  twitterImage: https://pbs.twimg.com/profile_images/1881465971619119105/PdAr46fd_400x400.jpg
  twitterSite: francoiseoche
  twitterUrl: https://x.com/francoiseoche

# theme id, package name, or local path
# Learn more: https://sli.dev/guide/theme-addon.html#use-theme
theme: ../../../src/theme
hideInToc: true
addons:
  - slidev-addon-qrcode
---

# {{ $frontmatter.title }}

### {{ $slidev.configs.author }}

::qr-code::
<QRCode
class="qr-code"
:width="200"
:height="200"
type="svg"
:data="$frontmatter.url"
color="transparent"
:dotsOptions="{ color: 'white' }"
/>

<!-- Speaker Notes -->

---
src: ../../_common/intro.md
---
=== INTRODUCTION ===
---
src: ../../_common/disclaimer.md
---
=== DISCLAIMER ===
---
src: ../../_common/toc.md
---
=== TOC ===

---
layout: section
---

# Je suis au Japon et je veux visiter 🇯🇵

---
layout: media
src: https://s3.amazonaws.com/media-p.slid.es/uploads/419370/images/11341124/pasted-from-clipboard.png
---

## Kyoto → Tokyo, je prépare ma semaine

---
layout: media
src: https://s3.amazonaws.com/media-p.slid.es/uploads/419370/images/11341040/pasted-from-clipboard.png
---

## Voir la ville de haut ?

### 🗼 Allons à la Tokyo Sky Tree !

---
layout: media-right
src: https://s3.amazonaws.com/media-p.slid.es/uploads/419370/images/11341049/Screenshot_2024-05-16_at_18-49-13_TOKYO_SKYTREE_-_Online_reservation___Purchase_site_LINKTIVITY_Activity_Reservation_System.png
window: true
---

# Let's go ! 
### Le formulaire de réservation
---
layout: media-left
src: https://s3.amazonaws.com/media-p.slid.es/uploads/419370/images/11341049/Screenshot_2024-05-16_at_18-49-13_TOKYO_SKYTREE_-_Online_reservation___Purchase_site_LINKTIVITY_Activity_Reservation_System.png
objectFit: cover
window: true
---

# Let's go ! 
### Le formulaire de réservation

---
layout: media
src: https://s3.amazonaws.com/media-p.slid.es/uploads/419370/images/11341057/pasted-from-clipboard.png
window: true
---

## La date et l'heure, OK — On s'inscrit !

---
layout: media
src: https://s3.amazonaws.com/media-p.slid.es/uploads/419370/images/11341062/pasted-from-clipboard.png
---

## La date et l'heure, OK — On s'inscrit !

---
layout: media
src: https://s3.amazonaws.com/media-p.slid.es/uploads/419370/images/11341062/pasted-from-clipboard.png
---

## La date et l'heure, OK — On s'inscrit ! ×2

*(parce qu'on est deux)*

---
layout: media
src: https://s3.amazonaws.com/media-p.slid.es/uploads/419370/images/11341071/pasted-from-clipboard.png
---

## La date et l'heure, OK — On s'inscrit !

---
layout: media
src: https://s3.amazonaws.com/media-p.slid.es/uploads/419370/images/11341080/pasted-from-clipboard.png
---

## ENFIN, on voit la fin !

---
layout: media
src: https://s3.amazonaws.com/media-p.slid.es/uploads/419370/images/11341091/pasted-from-clipboard.png
---

## POUR QU'AU FINAL...

---
layout: media-full
src: https://s3.amazonaws.com/media-p.slid.es/uploads/419370/images/11341102/pasted-from-clipboard.png
---

---
layout: media-full
src: https://s3.amazonaws.com/media-p.slid.es/uploads/419370/images/11341117/tokyo-skytree-clouds.jpg
---

---
layout: center
---

## Merci !

**François Eoche**

[**francoiseoche.fr**](https://slides.com/feoche)
