// Détail des extrémités réelles quand une relation de la carte résume plusieurs sauts.
export const communicationExchanges = {
  'windows-server': {
    'rds-gateway': [
      ['Client externe','RD Gateway','HTTPS TCP 443 ; UDP 3391 si activé'],
      ['RD Gateway','Hôte de session','RDP TCP/UDP 3389 par défaut'],
    ],
    'hyperv-storage': [
      ['Hôte Hyper-V','Serveur SMB compatible','SMB 3 TCP 445, si stockage fichier'],
      ['Initiateur de l’hôte','Cible iSCSI','TCP 3260, si stockage bloc ; alternative à SMB'],
    ],
  },
  virtualisation: {
    'live-migration': [
      ['Hôte Hyper-V source','Hôte Hyper-V cible','TCP 6600 pour TCP/compression, ou SMB TCP 445 selon mode'],
      ['Hôte / opérateur autorisé','Services du domaine','Kerberos et délégation contrainte selon configuration'],
    ],
    vmotion: [
      ['Connecteur HCX local','HCX Cloud Manager AVS','Gestion HTTPS TCP 443'],
      ['Appliances HCX','Homologues du maillage','Flux du scénario HCX documenté, distincts de la gestion'],
    ],
  },
  azure: {
    'bastion-entry': [
      ['Navigateur du client','Azure Bastion','HTTPS TCP 443 dans le scénario portail'],
      ['Azure Bastion','VM cible','RDP TCP 3389 ou SSH TCP 22 par défaut'],
      ['Composants Bastion','Composants du service','8080/5701 internes et flux de contrôle/sondes selon la matrice NSG'],
    ],
    sql: [
      ['Application cliente','Passerelle SQL','TCP 1433 initial ; unique flux de données en mode Proxy'],
      ['Application en Redirect public','Nœuds SQL de la région','TCP 11000–11999 en complément de 1433'],
      ['Application en Redirect privé','Endpoint privé / chemin SQL','TCP 1433–65535 selon le scénario Private Link ; alternative au chemin public'],
    ],
  },
};
