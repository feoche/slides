---
# === EDIT THESE INFORMATIONS ===
# title of your slide, will inferred from the first header if not specified
# (use search&replace to update)
title: PRANK - Il fait un bot Twitter, ça tourne mal

# slides description
# (use search&replace to update)
info: Talk description

# URL of the presentation
# (use search&replace to update)
url: https://slides.com/feoche/les-bookmarklets-c-est-chouette

# date of the presentation
date: 2024-06-21

# keywords field for exported PDF, comma-delimited
keywords: twitter, bot, nodejs

# force color schema for the slides, can be 'auto', 'light', or 'dark'
colorSchema: auto

# duration of the presentation
duration: 30min

# HTML tag attributes
htmlAttrs:
  dir: ltr
  lang: fr

# SEO meta tags
seoMeta:
  ogTitle: PRANK - Il fait un bot Twitter, ça tourne mal
  twitterTitle: PRANK - Il fait un bot Twitter, ça tourne mal
  ogDescription: Talk description
  twitterDescription: Talk description

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

# Jour 0 - Le jour où tout a commencé

---
layout: media
src: /bots-1.jpg
---

## J'aime bien les bots

---
layout: media-full
src: /bots-2.png
---

---

<style>
.slidev-layout {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-evenly;
    align-items: center;
    gap: 60px;
}
img {
    max-height: 40%;
}
</style>

<img src="https://s3.amazonaws.com/media-p.slid.es/uploads/419370/images/2065225/giphy.gif" />
<img src="https://media.giphy.com/media/12XMGIWtrHBl5e/giphy.gif" />
<img src="https://media.giphy.com/media/l2JHYHSOD3ttqvLuU/giphy.gif" />
<img src="https://s3.amazonaws.com/media-p.slid.es/uploads/419370/images/2065237/tumblr_mjods7XzJk1rm4m0fo1_500-1417544411.gif" />

---
layout: media-full
src: https://s3.amazonaws.com/media-p.slid.es/uploads/419370/images/7006866/pasted-from-clipboard.png
---

<style>
#gif {
  position: absolute;
  bottom: 2.5rem;
  right: 1rem;
  width: 240px;
}
</style>

<img id="gif" src="https://s3.amazonaws.com/media-p.slid.es/uploads/419370/images/7006868/giphy.gif">

---

<style>
.slidev-layout {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-evenly;
    align-items: center;
    gap: 60px;
}
img {
    max-height: 40%;
}
</style>

<img src="https://media0.giphy.com/media/RoWS9y91dkxG0/giphy.gif" />
<img src="https://media1.giphy.com/media/W1ecIq4sEofza/giphy.gif" />
<img src="https://media3.giphy.com/media/l46C6sdSa5DVSJnLG/giphy.gif" />

---
layout: section
---

# Jour 1 - Ok, bah on y va ?

---

## Make a bot out of you

* Une base en **NodeJS**
* Utilise la librairie <s>n</s>`twitter`, relayant l'API Twitter.
* Il faut créer une application sur `apps.twitter.com`
* Très peu de configuration (**4 clés Twitter API**) :

```javascript
const twitterAPI = new Twitter({
    consumer_key,
    consumer_secret,
    access_token_key,
    access_token_secret
});
```

---

## `twitter` — Les possibilités

- `get()` une liste de favoris, une liste de tweets
- `post()` un tweet, évidemment
- `stream()` avec un filtre (sur des utilisateurs, des mots/hashtags…)

---

<style>
.slidev-layout {
    display: flex;
    flex-flow: column wrap;
    gap: 1rem;
}
</style>

## Étape 1 — Espionnage industriel

<img class="max-h-[40%] mx-auto" src="https://s3.amazonaws.com/media-p.slid.es/uploads/419370/images/4461195/pasted-from-clipboard.png" />
<img class="max-h-[40%] mx-auto" src="https://s3.amazonaws.com/media-p.slid.es/uploads/419370/images/4461200/pasted-from-clipboard.png" />

---

## Étape 2 — On rabote !

- Enlever les retweets, ne garder que les réponses
- Enlever le like automatique
- Affiner les critères de recherche :

