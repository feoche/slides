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

## On commence par un exercice 

### Levez la main si...

🤚 Vous pensez que votre **équipe** va bien<br><br>

<v-clicks>

### Gardez la main levée si...<br>

🤚 **Les gens** se sentent bien dans l'équipe<br><br>

🤚 Vous êtes en capacité de le **prouver** et le **mesurer**

</v-clicks>

---

## La situation, vous la connaissez.

- "Ça va ?" **"Ça va."**
- Le travail devient **monotone**, l'ambiance très **pesante**
- On ne se **parle plus** vraiment
- Les tâches prennent **+ de temps**, le **sprint glisse**
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
- Lancé chez **Spotify** en **2014**<br><small>(Henrik Kniberg & Kristian Lindwall)</small>
- Un atelier Agile pour :
  * Mesurer l'**état de santé** de l'équipe
  * **Prendre du recul** sur le quotidien
  * L'**améliorer** en continu

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
  <div class="flex items-center border rounded-lg px-4 py-2 font-bold">Process</div>
  <div class="flex items-center border rounded-lg px-4 py-2 font-bold">Fun</div>
  <div class="flex items-center border rounded-lg px-4 py-2 font-bold">Travail d'équipe</div>
</div>

---

## Un round de Squad Health Check
###
<div class="flex-1 flex flex-col items-center justify-center mb-[--footer-height]">

```mermaid {scale: 1}
%%{init: {'flowchart': {'curve': 'basis', 'padding': 8, 'rankSpacing': 35}, 'themeVariables': {'fontFamily': 'inherit'}}}%%
flowchart LR
  A("<div style='width:175px;height:185px;display:flex;align-items:center;justify-content:center'><div style='line-height:1.3;font-size:26px'><span style='font-size:48px;line-height:1.2'>📋</span><br><b>Présentation</b><br>du thème</div></div>") ==> B("<div style='width:175px;height:185px;display:flex;align-items:center;justify-content:center'><div style='line-height:1.3;font-size:26px'><b>Vote</b><table><tr><td style='padding:0 8px;line-height:1.35;font-size:30px'>🟢<br>🟠<br>🔴</td><td style='padding:0 8px;line-height:1.35;font-size:30px'>➕</td><td style='padding:0 8px;line-height:1.35;font-size:30px'>↗️<br>➡️<br>↘️</td></tr></table></div></div>")
  B ==> R("<div style='width:175px;height:185px;display:flex;align-items:center;justify-content:center'><div style='line-height:1.3;font-size:26px'><span style='font-size:48px;line-height:1.2'>🃏</span><br><b>Dévoilement</b><br>des votes</div></div>")
  R ==> C("<div style='width:175px;height:185px;display:flex;align-items:center;justify-content:center'><div style='line-height:1.3;font-size:26px'><span style='font-size:48px;line-height:1.2'>💬</span><br><b>Discussion</b></div></div>")
  C ==> A
  classDef default fill:#eef3fb,stroke:#00185E,stroke-width:3px,color:#00185E
  linkStyle default stroke:#00185E,stroke-width:3px
```

<div class="text-5xl font-bold mt-2">×10</div>

</div>

<!-- Vert ne signifie pas forcément que tout est parfait. Cela signifie simplement que l'équipe est satisfaite et ne voit pas de besoin majeur d'amélioration pour le moment. -->
<!-- Orange signifie qu'il y a quelques problèmes à résoudre, mais que ce n'est pas catastrophique. -->
<!-- Rouge signifie que quelque chose ne va vraiment pas et doit être amélioré. -->

---

## Dans chaque thème
### Ex. : Valeur délivrée

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
**À la fin** :
  * Synthétise l'atelier dans un **compte-rendu** concis
  * Regarde **la tendance** avec les sessions précédentes
  * Partage le résumé **anonymisé** avec la **hiérarchie**

---

## Résultat chez Spotify

<div class="shc-results">

| | Squad 1 | Squad 2 | Squad 3 | Squad 4 | Squad 5 | Squad 6 | Squad 7 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Support | <i class="g"></i> | <i class="y"></i> | <i class="g"></i> | <i class="g"></i> | <i class="g"></i> | <i class="y d"></i> | <i class="g"></i> |
| Travail d'équipe | <i class="g u"></i> | <i class="y u"></i> | <i class="y"></i> | <i class="g"></i> | <i class="g"></i> | <i class="y"></i> | <i class="y u"></i> |
| Pions ou joueurs | <i class="g d"></i> | <i class="r u"></i> | <i class="y"></i> | <i class="g u"></i> | <i class="g"></i> | <i class="y"></i> | <i class="y u"></i> |
| Mission | <i class="g"></i> | <i class="r u"></i> | <i class="g"></i> | <i class="g u"></i> | <i class="g"></i> | <i class="g"></i> | <i class="g u"></i> |
| Santé du code | <i class="r"></i> | <i class="r u"></i> | <i class="g"></i> | <i class="y u"></i> | <i class="y u"></i> | <i class="r"></i> | <i class="r u"></i> |
| Process | <i class="g"></i> | <i class="r"></i> | <i class="g"></i> | <i class="g u"></i> | <i class="g"></i> | <i class="y u"></i> | <i class="y u"></i> |
| Valeur délivrée | <i class="n"></i> | <i class="y u"></i> | <i class="g"></i> | <i class="g u"></i> | <i class="g"></i> | <i class="g u"></i> | <i class="y u"></i> |
| Apprentissage | <i class="g u"></i> | <i class="y u"></i> | <i class="y"></i> | <i class="g u"></i> | <i class="y"></i> | <i class="y"></i> | <i class="g u"></i> |
| Rapidité | <i class="y u"></i> | <i class="r u"></i> | <i class="y"></i> | <i class="y u"></i> | <i class="y"></i> | <i class="y"></i> | <i class="y u"></i> |
| Facilité à livrer | <i class="y"></i> | <i class="r"></i> | <i class="y"></i> | <i class="y u"></i> | <i class="y"></i> | <i class="r u"></i> | <i class="y u"></i> |
| Fun | <i class="g u"></i> | <i class="g u"></i> | <i class="g"></i> | <i class="g u"></i> | <i class="g"></i> | <i class="g"></i> | <i class="g u"></i> |

