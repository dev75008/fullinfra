import { readFile, writeFile } from 'node:fs/promises';

// Texte vectoriel et icônes intégrées : le document reste autonome et net au zoom.
const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const parts = [`<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="2060" viewBox="0 0 2400 2060" font-family="Segoe UI, Arial, sans-serif" role="img" aria-labelledby="title desc"><title id="title">Azure : architecture, Microsoft Foundry et communications</title><desc id="desc">Identité, réseau, calcul, applications, Microsoft Foundry, modèles, agents, outils MCP, RAG, données, sécurité et exploitation Azure.</desc><rect width="2400" height="2060" fill="#f4f8fb"/>`];
function rect(x,y,w,h,fill='#fff',stroke='#cbddeb') { parts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${fill}" stroke="${stroke}"/>`); }
function text(x,y,value,size=25,color='#173654',weight=400) { parts.push(`<text x="${x}" y="${y}" fill="${color}" font-size="${size}" font-weight="${weight}">${escape(value)}</text>`); }
async function icon(name,x,y,size=58) { const svg=await readFile(new URL(`../public/icons/microsoft/${name}.svg`,import.meta.url)); parts.push(`<image x="${x}" y="${y}" width="${size}" height="${size}" href="data:image/svg+xml;base64,${svg.toString('base64')}"/>`); }
function row(n,y,h,title,description) { rect(30,y,2340,h); rect(30,y,290,h,'#edf5fb','#edf5fb'); parts.push(`<circle cx="66" cy="${y+42}" r="19" fill="#0067b8"/>`); text(59,y+50,n,24,'#fff',700); title.forEach((line,i)=>text(98,y+48+i*35,line,29,'#173654',700)); description.forEach((line,i)=>text(52,y+h-65+i*30,line,24,'#526b82')); }
async function card(x,y,w,h,title,name,lines,color='#0067b8') { rect(x,y,w,h,'#f7fafc'); rect(x,y,w,52,color,color); await icon(name,x+13,y+10,32); text(x+58,y+36,title,28,'#fff',650); await icon(name,x+22,y+80,68); lines.forEach((line,i)=>text(x+110,y+99+i*37,line,25)); }
await icon('azure',35,25,70); text(125,80,'Microsoft Azure',61,'#0b4876',700); text(720,72,'Architecture, services et communications',42,'#173654',650); text(720,112,'Infrastructure, données et agents IA Microsoft Foundry',27,'#526b82');
row(1,150,180,['Acteurs','et accès'],['Utilisation, gestion','et accès applicatifs']);
for (const [i,[name,title,desc]] of [['m365-concept-people','Utilisateurs','Applications et services'],['m365-concept-admin','Administrateurs','Portail, CLI et PowerShell'],['appservice','Applications','API et identités de service'],['gateway','Sites et appareils','Internet ou accès privé']].entries()) { const x=360+i*495; await icon(name,x+165,170,58); text(x+45,265,title,30,'#173654',650); text(x+45,305,desc,24,'#526b82'); }
row(2,350,310,['Identité','et connectivité'],['Qui accède à quoi,','par quel chemin ?']);
await card(340,370,970,195,'Identités et accès','entra',['Microsoft Entra ID · Authentification','Azure RBAC · Identités managées · Autorisations']);
await card(1330,370,1020,195,'Réseau et connectivité','vnet',['VNet · Sous-réseaux · DNS · Routage','VPN · ExpressRoute · Private Link']);
text(365,615,'L’identité et les droits autorisent les opérations.',26,'#0067b8',600); text(1320,615,'Le réseau et DNS rendent le service joignable.',26,'#0067b8',600);
row(3,680,260,['Calcul','et applications'],['Exécuter les charges','et accéder aux données']);
await card(340,700,650,220,'Calcul et machines virtuelles','vm',['VM Azure · Disques','VM Scale Sets · Capacité','Bastion · Accès administrateur']);
await card(1010,700,650,220,'Web et applications','appservice',['App Service · Hébergement','Functions · Exécution de code','Passerelles et livraison web']);
await card(1680,700,670,220,'Bases de données','sql',['Azure SQL · PostgreSQL','Connexions chiffrées','Réseau et droits du service']);
row(4,960,240,['Microsoft','Foundry'],['Modèles, agents','et outils IA']);
await card(340,980,650,200,'Modèles et déploiements','azure',['Choisir un modèle du catalogue','Déployer et appeler via une API','Régions, quotas et coûts à vérifier']);
await card(1010,980,650,200,'Agents, outils et RAG','appservice',['Foundry Agent Service · Outils MCP','Azure AI Search · Contexte RAG','Droits des données à configurer']);
await card(1680,980,670,200,'Sécurité et évaluations','monitor',['Microsoft Entra ID · Rôles RBAC','Évaluer et tracer les appels IA','Réseau privé selon configuration']);
parts.push('<g transform="translate(0 260)">');
row(5,960,260,['Données','et protection'],['Conserver, sécuriser','et maintenir les services']);
await card(340,980,650,220,'Stockage','storage',['Blob · Stockage objet','Azure Files · Partages','Accès et rétention des données']);
await card(1010,980,650,220,'Sécurité','keyvault',['NSG · Azure Firewall','Key Vault · Secrets et clés','Contrôles selon les ressources'],'#b3262b');
await card(1680,980,670,220,'Disponibilité et reprise','availability',['Zones selon les services','Répartition des instances','PRA · Dépendances régionales'],'#107c41');
row(6,1240,290,['Exploitation','et gouvernance'],['Déployer, observer','et maîtriser les coûts']);
for (const [i,[title,name,lines,color]] of [['Automatisation et IaC','automation',['Azure Resource Manager','Bicep · Terraform','CLI · PowerShell','Déploiements autorisés'],'#0067b8'],['Sauvegarde et protection','backup',['Azure Backup · Coffres','Politiques de sauvegarde','Points de récupération','Tests de restauration'],'#107c41'],['Supervision et observabilité','monitor',['Azure Monitor','Logs · Traces · Mesures','Alertes et diagnostic','Suivi des dépendances'],'#0067b8'],['Gouvernance et coûts','policy',['Abonnements et groupes','Azure Policy · Étiquettes','Budgets et notifications','Analyse des coûts'],'#0067b8']].entries()) { const x=340+i*505; rect(x,1260,485,250,'#f7fafc'); rect(x,1260,485,52,color,color); text(x+15,1295,title,25,'#fff',650); await icon(name,x+18,1350,65); lines.forEach((line,j)=>text(x+102,1354+j*36,line,23)); }
row(7,1550,145,['Parcours','applicatif'],[]);
['Client HTTPS','DNS et réseau','Application','Identité managée','Service de données','Télémétrie'].forEach((label,i)=>{const x=345+i*335; parts.push(`<circle cx="${x+20}" cy="1591" r="20" fill="#0067b8"/>`); text(x+13,1599,i+1,24,'#fff',700); text(x+51,1600,label,24,'#173654',600); if(i<5) text(x+295,1640,'→',38,'#0078d4'); });
rect(30,1715,2340,55,'#0b4876','#0b4876'); text(52,1751,'Repères réseau : HTTPS 443 · DNS TCP/UDP 53 · Azure Files SMB 445 · Azure SQL : ports selon le mode de connexion',25,'#fff',600);
text(34,1792,'Parcours indicatif ; dépendances selon le service. Entra ID ≠ AD DS. Réplication ≠ sauvegarde. Un budget ne bloque pas automatiquement les dépenses.',22,'#526b82');
parts.push('</g></svg>');
const target = new URL('../public/azure-architecture.svg',import.meta.url);
const svg = parts.join('\n');
if (process.argv.includes('--check')) {
  if (await readFile(target,'utf8') !== svg) throw new Error('Régénérez l’infographie Azure après modification.');
} else await writeFile(target,svg);
console.log('OK : infographie Azure et Microsoft Foundry synchronisée, texte vectoriel Segoe UI.');