```js
KEYWORDS: [
  /digita(l|ux)/gmi,
  /#?transfo(rmation)?\s?digi(tal)?/gmi,
  /campagnes?\s?digital/gmi,
  /fractures?\sdigitale/gmi
],
EXCEPTIONS : [/(?:(?:dispositif|empreinte|affichage)s?\s|num[ée]rique.*?|num[ée]riser.*?|[_./#\-"]|@.*?|
\spas\s)([dD]igita(?:l(?:es)?|ux|lis(?:er|ations?)?))|([dD]igita(?:l(?:es)?|ux|lis(?:er|ations?)?))\s
(?:(?:dash|native|nomad|deluxe|transformation)|.*?numérique|.*?num[ée]riser)|Digital/]

// Digital, digital native, empreintes digitales, ... (et numérique, hein)
```

---
layout: media-full
src: https://s3.amazonaws.com/media-p.slid.es/uploads/419370/images/5559249/Le_Doigt_Digital___ledoigtdigital____Twitter_2018-12-03_13-23-35.png
---

---

## Test #01 — Le test foufou

Façon bruteforce : réponse à **tous** les tweets avec "digital"

~15 réponses/sec., 200 tweets en 1 min 😅

<div class="flex gap-8 mx-auto">
  <img class="max-w-[50%]" src="https://s3.amazonaws.com/media-p.slid.es/uploads/419370/images/4684699/giphy-downsized.gif">
  <img class="max-w-[50%]" src="https://s3.amazonaws.com/media-p.slid.es/uploads/419370/images/4684714/giphy-downsized.gif">
</div>

---

## Test #02 — Le test moins foufou

* Répondre aux tweets francophones uniquement (`lang_fr`)
* **~2 tweets/min**, la machine est en route !

<img class="w-[50%] mx-auto" src="https://s3.amazonaws.com/media-p.slid.es/uploads/419370/images/4684733/giphy-tumblr.gif">

---

<style>
.slidev-layout {
    display: flex;
    flex-flow: column wrap;
    gap: 1rem;
}
</style>

## Et là ! (C'est le drame)

<img class="max-h-[20%] mx-auto" src="https://s3.amazonaws.com/media-p.slid.es/uploads/419370/images/4684756/twitter-suspended-app_1_.png">

Action `POST` de tweet désormais impossible — **403** 🚫

<img class="max-h-[50%] mx-auto" src="https://s3.amazonaws.com/media-p.slid.es/uploads/419370/images/4684764/giphy-downsized.gif">

---
layout: section
---

# Jour 2 - L'échec n'est pas une option

---

## Étape 4 — Concertation, réflexion, action

<img class="max-h-[25%] mx-auto" src="http://media.tumblr.com/tumblr_mda5bf77R41ryrz4t.gif">

- Moins de tweets du bot (objectif : **1-2 tweets/heure**)
- Choisir les tweets auxquels le bot répond via des probabilités :
    - Popularité (en followers) du compte
    - Fréquence de tweet avec le mot-clé

---

## Un machine learning de l'extrême…

```js
// Tweet contains text (how dumb)
tweet.text &&

// Tweet is in french (Twitter language detection)
tweet.lang === `fr` &&

// Tweet is in french for sure (external library detection)
lngDetector.detect(tweet.text) === `french` &&

// Tweet is not a Retweet
!containsRegExp(tweet.text, [/RT\s\@/]) &&

// Tweet has not been already answered
!recordedTweets.includes(tweet.text) &&

// Tweet does not contain any of the excluded terms
!containsRegExp(tweet.text, data.KEYWORDS)

===> TWEET !
```

<img class="absolute right-10 top-25 max-w-[30%]" src="https://s3.amazonaws.com/media-p.slid.es/uploads/419370/images/6353060/pasted-from-clipboard.png">

---

## + un peu de maths…

$$P = \min\left(\max\left(\frac{n}{100 - 8.6\log{f}}, 1\right), 100\right)$$

- **P** : probabilité de répondre au tweet
- **n** : nombre de tweets de suite avec mot-<br>clé
- **f** : nombre de followers

<img class="absolute right-5 bottom-12 max-w-[30%]" src="https://s3.amazonaws.com/media-p.slid.es/uploads/419370/images/5562017/pasted-from-clipboard.png">

---

## Et, ben… ça marche !

