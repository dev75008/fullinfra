import React from 'react';
import SourceLinks from './SourceLinks';
import './microsoft365-dependencies.css';

export default function AzureArchitecture() {
  const image = `${import.meta.env.BASE_URL}azure-architecture.svg?v=2-foundry`;
  return <section id="azure-architecture" className="dependency-infographic supplied-infographic" aria-labelledby="azure-architecture-title">
    <header><h2 id="azure-architecture-title">Azure : architecture et communications</h2><p>Identité, infrastructure, données et IA : Microsoft Foundry rejoint les services Azure pour comprendre les modèles, les agents et leurs dépendances.</p></header>
    <figure onClickCapture={event => { event.preventDefault(); event.stopPropagation(); }} onDoubleClickCapture={event => { event.preventDefault(); event.stopPropagation(); }}><img draggable={false} className="m365-architecture-image" src={image} width="2400" height="2060" alt="Architecture Azure : identité, réseau, calcul, Microsoft Foundry avec modèles, agents, outils MCP, RAG et évaluations, bases de données, stockage, sécurité et exploitation."/><figcaption>Texte vectoriel en Segoe UI, net au zoom. Foundry, ses modèles et outils ont des permissions, coûts et disponibilités propres ; les flux dépendent de la configuration.</figcaption></figure>
    <details className="infographic-transcript"><summary>Lire le résumé de l’infographie</summary><ol>
      <li>Utilisateurs, administrateurs et applications accèdent aux ressources par les interfaces et chemins autorisés.</li>
      <li>Microsoft Entra ID gère les identités ; Azure RBAC encadre les opérations sur les ressources. Réseau et DNS assurent la connectivité.</li>
      <li>Les VM, App Service et Functions exécutent les charges ; les bases de données et le stockage conservent leurs données.</li>
      <li>Microsoft Foundry réunit modèles, agents et outils. Azure AI Search peut fournir le contexte documentaire RAG ; Entra ID, les rôles, les évaluations et les traces encadrent l’usage.</li>
      <li>Les contrôles réseau, Key Vault et les mécanismes de disponibilité répondent à des besoins distincts.</li>
      <li>IaC, sauvegarde, supervision et gouvernance accompagnent l’exploitation. Un budget génère des notifications sans plafonner automatiquement les dépenses.</li>
      <li>Exemple : un client rejoint une application en HTTPS ; l’application utilise une identité managée pour accéder à un service compatible, et sa télémétrie alimente la supervision.</li>
    </ol></details>
    <SourceLinks ids={['entra','vnet','foundry','foundry-agents','ai-search','foundry-observability']}/>
  </section>;
}
