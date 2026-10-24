export const networkTopics = [
  {id:'ipv4',title:'Lire une adresse IPv4',icon:'network',sourceIds:['ip-subnets'],points:[
    'Une adresse IPv4 comporte 32 bits, présentés en quatre octets de 0 à 255, par exemple 192.168.10.70.',
    'Elle identifie une interface dans un réseau. Le préfixe est indispensable pour distinguer la partie réseau de la partie hôte.',
    'Deux interfaces du même sous-réseau ne doivent pas utiliser la même adresse. Une machine peut posséder plusieurs interfaces et adresses.',
  ]},
  {id:'cidr',title:'Masque et notation CIDR',icon:'network',sourceIds:['ip-subnets'],points:[
    'Le masque indique les bits du réseau : /24 signifie 24 bits réseau et 8 bits restants pour les adresses du bloc.',
    '/24 correspond à 255.255.255.0 ; /26 à 255.255.255.192. Plus le préfixe est long, plus le bloc est petit.',
    'Le préfixe réel fait référence : ne déduisez pas le masque à partir de l’ancienne notion de classe A, B ou C.',
  ]},
  {id:'bornes',title:'Réseau, hôtes et diffusion',icon:'route',sourceIds:['ip-subnets'],points:[
    'Dans 192.168.10.64/26, l’adresse réseau est 192.168.10.64 et la diffusion IPv4 est 192.168.10.127.',
    'Dans ce sous-réseau IPv4 classique, les hôtes utilisent 192.168.10.65 à 192.168.10.126 : 62 adresses avant les réservations internes.',
    'Un dernier octet égal à 0 ou 255 n’est pas à lui seul une règle de validité : les bornes dépendent du préfixe.',
  ]},
  {id:'capacite',title:'Dimensionner un sous-réseau',icon:'capacity',sourceIds:['ip-subnets','ip-planning'],points:[
    'Un bloc IPv4 /p contient 2^(32 − p) adresses. Pour les exemples classiques /24 à /30, retirez l’adresse réseau et la diffusion.',
    'Un /26 contient 64 adresses, soit 62 adresses hôtes classiques. Si une passerelle en utilise une, il en reste 61 pour les autres équipements.',
    'Gardez une marge de croissance. Les usages /31 et /32 sont particuliers ; Azure réserve cinq adresses par sous-réseau IPv4, pas seulement deux.',
  ]},
  {id:'decoupage',title:'Découper un réseau en sous-réseaux',icon:'vlan',sourceIds:['ip-subnets'],points:[
    'Passer d’un /24 à des /26 ajoute deux bits réseau : on obtient quatre blocs, chacun de 64 adresses.',
    'Dans 192.168.10.0/24, les quatre réseaux sont 192.168.10.0/26, .64/26, .128/26 et .192/26.',
    'Des tailles de blocs différentes peuvent répondre à des besoins différents. Les blocs doivent être correctement alignés et ne pas se chevaucher.',
  ]},
  {id:'prive-public',title:'Adresses privées et publiques',icon:'web',sourceIds:['ip-planning'],points:[
    'Les plages privées RFC 1918 sont 10.0.0.0/8, 172.16.0.0/12 et 192.168.0.0/16.',
    'Elles servent à l’adressage interne. Évitez les chevauchements entre sites, VPN et réseaux cloud connectés.',
    'Une adresse hors de ces plages n’est pas forcément une adresse publique utilisable : il existe d’autres espaces réservés.',
  ]},
  {id:'passerelle',title:'Passerelle et routage',icon:'route',sourceIds:['ip-subnets','ip-commands'],points:[
    'Avec un adressage cohérent et sans route plus spécifique, une destination du même sous-réseau est jointe directement sur le lien local.',
    'Pour une destination distante, l’hôte consulte sa table de routage. La passerelle par défaut est utilisée lorsqu’aucune route plus précise ne convient.',
    'Le routeur doit connaître la destination et le chemin de retour doit exister. Une passerelle n’est ni un serveur DNS ni un serveur DHCP par définition.',
  ]},
  {id:'dhcp',title:'DHCP, adresses fixes et réservations',icon:'network',sourceIds:['dhcp','ip-dhcp-diagnostic'],points:[
    'DHCP attribue un bail et peut fournir masque, passerelle et serveurs DNS. Une adresse statique se configure avec un plan évitant les doublons.',
    'Une réservation associe une adresse à un client dans DHCP : le client reste configuré pour obtenir son adresse automatiquement.',
    'DHCPv4 utilise UDP 67 côté serveur et 68 côté client. Un relais peut joindre le serveur depuis un autre sous-réseau ; une adresse APIPA 169.254.x.x peut indiquer l’absence de bail.',
  ]},
  {id:'dns',title:'DNS : trouver une adresse à partir d’un nom',icon:'dns-local',sourceIds:['dns','ports'],points:[
    'Les enregistrements A associent un nom à une IPv4 ; les enregistrements AAAA à une IPv6. Le DNS ne remplace pas le routage.',
    'DHCP configure l’adressage ; DNS résout les noms. Une adresse correcte avec un mauvais DNS peut laisser fonctionner un accès par IP mais pas par nom.',
    'Le DNS classique utilise UDP et TCP 53. Les transports DNS chiffrés répondent à des configurations et ports différents.',
  ]},
  {id:'ipv6',title:'IPv6 : adresse et préfixe',icon:'network',sourceIds:['ip-v6'],points:[
    'IPv6 utilise 128 bits et une écriture hexadécimale. Les groupes de zéros peuvent être abrégés ; le symbole :: ne figure qu’une fois dans une adresse.',
    'Une écriture comme 2001:db8:10::20/64 distingue le préfixe et la partie interface. /64 est courant sur les réseaux locaux, sans décrire tous les préfixes IPv6 possibles.',
    'IPv6 utilise notamment unicast, multicast et anycast, sans diffusion broadcast IPv4. Il peut coexister avec IPv4 : leurs configurations doivent être vérifiées séparément.',
  ]},
  {id:'plan',title:'Organiser son plan d’adressage',icon:'vlan',sourceIds:['ip-subnets','ip-planning'],points:[
    'Documentez pour chaque segment : fonction, préfixe, passerelle, plages DHCP, réservations, DNS et marge disponible.',
    'Un VLAN organise le réseau de niveau 2 ; un sous-réseau organise l’adressage IP. Le passage entre segments et les règles d’accès doivent être définis explicitement.',
    'Dans Azure, ne réutilisez pas le calcul classique des hôtes sans tenir compte des cinq adresses réservées et des contraintes propres au service.',
  ]},
  {id:'diagnostic-poste',title:'Diagnostiquer une configuration IP',icon:'diagnostics',sourceIds:['ip-commands','ip-dhcp-diagnostic','dns'],points:[
    'Commencez par l’interface et son adresse : Get-NetIPConfiguration et Get-NetIPAddress. Vérifiez ensuite le préfixe et la passerelle.',
    'Consultez Get-NetRoute pour les routes, puis distinguez la connectivité IP, la résolution de noms et l’accès au port du service.',
    'Un ping refusé ne suffit pas à démontrer qu’un service est indisponible. Test-NetConnection permet aussi de vérifier une connexion TCP sur un port précis.',
  ]},
];

