# Site d’Isabelle Cuchet – psychologue à La Ciotat

Site statique (HTML/CSS, **zéro JavaScript côté visiteur**, zéro dépendance) généré par `build.mjs`.
Objectif : **référencement Google local et longue traîne** autour de l’EMDR. Lire `AGENTS.md` avant toute modification.

## Utilisation

```bash
node build.mjs            # génère dist/ + avertissements SEO
npx serve dist            # prévisualisation locale (optionnel)
```

## Structure

```
site.config.json          nom, URL, Doctolib, téléphone, ADELI/SIRET…
build.mjs                 génère pages, sitemap.xml, robots.txt, JSON-LD, liens « pour aller plus loin »
src/template.html         gabarit commun (head SEO, header, footer)
src/styles.css            CSS unique, inliné dans chaque page
src/pages/*.html          pages principales (accueil, EMDR, parcours, tarifs, rdv, index des articles)
src/articles/*.html       articles « questions » (le cœur de la stratégie SEO)
public/                   copié tel quel dans dist/ (images WebP, favicon, robots.txt, CNAME)
.github/workflows/        déploiement GitHub Pages à chaque push sur main
```

## Mise en ligne (GitHub Pages)

1. Dépôt GitHub → *Settings › Pages › Source : GitHub Actions*.
2. **Avant le nom de domaine** (`https://user.github.io/repo/`) : mettre `"basePath": "/repo"` dans `site.config.json`.
3. **Avec le nom de domaine** : `"basePath": ""`, `"baseUrl": "https://www.isabelle-cuchet.fr"`, créer `public/CNAME` contenant le domaine, configurer le DNS, cocher *Enforce HTTPS*.
4. Une fois en ligne : déclarer `sitemap.xml` dans Google Search Console et Bing Webmaster Tools.

## Ajouter un article

Créer `src/articles/<slug>.html` :

```html
---
slug: mon-slug-court-et-clair
title: La question exacte posée par l’internaute ?
description: Réponse en 110–160 caractères qui donne envie de cliquer.
date: 2026-12-01
image: nom-de-l-image            # fichiers -640.webp et -1200.webp dans public/assets/img/
imageH: 600
alt: Description factuelle de l’image
related: therapie-emdr, autre-article, autre-article-2
---
<p>Introduction qui répond directement à la question…</p>
<h2>Sous-question 1</h2> …
```

Puis `node build.mjs` : le terminal signale titres/descriptions trop longs, liens `related` cassés et pages orphelines.
La page apparaît automatiquement dans l’accueil (6 derniers), `/articles/` et `sitemap.xml`.

## Images

Format WebP, deux largeurs (`-640` et `-1200`), sans texte incrusté, `alt` descriptif. Les PNG d’origine pèsent ~2 Mo chacun : ne jamais les publier.

## À compléter avec la cliente

- Adresse du cabinet à La Ciotat (+ plan) — très important pour le SEO local.
- **Vérifier le lien Doctolib** : l’URL fournie contient `le-puy-en-velay` alors que le cabinet est à La Ciotat.
- Mentions légales et politique de confidentialité (obligatoires en France).
- Communications orales de la page « Mon parcours » (voir TODO dans le fichier).
