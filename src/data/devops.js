export const devopsTopics = [
  {id:'culture',title:'Culture, collaboration et planification',icon:'users',sourceIds:['devops-overview'],points:[
    'DevOps rapproche développement, exploitation, qualité et sécurité autour du cycle de vie du service. Ce n’est pas le nom d’un outil.',
    'Le backlog décrit les besoins, incidents et améliorations. Chaque changement possède des critères d’acceptation et un responsable identifié.',
    'Des changements limités facilitent la revue et l’analyse des incidents. Le retour d’expérience de production alimente les priorités suivantes.',
    'Azure DevOps est une plateforme de services ; GitHub Actions et Azure Pipelines sont des outils d’automatisation. Leur installation ne crée pas à elle seule une pratique DevOps.',
  ],example:'Une hausse de latence observée par l’exploitation devient une tâche du backlog, puis un correctif testé et suivi après livraison.'},
  {id:'git',title:'Git, branches et revue de code',icon:'code',sourceIds:['devops-git','devops-ci','devops-security'],points:[
    'Git conserve l’historique du code et des changements de configuration. Un commit identifie un état ; une branche permet de travailler sur une évolution.',
    'Une pull request rassemble la modification, son contexte et les résultats des contrôles avant la fusion.',
    'Les politiques de branche peuvent imposer des revues et des validations. La stratégie de branches dépend du produit et de sa cadence de livraison.',
    'Un dépôt n’est pas un coffre de secrets. Un jeton exposé doit être révoqué ou remplacé ; supprimer seulement la ligne du fichier ne suffit pas.',
  ],example:'Une correction est proposée dans une branche courte ; la revue et les contrôles requis passent avant la fusion vers la branche principale.'},
  {id:'ci',title:'Intégration continue et agents',icon:'automation',sourceIds:['devops-ci','devops-agents'],points:[
    'La CI automatise la récupération du code, les vérifications, les tests et la construction lors des événements configurés.',
    'Un agent ou runner exécute les tâches avec un système, des outils et des accès déterminés. Il peut être hébergé ou administré par l’équipe.',
    'Les dépendances, versions d’outils et fichiers de verrouillage doivent être maîtrisés. Une compilation réussie ne prouve pas que tous les comportements sont testés.',
    'La CI produit un artefact associé au commit et conserve ses résultats. Un échec doit empêcher la promotion lorsque le contrôle est obligatoire.',
  ],example:'Une pull request déclenche les tests ; après fusion, le pipeline produit une version identifiée qui sera promue entre les environnements.'},
  {id:'tests',title:'Tests et qualité logicielle',icon:'checklist',sourceIds:['devops-ci','devops-cd'],points:[
    'Les tests unitaires vérifient des éléments isolés ; les tests d’intégration vérifient leurs échanges avec d’autres composants.',
    'Les tests de bout en bout évaluent des parcours complets. Leur environnement, leurs données et leur durée doivent être contrôlés.',
    'Les contrôles de style, d’analyse statique et de dépendances complètent les tests fonctionnels. Chaque contrôle a un périmètre et des limites.',
    'La couverture de code est un indicateur, pas une garantie d’absence de défaut. Les tests instables doivent être diagnostiqués plutôt qu’ignorés.',
  ],example:'Un test d’intégration vérifie une API avec sa base de données ; un test de parcours contrôle ensuite la connexion d’un utilisateur.'},
  {id:'artefacts',title:'Artefacts, paquets et registres',icon:'archive',sourceIds:['devops-artifacts','devops-containers'],points:[
    'Un artefact est un résultat de construction : archive, paquet applicatif ou image de conteneur, selon le projet.',
    'Un dépôt de paquets et un registre d’images ne remplissent pas exactement le même rôle. Choisissez le stockage adapté au format livré.',
    'Conservez l’association entre version, commit, résultats des tests et contenu livré. Une étiquette d’image modifiable ne garantit pas à elle seule un contenu immuable.',
    'Promouvoir le même artefact validé limite les différences entre préproduction et production. Définissez les droits de publication et la rétention.',
  ],example:'Une image validée est stockée dans un registre et déployée par une référence précise ; elle n’est pas reconstruite différemment à chaque étape.'},
  {id:'cd',title:'Livraison, déploiement et retour arrière',icon:'migration',sourceIds:['devops-cd'],points:[
    'La livraison continue maintient une version prête à déployer, avec une décision de mise en production qui peut rester manuelle.',
    'Le déploiement continu automatise aussi la mise en production quand les critères requis sont satisfaits. Une approbation obligatoire modifie ce fonctionnement.',
    'Les environnements, contrôles et autorisations définissent le chemin de promotion. Les stratégies progressives réduisent l’exposition d’une nouvelle version.',
    'Préparez la réaction à un échec : arrêt, retour à une version compatible ou correctif. Une migration de données peut empêcher un retour arrière immédiat.',
  ],example:'Le même paquet passe en test, en préproduction puis en production après validation ; la télémétrie détermine si la livraison doit être arrêtée.'},
  {id:'conteneurs',title:'Docker et conteneurs',icon:'container-local',sourceIds:['devops-containers'],points:[
    'Une image contient les éléments nécessaires à l’exécution de l’application. Un conteneur est une instance exécutée à partir de cette image.',
    'Un conteneur n’est pas une machine virtuelle complète. Le modèle de noyau et d’isolation dépend du système et du mode d’exécution.',
    'Le Dockerfile décrit la construction de l’image. Maîtrisez l’image de base, les dépendances et les droits de l’application.',
    'Les données persistantes et les secrets ne doivent pas dépendre de la seule couche modifiable d’un conteneur. Leur stockage et leur protection sont à concevoir séparément.',
  ],example:'L’application est empaquetée dans une image ; les paramètres d’environnement et les accès aux données sont fournis lors du déploiement.'},
  {id:'kubernetes',title:'Kubernetes et orchestration',icon:'containers',sourceIds:['devops-kubernetes'],points:[
    'Kubernetes gère des charges conteneurisées selon un état déclaré. Le plan de contrôle et les nœuds ont des responsabilités différentes.',
    'Un Pod regroupe un ou plusieurs conteneurs ; un Deployment décrit notamment le nombre de réplicas et le déploiement d’une charge adaptée à ce contrôleur.',
    'Un Service expose un ensemble de Pods par une abstraction réseau. L’accès externe et le routage HTTP nécessitent les composants et paramètres prévus.',
    'Les contrôles de santé, ressources, droits et mises à jour restent à configurer. Utiliser Kubernetes ne garantit ni haute disponibilité ni sécurité automatiquement.',
  ],example:'Un Deployment demande plusieurs réplicas ; un Service permet de les joindre sans utiliser directement les adresses changeantes de chaque Pod.'},
  {id:'iac',title:'Infrastructure comme code : Bicep et Terraform',icon:'bicep',sourceIds:['devops-iac'],points:[
    'L’IaC décrit les ressources et leurs relations dans des fichiers versionnés, revus et déployés par un processus contrôlé.',
    'Bicep cible Azure Resource Manager. Terraform utilise des fournisseurs ; ces outils ne partagent pas la même syntaxe ni les mêmes mécanismes de gestion.',
    'Avant application, examinez les changements, les remplacements de ressources et les droits nécessaires. Un changement déclaratif peut aussi supprimer des ressources.',
    'Protégez les états et paramètres sensibles selon l’outil. Détectez les modifications manuelles et évitez les déploiements concurrents non coordonnés.',
  ],example:'Le réseau, la machine et ses règles sont décrits dans un modèle revu avant déploiement, plutôt que recréés manuellement sur chaque environnement.'},
  {id:'secrets',title:'Configuration, identités et secrets',icon:'keyvault',sourceIds:['devops-security'],points:[
    'Distinguez configuration non sensible et secrets : clés, mots de passe, certificats et jetons ont des besoins de protection particuliers.',
    'Conservez les secrets dans un coffre et attribuez aux identités du pipeline et de l’application les droits nécessaires à leur rôle.',
    'La portée des accès doit correspondre à l’environnement. Un contrôle sur une contribution non approuvée ne doit pas obtenir les privilèges de production.',
    'Prévoyez rotation, révocation et audit des accès. Masquer un secret dans les journaux ne remplace pas une gestion correcte de ses permissions.',
  ],example:'Le pipeline de production récupère les valeurs autorisées depuis un coffre ; elles ne sont pas enregistrées dans le dépôt de code.'},
  {id:'devsecops',title:'DevSecOps et chaîne de livraison',icon:'shield',sourceIds:['devops-security','devops-agents'],points:[
    'La sécurité intervient pendant la conception, la revue, la construction, le déploiement et l’exploitation, avec des responsables et des règles explicites.',
    'Analysez le code, les dépendances et les images selon les risques du projet. Un résultat doit conduire à une décision de correction, d’acceptation ou de blocage documentée.',
    'Protégez les agents, connexions de service et droits de publication : compromettre un pipeline peut modifier ce qui sera livré.',
    'Conservez la traçabilité des validations et des déploiements. Les outils de détection réduisent certains risques sans certifier une application sans faille.',
  ],example:'Une dépendance vulnérable déclenche une correction et de nouveaux tests avant la publication de l’artefact.'},
  {id:'observabilite',title:'Observabilité, fiabilité et amélioration',icon:'monitor',sourceIds:['devops-monitor','devops-overview'],points:[
    'Mesures, journaux et traces aident à comprendre l’état du service et les échanges entre ses composants.',
    'Choisissez des indicateurs liés à l’usage : disponibilité, latence ou erreurs. Les alertes doivent orienter une action avec un responsable identifié.',
    'Vérifiez l’état après déploiement, corrélez les incidents aux changements et préparez la remise en service.',
    'Le retour d’expérience alimente le backlog, les tests et les procédures. Le nombre de déploiements ne remplace pas l’évaluation de leur qualité et de la fiabilité.',
  ],example:'Une hausse d’erreurs après livraison provoque une alerte ; l’équipe stoppe l’exposition et utilise les traces pour identifier le changement en cause.'},
];

