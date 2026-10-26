// Les outils sont interchangeables : ce parcours ne dépend d’aucun fournisseur cloud.
export const devopsClassicSources = {
  'classic-github': { title:'GitHub Actions : workflows et runners', url:'https://docs.github.com/fr/actions/get-started/understand-github-actions' },
  'classic-gitlab': { title:'GitLab : principes de CI/CD', url:'https://docs.gitlab.com/ci/' },
  'classic-jenkins': { title:'Jenkins : Pipeline as Code', url:'https://www.jenkins.io/doc/book/pipeline/' },
  'classic-docker': { title:'Docker : images, conteneurs et registres', url:'https://docs.docker.com/get-started/docker-overview/' },
  'classic-kubernetes': { title:'Kubernetes : rôle de l’orchestrateur', url:'https://kubernetes.io/fr/docs/concepts/overview/' },
  'classic-terraform': { title:'Terraform : infrastructure comme code', url:'https://developer.hashicorp.com/terraform/intro' },
  'classic-state': { title:'Terraform : données sensibles et état', url:'https://developer.hashicorp.com/terraform/language/manage-sensitive-data' },
  'classic-ansible': { title:'Ansible : inventaire, nœud de contrôle et machines gérées', url:'https://docs.ansible.com/projects/ansible/latest/getting_started/index.html' },
  'classic-windows': { title:'Ansible : administrer des hôtes Windows', url:'https://docs.ansible.com/projects/ansible/latest/os_guide/intro_windows.html' },
  'classic-winrm': { title:'Ansible : connexions WinRM', url:'https://docs.ansible.com/projects/ansible/latest/os_guide/windows_winrm.html' },
  'classic-prometheus': { title:'Prometheus : collecte de métriques et alertes', url:'https://prometheus.io/docs/introduction/overview/' },
  'classic-grafana': { title:'Grafana : exploration et visualisation des données', url:'https://grafana.com/docs/grafana/latest/introduction/' },
};

export const classicCycle = [
  {id:'planifier',title:'Planifier',icon:'users',detail:'Définir le besoin, les critères d’acceptation et les responsabilités.'},
  {id:'coder',title:'Coder',icon:'code',detail:'Versionner le code et les configurations ; faire relire les changements.'},
  {id:'construire',title:'Construire',icon:'container-local',detail:'Produire un paquet ou une image identifiés par une version.'},
  {id:'tester',title:'Tester',icon:'checklist',detail:'Exécuter les tests et les contrôles de sécurité bloquants.'},
  {id:'livrer',title:'Livrer',icon:'archive',detail:'Conserver l’artefact validé et préparer sa promotion.'},
  {id:'deployer',title:'Déployer',icon:'replication',detail:'Promouvoir la même version, avec validation selon le risque.'},
  {id:'exploiter',title:'Exploiter',icon:'server',detail:'Maintenir le service, ses accès, ses données et sa capacité.'},
  {id:'observer',title:'Observer',icon:'activity',detail:'Analyser métriques, journaux et incidents pour préparer la suite.'},
];

