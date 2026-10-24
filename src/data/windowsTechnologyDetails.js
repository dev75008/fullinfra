// Trois explications par technologie, dans le même ordre que les détails de chaque branche.
export const windowsTechnologyDetails = {
  'active-directory': [
    [
      'Annuaire : AD DS stocke les objets utilisateurs, groupes et ordinateurs. Les rôles FSMO réservent certaines opérations à un détenteur unique : schéma et noms de domaine par forêt ; RID, émulateur PDC et infrastructure par domaine.',
      'Domaine : il regroupe des objets partageant une base d’annuaire et un cadre d’administration. Une forêt contient un ou plusieurs domaines partageant notamment le schéma.',
      'Contrôleur de domaine : ce serveur héberge l’annuaire et traite les demandes d’authentification. Un poste joint au domaine peut utiliser ces identités pour accéder aux ressources.',
    ],
    [
      'Unité d’organisation (OU) : conteneur permettant de classer les objets et de déléguer leur gestion sans donner les droits sur tout le domaine.',
      'Stratégie de groupe (GPO) : ensemble de paramètres appliqués aux utilisateurs ou ordinateurs selon les liens, l’héritage et le filtrage.',
      'Application : les paramètres ordinateur et utilisateur sont traités séparément. gpresult permet d’identifier les stratégies effectivement appliquées.',
    ],
    [
      'Kerberos : après authentification, le client obtient des tickets pour demander l’accès aux services sans retransmettre son mot de passe à chaque service.',
      'Autorisation : les groupes de sécurité servent à attribuer des permissions. Être authentifié ne signifie pas disposer de tous les accès.',
      'Approbation : elle permet de reconnaître les identités d’un autre domaine selon son sens et sa portée ; les permissions restent à attribuer sur les ressources.',
    ],
    [
      'Réplication : les contrôleurs échangent les modifications de l’annuaire pour maintenir une vue cohérente des objets.',
      'Sites AD : les sous-réseaux IP sont associés à des sites pour représenter la topologie et orienter les clients vers des services proches.',
      'Diagnostic : repadmin permet d’examiner la réplication et dcdiag de tester les contrôleurs. Une erreur DNS ou une liaison indisponible peut perturber les échanges.',
    ],
  ],
  reseau: [
    [
      'Résolution : DNS traduit un nom en adresse IP. Les enregistrements A et AAAA correspondent aux adresses IPv4 et IPv6 ; CNAME définit un alias.',
      'Zones : une zone directe contient les noms ; une zone inverse utilise les enregistrements PTR pour retrouver un nom depuis une adresse.',
      'Active Directory : les enregistrements SRV permettent de localiser les services du domaine. Les clients doivent utiliser un DNS capable de résoudre ces enregistrements.',
    ],
    [
      'Bail : DHCP attribue une configuration IP pour une durée déterminée. Le client demande son renouvellement avant expiration.',
      'Étendue : elle définit une plage d’adresses et ses exclusions. Une réservation associe une adresse à un identifiant client, généralement lié à l’adresse MAC.',
      'Options : elles distribuent notamment la passerelle et les serveurs DNS. Un relais DHCP transmet les demandes entre sous-réseaux lorsque le serveur n’est pas local.',
    ],
    [
      'Routage : RRAS peut acheminer les paquets entre plusieurs réseaux IP selon les interfaces et les routes configurées.',
      'VPN : un tunnel transporte les communications à travers un réseau intermédiaire ; l’authentification et le chiffrement dépendent du protocole retenu.',
      'Dépendances : les routes de retour, le DNS et les règles de filtrage doivent permettre les flux nécessaires. Un tunnel établi ne garantit pas l’accès aux applications.',
    ],
    [
      'RADIUS : un équipement réseau transmet une demande d’accès à NPS, qui vérifie les conditions et renvoie une décision.',
      'Stratégies réseau : elles combinent des critères comme le groupe utilisateur, le type de connexion et la méthode d’authentification.',
      'Usages : NPS peut centraliser les décisions d’accès pour un VPN ou un réseau Wi-Fi/802.1X. Les équipements clients RADIUS et leurs secrets doivent être configurés des deux côtés.',
    ],
  ],
  stockage: [
    [
      'SMB : protocole utilisé pour accéder aux fichiers par un chemin réseau UNC, par exemple \\\\FS01\\Commun.',
      'Permissions : pour un accès réseau, les autorisations de partage et NTFS se cumulent de façon restrictive ; les droits effectifs dépendent aussi des groupes et des refus applicables.',
      'Organisation : attribuer les droits à des groupes facilite les changements d’équipe. Les permissions NTFS restent applicables lors d’un accès local au volume.',
    ],
    [
      'DFS Namespaces : il présente des dossiers de plusieurs serveurs sous une arborescence logique et redirige les clients vers les cibles configurées.',
      'DFS Replication : service distinct qui synchronise les changements de fichiers entre membres. Créer un espace de noms ne réplique pas les données.',
      'Limite : une suppression peut se propager aux autres membres. La réplication n’offre donc pas, à elle seule, une conservation indépendante des versions.',
    ],
    [
      'Quotas : ils surveillent ou limitent la taille d’un dossier. Un quota souple alerte ; un quota strict empêche de dépasser la limite.',
      'Filtrage : les filtres de fichiers utilisent des modèles de noms pour détecter ou bloquer des catégories de fichiers ; ils n’analysent pas leur contenu comme un antivirus.',
      'Rapports : ils aident à identifier les fichiers volumineux, anciens ou dupliqués pour comprendre l’occupation du stockage.',
    ],
    [
      'Espaces de stockage : un pool regroupe des disques physiques et fournit des disques virtuels avec un mode de résilience adapté.',
      'iSCSI : il transporte des accès de stockage en mode bloc sur IP ; le serveur initiateur voit un disque fourni par une cible.',
      'Déduplication : elle réduit l’espace occupé par des blocs identiques sur les volumes compatibles. Ni la résilience du pool ni la déduplication ne remplacent une sauvegarde.',
    ],
  ],
  securite: [
    [
      'Moindre privilège : chaque compte reçoit uniquement les droits nécessaires à sa fonction et au périmètre concerné.',
      'Séparation des comptes : l’identité utilisée pour administrer les serveurs est distincte de celle utilisée pour les tâches quotidiennes.',
      'Délégation : des permissions ciblées permettent, par exemple, de réinitialiser les mots de passe d’une OU sans devenir administrateur du domaine.',
    ],
    [
      'Pare-feu : les règles autorisent ou bloquent les connexions selon le protocole, le port, les adresses et le profil réseau.',
      'Antivirus : Microsoft Defender Antivirus analyse les fichiers et surveille les menaces lorsque ses composants et sa configuration sont actifs.',
      'Complémentarité : le filtrage réseau réduit les flux possibles et l’antivirus traite les menaces détectées ; aucun des deux ne corrige les vulnérabilités du système.',
    ],
    [
      'BitLocker : le chiffrement de volume protège les données au repos, notamment si un disque est retiré. Une session autorisée peut toujours lire les fichiers accessibles.',
      'AD CS : les autorités de certification émettent et révoquent des certificats selon des modèles et des permissions définis.',
      'Cycle de vie : certificats et clés de récupération nécessitent un stockage maîtrisé, un suivi des expirations et une procédure de récupération.',
    ],
    [
      'Stratégie d’audit : elle sélectionne les catégories d’actions à journaliser, comme les ouvertures de session ou les changements de comptes.',
      'Accès aux objets : pour tracer certains accès aux fichiers, il faut activer la catégorie d’audit correspondante et configurer l’audit sur les objets concernés.',
      'Exploitation : les événements sont utiles avec une horloge cohérente, une rétention suffisante et une collecte permettant de les examiner après incident.',
    ],
  ],
  virtualisation: [
    [
      'Hyperviseur : Hyper-V isole les machines virtuelles tout en partageant les ressources matérielles de l’hôte.',
      'Ressources : une VM possède des processeurs virtuels, de la mémoire, des cartes réseau et des disques virtuels. Le total alloué ne représente pas une capacité physique illimitée.',
      'VHDX : ce format contient un disque virtuel. Un disque dynamique grandit avec les écritures, mais sa taille maximale ne réserve pas automatiquement cet espace sur l’hôte.',
    ],
    [
      'Externe : le commutateur relie les VM au réseau physique via une carte de l’hôte.',
      'Interne : il permet la communication entre les VM et l’hôte. Privé : il limite les échanges aux VM de ce commutateur.',
      'Adressage : un commutateur virtuel ne fournit pas automatiquement DHCP, DNS ou NAT ; ces services se configurent séparément selon le réseau.',
    ],
    [
      'Migration dynamique : elle déplace l’exécution d’une VM vers un autre hôte compatible en limitant l’interruption du service.',
      'Migration du stockage : elle déplace les fichiers de la VM vers un autre emplacement et constitue une opération distincte de la migration du calcul.',
      'Prérequis : vérifier les hôtes, le réseau et le stockage. Avec Credential Guard, notamment sur les membres de domaine Windows Server 2025 concernés, la délégation CredSSP ne convient pas ; configurer la délégation Kerberos contrainte.',
    ],
    [
      'Hyper-V Replica : il réplique de manière asynchrone les changements vers un hôte secondaire pour préparer un basculement.',
      'Point de contrôle : il crée un état de retour lié aux disques de la VM ; un point de contrôle de production utilise des mécanismes de cohérence applicative lorsqu’ils sont disponibles.',
      'Sauvegarde : une copie indépendante avec rétention permet de restaurer un état antérieur. Réplication et points de contrôle répondent à des besoins différents.',
    ],
  ],
  web: [
    [
      'Site IIS : il associe du contenu ou une application à une ou plusieurs liaisons définies par une adresse, un port et éventuellement un nom d’hôte.',
      'HTTPS : un certificat et une clé privée permettent de protéger les échanges TLS. Le nom du certificat doit correspondre au nom utilisé par les clients.',
      'Publication : la résolution DNS et les règles réseau doivent conduire au serveur. Un site démarré dans IIS n’est pas automatiquement accessible depuis Internet.',
    ],
    [
      'Processus : un pool fournit un contexte d’exécution aux applications IIS et peut héberger son propre processus de travail.',
      'Identité : le compte du pool détermine ses accès aux fichiers et aux ressources ; ses permissions doivent correspondre aux besoins de l’application.',
      'Recyclage : il renouvelle les processus selon des conditions définies. Il peut affecter les sessions conservées uniquement en mémoire.',
    ],
    [
      'ASP.NET classique : les applications .NET Framework utilisent les composants Windows et IIS correspondant à leur version.',
      'ASP.NET Core : l’intégration avec IIS utilise le module ASP.NET Core, généralement installé via le Hosting Bundle adapté.',
      'Configuration : les paramètres, secrets et chaînes de connexion appartiennent à l’environnement de déploiement ; ils ne doivent pas être publiés avec les fichiers accessibles au navigateur.',
    ],
    [
      'Journaux IIS : ils enregistrent notamment les requêtes, codes HTTP et durées pour les champs activés.',
      'Codes et sous-codes : un 403, un 404 ou un 500 ne désigne pas la même famille d’erreurs ; le sous-code IIS affine le diagnostic.',
      'Corrélation : rapprocher journaux IIS, traces de requêtes en échec et logs applicatifs aide à identifier la couche responsable.',
    ],
  ],
  maintenance: [
    [
      'Inventaire : identifier version du système, rôles et applications permet de déterminer les mises à jour concernées.',
      'Déploiement : WSUS peut distribuer les correctifs, mais son développement fonctionnel est arrêté ; il reste pris en charge selon le cycle de vie Windows Server. Azure Update Manager est une autre solution à évaluer selon le périmètre.',
      'Redémarrage : certains correctifs ne prennent pleinement effet qu’après redémarrage. L’état « installé » ne suffit pas toujours à clôturer la maintenance.',
    ],
    [
      'Pilote : un petit ensemble représentatif de serveurs permet de détecter les incompatibilités avant un déploiement large.',
      'Contrôles : vérifier les services métier, les dépendances et les journaux avant et après le changement.',
      'Retour arrière : définir les étapes de restauration et les critères d’arrêt ; toutes les mises à jour ne sont pas désinstallables.',
    ],
    [
      'Périmètre : distinguer les fichiers, les volumes, l’état système et les données applicatives pour choisir le type de sauvegarde.',
      'Rétention : conserver plusieurs points dans le temps permet de revenir avant une erreur qui n’a pas été détectée immédiatement.',
      'Restauration : un test vérifie que les données sont lisibles et que le service peut redémarrer ; le succès d’une tâche de sauvegarde ne prouve pas ce résultat.',
    ],
    [
      'Capacité : contrôler l’espace libre des volumes système, des journaux et des données pour éviter les blocages.',
      'Services : comparer leur état réel à l’état attendu et examiner les dépendances lorsqu’un démarrage échoue.',
      'Historique : suivre les erreurs et les redémarrages dans le temps permet de distinguer un événement isolé d’un problème récurrent.',
    ],
  ],
  disponibilite: [
    [
      'Cluster : plusieurs serveurs, appelés nœuds, coordonnent l’hébergement de rôles compatibles.',
      'Basculement : en cas de panne, le rôle peut redémarrer sur un autre nœud ; cette reprise peut interrompre les sessions ou transactions en cours.',
      'Validation : les réseaux, le stockage et les composants doivent satisfaire les exigences du rôle ; les tests de validation du cluster vérifient la configuration.',
    ],
    [
      'Quorum : il détermine si suffisamment de votes sont disponibles pour que le cluster continue à fonctionner.',
      'Témoin : un disque, un partage de fichiers ou un témoin cloud peut participer au vote selon la configuration.',
      'Partition réseau : le mécanisme vise à empêcher plusieurs parties isolées du cluster de gérer simultanément les mêmes ressources.',
    ],
    [
      'Calcul : plusieurs hôtes réduisent la dépendance à un serveur, à condition que les autres disposent de capacité pour reprendre la charge.',
      'Chemins : cartes, commutateurs, liens et accès au stockage doivent être examinés pour identifier les points de panne uniques.',
      'Dépendances : DNS, annuaire, alimentation et applications externes peuvent rester critiques même si les serveurs principaux sont redondants.',
    ],
    [
      'RPO : durée de données potentiellement perdues, mesurée entre le dernier état récupérable et l’incident.',
      'RTO : durée cible de remise en service après une interruption ; elle inclut les actions techniques et organisationnelles nécessaires.',
      'PRA : le plan décrit qui déclenche la reprise, dans quel ordre restaurer les services et comment revenir au fonctionnement nominal.',
    ],
  ],
  powershell: [
    [
      'Cmdlets : les commandes suivent généralement la forme Verbe-Nom. Get-Help décrit leurs paramètres et Get-Command aide à les découvrir.',
      'Pipeline : les commandes transmettent des objets avec des propriétés, ce qui permet de filtrer et sélectionner les données sans analyser du texte.',
      'Modules : ils regroupent des commandes. Leur disponibilité dépend des rôles installés et de la compatibilité avec Windows PowerShell ou PowerShell 7.',
    ],
    [
      'Session distante : Invoke-Command exécute un bloc de commandes sur une ou plusieurs machines ; une session persistante peut réutiliser le même contexte.',
      'Transport : la configuration Windows utilise couramment WinRM ; les possibilités SSH dépendent de la version et des composants configurés.',
      'Accès : l’authentification, les permissions de session et les règles réseau sont nécessaires. Une connexion distante ne donne pas automatiquement accès à un troisième serveur.',
    ],
    [
      'Déclencheur : une tâche peut démarrer à une heure donnée, au démarrage du système ou en réaction à un événement.',
      'Contexte : le compte d’exécution, ses droits, le dossier de travail et les chemins absolus influencent le résultat du script.',
      'Suivi : enregistrer les sorties et le code de retour permet de repérer les échecs, y compris lorsque personne n’est connecté.',
    ],
    [
      'Entrées : des paramètres typés et validés limitent les valeurs ambiguës et évitent de modifier le code pour chaque serveur.',
      'Erreurs : try/catch traite les erreurs bloquantes ; certaines commandes nécessitent ErrorAction Stop pour déclencher le bloc catch.',
      'Traçabilité : versionner les scripts et journaliser les actions facilite la revue, la comparaison et le retour à une version connue.',
    ],
  ],
  rds: [
    [
      'RD Session Host : il exécute plusieurs sessions utilisateurs sur un même Windows Server.',
      'Collection : elle regroupe des hôtes et les ressources proposées à un ensemble d’utilisateurs.',
      'RemoteApp : elle publie une application plutôt qu’un bureau complet ; le traitement reste exécuté sur le serveur.',
    ],
    [
      'Suivi : le Broker mémorise les sessions afin de diriger les utilisateurs vers leur session existante.',
      'Répartition : pour une nouvelle session, il participe au choix d’un hôte dans la collection.',
      'Disponibilité : si ce composant doit être redondant, sa configuration de haute disponibilité et ses dépendances doivent être prévues séparément.',
    ],
    [
      'RD Gateway : elle transporte les connexions RDP via HTTPS et applique des règles définissant qui peut atteindre quelles ressources.',
      'RD Web Access : il fournit un portail et des flux présentant les bureaux et applications autorisés ; ce rôle n’est pas lui-même la passerelle RDP.',
      'Certificats : les noms utilisés par les clients doivent correspondre aux certificats et à une chaîne de confiance reconnue.',
    ],
    [
      'RD Licensing : il gère les licences d’accès client RDS selon le mode utilisateur ou périphérique configuré.',
      'Dimensionnement : les besoins en licences dépendent du scénario et des droits contractuels ; une connexion techniquement possible ne prouve pas leur conformité.',
      'Profils : les données de session et les paramètres utilisateur nécessitent une stratégie de persistance, de capacité et de sauvegarde adaptée.',
    ],
  ],
  hybride: [
    [
      'Rattachement : un agent enregistre le serveur auprès d’Azure et le représente comme une ressource gérable.',
      'Gestion : des extensions et services compatibles peuvent apporter des fonctions de configuration ou de supervision selon les composants activés.',
      'Périmètre : Azure Arc ne déplace pas la machine dans Azure et ne transforme pas le serveur local en machine virtuelle Azure.',
    ],
    [
      'Synchronisation : Azure File Sync relie un groupe de synchronisation à un partage Azure Files et à des points de terminaison serveur.',
      'Cache local : la hiérarchisation cloud, lorsqu’elle est activée, conserve localement une partie des fichiers et rappelle les données à la demande.',
      'Continuité : disponibilité réseau, espace local et sauvegarde du partage doivent être considérés ; une suppression synchronisée peut affecter les autres points.',
    ],
    [
      'VPN site à site : un tunnel chiffré relie le réseau local à un réseau virtuel Azure en utilisant Internet comme réseau de transport.',
      'ExpressRoute : une connexion privée fournie via un opérateur relie les réseaux ; son caractère privé ne signifie pas que tous les échanges sont chiffrés de bout en bout.',
      'Réseaux : les plages IP, le routage, le DNS et les règles de sécurité doivent permettre les communications sans conflit d’adressage.',
    ],
    [
      'Azure Backup : il conserve des points de restauration selon les politiques et les types de charges pris en charge.',
      'Azure Site Recovery : il orchestre la réplication et le basculement de scénarios compatibles pour la reprise après incident.',
      'Préparation : les tests de restauration ou de basculement servent à vérifier les dépendances réseau, les identités et le fonctionnement applicatif après reprise.',
    ],
  ],
  monitoring: [
    [
      'Journaux : les canaux Système, Application et Sécurité regroupent des événements de sources différentes.',
      'Lecture : l’identifiant, la source, l’heure et le contexte sont nécessaires ; un identifiant seul n’explique pas toujours la panne.',
      'Centralisation : Windows Event Forwarding peut transmettre les événements sélectionnés vers un collecteur pour une analyse commune.',
    ],
    [
      'Compteurs : l’Analyseur de performances mesure des indicateurs comme l’usage CPU, la mémoire disponible et les latences disque.',
      'Référence : une mesure en fonctionnement normal donne un point de comparaison pour repérer les écarts.',
      'Interprétation : une valeur doit être reliée à sa durée, à la charge et au symptôme ; un pic bref ne signifie pas forcément une saturation durable.',
    ],
    [
      'Condition : une alerte peut reposer sur un seuil, un état de service ou la présence d’un événement.',
      'Durée : une temporisation et des critères de retour à la normale réduisent les notifications liées aux fluctuations passagères.',
      'Réponse : chaque alerte utile indique le service concerné, sa priorité et une action de diagnostic ou un responsable.',
    ],
    [
      'Chronologie : comparer les événements et les mesures autour de l’incident permet d’identifier ce qui a changé en premier.',
      'Dépendances : une lenteur applicative peut provenir du DNS, du réseau, du stockage ou d’un service distant.',
      'Validation : formuler une hypothèse, effectuer un contrôle ciblé puis mesurer après correction évite de confondre corrélation et cause.',
    ],
  ],
};

