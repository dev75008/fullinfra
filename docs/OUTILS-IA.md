# Outils IA sur GitHub Pages

La rubrique `/outils-ia/` fonctionne sans serveur. Elle contient 83 fiches réparties dans huit domaines, dont Ponytail, REA, Graphify et API Anything. Chaque fiche présente sa fonction, les usages, un exemple et les prérequis. Le site décrit ces skills ; il ne les exécute pas.

## Protection du catalogue

Seul le fichier `public/ai-catalog.enc.json` est publié : AES-256-GCM avec tag de 128 bits, sel aléatoire de 32 octets et IV aléatoire de 12 octets renouvelés à chaque chiffrement. La clé non exportable est dérivée du mot de passe par PBKDF2-HMAC-SHA-256 avec 1 200 000 itérations. L’en-tête de format et les paramètres attendus sont contrôlés avant dérivation ; le contenu déchiffré est validé avant affichage.

Le mot de passe est saisi dans le navigateur puis retiré du formulaire. Le site ne le transmet pas au serveur et ne l’enregistre ni en cookie ni dans localStorage ou sessionStorage. La clé n’est pas publiée. Le catalogue reste en mémoire après ouverture ; le bouton « Verrouiller », le changement de page, le rechargement et la fermeture de l’onglet ferment l’accès. Un verrouillage est programmé après 30 minutes ; les navigateurs peuvent différer les minuteurs des onglets suspendus. JavaScript ne garantit pas l’effacement physique de toutes les copies en mémoire.

Il s’agit de chiffrement statique, pas d’authentification serveur. Le fichier chiffré est téléchargeable et un attaquant peut tester des mots de passe hors ligne. Le nombre d’itérations ralentit ces essais sans les empêcher. Utiliser une phrase de passe longue et unique. Une personne disposant du mot de passe peut copier le contenu. Il n’existe ni révocation individuelle ni limitation globale des tentatives avec GitHub Pages.

Le mot de passe initial, déjà communiqué dans la conversation, doit être remplacé pour un usage sensible. Ne pas publier un catalogue réellement confidentiel avec ce secret initial. Les anciennes versions chiffrées peuvent rester disponibles dans l’historique Git : changer le mot de passe ne révoque pas les copies déjà téléchargées.

Références : [OWASP, dérivation des mots de passe](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) et [MDN, AES-GCM et IV](https://developer.mozilla.org/en-US/docs/Web/API/AesGcmParams). Le choix PBKDF2 permet d’utiliser Web Crypto natif sans ajouter de bibliothèque cryptographique au navigateur.

## Mettre à jour les fiches ou le mot de passe

La source éditoriale locale `server/ai-skills.mjs` est exclue de Git, ainsi que l’ancien serveur local. En conserver une sauvegarde privée séparée : le dépôt public ne permet pas de la reconstruire sans déchiffrement. Ne jamais ajouter cette source au dépôt public. Les fixtures des tests contiennent seulement des descriptions fictives.

Modifier la source privée puis exécuter :

```powershell
npm run password:ai
```

La commande demande le mot de passe en saisie masquée, vérifie les 83 fiches, chiffre le catalogue puis le déchiffre pour contrôler le résultat. Aucun mot de passe n’est sauvegardé. Un autre fichier source peut être indiqué :

```powershell
npm run password:ai -- C:/chemin/prive/ai-skills.mjs
```

La source doit exporter `skillGroups` avec les champs `id`, `name`, `description`, `skills`, et pour chaque fiche `id`, `name`, `summary`, `usage`, `example`, `requirements`.

Le pipeline GitHub Pages publie le fichier déjà chiffré. Aucun secret GitHub Actions n’est nécessaire et le pipeline ne doit pas avoir accès au mot de passe. Après modification, contrôler puis publier le fichier chiffré et le code :

```powershell
npm run check
npm run check:ui
npm run check:sources
npm run check:icons
npm run build
npm run check:ai
npm run check:seo
```

Les tests contrôlent le chiffrement et déchiffrement réels avec un mot de passe de test aléatoire, le refus des mauvaises clés et des altérations, la recherche, les filtres, les détails et le verrouillage. Les tests DOM ne remplacent pas une vérification visuelle dans un navigateur.

## Migration

L’ancien mécanisme Node/Argon2id et son fichier `.env.ai-tools.local` ne participent plus au site publié. Ils sont conservés localement pour permettre un retour, sans publication de leurs fichiers ni réutilisation du hachage dans le navigateur. L’ancien audit concernait ce mécanisme serveur ; il ne certifie pas la présente version statique. Le retrait de la rubrique Adressage réseau s’applique au menu, à l’accueil, aux guides et au sitemap ; ses anciennes URL retournent la page 404.

## Ajouts du 26 octobre 2026

Le catalogue comprend les 31 nouvelles entrées décrites dans [RAPPORT-INSTALLATION.md](RAPPORT-INSTALLATION.md) : 26 skills natifs et cinq adaptateurs de références. Les 52 fiches précédentes sont conservées. Le domaine « Animation, interactions et effets visuels » regroupe 21 fiches spécialisées ; les autres ajouts complètent le design, le développement et les sites et documents.

Les fiches distinguent les outils installés dans l’agent des composants qui devront être intégrés dans un projet. OpenDesign fournit ici des guides locaux, pas son application ou son serveur MCP. Scroll World ne dispose pas d’autorisation de dépense. React Bits et Canvas UI conservent leurs restrictions de licence. Lire une fiche du site n’active ni le skill ni ses services.
