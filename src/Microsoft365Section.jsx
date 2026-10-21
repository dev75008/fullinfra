import React, { useRef, useState } from 'react';
import TechnologyIcon from './TechnologyIcon';
import SourceLinks from './SourceLinks';
import { microsoft365Topics } from './data/microsoft365';
import { microsoft365CommunicationMap } from './data/microsoft365Communications';
import CommunicationMap from './CommunicationMap';
import Microsoft365Dependencies from './Microsoft365Dependencies';

export default function Microsoft365Section() {
  const [expanded,setExpanded] = useState(false);
  const detailsRef = useRef(null);
  function toggleAll() {
    detailsRef.current.querySelectorAll('details').forEach(item => { item.open = !expanded; });
    setExpanded(!expanded);
  }
  return <>
    <Microsoft365Dependencies/>
    <details id="m365-communications" className="m365-network-map"><summary>Carte des accès réseau et des protocoles Microsoft 365</summary>
      <CommunicationMap ecosystem={microsoft365CommunicationMap}/>
      <p className="protocol-note">Repères pour le cloud Worldwide. Les endpoints évoluent : consultez la liste Microsoft à jour et les prérequis de chaque service. Les liens logiques ne décrivent pas les transports internes Microsoft. La carte ne constitue pas une matrice exhaustive de pare-feu ; les fonctionnalités dépendent des licences et de la configuration du tenant.</p>
      <SourceLinks ids={['m365-home','m365-network']}/>
    </details>
    <section id="m365-topics" className="m365-topics" aria-labelledby="m365-topics-title" ref={detailsRef}>
      <div className="section-heading"><div><h2 id="m365-topics-title">Les douze domaines Microsoft 365</h2><p>Rôle de chaque service et points à vérifier avant le déploiement.</p></div><button className="button secondary" onClick={toggleAll}>{expanded ? 'Réduire les fiches' : 'Déployer les fiches'}</button></div>
      <div className="m365-topic-grid">{microsoft365Topics.map(topic => <details id={`microsoft-365-${topic.id}`} key={topic.id} onToggle={() => setExpanded([...detailsRef.current.querySelectorAll('details')].every(item => item.open))}>
        <summary><TechnologyIcon name={topic.icon} size={28}/><h3>{topic.title}</h3></summary>
        <div className="m365-topic-content"><p>{topic.description}</p><ul>{topic.points.map(point => <li key={point}>{point}</li>)}</ul><SourceLinks ids={topic.sourceIds}/></div>
      </details>)}</div>
    </section>
  </>;
}
