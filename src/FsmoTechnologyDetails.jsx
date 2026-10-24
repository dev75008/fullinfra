import React from 'react';
import { fsmoRoles, fsmoExamples } from './data/fsmo';
import SourceLinks from './SourceLinks';
import './fsmo.css';

export default function FsmoTechnologyDetails() {
  return <div className="fsmo-technology-details">
    <h4>Comprendre chaque rôle FSMO</h4>
    <p>Un rôle correspond à une responsabilité attribuée à un contrôleur de domaine, pas à un serveur supplémentaire. Deux rôles sont uniques dans la forêt ; les trois autres existent dans chaque domaine. Un contrôleur peut en détenir plusieurs.</p>
    {fsmoRoles.map(role => <section className="fsmo-role-detail" key={role.id}>
      <h5>{role.name}</h5>
      <p><strong>Portée :</strong> {role.scope === 'Forêt' ? 'un détenteur pour toute la forêt' : 'un détenteur dans chaque domaine'} — <code>{role.key}</code>.</p>
      <p><strong>Fonctionnement :</strong> {role.purpose}</p>
      <p><strong>Exemple concret :</strong> {fsmoExamples[role.id]}</p>
      <p><strong>Si le détenteur est indisponible :</strong> {role.impact}</p>
    </section>)}
    <h4>Consulter et administrer les rôles</h4>
    <p>Avec RSAT AD DS et le module ActiveDirectory, listez les détenteurs dans le domaine interrogé. Répétez la consultation pour chaque domaine, en incluant le domaine racine de la forêt.</p>
    <pre><code>{'Get-ADDomainController -Filter * |\n  Select-Object Name, OperationMasterRoles'}</code></pre>
    <p><strong>Avant une opération :</strong> vérifiez DNS et la réplication avec <code>repadmin /replsummary</code> et <code>dcdiag</code>. Les droits nécessaires dépendent du rôle : administrateurs du domaine pour les trois rôles de domaine ; administrateurs d’entreprise pour les noms de domaine ; administrateurs du schéma et d’entreprise pour le schéma selon la procédure Microsoft.</p>
    <p><strong>Transfert planifié :</strong> lorsque le détenteur est joignable, les consoles AD ou <code>Move-ADDirectoryServerOperationMasterRole</code> permettent de changer de détenteur. Vérifiez ensuite l’attribution et la réplication.</p>
    <p><strong>Saisie après perte du détenteur :</strong> une reprise forcée est exceptionnelle. Suivez la procédure Microsoft, traitez l’ancien contrôleur avant sa réintroduction et contrôlez la réplication. Aucun basculement FSMO automatique n’est assuré par la seule présence d’un autre contrôleur.</p>
    <h4>Communications et dépendances</h4>
    <p>FSMO ne possède pas de protocole ni de port dédié. Il dépend des services AD DS : DNS pour la découverte, Kerberos pour l’authentification, LDAP et RPC selon les opérations, et synchronisation horaire. Les outils PowerShell AD peuvent utiliser AD Web Services sur TCP 9389. Les ports AD DS sont détaillés dans le tableau ci-dessous ; ce tableau ne suffit pas à lui seul pour toutes les opérations de réplication.</p>
    <SourceLinks ids={['fsmo','fsmo-manage','fsmo-recovery','ports','replication']}/>
  </div>;
}
