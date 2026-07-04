---
theme: ../../../src/theme
colorSchema: auto
title: "Ionic — The Hybrid Theory"
author: "François Eoche"
lang: fr
---

---
layout: cover
---

# Ionic — The Hybrid Theory

---
layout: intro
---

## Qui suis-je ?

**François Eoche**

- Ingénieur d'études à Niji depuis 2 ans
- Développeur Web / Web mobile / Hybride
- Full-stack, avec préférence pour le front
- [@feoche](https://twitter.com/feoche)

---
layout: default
---

## Projets récents à Niji (2015)

| Client | Projet | Type |
|---|---|---|
| Natixis | Rouler Serein | Mobile hybride |
| ERDF | A mes côtés | Mobile hybride |
| Virgin Mobile | Plateforme eBoutique | Web |
| AonAuto | Application mobile | Hybride (en cours) |

---
layout: section
---

# Problématique et solutions

---
layout: default
---

## Prenons un cas concret à Niji…

> Je souhaite créer une application native.
> Pour quelles plateformes ?
> **iOS, Android et Windows Phone.**

*Sort sa merveilleuse calculette* 🧮

> 3 × 300K ! C'est cher dis donc…

---
layout: default
---

## Trop cher ? Des solutions ?

- **Site web mobile** — Unité de code, mais pas d'accès aux fonctions natives
- **NativeScript** — Styles adaptés au device ciblé (Material Design, etc.)
- **React Native** — JavaScript vers natif, bon compromis
- **Ionic** ← notre choix chez Niji

---
layout: default
---

## Autres outils

| Outil | Description | Contrainte |
|---|---|---|
| Xamarin | Du sur mesure | En C#, outil payant |
| Appcelerator | Beaucoup d'intégrations | XML, outil payant |
| Ionic | HTML5/Angular | Gratuit & open source |

---
layout: section
---

# Ionic

## Advanced HTML5 Hybrid Mobile App Framework

---
layout: default
---

## Comment ça se passe ?

```
Ionic (HTML/CSS/JS)
  → AngularJS
    → WebView (Cordova)
      → Native SDK
        → Application native
```

Après avoir "build" l'appli avec des tâches Gulp, c'est restitué en tant qu'**Application Web embarquée**.

---
layout: section
---

## Ionic, ça apporte quoi ?

---
layout: default
---

## Des interfaces pré-construites

```html
<div class="bar bar-header">
  <div class="h1 title">List Icons</div>
</div>
<ul class="list">
  <li class="item item-icon-left">
    <i class="icon ion-email"></i> Check email
  </li>
</ul>
```

---
layout: default
---

## Des directives Angular

```html
<ion-slide-box on-slide-changed="slideHasChanged($index)">
  <ion-slide>
    <div class="box blue"><h1>BLUE</h1></div>
  </ion-slide>
  <ion-slide>
    <div class="box yellow"><h1>YELLOW</h1></div>
  </ion-slide>
</ion-slide-box>
```

---
layout: default
---

## Une gestion fine des devices

Adaptation de l'interface en fonction de l'OS et des versions (iOS vs Android).

---
layout: default
---

## Un lien entre natif et Web via Cordova

```js
angular.module('mySuperApp', ['ionic'])
  .controller(function($scope, $ionicActionSheet, $timeout) {
    $scope.show = function() {
      var hideSheet = $ionicActionSheet.show({ ... });
      $timeout(hideSheet, 2000);
    };
  });
```

---
layout: default
---

## Un CLI bien fourni

```bash
ionic serve          # Serveur local visible par navigateur
ionic resources      # Générateur d'icônes/splashscreens
ionic build android  # Build Android
ionic run ios        # Run sur device iOS
```

---
layout: section
---

# Retour d'expérience sur les projets hybrides à Niji

---
layout: default
---

## Pourquoi l'hybride en premier lieu ?

- Solution moins coûteuse que le développement natif
- Demande explicite des clients
- Retours positifs après les premiers projets → mis en avant par Niji

---
layout: default
---

## Épisode 1 — Natixis Rouler Serein

- 3 développeurs Web
- Premier projet Angular pour 2/3 dev → pas de maturité sur la techno
- Hiérarchie du projet bancale, utilisation abusive du `$rootScope`
- Problèmes majeurs d'interface sur Android (WebView) ← **point noir**

---
layout: default
---

## Épisode 2 — ERDF A mes côtés

- 3 développeurs Web
- Design ambitieux pour une technologie hybride
- Évolution sur la techno grâce aux experts Angular
- Gain notable en performance grâce à **CrossWalk** (WebView custom)

---
layout: default
---

## Épisode 3 — Aon Auto

- 3 développeurs Web
- Utilisation d'ES2015 + Babel pour plus de souplesse
- Problèmes majeurs sur la gestion des **notifications Push**
- VABF en cours…

> "Rouler serein ? Pas tout le temps."

---
layout: default
---

## Finalement…

- ✅ Ionic est utile sur des besoins fonctionnels simples
- ⚠️ Le dev Windows Phone a bien évolué, mais pas encore ça
- 🌍 La communauté Cordova/Ionic est très active
- 👀 Ionic 2 (basé sur Angular 2) à suivre — **3× plus performant**

---
layout: default
---

## Ionic 2

- Basé sur **Angular 2**
- 3 fois plus performant qu'Ionic 1
- Testable dès maintenant

**Affaire à suivre !**

---
layout: center
---

## Demo time !

### ERDF — A mes côtés

---
layout: section
---

## Merci !

[slides.com/feoche/ionic-the-hybrid-theory](http://slides.com/feoche/ionic-the-hybrid-theory)

*ToSpeak list : CrossWalk, tâches Gulp, hooks Cordova, Jenkins, Vorlon.js, ngCordova, Ionic Creator/Lab/View*
