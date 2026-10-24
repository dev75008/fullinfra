import { windowsTechnologyDetails, windowsBranchExamples } from './windowsTechnologyDetails';
import { windowsProtocols } from './windowsProtocols';
import { technologyReferences } from './auditReferences';

// Titres et résumés ; les explications par points sont séparées pour faciliter l’édition.
const branchOverview = [
  {
    id: 'active-directory', title: 'Active Directory', icon: 'identity',
    summary: 'Centraliser les identités et organiser les accès.',
    details: [
      ['AD DS et rôles FSMO', 'Domaines, forêts et contrôleurs de domaine ; cinq rôles FSMO pour les opérations à maître unique.'],
      ['Organisation et GPO', 'Unités d’organisation, délégation et stratégies de groupe pour appliquer les configurations.'],
      ['Authentification', 'Kerberos, groupes de sécurité et relations d’approbation pour contrôler les accès.'],
      ['Réplication', 'Sites et sous-réseaux pour structurer les échanges entre contrôleurs de domaine.'],
    ],
  },
  {
    id: 'reseau', title: 'Services réseau', icon: 'network',
    summary: 'Connecter les équipements et rendre les services accessibles.',
    details: [
      ['DNS', 'Zones, enregistrements et redirecteurs pour résoudre les noms des machines et services.'],
      ['DHCP', 'Étendues, réservations et options pour distribuer les paramètres IP aux clients.'],
      ['Accès distant', 'Routage et VPN avec RRAS selon les besoins de connexion.'],
      ['NPS', 'Authentification RADIUS et stratégies réseau pour encadrer les accès.'],
    ],
  },
  {
    id: 'stockage', title: 'Gestion des fichiers et stockage', icon: 'storage',
    summary: 'Partager les données et maîtriser leur capacité de stockage.',
    details: [
      ['Partages SMB', 'Publier les dossiers et combiner permissions de partage et droits NTFS.'],
      ['DFS', 'Espaces de noms pour un accès unifié et réplication de dossiers lorsque le scénario s’y prête.'],
      ['FSRM', 'Quotas, filtrage de fichiers et rapports pour suivre l’utilisation des volumes.'],
      ['Stockage', 'Espaces de stockage, iSCSI et déduplication selon l’édition et les charges prises en charge.'],
    ],
  },
  {
    id: 'securite', title: 'Sécurité', icon: 'shield',
    summary: 'Protéger le système, les identités et les données.',
    details: [
      ['Privilèges', 'Délégation, comptes d’administration séparés et droits adaptés à chaque rôle.'],
      ['Protection système', 'Pare-feu Windows et Microsoft Defender Antivirus pour contrôler les flux et les menaces.'],
      ['Chiffrement et certificats', 'BitLocker pour les volumes et AD CS pour les infrastructures de certificats.'],
      ['Audit', 'Journaux de sécurité et stratégies d’audit pour tracer les actions sensibles.'],
    ],
  },
  {
    id: 'virtualisation', title: 'Virtualisation', icon: 'layers',
    summary: 'Exécuter et isoler plusieurs systèmes sur un même hôte.',
    details: [
      ['Hyper-V', 'Créer des machines virtuelles et attribuer processeurs, mémoire et disques VHDX.'],
      ['Réseaux virtuels', 'Commutateurs externes, internes et privés pour connecter les VM.'],
      ['Mobilité', 'Migration dynamique et déplacement du stockage selon la configuration des hôtes.'],
      ['Protection des VM', 'Hyper-V Replica et sauvegardes adaptées ; les points de contrôle ne remplacent pas une sauvegarde.'],
    ],
  },
  {
    id: 'web', title: 'Web et applications', icon: 'web',
    summary: 'Héberger les sites et les services applicatifs.',
    details: [
      ['IIS', 'Sites, liaisons HTTP/HTTPS et certificats pour publier les applications web.'],
      ['Pools d’applications', 'Identités, isolation des processus et recyclage pour encadrer leur exécution.'],
      ['Environnements applicatifs', 'Hébergement ASP.NET ou ASP.NET Core avec les composants adaptés.'],
      ['Diagnostic', 'Journaux IIS, erreurs HTTP et traces pour analyser les incidents applicatifs.'],
    ],
  },
  {
    id: 'maintenance', title: 'Mise à jour et maintenance', icon: 'maintenance',
    summary: 'Maintenir les serveurs et préparer les changements.',
    details: [
      ['Correctifs', 'Organiser des vagues de déploiement et des fenêtres de maintenance.'],
      ['Validation', 'Tester les changements sur un périmètre pilote et prévoir le retour arrière.'],
      ['Sauvegardes', 'Définir une rétention et vérifier les restaurations du système et des données.'],
      ['État du système', 'Contrôler espace disque, services, événements et redémarrages nécessaires.'],
    ],
  },
  {
    id: 'disponibilite', title: 'Haute disponibilité', icon: 'availability',
    summary: 'Limiter les interruptions et préparer la reprise.',
    details: [
      ['Clustering de basculement', 'Associer plusieurs nœuds pour héberger des rôles et services compatibles.'],
      ['Quorum et témoin', 'Définir les votes et le témoin pour encadrer les décisions du cluster.'],
      ['Redondance', 'Identifier les dépendances réseau, stockage et alimentation pour réduire les points de panne uniques.'],
      ['Reprise d’activité', 'Définir les objectifs RPO/RTO et tester les scénarios ; la haute disponibilité ne remplace pas un PRA.'],
    ],
  },
  {
    id: 'powershell', title: 'PowerShell & Automatisation', icon: 'terminal',
    summary: 'Rendre les tâches répétitives fiables et reproductibles.',
    details: [
      ['Scripts et modules', 'Utiliser les cmdlets et les objets pour administrer les rôles Windows Server.'],
      ['Administration distante', 'Exécuter des commandes à distance avec PowerShell Remoting et des droits adaptés.'],
      ['Planification', 'Lancer les tâches périodiques avec le Planificateur de tâches et un compte approprié.'],
      ['Fiabilité', 'Paramètres, gestion des erreurs, journaux et contrôle de version pour maintenir les scripts.'],
    ],
  },
  {
    id: 'rds', title: 'Services Bureau à distance (RDS)', icon: 'desktop',
    summary: 'Fournir des bureaux et des applications à distance.',
    details: [
      ['Hôtes de session', 'Héberger les sessions utilisateurs et organiser les collections de bureaux.'],
      ['Connection Broker', 'Gérer la répartition et la reconnexion aux sessions existantes.'],
      ['Passerelle et accès web', 'RD Gateway et RD Web Access pour encadrer les connexions et publier les ressources.'],
      ['Licences et profils', 'Prévoir les CAL RDS nécessaires et la gestion des profils utilisateurs.'],
    ],
  },
  {
    id: 'hybride', title: 'Cloud hybride & Azure', icon: 'cloud',
    summary: 'Relier les serveurs locaux aux services du cloud.',
    details: [
      ['Azure Arc', 'Rattacher des serveurs externes à Azure pour étendre leur gestion.'],
      ['Azure File Sync', 'Synchroniser les dossiers des serveurs de fichiers avec un partage Azure Files.'],
      ['Connectivité hybride', 'Relier les réseaux avec un VPN site à site ou une connexion ExpressRoute.'],
      ['Protection et reprise', 'Évaluer Azure Backup et Azure Site Recovery selon les charges compatibles.'],
    ],
  },
  {
    id: 'monitoring', title: 'Supervision & Monitoring', icon: 'monitoring',
    summary: 'Observer les performances et détecter les incidents.',
    details: [
      ['Événements', 'Exploiter l’Observateur d’événements et centraliser les journaux utiles.'],
      ['Performances', 'Suivre processeur, mémoire, disques et réseau avec les compteurs de performances.'],
      ['Alertes', 'Définir des seuils pertinents et des notifications avec un outil de supervision.'],
      ['Analyse', 'Corréler les mesures et les événements pour distinguer symptômes et causes.'],
    ],
  },
];

export const windowsBranches = branchOverview.map(branch => ({
  ...branch,
  example: windowsBranchExamples[branch.id],
  details: branch.details.map(([title, description], index) => ({
    title,
    description,
    points: windowsTechnologyDetails[branch.id][index],
    protocols: windowsProtocols[branch.id][index],
    sourceIds: technologyReferences['windows-server'][branch.id][index],
  })),
}));
