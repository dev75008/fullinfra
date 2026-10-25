# Comparaison des 12 dépôts de l’image

Vérification et installation : 26 octobre 2026. Les étoiles de l’image sont une photographie ancienne, pas un critère de sécurité ni de compatibilité. Les dépôts ont été identifiés via GitHub, puis leurs README, licences, fichiers de skills et arborescences ont été examinés. Les révisions exactes figurent dans chaque ORIGIN.json.

| Nom sur l’image | Dépôt identifié | État et intégration |
| --- | --- | --- |
| UI/UX Pro Max | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill | Déjà installé dans `.codex/skills/ui-ux-pro-max`, conservé. |
| Awesome DESIGN.md | https://github.com/VoltAgent/awesome-design-md | Nouvelle intégration locale `awesome-design-md`, collection de systèmes de design. Aucun skill natif dans ce dépôt. |
| Open Design | https://github.com/nexu-io/open-design | Nouvelle intégration `open-design`, 169 guides locaux et leurs ressources. L’application desktop, son daemon et son MCP ne sont pas installés. Certains guides sont des pointeurs vers d’autres bundles, pas des moteurs autonomes. |
| Taste Skill | https://github.com/leonxlnx/taste-skill | Déjà installé sous `design-taste-frontend`, conservé. |
| Impeccable | https://github.com/pbakaus/impeccable | Skill natif installé ; moteur Windows vérifié par SHA-256, version applicative 4.7.1, canal engine-v0.1.17. Chargement du contexte testé ; télémétrie désactivée. |
| React Bits | https://github.com/DavidHDev/react-bits | Adaptateur local `react-bits`, documentation, index et sources des variantes JS/CSS et TS/CSS. Ce dépôt fournit des composants, pas un skill natif. Aucune dépendance ajoutée au site. |
| Emil Kowalski Skills | https://github.com/emilkowalski/skills | 15 skills natifs installés : conception, animations, tests de robustesse, mobile, choix de bibliothèques et Swift. |
| Hallmark | https://github.com/Nutlope/hallmark | Skill natif et ressources installés ; vérification syntaxique du script sloplint. Aucun hook installé ni navigateur lancé. |
| Google DESIGN.md | https://github.com/google-labs-code/design.md | Adaptateur `google-design-md`, spécification, exemples et CLI officiel `@google/design.md` 0.4.0. Le lint d’une fixture locale renvoie 0 erreur et 0 avertissement. Les skills de contribution internes à ce dépôt ne sont pas confondus avec le produit DESIGN.md. |
| GSAP Skills | https://github.com/greensock/gsap-skills | 8 skills officiels installés, activés seulement pour le travail correspondant à GSAP. |
| Scroll World | https://github.com/oso95/scroll-world | Skill natif et ressources installés. La génération vidéo payante Monid/Higgsfield n’est ni configurée ni autorisée par cette installation. |
| Canvas UI | https://github.com/DavidHDev/canvas-ui | Adaptateur `canvas-ui`, documentation et sources locales. Aucun service GPU, navigateur ou MCP installé. |

## Fonctionnement automatique

Les 31 nouvelles entrées sont dans `C:/Users/NH/.agents/skills/`. Les deux outils déjà présents restent dans `C:/Users/NH/.codex/skills/`. Les 31 fichiers SKILL.md passent le validateur Codex ; chaque `agents/openai.yaml` autorise l’invocation implicite. Le bloc `persistent-design-toolkit-2026` de `C:/Users/NH/.codex/AGENTS.md` définit le routage durable.

Les descriptions choisissent le skill selon la tâche, sans charger tous les packs. Les guides de mouvement ne justifient pas d’ajouter des animations à une page ; les références ne remplacent pas la charte existante. Hallmark n’est automatique que pour les nouveaux sites/pages, sauf demande explicite pour un design existant. Les 169 entrées OpenDesign sont empaquetées comme GUIDE.md pour éviter leur découverte comme 169 skills indépendants et les collisions de noms.

Cette installation ajoute des instructions et références persistantes. Elle n’entraîne pas les poids du modèle et ne prouve aucune économie de tokens. Les nouveaux outils peuvent nécessiter le tour ou la session suivante pour apparaître dans le catalogue de l’hôte ; les instructions persistantes indiquent aussi leurs chemins.

