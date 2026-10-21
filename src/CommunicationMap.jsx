import React, { useEffect, useId, useRef, useState } from 'react';
import { Users, ArrowRight, RotateCcw, MoveHorizontal } from 'lucide-react';
import { communicationNodes, communicationEdges, communicationScenarios } from './data/windowsCommunications';
import { selectEcosystemEdges } from './data/ecosystemModel';
import './windows-communications.css';
import SourceLinks from './SourceLinks';
import TechnologyIcon from './TechnologyIcon';
import { categoryIconKeys, branchIconKeys } from './data/technologyIcons';

function ExchangeTable({ exchanges }) {
  if (!exchanges) return null;
  return <div className="exchange-table"><table><caption>Extrémités et sauts du scénario</caption><thead><tr><th scope="col">Initiateur</th><th scope="col">Destination</th><th scope="col">Transport et condition</th></tr></thead><tbody>{exchanges.map(([from,to,protocol]) => <tr key={`${from}-${to}`}><td>{from}</td><td>{to}</td><td>{protocol}</td></tr>)}</tbody></table></div>;
}

const windowsEcosystem = {
  slug: 'windows-server', title: 'Windows Server', hubTitle: ['Windows', 'Server'],
  intro: 'Du poste utilisateur au cloud : suivez les échanges entre les douze branches de Windows Server.',
  clientLabel: 'Postes · VM · Admins', nodes: communicationNodes, edges: communicationEdges, scenarios: communicationScenarios,
  ringLabel: 'IDENTITÉ · CONNECTIVITÉ · PROTECTION · CONTINUITÉ',
};

// Courbes ancrées au bord des cartes ; les flux parallèles gardent des tracés distincts.
function edgeGeometry(edge, nodeById, communicationEdges) {
  const a = nodeById[edge.from];
  const b = nodeById[edge.to];
  const dx = b.x - a.x, dy = b.y - a.y;
  const parallel = communicationEdges.filter(item => item.from === edge.from && item.to === edge.to);
  const offset = (parallel.findIndex(item => item.id === edge.id) - (parallel.length - 1) / 2) * 85;
  const distance = Math.hypot(dx, dy);
  const cx = (a.x + b.x) / 2 - dy / distance * (35 + offset);
  const cy = (a.y + b.y) / 2 + dx / distance * (35 + offset);
  function boundary(node, targetX, targetY) {
    const x = targetX - node.x, y = targetY - node.y;
    const t = node.id === 'clients' ? 102 / Math.hypot(x, y) : Math.min(101 / Math.max(Math.abs(x), .01), 51 / Math.max(Math.abs(y), .01));
    return [node.x + x * t, node.y + y * t];
  }
  const start = boundary(a, cx, cy), end = boundary(b, cx, cy);
  return { path: `M ${start[0]} ${start[1]} Q ${cx} ${cy} ${end[0]} ${end[1]}`, labelX: (start[0] + 2 * cx + end[0]) / 4, labelY: (start[1] + 2 * cy + end[1]) / 4 };
}

