import { branch as b, technology as t, flow as f, createEcosystem } from './ecosystemModel';
import { referenceTuples } from './referenceCatalog';

const api = [['HTTPS / API Azure','TCP 443','Appels de gestion ou de service vers les endpoints autorisés ; les permissions restent nécessaires.']];
const logical = [['Configuration / mécanisme','Aucun port propre','Le mécanisme utilise les API de gestion ou les transports des ressources auxquelles il s’applique.']];
const branches = [
  b('identites','Identités & accès','identity','Entra ID · RBAC · Identités','Identifier les acteurs et autoriser leurs actions.','Une application utilise une identité managée pour accéder à un service sans conserver un mot de passe dans son code.',[
    t('Microsoft Entra ID','Annuaire et service d’identité utilisé pour les accès aux services cloud.',[
      'Authentification : l’utilisateur ou l’application prouve son identité avant de demander un accès.',
      'Jetons : un client reçoit un jeton destiné à une ressource et à un contexte précis.',
      'Distinction : Entra ID n’est pas un contrôleur de domaine AD DS accessible en LDAP classique.',
    ],[['OAuth 2.0 / OpenID Connect','HTTPS TCP 443','Acquisition de jetons et connexion aux applications compatibles.']]),
    t('Azure RBAC','Les rôles Azure déterminent les actions autorisées à un périmètre donné.',[
      'Attribution : elle associe une identité, un rôle et une portée de ressource.',
      'Héritage : les droits accordés à un niveau supérieur peuvent s’appliquer aux ressources enfants.',
      'Plans : les rôles de gestion et les accès aux données peuvent être distincts.',
    ],logical),
    t('Identités managées','Identités de charges dont Azure gère les informations d’authentification.',[
      'Système : une identité peut être attachée au cycle de vie d’une ressource.',
      'Utilisateur : une identité dédiée peut être affectée à plusieurs ressources compatibles.',
      'Autorisation : la présence de l’identité ne lui donne aucun accès automatique aux données.',
    ],[['Endpoint d’identité','Selon service ; endpoint local pour une VM','Le code demande un jeton par le mécanisme de sa plateforme, puis contacte le service cible.']]),
    t('MFA et accès conditionnel','Des contrôles peuvent renforcer l’accès selon le contexte.',[
      'Facteurs : une authentification supplémentaire réduit la dépendance au seul mot de passe.',
      'Conditions : les stratégies peuvent examiner les utilisateurs, applications ou signaux disponibles.',
      'Périmètre : fonctionnalités, licences et scénarios pris en charge doivent être vérifiés.',
    ],api),
  ]),
  b('reseau-cloud','Réseau & connectivité','network','VNet · DNS · VPN · Private Link','Construire les chemins entre ressources, utilisateurs et sites.','Une application rejoint sa base par un endpoint privé dont le nom DNS résout vers une adresse du VNet.',[
    t('VNet et sous-réseaux','Un réseau virtuel organise les espaces d’adresses et les ressources connectées.',[
      'Adressage : des plages non conflictuelles facilitent les liaisons entre réseaux.',
      'Sous-réseaux : ils découpent le VNet et portent certaines associations de sécurité ou de routage.',
      'Chemins : peering et routes permettent les communications compatibles sans fournir tous les services de sécurité.',
    ],[['IPv4 / IPv6','Couche 3 ; ports des applications','Le VNet transporte les flux ; il ne définit pas un port applicatif unique.']]),
    t('DNS et zones privées','Les noms doivent pointer vers le bon endpoint depuis chaque réseau.',[
      'Public : les zones publiques exposent des enregistrements aux résolveurs Internet.',
      'Privé : une zone privée liée au VNet permet une résolution interne adaptée.',
      'Hybride : des redirecteurs ou un résolveur configuré relient les besoins DNS locaux et cloud.',
    ],[['DNS','TCP/UDP 53','Requêtes vers le résolveur configuré ; la gestion des zones utilise les API Azure.']]),
    t('VPN Gateway et ExpressRoute','Deux approches pour relier un réseau local aux réseaux Azure.',[
      'VPN : un tunnel IPsec relie les passerelles sur un réseau de transport comme Internet.',
      'ExpressRoute : un circuit privé via un opérateur fournit une connectivité distincte.',
      'Routage : les préfixes, routes et règles doivent permettre le retour des communications.',
    ],[['IKE / IPsec','UDP 500 / 4500 ; ESP IP 50','VPN selon la présence de NAT-T.'],['BGP','TCP 179 si utilisé','Échange de routes ; le circuit privé n’est pas un port applicatif.']]),
    t('Private Endpoint','Une interface privée permet d’atteindre un service compatible via Private Link.',[
      'Destination : le service est accessible par une adresse privée dans le réseau concerné.',
      'DNS : la résolution doit conduire les clients autorisés à cette adresse.',
      'Accès : endpoint privé, désactivation de l’accès public et permissions sont des réglages distincts.',
    ],[['Protocole du service','443, 445, 1433 ou autre selon cible','Private Link ne transforme pas tous les protocoles en HTTPS.']]),
  ]),
  b('calcul','Calcul & machines virtuelles','desktop','VM · Disques · Bastion · VMSS','Exécuter les systèmes et ajuster leur capacité.','Un opérateur ouvre Bastion en HTTPS pour administrer une VM sur son adresse privée.',[
    t('Azure Virtual Machines','Machines IaaS dont le système invité reste administrable par le client.',[
      'Taille : le choix détermine les familles de processeurs, la mémoire et certaines limites.',
      'Système : comptes, correctifs et configuration applicative restent à gérer selon les services activés.',
      'Cycle de vie : arrêt et désallocation ont des effets différents sur l’allocation et la facturation du calcul.',
    ],[['RDP / SSH','TCP 3389 / 22 par défaut','Administration selon le système et le chemin autorisé ; aucun besoin d’exposition publique systématique.']]),
    t('Managed Disks','Disques persistants gérés utilisés par les VM.',[
      'Attachement : disques système et données sont associés aux VM compatibles.',
      'Performance : type, taille et limites influencent les IOPS et le débit disponibles.',
      'Protection : persistance d’un disque et existence d’une sauvegarde sont deux sujets distincts.',
    ],logical),
    t('Azure Bastion','Service permettant un accès administratif aux VM via un chemin contrôlé.',[
      'Client : une session depuis le portail utilise un accès HTTPS au service.',
      'Cible : Bastion rejoint la VM avec RDP ou SSH sur le réseau prévu.',
      'Dépendances : sous-réseau, règles NSG et ports internes dépendent du SKU et du scénario.',
    ],[['Client vers Bastion','HTTPS TCP 443','Entrée de la session via le portail.'],['Bastion vers VM','TCP 3389 / 22 par défaut','Flux distinct vers le système invité ; des ports personnalisés dépendent du SKU.'],['Composants Bastion','8080 / 5701 dans VirtualNetwork','Communications internes selon la matrice NSG du service ; ajouter les flux GatewayManager, sondes et sorties Azure documentés.']]),
    t('Virtual Machine Scale Sets','Groupes d’instances gérés selon un modèle de déploiement.',[
      'Modèle : il définit les paramètres communs et les options des instances.',
      'Échelle : des règles peuvent adapter le nombre d’instances aux signaux choisis.',
      'Application : stockage d’état et répartition de trafic doivent être conçus pour plusieurs instances.',
    ],api),
  ]),
  b('stockage-cloud','Stockage','storage','Blob · Files · Accès · Rétention','Choisir le service adapté aux objets et fichiers.', 'Une application dépose des objets dans Blob Storage tandis que les postes utilisent un partage Azure Files compatible.',[
    t('Blob Storage','Stockage d’objets accessibles par des API.',[
      'Organisation : un compte de stockage contient des conteneurs et des objets identifiés.',
      'Accès : l’application utilise un mécanisme d’autorisation pris en charge pour lire ou écrire.',
      'Cycle de vie : règles de conservation et niveaux d’accès doivent correspondre à l’usage des données.',
    ],[['REST sur HTTPS','TCP 443','Accès aux objets via l’endpoint du service.']]),
    t('Azure Files','Partages de fichiers utilisant les protocoles pris en charge par la configuration choisie.',[
      'SMB : un client compatible monte un partage avec les droits et la connectivité nécessaires.',
      'NFS : cette option possède ses propres exigences de compte, réseau et clients.',
      'Distinction : un partage ne s’utilise pas comme un disque bloc attaché à une VM.',
    ],[['SMB / NFS','TCP 445 / 2049 selon partage','Protocoles alternatifs selon le type de partage et sa configuration.']]),
    t('Autorisations et SAS','Les accès au stockage combinent identité, portée et permissions.',[
      'RBAC : des rôles de données peuvent autoriser les opérations prises en charge.',
      'SAS : une signature donne un accès limité selon les permissions et la durée prévues.',
      'Gestion : les clés et jetons doivent être protégés et révoqués selon leur mécanisme.',
    ],api),
    t('Versions et rétention','Les protections de données doivent être activées et adaptées au service.',[
      'Versions : certains services conservent plusieurs états d’un objet selon les options choisies.',
      'Suppression : la récupération dépend des fonctions activées et de leurs durées de conservation.',
      'Vérification : tester un retour à un état antérieur confirme le périmètre réellement protégé.',
    ],api),
  ]),
  b('securite-cloud','Sécurité','shield','NSG · Firewall · Key Vault','Contrôler les chemins réseau et protéger les secrets.','Une application autorisée lit son secret dans Key Vault ; un NSG limite les flux entrants du sous-réseau.',[
    t('Network Security Groups','Règles de filtrage associées aux sous-réseaux ou interfaces compatibles.',[
      'Critères : source, destination, protocole, port et priorité déterminent la décision.',
      'État : les NSG suivent les connexions ; une réponse autorisée ne nécessite pas une règle inverse identique.',
      'Limite : un NSG ne fournit ni routage ni inspection applicative complète.',
    ],logical),
    t('Azure Firewall','Service de filtrage réseau centralisable selon une architecture de routage.',[
      'Chemin : les routes doivent conduire le trafic au pare-feu pour que ses règles s’appliquent.',
      'Règles : les capacités réseau et applicatives dépendent de la politique et du SKU.',
      'Observation : les journaux permettent d’examiner les flux autorisés ou bloqués.',
    ],[['Flux filtrés','Selon les applications et règles','Aucun port unique ne décrit tout le trafic traversant le pare-feu.']]),
    t('Azure Key Vault','Service pour gérer des secrets, clés et certificats selon les objets pris en charge.',[
      'Identité : le client doit obtenir un jeton et disposer d’une autorisation sur les objets.',
      'Réseau : accès public filtré et endpoint privé sont des options distinctes de l’autorisation.',
      'Rotation : applications et procédures doivent prendre en compte renouvellement et nouvelles versions.',
    ],[['HTTPS / TLS','TCP 443','Accès aux endpoints Key Vault autorisés.']]),
    t('Defender for Cloud','Fonctions de posture et de protection des charges selon les plans activés.',[
      'Posture : des évaluations identifient les configurations nécessitant une attention.',
      'Protection : les capacités disponibles varient selon les charges et les plans.',
      'Responsabilité : une recommandation ou une alerte nécessite une analyse et une action adaptée.',
    ],api),
  ]),
  b('applications-cloud','Web & applications','web','App Service · Functions · Livraison','Publier des applications et choisir leur point d’entrée.', 'Un navigateur contacte Application Gateway en HTTPS ; la passerelle relaie la requête vers une application autorisée.',[
    t('Azure App Service','Plateforme d’hébergement web gérant une partie de l’infrastructure.',[
      'Déploiement : le code ou l’image est publié sur un environnement compatible.',
      'Configuration : paramètres, identité et secrets doivent être gérés séparément du code.',
      'Réseau : accès entrant privé et intégration réseau sortante répondent à des besoins différents.',
    ],[['HTTPS','TCP 443 par défaut','Accès au site ; les endpoints de déploiement et dépendances sont distincts.']]),
    t('Azure Functions','Exécution de fonctions déclenchées par des événements.',[
      'Déclencheur : HTTP, file ou autre événement selon les extensions prises en charge.',
      'Exécution : durée, montée en charge et capacités réseau varient selon le plan.',
      'État : persister les données nécessaires dans un service adapté plutôt que supposer une mémoire durable.',
    ],[['HTTPS / transport du déclencheur','TCP 443 pour HTTP sécurisé ; autres selon service','Une fonction non HTTP ne possède pas nécessairement un point d’entrée web public.']]),
    t('Application Gateway et Front Door','Points de livraison HTTP(S) avec des portées différentes.',[
      'Application Gateway : répartition régionale de couche 7 avec des règles de publication.',
      'Front Door : entrée globale pour des applications et origines compatibles.',
      'Protection : un WAF dépend des fonctionnalités et politiques activées, pas de la seule présence d’une passerelle.',
    ],[['HTTP / HTTPS','TCP 80 / 443 usuellement','Ports et certificats des frontends et backends selon configuration.']]),
    t('Load Balancer','Répartition de trafic TCP/UDP au niveau transport.',[
      'Règle : elle associe une entrée, un backend et les ports concernés.',
      'Sonde : elle vérifie un état choisi pour déterminer les cibles utilisables.',
      'Distinction : le service ne route pas les URL et n’assure pas à lui seul une terminaison TLS.',
    ],[['TCP / UDP','Ports configurés par règle','Le port des sondes est aussi à définir selon le service.']]),
  ]),
  b('donnees-cloud','Bases de données','storage','Azure SQL · PostgreSQL · Connexions','Accéder aux données en tenant compte du réseau et des identités.', 'Une application autorisée ouvre une connexion chiffrée à Azure SQL via le chemin réseau prévu.',[
    t('Azure SQL Database','Base relationnelle gérée dont les modalités de connexion sont configurables.',[
      'Service : l’application utilise le nom du serveur logique et une base accessible.',
      'Connexion : le mode Proxy ou Redirect change le chemin et les ports après le premier contact.',
      'Accès : règles réseau, chiffrement et permissions de base doivent être satisfaits ensemble.',
    ],[['TDS sur TLS — Proxy','TCP 1433','Les données restent relayées par la passerelle.'],['TDS sur TLS — Redirect public','TCP 1433 puis 11000–11999','Connexions supplémentaires vers les nœuds de la région SQL, selon la politique effective.'],['Redirect avec endpoint privé','TCP 1433–65535 selon la documentation Private Link','Exigences propres à ce scénario ; limiter les sources et destinations au chemin concerné, pas une ouverture générale.']]),
    t('Azure Database for PostgreSQL','Service PostgreSQL géré avec des paramètres réseau propres au déploiement.',[
      'Compatibilité : version et extensions disponibles doivent correspondre aux besoins de l’application.',
      'Connexion : le client utilise le nom résolu, le port et la configuration TLS attendus.',
      'Exploitation : sauvegarde, haute disponibilité et maintenance sont des options à examiner.',
    ],[['PostgreSQL sur TLS','TCP 5432 par défaut','Connexion au serveur autorisé ; accès réseau et authentification restent requis.']]),
    t('Accès privé aux données','Un chemin privé peut limiter la publication des services compatibles.',[
      'Endpoint : le service utilise le mécanisme réseau pris en charge par son offre.',
      'DNS : le nom doit résoudre vers le chemin privé depuis les clients concernés.',
      'Identité : une route privée ne confère aucun droit de lecture ou d’écriture.',
    ],[['Protocole de base','1433 ou 5432 selon service ; dépendances possibles','Le réseau privé ne remplace pas le protocole de la base.']]),
    t('Pools de connexions','Le client réutilise des connexions et traite les erreurs transitoires.',[
      'Réutilisation : limiter les ouvertures répétées réduit certains coûts de connexion.',
      'Limites : la taille du pool doit correspondre à la charge et aux capacités de la base.',
      'Résilience : temporisation et tentatives doivent éviter les doublons d’opérations non idempotentes.',
    ],[['Transport du pilote','Selon moteur de base','Le pool est un mécanisme client sans port supplémentaire.']]),
  ]),
  b('disponibilite-cloud','Disponibilité & reprise','availability','Zones · Répartition · PRA','Prévoir les domaines de panne et les dépendances.', 'Une application possède plusieurs instances réparties sur des zones compatibles et un plan distinct de reprise régionale.',[
    t('Zones de disponibilité','Domaines d’infrastructure séparés dans les régions et services compatibles.',[
      'Répartition : ressources zonales et services redondants par zone ont des modèles différents.',
      'Application : les instances doivent réellement utiliser la topologie prévue.',
      'Portée : la résilience de zone ne remplace pas une stratégie de reprise d’une région entière.',
    ],logical),
    t('Réplication et redondance','Les données peuvent avoir plusieurs copies selon le service et son niveau choisi.',[
      'Périmètre : identifier les copies locales, zonales ou géographiques réellement activées.',
      'Délai : une réplication asynchrone peut laisser une fenêtre de perte de données.',
      'Limite : une erreur logique peut être répliquée ; conserver un historique répond à un autre besoin.',
    ],logical),
    t('Azure Site Recovery','Orchestration de réplication et de basculement pour des scénarios compatibles.',[
      'Source : machines et infrastructures doivent satisfaire les prérequis du scénario.',
      'Plan : l’ordre, le réseau et les dépendances conditionnent la reprise applicative.',
      'Exercice : un test de basculement isolé permet d’évaluer le fonctionnement avant une crise.',
    ],[['HTTPS / réplication','TCP 443 vers Azure selon scénario','Les flux internes des appliances et des sources varient selon l’architecture.']]),
    t('RPO et RTO','Objectifs de perte de données et de remise en service.',[
      'RPO : mesure la fenêtre de données potentiellement non récupérables.',
      'RTO : définit la durée cible de retour du service, avec ses actions humaines et techniques.',
      'Validation : mesurer les résultats d’un exercice vérifie les hypothèses du plan.',
    ],logical),
  ]),
  b('automatisation-cloud','Automatisation & IaC','terminal','ARM · Bicep · Terraform · Scripts','Déployer de façon reproductible et contrôler les changements.', 'Une chaîne de déploiement applique un modèle Bicep après validation des changements et autorisation de son identité.',[
    t('Azure Resource Manager','Plan de gestion des ressources Azure.',[
      'Requêtes : les outils demandent création, lecture ou modification aux fournisseurs de ressources.',
      'Autorisations : l’identité doit disposer des actions nécessaires au bon périmètre.',
      'Distinction : l’API de gestion d’un compte de stockage ne se confond pas avec l’accès à ses objets.',
    ],api),
    t('Bicep','Langage déclaratif pour décrire des déploiements Azure.',[
      'Déclaration : le fichier décrit des ressources et leurs propriétés souhaitées.',
      'Paramètres : ils adaptent un même modèle à plusieurs environnements.',
      'Validation : examiner le résultat attendu avant application réduit les changements involontaires.',
    ],api),
    t('Terraform','Outil IaC utilisant un fournisseur pour piloter les ressources.',[
      'État : il associe les objets déclarés aux ressources qu’il gère.',
      'Plan : il présente les créations, modifications et suppressions envisagées.',
      'Protection : le stockage d’état peut contenir des données sensibles et nécessite un accès contrôlé.',
    ],api),
    t('Azure CLI et PowerShell','Outils de script pour les opérations Azure.',[
      'Authentification : sessions interactives et identités de charge ont des mécanismes distincts.',
      'Robustesse : contrôler les paramètres, les erreurs et l’état final de chaque ressource.',
      'Traçabilité : versionner le code et conserver les résultats utiles aux vérifications.',
    ],api),
  ]),
  b('sauvegarde-cloud','Sauvegarde & protection','maintenance','Coffres · Politiques · Restauration','Conserver des points de récupération réellement exploitables.', 'Un opérateur restaure un disque ou une VM dans un environnement isolé pour vérifier son plan de sauvegarde.',[
    t('Azure Backup','Service de sauvegarde dont les capacités dépendent de la charge protégée.',[
      'Périmètre : VM, fichiers et autres charges utilisent des mécanismes et coffres adaptés.',
      'Politique : fréquence et rétention déterminent les points de récupération conservés.',
      'Contrôle : l’état de la tâche et un test de restauration apportent des preuves complémentaires.',
    ],[['HTTPS / flux du scénario','TCP 443 vers Azure selon agent/service','Dépendances locales et endpoints à vérifier pour la charge choisie.']]),
    t('Coffres et droits','Les ressources de protection nécessitent une administration dédiée.',[
      'Accès : distinguer les droits de gestion du coffre et les opérations de restauration.',
      'Protection : examiner les fonctions contre la suppression selon le type de coffre.',
      'Dépendances : la région et les paramètres choisis peuvent limiter certains scénarios de récupération.',
    ],api),
    t('Rétention et récupération','La durée utile dépend du délai de détection des erreurs.',[
      'Historique : plusieurs points protègent contre une corruption découverte tardivement.',
      'Conformité interne : les durées doivent répondre aux exigences documentées de l’organisation.',
      'Coûts : capacité et opérations de récupération doivent être évaluées selon le scénario.',
    ],logical),
    t('Tests de restauration','Vérifier le service restauré plutôt que seulement la présence d’une copie.',[
      'Isolation : un environnement de test évite les conflits avec la production.',
      'Fonctionnel : vérifier les comptes, les données et les dépendances applicatives.',
      'Compte rendu : documenter le temps observé et les étapes qui ont nécessité une intervention.',
    ],[['Flux des ressources restaurées','Selon application et réseau de test','La restauration ne rétablit pas automatiquement toutes les dépendances externes.']]),
  ]),
  b('supervision-cloud','Supervision & observabilité','monitoring','Monitor · Logs · Traces · Alertes','Mesurer le fonctionnement et comprendre les incidents.', 'Une alerte de latence est corrélée aux traces applicatives et aux événements du déploiement.',[
    t('Azure Monitor','Ensemble de fonctions de métriques, collecte et alertes.',[
      'Métriques : séries temporelles pour suivre le comportement des ressources.',
      'Collecte : agents et règles sélectionnent les informations nécessaires selon la charge.',
      'Analyse : une mesure doit être interprétée avec son agrégation, sa période et son contexte.',
    ],[['Azure Monitor Agent','HTTPS TCP 443 sortant','Accès aux endpoints de contrôle et collecte autorisés.']]),
    t('Log Analytics et KQL','Stockage et interrogation de journaux dans un espace de travail.',[
      'Tables : chaque source alimente des données avec un schéma et un horodatage.',
      'KQL : les requêtes filtrent, regroupent et corrèlent les événements.',
      'Rétention : durée et volume de collecte influencent l’historique disponible et les coûts.',
    ],api),
    t('Application Insights','Télémétrie du fonctionnement applicatif selon l’instrumentation.',[
      'Requêtes : mesurer les temps de réponse et les erreurs côté application.',
      'Dépendances : relier les appels sortants aux opérations qui les déclenchent.',
      'Contexte : la qualité des traces dépend de l’instrumentation, du filtrage et de l’échantillonnage.',
    ],[['Ingestion de télémétrie','HTTPS TCP 443','Endpoints et mode de collecte selon le SDK ou l’agent utilisé.']]),
    t('Alertes et groupes d’actions','Transformation d’une condition détectée en notification ou action.',[
      'Condition : un seuil métrique ou une requête de logs peut déclencher une alerte.',
      'Réponse : groupe d’actions et destinataires définissent le traitement attendu.',
      'Qualité : temporisation, priorité et procédure de diagnostic limitent le bruit opérationnel.',
    ],[['HTTPS / notification','Selon action ; TCP 443 pour webhook HTTPS','Le canal réel dépend des actions configurées.']]),
  ]),
  b('gouvernance-cloud','Gouvernance & coûts','cloud','Abonnements · Policy · Budgets','Organiser les ressources et garder des règles lisibles.', 'Un projet possède son groupe de ressources, ses étiquettes et un budget qui notifie son responsable.',[
    t('Hiérarchie des ressources','Organisation des périmètres de gestion et de responsabilité.',[
      'Abonnement : périmètre de facturation et de gestion avec ses limites propres.',
      'Groupe de ressources : conteneur logique pour des ressources partageant un cycle de vie.',
      'Hiérarchie : groupes d’administration et portées héritées structurent plusieurs abonnements.',
    ],logical),
    t('Azure Policy','Évaluation et contrôle des configurations selon des définitions et effets.',[
      'Règle : elle décrit les conditions à examiner et l’effet souhaité.',
      'Portée : une affectation cible un périmètre et peut comporter des exemptions.',
      'Remédiation : les ressources existantes ne sont pas toutes corrigées automatiquement par une nouvelle affectation.',
    ],logical),
    t('Étiquettes et conventions','Métadonnées et noms facilitant la recherche et l’attribution des responsabilités.',[
      'Étiquettes : identifier projet, environnement et propriétaire avec des valeurs documentées.',
      'Héritage : ne pas supposer une propagation automatique des étiquettes à toutes les ressources.',
      'Nommage : respecter les contraintes propres à chaque type de ressource.',
    ],api),
    t('Budgets et analyse des coûts','Outils de suivi des dépenses et de notification.',[
      'Budget : un seuil peut déclencher des alertes selon la configuration.',
      'Limite : un budget ne coupe pas automatiquement les ressources qui dépassent le montant.',
      'Analyse : rapprocher consommation, étiquettes et besoins métier avant toute modification.',
    ],api),
  ]),
];

