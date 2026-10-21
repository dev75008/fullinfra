import { branch as b, technology as t, flow as f, createEcosystem } from './ecosystemModel';
import { referenceTuples } from './referenceCatalog';

const local = [['Mécanisme local', 'Aucun port propre', 'Les échanges réseau dépendent des services et de la plateforme utilisés.']];
const https = [['HTTPS / TLS', 'TCP 443 par défaut', 'Accès à une console ou une API ; endpoints et certificats à vérifier.']];
const winrm = [['WinRM', 'TCP 5985 / 5986', 'Administration distante Windows en HTTP/HTTPS selon le listener configuré.']];
const branches = [
  b('hyperviseurs','Hyperviseurs','layers','Hyper-V · Azure VMware Solution','Partager le matériel en isolant les systèmes invités.','Hyper-V s’administre sur les hôtes Windows. Azure VMware Solution est un service de cloud privé dont Microsoft gère l’infrastructure VMware.',[
    t('Hyper-V','Hyperviseur Microsoft intégré comme rôle de Windows Server.',[
      'Architecture : les VM disposent de ressources virtuelles ; la partition de gestion administre la plateforme.',
      'Administration : les outils Hyper-V et PowerShell créent, démarrent et configurent les VM.',
      'Compatibilité : les systèmes invités et les fonctionnalités disponibles dépendent de la version de l’hôte.',
    ],winrm),
    t('Azure VMware Solution','Cloud privé Azure associant des hôtes ESXi, vCenter, NSX et du stockage vSAN.',[
      'Infrastructure : Microsoft assure les opérations de la plateforme VMware dans le périmètre du service.',
      'Charges : le client administre ses VM et les configurations autorisées, avec les droits fournis par le service.',
      'Portée : ces fiches décrivent Azure VMware Solution ; elles ne sont pas une documentation complète de vSphere sur site.',
    ],[['HTTPS vers vCenter','TCP 443','Interface de gestion via le chemin privé prévu ; pas une autorisation d’administration directe de tous les hôtes.']]),
    t('Architecture Hyper-V','L’hyperviseur sépare une partition racine et des partitions enfants.',[
      'Partition racine : elle possède les accès matériels et héberge les composants de gestion et de virtualisation.',
      'Partitions enfants : elles exécutent les systèmes invités avec leurs ressources virtuelles.',
      'VMBus : les composants compatibles échangent par un bus de communication interne, sans port TCP/UDP propre.',
    ],local),
    t('Virtualisation matérielle','Fonctions du processeur et de la plateforme nécessaires à l’hyperviseur.',[
      'CPU : les extensions de virtualisation assistent l’exécution isolée des invités.',
      'Firmware : les options utiles doivent être activées et compatibles avec les exigences de l’hyperviseur.',
      'Imbrication : exécuter un hyperviseur dans une VM nécessite une prise en charge explicite.',
    ],local),
  ]),
  b('machines','Machines virtuelles','desktop','vCPU · RAM · Disques','Dimensionner les ressources et gérer le cycle de vie des invités.','Une VM applicative reçoit ses vCPU, sa mémoire et ses disques avant l’installation du système et des outils invités.',[
    t('vCPU et ordonnanceur','Le processeur virtuel est planifié sur les processeurs physiques.',[
      'Allocation : le nombre de vCPU influence le parallélisme possible de la charge.',
      'Contention : trop de VM actives peuvent attendre du temps processeur même si chacune possède plusieurs vCPU.',
      'Mesure : dimensionner à partir de la charge réelle et des compteurs de l’hôte et de l’invité.',
    ],local),
    t('Mémoire virtuelle','La mémoire de l’invité est fournie et contrôlée par l’hôte.',[
      'Réservation : certaines configurations garantissent une quantité minimale de mémoire.',
      'Ajustement : mémoire dynamique et mécanismes de récupération dépendent de l’hyperviseur et de l’invité.',
      'Pression : la pagination de l’hôte ou de l’invité peut fortement augmenter les temps de réponse.',
    ],local),
    t('Disques virtuels','Un disque invité est représenté par des fichiers ou des volumes gérés par la plateforme.',[
      'Formats : Hyper-V utilise notamment VHDX ; VMware utilise VMDK.',
      'Provisionnement : un disque extensible peut consommer progressivement l’espace sans réserver toute sa capacité.',
      'Capacité : surveiller l’espace réellement disponible sur le stockage physique et dans le système invité.',
    ],local),
    t('Outils invités','Services et pilotes facilitant l’intégration entre l’hôte et la VM.',[
      'Intégration : ils peuvent améliorer le réseau, le stockage et la remontée d’informations.',
      'Opérations : arrêt propre, synchronisation et sauvegarde cohérente dépendent des capacités installées.',
      'Suivi : leur état et leur compatibilité se vérifient après une évolution du système ou de l’hyperviseur.',
    ],local),
  ]),
  b('reseaux-virtuels','Réseaux virtuels','network','vSwitch · VLAN · Routage','Connecter les VM sans confondre commutation et services réseau.','Deux VM partagent un VLAN applicatif ; un routeur assure les échanges avec le VLAN des bases de données.',[
    t('Commutateurs virtuels','Ils relient les interfaces des VM entre elles et, si prévu, au réseau physique.',[
      'Interne : un réseau isolé peut limiter les communications au périmètre de l’hôte.',
      'Montant : les interfaces physiques transportent les flux vers les équipements réseau externes.',
      'Services : le commutateur ne fournit pas automatiquement DNS, DHCP, routage ou accès Internet.',
    ],[['Ethernet','Couche 2 ; sans port TCP/UDP','Commutation des trames entre interfaces.']]),
    t('VLAN','Le marquage sépare plusieurs domaines de diffusion sur une infrastructure partagée.',[
      'Identification : le VLAN est défini sur les ports virtuels ou groupes de ports selon la plateforme.',
      'Cohérence : la configuration des interfaces montantes doit correspondre à celle des commutateurs physiques.',
      'Routage : communiquer entre VLAN nécessite un équipement ou service de couche 3 et des règles adaptées.',
    ],[['IEEE 802.1Q','Couche 2 ; sans port TCP/UDP','Identification des VLAN sur les liens qui transportent les trames marquées.']]),
    t('Adressage et résolution','Les VM utilisent les mêmes principes IP et DNS que les serveurs physiques.',[
      'Adresse : une VM peut utiliser une configuration statique ou un bail DHCP.',
      'Passerelle : elle devient nécessaire pour atteindre un autre réseau IP.',
      'DNS : un problème de nom peut empêcher l’accès à un service pourtant joignable par adresse.',
    ],[['DNS','TCP/UDP 53','Résolution des noms.'],['DHCPv4','UDP 67 / 68','Attribution du bail si un serveur DHCP est configuré.']]),
    t('NAT et filtrage','Le routage, la traduction d’adresses et les pare-feu contrôlent les communications.',[
      'NAT : il traduit les adresses selon les règles du routeur ou de l’hôte.',
      'Filtrage : les règles doivent correspondre au sens, aux sources et aux services nécessaires.',
      'Diagnostic : valider route, DNS et pare-feu à chaque frontière du chemin réseau.',
    ],[['IPv4 / IPv6','Couche 3 ; ports applicatifs variables','Les applications déterminent les ports à transporter.']]),
  ]),
  b('stockage-virtuel','Stockage','storage','Datastores · SMB · NFS · iSCSI','Conserver les disques de VM et maîtriser les performances.','Hyper-V peut utiliser un partage SMB compatible. Azure VMware Solution peut utiliser un stockage externe documenté comme Azure NetApp Files.',[
    t('Datastores et volumes','Emplacements dans lesquels la plateforme conserve les fichiers des VM.',[
      'Organisation : séparer les usages facilite le suivi de la capacité et des performances.',
      'Partage : un stockage accessible par plusieurs hôtes peut permettre certains scénarios de mobilité.',
      'Surveillance : l’espace des snapshots et des migrations doit être pris en compte.',
    ],local),
    t('SMB 3','Protocole de partage de fichiers utilisable par Hyper-V dans des configurations prises en charge.',[
      'Accès : les hôtes lisent et écrivent les fichiers de VM sur le partage autorisé.',
      'Droits : les identités des hôtes et les permissions du partage doivent être cohérentes.',
      'Disponibilité : toutes les solutions SMB ne fournissent pas les garanties requises pour héberger des VM.',
    ],[['SMB 3','TCP 445','Accès au partage hébergeant les fichiers de VM.']]),
    t('NFS et stockage externe AVS','Azure VMware Solution peut utiliser les datastores Azure NetApp Files pris en charge.',[
      'Compatibilité : utiliser le protocole et les prérequis de l’intégration Azure NetApp Files documentée pour AVS.',
      'Réseau : région, connectivité et proximité du stockage font partie des conditions de déploiement.',
      'Distinction : ce scénario n’affirme pas que Hyper-V peut héberger directement ses VM sur un partage NFS.',
    ],[['NFS','Ports du scénario AVS / Azure NetApp Files','La matrice de ce déploiement prime sur une règle générique NFS ; ne pas réduire tous ses flux à 2049.']]),
    t('iSCSI et chemins multiples','iSCSI présente des blocs distants ; MPIO gère les chemins compatibles.',[
      'Initiateur : l’hôte se connecte à une cible et découvre les volumes qui lui sont présentés.',
      'Isolation : les permissions et le zonage logique doivent éviter un accès non prévu aux LUN.',
      'Multipathing : la politique de chemins doit respecter les exigences du stockage et de l’hyperviseur.',
    ],[['iSCSI','TCP 3260','Transport des accès bloc ; MPIO ne possède pas de port propre.']]),
  ]),
  b('gestion','Gestion centralisée','web','vCenter · Consoles · Inventaire','Piloter les hôtes, les droits et les objets de l’infrastructure.','Un administrateur utilise vCenter pour gérer un ensemble d’hôtes, sans accéder directement à chacun.',[
    t('vCenter dans Azure VMware Solution','Interface de gestion des ressources VMware autorisées dans le cloud privé.',[
      'Inventaire : le client consulte les charges et ressources exposées par son cloud privé.',
      'Périmètre : les droits fournis ne sont pas ceux d’un administrateur racine de l’infrastructure Microsoft.',
      'Connectivité : le chemin privé et la résolution de noms doivent permettre de joindre l’interface de gestion.',
    ],[['HTTPS','TCP 443','Accès à vCenter ; les flux internes Microsoft ne constituent pas des règles client universelles.']]),
    t('Consoles Hyper-V','Outils graphiques et PowerShell pour administrer les hôtes Microsoft.',[
      'Périmètre : Hyper-V Manager gère les hôtes auxquels l’opérateur est autorisé à se connecter.',
      'Accès : les prérequis distants dépendent de l’outil et de l’appartenance au domaine.',
      'Centralisation : une plateforme de gestion supplémentaire peut organiser un parc plus large.',
    ],winrm),
    t('Identités et rôles','Les permissions de gestion s’appliquent aux objets de la plateforme.',[
      'Rôles : attribuer des actions ciblées plutôt que donner systématiquement l’administration complète.',
      'Portée : les droits sur une VM ne donnent pas nécessairement la gestion de son hôte.',
      'Traçabilité : conserver les actions de l’opérateur dans les journaux de gestion.',
    ],https),
    t('Inventaire et modèles','Les modèles standardisent les VM et leur configuration initiale.',[
      'Référence : une image de base doit être maintenue et adaptée avant duplication.',
      'Personnalisation : identité système, réseau et secrets doivent être propres à chaque instance.',
      'Suivi : associer propriétaire, rôle et environnement à chaque objet facilite l’exploitation.',
    ],local),
  ]),
  b('disponibilite-vm','Haute disponibilité','availability','HA · Cluster · Capacité','Préparer la reprise des VM après la panne d’un hôte.','Après une panne physique, le cluster redémarre la VM sur un hôte disposant de ressources et d’un accès à ses disques.',[
    t('Failover Clustering','Le cluster Windows coordonne les rôles Hyper-V compatibles.',[
      'Nœuds : les hôtes participent à une même configuration de cluster validée.',
      'Reprise : une VM peut redémarrer sur un autre nœud après détection de panne.',
      'Limite : une reprise de VM n’empêche pas forcément une interruption applicative.',
    ],[['Service de cluster','UDP 3343 ; TCP 3343 selon opération','Communication inter-nœuds ; RPC et autres dépendances selon scénario.']]),
    t('Disponibilité du cluster AVS','Azure VMware Solution configure la disponibilité des clusters dans le périmètre de son offre.',[
      'Réserve : une partie de la capacité est conservée pour la reprise après panne d’un hôte.',
      'Infrastructure : Microsoft exploite le cluster ; le client conserve les responsabilités de ses applications.',
      'Distinction : la disponibilité d’un hôte ne dispense pas d’une sauvegarde et d’un plan de reprise applicatif.',
    ],[['Coordination AVS','Flux internes du service','Pas de port HA unique à ouvrir sur tous les réseaux du client.']]),
    t('Quorum et témoins','Le cluster Windows utilise des votes pour décider de son fonctionnement.',[
      'Votes : ils limitent le risque de plusieurs partitions actives isolées.',
      'Témoin : disque, partage ou cloud selon l’architecture choisie.',
      'Conception : positionner le témoin selon les domaines de panne et les prérequis du cluster.',
    ],[['SMB / HTTPS','TCP 445 / 443 selon témoin','Partage SMB ou témoin cloud ; un témoin disque utilise le transport de stockage.']]),
    t('Capacité de secours','La disponibilité dépend aussi des ressources physiques conservées en réserve.',[
      'Marge : prévoir la charge qui devra être reprise après la perte d’un hôte.',
      'Dépendances : CPU, mémoire, réseau et stockage doivent être dimensionnés ensemble.',
      'Validation : des tests de basculement vérifient le comportement réel des applications.',
    ],local),
  ]),
  b('mobilite','Migration & mobilité','maintenance','Live Migration · vMotion','Déplacer les VM avec une interruption maîtrisée.','Une VM est migrée vers un hôte compatible pour libérer son serveur physique avant une intervention.',[
    t('Live Migration Hyper-V','Déplacement d’une VM active entre hôtes Hyper-V compatibles.',[
      'Calcul : l’état de la VM est transféré pendant son fonctionnement.',
      'Authentification : prévoir la délégation Kerberos contrainte ; Credential Guard bloque la délégation CredSSP sur les serveurs concernés, notamment après une mise à niveau vers Windows Server 2025.',
      'Transport : les options TCP, compression ou SMB ont des exigences différentes. Ne supposez pas que l’authentification chiffre le transfert ; isolez la migration sur des réseaux privés approuvés.',
    ],[['Live Migration','TCP 6600 ou SMB TCP 445','Ports selon l’option de performance choisie ; dépendances d’authentification à ajouter.']]),
    t('Migration VMware HCX vers AVS','HCX prépare des chemins de migration entre une source VMware compatible et Azure VMware Solution.',[
      'Préparation : connecter les sites, définir les profils et créer le maillage de services nécessaire.',
      'Réseau : distinguer le trafic de gestion des flux de migration et d’extension réseau.',
      'Validation : un appairage de gestion réussi ne prouve pas que tous les chemins de migration sont utilisables.',
    ],[['Gestion HCX','HTTPS TCP 443 entre connecteur et gestionnaire cloud','Les flux des appliances et du maillage sont supplémentaires ; 443 seul n’est pas une matrice complète.']]),
    t('Migration du stockage','Déplacement des fichiers de VM vers une autre destination.',[
      'Périmètre : les disques peuvent être déplacés indépendamment de l’emplacement de calcul selon la plateforme.',
      'Capacité : la cible doit disposer d’espace et de performances suffisantes.',
      'Flux : les transports dépendent des datastores, de l’hyperviseur et du chemin de copie.',
    ],[['Transfert de stockage','Selon plateforme et stockage','Aucun port universel commun à toutes les migrations.']]),
    t('Maintenance d’un hôte','La mobilité permet de déplacer les charges avant une intervention.',[
      'Évacuation : vérifier que les autres hôtes peuvent accueillir les VM.',
      'Dépendances : les périphériques attachés ou options spécifiques peuvent empêcher une migration.',
      'Retour : contrôler l’état du cluster et des charges après la maintenance.',
    ],local),
  ]),
  b('sauvegarde-vm','Sauvegarde & PRA','storage','Copies · Réplication · Restauration','Conserver des états récupérables et tester la reprise.','Une copie indépendante permet de restaurer une VM supprimée ; la réplication sert à préparer une reprise sur un autre site.',[
    t('Snapshots et checkpoints','Points de retour temporaires liés aux disques de la VM.',[
      'Usage : conserver un état avant une modification maîtrisée.',
      'Croissance : les fichiers différentiels consomment de l’espace avec les écritures.',
      'Limite : ils ne remplacent pas une sauvegarde indépendante avec rétention.',
    ],local),
    t('Sauvegarde cohérente','Une copie exploitable tient compte du système et des applications.',[
      'Cohérence : les outils invités et mécanismes applicatifs peuvent préparer les données.',
      'Rétention : plusieurs états sont nécessaires pour revenir avant une corruption tardivement détectée.',
      'Isolement : les accès au dépôt doivent limiter le risque de perte simultanée de la production et des copies.',
    ],[['Transport de sauvegarde','Selon produit et dépôt','Consulter les flux du produit ; HTTPS et SMB ne couvrent pas toutes les solutions.']]),
    t('Hyper-V Replica','Réplication asynchrone vers un hôte secondaire compatible.',[
      'Réplica : l’hôte secondaire conserve un état utilisable pour la reprise.',
      'Basculement : les scénarios planifiés et non planifiés ne garantissent pas la même perte de données.',
      'Distinction : une réplication ne remplace pas la conservation indépendante des sauvegardes.',
    ],[['HTTP / HTTPS','TCP 80 / 443 par défaut','Kerberos sur HTTP ou certificats sur HTTPS selon le mode configuré.']]),
    t('Tests de restauration','Ils vérifient la capacité réelle à remettre le service en fonctionnement.',[
      'Isolation : restaurer dans un réseau de test évite les conflits avec la production.',
      'Critères : vérifier démarrage, données, identité et dépendances applicatives.',
      'Mesure : comparer le temps et la perte de données observés aux objectifs RTO/RPO.',
    ],local),
  ]),
  b('securite-vm','Sécurité & isolation','shield','RBAC · Segmentation · TLS','Protéger les hôtes et réduire les accès entre environnements.','Le réseau de gestion des hôtes est séparé du trafic utilisateur ; les opérateurs disposent de rôles ciblés.',[
    t('Plan de gestion','Les interfaces d’administration donnent accès à des fonctions sensibles.',[
      'Isolation : séparer la gestion des flux applicatifs facilite leur contrôle.',
      'Accès : réserver les consoles aux opérateurs et chemins d’administration autorisés.',
      'Protection : utiliser les mécanismes d’authentification et de chiffrement pris en charge.',
    ],https),
    t('Segmentation des VM','Le réseau virtuel sépare les environnements et limite les mouvements latéraux.',[
      'Périmètres : distinguer les zones de test, de production et d’administration.',
      'Flux : autoriser les échanges nécessaires entre services plutôt que supposer une confiance globale.',
      'Limite : un VLAN seul ne constitue pas une politique complète de sécurité.',
    ],[['VLAN / pare-feu','802.1Q ; ports applicatifs variables','Le VLAN identifie une zone ; le filtrage porte sur les communications autorisées.']]),
    t('Chiffrement des échanges','Les mécanismes disponibles dépendent du trafic et de la plateforme.',[
      'TLS : protège les consoles et API configurées en HTTPS.',
      'Certificats : vérifier les noms, la confiance et les dates d’expiration.',
      'Migration : le chiffrement des migrations est une capacité distincte à vérifier pour chaque plateforme.',
    ],https),
    t('Durcissement et mises à jour','La sécurité des VM dépend aussi de celle de l’hyperviseur.',[
      'Surface : limiter les services inutiles et les accès directs aux hôtes.',
      'Correctifs : suivre les avis de l’éditeur et la compatibilité des composants.',
      'Invités : maintenir les systèmes et applications de chaque VM reste indispensable.',
    ],local),
  ]),
  b('automatisation-vm','Automatisation','terminal','PowerShell · API · IaC','Rendre les opérations répétables et traçables.','Un script crée une VM à partir d’un modèle, applique les paramètres réseau puis vérifie son état.',[
    t('PowerShell Hyper-V','Les cmdlets pilotent les objets et les opérations des hôtes Microsoft.',[
      'Objets : les résultats peuvent être filtrés et exportés sans traiter une sortie texte.',
      'Portée : les actions s’exécutent avec les droits du compte utilisé.',
      'Distance : une exécution distante ajoute les prérequis réseau et d’authentification associés.',
    ],winrm),
    t('Run Command dans AVS','Azure VMware Solution expose des commandes d’administration prévues par le service.',[
      'Catalogue : sélectionner une commande et ses paramètres parmi les opérations disponibles.',
      'Autorisation : l’accès à cette fonction ne correspond pas à un accès racine libre aux hôtes.',
      'Suivi : examiner le résultat de l’exécution avant de considérer une modification comme appliquée.',
    ],https),
    t('Infrastructure as Code Azure','Une description versionnée peut déployer des ressources Azure compatibles.',[
      'Bicep : décrit des ressources et leurs paramètres pour des déploiements Azure Resource Manager.',
      'Terraform : utilise un fournisseur et un état pour relier les déclarations aux ressources gérées.',
      'Portée : un modèle de ressources Azure n’est pas, à lui seul, une procédure de création de toutes les VM invitées VMware.',
    ],[['API de gestion Azure','HTTPS TCP 443','L’outil contacte ARM ; les accès métier des ressources restent distincts.']]),
    t('Idempotence et journaux','Une automatisation fiable contrôle son effet et ses erreurs.',[
      'Idempotence : une nouvelle exécution évite de créer des doublons inutiles.',
      'Erreurs : traiter les échecs par cible permet de distinguer succès partiels et résultat global.',
      'Secrets : conserver les identifiants hors du code et limiter leur durée d’utilisation.',
    ],local),
  ]),
  b('supervision-vm','Supervision','monitoring','Hôtes · Invités · Alertes','Observer les ressources et corréler les incidents.','Une lenteur de VM est rapprochée de la latence du datastore et de la charge physique de l’hôte.',[
    t('Mesures de l’hôte','Les compteurs décrivent l’usage du matériel et la contention.',[
      'CPU : examiner la charge et les attentes de planification selon la plateforme.',
      'Mémoire : suivre la pression et les mécanismes de récupération de l’hôte.',
      'Contexte : une valeur s’interprète avec la durée, la charge et le comportement des VM.',
    ],[['Compteurs Windows','Local ou transport de l’outil distant','Les compteurs de performance Hyper-V ne sont pas une API HTTPS universelle pour tous les hyperviseurs.']]),
    t('Mesures de l’invité','Les indicateurs applicatifs complètent les métriques de l’hyperviseur.',[
      'Système : observer mémoire, processeur, files d’attente et espace libre dans la VM.',
      'Application : mesurer temps de réponse, erreurs et dépendances métier.',
      'Corrélation : comparer les horodatages entre invité, hôte et stockage.',
    ],[['Agent de collecte','Selon outil configuré','Aucun port commun à toutes les solutions de supervision des VM.']]),
    t('Journaux et événements','Les traces expliquent les changements et les erreurs.',[
      'Sources : collecter événements des hôtes, opérations de gestion et erreurs applicatives.',
      'Horloge : la cohérence temporelle facilite la reconstruction d’un incident.',
      'Rétention : conserver l’historique utile même après une panne de l’hôte.',
    ],[['Windows Event Forwarding','WinRM TCP 5985 / 5986 selon transport','Exemple Windows/Hyper-V ; les journaux des autres plateformes nécessitent leur solution documentée.']]),
    t('Alertes et capacité','Les tendances permettent d’anticiper la saturation.',[
      'Seuil : associer un niveau, une durée et un périmètre à chaque alerte.',
      'Action : indiquer le service concerné et le premier diagnostic attendu.',
      'Projection : comparer la croissance des données et la consommation à la capacité de secours.',
    ],[['HTTPS / SMTP','Selon service de notification','API ou relais de messagerie configuré par l’outil.']]),
  ]),
  b('hybride-vm','Cloud & conteneurs','cloud','Azure · Réplication · Conteneurs','Étendre l’infrastructure sans confondre les modèles d’isolation.','Une VM locale est évaluée pour une migration cloud ; un conteneur applicatif conserve son propre cycle de vie.',[
    t('Migration vers le cloud','Elle déplace une charge vers une plateforme cible compatible.',[
      'Inventaire : documenter systèmes, dépendances, données et exigences de disponibilité.',
      'Compatibilité : les formats et périphériques peuvent nécessiter une conversion ou une recréation.',
      'Validation : tester les accès, les performances et les coûts après migration.',
    ],[['Réplication / API cloud','Selon outil ; HTTPS 443 vers Azure fréquent','Les flux internes et la configuration dépendent du scénario de migration.']]),
    t('Gestion hybride avec Azure Arc','Un serveur compatible peut être représenté comme ressource Azure.',[
      'Agent : il relie la machine à Azure sans la déplacer dans le cloud.',
      'Gestion : des extensions ajoutent des fonctions selon les services activés.',
      'Distinction : enregistrer un hôte ne migre pas automatiquement ses VM.',
    ],[['HTTPS','TCP 443 sortant','Communication vers les endpoints Arc autorisés ; dépendances optionnelles selon services.']]),
    t('Conteneurs','Une application et ses dépendances sont emballées dans une image.',[
      'Isolation : un conteneur partage généralement le noyau de son hôte ; des modes d’isolation supplémentaires existent.',
      'Persistance : les données durables doivent être séparées du cycle de vie de l’instance.',
      'Réseau : ports publiés, images et secrets restent à configurer selon le moteur et la plateforme.',
    ],[['Registre / API','HTTPS 443 selon service','Téléchargement des images ; les ports de l’application sont indépendants.']]),
    t('Reprise multisite','Une charge peut être préparée pour un redémarrage sur une autre infrastructure.',[
      'Données : la réplication et les sauvegardes répondent à des besoins complémentaires.',
      'Réseau : DNS, adressage, identité et routage doivent rester cohérents après basculement.',
      'Exercice : tester la reprise isolée et le retour vers le site principal.',
    ],[['Réplication intersite','Selon produit et cible','Aucun protocole universel pour tous les PRA de virtualisation.']]),
  ]),
];

