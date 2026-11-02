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

[//]: # (src: ../../../src/common/toc.md)

---
layout: section
---

# Introduction

---

## On commence par un exercice 

### Levez la main si... <br> <br>

🤚 Vous pensez que votre **équipe** va bien <br> <br>

<v-clicks>

🤚 **Les gens** se sentent bien dans l'équipe <br> <br>


🤚 Vous êtes en capacité de le **prouver**

</v-clicks>

---

## Individuellement
### À la machine à café, en 1-1...
<br>

"— Ça va ?"

"— Ça va."

...et on passe à autre chose 🤷

<!-- Le réflexe de la machine à café. Tout le monde le fait, tous les jours. -->

---

## Et dans l'équipe...

- 6 personnes au stand-up, 6 « ça va »
- Les tâches prennent plus de temps, le sprint glisse
- L'ambiance devient pesante, le travail très monotone
- On ne se parle plus vraiment
- Un mal-être général, (des arrêts de travail qui sait?)

---
layout: center
---

## On a une "impression"<br> mais pas de mesure

<!-- Une fois qu'on a dit ça, c'est bien, mais à défendre aux managers ou aux RH...ça n'est pas la même -->

---
layout: center
---

## Et si on rendait ça (plus) lisible ?
<br>

<div class="text-8xl">🟩 🔶 🔴</div>

---

## Squad Health Check, c'est quoi ?
- Un atelier Agile pour…
  * Mesurer l'**état de santé** de l'équipe
  * **Prendre du recul** sur le quotidien
  * L'**améliorer** en continu
- Lancé chez **Spotify** en **2014**<br>(Henrik Kniberg & Kristian Lindwall)
- Créé pour des équipes **autonomes** : l'équipe s'auto-évalue

---
layout: section
---

# Présentation de l'atelier

---

## L'atelier Squad Health Check

* Un ensemble de **thèmes**<br><small>(ici ceux de Spotify)</small>
<div class="flex-1 min-h-0 grid grid-cols-3 auto-rows-fr gap-3 mt-2 mb-[--footer-height] text-xl">
  <div class="flex items-center border rounded-lg px-4 font-bold">Rapidité</div>
  <div class="flex items-center border rounded-lg px-4 font-bold">Mission</div>
  <div class="flex items-center border rounded-lg px-4 font-bold">Support</div>
  <div class="flex items-center border rounded-lg px-4 font-bold">Valeur délivrée</div>
  <div class="flex items-center border rounded-lg px-4 font-bold">Facilité à livrer</div>
  <div class="flex items-center border rounded-lg px-4 font-bold">Apprentissage</div>
  <div class="flex items-center border rounded-lg px-4 font-bold">Pions ou joueurs</div>
  <div class="flex items-center border rounded-lg px-4 font-bold">Santé du code</div>
  <div class="flex items-center border rounded-lg px-4 font-bold">️Process</div>
  <div class="flex items-center border rounded-lg px-4 font-bold">Fun</div>
  <div class="flex items-center border rounded-lg px-4 font-bold">Travail d'équipe</div>
</div>

---

## Un exemple : Valeur délivrée

<div class="grid grid-cols-2 gap-8 mt-8 text-2xl">
  <div class="border-2 border-green-600 rounded-lg p-6">
    <div class="font-bold mb-4">🟩 Vert</div>
    Nous livrons du super travail !<br>Nous en sommes fiers et nos parties prenantes sont très satisfaites.
  </div>
  <div class="border-2 border-red-600 rounded-lg p-6">
    <div class="font-bold mb-4">🔴 Rouge</div>
    Nous livrons de la camelote. Nous avons honte de la livrer.<br>Nos parties prenantes nous détestent.
  </div>
</div>

<!--
Exemples vert / rouge tirés des cartes Spotify (traduits).
Le orange est volontairement omis pour permettre la nuance entre le rouge et le vert.
-->

---
layout: two-cols-header
---

## Un round

* Chacun **vote** (face cachée)

::left::

#### Couleur
🟩 Pas parfait, mais OK

🔶 Qques problèmes

🔴 Ça ne va pas


::right::

#### Tendance
↗️ Ça s'améliore

➡️ C'est stable

↘️ Ça se déteriore

::bottom::
* On **dévoile** les votes de tout le monde, <br>et on en **discute** après

<!-- Vert ne signifie pas forcément que tout est parfait. Cela signifie simplement que l'équipe est satisfaite et ne voit pas de besoin majeur d'amélioration pour le moment. -->
<!-- Orange signifie qu'il y a quelques problèmes à résoudre, mais que ce n'est pas catastrophique. -->
<!-- Rouge signifie que quelque chose ne va vraiment pas et doit être amélioré. -->

---
layout: media
media: visio.jpg
---

## Vote en visio <small>(équipe Domain)</small>

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

## Organisation

### Matériel :
* **Tableau blanc/écran**
* **Caméras** (si en ligne)
* Des **objets de couleur** et nos **mains** 

### Rôles :
* Un **médiateur** <small>(membre de l'équipe ou non)</small>
* Le reste de l'équipe <small>(sans exception)</small>
* <small>(**Management** : optionnel, non-recommandé)</small>

---

## Cadre de l'atelier

* **Implication** de l'équipe, focus sur l'atelier
* Discussion **sans jugement**, pas de débat
* Participation **équitable** de tous
* Les notes doivent être **anonymisées**

<!-- Validé par le médiateur et par l'équipe -->

---

## Rôle de médiateur
### Un rôle important

* **"Président de séance"** + timekeeper
* S'assure des **temps de parole**
* Idéalement, **à la fin** :
  * Synthétise l'atelier dans un **compte-rendu** concis
  * Regarde **l'évolution** par rapport aux sessions précédentes
  * Si applicable, partage le résumé avec la **hiérarchie**

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

## Dans notre équipe <small>(OVHcloud Design System)</small>

* On s'est inspiré de la méthode de **Spotify**
* Les **exemples** ne nous convenaient pas forcément<br><br>
### Exemple: **Mission claire** <small>(Clear Mission)</small>
<div class="grid grid-cols-2 gap-8 mt-4 text-xl">
  <div class="border-2 border-red-600 rounded-lg p-4">
    🔴 Nous ne savons pas pourquoi notre équipe existe <strong>ni où nous allons</strong>.
  </div>
  <div class="border-2 border-green-600 rounded-lg p-4">
    🟩 Nous savons pourquoi notre équipe existe <strong>et à quoi ressemble la réussite</strong>.
  </div>
</div>

<!--
Notre carte « Mission claire » (catégorie 3 sur 10) : avec la description des deux extrêmes.
-->

---

## Squad Health Check (à notre sauce)

* **Retravailler** les catégories en scindant les sujets<br>→**15 nouvelles catégories** créées, exemple :
<div class="flex-1 min-h-0 grid grid-cols-3 auto-rows-fr gap-3 mt-2 text-xl">
  <div class="flex items-center border rounded-lg px-4 font-bold">Confiance au déploiement</div>
  <div class="flex items-center border rounded-lg px-4 font-bold">Qualité du code</div>
  <div class="flex items-center border rounded-lg px-4 font-bold">Mission</div>
  <div class="flex items-center border rounded-lg px-4 font-bold">Valeur</div>
  <div class="flex items-center border rounded-lg px-4 font-bold">Autonomie</div>
  <div class="flex items-center border rounded-lg px-4 font-bold">Concentration</div>
  <div class="flex items-center border rounded-lg px-4 font-bold">Charge</div>
  <div class="flex items-center border rounded-lg px-4 font-bold">Collaboration</div>
  <div class="flex items-center border rounded-lg px-4 font-bold">Sécurité psychologique</div>
</div>

* Conception d'un **mode asynchrone**
* Ajout d'un système de **vote** avec des **notes**

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

## Quoi en retenir ?

* Conversation plus **libérée**, plus **franche**
* **Preuve factuelle** ce qui va bien/pas bien
* Focus sur les **points/catégories problématiques**
* L'**évolution et la tendence** au fil des sessions est visible
* **Actions concrètes** à mettre en place

---

## Les limites

- Nécessité de la **confiance de l'équipe**
- Une **censure** au sein de l'équipe reste possible
- Le risque du **"rien à ajouter de plus"**
- Une **image instantanée**, pas une vérité absolue
- La **routine** qui s'installe (si trop fréquent)

---

## Passer à l'action

- Se concentrer sur les retours **rouges** ou **en baisse**
- Choisir **quelques actions concrètes**, avec un responsable
- Vérifier leur effet au **Squad Health Check suivant**
- Suivre les **tendances** dans le temps plutôt qu'un seul résultat

---

## Retours d'une autre équipe <small>(Domain)</small>
### Ce que ça leur a apporté
> - Une forme de **thérapie de groupe**, pour comprendre que tout le monde est **différent**
> - Reconnaître une **période compliquée**, apaiser des **tensions**
> - Clarification de la **vision** et la **stratégie produit**
> - Un **accompagnement** renforcé des **alternants** / **nouveaux**

<!-- Exemples tirés de l'équipe Domain -->

---
layout: section
---

# Conclusion

---

## Squad Health Check

* Un **atelier** récurrent avec **toute l'équipe**
* On **vote** pour soi, tout le monde **partage ses opinions**
* Ça aide à la **cohésion** et la **compréhension** de chacun
* La discussion est **saine** et **utile** pour faire avancer l'équipe
* On n'oublie pas les **actions** à mettre en place
* **Que demande le peuple ?**

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
