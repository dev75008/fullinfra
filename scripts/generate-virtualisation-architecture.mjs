import { readFile, writeFile } from 'node:fs/promises';

// Texte vectoriel et icônes intégrées : le document reste autonome et net au zoom.
const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const parts = [`<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1800" viewBox="0 0 2400 1800" font-family="Segoe UI, Arial, sans-serif" role="img" aria-labelledby="title desc"><title id="title">Virtualisation : architecture et communications</title><desc id="desc">Hyperviseurs, machines virtuelles, réseau, stockage, gestion, disponibilité et exploitation.</desc><rect width="2400" height="1800" fill="#f4f8fb"/>`];
function rect(x,y,w,h,fill='#fff',stroke='#cbddeb') { parts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${fill}" stroke="${stroke}"/>`); }
function text(x,y,value,size=25,color='#173654',weight=400) { parts.push(`<text x="${x}" y="${y}" fill="${color}" font-size="${size}" font-weight="${weight}">${escape(value)}</text>`); }
async function icon(name,x,y,size=58) { const svg=await readFile(new URL(`../public/icons/microsoft/${name}.svg`,import.meta.url)); parts.push(`<image x="${x}" y="${y}" width="${size}" height="${size}" href="data:image/svg+xml;base64,${svg.toString('base64')}"/>`); }
function row(n,y,h,title,description) { rect(30,y,2340,h); rect(30,y,290,h,'#edf5fb','#edf5fb'); parts.push(`<circle cx="66" cy="${y+42}" r="19" fill="#0067b8"/>`); text(59,y+50,n,24,'#fff',700); title.forEach((line,i)=>text(98,y+48+i*35,line,29,'#173654',700)); description.forEach((line,i)=>text(52,y+h-65+i*30,line,24,'#526b82')); }
async function card(x,y,w,h,title,name,lines,color='#0067b8') { rect(x,y,w,h,'#f7fafc'); rect(x,y,w,52,color,color); await icon(name,x+13,y+10,32); text(x+58,y+36,title,28,'#fff',650); await icon(name,x+22,y+80,68); lines.forEach((line,i)=>text(x+110,y+99+i*37,line,25)); }
await icon('vm',35,25,70); text(125,80,'Virtualisation',61,'#0b4876',700); text(720,72,'Architecture, services et communications',42,'#173654',650); text(720,112,'Hyper-V, VMware vSphere et environnements hybrides',27,'#526b82');
row(1,150,180,['Matériel','et ressources'],['Fondations physiques','de la plateforme']);
for (const [i,[name,title,desc]] of [['vm','Processeurs','vCPU et ordonnancement'],['resource-group','Mémoire','Capacité et allocation RAM'],['disk','Disques','Volumes et performances'],['vnet','Interfaces réseau','Connectivité des hôtes']].entries()) { const x=360+i*495; await icon(name,x+165,170,58); text(x+45,265,title,30,'#173654',650); text(x+45,305,desc,24,'#526b82'); }
row(2,350,310,['Hyperviseurs','et gestion'],['Deux plateformes','avec leurs propres outils']);
await card(340,370,970,195,'Hyper-V','vm',['Rôle Windows Server · Hôtes et machines virtuelles','Gestionnaire Hyper-V · PowerShell · Consoles']);
await card(1330,370,1020,195,'VMware vSphere sur site','m365-concept-desktop',['ESXi · Exécution des machines virtuelles','vCenter · Inventaire et administration centralisée']);
text(365,615,'Les outils de gestion pilotent les hôtes et leurs VM.',26,'#0067b8',600); text(1320,615,'Azure VMware Solution : service distinct dans Azure.',26,'#0067b8',600);
row(3,680,260,['Machines','et connectivité'],['Les VM consomment','réseau et stockage']);
await card(340,700,650,220,'Machines virtuelles','vm',['vCPU · RAM · Disques virtuels','Système invité · Applications','Cycle de vie et modèles']);
await card(1010,700,650,220,'Réseaux virtuels','vnet',['vSwitch · Ports virtuels','VLAN · Segmentation','Routage via équipement dédié']);
await card(1680,700,670,220,'Stockage','storage',['Datastores · Volumes','SMB · NFS · iSCSI','Protocoles selon la plateforme']);
row(4,960,260,['Continuité','et protection'],['Disponibilité, mobilité','et restauration']);
await card(340,980,650,220,'Haute disponibilité','availability',['Cluster · Ressources de secours','Reprise après panne d’hôte','Capacité et stockage requis'],'#107c41');
await card(1010,980,650,220,'Migration et mobilité','filesync',['Hyper-V Live Migration','VMware vMotion','Hôtes et réseaux compatibles'],'#0067b8');
await card(1680,980,670,220,'Sauvegarde et PRA','backup',['Copies indépendantes','Réplication selon le scénario','Tests de restauration'],'#107c41');
row(5,1240,290,['Exploitation','et extension'],['Sécuriser, automatiser','et mesurer les services']);
for (const [i,[title,name,lines,color]] of [['Sécurité et isolation','m365-defender',['Droits et rôles','Réseau de gestion isolé','Segmentation des flux','Protection des hôtes'],'#b3262b'],['Automatisation','powershell',['PowerShell · API','Modèles et configuration','Opérations répétables','Journalisation'],'#0067b8'],['Supervision','monitor',['Charge CPU et mémoire','Latence du stockage','État des hôtes et VM','Alertes et capacité'],'#0067b8'],['Cloud et conteneurs','containers',['Extensions vers Azure','Azure VMware Solution','Conteneurs ≠ machines VM','Modèles d’isolation distincts'],'#0067b8']].entries()) { const x=340+i*505; rect(x,1260,485,250,'#f7fafc'); rect(x,1260,485,52,color,color); text(x+15,1295,title,25,'#fff',650); await icon(name,x+18,1350,65); lines.forEach((line,j)=>text(x+102,1354+j*36,line,23)); }
row(6,1550,145,['Parcours','d’une VM'],[]);
['Administration','Création de VM','CPU et mémoire','Réseau virtuel','Disques virtuels','Supervision'].forEach((label,i)=>{const x=345+i*335; parts.push(`<circle cx="${x+20}" cy="1591" r="20" fill="#0067b8"/>`); text(x+13,1599,i+1,24,'#fff',700); text(x+51,1600,label,25,'#173654',600); if(i<5) text(x+295,1640,'→',38,'#0078d4'); });
rect(30,1715,2340,55,'#0b4876','#0b4876'); text(52,1751,'Gestion : HTTPS 443 · WinRM 5985/5986 | Stockage : SMB 445 · iSCSI 3260 | vMotion : TCP 8000 (ESXi 7/8)',25,'#fff',600);
text(34,1792,'Flux indicatifs selon les produits et versions. Un snapshot n’est pas une sauvegarde. HA, réplication et PRA répondent à des besoins distincts.',22,'#526b82');
parts.push('</svg>');
await writeFile(new URL('../public/virtualisation-architecture.svg',import.meta.url),parts.join('\n'));
console.log('OK : infographie Virtualisation, texte vectoriel Segoe UI.');