export const windowsBranchExamples = {
  'active-directory': 'Une nouvelle recrue reçoit un compte, rejoint les groupes de son équipe et récupère les paramètres de son poste par GPO.',
  reseau: 'Un poste reçoit son adresse par DHCP, utilise DNS pour trouver le contrôleur de domaine, puis ouvre une session.',
  stockage: 'Un dossier d’équipe est publié en SMB ; les groupes AD déterminent qui peut lire ou modifier les documents.',
  securite: 'Un opérateur gère les comptes d’une OU déléguée sans recevoir les droits d’administration sur les autres serveurs.',
  virtualisation: 'Un hôte exécute une VM de test et une VM applicative, chacune avec son disque et sa configuration réseau.',
  web: 'Un intranet est servi en HTTPS par IIS et son pool accède uniquement aux dossiers nécessaires à l’application.',
  maintenance: 'Une mise à jour est testée sur un serveur pilote avant son installation et la validation des services sur le reste du parc.',
  disponibilite: 'Après la panne d’un hôte, une VM gérée par un cluster redémarre sur un autre nœud disposant de capacité.',
  powershell: 'Une tâche nocturne collecte l’espace libre de plusieurs serveurs et produit un rapport avec les erreurs de collecte.',
  rds: 'Les utilisateurs ouvrent une application de gestion en RemoteApp ; celle-ci s’exécute sur les hôtes de session.',
  hybride: 'Un serveur de fichiers conserve des données en cache local tout en synchronisant les fichiers avec Azure Files.',
  monitoring: 'Une hausse durable de latence disque déclenche une alerte ; les mesures sont comparées aux journaux et aux sauvegardes en cours.',
};
