---
# === EDIT THESE INFORMATIONS ===
# title of your slide, will inferred from the first header if not specified
# (use search&replace to update)
title: Les bookmarklets, c'est chouette !

# slides description
# (use search&replace to update)
info: Les bookmarklets, ça existe depuis 2005 et ça n'arrête pas de se réinventer ! Venez découvrir le best of des meilleurs bookmarklets triés sur le volet.

# URL of the presentation
# (use search&replace to update)
url: https://slides.com/feoche/les-bookmarklets-c-est-chouette

# date of the presentation
date: 2024-06-21

# keywords field for exported PDF, comma-delimited
keywords: bookmarklets, javascript, web development

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
  ogTitle: Les bookmarklets, c'est chouette !
  twitterTitle: Les bookmarklets, c'est chouette !
  ogDescription: Les bookmarklets, ça existe depuis 2005 et ça n'arrête pas de se réinventer ! Venez découvrir le best of des meilleurs bookmarklets triés sur le volet.
  twitterDescription: Les bookmarklets, ça existe depuis 2005 et ça n'arrête pas de se réinventer ! Venez découvrir le best of des meilleurs bookmarklets triés sur le volet.

  ogImage: https://www.iamfy.co/cdn/shop/files/m_2Fx1000_2F25dccac9-6ec7-490d-9c7d-5b02facba143_fe3c11a6-046f-402a-bdfa-38a1dcdbc0e4.jpg?crop=center&height=1000&v=1761237025&width=750&quality=60
  ogUrl: https://francoiseoche.fr/
  twitterCard: summary_large_image
  twitterImage: https://pbs.twimg.com/profile_images/1881465971619119105/PdAr46fd_400x400.jpg
  twitterSite: francoiseoche
  twitterUrl: https://x.com/francoiseoche

# theme id, package name, or local path
# Learn more: https://sli.dev/guide/theme-addon.html#use-theme
theme: "../../../theme"
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

# Les bookmarklets, kézako ?

---
layout: quote
---

## Les bookmarklets, kézako ?

<style>
p,li {
  font-size: 1.3rem;
  line-height: 1.3;
}
ul {
    gap: 0.5rem;
    margin: 0.3rem 0 0.7rem;
}
</style>

> <small>_(de Wikipedia)_</small>
> 
> Un **bookmarklet** (fr : *signapplet*, *applisignet*, *marque-page scripté*) est un petit programme JavaScript
> stocké :
>
> - en tant qu'**URL** dans un signet (marque-page / favori)
> - en tant qu'**hyperlien** dans une page web
>
> Lors de la sélection du signet, le navigateur exécute le code JavaScript pour :
>
> - modifier le rendu graphique d'une page
> - récupérer des informations
> - interroger un moteur de recherche
> - soumettre la page à un service tiers
>
> L'URL commence par **`javascript:`** et est suivie du code à exécuter.

---

## En résumé

- Un petit bout de script
- Qui commence par **`javascript:`**
- Qui se lance en un clic
- Et qui fait des trucs.

*Et c'est trop bien.*

*Oui c'est vieux — de **2001** O\_O — mais c'est bien.*

---
layout: two-cols
---

<style>
ul {
    list-style: none;
    display: flex;
    height: 100%;
    place-content: space-between;
    margin: 2rem 0;
}
li {
    margin: 0;
    padding: 0;
}
</style>

::left::

## Les +

* ✅ Fait pour des petits scripts

* ✅ Très léger en performance

* ✅ Facile à installer/utiliser

* ✅ Pas de permissions

::right::

## Les -

* ⛔ Pas très connu

* ⛔ Remplacés par extensions

* ⛔ Difficile à maintenir à jour

* ⛔ Compatibilité

* ⛔ Certains scripts bloqués

---
layout: section
---

# Place aux exemples !

---

## Au programme

- De l'accessibilité 👀
- De la visualisation 📰
- Des tests 🧠
- Un exemple grandeur nature 🌲
- Du bonus ! 🐒

---
layout: media-right
media: /html-codesniffer.jpg
backgroundSize: contain
---

## [HTML CodeSniffer](https://squizlabs.github.io/HTML_CodeSniffer/)

