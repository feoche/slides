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
keywords: keyword1,keyword2

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
theme: "./src/_theme"
hideInToc: true
addons:
  - slidev-addon-qrcode
---

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
layout: intro
image: https://francoiseoche.fr/assets/avatar.webp
---

## {{ $slidev.configs.author }}

### Web cabinetmaker

* Product Owner chez OVHcloud - Design System
* Référent accessibilité numérique
* Développeur "front-of-the-front-end" (web & hybride)
* Orga de RennesJS, CSScade
* Passionné d'ergonomie des interfaces

<a href="https://francoiseoche.fr/" target="_blank" aria-label="Site web de {{ $slidev.configs.author }} - Ouvre dans un nouvel onglet">
  francoiseoche.fr
</a>

<!-- Speaker Notes -->

---
layout: disclaimer
---

## Disclaimer

Cette présentation vous confronte au biais du conférencier. Veuillez noter que ce belâtre d'orateur n'est probablement
pas plus légitime que vous en termes d'expertise ni d'omniscience.

On a tous à apprendre les uns des autres, et ça n'est pas qu'une question de syndrôme de l'imposteur.

Éventuellement, de l'humour (discutable) sera aussi énoncé dans ces slides ou par le conférencier. Si vous n'êtes pas
familier avec le concept, demandez conseil à votre pharmacien.

Arrêtez donc de lire ceci et écoutez l'énergumène qui déblatère et gesticule, s'il vous plaît. Promis, il n'y aura pas
d'examen à la fin (ni d'autres slides aussi longues).

Lorem ipsum dolor sit amet, consectetur adipiscing elit e que s'apelerio Quézac.

<small>**PS:** Oui, cette diapositive n'est pas accessible, merci pour les deux du fond qui ne voient rien</small>

<!-- 
Avant de commencer : le simple fait de prendre la parole sur cette scène ne fait pas de moi un expert ni une autorité absolue – c’est simplement l’expression du biais d’autorité (ou, pour faire court, du “biais du conférencier”), et j’ai préféré l’anticiper plutôt que de vous le laisser deviner. 
-->

---
hideInToc: true
---

## Sommaire

<Toc maxDepth="1"></Toc>

<!-- Speaker Notes -->

---

# Jour 0

## Le jour où tout a commencé

---

## J'aime bien les bots

*(In Peace — Twitter API v2 💀)*

---

# Jour 1

## Ok, bah on y va ?

---

## Make a bot out of you

Une base en **NodeJS** avec la librairie `n-twitter`, relayant l'API Twitter.

Il faut créer une application sur `apps.twitter.com` et récupérer **4 clés Twitter API** :

```javascript
const twitterAPI = new Twitter({
  consumer_key,
  consumer_secret,
  access_token_key,
  access_token_secret
});
```

--

## `n-twitter` — Les possibilités

- `get()` une liste de favoris, une liste de tweets
- `post()` un tweet, évidemment
- `stream()` avec un filtre (sur des utilisateurs, des mots/hashtags…)

---

## Étape 1 — Espionnage industriel

*Écoute des tweets mentionnant des mots-clés "digital"*

---

## Étape 2 — On rabote !

- Enlever les retweets, ne garder que les réponses
- Enlever le like automatique
- Affiner les critères de recherche :

```js
KEYWORDS: [
  /digita(lux)/gmi,
  /#?transfo(rmation)?\s?digi(tal)?/gmi,
  /campagnes?\s?digital/gmi,
]
```

---

## Test #01 — Le test foufou

Façon bruteforce : réponse à **tous** les tweets avec "digital"

~15 réponses/sec., 200 tweets en 1 min 😅

---

## Test #02 — Le test moins foufou

Répondre aux tweets francophones uniquement (`lang_fr`)

**~2 tweets/min**, la machine est en route !

---

## Et là ! (C'est le drame)

Action `POST` de tweet désormais impossible — **403** 🚫

---

# Jour 2

## L'échec n'est pas une option

---

## Étape 4 — Concertation, réflexion, action

- Moins de tweets du bot (objectif : **1-2 tweets/heure**)
- Choisir les tweets auxquels le bot répond via des probabilités :
  - Popularité (en followers) du compte
  - Fréquence de tweet avec le mot-clé

--

## Un machine learning de l'extrême…

```js
// Tweet contains text (how dumb)
tweet.text &&
// Tweet is in french (Twitter language detection)
tweet.lang === `fr` &&
// Tweet is in french for sure (external library detection)
lngDetector.detect(tweet.text, 1)[0][0] === 'french'
```

--

## + un peu de maths…

$$P = \min\left(\max\left(\frac{n}{100 - 8.6\log{f}}, 1\right), 100\right)$$

- **P** : probabilité de répondre au tweet
- **n** : nombre de tweets de suite avec mot-clé
- **f** : nombre de followers

---

## Et, ben… ça marche !

[twitter.com/ledoigtdigital](https://twitter.com/ledoigtdigital)

---

# Jour 3

## Y'a plus qu'à appliquer !

---

## Appli #02 — ꜰᴇ Б ᴏᴄʜᴇ

Tweete toutes les 3h un tweet construit aléatoirement avec le contenu de tous mes tweets perso.

Basé sur le principe des **chaînes de Markov** :

```
twitter → twitteur → tweets → retweet → tweet → un tweet
```

[twitter.com/feboche](https://twitter.com/feboche)

---

## Appli #03 — HuggyLesBonsTuyaux

Stream des tweets de comptes de bons plans, identifie les promotions et évite les doublons.

**Déduplification avec Damerau-Levenshtein :**

```
"Micro casque Xbox One à 20€ au lieu de 49€"
VS
"Casque Xbox One à 20€ chez Leclerc"
→ 62.3% de similitude → Doublon !
```

[twitter.com/lesbonstuyo](https://twitter.com/lesbonstuyo)

---

## Appli #04 — BreizhTo

À la manière de *Tweeto France*, tweete tous les 3h la météo de la Bretagne.

Se base sur les données **Météo France** via un hook de tweet planifié.

---

## Idées *(pour plus tard / un jour / jamais)*

- Un bot sur la présence d'allergies
- Un bot qui réagit avec des boutons de mybuttons.fr
- Un bot qui tweete des bottes 🥾
- Un bot qui répond à des bots?

---

# Jour 4

## Ok, mais l'hébergement d'un bot ?

---

## L'hébergement Node *(en mode radin%)*

Options gratuites retenues :

- **Heroku** — oblige à relancer la tâche Node toutes les 15 min
- **OpenShift** — plusieurs comptes avec plusieurs conteneurs Node

--

## PM2, manager de processus Node

Gère les processus en parallèle, module et optimise l'utilisation de la mémoire.

```bash
pm2 start ecosystem.config.js
pm2 list
pm2 logs bot-twitter
```

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