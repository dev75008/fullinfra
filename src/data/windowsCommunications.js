import { communicationExchanges } from './communicationExchanges';
import { flowReferences } from './auditReferences';
// Carte pédagogique : flux représentatifs, pas inventaire exhaustif d’un déploiement.
export const communicationNodes = [
  { id: 'active-directory', label: 'Active Directory', service: 'Identités · Kerberos · GPO', icon: 'identity', color: '#0067b8', x: 140, y: 100 },
  { id: 'reseau', label: 'Services réseau', service: 'DNS · DHCP · VPN · NPS', icon: 'network', color: '#007f8a', x: 380, y: 100 },
  { id: 'stockage', label: 'Fichiers & stockage', service: 'SMB · DFS · iSCSI', icon: 'storage', color: '#107c10', x: 620, y: 100 },
  { id: 'securite', label: 'Sécurité', service: 'Pare-feu · ACL · Certificats', icon: 'shield', color: '#a4262c', x: 860, y: 100 },
  { id: 'virtualisation', label: 'Virtualisation', service: 'Hyper-V · VM · Réplication', icon: 'layers', color: '#5c2d91', x: 860, y: 320 },
  { id: 'web', label: 'Web & applications', service: 'IIS · HTTPS · Applications', icon: 'web', color: '#005a9e', x: 860, y: 540 },
  { id: 'maintenance', label: 'Mise à jour & maintenance', service: 'Correctifs · Sauvegardes', icon: 'maintenance', color: '#a35c00', x: 860, y: 760 },
  { id: 'disponibilite', label: 'Haute disponibilité', service: 'Cluster · Quorum · Reprise', icon: 'availability', color: '#8a6d00', x: 620, y: 760 },
  { id: 'powershell', label: 'PowerShell & automatisation', service: 'WinRM · Scripts · Sessions', icon: 'terminal', color: '#744da9', x: 380, y: 760 },
  { id: 'rds', label: 'Bureau à distance (RDS)', service: 'Passerelle · Sessions · Profils', icon: 'desktop', color: '#007b83', x: 140, y: 760 },
  { id: 'hybride', label: 'Cloud hybride & Azure', service: 'Arc · File Sync · Backup', icon: 'cloud', color: '#498205', x: 140, y: 540 },
  { id: 'monitoring', label: 'Supervision & monitoring', service: 'Événements · Mesures · Alertes', icon: 'monitoring', color: '#486c85', x: 140, y: 320 },
  { id: 'clients', label: 'Postes, VM & administrateurs', service: 'Initiateurs des demandes', icon: 'clients', color: '#c3edff', x: 500, y: 420 },
];

