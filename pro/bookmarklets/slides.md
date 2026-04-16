<!-- .slide: data-background-color="#00574a" -->

# Les bookmarklets, c'est chouette !

**François Eoche**

---
<!-- .slide: data-background-color="#00574a" -->

# François Eoche

### Web Cabinetmaker
- OVHcloud Design System Leader
<br/><br/>
- Chez OVHcloud depuis 2017
<br/><br/> 
- Développement web / hybride / web mobile
<br/><br/>
- Passionné de UX & accessibilité web

---
<!-- .slide: data-background-color="#784587" -->

# Les bookmarklets, kézako ?

--

## Les bookmarklets, kézako ?

Un **bookmarklet** (fr : *signapplet*, *applisignet*, *marque-page scripté*) est un petit programme JavaScript stocké :

- en tant qu'**URL** dans un signet (marque-page / favori)
- en tant qu'**hyperlien** dans une page web

Lors de la sélection du signet, le navigateur exécute le code JavaScript pour :

- modifier le rendu graphique d'une page
- récupérer des informations
- interroger un moteur de recherche
- soumettre la page à un service tiers

L'URL commence par **`javascript:`** et est suivie du code à exécuter.

--

## En résumé

- Un petit bout de script
- Qui commence par **`javascript:`**
- Qui se lance en un clic
- Et qui fait des trucs.

*(Et c'est trop bien. Oui c'est vieux — de **2001** O\_O — mais c'est bien.)*

--

## Les + et les -

<div class="columns">
<div class="column left">

✅ Fait pour des petits scripts

✅ Très léger en performance

✅ Super facile à installer/utiliser

✅ Pas de permissions nécessaires

</div>
<div class="column left">

⛔ Pas très connu

⛔ Remplacés par les extensions

⛔ Difficile à maintenir à jour

⛔ Problèmes de compatibilité

⛔ Certains scripts bloqués

</div>
</div>

---
<!-- .slide: data-background-color="#5254E1" -->

# Place aux exemples !

--

## Au programme

- De l'accessibilité 👀 <!-- .element: class="fragment" -->
- De la visualisation 📰 <!-- .element: class="fragment" -->
- Des tests 🧠 <!-- .element: class="fragment" -->
- Un exemple grandeur nature 🌲 <!-- .element: class="fragment" -->
- Du bonus ! 🐒 <!-- .element: class="fragment" -->

--

## [HTML CodeSniffer](https://squizlabs.github.io/HTML_CodeSniffer/)

- Listing des erreurs et warnings de DOM + CSS
- Check des standards WCAG 2.1 d'accessibilité

--

## [Color Contrast Checker](https://webaim.org/resources/contrastchecker/bookmarklet)

- Vérifier la compatibilité de deux couleurs et leur accessibilité

--

## [CSS Layout Debugger](https://gist.github.com/addyosmani/fd3999ea7fce242756b1)

- Permet de montrer les structures de layout d'une page
- Un code golf de **108 bytes** (!)

--

## [NoJS Side-by-side](https://workeffortwaste.github.io/nojs-side-by-side/)

- Test de page avec/sans JS

--

## [Fount](https://fount.artequalswork.com/)

- Identifier les polices d'écriture à la sélection + styles de font
- *WhatFont* existe aussi et est devenu une extension navigateur

--

## [Web Font Picker](https://github.com/danielgavrilov/WebFontPicker/blob/master/bookmarklet.js)

- Permet de tester une liste de web-fonts sur un sélecteur CSS donné

--

## [PerfMap](https://github.com/zeman/perfmap)

- Une heatmap visuelle du chargement des assets de la page

--

## [Performance-Bookmarklet](https://github.com/micmro/performance-bookmarklet)

- Résultat visuel et en détail des calculs et requêtes de la page

--

## [OuiSEO](https://carlsednaoui.github.io/seo-bookmarklet/install.html)

- Montre les metatags utilisés sur la page pour le SEO

--

## Chez OVHcloud

- Listing des composants UI
- Highlight en fonction de leur provenance (natif, web component, etc.)
- Couverture des composants

---
<!-- .slide: data-background-color="#86414B" -->

# Bonus ! 🐒

--

## [stats.js](https://github.com/mrdoob/stats.js)

- Moniteur de FPS, ms pour rendre une frame, mémoire utilisée en temps réel

--

## [Bookmarklets for developers](https://bookmarklets.app.quest/)

Des bookmarklets de fonctions JS "clés en main" :

- CleanStorage
- Debugger
- ...

--

## [Gremlins.js](https://marmelab.com/gremlins.js/)

Monkey testing de BÂTARD 🐒

- des clics
- des scrolls
- des swipes
- des touches clavier
- le tout en même temps

--

## [Revenge.CSS](https://web.archive.org/web/20190309062846/http://heydonworks.com/revenge_css_bookmarklet)

- Check "classique" des erreurs de DOM
- Les erreurs sont notées sur l'élément concerné, en **Comic Sans MS** sur fond rouge 😂

--

## [ContentEditable](https://github.com/msankhala/editable-bookmarklet)

- Rend le texte de toute la page éditable
- Pratique pour faire des **PRANKS** à ses collègues 😏

--

## DIY your Bookmarklet : [Bookmarkleter](http://chriszarate.github.io/bookmarkleter/)

Créez vos propres bookmarklets facilement !

---
<!-- .slide: data-background-color="#AA4D38" -->

## La prochaine fois, on parle de Greasemonkey ! 🙊

*\#2015*

---
<!-- .slide: data-background-color="#00574a" -->

## Merci !

**François Eoche**

[**slides.com/feoche**](https://slides.com/feoche)
