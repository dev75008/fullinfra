import React, { useMemo, useState } from 'react';
import { dependencyServices, dependencyLinks, dependencyKinds } from './data/microsoft365Dependencies';
import { renderDependencySvg } from './dependencySvg';
import SourceLinks from './SourceLinks';
import './microsoft365-dependencies.css';

export default function Microsoft365Dependencies() {
  const [selected,setSelected]=useState('teams');
  const [zoom,setZoom]=useState('fit');
  const svg=useMemo(() => renderDependencySvg(selected),[selected]);
  const service=dependencyServices.find(item => item.id === selected);
  const links=dependencyLinks.filter(link => !selected || link.from === selected || link.to === selected);
  const name=id => dependencyServices.find(item => item.id === id).name;
  return <section id="m365-dependencies" className="dependency-infographic" aria-labelledby="dependencies-title">
    <header><h2 id="dependencies-title">Microsoft 365 : les services et leurs dépendances</h2><p>Suivez les liens entre les identités, les groupes, les fichiers, les applications et la sécurité. Choisissez un service pour lire ses relations.</p></header>
    <div className="dependency-toolbar">
      <label>Service à explorer<select value={selected} onChange={event => setSelected(event.target.value)}><option value="">Vue d’ensemble</option>{dependencyServices.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      <label>Taille de la carte<select value={zoom} onChange={event => setZoom(event.target.value)}><option value="fit">Vue complète</option><option value="1400">Agrandir</option><option value="2000">Grande taille</option></select></label>
      <a className="button secondary" download="fullinfra-microsoft365-dependances.svg" href={`${import.meta.env.BASE_URL}infographie-microsoft365.svg`}>Télécharger l’infographie SVG</a>
    </div>
    <figure><div className="dependency-scroll" tabIndex={0} role="region" aria-label="Infographie Microsoft 365, utilisez la liste de services pour une sélection au clavier"><div className="dependency-svg" style={{width:zoom === 'fit' ? '100%' : `${zoom}px`}} aria-hidden="true" onClick={event => {const id=event.target.closest('[data-service]')?.getAttribute('data-service');if (id) setSelected(id);}} dangerouslySetInnerHTML={{__html:svg}}/></div><figcaption>Flèche A → B : A utilise B ou agit sur B pour la fonction indiquée. Les pointillés décrivent des dépendances fonctionnelles ; ils ne représentent pas les transports internes Microsoft.</figcaption></figure>
    <div className="dependency-summary" aria-live="polite"><h3>{service ? service.name : 'Vue d’ensemble des dépendances'}</h3><p>{service ? service.role : 'Tous les composants cartographiés et leurs relations.'} {links.length} relation{links.length > 1 ? 's' : ''} affichée{links.length > 1 ? 's' : ''}.</p></div>
    <div className="dependency-relations">{links.map(link => <article key={link.id}><span className="dependency-kind" style={{color:dependencyKinds[link.kind].color}}>{dependencyKinds[link.kind].label}</span><h4>{name(link.from)} → {name(link.to)}</h4><strong>{link.label}</strong><p>{link.detail}</p><SourceLinks ids={link.sourceIds}/></article>)}</div>
    <p className="protocol-note">Périmètre : 20 composants et 36 relations documentées. Cette carte couvre les principaux services et les intégrations représentées ; elle ne prétend pas inventorier toutes les applications, offres ni toutes leurs dépendances. Les exemples Planner concernent les plans de groupe. Les composants Power Platform et Copilot dépendent des offres souscrites. Les flèches ne constituent pas une matrice pare-feu.</p>
  </section>;
}