const edges = [
  f('console','clients','gestion','Ouvrir la console','HTTPS · TCP 443','L’administrateur accède à vCenter ou à une console HTTPS autorisée ; ce chemin représente le plan de gestion.'),
  f('manage-esxi','gestion','hyperviseurs','Piloter le cloud privé AVS','Lien logique · orchestration vCenter / infrastructure AVS','Le client utilise les fonctions autorisées de vCenter ; les communications internes avec ESXi sont gérées dans le périmètre du service Microsoft.','logical'),
  f('manage-hyperv','automatisation-vm','hyperviseurs','Administrer Hyper-V','WinRM · TCP 5985 / 5986 si utilisé','PowerShell pilote l’hôte distant avec les droits de l’opérateur ; ce scénario est propre à Hyper-V.'),
  f('host-vm','hyperviseurs','machines','Exécuter les VM','Lien logique · hyperviseur et ressources','L’hyperviseur exécute les systèmes invités ; cette relation d’hébergement ne correspond pas à un port réseau autonome.','logical'),
  f('vm-net','machines','reseaux-virtuels','Connecter les interfaces','Lien logique · vNIC / vSwitch','Les cartes virtuelles rejoignent un commutateur ou groupe de ports. Les applications de la VM déterminent les flux réseau.','logical'),
  f('vm-service','clients','machines','Joindre un service invité','HTTPS 443, RDP 3389 ou SSH 22 selon service','Le client joint la VM par son réseau ; ces ports sont des alternatives selon le service publié, pas une liste à ouvrir systématiquement.'),
  f('net-dns','machines','reseaux-virtuels','Résoudre les noms','DNS · TCP/UDP 53 si résolveur dans ce périmètre','La VM contacte le DNS configuré. Le vSwitch ne fournit pas lui-même un service DNS.'),
  f('storage-smb','hyperviseurs','stockage-virtuel','Lire les disques Hyper-V','SMB 3 · TCP 445 si stockage SMB','Un hôte Hyper-V utilise un partage compatible et ses permissions ; un stockage local n’utilise pas ce flux.'),
  f('storage-nfs','hyperviseurs','stockage-virtuel','Utiliser un datastore externe AVS','NFS · selon intégration Azure NetApp Files','Ce scénario concerne Azure VMware Solution et les prérequis de son stockage externe documenté. Il ne décrit pas un stockage NFS de VM Hyper-V.'),
  f('storage-iscsi','hyperviseurs','stockage-virtuel','Accéder au stockage bloc','iSCSI · TCP 3260 si utilisé','L’initiateur de l’hôte se connecte à une cible autorisée ; la gestion de chemins dépend du stockage.'),
  f('policy','securite-vm','reseaux-virtuels','Définir la segmentation','Lien logique · VLAN et règles de filtrage','Les règles de sécurité encadrent les flux entre zones ; elles ne représentent pas un service réseau additionnel.','logical'),
  f('roles','securite-vm','gestion','Limiter les droits','Lien logique · rôles et périmètres','Les permissions déterminent les actions possibles dans les consoles ; la connexion HTTPS conserve son propre flux.','logical'),
  f('live-migration','mobilite','hyperviseurs','Déplacer une VM Hyper-V','TCP 6600 OU SMB TCP 445 selon mode','Les hôtes Hyper-V utilisent les transports configurés ; Kerberos et la compatibilité des hôtes ajoutent des prérequis.'),
  f('vmotion','mobilite','hyperviseurs','Préparer une migration HCX','Gestion HCX : HTTPS TCP 443 ; maillage selon scénario','Le connecteur rejoint le gestionnaire cloud ; les profils, appliances et flux de migration doivent aussi être validés. Ce n’est pas une règle vMotion générique.'),
  f('ha','disponibilite-vm','hyperviseurs','Orchestrer la reprise','Lien logique · cluster / HA','La plateforme coordonne la reprise sur un hôte disponible ; le service Windows de cluster ou les agents vSphere ont leurs propres flux.','logical'),
  f('witness','disponibilite-vm','stockage-virtuel','Joindre un témoin de partage','SMB · TCP 445 si cluster Windows avec ce témoin','Un partage témoin est une option du quorum Windows ; il ne décrit ni un témoin disque ni le mécanisme vSphere HA.'),
  f('backup','sauvegarde-vm','hyperviseurs','Coordonner la sauvegarde','API de plateforme ; transport selon produit','La solution de sauvegarde utilise les API et modes de transfert pris en charge ; le sens des données dépend du mode choisi.'),
  f('repository','sauvegarde-vm','stockage-virtuel','Écrire une copie indépendante','SMB 445, HTTPS 443 ou protocole du dépôt','Le dépôt reçoit les sauvegardes selon le produit ; une copie doit être restaurable indépendamment des disques de production.'),
  f('replica','sauvegarde-vm','hybride-vm','Préparer une reprise distante','HTTPS TCP 443 si Hyper-V Replica à certificats','Ce scénario utilise un réplica Hyper-V distant ; les outils cloud ou VMware peuvent employer des flux différents.'),
  f('script','clients','automatisation-vm','Lancer une automatisation','Exécution locale ou session distante configurée','L’opérateur lance le script depuis son poste ou une plateforme ; le déclenchement ne définit pas à lui seul un port réseau.','logical'),
  f('api','automatisation-vm','gestion','Automatiser via les API','HTTPS · TCP 443 selon console','Le client invoque les opérations AVS autorisées via le plan de gestion ; les actions du service et les sessions sur une VM sont distinctes.'),
  f('metrics','supervision-vm','gestion','Consolider les observations','Lien logique · tableaux de bord et compteurs','Les mesures locales et collectées sont rapprochées dans les outils choisis ; aucun port API commun ne s’applique à toutes les plateformes.','logical'),
  f('logs','hyperviseurs','supervision-vm','Transmettre les événements Hyper-V','WEF / WinRM · TCP 5985 / 5986','Exemple Windows avec abonnement initié par la source : l’hôte transmet les événements sélectionnés au collecteur configuré.'),
  f('guest-metrics','machines','supervision-vm','Envoyer les mesures invitées','Selon agent ; HTTPS TCP 443 si prévu','L’agent de la VM complète les métriques de l’hôte par celles du système et des applications.'),
  f('cloud-api','gestion','hybride-vm','Accéder à une gestion cloud','HTTPS · TCP 443 selon service','Une intégration hybride utilise les endpoints autorisés ; elle n’implique pas automatiquement une migration de toutes les VM.'),
  f('network-path','reseaux-virtuels','stockage-virtuel','Transporter les flux de stockage','Lien logique · chemin réseau','Les flux SMB, NFS ou iSCSI passent par les interfaces et équipements configurés ; ce trait décrit leur chemin, pas un nouveau protocole.','logical'),
];

