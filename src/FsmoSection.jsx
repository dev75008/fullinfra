import React from 'react';
import { fsmoRoles } from './data/fsmo';
import SourceLinks from './SourceLinks';
import './fsmo.css';

export default function FsmoSection() {
  return <section id="windows-fsmo" className="fsmo-section" aria-labelledby="fsmo-title">
    <header><h2 id="fsmo-title">Active Directory : les cinq rôles FSMO</h2><p>AD DS réplique généralement les modifications entre contrôleurs. Certaines opérations restent confiées à un détenteur unique : deux rôles par forêt et trois par domaine.</p></header>
    <div className="fsmo-grid">{fsmoRoles.map(role => <article key={role.id} id={`fsmo-${role.id}`}><span className="pill">{role.scope === 'Forêt' ? 'Un par forêt' : 'Un par domaine'}</span><h3>{role.name}</h3><code>{role.key}</code><p>{role.purpose}</p><p><strong>En cas d’indisponibilité :</strong> {role.impact}</p></article>)}</div>
    <div className="fsmo-operations"><h3>Identifier les détenteurs et préparer un changement</h3><p>Sur un poste disposant des outils RSAT AD DS et du module ActiveDirectory, cette commande de lecture liste les contrôleurs du domaine et leurs rôles. Répétez la vérification dans chaque domaine, dont le domaine racine pour les rôles de forêt.</p><pre><code>{'Get-ADDomainController -Filter * |\n  Select-Object Name, OperationMasterRoles'}</code></pre>
      <p>Vérifiez DNS, la réplication et l’état des contrôleurs avec <code>repadmin /replsummary</code> et <code>dcdiag</code>. Plusieurs rôles peuvent être portés par le même serveur ; un second contrôleur ne devient pas automatiquement détenteur à sa panne.</p>
      <h3>Transfert planifié ou saisie après panne</h3><p><strong>Transfert :</strong> le détenteur actuel est joignable. Utilisez les consoles AD ou <code>Move-ADDirectoryServerOperationMasterRole</code> avec les droits requis pour le rôle, puis vérifiez le nouveau détenteur et la réplication.</p>
      <p><strong>Saisie :</strong> reprise exceptionnelle d’un rôle lorsque son détenteur est perdu et ne doit pas revenir en service en l’état. Suivez la procédure Microsoft et traitez l’ancien contrôleur avant toute réintroduction. Le paramètre <code>-Force</code> ne sert pas à un transfert ordinaire.</p>
      <h3>Protocoles et dépendances</h3><p>FSMO ne possède pas de port réseau dédié. Les opérations s’appuient sur AD DS : DNS, LDAP et RPC selon l’opération, authentification Kerberos et synchronisation horaire. Les outils PowerShell AD peuvent utiliser AD Web Services sur TCP 9389. Consultez les matrices de ports avant de définir les règles réseau.</p>
    </div>
    <SourceLinks ids={['fsmo','fsmo-manage','fsmo-recovery','replication','ports']}/>
  </section>;
}
