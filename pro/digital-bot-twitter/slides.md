<!-- .slide: data-background-color="#00574a" -->

# PRANK — Il fait un bot Twitter, ça tourne mal.

**François Eoche** · [bit.ly/prankjs](http://bit.ly/prankjs)

---
<!-- .slide: data-background-color="#00574a" -->

## Qui suis-je ?

**François Eoche** — Web Cabinetmaker

- Front-End Developer chez OVH depuis 2017
- Développement Web, Web mobile et hybride
- Passionné de UX & accessibilité
- [@francoiseoche](https://twitter.com/francoiseoche)

---
<!-- .slide: data-background-color="#003D34" -->

⚠️ **ATTENTION**

La présentation qui suit vous montrera bien des aspects de développement,
mais ceux-ci ne seront finalement que du code un peu moisi.

Ici, on parle majoritairement du **principe** de faire des bots sans grand intérêt pour Twitter.

---
<!-- .slide: data-background-color="#006B57" -->

# Jour 0

## Le jour où tout a commencé

---
<!-- .slide: data-background-color="#004E6E" -->

## J'aime bien les bots

*(In Peace — Twitter API v2 💀)*

---
<!-- .slide: data-background-color="#2D5C55" -->

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
<!-- .slide: data-background-color="#784587" -->

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
<!-- .slide: data-background-color="#52306B" -->

## Et, ben… ça marche !

[twitter.com/ledoigtdigital](https://twitter.com/ledoigtdigital)

---
<!-- .slide: data-background-color="#5254E1" -->

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
<!-- .slide: data-background-color="#3537A8" -->

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
<!-- .slide: data-background-color="#00574a" -->

## Merci !

**François Eoche**

[**francoiseoche.fr**](https://twitter.com/francoiseoche)


---