// Le sens indique l’initiateur du flux, pas le sens exclusif des données échangées.
const baseEdges = [
  { id: 'dhcp', from: 'clients', to: 'reseau', label: 'Obtenir une adresse', protocol: 'DHCPv4 · UDP 67 serveur / 68 client', detail: 'Le poste obtient un bail et ses options IP. Cette étape concerne les clients en adressage dynamique ; un relais est nécessaire si le serveur est sur un autre sous-réseau.', kind: 'network' },
  { id: 'dns', from: 'clients', to: 'reseau', label: 'Trouver les services', protocol: 'DNS · TCP/UDP 53', detail: 'Le client résout les noms et recherche les enregistrements SRV du domaine. Le serveur DNS peut être hébergé sur un contrôleur de domaine ou sur un autre serveur.', kind: 'network' },
  { id: 'kerberos', from: 'clients', to: 'active-directory', label: 'Authentifier une identité', protocol: 'Kerberos · TCP/UDP 88', detail: 'Le client contacte le KDC du domaine pour obtenir ses tickets. Les accès aux services utilisent ensuite un ticket adapté, sous réserve des permissions.', kind: 'network' },
  { id: 'gpo-directory', from: 'clients', to: 'active-directory', label: 'Lire les stratégies', protocol: 'LDAP · TCP 389', detail: 'Le client lit dans AD les liens et informations des GPO applicables. Le contenu fichier des stratégies est récupéré séparément dans SYSVOL.', kind: 'network' },
  { id: 'gpo-sysvol', from: 'clients', to: 'active-directory', label: 'Récupérer SYSVOL', protocol: 'SMB · TCP 445', detail: 'Le client récupère les fichiers de stratégie sur le partage SYSVOL du contrôleur de domaine. SYSVOL appartient ici au rôle AD, même s’il utilise SMB.', kind: 'network' },
  { id: 'share', from: 'clients', to: 'stockage', label: 'Ouvrir un partage', protocol: 'SMB · TCP 445', detail: 'Après résolution du nom et authentification, le client accède aux fichiers. Les droits de partage et NTFS déterminent les opérations permises.', kind: 'network' },
  { id: 'policy', from: 'active-directory', to: 'securite', label: 'Appliquer la politique', protocol: 'Lien logique · GPO / paramètres de sécurité', detail: 'Les GPO peuvent configurer des paramètres de sécurité sur les machines. Cette flèche représente la politique appliquée, pas un protocole supplémentaire entre deux serveurs.', kind: 'logical' },
  { id: 'acl', from: 'securite', to: 'stockage', label: 'Contrôler les droits', protocol: 'Lien logique · ACL / jetons d’accès', detail: 'Le serveur de fichiers vérifie les droits lors de l’accès. Les ACL sont un mécanisme local d’autorisation, sans port propre.', kind: 'logical' },
  { id: 'web-request', from: 'clients', to: 'web', label: 'Consulter une application', protocol: 'HTTPS · TCP 443 par défaut', detail: 'Le navigateur contacte IIS ou le point de publication prévu. TLS protège le transport ; l’application conserve son propre mécanisme d’authentification.', kind: 'network' },
  { id: 'web-files', from: 'web', to: 'stockage', label: 'Lire un contenu distant', protocol: 'SMB · TCP 445, si partage distant', detail: 'L’identité de l’application doit être autorisée sur le partage. Ce flux est optionnel : une application dont les fichiers sont locaux ne l’utilise pas.', kind: 'network' },
  { id: 'web-tls', from: 'securite', to: 'web', label: 'Protéger la publication', protocol: 'Lien logique · certificat / liaison TLS', detail: 'Le certificat et la clé privée sont associés à la liaison HTTPS. Une autorité interne AD CS est une possibilité, pas une obligation pour héberger IIS.', kind: 'logical' },
  { id: 'rds-gateway', from: 'clients', to: 'rds', label: 'Entrer par la passerelle', protocol: 'HTTPS · TCP 443 ; UDP 3391 si activé', detail: 'Le client externe rejoint RD Gateway. La passerelle contacte ensuite les hôtes internes en RDP TCP/UDP 3389 ; ces deux flux se situent dans la même branche RDS.', kind: 'network' },
  { id: 'rds-auth', from: 'rds', to: 'active-directory', label: 'Vérifier l’identité RDS', protocol: 'Kerberos · 88 ; LDAP · 389 selon composant', detail: 'Les composants RDS s’appuient sur les services du domaine selon leur rôle. Les dépendances DNS, RPC ou SMB peuvent aussi intervenir dans un déploiement complet.', kind: 'network' },
  { id: 'rds-radius', from: 'rds', to: 'reseau', label: 'Évaluer les règles d’accès', protocol: 'RADIUS · UDP 1812 / 1813, si NPS distant', detail: 'Dans un scénario avec NPS centralisé, la passerelle transmet la demande d’autorisation au serveur RADIUS. Le port 1813 concerne la comptabilité si elle est activée.', kind: 'network' },
  { id: 'rds-profiles', from: 'rds', to: 'stockage', label: 'Charger les profils', protocol: 'SMB · TCP 445, si profils sur partage', detail: 'L’hôte de session accède au stockage des profils ou conteneurs configurés. Le dimensionnement et les droits du partage conditionnent l’ouverture de session.', kind: 'network' },
  { id: 'admin-hyperv', from: 'powershell', to: 'virtualisation', label: 'Administrer Hyper-V', protocol: 'WinRM · TCP 5985 / 5986, si utilisé', detail: 'Une machine d’administration lance des commandes sur les hôtes. HTTP et HTTPS sont des modes de listener ; l’authentification et la protection du message dépendent de la configuration.', kind: 'network' },
  { id: 'admin-ad', from: 'powershell', to: 'active-directory', label: 'Automatiser les comptes', protocol: 'ADWS · TCP 9389', detail: 'Les cmdlets du module ActiveDirectory utilisant ADWS interrogent ou modifient les objets avec les droits de l’opérateur.', kind: 'network' },
  { id: 'admin-maintenance', from: 'powershell', to: 'maintenance', label: 'Lancer les contrôles', protocol: 'WinRM · TCP 5985 / 5986, si exécution distante', detail: 'Le script peut orchestrer des vérifications sur un serveur distant. Les téléchargements de correctifs et les sauvegardes utilisent ensuite leurs propres transports.', kind: 'network' },
  { id: 'hyperv-storage', from: 'virtualisation', to: 'stockage', label: 'Accéder aux disques de VM', protocol: 'SMB 3 · TCP 445 OU iSCSI · TCP 3260', detail: 'Ces transports correspondent à des architectures de stockage distinctes. Des disques locaux ne nécessitent aucun de ces flux ; les deux ports ne sont pas requis dans tous les cas.', kind: 'network' },
  { id: 'cluster-vm', from: 'disponibilite', to: 'virtualisation', label: 'Orchestrer le basculement', protocol: 'Lien logique · rôle VM du cluster', detail: 'Le cluster peut redémarrer une VM sur un autre nœud en cas de panne. Entre nœuds, le service de cluster utilise notamment UDP 3343 et TCP 3343 selon l’opération, avec des dépendances RPC.', kind: 'logical' },
  { id: 'cluster-witness', from: 'disponibilite', to: 'stockage', label: 'Joindre le témoin de partage', protocol: 'SMB · TCP 445, si ce type de témoin', detail: 'Un témoin de partage participe au quorum. Un témoin disque ou cloud est une autre option et n’utilise pas le même chemin.', kind: 'network' },
  { id: 'cloud-witness', from: 'disponibilite', to: 'hybride', label: 'Joindre le témoin cloud', protocol: 'HTTPS · TCP 443 sortant, si témoin Azure', detail: 'Le cluster accède au stockage Azure du témoin. Il s’agit d’une alternative au témoin de partage dans ce schéma, pas d’une étape qui doit le suivre.', kind: 'network' },
  { id: 'file-sync', from: 'stockage', to: 'hybride', label: 'Synchroniser les fichiers', protocol: 'HTTPS · TCP 443 sortant', detail: 'L’agent Azure File Sync échange les fichiers et métadonnées avec les endpoints cloud. Le trafic SMB des utilisateurs reste un flux distinct.', kind: 'network' },
  { id: 'backup-cloud', from: 'maintenance', to: 'hybride', label: 'Conserver une sauvegarde cloud', protocol: 'HTTPS · TCP 443 vers Azure selon solution', detail: 'Les agents ou composants de sauvegarde communiquent avec leurs services cloud. Les flux locaux et les endpoints requis varient selon la charge et le produit.', kind: 'network' },
  { id: 'patch-target', from: 'virtualisation', to: 'maintenance', label: 'Récupérer les correctifs', protocol: 'HTTP(S) · TCP 8530 / 8531, si WSUS', detail: 'Exemple d’un hôte Hyper-V client d’un serveur WSUS. Sans WSUS, la source de mises à jour et les ports peuvent être différents.', kind: 'network' },
  { id: 'events-ad', from: 'active-directory', to: 'monitoring', label: 'Transmettre les événements AD', protocol: 'WEF / WinRM · TCP 5985 ou 5986', detail: 'Exemple de collecte initiée par la source : le contrôleur de domaine transmet les événements sélectionnés au collecteur. Les abonnements et autorisations doivent être configurés.', kind: 'network' },
  { id: 'events-web', from: 'web', to: 'monitoring', label: 'Transmettre les événements web', protocol: 'WEF / WinRM · TCP 5985 ou 5986', detail: 'Cette flèche concerne les événements Windows sélectionnés. Les fichiers de logs IIS peuvent nécessiter un autre mécanisme de collecte.', kind: 'network' },
  { id: 'events-hyperv', from: 'virtualisation', to: 'monitoring', label: 'Transmettre les événements hôte', protocol: 'WEF / WinRM · TCP 5985 ou 5986', detail: 'Dans ce modèle de collecte, l’hôte Hyper-V envoie ses événements au collecteur. Les métriques de performance dépendent de l’outil de supervision.', kind: 'network' },
  { id: 'monitor-cloud', from: 'monitoring', to: 'hybride', label: 'Envoyer la télémétrie cloud', protocol: 'HTTPS · TCP 443 selon agent', detail: 'Lorsqu’un agent de supervision cloud est utilisé, il communique avec les endpoints de collecte autorisés. Azure Arc et la collecte des métriques sont des fonctions distinctes.', kind: 'network' },
  { id: 'vm-hosting', from: 'virtualisation', to: 'web', label: 'Héberger le serveur applicatif', protocol: 'Lien logique · hébergement dans une VM', detail: 'IIS peut être installé dans une VM Hyper-V. L’hébergement est une relation d’infrastructure ; le trafic HTTPS arrive à la VM via son réseau.', kind: 'logical' },
 ];

