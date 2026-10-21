// Ports de destination usuels, à adapter aux versions et aux scénarios réellement utilisés.
// Chaque entrée suit l’ordre des quatre technologies dans windowsBranches.js.
export const windowsProtocols = {
  'active-directory': [
    [
      ['LDAP / LDAPS', 'TCP 389 / 636', 'Lecture de l’annuaire ; LDAPS utilise TLS. LDAP peut aussi négocier StartTLS sur 389.'],
      ['Catalogue global', 'TCP 3268 / 3269', 'Recherche à l’échelle de la forêt ; 3269 utilise TLS.'],
      ['DNS', 'TCP/UDP 53', 'Découverte des services du domaine, notamment via les enregistrements SRV.'],
    ],
    [
      ['LDAP', 'TCP 389', 'Lecture des liens et paramètres des stratégies dans l’annuaire.'],
      ['SMB', 'TCP 445', 'Lecture des fichiers de stratégie dans SYSVOL par les clients.'],
      ['ADWS', 'TCP 9389', 'Administration AD avec les outils qui utilisent Active Directory Web Services.'],
    ],
    [
      ['Kerberos', 'TCP/UDP 88', 'Obtention des tickets d’authentification.'],
      ['Changement de mot de passe Kerberos', 'TCP/UDP 464', 'Changement ou définition de mot de passe via ce service.'],
      ['NTP', 'UDP 123', 'Synchronisation horaire, importante pour la validation des tickets Kerberos.'],
    ],
    [
      ['RPC / DRSUAPI', 'TCP 135 + ports RPC dynamiques', 'Réplication de l’annuaire entre contrôleurs.'],
      ['DFSR sur RPC', 'TCP 135 + ports RPC dynamiques', 'Réplication de SYSVOL sur les domaines utilisant DFSR ; port fixe possible selon configuration.'],
      ['DNS', 'TCP/UDP 53', 'Résolution des noms des partenaires de réplication.'],
    ],
  ],
  reseau: [
    [
      ['DNS', 'UDP et TCP 53', 'UDP pour de nombreuses requêtes ; TCP notamment pour les réponses nécessitant ce transport et les transferts de zone.'],
      ['Mise à jour DNS sécurisée', 'DNS sur 53 + Kerberos 88', 'Authentifie les mises à jour dans une zone AD configurée pour les accepter.'],
    ],
    [
      ['DHCPv4', 'UDP 67 serveur / 68 client', 'Distribution des baux et options IPv4.'],
      ['DHCPv6', 'UDP 547 serveur / 546 client', 'Distribution des paramètres DHCP pour IPv6.'],
      ['DHCP Failover', 'TCP 647', 'Échanges entre partenaires du basculement DHCPv4, si configuré.'],
    ],
    [
      ['IKE / IPsec NAT-T', 'UDP 500 / 4500', 'Négociation des tunnels IKEv2/IPsec et transport IPsec en présence de NAT.'],
      ['ESP', 'Protocole IP 50 ; sans port', 'Transport IPsec natif ; encapsulé en UDP 4500 avec NAT-T.'],
      ['SSTP', 'TCP 443', 'Tunnel VPN utilisant HTTPS/TLS lorsque ce mode est configuré.'],
    ],
    [
      ['RADIUS', 'UDP 1812 / 1813', 'Authentification/autorisation sur 1812 ; comptabilité sur 1813, si activée.'],
      ['EAP / EAP-TLS', 'Transporté par 802.1X / RADIUS', 'Méthodes d’authentification ; aucun port serveur EAP autonome.'],
    ],
  ],
  stockage: [
    [
      ['SMB 2/3', 'TCP 445', 'Accès aux partages ; signature et chiffrement dépendent de la version et des paramètres.'],
      ['Kerberos', 'TCP/UDP 88 vers le KDC', 'Authentification de domaine lors de l’accès à un partage.'],
    ],
    [
      ['SMB', 'TCP 445', 'Accès aux cibles de dossiers présentées par DFS Namespaces.'],
      ['DFSR / RPC', 'TCP 135 + ports RPC dynamiques', 'Synchronisation entre membres DFSR ; indépendant de l’accès SMB des utilisateurs.'],
    ],
    [
      ['Traitement local FSRM', 'Aucun port propre', 'Quotas, filtrage et analyse des volumes sont des fonctions du serveur.'],
      ['SMTP, si notification', 'Port du relais configuré', 'Envoi des alertes de quota via le relais de messagerie choisi.'],
    ],
    [
      ['iSCSI', 'TCP 3260', 'Accès bloc entre l’initiateur et la cible iSCSI.'],
      ['Espaces de stockage / déduplication', 'Aucun port propre en local', 'Fonctions de stockage ; les flux réseau dépendent ensuite du partage ou de l’architecture déployée.'],
    ],
  ],
  securite: [
    [
      ['Contrôle d’accès local', 'Aucun port propre', 'Les permissions et jetons sont des mécanismes du système, pas un protocole réseau.'],
      ['Kerberos / LDAP', '88 TCP/UDP / 389 TCP', 'Services de domaine mobilisés selon l’authentification et la recherche d’identités.'],
    ],
    [
      ['Pare-feu / antivirus', 'Aucun port unique', 'Fonctions de protection locales ; elles ne disposent pas d’un port commun à ouvrir.'],
      ['HTTPS', 'TCP 443 sortant selon service', 'Connexions aux services de protection cloud lorsque ces fonctions sont activées.'],
    ],
    [
      ['BitLocker', 'Aucun port propre', 'Chiffrement local des volumes.'],
      ['RPC / DCOM pour AD CS', 'TCP 135 + ports RPC dynamiques', 'Demandes de certificats via les interfaces RPC de l’autorité.'],
      ['HTTP / HTTPS', 'TCP 80 / 443 selon publication', 'Distribution des listes de révocation et services web de certificats selon le déploiement.'],
    ],
    [
      ['Journalisation locale', 'Aucun port propre', 'Écriture des événements dans les journaux Windows.'],
      ['WEF sur WS-Management', 'TCP 5985 / 5986', 'Transport configuré du transfert Windows ; le sens dépend du mode initié par la source ou par le collecteur.'],
    ],
  ],
  virtualisation: [
    [
      ['Hyper-V / VMBus', 'Aucun port TCP/UDP pour VMBus', 'L’hyperviseur et le bus hôte-invité sont des mécanismes locaux.'],
      ['WinRM / WS-Management', 'TCP 5985 / 5986', 'Administration distante via PowerShell, si ce mode est configuré.'],
    ],
    [
      ['Ethernet / 802.1Q', 'Couche 2 ; sans port TCP/UDP', 'Commutation et identification des VLAN lorsque le marquage est utilisé.'],
      ['IPv4 / IPv6', 'Couche 3 ; sans port propre', 'Transport réseau des VM ; les ports appartiennent aux services exécutés dans les VM.'],
      ['ARP / NDP', 'ARP : couche 2 ; NDP : ICMPv6', 'Découverte des voisins pour IPv4 ou IPv6 ; pas de port TCP/UDP.'],
    ],
    [
      ['Migration dynamique TCP', 'TCP 6600 par défaut', 'Transfert pour les modes TCP ou compression. Isolez les flux sur des réseaux privés approuvés ; l’authentification ne suffit pas à garantir le chiffrement du transfert.'],
      ['SMB 3', 'TCP 445', 'Transfert lorsque SMB est sélectionné comme option de performance de migration.'],
      ['Kerberos', 'TCP/UDP 88 vers le KDC', 'Délégation Kerberos contrainte ; tenir compte de Credential Guard et des exigences Windows Server 2025.'],
    ],
    [
      ['Hyper-V Replica sur HTTP', 'TCP 80 par défaut', 'Mode d’authentification Kerberos ; ne correspond pas au chiffrement TLS.'],
      ['Hyper-V Replica sur HTTPS', 'TCP 443 par défaut', 'Mode utilisant des certificats et TLS entre hôtes de réplication.'],
      ['Sauvegarde / points de contrôle', 'Selon outil ; aucun port propre au checkpoint', 'Les flux de sauvegarde dépendent du produit et de la destination.'],
    ],
  ],
  web: [
    [
      ['HTTP', 'TCP 80 par défaut', 'Publication d’un site sans TLS ou redirection vers HTTPS.'],
      ['HTTPS / TLS', 'TCP 443 par défaut', 'Publication chiffrée ; les liaisons IIS peuvent utiliser d’autres ports.'],
    ],
    [
      ['Pools IIS', 'Aucun port propre', 'Isolation des processus ; les ports publics sont ceux des liaisons du site.'],
      ['Protocoles applicatifs', 'Selon les dépendances', 'Les accès à une base, une API ou un partage sont ceux de l’application exécutée.'],
    ],
    [
      ['HTTP / HTTPS', 'Ports des liaisons IIS', 'Requêtes des clients vers l’application hébergée.'],
      ['IIS vers ASP.NET Core', 'En processus ou HTTP local', 'Le mode in-process n’utilise pas de proxy réseau ; le mode out-of-process relaie vers Kestrel sur un port local attribué.'],
    ],
    [
      ['Logs IIS / traces', 'Aucun port propre', 'Fichiers et diagnostics locaux.'],
      ['HTTP / HTTPS', 'Port du site testé', 'Analyse des codes de réponse et reproduction d’une requête en erreur.'],
    ],
  ],
  maintenance: [
    [
      ['HTTP / HTTPS', 'TCP 80 / 443 selon endpoint', 'Téléchargement et échanges avec les services de mise à jour utilisés.'],
      ['WSUS, si présent', 'TCP 8530 / 8531 par défaut', 'Client vers WSUS : 8530 HTTP / 8531 HTTPS selon configuration. WSUS vers Microsoft Update : 80/443 ; WSUS ne reçoit plus de nouvelles fonctions.'],
    ],
    [
      ['Validation locale', 'Aucun port universel', 'Les tests dépendent des services et applications concernés par le changement.'],
      ['WinRM', 'TCP 5985 / 5986 si utilisé', 'Exécution distante des contrôles ; ajouter les flux métier effectivement testés.'],
    ],
    [
      ['VSS', 'Aucun port propre', 'API locale de cohérence des volumes et applications, pas un protocole de transfert.'],
      ['SMB / HTTPS', 'TCP 445 / 443 selon solution', 'Exemples de transports vers un dépôt réseau ou cloud ; les produits peuvent utiliser d’autres flux.'],
    ],
    [
      ['Contrôles locaux', 'Aucun port propre', 'Consultation des volumes, services et événements sur le serveur.'],
      ['WinRM ou RPC', '5985/5986 ou 135 + RPC dynamiques, TCP', 'Administration distante selon l’outil ; ces transports sont des alternatives selon le contrôle.'],
    ],
  ],
  disponibilite: [
    [
      ['Service de cluster', 'UDP 3343 ; TCP 3343 selon opération', 'Communication des nœuds ; TCP intervient notamment lors de l’ajout d’un nœud.'],
      ['RPC', 'TCP 135 + ports RPC dynamiques', 'Administration et opérations de cluster selon le scénario.'],
      ['SMB', 'TCP 445 selon rôle', 'Accès aux partages et flux SMB utilisés par l’architecture.'],
    ],
    [
      ['Témoin de partage', 'SMB / TCP 445', 'Accès au partage servant de témoin.'],
      ['Témoin cloud', 'HTTPS / TCP 443 sortant', 'Accès au stockage Azure utilisé par le témoin cloud.'],
      ['Témoin disque', 'Selon accès au stockage', 'Pas de port réseau propre au quorum ; le disque utilise le transport de stockage retenu.'],
    ],
    [
      ['MPIO', 'Aucun port propre', 'Mécanisme de gestion de chemins multiples, pas un protocole de transport.'],
      ['iSCSI / SMB', 'TCP 3260 / 445 selon architecture', 'Exemples de transports de stockage ; les liens Fibre Channel n’utilisent pas des ports TCP.'],
    ],
    [
      ['RPO / RTO / PRA', 'Aucun port propre', 'Objectifs et procédures de reprise ; ce ne sont pas des protocoles.'],
      ['Réplication / sauvegarde', 'Selon solution choisie', 'Les flux dépendent des outils, des sites et des destinations de reprise.'],
    ],
  ],
  powershell: [
    [
      ['PowerShell local', 'Aucun port propre', 'Langage et moteur d’exécution locaux.'],
      ['Protocoles des modules', 'Selon commande', 'Un module peut interroger ADWS, une API HTTPS ou un autre service ; le pipeline n’est pas un protocole réseau.'],
    ],
    [
      ['PSRP sur WS-Management / WinRM', 'TCP 5985 / 5986', 'PowerShell Remoting sur HTTP/HTTPS selon le listener configuré.'],
      ['PSRP sur SSH', 'TCP 22 par défaut', 'Alternative disponible avec PowerShell et une configuration SSH compatibles.'],
    ],
    [
      ['Planificateur local', 'Aucun port propre', 'Le déclenchement d’une tâche locale ne nécessite aucun service réseau supplémentaire.'],
      ['RPC pour gestion distante', 'TCP 135 + ports RPC dynamiques', 'Administration distante du Planificateur via les interfaces RPC ; le script conserve ses propres dépendances.'],
    ],
    [
      ['Validation / gestion des erreurs', 'Aucun port propre', 'Fonctions du langage exécutées localement.'],
      ['Git distant, si utilisé', 'HTTPS TCP 443 ou SSH TCP 22', 'Synchronisation du dépôt ; le contrôle de version local ne nécessite pas de connexion réseau.'],
    ],
  ],
  rds: [
    [
      ['RDP', 'TCP/UDP 3389 par défaut', 'Sessions bureau et RemoteApp entre client ou passerelle et hôte ; ports configurables.'],
      ['TLS / CredSSP', 'Sur le transport RDP', 'Protection et authentification NLA selon configuration ; pas de port CredSSP autonome.'],
    ],
    [
      ['RDP', 'TCP 3389', 'Échanges avec les hôtes de session dans les scénarios RDS concernés.'],
      ['SMB / RPC', 'TCP 445 ; 135 + RPC dynamiques', 'Gestion et échanges avec les rôles RDS selon la topologie.'],
      ['SQL pour Broker HA', 'Port de l’instance SQL', 'Base partagée de haute disponibilité ; ne pas supposer un port identique pour toutes les instances.'],
    ],
    [
      ['RD Gateway externe', 'HTTPS TCP 443 ; UDP 3391 si activé', 'Transport des connexions client vers la passerelle.'],
      ['Passerelle vers hôte', 'RDP TCP/UDP 3389', 'Flux internes entre la passerelle et la ressource de bureau distant.'],
      ['RD Web Access', 'HTTPS TCP 443', 'Portail et publication de la liste des ressources.'],
    ],
    [
      ['Licences RDS via RPC', 'TCP 135 + ports RPC dynamiques', 'Communication avec le serveur de licences ; dépendances complémentaires selon scénario.'],
      ['Profils sur partage SMB', 'TCP 445 si utilisé', 'Stockage des profils ou conteneurs sur un partage réseau configuré.'],
    ],
  ],
  hybride: [
    [
      ['HTTPS / TLS', 'TCP 443 sortant', 'Communication de l’agent Connected Machine vers les endpoints Azure autorisés.'],
      ['Extensions et fonctions optionnelles', 'Selon service activé', 'Les fonctions ajoutées et certains endpoints de certificats peuvent nécessiter des flux supplémentaires.'],
    ],
    [
      ['Azure File Sync sur HTTPS', 'TCP 443 sortant', 'Synchronisation des fichiers et métadonnées entre l’agent et les services cloud.'],
      ['SMB pour les clients', 'TCP 445', 'Accès des utilisateurs au partage Windows ou à Azure Files ; ce flux est distinct de la synchronisation de l’agent.'],
    ],
    [
      ['IKE / IPsec', 'UDP 500 / 4500 ; ESP IP 50', 'Établissement et transport du VPN site à site selon NAT-T.'],
      ['BGP, si configuré', 'TCP 179', 'Échange des routes entre pairs ; utilisé par ExpressRoute et possible avec VPN Gateway.'],
      ['ExpressRoute', 'Circuit privé ; pas un port applicatif', 'Les applications conservent leurs protocoles ; les échanges ne sont pas tous automatiquement chiffrés.'],
    ],
    [
      ['Azure Backup / Site Recovery', 'HTTPS TCP 443 vers Azure selon scénario', 'Flux cloud courants ; les flux internes dépendent de l’agent, de l’appliance et de la charge protégée.'],
      ['Réseau de reprise', 'Ports des applications restaurées', 'Le basculement nécessite aussi DNS, identité et flux métier ; 443 seul ne décrit pas un plan de reprise complet.'],
    ],
  ],
  monitoring: [
    [
      ['Windows Event Forwarding', 'WS-Management TCP 5985 / 5986', 'Collecte distante en HTTP/HTTPS selon la configuration.'],
      ['Event Log distant via RPC', 'TCP 135 + ports RPC dynamiques', 'Consultation distante des journaux avec les outils utilisant RPC.'],
    ],
    [
      ['Compteurs locaux', 'Aucun port propre', 'Lecture des mesures de performance sur la machine.'],
      ['Collecte distante', 'RPC ou WinRM selon outil', 'RPC : TCP 135 + ports dynamiques ; WinRM : TCP 5985/5986. Tous les outils n’utilisent pas les deux.'],
    ],
    [
      ['HTTPS / webhooks', 'TCP 443 selon service', 'Transmission d’une alerte vers une API ou un outil d’incident.'],
      ['SMTP', 'Port du relais configuré', 'Envoi de courriels ; souvent TCP 25 pour un relais ou 587 avec soumission, selon le service.'],
      ['SNMP, si agent installé', 'UDP 161 / 162', 'Interrogation sur 161 et traps sur 162 ; SNMP n’est pas activé par défaut sur tous les serveurs.'],
    ],
    [
      ['Analyse locale', 'Aucun port propre', 'La corrélation des données n’est pas un protocole réseau.'],
      ['NTP', 'UDP 123', 'Cohérence des horodatages pour comparer les événements de plusieurs machines.'],
      ['API de supervision', 'HTTPS TCP 443 selon outil', 'Consultation des données d’un service distant lorsque l’analyse utilise une API.'],
    ],
  ],
};

export const protocolSources = [
  ['Services et ports Windows', 'https://learn.microsoft.com/fr-fr/troubleshoot/windows-server/networking/service-overview-and-network-port-requirements'],
  ['Ports RDS', 'https://learn.microsoft.com/fr-fr/troubleshoot/windows-server/remote/ports-used-by-rds'],
  ['WinRM', 'https://learn.microsoft.com/fr-fr/windows/win32/winrm/installation-and-configuration-for-windows-remote-management'],
  ['Hyper-V Replica', 'https://learn.microsoft.com/fr-fr/windows-server/virtualization/hyper-v/configure-replication-single-host'],
  ['Azure File Sync', 'https://learn.microsoft.com/fr-fr/azure/storage/file-sync/file-sync-firewall-and-proxy'],
  ['Azure Arc', 'https://learn.microsoft.com/fr-fr/azure/azure-arc/servers/network-requirements'],
];
