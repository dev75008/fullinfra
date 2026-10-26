import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Workflow, Users, Code2, Activity, ShieldCheck, GitBranch, ClipboardCheck, Package, Rocket, Boxes, LockKeyhole, MessageSquare, Layers3, Network } from 'lucide-react';

// Même grille en six bandes, palette claire et police Segoe UI que les autres rubriques.
const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const parts = [`<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1800" viewBox="0 0 2400 1800" font-family="Segoe UI, Arial, sans-serif" role="img" aria-labelledby="title desc"><title id="title">DevOps classique : architecture et fonctionnement</title><desc id="desc">Git, CI/CD, tests, artefacts, conteneurs, Kubernetes, IaC, sécurité et observabilité.</desc><rect width="2400" height="1800" fill="#f4f8fb"/>`];
function rect(x,y,w,h,fill='#fff',stroke='#cbddeb') { parts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${fill}" stroke="${stroke}"/>`); }
function text(x,y,value,size=25,color='#173654',weight=400) { parts.push(`<text x="${x}" y="${y}" fill="${color}" font-size="${size}" font-weight="${weight}">${escape(value)}</text>`); }
// Pictogrammes fonctionnels : ne pas attribuer de logos Microsoft aux outils indépendants.
const icons={workflow:Workflow,people:Users,developers:Code2,metrics:Activity,security:ShieldCheck,git:GitBranch,checks:ClipboardCheck,packages:Package,delivery:Rocket,containers:Boxes,secrets:LockKeyhole,feedback:MessageSquare,iac:Layers3,orchestrator:Network};
async function icon(name,x,y,size=58,color='#0067b8') {
  const Icon=icons[name];assert.ok(Icon,`Icône manquante : ${name}`);
  const svg=renderToStaticMarkup(React.createElement(Icon,{size,color,strokeWidth:1.7}));
  parts.push(`<g transform="translate(${x} ${y})">${svg}</g>`);
}
function row(n,y,h,title,description) { rect(30,y,2340,h); rect(30,y,290,h,'#edf5fb','#edf5fb'); parts.push(`<circle cx="66" cy="${y+42}" r="19" fill="#0067b8"/>`); text(59,y+50,n,24,'#fff',700); title.forEach((line,i)=>text(98,y+48+i*35,line,29,'#173654',700)); description.forEach((line,i)=>text(52,y+h-65+i*30,line,24,'#526b82')); }
async function card(x,y,w,h,title,name,lines,color='#0067b8') { rect(x,y,w,h,'#f7fafc'); rect(x,y,w,52,color,color); await icon(name,x+13,y+10,32,'#fff'); text(x+58,y+36,title,28,'#fff',650); await icon(name,x+22,y+80,68); lines.forEach((line,i)=>text(x+110,y+99+i*37,line,25)); }
await icon('workflow',35,25,70);text(125,80,'DevOps classique',61,'#0b4876',700);text(760,72,'Du code à la production',42,'#173654',650);text(760,112,'Git, CI/CD et automatisation, sans dépendance au cloud',27,'#526b82');
row(1,150,180,['Collaborer','et planifier'],['Besoins et priorités','Responsabilités définies']);
for(const [i,[name,title,desc]]of [['people','Équipe produit','Besoins et priorités'],['developers','Développement','Code, revue et qualité'],['metrics','Exploitation','Fiabilité et incidents'],['security','Sécurité','Risques et contrôles']].entries()){const x=360+i*495;await icon(name,x+165,170,58);text(x+45,265,title,30,'#173654',650);text(x+45,305,desc,24,'#526b82');}
row(2,350,310,['Versionner','et intégrer'],['Chaque changement','reste traçable']);
await card(340,370,970,225,'GitHub / GitLab et revue de code','git',['Commits · Branches · Pull requests','Revue et politiques de la branche principale','Historique du code et de la configuration']);
await card(1330,370,1020,225,'Intégration continue (CI)','workflow',['GitHub Actions · GitLab CI/CD · Jenkins','Construction · Tests · Analyses requis','Résultats associés au commit']);
text(365,630,'Le dépôt déclenche les contrôles configurés.',26,'#0067b8',600);text(1320,630,'Un contrôle obligatoire en échec bloque la suite.',26,'#0067b8',600);
row(3,680,260,['Valider','et livrer'],['Promouvoir une version','identifiée et contrôlée']);
await card(340,700,650,220,'Tests et qualité','checks',['Tests unitaires et intégration','Parcours de bout en bout','Analyses et critères de validation']);
await card(1010,700,650,220,'Artefacts et registres','packages',['Paquets · Archives · Images','Version et commit identifiables','Même artefact entre les étapes']);
await card(1680,700,670,220,'Livraison et déploiement','delivery',['Test → Préproduction → Production','Approbations selon la politique','Contrôle après mise en service']);
row(4,960,260,['Exécuter','et provisionner'],['Cycles de l’application','et de l’infrastructure']);
await card(340,980,650,220,'Docker : images et conteneurs','containers',['Image : contenu à exécuter','Conteneur : instance exécutée','Données et secrets séparés']);
await card(1010,980,650,220,'Kubernetes','orchestrator',['Pods · Deployments · Services','État déclaré et réplicas','Optionnel selon les besoins']);
await card(1680,980,670,220,'Infrastructure comme code','iac',['Terraform : provisionner les ressources','Ansible : configurer les systèmes','Plateforme compatible · État protégé']);
row(5,1240,290,['Protéger','et exploiter'],['Observer les résultats','et réviser les pratiques']);
for(const [i,[title,name,lines,color]]of [['Identités et secrets','secrets',['Coffre de secrets','Accès limités par rôle','Séparation des environnements','Rotation et audit'],'#b3262b'],['DevSecOps','security',['Code et dépendances','Images et chaîne de livraison','Protection des agents','Traçabilité des validations'],'#b3262b'],['Observabilité','metrics',['Prometheus : métriques et alertes','Grafana : tableaux de bord','Journaux collectés séparément','Réaction aux incidents'],'#0067b8'],['Amélioration continue','feedback',['Retours de production','Nouvelles tâches du backlog','Tests et procédures enrichis','Fiabilité et qualité suivies'],'#107c41']].entries()){const x=340+i*505;rect(x,1260,485,250,'#f7fafc');rect(x,1260,485,52,color,color);text(x+15,1295,title,25,'#fff',650);await icon(name,x+18,1350,65);lines.forEach((line,j)=>text(x+102,1354+j*36,line,23));}
row(6,1550,145,['Boucle','de livraison'],[]);
['Besoin','Code et revue','CI et tests','Artefact validé','Déploiement','Retour terrain'].forEach((label,i)=>{const x=345+i*335;parts.push(`<circle cx="${x+20}" cy="1591" r="20" fill="#0067b8"/>`);text(x+13,1599,i+1,24,'#fff',700);text(x+51,1600,label,24,'#173654',600);if(i<5)text(x+295,1640,'→',38,'#0078d4');});
rect(30,1715,2340,55,'#0b4876','#0b4876');text(52,1751,'CI/CD · IaC · Conteneurisation',25,'#fff',600);text(920,1751,'Monitoring · Collaboration',25,'#fff',600);text(1680,1751,'Les cinq piliers du DevOps',25,'#fff',600);
text(34,1792,'Kubernetes est optionnel. Les gains dépendent des tests et de l’automatisation. Pictogrammes fonctionnels ; aucun logo éditeur.',22,'#526b82');
parts.push('</svg>');
const svg=parts.join('\n');
const target=new URL('../public/devops-classique-architecture.svg',import.meta.url);
assert.ok(!svg.includes('<a ') && !svg.includes('<script') && !svg.includes('Azure Pipelines'));
if(process.argv.includes('--check')) assert.equal(await readFile(target,'utf8'),svg,'Régénérer l’infographie DevOps classique.');
else await writeFile(target,svg);
console.log('OK : infographie DevOps classique, Segoe UI vectoriel, 2400 × 1800.');