export const classicPillars = [
  {id:'ci-cd',title:'CI/CD',icon:'replication',sourceIds:['classic-gitlab','classic-github'],points:[
    'L’intégration continue construit et teste les changements de code ; les contrôles obligatoires en échec bloquent la suite.',
    'La livraison continue maintient une version prête à déployer, avec une approbation possible. Le déploiement continu automatise aussi la mise en production lorsque les critères sont satisfaits.',
    'Un runner ou agent exécute les jobs. Ses accès aux dépôts, aux registres et aux environnements doivent être limités.',
    'La version validée est promue entre les environnements ; la reconstruire à chaque étape peut introduire des différences.',
  ]},
  {id:'iac',title:'Infrastructure as Code (IaC)',icon:'terraform',sourceIds:['classic-terraform','classic-state','classic-ansible'],points:[
    'Les définitions décrivent l’infrastructure souhaitée et sont relues et versionnées comme le code applicatif.',
    'Terraform prépare un plan puis appelle les API des fournisseurs configurés : cloud public, plateforme de virtualisation ou autres services compatibles.',
    'L’état Terraform relie les ressources réelles à leur déclaration. Il peut contenir des données sensibles ; protégez son stockage et coordonnez les modifications concurrentes.',
    'Ansible décrit la configuration des systèmes : paquets, fichiers et services. L’idempotence dépend des modules et tâches utilisés ; elle n’est pas garantie par un simple script.',
  ]},
  {id:'conteneurs',title:'Conteneurisation',icon:'container-local',sourceIds:['classic-docker','classic-kubernetes'],points:[
    'Docker construit des images ; un conteneur est une instance exécutée à partir d’une image.',
    'Une image versionnée rapproche les environnements, mais le noyau, les paramètres, les volumes et les dépendances externes restent à maîtriser.',
    'Kubernetes orchestre les charges conteneurisées : placement, remplacement et évolution des réplicas selon les déclarations.',
    'Kubernetes n’est pas obligatoire pour démarrer. Un service sur VM ou une petite installation de conteneurs peut suffire ; prévoyez séparément persistance et sauvegardes.',
  ]},
  {id:'monitoring',title:'Monitoring et observabilité',icon:'activity',sourceIds:['classic-prometheus','classic-grafana'],points:[
    'Les métriques décrivent l’état et les performances ; les journaux consignent les événements. Les traces aident à suivre une requête entre services.',
    'Prometheus collecte des métriques, généralement par interrogation d’endpoints HTTP. Des exporters exposent les mesures des systèmes et applications.',
    'Grafana interroge des sources de données et présente les résultats dans des tableaux de bord. Les journaux nécessitent aussi une source et une collecte adaptées.',
    'Une alerte doit avoir un destinataire et une procédure. Les incidents et retours utilisateurs alimentent les priorités, les tests et les améliorations suivantes.',
  ]},
  {id:'collaboration',title:'Collaboration entre Dev, Ops et sécurité',icon:'users',sourceIds:['classic-gitlab','classic-github'],points:[
    'Développeurs, exploitation, qualité et sécurité partagent les critères d’acceptation et la responsabilité du service.',
    'Les revues de code et demandes de changement rendent les décisions et leurs validations visibles.',
    'La documentation précise le déploiement, les dépendances, la supervision et les actions de reprise.',
    'Un retour d’expérience après incident recherche les causes et les actions préventives. Installer un outil CI/CD ne remplace pas cette organisation.',
  ]},
];

export const classicTools = [
  {name:'GitHub / GitLab',icon:'code',role:'Héberger les dépôts Git, suivre les versions, organiser les branches et les revues. Git conserve l’historique ; la plateforme apporte les fonctions de collaboration.',sourceIds:['classic-github','classic-gitlab']},
  {name:'GitHub Actions / GitLab CI/CD / Jenkins',icon:'replication',role:'Exécuter les tests, la construction et les déploiements avec des workflows versionnés et des runners ou agents adaptés.',sourceIds:['classic-github','classic-gitlab','classic-jenkins']},
  {name:'Docker',icon:'container-local',role:'Construire des images et exécuter des conteneurs. Un registre distribue les images ; les données persistantes se gèrent séparément.',sourceIds:['classic-docker']},
  {name:'Kubernetes',icon:'cluster',role:'Orchestrer les applications conteneurisées quand le volume, la disponibilité ou l’organisation le justifient. Ce n’est pas un prérequis au DevOps.',sourceIds:['classic-kubernetes']},
  {name:'Terraform',icon:'terraform',role:'Décrire et provisionner des ressources via les fournisseurs disponibles, sur site ou dans le cloud. Examiner le plan avant toute application.',sourceIds:['classic-terraform','classic-state']},
  {name:'Ansible',icon:'settings',role:'Configurer les systèmes à partir d’un inventaire et de playbooks : Linux et Windows utilisent des modules et connexions adaptés.',sourceIds:['classic-ansible','classic-windows']},
  {name:'Prometheus',icon:'activity',role:'Collecter les métriques et évaluer des règles ; Alertmanager gère les notifications d’alerte.',sourceIds:['classic-prometheus']},
  {name:'Grafana',icon:'diagnostics',role:'Explorer les données des sources configurées et construire les tableaux de bord utiles à l’exploitation.',sourceIds:['classic-grafana']},
];

export const classicExample = [
  ['Versionner et relire','Le code, les définitions Terraform, les playbooks et le pipeline sont proposés dans GitLab ou GitHub. La revue précède la fusion.'],
  ['Préparer l’infrastructure','Terraform crée ou adapte les VM dans la plateforme de virtualisation retenue, si un fournisseur compatible existe. Le plan est examiné avant application.'],
  ['Configurer les serveurs','Ansible applique les paquets et services sur Linux, et les modules Windows adaptés via PSRP/WinRM ou SSH selon la configuration.'],
  ['Construire et tester','GitLab CI/CD, Jenkins ou GitHub Actions construit l’application, exécute les contrôles et publie un artefact identifié. Un échec bloquant arrête la livraison.'],
  ['Valider et déployer','La préproduction reçoit la même version. Après les validations prévues, elle est déployée par lots en production sur VM ou dans les conteneurs retenus.'],
  ['Observer et améliorer','Prometheus et les exporters recueillent les métriques ; Grafana les visualise. Les journaux sont centralisés séparément. Les alertes et incidents alimentent le backlog.'],
];