</div>

<style>
.shc-results table {
  @apply w-full text-base;
}
.shc-results thead {
  @apply bg-transparent;
}
.shc-results th,
.shc-results td {
  @apply border-0 border-b border-dotted border-gray-400 px-3 py-1 whitespace-nowrap;
}
.shc-results td:first-child {
  @apply font-bold text-right;
}
/* vote dots, as on Spotify's board: g/y/r colour, n no vote, u/d trend */
.shc-results i {
  @apply relative inline-block align-middle w-5 h-5 rounded-full border-2 border-gray-800;
}
.shc-results i.g { background: #7ed321; }
.shc-results i.y { background: #f8e71c; }
.shc-results i.r { background: #e8463c; }
.shc-results i.n { background: #fff; }
.shc-results i.u::after,
.shc-results i.d::after {
  content: "";
  @apply absolute left-1/2 top-1/2 border-x-[0.3rem] border-x-transparent border-b-[0.4rem] border-b-black;
  /* a triangle pointing up, turned to the diagonal and pushed against the dot's edge */
  transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-0.8rem);
}
.shc-results i.u::after {
  --angle: 45deg;
}
.shc-results i.d::after {
  --angle: 135deg;
}
</style>

---
layout: section
---

# Chez OVHcloud

<!-- **Plusieurs équipes** l'utilisent en interne 
**Inspiration** de la méthode de Spotify 
De manière **"classique"** ou **customisée** -->

---

## Squad Health Check (à notre sauce)

* Les **exemples** des catégories ne nous convenaient pas :

<div class="grid grid-cols-2 gap-8 text-xl">
  <div class="border-2 border-red-600 rounded-lg p-4">
    🔴 Nous n'avons aucune idée de pourquoi nous sommes là, <strong>il n'y a ni vision d'ensemble ni cap</strong>.
  </div>
  <div class="border-2 border-green-600 rounded-lg p-4">
    🟩 Nous savons exactement pourquoi nous sommes là, <strong>et ça nous enthousiasme vraiment</strong>.
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
Carte « Mission » de Spotify (traduite) : trop vague, on l'a retravaillée avec les autres dans nos 15 catégories.
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

## Les limites de l'atelier

* Nécessité de la **confiance de l'équipe**

  ⮡ Une **censure** au sein de l'équipe reste possible
* Le risque du **"rien à ajouter"**
* Une **image instantanée**, pas une vérité absolue
* La **routine** qui s'installe <small>(si trop fréquent)</small>

---

## L'apport de l'atelier

* Une **preuve factuelle** de ce qui va bien / pas bien
* Focus sur les **signaux faibles** et les **irritants** de l'équipe
* L'**évolution** et la **tendance** sont analysables<br><br>

...Qui ouvre la porte à :
* Des **actions concrètes** à mettre en place et à partager
* Un levier fort pour gagner en **cohésion**, **productivité**

<!--
* Les **irritants** remontés : process, outillage, dette...
* Une équipe **engagée** livre mieux et plus **sereinement**
* Un **indicateur** suivi dans le temps, pour **arbitrer** et demander des **moyens**

## Retours d'une autre équipe <small>(Domain)</small>
### Ce que le Squad Health Check leur apporte
> - Une forme de **thérapie de groupe**, pour comprendre que tout le monde est **différent**
> - Le **thermomètre** du **bien-être** (ou non) de l'équipe
> - Une équipe qui se sent **écoutée** = une parole qui se **libère**
> - Reconnaître une **période compliquée**, apaiser des **tensions**
> - Clarification de la **vision** et la **stratégie produit**
> - Un **accompagnement** renforcé des **alternants** / **nouveaux**
-->

---
layout: section
---

# Conclusion

---

## Squad Health Check

* ### 👥 Un **atelier** récurrent avec **toute l'équipe**<br><br>
* ### 🔓 Ça peut **débloquer** des choses<br><br>
* ### 💆 **Ça fait du bien** à l'équipe<br><br>
* ### 👏 **Que demande le peuple ?**

---

## Remerciements

* 🌐 **Mathieu Cornic**, **Brendan Seiller** et l'équipe Domain 👋<br><br>
* 👨‍💻 Les équipes de **Spotify** pour le modèle<br><br>
* 🎤 **Codeurs en Seine** pour leur accueil<br><br>
* 🥰 Et **vous** !

---
src: ../../../src/common/end.md
qrCode: qr:https://roti.express/r/feoche-shc-2026-11
---

---
layout: media
media: qr:https://feoche.github.io/squad-health-check/#/session/RECORD
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
