---
# === EDIT THESE INFORMATIONS ===
# title of your slide, will inferred from the first header if not specified
# (use search&replace to update)
title: "Squad Health Check - Le radar de votre équipe"

# slides description
# (use search&replace to update)
info: "Votre équipe avance, encore et toujours, mais quelque chose coince. Les délais glissent, les tensions montent... Les signaux sont là, mais restent assez flous. L'atelier du Squad Health Check met des mots clairs sur ces signaux, en faisant émerger perceptions et sentiments de chacun sans jugement. Vous verrez dans ce talk comment mesurer et détecter rapidement les points bloquants d'une équipe vue sous toutes ses coutures, afin de permettre de lancer des actions concrètes pour assurer la bonne santé de l'équipe."

# short summary of the talk, on its website card (default: info)
summary: "Un atelier pour mettre des mots clairs sur la santé de votre équipe, sans jugement, et lancer des actions concrètes."

# where the talk is given, on its website card
event: Codeurs en Seine

# URL of the presentation (used by the cover QR code)
url: https://www.codeursenseine.com/2026/programme/quicky-a-1-squad-health-check-le-radar-de-votre-equipe-francois-eoche

# date of the presentation (shown on the cover)
date: 2026-11-19

# keywords field for exported PDF, comma-delimited
keywords: agilité, atelier, équipe

# force color schema for the slides, can be 'auto', 'light', or 'dark'
colorSchema: light

# duration of the presentation
duration: 15min

# HTML tag attributes
htmlAttrs:
  dir: ltr
  lang: fr

# SEO meta tags
seoMeta:
  ogTitle: "Squad Health Check - Le radar de votre équipe"
  twitterTitle: "Squad Health Check - Le radar de votre équipe"
  ogDescription: "Votre équipe avance, encore et toujours, mais quelque chose coince. Les délais glissent, les tensions montent... Les signaux sont là, mais restent assez flous. L'atelier du Squad Health Check met des mots clairs sur ces signaux, en faisant émerger perceptions et sentiments de chacun sans jugement. Vous verrez dans ce talk comment mesurer et détecter rapidement les points bloquants d'une équipe vue sous toutes ses coutures, afin de permettre de lancer des actions concrètes pour assurer la bonne santé de l'équipe."
  twitterDescription: "Votre équipe avance, encore et toujours, mais quelque chose coince. Les délais glissent, les tensions montent... Les signaux sont là, mais restent assez flous. L'atelier du Squad Health Check met des mots clairs sur ces signaux, en faisant émerger perceptions et sentiments de chacun sans jugement. Vous verrez dans ce talk comment mesurer et détecter rapidement les points bloquants d'une équipe vue sous toutes ses coutures, afin de permettre de lancer des actions concrètes pour assurer la bonne santé de l'équipe."
  ogUrl: https://www.codeursenseine.com/2026/programme/quicky-a-1-squad-health-check-le-radar-de-votre-equipe-francois-eoche
  twitterCard: summary_large_image
  twitterSite: francoiseoche
  twitterUrl: https://x.com/francoiseoche

# theme id, package name, or local path
# Learn more: https://sli.dev/guide/theme-addon.html#use-theme
theme: "../../../src/theme"
# override the theme palette (OVHcloud Design System colors)
themeConfig:
  primary: "#00185E"
  secondary: "#0d3679"
  light: "#ffffff"
  link: "#0050d7"
  highlight-link: "#ffffff"
layout: cover
hideInToc: true
addons:
  - slidev-addon-qrcode
---

# Squad Health Check<br>Le radar de votre équipe

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

## On commence par un exercice 

### Levez la main si...

🤚 Vous pensez que votre **équipe** va bien<br><br>

<v-clicks>

### Gardez la main levée si...<br>

🤚 **Les gens** se sentent bien dans l'équipe<br><br>

🤚 Vous êtes en capacité de le **prouver** et le **mesurer**

</v-clicks>

---

## Individuellement
### À la machine à café, en 1-1...
<br>

"— Ça va ?"

**"— Ça va."**

...et on passe à autre chose 🤷

<!-- Le réflexe de la machine à café. Tout le monde le fait, tous les jours. -->

---

## Et dans l'équipe...

- 6 personnes au stand-up, 6 **« ça va »**
- Le travail devient **monotone**, l'ambiance très **pesante**, 
- Les tâches prennent **+ de temps**, le **sprint glisse**
- On ne se **parle plus** vraiment
- Un **mal-être** général <small>(des arrêts de travail, qui sait ?)</small>

---
layout: center
---

## On a une "impression"<br>mais pas de mesure

<!-- Une fois qu'on a dit ça, c'est bien, mais à défendre aux managers ou aux RH...ça n'est pas la même -->

---
layout: center
---

## Et si on rendait ça (plus) lisible ?
<br>

<div class="text-8xl">🟩 🔶 🔴</div>

---

