// Contenus et références séparés du rendu. Voir docs/microsoft365-sources-audit.json.
const topic = (id,title,icon,description,points,sourceIds) => ({id,title,icon,description,points,sourceIds});
export const microsoft365Topics = [
  topic('administration','Administration et licences','settings','Organiser le tenant et les accès aux services.',[
    'Le centre d’administration regroupe la gestion des utilisateurs, des domaines, des licences et de la facturation.',
    'Attribuez les rôles nécessaires aux personnes chargées de l’administration.',
    'Vérifiez les abonnements et licences avant de prévoir le déploiement d’une fonctionnalité.',
  ],['m365-admin']),
  topic('identites','Identités et accès','entra','Gérer les utilisateurs et leurs droits avec Microsoft Entra ID.',[
    'Distinguez les comptes, les groupes et les rôles d’administration.',
    'Préparez l’authentification multifacteur et les accès administrateur dans le parcours de configuration.',
    'Les services Microsoft 365 et les applications utilisent les identités et les autorisations adaptées à chaque ressource.',
  ],['m365-admin','entra']),
  topic('exchange','Exchange Online','mail-local','Administrer la messagerie et préparer sa connectivité.',[
    'Exchange Online fournit le service de messagerie cloud de l’organisation.',
    'Séparez l’accès client HTTPS du transport SMTP des messages.',
    'Les ports facultatifs POP, IMAP ou de soumission SMTP ne doivent pas être activés uniquement parce qu’ils figurent dans la liste des endpoints.',
  ],['m365-exchange','m365-network']),
  topic('teams','Microsoft Teams','users','Déployer la collaboration, les réunions et les appels.',[
    'Commencez par un pilote pour tester les usages et préparer le déploiement.',
    'Planifiez les conversations, équipes et canaux, puis les réunions et la téléphonie selon les besoins.',
    'Vérifiez les flux médias UDP séparément des accès web et des services de signalisation.',
  ],['m365-teams','m365-network']),
  topic('sharepoint','SharePoint Online','web','Structurer les espaces documentaires et leur gouvernance.',[
    'Planifiez les sites, le contenu et les responsabilités avant la migration.',
    'Définissez les règles de partage et de gestion des données sensibles.',
    'Évaluez les besoins de rétention, de classification et de prévention des pertes de données.',
  ],['m365-sharepoint']),
  topic('onedrive','OneDrive Entreprise','files-local','Accompagner le stockage et la synchronisation des fichiers.',[
    'Prévoyez le déploiement de l’application de synchronisation et l’accompagnement des utilisateurs.',
    'Définissez les paramètres de partage, de stockage et de synchronisation de votre organisation.',
    'La planification SharePoint et OneDrive couvre aussi la migration et le cycle de vie des contenus.',
  ],['m365-sharepoint']),
  topic('applications','Microsoft 365 Apps','apps-local','Déployer et maintenir les applications Office installées.',[
    'Microsoft 365 Apps s’installe sur les postes et se distingue des applications Office pour le web.',
    'Choisissez le mode de déploiement et les paramètres adaptés au parc.',
    'Planifiez les mises à jour et vérifiez les droits de licence ; tous les produits Office ne sont pas inclus dans chaque offre.',
  ],['m365-apps']),
  topic('intune','Microsoft Intune','desktop','Gérer les appareils et protéger les applications professionnelles.',[
    'L’inscription et les stratégies permettent de configurer et sécuriser les appareils gérés.',
    'La gestion des applications protège les données professionnelles avec un périmètre différent de la gestion complète d’un appareil.',
    'Les signaux de conformité des appareils peuvent participer aux décisions d’accès conditionnel Microsoft Entra.',
  ],['m365-intune']),
  topic('defender','Microsoft Defender XDR','shield','Corréler les détections et organiser la réponse aux incidents.',[
    'Defender XDR corrèle les signaux de sécurité des produits intégrés.',
    'Les identités, appareils, e-mails et applications peuvent contribuer à l’investigation.',
    'Les produits effectivement connectés et leurs licences déterminent les capacités disponibles.',
  ],['m365-defender']),
  topic('purview','Microsoft Purview','policy-local','Protéger les données et gérer les exigences de conformité.',[
    'Purview réunit des fonctions de gouvernance, de protection et de conformité des données.',
    'Évaluez les étiquettes de confidentialité, la prévention des pertes de données et les règles de rétention selon vos besoins.',
    'Vérifiez les prérequis et le périmètre de chaque solution avant de l’appliquer aux contenus de l’organisation.',
  ],['m365-purview','m365-sharepoint']),
  topic('graph','Microsoft Graph et automatisation','code','Accéder aux données Microsoft 365 par les API.',[
    'Microsoft Graph fournit un point d’entrée API pour de nombreux services Microsoft 365 et Microsoft Entra.',
    'Les API REST et les SDK permettent de construire des intégrations adaptées aux ressources exposées.',
    'Les autorisations de l’application doivent correspondre aux opérations et aux données nécessaires.',
  ],['m365-graph']),
  topic('supervision','Supervision et état des services','activity','Distinguer incident Microsoft et problème propre au tenant.',[
    'Consultez Santé du service dans le centre d’administration Microsoft 365.',
    'Les incidents et avis permettent de suivre les problèmes et leurs mises à jour.',
    'Configurez les notifications et signalez un problème lorsque le service concerné ne présente pas encore d’incident correspondant.',
  ],['m365-health']),
];

