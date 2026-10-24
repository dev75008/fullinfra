import { readFile, writeFile } from 'node:fs/promises';

// Texte vectoriel et icônes intégrées : le document reste autonome et net au zoom.
const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const parts = [`<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1800" viewBox="0 0 2400 1800" font-family="Segoe UI, Arial, sans-serif" role="img" aria-labelledby="title desc"><title id="title">Windows Server : architecture et communications</title><desc id="desc">Douze branches Windows Server, services réseau, identité, applications, sécurité, exploitation et exemple de communication.</desc><rect width="2400" height="1800" fill="#f4f8fb"/>`];
function rect(x,y,w,h,fill='#fff',stroke='#cbddeb') { parts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${fill}" stroke="${stroke}"/>`); }
function text(x,y,value,size=25,color='#173654',weight=400) { parts.push(`<text x="${x}" y="${y}" fill="${color}" font-size="${size}" font-weight="${weight}">${escape(value)}</text>`); }
async function icon(name,x,y,size=58) { const svg=await readFile(new URL(`../public/icons/microsoft/${name}.svg`,import.meta.url)); parts.push(`<image x="${x}" y="${y}" width="${size}" height="${size}" href="data:image/svg+xml;base64,${svg.toString('base64')}"/>`); }
function row(n,y,h,title,description) { rect(30,y,2340,h); rect(30,y,290,h,'#edf5fb','#edf5fb'); parts.push(`<circle cx="66" cy="${y+42}" r="19" fill="#0067b8"/>`); text(59,y+50,n,24,'#fff',700); title.forEach((line,i)=>text(98,y+48+i*35,line,29,'#173654',700)); description.forEach((line,i)=>text(52,y+h-65+i*30,line,24,'#526b82')); }
async function card(x,y,w,h,title,name,lines,color='#0067b8') { rect(x,y,w,h,'#f7fafc'); rect(x,y,w,52,color,color); await icon(name,x+13,y+10,32); text(x+58,y+36,title,28,'#fff',650); await icon(name,x+22,y+80,68); lines.forEach((line,i)=>text(x+110,y+99+i*37,line,25)); }
await icon('vm',35,25,70); text(125,80,'Windows Server',61,'#0b4876',700); text(720,72,'Architecture, services et communications',42,'#173654',650); text(720,112,'Identité, réseau, services et administration',27,'#526b82');
row(1,150,180,['Utilisateurs','et accès'],['Accès aux ressources','de l’infrastructure']);
for (const [i,[name,title,desc]] of [['m365-concept-desktop','PC Windows','Postes de travail'],['m365-concept-admin','Administrateurs','Administration des serveurs'],['appservice','Applications','Services et applications métiers'],['gateway','Accès distant','VPN, RDS et passerelles']].entries()) { const x=360+i*495; await icon(name,x+165,170,58); text(x+45,265,title,30,'#173654',650); text(x+45,305,desc,24,'#526b82'); }
row(2,350,310,['Identité','et réseau'],['Découverte des services','et authentification']);
await card(340,370,970,195,'Active Directory','m365-concept-people',['AD DS · Utilisateurs et groupes','Kerberos · LDAP · Stratégies de groupe (GPO)']);
await card(1330,370,1020,195,'Services réseau','dns',['DNS · Résolution des noms et des services','DHCP · Configuration IP · VPN / RRAS']);
text(365,615,'1. DNS découvre les services du domaine',26,'#0067b8',600); text(1320,615,'2. Le client s’authentifie auprès d’AD DS',26,'#0067b8',600);
row(3,680,260,['Services','et données'],['Fichiers, applications','et sessions distantes']);
await card(340,700,650,220,'Fichiers et stockage','files',['SMB · Partage de fichiers','DFS · Noms et réplication','iSCSI · Stockage réseau']);
await card(1010,700,650,220,'Web et applications','m365-concept-web',['IIS · Hébergement web','HTTPS · Accès chiffré','Certificats TLS']);
await card(1680,700,670,220,'Bureau à distance (RDS)','m365-concept-desktop',['RD Gateway · HTTPS 443','RDP interne · Port 3389','Sessions et applications']);
row(4,960,260,['Infrastructure','et protection'],['Hébergement, protection','et continuité']);
await card(340,980,650,220,'Virtualisation','vm',['Hyper-V · Hyperviseur','Machines virtuelles','Commutateur virtuel'],'#107c41');
await card(1010,980,650,220,'Sécurité','m365-defender',['Pare-feu · Defender','ACL · Contrôle des accès','BitLocker · Chiffrement'],'#b3262b');
await card(1680,980,670,220,'Haute disponibilité','availability',['Clustering · Basculement','Réplication selon le rôle','Continuité de service'],'#107c41');
row(5,1240,290,['Exploitation','et cloud hybride'],['Administration, suivi','et intégration à Azure']);
for (const [i,[title,name,lines]] of [['Mise à jour et maintenance','automation',['Correctifs Windows','Windows Update','WSUS déprécié','Maintenance planifiée']],['PowerShell et automatisation','powershell',['Scripts PowerShell','WinRM · Accès distant','Configuration','Tâches automatisées']],['Supervision et monitoring','monitor',['Événements','Compteurs de performance','Alertes et rapports','Suivi des services']],['Cloud hybride et Azure','arc',['Azure Arc','Azure Backup','Connexions HTTPS','Fonctions selon le service']]].entries()) { const x=340+i*505; rect(x,1260,485,250,'#f7fafc'); rect(x,1260,485,52,'#0067b8','#0067b8'); text(x+15,1295,title,25,'#fff',650); await icon(name,x+18,1350,65); lines.forEach((line,j)=>text(x+102,1354+j*36,line,24)); }
row(6,1550,145,['Parcours','utilisateur'],[]);
const steps=['Poste client','DNS','Kerberos / AD DS','SMB ou HTTPS','Droits d’accès','Journalisation'];
steps.forEach((label,i)=>{const x=345+i*335; parts.push(`<circle cx="${x+20}" cy="1591" r="20" fill="#0067b8"/>`); text(x+13,1599,i+1,24,'#fff',700); text(x+51,1600,label,25,'#173654',600); if(i<5) text(x+295,1640,'→',38,'#0078d4'); });
rect(30,1715,2340,55,'#0b4876','#0b4876'); text(52,1751,'Protocoles usuels : DNS 53 · Kerberos 88 · LDAP 389 · SMB 445 · HTTPS 443 · WinRM 5985/5986',26,'#fff',600);
text(34,1792,'Ports indicatifs selon les rôles ; tous les flux ne sont pas représentés. AD DS et Microsoft Entra ID sont distincts.',22,'#526b82');
parts.push('</svg>');
await writeFile(new URL('../public/windows-server-architecture.svg',import.meta.url),parts.join('\n'));
console.log('OK : infographie Windows Server, texte vectoriel Segoe UI.');