## Squad Health Check, c'est quoi ?
- Un atelier Agile pour :
  * Mesurer l'**état de santé** de l'équipe
  * **Prendre du recul** sur le quotidien
  * L'**améliorer** en continu
- Lancé chez **Spotify** en **2014**<br>(Henrik Kniberg & Kristian Lindwall)
- Créé pour des équipes **autonomes** : l'équipe **s'auto-évalue**

---
layout: section
---

# Présentation de l'atelier

---

## L'atelier Squad Health Check

* Un ensemble de **thèmes**<br><small>(ici ceux de Spotify)</small>
<div class="min-h-0 grid grid-cols-3 auto-rows-fr gap-3 mt-2 mb-[--footer-height] text-xl">
  <div class="flex items-center border rounded-lg px-4 py-2 font-bold">Rapidité</div>
  <div class="flex items-center border rounded-lg px-4 py-2 font-bold">Mission</div>
  <div class="flex items-center border rounded-lg px-4 py-2 font-bold">Support</div>
  <div class="flex items-center border rounded-lg px-4 py-2 font-bold">Valeur délivrée</div>
  <div class="flex items-center border rounded-lg px-4 py-2 font-bold">Facilité à livrer</div>
  <div class="flex items-center border rounded-lg px-4 py-2 font-bold">Apprentissage</div>
  <div class="flex items-center border rounded-lg px-4 py-2 font-bold">Pions ou joueurs</div>
  <div class="flex items-center border rounded-lg px-4 py-2 font-bold">Santé du code</div>
  <div class="flex items-center border rounded-lg px-4 py-2 font-bold">️Process</div>
  <div class="flex items-center border rounded-lg px-4 py-2 font-bold">Fun</div>
  <div class="flex items-center border rounded-lg px-4 py-2 font-bold">Travail d'équipe</div>
</div>

---

## Dans chaque thème
### Ex: Valeur délivrée

<div class="flex-1 grid grid-cols-2 gap-8 my-8 text-2xl">
  <div class="border-2 border-red-600 rounded-lg p-6">
    <div class="font-bold mb-4">🔴 Rouge</div>
    Nous livrons de la camelote.<br><br>Nous avons honte de la livrer.<br><br>Nos parties prenantes nous détestent.
  </div>
  <div class="border-2 border-green-600 rounded-lg p-6">
    <div class="font-bold mb-4">🟩 Vert</div>
    Nous livrons du super travail !<br><br>Nous en sommes fiers et nos parties prenantes sont très satisfaites.
  </div>
</div>

<!--
Exemples vert / rouge tirés des cartes Spotify (traduits).
Le orange est volontairement omis pour permettre la nuance entre le rouge et le vert.
-->

---

## Pour <u>tous</u> les thèmes
###
* On **vote** (face cachée) pour la **couleur** et la **tendance** :

| **Couleur** | **Tendance** |
|---|---|
| 🟩 Pas forcément parfait, mais on peut vivre avec | ↗️ S'**améliore** |
| 🔶 Quelques problèmes à résoudre | ➡️ Est **stable** |
| 🔴 Ça ne va vraiment pas ! | ↘️ Se **déteriore** |

<br>

* On **dévoile** les votes de tout le monde
* On en **discute**

<!-- Vert ne signifie pas forcément que tout est parfait. Cela signifie simplement que l'équipe est satisfaite et ne voit pas de besoin majeur d'amélioration pour le moment. -->
<!-- Orange signifie qu'il y a quelques problèmes à résoudre, mais que ce n'est pas catastrophique. -->
<!-- Rouge signifie que quelque chose ne va vraiment pas et doit être amélioré. -->

---
layout: media
media: visio.jpg
---

## Vote en visio <small>(équipe Domain)</small>

<!---
### Matériel :
* **Tableau blanc/écran**
* **Caméras** (si en ligne)
* Des **objets de couleur** et nos **mains** 