## Limites vérifiées

Les licences originales sont conservées. React Bits et Canvas UI appliquent MIT avec Commons Clause : l’usage dans un produit ne donne pas le droit de revendre ou redistribuer la bibliothèque de composants elle-même. Lire la licence avant chaque réutilisation concernée.

Les scripts des packs ne sont pas tous exécutés. Aucun contrôle visuel d’un site n’a été réalisé pour cette installation ; aucun site ni dépôt métier n’a été modifié. Les capacités dépendant de comptes, de crédits ou de services externes restent conditionnelles à leur disponibilité et aux autorisations.

## Intégration au site FullInfra

Le catalogue IA passe de 52 à **83 fiches**, réparties dans **huit domaines**. Les explications complètes, exemples et prérequis des nouvelles entrées sont consultables après déverrouillage sur [Outils IA](https://fullinfra.duckdns.org/outils-ia/).

Les données éditoriales restent locales dans le fichier exclu de Git `server/ai-skills.mjs`. La publication embarque uniquement le catalogue chiffré `public/ai-catalog.enc.json`. Les fixtures publiques utilisent des descriptions fictives. Ce rapport documente l’installation, sans exposer le mot de passe ou la clé de déchiffrement. Consulter [OUTILS-IA.md](OUTILS-IA.md) pour la procédure de mise à jour et les limites du chiffrement statique.

### Répartition des ajouts

- Design et rédaction : Impeccable, Hallmark, Emil Design Engineering, Break UI, Pick UI Library, Prototype, Awesome DESIGN.md et Google DESIGN.md.
- Animation et interactions : Animate, Animate Expo, Animation Performance, Animation Vocabulary, Apple Design, Ask Sonner, Find Animation Opportunities, Improve Animations, Mobile Native, Review Animations, React Bits, Canvas UI, Scroll World et les huit guides GSAP.
- Développement : Write Swift.
- Sites et documents : OpenDesign.


## Ajout des outils de reconstruction de code

Le catalogue passe de 83 à **88 fiches**, toujours dans huit domaines. La fiche Mimic complète le design ; les quatre outils de décompilation rejoignent le développement. Chaque fiche expose fonction, usage, exemple et état réel de disponibilité.

| Entrée | Source retenue | État local |
| --- | --- | --- |
| Mimic | https://github.com/sumanrox/mimic | Skill natif installé, adapté aux règles navigateur de l’hôte. Aucun contrôle visuel réalisé. |
| ReAgent | https://github.com/Dryxio/reagent | Paquets 0.4.0 et bridge Ghidra 0.2.0 installés depuis les sources épinglées ; adaptateur documentaire validé. Projet d’analyse et fournisseur non configurés ; fonctionnement complet non testé. |
| LLM4Decompile | https://github.com/albertan017/LLM4Decompile | Sources et adaptateur documentaire uniquement. Modèles et environnement Linux/CUDA non installés ; aucune inférence. |
| LLM_Decompiler | https://github.com/Lami99/LLM_Decompiler | Correspondance retenue pour un nom ambigu. Sources et adaptateur documentaire uniquement ; dépendances historiques et shell Unix non validés. |
| AI Code Decompile | https://github.com/zhongguagua/ai-code-decompile | Sources du frontend et adaptateur documentaire uniquement. Backend distant non fourni ; aucun code envoyé à JSUnpack. |

Mimic et LLM_Decompiler ont été identifiés à partir de leurs fonctions et de leurs noms ; les autres projets homonymes ne sont pas inclus. Les fichiers ORIGIN.json locaux conservent les révisions des sources.

La vérification automatique a bloqué une commande groupée d’intégration et de test sans motif détaillé. L’intégration a été limitée à la documentation et aux déclarations de skills ; aucun test d’exécution de cible ou d’analyse IA n’a été effectué. Ne pas interpréter « paquet installé » ou « sources téléchargées » comme une décompilation complète validée.

LLM4Decompile distingue la licence du code de celle de ses checkpoints. Aucune licence explicite n’a été trouvée dans les deux derniers dépôts ; leur code n’est pas republié sur FullInfra. Le site ne publie que ses propres descriptions dans le catalogue chiffré. Les outils nécessitant un fournisseur ou une API distante ne sont pas activés par la consultation des fiches.