export const virtualisationEcosystem = createEcosystem({
  slug:'virtualisation', title:'Virtualisation', icon:'layers', accent:'#5c2d91', hubTitle:['Virtualisation'], clientLabel:'Opérateurs · Utilisateurs',
  intro:'De la console aux VM : explorez les échanges entre calcul, réseau, stockage et services d’exploitation.',
  overview:'Douze domaines de virtualisation documentés par Microsoft Learn : Hyper-V et Azure VMware Solution restent des scénarios distincts.',
  ringLabel:'CALCUL · RÉSEAU · STOCKAGE · RÉSILIENCE', subtitle:'LE SOCLE DES ENVIRONNEMENTS VIRTUALISÉS',
  note:'Les fonctions et transports varient selon l’hyperviseur, la version, les licences et le stockage.', branches, edges,
  scenarios:[
    {id:'vm',label:'Accès à une VM',description:'Du client au service exécuté dans une VM.',edges:['vm-service','host-vm','vm-net','net-dns','policy'],steps:[['host-vm','L’hyperviseur fournit les ressources à la VM.'],['vm-net','La carte virtuelle rejoint le réseau prévu.'],['net-dns','La VM utilise les services DNS configurés.'],['vm-service','Le client contacte le service autorisé de la VM.']]},
    {id:'hyperv',label:'Hyper-V',description:'Administration et stockage d’un environnement Hyper-V avec SMB.',edges:['script','manage-hyperv','host-vm','storage-smb','live-migration','witness','ha'],steps:[['script','L’opérateur démarre son automatisation.'],['manage-hyperv','Le script contacte l’hôte via la session autorisée.'],['storage-smb','L’hôte utilise son stockage SMB si configuré.'],['live-migration','Une migration peut déplacer la VM vers un hôte compatible.']]},
    {id:'vmware',label:'Azure VMware Solution',description:'Accès au cloud privé, stockage compatible et préparation d’une migration HCX dans le périmètre Microsoft.',edges:['console','manage-esxi','host-vm','storage-nfs','vmotion','roles'],steps:[['console','L’administrateur rejoint vCenter par le chemin privé AVS.'],['manage-esxi','Le service AVS coordonne les hôtes du cloud privé.'],['storage-nfs','Le stockage externe respecte les prérequis de l’intégration AVS choisie.'],['vmotion','Le connecteur et le maillage HCX sont validés avant migration.']]},
    {id:'operations',label:'Protection & supervision',description:'Fonctions indépendantes de sauvegarde, journalisation et reprise.',independent:true,edges:['backup','repository','replica','metrics','logs','guest-metrics','cloud-api'],steps:[['backup','Coordonner la sauvegarde avec la plateforme.'],['repository','Conserver une copie sur un dépôt indépendant.'],['replica','Préparer un site secondaire si cette option est choisie.'],['logs','Collecter les journaux des hôtes.'],['metrics','Interroger les métriques et examiner les tendances.']]},
  ],
  sources:referenceTuples(['hyperv','avs-network','hv-migrate','hv-replica-config']),
});