export const devopsPipeline = [
  {id:'besoin',label:'Définir le changement',input:'Besoin ou incident',check:'Critères d’acceptation et périmètre',output:'Tâche du backlog'},
  {id:'revue',label:'Coder et faire relire',input:'Branche et commits',check:'Revue et politiques du dépôt',output:'Changement traçable'},
  {id:'ci',label:'Exécuter la CI',input:'Événement du dépôt',check:'Agent, outils et dépendances contrôlés',output:'Résultats de construction'},
  {id:'tests',label:'Valider',input:'Code et construction',check:'Tests et analyses requis',output:'Candidat validé ou rejeté'},
  {id:'publier',label:'Publier l’artefact',input:'Candidat validé',check:'Version, intégrité et droits du registre',output:'Artefact identifiable'},
  {id:'preprod',label:'Vérifier en préproduction',input:'Même artefact et configuration adaptée',check:'Tests d’intégration et de parcours',output:'Version prête à promouvoir'},
  {id:'production',label:'Promouvoir en production',input:'Version approuvée selon la politique',check:'Autorisations et stratégie de déploiement',output:'Version déployée'},
  {id:'observer',label:'Observer et améliorer',input:'Télémétrie et retours utilisateurs',check:'État du service et critères d’arrêt',output:'Poursuite, remise en service ou nouvelle tâche'},
];

