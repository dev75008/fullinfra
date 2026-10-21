import React from 'react';
import { Link } from 'react-router-dom';
import { Server, Network, Camera, GraduationCap } from 'lucide-react';
import SourceLinks from './SourceLinks';
import { vmwareFlows } from './data/broadcomSources';

export default function VMwareSection() {
  return <section className="vmware-section" id="vmware-vsphere" aria-labelledby="vmware-title">
    <h2 id="vmware-title">VMware vSphere : administration et communications</h2>
    <p>Un volet dédié à vSphere sur site, distinct du scénario Azure VMware Solution présenté dans la carte. Les références techniques ci-dessous proviennent de Broadcom.</p>
    <div className="vmware-topics">
      <div><Server aria-hidden="true"/><h3>ESXi et vCenter</h3><p>Les flux de gestion relient vCenter Server aux hôtes ESXi. Si vous limitez les adresses autorisées dans le jeu de règles ESXi « vSphere Web Client (443, 902) », incluez les adresses nécessaires de vCenter pour éviter une déconnexion.</p><SourceLinks ids={['vmware-connectivity']}/></div>
      <div><Network aria-hidden="true"/><h3>vMotion et vSphere HA</h3><p>Les migrations vMotion et la coordination HA utilisent des échanges entre hôtes. Distinguez ces flux du trafic des applications dans les VM et du plan de gestion vCenter.</p><SourceLinks ids={['vmware-ports']}/></div>
      <div><Camera aria-hidden="true"/><h3>Snapshots et sauvegardes</h3><p>Un snapshot dépend des disques de base et ne constitue pas une sauvegarde. Contrôlez sa croissance et sa suppression après les opérations qui l’utilisent.</p><Link className="text-button" to="/virtualisation/vmware-snapshots">Lire les bonnes pratiques des snapshots</Link><SourceLinks ids={['vmware-snapshots']}/></div>
      <div><GraduationCap aria-hidden="true"/><h3>Formation officielle VMware</h3><p>Le portail VCF Learning présente les formations et certifications VMware Cloud Foundation. L’accès aux contenus dépend des droits et des offres Broadcom ; ce lien ouvre la page publique de présentation.</p><SourceLinks ids={['broadcom-education']}/></div>
    </div>
    <div className="exchange-table"><table><caption>Exemples de flux documentés pour ESXi 7.0 et 8.0</caption><thead><tr>{['Usage','Source','Destination','Protocole / port','Rôle'].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{vmwareFlows.map(row => <tr key={row.join('|')}>{row.map((cell,index) => <td key={index}>{cell}</td>)}</tr>)}</tbody></table></div>
    <p>Cette sélection ne couvre pas tous les services. Utilisez la matrice correspondant à votre version avant de modifier un pare-feu. Les ports ci-dessus ne sont pas présentés comme une validation d’ESX 9 ou de toutes les configurations VCF.</p>
    <SourceLinks ids={['vmware-ports']}/>
  </section>;
}
