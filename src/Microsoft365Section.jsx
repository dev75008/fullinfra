import React, { useRef, useState } from 'react';
import TechnologyIcon from './TechnologyIcon';
import SourceLinks from './SourceLinks';
import { microsoft365Topics, microsoft365Flows } from './data/microsoft365';

export default function Microsoft365Section() {
  const [expanded,setExpanded] = useState(false);
  const [flowId,setFlowId] = useState(microsoft365Flows[0].id);
  const detailsRef = useRef(null);
  const flow = microsoft365Flows.find(item => item.id === flowId);
  function toggleAll() {
    detailsRef.current.querySelectorAll('details').forEach(item => { item.open = !expanded; });
    setExpanded(!expanded);
  }
  return <>
    <section id="m365-communications" className="m365-communications" aria-labelledby="m365-communication-title">
      <h2 id="m365-communication-title">Comment les services communiquent</h2>
      <p>Choisissez un usage pour distinguer son chemin réseau des autorisations et des dépendances entre services.</p>
      <div className="m365-flow-buttons" role="group" aria-label="Scénarios Microsoft 365">{microsoft365Flows.map(item => <button key={item.id} className="button secondary" aria-pressed={flowId === item.id} onClick={() => setFlowId(item.id)}>{item.label}</button>)}</div>
      <div className="m365-flow-detail" aria-live="polite" aria-atomic="true">
        <h3>{flow.label}</h3>
        <div className="m365-flow-path"><div><span>Source</span><strong>{flow.from}</strong></div><div><span>Communication</span><strong>{flow.protocol}</strong></div><div><span>Destination</span><strong>{flow.to}</strong></div></div>
        <p>{flow.detail}</p><SourceLinks ids={flow.sourceIds}/>
      </div>
      <p className="m365-network-note">Repères pour le cloud Worldwide. Les endpoints évoluent : utilisez la liste Microsoft à jour et les prérequis du service. Ces exemples ne constituent pas une matrice exhaustive de pare-feu. Les fonctionnalités dépendent des licences et de la configuration du tenant.</p>
      <SourceLinks ids={['m365-home','m365-network']}/>
    </section>
    <section id="m365-topics" className="m365-topics" aria-labelledby="m365-topics-title" ref={detailsRef}>
      <div className="section-heading"><div><h2 id="m365-topics-title">Les douze domaines Microsoft 365</h2><p>Rôle de chaque service et points à vérifier avant le déploiement.</p></div><button className="button secondary" onClick={toggleAll}>{expanded ? 'Réduire les fiches' : 'Déployer les fiches'}</button></div>
      <div className="m365-topic-grid">{microsoft365Topics.map(topic => <details id={`microsoft-365-${topic.id}`} key={topic.id} onToggle={() => setExpanded([...detailsRef.current.querySelectorAll('details')].every(item => item.open))}>
        <summary><TechnologyIcon name={topic.icon} size={28}/><h3>{topic.title}</h3></summary>
        <div className="m365-topic-content"><p>{topic.description}</p><ul>{topic.points.map(point => <li key={point}>{point}</li>)}</ul><SourceLinks ids={topic.sourceIds}/></div>
      </details>)}</div>
    </section>
  </>;
}
