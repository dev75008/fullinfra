# Revue du site avec les skills installés

Date : 19 octobre 2026.

Cette revue décrit l’état avant corrections. Les corrections livrées et leurs tests sont détaillés dans [le contrôle final](CONTROLE-FINAL.md).

## Installation durable

Les quatre skills sont installés dans `C:/Users/NH/.codex/skills/`. Le dépôt UI UX Pro Max, fourni deux fois, a été installé une seule fois. L’installation utilise le helper Codex `install-skill-from-github.py`, sans exécuter les scripts d’installation des dépôts.

| Skill | Dépôt | Chemin dans le dépôt |
| --- | --- | --- |
| design-taste-frontend | https://github.com/leonxlnx/taste-skill | skills/taste-skill |
| ui-ux-pro-max | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill | .claude/skills/ui-ux-pro-max |
| humanizer | https://github.com/blader/humanizer | racine |
| frontend-design | https://github.com/anthropics/skills | skills/frontend-design |

Les instructions globales Codex et le fichier `AGENTS.md` du projet demandent de lire ces skills pour les tâches pertinentes. Ils sont déjà lus pour cette revue ; leur découverte automatique sera disponible au prochain tour. Cette installation ajoute des consignes et des outils persistants, sans entraîner le modèle.

## Constats prioritaires

### 1. Menu mobile : fermeture incomplète

Dans `src/App.jsx`, `Header` ferme le menu uniquement lorsque `pathname` change. Sélectionner la rubrique courante laisse donc le menu ouvert. La touche Échap n’a pas de traitement dédié.

Correction recommandée : fermer le menu à l’activation de ses liens, traiter Échap et rendre le focus au bouton lors d’une fermeture au clavier. Ajouter un test couvrant le clic sur la rubrique courante : le test existant couvre uniquement le changement de page.

### 2. Filtres : état sélectionné uniquement visuel

Dans `src/App.jsx`, les boutons de `GuideList` utilisent la classe `selected` sans exposer leur état aux lecteurs d’écran.

Correction recommandée : utiliser `aria-pressed` sur chaque bouton et un groupe nommé pour les filtres. Les boutons actuels restent utilisables au clavier ; le défaut concerne l’annonce de leur sélection.

### 3. Recherche : libellés visibles absents

La recherche d’accueil et celle du catalogue ont un nom accessible, mais leur indication visible repose sur le placeholder. Celui-ci disparaît après saisie.

Correction recommandée : ajouter un libellé visible stable, associé à chaque champ. Conserver les noms accessibles et le comportement de recherche existants.

## Composition et rédaction

Le lint Taste a analysé 27 fichiers : 19 signalements FAIL et 6 WARN. Ce sont des règles esthétiques du skill, pas des erreurs de compilation ou une mesure de conformité du site. Les 16 occurrences de labels `eyebrow`, les traits, dégradés et ombres expliquent les FAIL. Les numéros et boîtes bordées figurent parmi les WARN.

La référence Microsoft Support demandée justifie des cartes, séparateurs et icônes de produits. Les supprimer systématiquement contredirait cette direction. Les trois améliorations de composition les plus utiles sont :

1. Supprimer les numéros décoratifs des trois rubriques d’accueil : elles ne forment pas une procédure.
2. Réduire les petits labels en capitales au-dessus des titres. Garder les métadonnées qui aident à choisir un contenu.
3. Remplacer les légendes techniques génériques des illustrations d’articles par une information propre au guide, ou les supprimer. Par exemple, « AD DS / SYSTEM » apparaît aussi sur le guide PowerShell.

La revue Humanizer relève quelques formulations qui peuvent être plus directes : « Connexion introuvable » devrait devenir « Page introuvable » sur la 404 ; « Le savoir au cœur de votre infrastructure » peut devenir « Guides Windows Server, virtualisation et Azure ». Les noms de technologies, ports, réserves techniques et liens Microsoft Learn doivent rester intacts.

Ces points sont des recommandations : cette demande de revue n’a pas déclenché une refonte des pages.

## Vérifications effectuées

| Commande | Résultat |
| --- | --- |
| npm run check | Réussite : routes, articles, branches, relations et scénarios |
| npm run check:ui | Réussite : interactions React dans JSDOM |
| npm run check:sources | Réussite : 144 technologies, 84 relations, 6 articles et 134 références traçables |
| npm run check:icons | Réussite : associations et intégrité des 43 SVG officiels |
| npm run build | Réussite |
| lint Taste | 19 FAIL et 6 WARN esthétiques, détaillés ci-dessus |

Les tests de sources vérifient la traçabilité locale ; ils ne constituent pas une nouvelle vérification factuelle de chaque affirmation sur le Web. Vite émet deux avertissements concernant les directives `use client` de React Router, sans empêcher la compilation.

Le serveur local répond HTTP 200 sur http://127.0.0.1:5173/. L’outil de navigateur ne fournit aucune application ni aucun navigateur accessible. Aucune capture ni mesure visuelle aux largeurs 390, 768 et 1440 px n’a donc été réalisée. Le contraste calculé dans un navigateur, les débordements réels et la lisibilité des cartes sur téléphone restent à vérifier. Aucun score visuel n’est attribué.