export default function CommunicationMap({ ecosystem = windowsEcosystem }) {
  const { nodes: communicationNodes, edges: communicationEdges, scenarios: communicationScenarios } = ecosystem;
  const nodeById = Object.fromEntries(communicationNodes.map(node => [node.id, node]));
  const titleId = ecosystem.slug === 'windows-server' ? 'communication-title' : `${ecosystem.slug}-communication-title`;
  const [scenarioId, setScenarioId] = useState('all');
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const explanationRef = useRef(null);
  const markerId = useId().replace(/:/g, '');
  const scenario = communicationScenarios.find(item => item.id === scenarioId);
  const edges = selectEcosystemEdges(ecosystem, scenarioId, selectedNode);
  const activeNodes = new Set(edges.flatMap(edge => [edge.from, edge.to]));
  const focusedEdge = edges.find(edge => edge.id === selectedEdge);
  useEffect(() => {
    if (selectedEdge) explanationRef.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }, [selectedEdge]);

  function chooseScenario(id) { setScenarioId(id); setSelectedNode(null); setSelectedEdge(null); }
  function chooseNode(id) { setScenarioId('all'); setSelectedNode(selectedNode === id ? null : id); setSelectedEdge(null); }
  function reset() { chooseScenario('all'); }
  function openBranchDetails(event) {
    const details = document.getElementById(event.currentTarget.hash.slice(1));
    if (!details) return;
    event.preventDefault();
    details.open = true;
    details.querySelector('summary')?.focus({preventScroll:true});
    details.scrollIntoView({block:'start'});
  }

  return (
    <section id={ecosystem.slug === 'windows-server' ? 'windows-communications' : `${ecosystem.slug}-communications`} className="communication-map" data-ecosystem={ecosystem.slug} aria-labelledby={titleId} style={{'--map-cyan':ecosystem.accent}}>
      <div className="communication-heading">
        
        <h2 id={titleId}>Les échanges entre services</h2>
        <p>{ecosystem.intro}</p>
        <span className="communication-version">CARTE PÉDAGOGIQUE <span/> {ecosystem.title.toUpperCase()}</span>
      </div>

      <div className="communication-controls" role="group" aria-label="Choisir un scénario de communication">
        {communicationScenarios.map(item => <button key={item.id} aria-pressed={scenarioId === item.id && !selectedNode} className={scenarioId === item.id && !selectedNode ? 'is-active' : ''} onClick={() => chooseScenario(item.id)}>{item.label}</button>)}
        <button className="communication-reset" onClick={reset} aria-label="Réinitialiser la carte"><RotateCcw size={15}/> Réinitialiser</button>
      </div>
      <div className="communication-context" aria-live="polite"><span className="status-dot"/><p>{selectedNode ? `Relations de ${nodeById[selectedNode].label} — sélectionnez un flux pour en lire le détail.` : scenario.description}</p><span>{edges.length} relations</span></div>

      <p className="communication-mobile-hint"><MoveHorizontal size={16}/> Faites défiler la carte horizontalement ou utilisez la liste des flux ci-dessous.</p>
      <div className="communication-scroll" tabIndex={0} role="region" aria-label="Carte mentale des communications, défilement horizontal sur petit écran">
        <div className="communication-canvas">
          <div className="communication-ring ring-outer" aria-hidden="true"/>
          <div className="communication-ring ring-inner" aria-hidden="true"/>
          <span className="communication-ring-label" aria-hidden="true">{ecosystem.ringLabel}</span>
          <svg className="communication-lines" viewBox="0 0 1000 860" aria-hidden="true">
            <defs><marker id={markerId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke"/></marker></defs>
            {[...edges].sort((a,b) => Number(a.id === selectedEdge) - Number(b.id === selectedEdge)).map(edge => {
              const geometry = edgeGeometry(edge, nodeById, communicationEdges);
              return <g key={edge.id} className={`communication-line ${edge.kind} ${selectedEdge && edge.id !== selectedEdge ? 'is-muted' : ''} ${edge.id === selectedEdge ? 'is-focused' : ''}`} style={{'--flow-color': nodeById[edge.from].color}}>
                <path d={geometry.path} markerEnd={`url(#${markerId})`}/>
                <path className="line-hit-target" d={geometry.path} onClick={() => setSelectedEdge(edge.id)}/>
                {edge.id === selectedEdge && <g className="flow-label"><rect x={geometry.labelX - 96} y={geometry.labelY - 13} width="192" height="26" rx="5"/><text x={geometry.labelX} y={geometry.labelY + 4} textAnchor="middle">{edge.label}</text></g>}
              </g>;
            })}
          </svg>
          {communicationNodes.map((node, index) => {
            const isClient = node.id === 'clients';
            return <button key={node.id} className={`communication-node ${isClient ? 'communication-hub' : ''} ${selectedNode === node.id ? 'is-selected' : ''} ${!activeNodes.has(node.id) ? 'is-dimmed' : ''}`} style={{left:`${node.x / 10}%`, top:`${node.y / 8.6}%`, '--node-color':node.color}} aria-pressed={selectedNode === node.id} aria-label={`Afficher les relations : ${node.label}`} onClick={() => chooseNode(node.id)}>
              {isClient ? <><TechnologyIcon name={categoryIconKeys[ecosystem.slug]} size={42}/><span className="hub-title">{ecosystem.hubTitle.map((line,index) => <React.Fragment key={line}>{index > 0 && <br/>}{line}</React.Fragment>)}</span><span className="hub-subtitle">ÉCOSYSTÈME</span><span className="hub-clients"><Users size={13}/> {ecosystem.clientLabel}</span></> : <><span className="communication-node-top"><span className="communication-node-number">{String(index + 1).padStart(2,'0')}</span><TechnologyIcon name={ecosystem.branchIcons?.[node.id] || branchIconKeys[ecosystem.slug]?.[node.id]} size={30}/></span><strong>{node.label}</strong><span className="communication-node-service">{node.service}</span></>}
            </button>;
          })}
          <div className="canvas-footer"><span>12 BRANCHES / {communicationEdges.length} RELATIONS PRINCIPALES</span><span>CLIQUER POUR EXPLORER <ArrowRight size={12}/></span></div>
        </div>
      </div>
      <div className="communication-legend"><span><i className="legend-network"/> Flux réseau : initiateur → service</span><span><i className="legend-logical"/> Relation logique, hébergement ou politique</span><span>Les réponses empruntent le flux de retour.</span></div>

      <div className="communication-reading">
        <div className="communication-flow-header"><div><h3>{selectedNode ? nodeById[selectedNode].label : scenario.label}</h3></div>{selectedNode && selectedNode !== 'clients' && <a onClick={openBranchDetails} href={ecosystem.branchAnchorPrefix ? `#${ecosystem.branchAnchorPrefix}${selectedNode}` : ecosystem.slug === 'windows-server' ? `#branche-${selectedNode}` : `#${ecosystem.slug}-branche-${selectedNode}`}>Détails de la branche <ArrowRight size={15}/></a>}</div>
        {focusedEdge ? <div ref={explanationRef} className="communication-explanation" aria-live="polite"><span className="eyebrow">{focusedEdge.kind === 'network' ? 'FLUX RÉSEAU' : 'RELATION LOGIQUE'}</span><h4>{focusedEdge.label}</h4><p><strong>{nodeById[focusedEdge.from].label}</strong> <ArrowRight size={14}/> <strong>{nodeById[focusedEdge.to].label}</strong></p><code>{focusedEdge.protocol}</code><p>{focusedEdge.detail}</p><ExchangeTable exchanges={focusedEdge.exchanges}/><SourceLinks ids={focusedEdge.sourceIds}/><button onClick={() => setSelectedEdge(null)}>Retirer la sélection</button></div> : <p className="communication-instruction">Cliquez sur une relation ci-dessous pour afficher son rôle, ses conditions et ses protocoles.</p>}

        {scenario.steps.length > 0 && !selectedNode && <div className="communication-timeline"><h4>{scenario.independent || scenarioId === 'operations' ? 'Opérations indépendantes' : 'Exemple de déroulement simplifié'}</h4><ol>{scenario.steps.map(([edgeId, text]) => { const edge = communicationEdges.find(item => item.id === edgeId); return <li key={edgeId}><button onClick={() => setSelectedEdge(edgeId)}><span>{text}</span><code>{edge.protocol}</code></button></li>; })}</ol></div>}

        <div className="communication-flow-list" role="group" aria-label="Relations visibles sur la carte">{edges.map(edge => <button key={edge.id} className={`communication-flow ${selectedEdge === edge.id ? 'is-selected' : ''}`} aria-pressed={selectedEdge === edge.id} onClick={() => setSelectedEdge(edge.id)}><span className="flow-endpoints"><span>{nodeById[edge.from].label}</span><ArrowRight size={14}/><span>{nodeById[edge.to].label}</span></span><strong>{edge.label}</strong><span className={`flow-kind ${edge.kind}`}>{edge.kind === 'network' ? 'RÉSEAU' : 'LOGIQUE'}</span><span className="flow-protocol">{edge.protocol}</span></button>)}</div>
      </div>
      <div className="communication-disclaimer"><strong>Comment lire la carte ?</strong> Le centre représente l’écosystème ; les flèches qui en partent correspondent aux demandes des acteurs indiqués au centre. Les autres flèches relient les services des branches. Une branche peut regrouper plusieurs serveurs et des services cloud. Ce sont des scénarios représentatifs : toutes les branches ne communiquent pas directement entre elles. Les options, flux internes à une branche et dépendances supplémentaires sont précisés dans les détails ; cette carte ne constitue pas une matrice pare-feu exhaustive.</div>
    </section>
  );
}