<img class="w-[50%] mx-auto" src="https://media0.giphy.com/media/hn45V8hBhRIpW/giphy.gif">

[twitter.com/ledoigtdigital](https://twitter.com/ledoigtdigital)

---
layout: section
---

# Jour 3 - Y'a plus qu'à appliquer !

---

## Appli #02 — ꜰᴇБᴏᴄʜᴇ

* Tweete toutes les 3h un tweet construit aléatoirement avec le contenu de tous mes tweets perso.
* Basé sur le principe des **chaînes de Markov** :

```
twitter → twitteur → tweets → retweet → tweet → un tweet
```

<img class="mx-auto" src="./feboche.png">

[twitter.com/feboche](https://twitter.com/feboche)

---
layout: media-full
src: /feboche-2.png
---

---

## Appli #03 — HuggyLesBonsTuyaux

* Stream des tweets d'une liste de comptes Twitter de bons plans
* Identifie les promotions
* Évite les doublons de promotion

<img class="h-[20%] mx-auto" src="https://media1.giphy.com/media/1bipxi7qNZ2SY/giphy.gif">

[twitter.com/lesbonstuyo](https://twitter.com/lesbonstuyo)

---

## Appli #03 — HuggyLesBonsTuyaux

Éviter les tweets dupliqués, ça se fait aussi avec :

* Le même prix affiché
* La plus longue sous-chaîne en commun entre deux Tweets
* La distance de Damerau-Levenshtein (proba de similarité)
```
"LEGO Star Wars - Millenium Falcon" VS  "Lego faucon millenium Star Wars"   = 0.710 // 71%
"Lego faucon millenium Star Wars"   VS  "LEGO Star Wars - Millenium Falcon" = 0.667 // 66.7%
"Toto va à la mer Star wars"        VS  "Lego faucon millenium Star Wars"   = 0.654 // 65.4%
```
* Un mélange des trois "à ma sauce"

[twitter.com/lesbonstuyo](https://twitter.com/lesbonstuyo)
---

## Appli #03 — HuggyLesBonsTuyaux

```
🅰️ Micro casque Xbox One à 20€ au lieu de 49€ !  dlbs.fr/cxb69 #bonplan
🅱️ Casque Xbox One à 20e chez leclerc hmstr.biz/TO5Qe (passe à ce prix dans le panier)
                          ↓
              simplifyAndComparePrices()
                          ↓
🅰️ micro casque xbox one 20€ au lieu de 49€
🅱️ casque xbox one 20€ chez leclerc passe ce prix dans le panier
                          ↓
                 splitOrderAndCompare()
                          ↓
🅰️ ["casque", "micro", "lieu", "xbox", "one", "20€", "au", "de", "49€"]
4 mots en commun avec 🅱️ sur 9 mots = 44% de ressemblance
🅱️ ["leclerc", "casque", "panier", "passe", "chez", "dans", "prix", "xbox", "one", "20€", "ce", "le"]
4 mots en commun avec 🅰️ sur 12 mots = 33% de ressemblance
                          ↓
               damerau_levenshtein(🅰️,🅱️)
                          ↓
→  0.623, donc 62.3% de similitude => DOUBLON
```

[twitter.com/lesbonstuyo](https://twitter.com/lesbonstuyo)

---

## Appli #03 — HuggyLesBonsTuyaux

Ça marche, mais ça n'est pas parfait (beaucoup de "coup de bol" au niveau des doublons, quelques faux-positifs)

Améliorations :
* Analyse sémantique des tweets afin de récupérer les parties importantes quel que soit le format du tweet
  * Application du _Natural Language Processing_ 
```
"Elle semble se nourrir essentiellement de plancton, et de hotdog."

=> [{"elle":["PRO:per"]},{"semble":["VER"]},{"se":["PRO:per"]},{"nourrir":["VER"]},{"essentiellement":["ADV"]},
{"de":["PRE","NOM","ART:def"]},{"plancton":["NOM"]},{"et":["CON"]},{"de":["PRE","NOM","ART:def"]},
{"hotdog":["UNK"]}]
```

---

## Appli #04 — BreizhTo

* À la manière de Tweetéo France, tweete <br>tous les 3h la météo de la Bretagne <br>en se basant sur les données Météo France
* L'objectif est de lancer un _hook_ <br>de tweet tous les 3h plutôt que de laisser <br>un process tourner avec un _timeout_

<img class="absolute right-10 top-30 max-w-[23%]" src="https://s3.amazonaws.com/media-p.slid.es/uploads/419370/images/5571430/pasted-from-clipboard.png">

---

## Idées *(pour plus tard / un jour / jamais)*

- Un bot sur la présence d'allergies
- Un bot qui réagit avec des boutons de mybuttons.fr
- Un bot qui tweete des bottes 🥾
- Un bot qui répond à des bots?

<img class="max-w-[60%] mx-auto" src="https://s3.amazonaws.com/media-p.slid.es/uploads/419370/images/6352250/pasted-from-clipboard.png">

---
layout: section
---

# Jour 4 - Ok, mais l'hébergement d'un bot ?

---

## Un bot Twitter en Node

* Le bot est lancé avec un simple `npm start`
* 1 bot = une instance de Node qui tourne (potentiellement)
* Plus il y a de bots à gérer, plus il faut de terminaux pour les accueillir

---

## L'hébergement Node *(en mode radin%)*

J'ai retenu ces options (gratos) :

* Heroku (0€, moins cher que gratuit)
  * ⚠️ Host d'un bot, obligé de relancer la tâche Node tous les 15 min

* OpenShift
  * ✅ On peut avoir plusieurs comptes avec plusieurs conteneurs Node, mais c'est devenu payant entre temps

Au final, la solution était chez moi, avec le fameux : "Raspberry-qui-traîne-et-que-tu-sais-pas-quoi-en-faire" ! <br>(et `PM2` !)

---

## PM2, manager de processus Node

* Gère les processus en parallèle, module et optimise l'utilisation de la mémoire et du processeur
* La configuration est super simple (et complète), un fichier d’écosystème avec les bonnes variables (clés) et En Avant Guingamp!
* Fait tourner 24/7 les processus, qui se relancent si erreur il y a (peut même se lancer au branchement du Raspberry!)
* On peut voir les logs de toutes les tâches en temps réel et en parallèle, et il y a même une vue de monitoring en CLI

---
layout: media
src: https://s3.amazonaws.com/media-p.slid.es/uploads/419370/images/6352234/pasted-from-clipboard.png
---

## PM2, manager de processus Node

---

## En résumé

- ✅ C'est facile à faire
- ✅ Faut avoir une idée
- ⚠️ Faut pas trop tweeter d'un coup
- ✅ Faut un hébergement qui tient la route
- 🎉 Et il faut s'amuser à faire ça !

---
layout: end
image: https://francoiseoche.fr/assets/avatar.webp
hideInToc: true
---

::main::
<ul>
    <li>
        <h5 class="inline">Website :</h5>&nbsp;
        <a href="https://francoiseoche.fr/"
           target="_blank"
           aria-label="Site web de {{ $slidev.configs.author }} - Ouvre dans un nouvel onglet">
            francoiseoche.fr
        </a>
    </li>
    <li>
        <h5 class="inline">LinkedIn :</h5>&nbsp;
        <a href="https://www.linkedin.com/in/feoche/"
           target="_blank"
           aria-label="Profil LinkedIn - Ouvre dans un nouvel onglet">
            in/feoche
        </a>
    </li>
    <li>
        <h5 class="inline">Github :</h5>&nbsp;
        <a href="https://github.com/feoche"
           target="_blank"
           aria-label="Profil Github - Ouvre dans un nouvel onglet">
            @feoche
        </a>
    </li>
    <li>
        <h5 class="inline">X :</h5>&nbsp;
        <a href="https://x.com/francoiseoche"
           target="_blank"
           aria-label="Profil X - Ouvre dans un nouvel onglet">
            @francoiseoche
        </a>
    </li>
</ul>

::feedback::
<span class="flex place-items-center h-full">
<small class="mx-auto text-6xl fw-600">Merci !</small>
</span>

::qr-code::

##### Feedback :

<QRCode
class="qr-code mx-auto"
:width="250"
:height="250"
type="svg"
data="https://francoiseoche.fr"
:margin="0"
color="transparent"
:dotsOptions="{ color: 'white' }"
/>

<!-- Speaker Notes -->