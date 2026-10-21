# Contrôle et corrections du site

Date : 19 octobre 2026.

## Périmètre

L’accueil, le catalogue, les quatre rubriques et les huit articles ont été contrôlés. Les cartes Windows Server, Virtualisation et Azure, les fiches Microsoft 365 et le volet VMware restent accessibles.

Les contenus Microsoft conservent leurs références Microsoft Learn en français. Le volet VMware utilise les références officielles Broadcom autorisées par l’utilisateur. Les contrôles de traçabilité portent sur 148 références utilisées, 144 technologies des cartes, 84 relations, 12 fiches Microsoft 365, six scénarios Microsoft 365 et six exemples de flux VMware.

## Corrections livrées

| Défaut constaté | Correction |
| --- | --- |
| Menu mobile restant ouvert sur la rubrique courante | Fermeture à l’activation d’un lien, même sans changement de page |
| Absence de fermeture clavier | Échap ferme le menu et rend le focus à son bouton |
| Navigation React laissant le focus sur l’ancien contenu | Déplacement du focus vers le contenu lors d’un changement de route |
| Sélection des filtres uniquement visuelle | Boutons avec `aria-pressed` et groupe nommé |
| Filtres de sujets ne contenant aucun article | Liste construite à partir des articles réellement présents |
| Recherche sensible aux accents et espaces extérieurs | Normalisation des accents, de la casse et des espaces extérieurs |
| Ancienne recherche conservée dans l’URL après réinitialisation | Recherche et filtre gérés dans les paramètres d’URL ; réinitialisation effective des paramètres |
| Champs de recherche sans libellé visible permanent | Libellés visibles associés aux champs d’accueil et du catalogue |
| Guides difficiles à atteindre sous de longues cartes | Navigation interne vers cartes, fiches, VMware et guides |
| Catalogue peu accessible sur écran réduit | Lien dans le menu compact et dans le pied de page |
| Sommaire d’article masqué sur téléphone | Sommaire visible avant le texte sur petit écran, avec ordre DOM cohérent |
| Métadonnées ne mentionnant pas Microsoft 365 | Description mise à jour et adaptée aux routes |
| Libellé 404 évoquant une panne de connexion | « Page introuvable », avec indication de navigation |

Le moteur de recherche porte sur les guides, leurs extraits, sujets et noms de rubrique. Il n’est pas présenté comme une recherche dans la totalité des fiches techniques.

## Design et rédaction

La direction Microsoft Support est conservée : fonds clairs, Segoe UI, accent bleu, surfaces simples et icônes adaptées aux technologies. Les SVG officiels Microsoft restent intacts.

- Suppression des numéros décoratifs des rubriques et des légendes génériques des illustrations d’articles.
- Réduction des labels en capitales et des slogans sans information utile.
- Présentation d’un guide par environnement sur l’accueil, y compris Microsoft 365.
- Surfaces et états de survol harmonisés, sans ombres décoratives sur les cartes d’accueil.
- Libellés, références et points techniques plus lisibles ; boutons de scénario et filtres agrandis.
- Navigation adaptée aux largeurs intermédiaires et au menu mobile.
- Focus clavier renforcé et préférence de réduction des animations conservée.

Les skills Taste, Frontend Design, UI UX Pro Max et Humanizer ont guidé ces corrections. Leurs préférences esthétiques ne remplacent pas la direction Microsoft Support demandée : les cartes, tableaux, bordures et icônes utiles sont conservés. Aucun témoignage, résultat client ou score de qualité visuelle n’a été inventé.

## Contrôle des sources et précision technique

Les captures officielles déjà conservées ont servi de base documentaire. Une nouvelle collecte Agent Reach/Jina a été tentée sur 155 URL de référence : 21 pages ont été récupérées, puis 134 requêtes ont rencontré HTTP 429. Les captures précédentes n’ont pas été remplacées par ces échecs. Le bilan est conservé dans `source-recheck-summary.json` ; les captures se trouvent dans `C:/Users/NH/.agent-reach/audits/sitefullinfra/recheck/`.

Une lecture Web ciblée a également porté sur :

- [La configuration des migrations dynamiques Hyper-V](https://learn.microsoft.com/fr-fr/windows-server/virtualization/hyper-v/deploy/set-up-hosts-for-live-migration-without-failover-clustering) : précision ajoutée sur l’isolation des flux et la distinction entre authentification et chiffrement du transfert. Les exigences liées à Credential Guard et Kerberos sont conservées.
- [L’architecture de connectivité Azure SQL](https://learn.microsoft.com/fr-fr/azure/azure-sql/database/connectivity-architecture) : maintien de la distinction Proxy / Redirect et des exigences propres au chemin utilisé.
- [Les endpoints Microsoft 365 Worldwide](https://learn.microsoft.com/fr-fr/microsoft-365/enterprise/urls-and-ip-address-ranges?view=o365-worldwide) : maintien des réserves sur les dépendances, la mise à jour des endpoints et l’absence de matrice pare-feu exhaustive.

Le succès du test de sources prouve la présence et la traçabilité des références, pas la vérification automatique de chaque affirmation. Cette passe ne constitue pas une nouvelle validation Web exhaustive des 155 pages, ni une validation d’un déploiement réel.

## Résultats des vérifications

| Vérification | Résultat |
| --- | --- |
| `npm run check` | Réussite : routes, 404, un titre principal et un repère principal par page, identifiants uniques et ancres résolues |
| `npm run check:ui` | Réussite : interactions, menu courant, Échap, focus, filtres annoncés, recherche sans accents, accordéons et scénarios |
| `npm run check:sources` | Réussite : références autorisées et traçables |
| `npm run check:icons` | Réussite : associations et intégrité des SVG Microsoft |
| `npm run build` | Réussite |

Vite conserve deux avertissements liés aux directives `use client` de React Router. Ils n’empêchent pas la compilation.

## Vérification visuelle restante

L’outil de contrôle du navigateur ne fournit aucune application ni aucun navigateur accessible dans cette session. Aucune capture, mesure de contraste rendue ou vérification visuelle aux largeurs téléphone/tablette/ordinateur n’est donc revendiquée. Les tests React s’exécutent dans JSDOM, qui ne calcule pas une mise en page réelle.

Avant publication, il reste à contrôler visuellement les longues cartes, le menu aux largeurs intermédiaires, les tableaux et le zoom de texte dans un navigateur. Le site peut être consulté localement sur http://127.0.0.1:5173/.