export const microsoft365Flows = [
  {id:'web',label:'Accéder aux services',from:'Navigateur ou application',to:'Endpoints Microsoft 365',protocol:'HTTPS · TCP 443',detail:'Exemple d’accès web sécurisé. La liste Worldwide contient aussi des dépendances HTTP et UDP selon le service ; HTTPS 443 seul ne constitue pas une matrice complète.',sourceIds:['m365-network']},
  {id:'mail',label:'Acheminer les e-mails',from:'Serveur de messagerie',to:'Endpoint de protection Exchange Online',protocol:'SMTP · TCP 25',detail:'Transport de messages vers les endpoints de messagerie publiés. Ce flux est distinct de la consultation d’une boîte dans Outlook et de la soumission SMTP par un client.',sourceIds:['m365-network']},
  {id:'media',label:'Participer à une réunion',from:'Client Teams',to:'Endpoints médias Teams',protocol:'UDP · 3478–3481',detail:'Exemple de flux médias Teams vers les plages publiées. La signalisation et les autres dépendances nécessitent leurs propres endpoints ; les appels ne se résument pas à cette plage.',sourceIds:['m365-network','m365-teams']},
  {id:'files',label:'Ouvrir un document',from:'Navigateur ou client de synchronisation',to:'SharePoint / OneDrive',protocol:'HTTPS · TCP 443',detail:'Accès aux contenus via les endpoints autorisés. Les permissions et les politiques de partage déterminent l’accès aux données ; les endpoints annexes restent à vérifier.',sourceIds:['m365-network','m365-sharepoint']},
  {id:'api',label:'Appeler une API',from:'Application autorisée',to:'Microsoft Graph',protocol:'HTTPS · TCP 443',detail:'Les requêtes REST ciblent graph.microsoft.com. Un accès réseau ne donne pas automatiquement les autorisations de lecture ou d’écriture sur les données.',sourceIds:['m365-graph']},
  {id:'compliance',label:'Évaluer l’accès d’un appareil',from:'Conformité Intune',to:'Accès conditionnel Microsoft Entra',protocol:'Dépendance logique · aucun port unique',detail:'Les signaux de posture de l’appareil contribuent aux décisions d’accès. Ce lien représente une relation fonctionnelle entre services, pas une règle de pare-feu à appliquer au poste.',sourceIds:['m365-intune']},
];