### Rôles :
* Un **médiateur** <small>(membre de l'équipe ou non)</small>
* Le **reste de l'équipe** <small>(sans le management)</small>
-->

---

## Format de l'atelier

### Durée :
* **Prendre le temps**
* Pas de **durée max** par thème
* Idéalement, environ **2h**

### Récurrence :

- Ponctuel : nouvel **arrivant**, nouvelle **organisation**
- Régulier : tous les **trimestres**, ou après une livraison **majeure**

<!-- Durée : entre 1h et 4h maximum -->
<!-- Récurrence : entre 2 mois et 6 mois -->

---

## Toute l'équipe
### ...sans exception

* 10 personnes **max**
* **Focus** sur l'atelier !
* Implication et participation **équitable** de tous
* Discussion **sans jugement**, pas de **débat**

<small>(Management : optionnel, et non recommandé)</small>

<!-- Validé par le médiateur et par l'équipe -->

---

## Le médiateur
### Un rôle important

* **"Président de séance"** (et un peu timekeeper)
* S'assure des **temps de parole**<br><br>
* **À la fin** :
  * Synthétise l'atelier dans un **compte-rendu** concis
  * Regarde **la tendance** avec les sessions précédentes
  * Partage le résumé avec la **hiérarchie**

---
layout: media
media: spotify-sumup.png
---

## Résultat chez Spotify

---
layout: section
---

# Chez OVHcloud

<!-- **Plusieurs équipes** l'utilisent en interne 
**Inspiration** de la méthode de Spotify 
De manière **"classique"** ou **customisée** -->

---

## Squad Health Check (à notre sauce)

* Les **exemples** des catégories ne nous convenaient pas :<br>

<div class="grid grid-cols-2 gap-8 mt-4 text-xl">
  <div class="border-2 border-red-600 rounded-lg p-4">
    🔴 Nous ne savons pas pourquoi notre équipe existe <strong>ni où nous allons</strong>.
  </div>
  <div class="border-2 border-green-600 rounded-lg p-4">
    🟩 Nous savons pourquoi notre équipe existe <strong>et à quoi ressemble la réussite</strong>.
  </div>
</div>
<br><br>

<v-clicks>

* On a créé **15 nouvelles catégories** en retravaillant les sujets<br>
* Puis un **mode asynchrone** pour se concentrer sur l'échange
* Et un système de vote avec une **échelle de notes (1-9)**
* Et...un **outil** <small>(on est fronteux après tout)</small>

</v-clicks>

<!--
Notre carte « Mission claire » (catégorie 3 sur 10) : avec la description des deux extrêmes.
On garde nos catégories à chaque fois
-->

---
layout: media-full
media: shc.png
url: feoche.github.io/squad-health-check
window: true
---

---
layout: section
---

# Résultats de l'atelier

---

## L'apport de l'atelier

### Les limites

* Nécessité de la **confiance de l'équipe**

  ⮡ Une **censure** au sein de l'équipe reste possible
* Le risque du **"rien à ajouter"**
* Une **image instantanée**, pas une vérité absolue
* La **routine** qui s'installe <small>(si trop fréquent)</small>

---

## L'apport de l'atelier

### Les résultats

* Une **preuve factuelle** de ce qui va bien / pas bien
* Focus sur les **signaux faibles** et les **irritants** de l'équipe
* L'**évolution** et la **tendance** est analysable

### ...Qui ouvrent la porte à
* Des **actions concrètes** à mettre en place et à partager
* Un levier fort pour gagner en **cohésion**, **productivité**

<!--
* Les **irritants** remontés : process, outillage, dette...
* Une équipe **engagée** livre mieux et plus **sereinement**
* Un **indicateur** suivi dans le temps, pour **arbitrer** et demander des **moyens**
-->

---

## Retours d'une autre équipe <small>(Domain)</small>
### Ce que le Squad Health Check leur apporte
> - Une forme de **thérapie de groupe**, pour comprendre que tout le monde est **différent**
> - Le **thermomètre** du **bien-être** (ou non) de l'équipe
> - Une équipe qui se sent **écoutée** = une parole qui se **libère**
> - Reconnaître une **période compliquée**, apaiser des **tensions**
> - Clarification de la **vision** et la **stratégie produit**
> - Un **accompagnement** renforcé des **alternants** / **nouveaux**

<!-- 
Exemples tirés de l'équipe Domain 
-->

---
layout: section
---

# Conclusion

---

## Squad Health Check

* 👥 Un **atelier** récurrent avec **toute l'équipe**<br><br>
* 🔓 Ça peut **débloquer** des choses<br><br>
* 💆 **Ça fait du bien** à l'équipe<br><br>
* 👏 **Que demande le peuple ?**

---

## Remerciements

* 🌐 **Mathieu Cornic**, **Brendan Seiller** et l'équipe Domain 👋<br><br>
* 👨‍💻 **Henrik Kniberg** & **Kristian Lindwall** pour le modèle<br><br>
* 💅 **Codeurs en Seine** pour leur accueil<br><br>
* 🥰 Et **vous** !

---
src: ../../../src/common/end.md
qrCode: qr:https://roti.express/r/feoche-shc-2026-11
---

---
layout: media
media: qr:https://feoche.github.io/squad-health-check/#/session/BRONZE
---

## Demo

---
layout: media-full
media: shc.png
---

---
layout: media-full
media: shc-1.png
---

---
layout: media-full
media: shc-2.png
---

---
layout: media-full
media: shc-3.png
---

---
layout: media-full
media: shc-4.png
---

---
layout: media-full
media: shc-5.png
---

---
layout: media-full
media: shc-6.png
---

---
layout: media-full
media: shc-admin-1.png
---

---
layout: media-full
media: shc-admin-2.png
---

---
layout: media-full
media: shc-admin-3.png
---

---
layout: media-full
media: shc-admin-4.png
---

---
layout: media-full
media: shc-admin-5.png
---
