export const broadcomSources = {
  'broadcom-education': { title:'Broadcom : formations VMware Cloud Foundation', url:'https://www.broadcom.com/support/education/vmware' },
  'vmware-snapshots': { title:'Broadcom KB 318825 : bonnes pratiques des snapshots vSphere', url:'https://knowledge.broadcom.com/external/article/318825/best-practices-for-using-vmware-snapshot.html' },
  'vmware-ports': { title:'Broadcom KB 318895 : ports ESXi 7.0 et 8.0', url:'https://knowledge.broadcom.com/external/article?legacyId=2039095' },
  'vmware-connectivity': { title:'Broadcom KB 432374 : filtrage ESXi et accès vCenter', url:'https://knowledge.broadcom.com/external/article/432374/esxi-host-disconnects-from-vcenter-serve.html' },
};

// Exemples de flux de la KB 318895, limités à ESXi 7.0 / 8.0.
// Ce sous-ensemble n'est pas une matrice de pare-feu complète.
export const vmwareFlows = [
  ['Administration HTTPS','Client vSphere','Hôte ESXi','TCP 443','Connexion client à l’hôte.'],
  ['Gestion des hôtes','vCenter Server','Hôte ESXi','TCP 902','Échanges de gestion vCenter / ESXi.'],
  ['Gestion des hôtes','Hôte ESXi','vCenter Server','UDP 902','Échanges de gestion dans le sens ESXi vers vCenter.'],
  ['Résolution DNS','Hôte ESXi','Serveur DNS','UDP / TCP 53','Résolution des noms utilisés par l’hôte.'],
  ['vMotion','Hôte ESXi source','Hôte ESXi destination','TCP 8000','Trafic vMotion entre hôtes ; vérifier les interfaces et la configuration du déploiement.'],
  ['vSphere HA','Hôte ESXi','Autre hôte ESXi','TCP / UDP 8182','Communications HA bidirectionnelles.'],
];
