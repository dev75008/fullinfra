import React from 'react';
import SourceLinks from './SourceLinks';
import './microsoft365-dependencies.css';

export default function WindowsArchitecture() {
  const image = `${import.meta.env.BASE_URL}windows-server-architecture.svg?v=segoe-2`;
  const png = `${import.meta.env.BASE_URL}windows-server-architecture-hd.png?v=segoe-2`;
  return <section id="windows-architecture" className="dependency-infographic supplied-infographic" aria-labelledby="windows-architecture-title">
    <header><h2 id="windows-architecture-title">Windows Server : architecture et communications</h2><p>Les douze branches, leurs dépendances et les principaux échanges dans une infrastructure Windows Server.</p></header>
    <div className="dependency-toolbar"><a className="button primary" href={image} target="_blank" rel="noopener noreferrer">Ouvrir l’image en grand</a><a className="button secondary" href={png} download="fullinfra-windows-server-architecture-hd.png">Télécharger le PNG haute résolution</a><a className="button secondary" href={image} download="fullinfra-windows-server-architecture.svg">Télécharger le SVG</a></div>
    <figure><a href={image} target="_blank" rel="noopener noreferrer" aria-label="Agrandir l’infographie Windows Server dans un nouvel onglet"><img className="m365-architecture-image" src={image} width="2400" height="1800" alt="Architecture Windows Server : postes clients, Active Directory, DNS, fichiers, IIS, RDS, Hyper-V, sécurité, disponibilité, automatisation, supervision et Azure hybride."/></a><figcaption>Vue pédagogique des dépendances. Les ports indiqués sont des repères : consultez la carte interactive et les fiches ci-dessous pour les transports, les rôles et les conditions d’utilisation.</figcaption></figure>
    <details className="infographic-transcript"><summary>Lire le résumé de l’infographie</summary><ol>
      <li>Les clients utilisent DNS pour résoudre les noms et découvrir les services du domaine. DHCP peut fournir leur configuration réseau.</li>
      <li>AD DS centralise les identités du domaine. Kerberos fournit des tickets ; LDAP permet les accès à l’annuaire. Les GPO utilisent aussi les fichiers SYSVOL via SMB.</li>
      <li>Les applications et utilisateurs accèdent aux fichiers par SMB et aux applications IIS par HTTP ou HTTPS. RD Gateway utilise HTTPS pour l’accès distant, avec RDP vers les ressources internes.</li>
      <li>Hyper-V héberge les machines virtuelles. Les mécanismes de sécurité, de stockage et de haute disponibilité s’appliquent selon les rôles déployés.</li>
      <li>PowerShell, la maintenance et la supervision administrent les services. Azure Arc et Azure Backup apportent des fonctions hybrides selon leur configuration.</li>
      <li>Exemple de parcours : résolution DNS, authentification du domaine, accès au service, vérification des autorisations et journalisation.</li>
    </ol></details>
    <SourceLinks ids={['ad','kerberos','gpo']}/>
  </section>;
}

