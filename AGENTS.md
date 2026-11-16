# AGENTS.md – consignes pour tout agent qui travaille sur ce site

## Mission
Site vitrine d’**Isabelle Cuchet, psychologue clinicienne et praticienne EMDR à La Ciotat**. But n°1 : **maximiser le référencement Google**.
Stratégie : une page d’accueil/hub (le site principal) + **une vingtaine d’articles** qui ciblent chacun **une question rare et précise** (longue traîne, peu de concurrence). Les articles se renvoient les uns aux autres et pointent vers le hub (accueil, `therapie-emdr`, `prendre-rendez-vous`). C’est le **maillage interne** qui fait monter l’ensemble.

## Règles SEO (non négociables)
1. **1 page = 1 intention de recherche = 1 `<h1>`**. Le titre est la **question réelle** d’un internaute (« Faut-il… ? », « Combien de… ? », « Est-ce normal de… ? »). Le `<h1>` reprend le `title`.
2. `title` ≤ 60 caractères idéalement ; `description` 110–160 caractères, qui **répond ou promet la réponse** et contient l’expression clé.
3. **Pas de cannibalisation** : avant d’écrire, vérifier qu’aucune page ne vise déjà la même requête. **Zéro contenu dupliqué** entre pages (ne pas recopier `therapie-emdr` dans un article : résumer en une phrase et faire un lien).
4. Contenu : 600–1 000 mots, plusieurs paragraphes courts, `<h2>` formulés comme des sous-questions, réponse directe dès l’introduction, ton pédagogique et chaleureux, vocabulaire simple, soigné (orthographe, typographie française).
5. **Maillage** : chaque article a ≥ 2 liens `related` (dont un vers une page hub) et doit recevoir ≥ 1 lien entrant. Ancres descriptives (jamais « cliquez ici »). Le build avertit des pages orphelines.
6. Mots-clés locaux et thématiques naturels (La Ciotat, Marseille/Aubagne/Cassis si pertinent, EMDR, trauma, anxiété, burn-out, deuil, phobie…), **jamais de bourrage**.
7. Images : illustrent le propos, **aucun texte incrusté**, `alt` descriptif, WebP, `width`/`height` renseignés, `loading="lazy"` sauf l’image principale (`fetchpriority="high"`).
8. Données structurées : JSON-LD générées par `build.mjs` (ProfessionalService, Article, BreadcrumbList). Si un article contient une vraie FAQ, ajouter FAQPage.
9. Chaque modification de fond d’un article : renseigner `updated:` (devient `dateModified` et `lastmod`).

## Règles de déontologie / santé (psychologue)
Pas de promesse de guérison ni de résultat garanti ; pas de diagnostic ; ne pas affirmer ce qui n’est pas dans le contenu fourni par la cliente (EMDR : OMS 2013, HAS 2007, Inserm). Toujours rappeler que chaque situation est singulière et inviter à consulter. Faire relire les nouveaux articles par la cliente avant publication.

## Performance et mobile (priorité absolue)
Mobile-first. Pas de JavaScript, pas de police web, pas de framework : le CSS (`src/styles.css`) est inliné. Chaque image ≤ ~60 Ko. Cibles tactiles confortables, texte ≥ 17 px, contrastes AA, focus visible. Vérifier tout changement à 360 px de large et avec Lighthouse mobile (viser 95+ partout).

## Workflow
Éditer `src/` (jamais `dist/`), lancer `node build.mjs`, **corriger tous les avertissements**, committer sur `main` (déploiement automatique). `site.config.json` contient les coordonnées : ne pas les dupliquer en dur. Utiliser `{{base}}` devant chaque lien/asset interne.

## Backlog de questions à traiter (une page chacune)
1. Combien de séances d’EMDR faut-il pour un traumatisme ?
2. L’EMDR fonctionne-t-elle pour une phobie ?
3. Peut-on faire de l’EMDR pour un deuil douloureux ?
4. EMDR et burn-out : est-ce adapté ?
5. Comment se passe une première séance chez une psychologue EMDR ?
6. Quelle différence entre EMDR et TCC ?
7. Pourquoi des mouvements des yeux soignent-ils un traumatisme ?
8. Que ressent-on après une séance d’EMDR (fatigue, rêves) ?
9. L’EMDR marche-t-elle sur les souvenirs d’enfance ?
10. Peut-on faire de l’EMDR après un accident de la route ?
11. Comment savoir si j’ai un trouble de stress post-traumatique ?
12. L’EMDR est-elle efficace pour les attaques de panique ?
13. EMDR en visio : est-ce possible et efficace ?
14. Quelle différence entre psychologue, psychiatre et psychothérapeute ?
15. Une mutuelle rembourse-t-elle les séances de psychologue ?
16. Comment choisir son psychologue à La Ciotat ?
17. Qu’est-ce que la thérapie d’acceptation et d’engagement (ACT) ?
18. Comment l’EMDR aide-t-elle après des violences conjugales ou psychologiques ?
19. Épuisement des soignants : comment se protéger ? (expertise recherche de la cliente)
20. Peut-on faire de l’EMDR quand on prend des médicaments ?

(Vérifier chaque formulation dans Google Suggest / « Autres questions posées » avant rédaction.)