export const classicResponsibilities = [
  ['Systèmes','Administre les systèmes, les accès et la capacité.','Industrialise le provisionnement et maintient les définitions versionnées.'],
  ['Configuration','Configure et maintient les services.','Décrit, teste et réapplique les configurations avec les outils adaptés.'],
  ['Scripts','Écrit et exécute des scripts Bash ou PowerShell.','Intègre ces scripts à des pipelines avec contrôles, journaux et droits limités.'],
  ['Supervision','Surveille les services et traite les alertes.','Intègre les signaux d’exploitation aux critères de livraison et aux améliorations.'],
  ['Incidents','Rétablit le service et participe à l’analyse.','Améliore aussi les tests, procédures et mécanismes de déploiement et de reprise.'],
];

export const classicGuides = [
  {slug:'pipeline-independant-du-cloud',category:'devops-classique',title:'Construire un pipeline CI/CD indépendant du cloud',excerpt:'Du commit à la production : tests, artefact versionné, préproduction et contrôles de livraison.',topic:'CI/CD',level:'Guide pratique',date:'2026-10-26',sourceIds:['classic-gitlab','classic-github','classic-jenkins'],sections:[
    ['Définir la livraison attendue','Choisissez le paquet ou l’image à produire, les systèmes cibles et les tests nécessaires. GitLab CI/CD, GitHub Actions et Jenkins peuvent piloter ce travail : le choix dépend des dépôts, des compétences et de l’exploitation des agents.'],
    ['Isoler les accès des agents','Un runner doit accéder seulement aux services utiles à sa tâche. Séparez les contrôles des contributions non approuvées et les opérations disposant de droits de production. Ne placez pas de secret dans le dépôt.'],
    ['Construire une version traçable','Associez l’artefact au commit, aux dépendances et aux résultats de tests. Conservez cet artefact pour les promotions suivantes ; une reconstruction peut produire une version différente.'],
    ['Valider avant la promotion','Les contrôles requis doivent bloquer le passage à l’étape suivante en cas d’échec. Prévoyez une préproduction et les approbations adaptées au risque avant d’utiliser les accès de production.'],
    ['Contrôler le service livré','Vérifiez le démarrage, une requête représentative et les erreurs après livraison. Définissez les conditions d’arrêt et de reprise. Remettre une ancienne application ne restaure pas automatiquement une base de données modifiée.'],
  ]},
  {slug:'terraform-ansible-serveurs',category:'devops-classique',title:'Terraform et Ansible : répartir les responsabilités sur les serveurs',excerpt:'Distinguer le provisionnement des ressources, la configuration des systèmes et les accès nécessaires.',topic:'Infrastructure comme code',level:'Fondamentaux',date:'2026-10-26',sourceIds:['classic-terraform','classic-state','classic-ansible','classic-windows','classic-winrm'],sections:[
    ['Délimiter les ressources gérées','Terraform utilise les fournisseurs configurés pour gérer les ressources exposées par leurs API. Vérifiez la compatibilité de la plateforme, les droits et le cycle de vie des VM avant de rédiger la configuration.'],
    ['Protéger l’état et examiner le plan','Le fichier d’état associe déclarations et ressources réelles ; il peut contenir des données sensibles. Préparez un stockage protégé et une coordination des exécutions. Examinez les créations, remplacements et suppressions avant application.'],
    ['Préparer l’inventaire Ansible','L’inventaire identifie les machines gérées et leurs groupes. Les playbooks décrivent les tâches ; les paramètres d’environnement et les secrets doivent être traités séparément. Testez les tâches et leur répétition avant généralisation.'],
    ['Adapter les connexions à chaque système','Linux utilise fréquemment SSH. Pour Windows, Ansible propose notamment PSRP/WinRM et SSH selon les prérequis et versions. Les modules Windows et la configuration d’authentification doivent correspondre au transport retenu ; validez les certificats lorsque HTTPS est utilisé.'],
    ['Procéder par lots','Appliquez d’abord les changements à un groupe pilote, puis contrôlez les services et les dérives. Terraform et Ansible ne remplacent ni la sauvegarde des données ni une procédure de restauration testée.'],
  ]},
];
