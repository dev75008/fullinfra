import React from 'react';
import './microsoft365-dependencies.css';

export default function Microsoft365Dependencies() {
  const image=`${import.meta.env.BASE_URL}microsoft365-architecture.svg?v=icones-2`;
  const png=`${import.meta.env.BASE_URL}microsoft365-architecture-hd.png?v=icones-2`;
  return <section id="m365-dependencies" className="dependency-infographic supplied-infographic" aria-labelledby="dependencies-title">
    <header><h2 id="dependencies-title">Microsoft 365 : architecture et fonctionnement</h2><p>Identité, collaboration, gestion des appareils, sécurité et données dans le cloud.</p></header>
    <div className="dependency-toolbar">
      <a className="button primary" href={image} target="_blank" rel="noopener noreferrer">Ouvrir l’image en grand</a>
      <a className="button secondary" href={png} download="fullinfra-microsoft365-architecture-hd.png">Télécharger le PNG haute résolution</a>
      <a className="button secondary" href={image} download="fullinfra-microsoft365-architecture.svg">Télécharger le SVG</a>
    </div>
    <figure>
      <a href={image} target="_blank" rel="noopener noreferrer" aria-label="Agrandir l’infographie Microsoft 365 dans un nouvel onglet"><img className="m365-architecture-image" src={image} width="2400" height="1800" alt="Infographie Microsoft 365 : utilisateurs et appareils, identité et accès avec Entra ID, services collaboratifs, Intune et Defender, données cloud et parcours utilisateur."/></a>
      <figcaption>Texte vectoriel en Segoe UI, net au zoom. Ouvrez l’image en grand pour lire les détails, ou téléchargez le PNG haute résolution.</figcaption>
    </figure>
    <details className="infographic-transcript"><summary>Lire le résumé de l’infographie</summary><ol>
      <li><strong>Utilisateurs :</strong> collaborateurs et administrateurs, sur mobiles, PC Windows, Mac ou navigateur.</li>
      <li><strong>Identité et accès :</strong> Entra ID, authentification, MFA, accès conditionnel et rôles.</li>
      <li><strong>Collaboration :</strong> Outlook, Exchange Online, Teams, SharePoint, OneDrive, Word, Excel, PowerPoint, OneNote et Copilot.</li>
      <li><strong>Appareils et sécurité :</strong> gestion des appareils et applications avec Intune, protection contre les menaces avec Defender.</li>
      <li><strong>Données :</strong> messagerie, documents et fichiers dans les services cloud Microsoft.</li>
      <li><strong>Parcours illustré :</strong> connexion, vérifications d’accès et de sécurité, utilisation des services et stockage des données.</li>
    </ol></details>
  </section>;
}