- Listing des erreurs et warnings de DOM + CSS
- Check des standards WCAG 2.1 d'accessibilité

---
layout: media-right
media: /color-contrast-checker.jpg
backgroundSize: contain
---

## [Color Contrast Checker](https://webaim.org/resources/contrastchecker/bookmarklet)

- Vérifier la compatibilité de deux couleurs et leur accessibilité

---
layout: media-right
media: /css-layout-debugger.jpg
backgroundSize: contain
---

## [CSS Layout Debugger](https://gist.github.com/addyosmani/fd3999ea7fce242756b1)

- Permet de montrer les structures de layout d'une page
- Un code golf de **108 bytes** (!)

---
layout: media-right
media: /nojs-side-by-side.jpg
backgroundSize: contain
---

## [NoJS Side-by-side](https://workeffortwaste.github.io/nojs-side-by-side/)

- Test de page avec/sans JS

---
layout: media-right
media: /fount.jpg
backgroundSize: contain
---

## [Fount](https://fount.artequalswork.com/)

- Identifier les polices d'écriture à la sélection + styles de font
- *WhatFont* existe aussi et est devenu une extension navigateur

---
layout: media-right
media: /web-font-picker.jpg
backgroundSize: contain
---

## [Web Font Picker](https://github.com/danielgavrilov/WebFontPicker/blob/master/bookmarklet.js)

- Permet de tester une liste de web-fonts sur un sélecteur CSS donné

---
layout: media-right
media: /perf-map.jpg
backgroundSize: contain
---

## [PerfMap](https://github.com/zeman/perfmap)

- Une heatmap visuelle du chargement des assets de la page

---
layout: media-right
media: /performance-bookmarklet.jpg
backgroundSize: contain
---

## [Performance-Bookmarklet](https://github.com/micmro/performance-bookmarklet)

- Résultat visuel et en détail des calculs et requêtes de la page

---
layout: media-right
media: /oui-seo.jpg
backgroundSize: contain
---

## [OuiSEO](https://carlsednaoui.github.io/seo-bookmarklet/install.html)

- Montre les metatags utilisés sur la page pour le SEO

---
layout: media-right
media: /ovhcloud.jpg
backgroundSize: contain
---

## Chez OVHcloud

- Listing des composants UI
- Highlight en fonction de leur provenance (natif, web component, etc.)
- Couverture des composants

---
layout: section
---

# Bonus !

---
layout: media-right
media: /stats-js.jpg
backgroundSize: contain
---

## [stats.js](https://github.com/mrdoob/stats.js)

- Moniteur de FPS, ms pour rendre une frame, mémoires utilisée en temps réel

---
layout: media-right
media: /bookmarklets-for-developers.jpg
backgroundSize: contain
---

## [Bookmarklets for developers](https://bookmarklets.app.quest/)

Des bookmarklets de fonctions JS "clés en main":

- CleanStorage
- Debugger
- ...

---
layout: media-right
media: /gremlins-js.jpg
backgroundSize: contain
---

## [Gremlins.js](https://marmelab.com/gremlins.js/)

Monkey testing de BÂTARD 🙊

- des clics
- des scrolls
- des swipes
- des touches clavier
- le tout en même temps

---
layout: media-right
media: /revenge-css.jpg
backgroundSize: contain
---

## [Revenge.CSS](https://web.archive.org/web/20190309062846/http://heydonworks.com/revenge_css_bookmarklet)

- Check "classique" des erreurs de DOM
- Les erreurs sont notées sur l'élément concerné, en **Comic Sans MS** sur fond rouge 😂

---
layout: media-right
media: /content-editable.jpg
backgroundSize: contain
---

## [ContentEditable](https://github.com/msankhala/editable-bookmarklet)

- Rend le texte de toute la page éditable
- Pratique pour faire des **PRANKS** à ses collègues 😏

---
layout: media
media: /bookmarkleter.jpg
backgroundSize: cover
---

## DIY your Bookmarklet : [Bookmarkleter](http://chriszarate.github.io/bookmarkleter/)

---
layout: center
---

## La prochaine fois, on parle de Greasemonkey ! 🙊

### *\#2015*

---
src: ../../_common/end.md 
---