const edges = [
  f('login','clients','identites','Obtenir une identité cloud','OAuth 2.0 / OIDC · HTTPS TCP 443','Le client rejoint Entra ID et obtient un jeton adapté ; ce jeton doit viser la ressource et les autorisations attendues.'),
  f('deploy','clients','automatisation-cloud','Déployer avec les outils','HTTPS · TCP 443 vers le plan de gestion','L’opérateur ou le pipeline utilise ARM via son outil autorisé ; cette flèche ne représente pas l’accès aux données de l’application.'),
  f('vm-create','automatisation-cloud','calcul','Créer une VM','Lien logique · déploiement ARM / fournisseur Compute','Le modèle demande les ressources de calcul au plan de gestion ; il ne crée pas une session RDP vers la VM.','logical'),
  f('network-create','automatisation-cloud','reseau-cloud','Définir le réseau','Lien logique · déploiement ARM / fournisseur Network','L’outil décrit VNet, sous-réseaux et interfaces selon les permissions du déploiement.','logical'),
  f('rbac','identites','gouvernance-cloud','Définir les permissions','Lien logique · attributions Azure RBAC','Les rôles relient les identités aux portées de gestion ; ils sont évalués lors des requêtes autorisées.','logical'),
  f('policy','gouvernance-cloud','automatisation-cloud','Évaluer le déploiement','Lien logique · Azure Policy','Les règles applicables peuvent auditer, refuser ou modifier certaines configurations selon leurs effets.','logical'),
  f('dns','clients','reseau-cloud','Résoudre le nom du service','DNS · TCP/UDP 53 vers le résolveur','Le client utilise son résolveur ; les zones privées exigent un chemin de résolution adapté depuis le réseau de ce client.'),
  f('web-front','clients','applications-cloud','Ouvrir le site','HTTPS · TCP 443 usuellement','Le navigateur contacte le point d’entrée public ou privé configuré ; les permissions et le WAF éventuel restent distincts.'),
  f('web-backend','applications-cloud','calcul','Relayer vers une VM backend','HTTP(S) · port backend configuré','Exemple Application Gateway vers une application sur VM. Une application App Service autonome n’utilise pas nécessairement une VM gérée par le client.'),
  f('app-login','applications-cloud','identites','Demander des jetons','OAuth 2.0 / OIDC · HTTPS TCP 443 selon scénario','L’application utilise les mécanismes Entra pris en charge ; une identité managée peut obtenir son jeton par le mécanisme local de sa plateforme.'),
  f('secret','applications-cloud','securite-cloud','Lire un secret Key Vault','HTTPS · TCP 443','L’identité autorisée rejoint l’endpoint Key Vault ; réseau privé ou public filtré et permissions doivent être satisfaits ensemble.'),
  f('sql','applications-cloud','donnees-cloud','Interroger Azure SQL','TDS sur TLS · TCP 1433 initial','Le mode Proxy utilise 1433 ; Redirect exige des connexions supplémentaires dont les ports dépendent du chemin public ou privé et de la configuration.'),
  f('blob','applications-cloud','stockage-cloud','Lire ou écrire des objets','REST sur HTTPS · TCP 443','L’application accède à Blob Storage avec une autorisation de données ; les droits de gestion du compte ne suffisent pas toujours.'),
  f('files','calcul','stockage-cloud','Monter un partage Azure Files','SMB TCP 445 OU NFS TCP 2049 selon partage','La VM utilise le protocole correspondant au partage ; ces deux modes ne sont pas à considérer comme obligatoires simultanément.'),
  f('bastion-entry','clients','calcul','Ouvrir Bastion puis la VM','Client : HTTPS 443 ; Bastion → VM : RDP 3389 / SSH 22','Ce lien résume deux étapes de la branche Calcul. Les règles internes Bastion et les autres dépendances varient selon le SKU et le scénario.'),
  f('private-path','reseau-cloud','donnees-cloud','Fournir un chemin privé','Lien logique · Private Endpoint selon service','Le réseau et le DNS conduisent le client au service privé ; les données restent transportées par le protocole de la base.','logical'),
  f('nsg','securite-cloud','reseau-cloud','Filtrer les communications','Lien logique · NSG / règles et routes','Le NSG filtre les paquets au périmètre associé ; un pare-feu central ne voit le trafic que si les routes le dirigent vers lui.','logical'),
  f('zones','disponibilite-cloud','calcul','Répartir les instances','Lien logique · zones / capacité compatible','La répartition doit être prévue dans les ressources et l’application ; toutes les offres et régions ne proposent pas les mêmes capacités.','logical'),
  f('delivery','disponibilite-cloud','applications-cloud','Distribuer vers des cibles saines','Lien logique · répartition / sondes','Les sondes et règles choisies déterminent les cibles ; une entrée globale n’est pas équivalente à une répartition régionale.','logical'),
  f('protect','sauvegarde-cloud','calcul','Protéger les VM','Lien logique · politique et points de récupération','Azure Backup coordonne les mécanismes adaptés à la VM ; ce trait ne signifie pas que le coffre ouvre une session applicative dans l’invité.','logical'),
  f('backup-transfer','calcul','sauvegarde-cloud','Transmettre les données protégées','HTTPS TCP 443 vers Azure selon scénario','Les composants de sauvegarde communiquent avec leurs services ; endpoints et flux complémentaires dépendent de la charge et du mode.'),
  f('recovery','disponibilite-cloud','reseau-cloud','Préparer le réseau de reprise','Lien logique · routage et DNS du PRA','Les ressources restaurées nécessitent des chemins vers leurs dépendances ; le basculement ne recrée pas automatiquement tout le réseau métier.','logical'),
  f('vm-metrics','calcul','supervision-cloud','Envoyer les mesures de VM','Azure Monitor Agent · HTTPS TCP 443 sortant','L’agent contacte les endpoints de contrôle et de collecte autorisés selon ses règles de collecte.'),
  f('app-traces','applications-cloud','supervision-cloud','Envoyer les traces applicatives','Application Insights · HTTPS TCP 443','L’instrumentation transmet les données configurées ; vérifier les données envoyées, l’échantillonnage et les endpoints.'),
  f('alert','supervision-cloud','automatisation-cloud','Déclencher une action','HTTPS TCP 443 si webhook ou API configuré','Une alerte peut invoquer un endpoint autorisé ; cela dépend du groupe d’actions et des protections de la cible.'),
  f('costs','gouvernance-cloud','calcul','Encadrer le dimensionnement','Lien logique · budget et choix de capacité','Le suivi financier aide à décider ; un budget ne désalloue pas automatiquement les VM.','logical'),
  f('storage-rbac','identites','stockage-cloud','Autoriser l’accès aux données','Lien logique · rôle de données / jeton','Les permissions sont évaluées sur les requêtes de stockage ; l’attribution du rôle n’est pas un transfert de fichiers.','logical'),
  f('vault-identity','identites','securite-cloud','Autoriser les lectures de secrets','Lien logique · identité et permissions Key Vault','Un jeton valide doit être associé aux permissions nécessaires pour les objets ; il ne suffit pas de connaître l’URL du coffre.','logical'),
];

