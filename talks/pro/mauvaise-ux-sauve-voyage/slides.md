---
# === EDIT THESE INFORMATIONS ===
# title of your slide, will inferred from the first header if not specified
# (use search&replace to update)
title: Comment une mauvaise UX a sauvé mon voyage

# slides description
# (use search&replace to update)
info: Ah, les vacances, on se dit que le travail est loin, on laisse ses préoccupations derrière nous...Mais chassez le naturel, il revient au galop ! Tiré d'une histoire vraie d'un 'Ébéniste du Web' en galère ultime, laissez-moi vous narrer comment il ne faut pas prendre à la légère les sujets d'ergonomie des interfaces !

# short summary of the talk, on its website card (default: info)
summary: "Récit sur l'importance universelle de l'expérience utilisateur des formulaires."

# where the talk is given, on its website card
event: RennesJS

# URL of the presentation
# (use search&replace to update)
url: https://feoche.github.io/slides/mauvaise-ux-sauve-voyage/

# date of the presentation
date: 2024-05-16

# keywords field for exported PDF, comma-delimited
keywords: ui/ux, formulaires

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
  ogUrl: https://feoche.github.io/slides/mauvaise-ux-sauve-voyage/
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
<MediaEl :src="'qr:' + $frontmatter.url"/>

<!-- Speaker Notes -->

---
src: ../../../src/common/intro.md
---
=== INTRODUCTION ===
---
src: ../../../src/common/disclaimer.md
---
=== DISCLAIMER ===
---
src: ../../../src/common/toc.md
---
=== TOC ===

---
layout: section
---

# Je suis au Japon et je veux visiter

---
layout: media
media: /train.png
---

## Je prépare ma semaine de voyage
### Dans le train de Kyoto à Tokyo

<Arrow x1="718" y1="450" x2="520" y2="350" width="3" color="white" />

<v-drag pos="720,430,150,_">
  <strong class="text-3xl">
    Pas moi
  </strong>
</v-drag>

---
layout: media
media: /skytree.png
---

## Voir la ville de haut ?
### Allons à la Tokyo Sky Tree !

<!-- 634m de haut -->

---
layout: media-right
media: /7-eleven.png
---

## Trois manières d'y accéder

* Sur place (avec de l'attente)
* En avance (~10/15% moins cher, mais créneaux obligatoires)
  * Guichets de superette <br>(7-eleven)
  * Sites de revente de billets 
  * **Site officiel**

---
layout: media-right
media: /step.png
window: true
url: https://en.tokyo-skytree.jp/ticket/
---

# Let's go ! 
### Le formulaire de réservation

* On choisit la date avec un calendrier
* L'heure avec une liste de créneaux ouverts

---
layout: media-right
media: /step-1.png
window: true
url: https://en.tokyo-skytree.jp/ticket/
class: place-content-center
---

## La date et l’heure, OK — On s’inscrit !
### Le nom / prénom...

---
layout: media-right
media: /step-2.png
window: true
url: https://en.tokyo-skytree.jp/ticket/
class: place-content-center
---

## AH !<br><br>Alors...

---
layout: media-right
media: /step-3.png
window: true
url: https://en.tokyo-skytree.jp/ticket/
---

## Écriture japonaise 101
### On essaye de simplifier tout ça

Types d'écriture :
* Kanas
  * Katakana&emsp;<small>(カタカナ)</small> 👌
  * Hiragana&emsp;<small>(ひらがな)</small> 👍
* Kanji&emsp;&emsp;&emsp;&emsp;&nbsp;<small>(漢字)</small> 👺
<br><br>
### →&nbsp;&nbsp;**振り仮名** 🤔

---
layout: media-right
media: /step-3.png
window: true
url: https://en.tokyo-skytree.jp/ticket/
---

## Écriture japonaise 101
### On essaye de simplifier tout ça

Types d'écriture :
* Kanas
  * Katakana&emsp;<small>(カタカナ)</small> 👌
  * Hiragana&emsp;<small>(ひらがな)</small> 👍
  * <strong>Furigana</strong>&emsp;<small>(振り仮名)</small> 🤯<br>Yomigana&emsp;<small>(読み仮名)</small>
* Kanji&emsp;&emsp;&emsp;&emsp;&nbsp;<small>(漢字)</small> 👺

<!-- x2, parce qu'il fallait faire la même chose pour ma femme -->

---
layout: media-right
media: /step-4.png
window: true
url: https://en.tokyo-skytree.jp/ticket/
---

## Allez, toujours plus...

* Adresse (complète) japonaise
* Code postal en deux parties
* 47 préfectures (~ départements)

---
layout: media-right
media: /step-5.png
window: true
url: https://en.tokyo-skytree.jp/ticket/
---

## ENFIN, un dernier effort !

* Trois champs `<input>` pour le téléphone
* Vérification instantanée du format attendu
* Allez, on envoie !


---
layout: section
---

# Envoi du formulaire en cours...

---
layout: media-full
media: /step-6.png
window: true
---

---
layout: media-full
media: /sad.png
---

<Arrow x1="830" y1="450" x2="670" y2="300" width="3" color="white" />

<v-drag pos="840,430,150,_">
  <strong class="text-3xl">
    Pas moi
  </strong>
</v-drag>

---
layout: section
---

# Plot twist !
---
layout: media-full
media: /skytree-clouds.jpg
---

---

## Conclusion

* Le contexte de vos utilisateurs est clé, <br>surtout pour un site touristique
* Un biais culturel japonais ?
* Plusieurs refontes du site ont permis un accueil plus "international" du lieu
* Attention à l'accessibilité !

---
src: ../../../src/common/end.md
---

toto
o
