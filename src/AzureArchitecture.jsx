import React from 'react';
import SourceLinks from './SourceLinks';
import './microsoft365-dependencies.css';

export default function AzureArchitecture() {
  const image = `${import.meta.env.BASE_URL}azure-architecture.svg?v=1`;
  return <section id="azure-architecture" className="dependency-infographic supplied-infographic" aria-labelledby="azure-architecture-title">
    <header><h2 id="azure-architecture-title">Azure : architecture et communications</h2><p>Identité, réseau, calcul, données et exploitation : les douze thèmes pour comprendre les dépendances d’une infrastructure Azure.</p></header>
    <figure><a href={image} target="_blank" rel="noopener noreferrer" aria-label="Agrandir l’infographie Azure dans un nouvel onglet"><img className="m365-architecture-image" src={image} width="2400" height="1800" alt="Architecture Azure : acteurs, Entra ID et RBAC, réseaux, machines virtuelles, App Service, Functions, bases de données, stockage, sécurité, disponibilité, automatisation, sauvegarde, supervision et gouvernance."/></a><figcaption>Texte vectoriel en Segoe UI, net au zoom. Le parcours est un exemple : les flux, ports et dépendances varient selon les services et leur configuration.</figcaption></figure>
    <details className="infographic-transcript"><summary>Lire le résumé de l’infographie</summary><ol>
      <li>Utilisateurs, administrateurs et applications accèdent aux ressources par les interfaces et chemins autorisés.</li>
      <li>Microsoft Entra ID gère les identités ; Azure RBAC encadre les opérations sur les ressources. Réseau et DNS assurent la connectivité.</li>
      <li>Les VM, App Service et Functions exécutent les charges ; les bases de données et le stockage conservent leurs données.</li>
      <li>Les contrôles réseau, Key Vault et les mécanismes de disponibilité répondent à des besoins distincts.</li>
      <li>IaC, sauvegarde, supervision et gouvernance accompagnent l’exploitation. Un budget génère des notifications sans plafonner automatiquement les dépenses.</li>
      <li>Exemple : un client rejoint une application en HTTPS ; l’application utilise une identité managée pour accéder à un service compatible, et sa télémétrie alimente la supervision.</li>
    </ol></details>
    <SourceLinks ids={['entra','vnet']}/>
  </section>;
}
