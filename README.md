# FullInfra

Site publié : **https://fullinfra.duckdns.org/**

## Publication GitHub Pages

Le workflow `.github/workflows/pages.yml` teste, compile et publie le site après chaque push sur `main`. La compilation utilise `VITE_BASE_PATH=/` pour les routes et les ressources. Les ouvertures directes de sous-pages passent par une page 404 de redirection, puis restaurent le chemin, les paramètres et l’ancre dans le navigateur.

Pour tester cette compilation sous PowerShell :

```powershell
$env:VITE_BASE_PATH='/'
npm run build
node scripts/check-pages.mjs
npm run preview
```

L’aperçu de production est alors accessible à `http://127.0.0.1:4173/`. Pour revenir à la racine lors du développement, retirer la variable avec `Remove-Item Env:VITE_BASE_PATH`.

Le [contrôle et les corrections du site](docs/CONTROLE-FINAL.md) détaillent les changements de navigation, de recherche, de rédaction et de présentation, ainsi que les limites de la vérification visuelle.

La [revue UX et design](docs/REVUE-UX.md) détaille les skills installés, les améliorations recommandées et les vérifications effectuées.

Site éditorial React en français, consacré à Windows Server, à la virtualisation, à Azure et à Microsoft 365. La charte claire s’inspire de [Microsoft Support](https://support.microsoft.com/fr-fr/) : fonds blancs, bleu Microsoft, typographie système Segoe UI et cartes épurées. Les contenus Microsoft sont sourcés dans Microsoft Learn. Le volet VMware vSphere sur site utilise les références officielles Broadcom, distinctes d’Azure VMware Solution.

Les produits Azure et Entra utilisent 43 SVG des collections officielles Microsoft, stockés localement sans modification. Les notions Windows locales utilisent des pictogrammes adaptés : AD DS est distinct d’Entra ID, IIS d’App Service et Hyper-V des VM Azure. Les conditions et provenances des icônes sont dans [NOTICE.md](public/icons/microsoft/NOTICE.md).

## Lancer en local

Prérequis : Node.js 22.13+ dans la branche 22, ou Node.js 24+ et npm. Les contraintes exactes sont déclarées dans `package.json`.

```powershell
cd C:\IASKILL\sitefullinfra
npm install
npm run dev
```

Ouvrir l’adresse affichée par Vite, généralement http://127.0.0.1:5173.

```powershell
npm run build
npm run preview
```

`npm run check` vérifie le rendu de toutes les routes, les listes d’articles et les pages 404. Ce contrôle ne remplace pas une vérification visuelle dans un navigateur.

`npm run check:ui` teste les interactions React dans un DOM isolé. `npm run check:sources` vérifie la traçabilité des références Microsoft Learn. Le [rapport d’audit](docs/AUDIT.md) détaille les corrections et les limites des vérifications.

`npm run check:icons` contrôle les associations des 144 technologies et 36 branches ainsi que l’intégrité des SVG Microsoft.

Le build de production se trouve dans `dist/`. Sur un hébergement statique, configurer la réécriture des routes inconnues vers `index.html` pour permettre le rechargement direct des pages React Router.

## Arborescence

```text
sitefullinfra/
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── public/
│   └── icons/microsoft/      # SVG officiels, manifeste et conditions d’utilisation
├── docs/
│   ├── AUDIT.md              # Corrections, sources et limites de l’audit
│   └── learn-sources-audit.json # Preuves de collecte des pages Microsoft Learn
├── scripts/
│   ├── check.mjs             # Vérification du rendu des routes
│   ├── check-ui.mjs          # Tests d’interaction dans un DOM isolé
│   ├── check-sources.mjs     # Traçabilité des références
│   └── check-icons.mjs       # Associations et intégrité des pictogrammes
└── src/
    ├── main.jsx              # Point d’entrée et BrowserRouter
    ├── App.jsx               # Navigation, routes et pages
    ├── Home.jsx              # Accueil et recherche vers le catalogue
    ├── components.jsx        # Cartes et identité FullInfra
    ├── TechnologyIcon.jsx    # Pictogrammes officiels ou sémantiques
    ├── SourceLinks.jsx       # Références documentaires affichées
    ├── CommunicationMap.jsx  # Carte de communication partagée
    ├── TechnologyInfographic.jsx # Fiches et protocoles partagés
    ├── WindowsCommunicationMap.jsx # Compatibilité Windows Server
    ├── WindowsInfographic.jsx # Compatibilité Windows Server
    ├── styles.css            # Thème, responsive, animations
    ├── windows-communications.css # Styles des cartes des trois rubriques
    ├── windows-infographic.css # Styles des fiches des trois rubriques
    └── data/
        ├── content.js        # Rubriques et articles
        ├── ecosystems.js     # Association rubrique / écosystème
        ├── ecosystemModel.js # Structure et filtres communs
        ├── technologyIcons.js # Associations explicites rubrique/branche/technologie
        ├── auditReferences.js # Association fiches/relations/articles → sources
        ├── learnSources.js   # Catalogue Microsoft Learn FR
        ├── referenceCatalog.js # Bibliographies des rubriques
        ├── communicationExchanges.js # Sauts réseau détaillés
        ├── virtualisation.js # Fiches, flux et scénarios Virtualisation
        ├── azure.js          # Fiches, flux et scénarios Azure
        ├── windowsBranches.js
        ├── windowsTechnologyDetails.js
        ├── windowsProtocols.js
        └── windowsCommunications.js
```

## Modifier le contenu

Les articles se modifient dans `src/data/content.js`. Pour ajouter un article, ajouter un objet au tableau `sampleArticles` ; le tableau exporté `articles` y ajoute ses références et calcule son temps de lecture :

```js
{
  slug: 'mon-guide',
  category: 'windows-server',
  title: 'Titre du guide',
  excerpt: 'Résumé affiché sur les cartes.',
  topic: 'PowerShell',
  level: 'Guide pratique',
  date: '2026-10-19',
  sections: [
    ['Premier titre', 'Texte de la première section.'],
    ['Deuxième titre', 'Texte de la deuxième section.'],
  ],
}
```

Le `slug` doit être unique dans la rubrique. `category` doit correspondre au slug d’une rubrique. Utiliser un `topic` présent dans ses `topics` pour rendre le filtre pertinent. Les trois premiers objets apparaissent sur l’accueil : placer les nouveautés en tête.

Pour rattacher les sources du nouvel article, compléter `articleReferences` dans `src/data/auditReferences.js`. Les identifiants renvoient à `src/data/learnSources.js`. Le corpus technique retenu depuis l’audit est exclusivement Microsoft Learn FR. La partie VMware est limitée aux scénarios Azure VMware Solution documentés par Microsoft. Les contrôles actuels décrivent les six articles et les 144 technologies de cette version ; les adapter si le volume de contenu évolue.

Pour ajouter une rubrique, ajouter un objet au tableau `categories` avec `slug`, `name`, `short`, `icon` (`server`, `layers`, `cloud`), `color` (`green`, `purple`, `blue`), `description` et `topics`. La navigation, le pied de page, les filtres et les routes sont générés automatiquement. Pour une nouvelle icône, compléter le dictionnaire `icons` dans `components.jsx`.

## Personnaliser le design

### Infographie Windows Server

La carte mentale interactive apparaît en premier sur `/windows-server`. Son style utilise des cartes claires, des icônes adaptées et des connexions colorées, avec une réalisation originale en CSS/SVG. Elle représente 12 branches et 30 relations principales. Le centre représente les postes, VM et administrateurs qui initient les demandes, au sein de l’écosystème Windows Server.

- Sélectionner une branche pour isoler ses relations ; cliquer à nouveau pour revenir à la vue d’ensemble.
- Sélectionner une relation dans la carte ou dans la liste pour lire ses protocoles, ses ports et ses conditions.
- Choisir « Session & fichiers », « Accès RDS », « Application web » ou « Exploitation & reprise » pour suivre un scénario.
- Les traits pleins indiquent des flux réseau ; les pointillés représentent des relations logiques, comme l’hébergement ou l’application d’une politique.
- Le sens indique l’initiateur vers le service ; les réponses et dépendances restent nécessaires. Les scénarios sont simplifiés, pas une matrice pare-feu exhaustive.
- Sur petit écran, faire défiler le schéma horizontalement ou utiliser la liste de relations accessible au clavier.

Les nœuds, relations et étapes se modifient dans `src/data/windowsCommunications.js`. Le rendu se trouve dans `src/WindowsCommunicationMap.jsx` et son style dans `src/windows-communications.css`.

La page `/windows-server` affiche une arborescence de 12 domaines avant les guides. Chaque branche contient quatre technologies, chacune avec une définition et trois points explicatifs, soit 144 points au total. Un cas concret complète chaque branche. Le contenu est accessible en dépliant la carte au clic ou au clavier. Le bouton « Déployer les détails » ouvre toutes les branches ; « Réduire les détails » les referme. Les cartes passent sur deux colonnes lorsqu’une branche est ouverte, puis une sur mobile pour faciliter la lecture.

Modifier les titres et résumés dans `src/data/windowsBranches.js`. Modifier les explications et les exemples dans `src/data/windowsTechnologyDetails.js` : les quatre listes de points de chaque branche suivent l’ordre de ses quatre technologies. Le composant se trouve dans `src/WindowsInfographic.jsx` et ses styles dans `src/windows-infographic.css`. Des liens Microsoft Learn sont disponibles sous l’infographie pour approfondir les notions.

Chaque technologie inclut aussi un tableau de protocoles, transports/ports et usages. Son contenu se modifie dans `src/data/windowsProtocols.js` : chaque branche contient quatre listes dans l’ordre de ses technologies, avec des lignes `[nom, transportEtPorts, usage]`. Les mécanismes locaux sont identifiés sans leur attribuer de port artificiel. Les ports usuels et conditionnels sont des repères pédagogiques, pas une politique pare-feu complète. Les références Microsoft Learn sont affichées sous l’infographie.

Modifier les variables au début de `src/styles.css` : `--bg` (fond blanc), `--panel` (cartes), `--text`, `--muted` et `--accent` (bleu principal). Les classes `.purple` et `.blue` définissent les accents des rubriques. Les polices sont définies par `--heading` et `--body` et utilisent Segoe UI avec repli Arial/sans-serif, sans chargement de polices externes. Certaines nuances utilisent des couleurs explicites dans les trois feuilles de style.

Les icônes se choisissent dans `src/data/technologyIcons.js`. Chaque tableau de quatre icônes suit l’ordre des quatre technologies de la branche. Le registre `src/TechnologyIcon.jsx` associe les identifiants aux SVG locaux Microsoft ou aux pictogrammes Lucide. Pour une nouvelle technologie, choisir son produit exact si l’icône officielle est disponible ; utiliser un symbole de fonction pour une notion générale. Les SVG Microsoft restent inchangés et ne doivent pas être recolorés ou déformés.

## Fonctionnalités

Les pages Virtualisation et Azure proposent chacune le même dispositif que Windows Server : carte interactive de 12 branches, quatre scénarios, liste des relations avec sens et protocoles, 48 technologies détaillées en trois points et 12 cas concrets. Les cartes disposent d’accents propres à la rubrique. Les articles restent disponibles sous les cartes.

Pour modifier ces contenus, éditer `src/data/virtualisation.js` ou `src/data/azure.js`. Chaque branche possède quatre technologies ; chaque technologie contient un résumé, trois points et un tableau de protocoles. Les relations `edges` définissent source, destination, protocole et explication. `kind: 'logical'` indique un lien logique sans port propre. Les scénarios sélectionnent des relations par identifiant et des étapes par paire `[identifiantDuFlux, explication]`. Les liens documentaires officiels sont dans `sources`.

Les composants `CommunicationMap.jsx` et `TechnologyInfographic.jsx` partagent le rendu entre les rubriques. Les composants Windows conservent leur interface d’origine. `npm run check` vérifie les trois ensembles, les comptes de technologies, les références de flux/scénarios, les ancres et le filtrage par branche.

- Accueil, trois rubriques, catalogue global et six articles complets d’exemple.
- Recherche locale dans les titres, extraits et sujets, combinée aux filtres.
- Sommaire avec ancres, articles associés et page 404.
- Menu mobile, focus clavier, lien d’évitement et réduction des animations selon les préférences système.
- Aucun compte, serveur applicatif ou service externe requis. Les contenus fournis sont pédagogiques et remplaçables.

Le [contrôle VMware](docs/VMWARE-VALIDATION.md) précise les versions, sources et limites des flux publiés.

## Rubrique Microsoft 365

La route `/microsoft-365` regroupe douze fiches et une carte interactive de 24 relations avec quatre scénarios thématiques, avec deux guides dans le catalogue. Les fiches sont dans `src/data/microsoft365.js`, la carte dans `src/data/microsoft365Communications.js`, les articles dans `src/data/content.js` et les références dans `src/data/microsoft365Sources.js`. Les captures des douze pages Microsoft Learn FR sont tracées dans `docs/microsoft365-sources-audit.json`.

Les exemples réseau concernent le cloud Worldwide. Ils ne remplacent pas la liste d’endpoints Microsoft en vigueur. Les icônes Microsoft 365, Exchange, Teams et Microsoft 365 Apps utilisent des pictogrammes sémantiques ; aucun logo de produit n’est présenté comme officiel lorsqu’il ne l’est pas. Entra utilise l’icône officielle existante.

## Domaine personnalisé

Le domaine GitHub Pages est `fullinfra.duckdns.org`, configuré dans les paramètres Pages du dépôt. Le DNS DuckDNS pointe actuellement vers GitHub Pages (`185.199.108.153`). Le HTTPS est activé. Le workflow compile à la racine `/` ; aucun préfixe `/fullinfra/` n’est nécessaire sur le domaine personnalisé.

Si un client de mise à jour automatique DuckDNS gère ce sous-domaine, conserver son adresse GitHub Pages plutôt que de la remplacer par l’adresse IP de la connexion Internet.

### Infographie des dépendances Microsoft 365

La rubrique commence par une infographie de 20 composants et 36 relations documentées. Elle précise notamment les dépendances de Teams vers Entra, les groupes Microsoft 365, Exchange, SharePoint et OneDrive. Planner, OneNote, la vidéo Clipchamp, Copilot et les intégrations SharePoint de Power Platform sont représentés dans leur périmètre documenté. Ce périmètre ne constitue pas un inventaire exhaustif de toutes les offres Microsoft 365.

La sélection d’un service isole ses relations ; la liste de sélection fournit une alternative clavier. Un réglage permet d’agrandir la carte. L’infographie SVG téléchargeable inclut les 36 relations sous forme de liste. La carte précédente des accès réseau reste disponible dans un panneau dépliable.

Données : `src/data/microsoft365Dependencies.js`. Générateur : `src/dependencySvg.js`. Après une modification des données, régénérer le fichier public avec `node scripts/generate-m365-infographic.mjs`. Le workflow vérifie sa synchronisation. Sept pages Microsoft Learn FR supplémentaires sont tracées dans le manifeste des sources Microsoft 365.

Le rendu SVG a été rasterisé et inspecté pour vérifier les étiquettes. Cette vérification de l’illustration ne remplace pas une vérification du site dans un navigateur.

### Image d’architecture Microsoft 365

L’infographie affichée dans la rubrique Microsoft 365 est désormais l’image fournie par l’utilisateur, conservée sans modification dans `public/microsoft365-architecture.png` (1536 × 1024). Elle s’adapte à la largeur de l’écran et propose une ouverture en grand, un téléchargement et un résumé textuel. Les fiches techniques et la carte des accès réseau restent disponibles plus bas.
