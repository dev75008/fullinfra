import React from 'react';
import SourceLinks from './SourceLinks';
import './microsoft365-dependencies.css';

export default function VirtualisationArchitecture() {
  const image = `${import.meta.env.BASE_URL}virtualisation-architecture.svg?v=1`;
  return <section id="virtualisation-architecture" className="dependency-infographic supplied-infographic" aria-labelledby="virtualisation-architecture-title">
    <header><h2 id="virtualisation-architecture-title">Virtualisation : architecture et communications</h2><p>Du matériel physique aux machines virtuelles : hyperviseurs, réseau, stockage, disponibilité et administration.</p></header>
    <figure><a href={image} target="_blank" rel="noopener noreferrer" aria-label="Agrandir l’infographie Virtualisation dans un nouvel onglet"><img className="m365-architecture-image" src={image} width="2400" height="1800" alt="Architecture de virtualisation : ressources physiques, Hyper-V et VMware vSphere, gestion, machines virtuelles, réseaux et stockage, haute disponibilité, migration, sauvegarde, sécurité, automatisation, supervision et cloud."/></a><figcaption>Texte vectoriel en Segoe UI, net au zoom. Les flux dépendent de la plateforme et de sa version : consultez les fiches et les références avant de configurer les accès réseau.</figcaption></figure>
    <details className="infographic-transcript"><summary>Lire le résumé de l’infographie</summary><ol>
      <li>Les hôtes fournissent processeurs, mémoire, disques et interfaces réseau aux hyperviseurs.</li>
      <li>Hyper-V et VMware vSphere utilisent leurs propres outils de gestion. Azure VMware Solution est un service distinct dans Azure.</li>
      <li>Les machines virtuelles disposent de ressources virtuelles et accèdent aux réseaux et volumes configurés sur leur plateforme.</li>
      <li>Haute disponibilité, migration à chaud et sauvegarde répondent à des besoins différents. Un snapshot ne remplace pas une sauvegarde.</li>
      <li>Sécurité, automatisation et supervision encadrent les opérations. Les conteneurs ont un modèle d’isolation différent des VM.</li>
      <li>Le parcours illustre le provisionnement d’une VM, l’allocation de ses ressources et son suivi.</li>
    </ol></details>
    <SourceLinks ids={['hyperv','vmware-ports','vmware-snapshots']}/>
  </section>;
}
