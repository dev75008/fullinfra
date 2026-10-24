import React from 'react';
import './microsoft365-dependencies.css';

export default function Microsoft365Dependencies() {
  const image=`${import.meta.env.BASE_URL}microsoft365-architecture.svg?v=icones-2`;
  return <section id="m365-dependencies" className="dependency-infographic supplied-infographic" aria-labelledby="dependencies-title">
    <header><h2 id="dependencies-title">Microsoft 365 : architecture et fonctionnement</h2><p>Identité, collaboration, gestion des appareils, sécurité et données dans le cloud.</p></header>
    <figure>
      <img draggable={false} className="m365-architecture-image" src={image} width="2400" height="1800" alt="Infographie Microsoft 365 : utilisateurs et appareils, identité et accès avec Entra ID, services collaboratifs, Intune et Defender, données cloud et parcours utilisateur."/>
      <figcaption>Texte vectoriel en Segoe UI, net au zoom.</figcaption>
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
