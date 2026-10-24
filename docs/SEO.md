# Référencement FullInfra

## Fonctionnement

`npm run build` compile React, puis `scripts/prerender.mjs` produit les pages HTML statiques. Le contenu principal est disponible avant l’exécution de JavaScript. React reprend ensuite la page avec l’hydratation ; les recherches avec paramètres sont rendues côté client pour appliquer leur filtre sans conflit avec le HTML initial.

Les rubriques et articles de `src/data/content.js` alimentent automatiquement les chemins générés et le sitemap. `src/seo.js` définit le domaine de référence, les titres, descriptions, URL canoniques, métadonnées Open Graph et Twitter, ainsi que les données structurées WebSite, CollectionPage, TechArticle et BreadcrumbList. Aucune note, évaluation ou identité d’auteur fictive n’est ajoutée.

Les dates d’articles servent de dates de modification ; ne les changer qu’après une mise à jour réelle du contenu. Elles ne sont pas présentées comme des dates de publication connues. Les dates de modification des pages de rubrique ne sont pas inventées.

Les URL de référence utilisent `https://fullinfra.duckdns.org/` et un `/` final. Les paramètres de recherche et les ancres ne créent pas de nouvelles URL canoniques. Les liens internes historiques restent compatibles avec les routes React et les redirections de répertoire GitHub Pages.

Fichiers générés dans `dist/` :

- une page `index.html` par URL publique, avec contenu et métadonnées spécifiques ;
- `sitemap.xml`, listant les pages de contenu ;
- `robots.txt`, autorisant l’exploration et indiquant le sitemap ;
- `404.html`, affichant une erreur avec `noindex,follow`, sans redirection JavaScript.

## Vérification

Après `npm run build`, lancer `npm run check:seo`. Le contrôle examine le HTML sans JavaScript, les titres et descriptions uniques, les URL canoniques, les liens internes, le sitemap, robots.txt et les données JSON-LD. Il exécute aussi le bundle compilé dans JSDOM pour détecter les erreurs d’hydratation et vérifier la navigation, les accordéons et la recherche. Il ne remplace pas un contrôle visuel dans un navigateur ni les outils Google.

Le workflow de publication exécute le même contrôle avant le déploiement. Une fois publié, vérifier les statuts HTTP des pages de contenu et de la page inconnue, puis le contenu HTML reçu directement.

## Suivi dans Google

Le compte Google du propriétaire n’est pas connecté par cette modification. Dans Google Search Console, ajouter et vérifier la propriété du site, puis soumettre `https://fullinfra.duckdns.org/sitemap.xml`. Utiliser l’inspection d’URL pour examiner une rubrique et un article. Contrôler ensuite les exclusions d’indexation, impressions, clics et requêtes. Google décide de l’indexation et du classement ; les corrections techniques ne garantissent ni délai ni position.

Continuer à enrichir les guides avec des cas pratiques testés, les versions couvertes et leurs sources. Relier les guides associés depuis leurs rubriques. Les infographies complètent le texte HTML ; elles ne le remplacent pas.

Références : [SEO JavaScript](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics?hl=fr), [guide développeurs](https://developers.google.com/search/docs/fundamentals/get-started-developers?hl=fr).