export const devopsGuides = [
  {slug:'comprendre-pipeline-ci-cd',category:'devops',title:'Construire un pipeline CI/CD compréhensible et contrôlé',excerpt:'Du commit à la production : séparer les tests, les artefacts, les approbations et la vérification après déploiement.',topic:'CI/CD',level:'Guide pratique',date:'2026-10-25',sections:[
    ['Définir le déclencheur et les contrôles','Décidez quels événements déclenchent les validations : pull request, fusion ou lancement approuvé. Choisissez un agent et des versions d’outils connus. Les tests et analyses obligatoires doivent bloquer la promotion lorsqu’ils échouent.'],
    ['Identifier ce qui est livré','Associez l’artefact à son commit, à sa version et aux résultats des validations. Stockez-le dans un dépôt ou registre adapté. Promouvez le même contenu entre les environnements au lieu de reconstruire une version différente à chaque étape.'],
    ['Séparer livraison et déploiement continus','Une version prête à livrer peut encore attendre une décision humaine avant la production. Le déploiement continu automatise cette dernière étape lorsque tous les critères définis sont satisfaits. Documentez la politique réellement appliquée.'],
    ['Prévoir le contrôle après déploiement','Vérifiez la disponibilité, les erreurs et la latence. Définissez les critères d’arrêt et le plan de remise en service. Un retour de version applicative ne restaure pas nécessairement une base de données modifiée.'],
  ]},
  {slug:'infrastructure-comme-code',category:'devops',title:'Infrastructure comme code : préparer un déploiement Bicep ou Terraform',excerpt:'Versionner l’infrastructure, examiner les changements et protéger les accès avant toute application.',topic:'Infrastructure comme code',level:'Bonnes pratiques',date:'2026-10-25',sections:[
    ['Choisir le périmètre et l’outil','Décrivez les ressources à gérer : réseau, calcul, stockage et droits. Bicep s’appuie sur Azure Resource Manager ; Terraform utilise ses fournisseurs. Le choix doit tenir compte des ressources, des pratiques de l’équipe et de leur exploitation.'],
    ['Faire relire les changements','Versionnez les définitions et séparez les paramètres des environnements. Examinez ce qui sera créé, modifié, remplacé ou supprimé. Une syntaxe valide ne garantit pas un changement sans interruption de service.'],
    ['Protéger l’exécution','Limitez les privilèges du déploiement et les accès aux états et valeurs sensibles selon l’outil. Coordonnez les applications concurrentes et conservez les résultats des changements. La présence de code ne dispense pas d’un plan de reprise.'],
    ['Contrôler les écarts','Vérifiez l’état obtenu et documentez les changements manuels. Une dérive doit être comprise avant de décider de réappliquer la définition ou de l’adapter.'],
  ]},
  {slug:'conteneurs-et-kubernetes',category:'devops',title:'Conteneurs et Kubernetes : comprendre les responsabilités',excerpt:'Image, conteneur, Pod, Deployment et Service : distinguer la construction de l’application de son orchestration.',topic:'Conteneurs',level:'Fondamentaux',date:'2026-10-25',sections:[
    ['Construire une image','Une image assemble les éléments nécessaires à l’exécution. Un conteneur en est une instance en cours d’exécution. Le choix de la base, des dépendances et de l’identité d’exécution participe à la sécurité et à la maintenance.'],
    ['Décrire une charge Kubernetes','Le Pod représente l’unité de travail ; un Deployment gère une charge et son évolution selon la déclaration fournie. Un Service permet de joindre les Pods correspondants via une abstraction réseau. Ces objets n’ont pas le même rôle.'],
    ['Préparer le fonctionnement réel','Configurez les ressources, les vérifications de santé, la connectivité et les droits. Les données persistantes et les secrets nécessitent un traitement spécifique. Kubernetes ne rend pas une application automatiquement résiliente.'],
    ['Suivre et mettre à jour','Conservez la référence de l’image déployée, observez les erreurs et testez les mises à jour. Prévoyez le comportement d’un remplacement de Pod et la compatibilité de l’application avec ses données.'],
  ]},
];