export const communicationEdges = baseEdges.map(edge => ({...edge, sourceIds:flowReferences['windows-server'][edge.id], exchanges:communicationExchanges['windows-server'][edge.id]}));

export const communicationScenarios = [
  { id: 'all', label: 'Vue d’ensemble', description: 'Les principales dépendances des douze branches. Sélectionnez une branche pour isoler ses relations.', edges: communicationEdges.map(edge => edge.id), steps: [] },
  { id: 'domain', label: 'Session & fichiers', description: 'Un poste rejoint ses services de domaine, applique ses stratégies et accède à un partage.', edges: ['dhcp', 'dns', 'kerberos', 'gpo-directory', 'gpo-sysvol', 'policy', 'acl', 'share'], steps: [
    ['dhcp', 'Obtenir la configuration IP si le client utilise DHCP.'],
    ['dns', 'Localiser les services AD et le serveur de fichiers avec DNS.'],
    ['kerberos', 'Obtenir les tickets nécessaires auprès du domaine.'],
    ['gpo-directory', 'Lire les liens et informations de stratégie dans AD.'],
    ['gpo-sysvol', 'Récupérer les fichiers GPO dans SYSVOL.'],
    ['share', 'Accéder au partage ; le serveur vérifie les permissions.'],
  ] },
  { id: 'remote', label: 'Accès RDS', description: 'Un utilisateur externe passe par RD Gateway pour retrouver son environnement de travail.', edges: ['dns', 'rds-gateway', 'rds-auth', 'rds-radius', 'rds-profiles'], steps: [
    ['dns', 'Résoudre le nom de publication avec un DNS accessible au client.'],
    ['rds-gateway', 'Contacter la passerelle puis rejoindre l’hôte de session en RDP.'],
    ['rds-radius', 'Si NPS est distant, lui soumettre les règles d’accès.'],
    ['rds-auth', 'Authentifier l’utilisateur et ouvrir la session autorisée.'],
    ['rds-profiles', 'Charger le profil distant si cette option est configurée.'],
  ] },
  { id: 'application', label: 'Application web', description: 'Une application hébergée dans une VM reçoit une requête HTTPS et utilise ses dépendances.', edges: ['dns', 'web-request', 'web-tls', 'web-files', 'vm-hosting', 'events-web'], steps: [
    ['dns', 'Résoudre le nom du site.'],
    ['web-request', 'Établir HTTPS vers IIS avec le certificat configuré.'],
    ['web-files', 'Lire les fichiers distants uniquement si l’application en dépend.'],
    ['events-web', 'Collecter les événements Windows si la souscription WEF est active.'],
  ] },
  { id: 'operations', label: 'Exploitation & reprise', description: 'Administration, stockage, correctifs, sauvegarde et observabilité autour des hôtes.', edges: ['admin-hyperv', 'admin-ad', 'admin-maintenance', 'hyperv-storage', 'cluster-vm', 'cluster-witness', 'cloud-witness', 'backup-cloud', 'patch-target', 'events-hyperv', 'monitor-cloud', 'file-sync'], steps: [
    ['admin-hyperv', 'Administrer les hôtes avec les droits nécessaires.'],
    ['hyperv-storage', 'Accéder au stockage distant si l’architecture le prévoit.'],
    ['cluster-vm', 'Le cluster orchestre la disponibilité des VM compatibles.'],
    ['patch-target', 'L’hôte récupère les correctifs de sa source configurée.'],
    ['backup-cloud', 'La solution de sauvegarde transmet les données protégées vers Azure, si choisie.'],
    ['events-hyperv', 'Collecter les événements pour observer les changements.'],
  ] },
];

export function selectCommunicationEdges(scenarioId, nodeId = null) {
  const scenario = communicationScenarios.find(item => item.id === scenarioId) || communicationScenarios[0];
  return communicationEdges.filter(edge => scenario.edges.includes(edge.id) && (!nodeId || edge.from === nodeId || edge.to === nodeId));
}