// Exemple IPv4 classique ; les réservations propres au cloud ne sont pas appliquées ici.
export const subnetExample = [0,64,128,192].map((start,index)=>({
  name:['Utilisateurs','Serveurs','Imprimantes','Laboratoire'][index],
  network:`192.168.10.${start}/26`,first:`192.168.10.${start+1}`,last:`192.168.10.${start+62}`,broadcast:`192.168.10.${start+63}`,total:64,hosts:62,
}));
export const cidrExamples = [24,25,26,27,28,29,30].map(prefix=>({prefix,mask:`255.255.255.${256-2**(32-prefix)}`,total:2**(32-prefix),hosts:2**(32-prefix)-2}));

export const networkGuides = [
  {slug:'calculer-sous-reseau-ipv4',category:'adressage-reseau',title:'IPv4 : calculer un sous-réseau /26 à partir d’un /24',excerpt:'Masque, taille des blocs, adresses réseau et plages hôtes : un exemple de découpage expliqué étape par étape.',topic:'IPv4 et CIDR',level:'Guide pratique',date:'2026-10-25',sections:[
    ['Choisir la taille du bloc','Pour découper 192.168.10.0/24 en quatre sous-réseaux égaux, ajoutez deux bits au préfixe : /26. Il reste six bits, soit 64 adresses par bloc. Le masque devient 255.255.255.192.'],
    ['Déterminer les quatre réseaux','Les blocs commencent à 0, 64, 128 et 192 dans le dernier octet : 192.168.10.0/26, 192.168.10.64/26, 192.168.10.128/26 et 192.168.10.192/26. Ils couvrent le /24 sans se chevaucher.'],
    ['Identifier les hôtes et la diffusion','Pour 192.168.10.64/26, la diffusion est 192.168.10.127. La plage hôte classique est 192.168.10.65 à 192.168.10.126. Une passerelle ou une autre réservation consomme une adresse de cette plage ; la capacité disponible pour les postes est donc inférieure à 62 si ces équipements sont présents.'],
    ['Adapter au contexte','Cet exemple décrit un réseau IPv4 classique. Dans un sous-réseau Azure, cinq adresses sont réservées. Les cas /31 et /32 ne suivent pas la règle générale de retrait des adresses réseau et de diffusion. Documentez les contraintes de votre plateforme avant de déployer.'],
  ]},
  {slug:'comprendre-adresse-ipv6',category:'adressage-reseau',title:'IPv6 : comprendre une adresse et son préfixe',excerpt:'Écriture hexadécimale, compression et préfixe : lire une adresse IPv6 sans appliquer les règles IPv4.',topic:'IPv6',level:'Fondamentaux',date:'2026-10-25',sections:[
    ['Lire les 128 bits','Une adresse IPv6 se représente par huit groupes de 16 bits en hexadécimal. Les zéros au début d’un groupe peuvent être omis. Une seule suite de groupes entièrement nuls peut être compressée avec ::.'],
    ['Interpréter le préfixe','Dans 2001:db8:10::20/64, les 64 premiers bits décrivent le préfixe du sous-réseau de cet exemple. Les préfixes /64 sont courants pour les réseaux locaux ; ne concluez pas que toutes les routes IPv6 ou toutes les allocations ont cette longueur.'],
    ['Distinguer IPv4 et IPv6','IPv6 possède ses propres types d’adresses et n’utilise pas le broadcast IPv4. Sur une machine à double pile, examinez les deux familles avec Get-NetIPAddress. La présence d’une adresse IPv6 ne prouve pas à elle seule la connectivité vers une destination.'],
  ]},
];