export const azureEcosystem = createEcosystem({
  slug:'azure',title:'Azure',icon:'cloud',accent:'#0078d4',hubTitle:['Microsoft','Azure'],clientLabel:'Utilisateurs · Applications',
  intro:'Du jeton d’identité aux données : explorez les échanges entre les services de votre environnement Azure.',
  overview:'Douze domaines Azure : distinguez les flux de données, les appels de gestion et les dépendances logiques.',
  ringLabel:'IDENTITÉ · RÉSEAU · DONNÉES · GOUVERNANCE',subtitle:'LE SOCLE DE VOTRE ENVIRONNEMENT CLOUD',
  note:'Les capacités et chemins réseau dépendent des régions, des offres, des plans et des paramètres des ressources.',branches,edges,
  protocolNote:'Les ports sont des repères de destination pour le scénario indiqué. Les appels HTTPS de gestion ne remplacent pas les flux de données : SMB, SQL ou SSH conservent leurs propres transports. Un endpoint privé change le chemin réseau, pas le protocole applicatif. Endpoints, DNS, retours et dépendances doivent être vérifiés pour chaque service ; cette carte ne constitue pas une matrice pare-feu exhaustive.',
  scenarios:[
    {id:'application',label:'Application & données',description:'Un exemple d’application utilisant Entra, Key Vault, Azure SQL et Blob Storage.',edges:['dns','web-front','app-login','secret','sql','blob','storage-rbac','vault-identity'],steps:[['dns','Résoudre le nom de l’application depuis le réseau client.'],['web-front','Ouvrir la connexion HTTPS au point d’entrée.'],['app-login','Obtenir les jetons nécessaires au scénario applicatif.'],['secret','Lire un secret seulement si l’application en dépend.'],['sql','Ouvrir la connexion SQL selon la politique configurée.'],['blob','Accéder aux objets avec les permissions de données.']]},
    {id:'deployment',label:'Déployer une VM',description:'Accès au plan de gestion puis création des ressources autorisées.',edges:['login','deploy','vm-create','network-create','rbac','policy','nsg'],steps:[['login','Authentifier l’opérateur ou la chaîne de déploiement.'],['deploy','Envoyer la demande au plan de gestion ARM.'],['policy','Évaluer les règles applicables au déploiement.'],['network-create','Définir les ressources réseau nécessaires.'],['vm-create','Créer les ressources de calcul compatibles.']]},
    {id:'private',label:'Accès privé',description:'Exemples d’administration et d’accès aux données sur des chemins contrôlés.',independent:true,edges:['dns','bastion-entry','files','private-path','sql','nsg'],steps:[['dns','Vérifier que les noms résolvent vers le chemin voulu.'],['bastion-entry','Administrer la VM via Bastion si ce service est choisi.'],['files','Monter un partage compatible depuis une VM autorisée.'],['private-path','Prévoir les endpoints privés compatibles pour les données.']]},
    {id:'operations',label:'Exploitation & reprise',description:'Protection, collecte et disponibilité sont des fonctions complémentaires.',independent:true,edges:['zones','delivery','protect','backup-transfer','recovery','vm-metrics','app-traces','alert','costs'],steps:[['zones','Distribuer les instances selon les domaines de panne.'],['protect','Affecter une politique de protection adaptée.'],['backup-transfer','Conserver les données avec le mécanisme prévu.'],['vm-metrics','Envoyer les mesures des machines.'],['app-traces','Corréler les traces avec l’état des ressources.'],['alert','Déclencher une action seulement si elle est configurée.']]},
  ],
  sources:referenceTuples(['nsg','bastion-ports','files-network','sql-network','keyvault-network','ama-network','appgateway']),
});
