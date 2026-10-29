# Optimisation FullInfra ? 29 octobre 2026

La comparaison porte sur le code compil? de la r?vision 2432ea1 et sur le build optimis?, avec les m?mes d?pendances et Node 24.22.1. Elle mesure les octets initiaux, pas le temps de chargement d?un navigateur.

| Ressource initiale | Avant (octets) | Apr?s (octets) | R?duction |
|---|---:|---:|---:|
| JavaScript | 596 369 | 387 012 | 35,1 % |
| JavaScript gzip | 182 183 | 120 540 | 33,8 % |
| CSS | 57 306 | 26 113 | 54,4 % |

Les six rubriques et l?espace Outils IA sont charg?s ? la demande. Les pages HTML restent compl?tes : 22 pages indexables, le formulaire IA verrouill? et la page 404. Les styles et modules de la rubrique sont pr?charg?s dans son HTML ; l?accueil ne pr?charge pas les autres rubriques.

Les styles de navigation ont ?t? replac?s dans la feuille commune. Les ancres attendent le contenu diff?r?, ouvrent les accord?ons concern?s et nettoient leur observateur. Une erreur de module pr?sente une action de rechargement. Les ic?nes image utilisent un chargement diff?r?, un d?codage asynchrone et des dimensions explicites.

## V?rification

Les commandes check, check:ui, check:sources, check:icons, build, check:seo, check:ai et check:performance ont ?t? ex?cut?es. Les tests couvrent les navigations vers une rubrique non encore charg?e, une ancre d?accord?on, l?hydratation, la reprise apr?s erreur, les ressources CSS du HTML statique et les budgets initiaux (450 000 octets JavaScript, 35 000 octets CSS).

Le test de build r?assemble les modules de production pour JSDOM, qui ne charge pas les modules ESM comme un navigateur. Il v?rifie les comportements applicatifs, sans prouver le chargement r?seau r?el. Le d?tecteur Impeccable sur les sources modifi?es n?a signal? aucun constat.

Aucun navigateur n??tait connect? : pas de validation visuelle responsive, de Lighthouse ni de mesures LCP, INP ou CLS. Les gains en temps de chargement et le r?f?rencement effectif restent ? mesurer en conditions r?elles. Aucun contenu technique, catalogue chiffr? ni fichier SVG officiel n?a ?t? remplac?.
