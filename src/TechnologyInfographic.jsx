import React from 'react';
import { ChevronDown } from 'lucide-react';
import TechnologyIcon from './TechnologyIcon';
import { categoryIconKeys, branchIconKeys, technologyIconKeys } from './data/technologyIcons';
import { windowsBranches } from './data/windowsBranches';
import { referenceTuples } from './data/referenceCatalog';
import './windows-infographic.css';
import SourceLinks from './SourceLinks';
import FsmoTechnologyDetails from './FsmoTechnologyDetails';

const windowsEcosystem = {slug:'windows-server',title:'Windows Server',branches:windowsBranches,sources:referenceTuples(['ad','dfs','hv-replica-config','rds','ports','rds-ports','winrm','filesync-network','arc-network']),
  subtitle:'LE SOCLE DE VOTRE INFRASTRUCTURE', note:'Les fonctionnalités disponibles dépendent de la version, de l’édition et des licences.'};

export default function TechnologyInfographic({ ecosystem = windowsEcosystem }) {
  const windowsBranches = ecosystem.branches;
  const mapId = ecosystem.slug === 'windows-server' ? 'windows-map' : `${ecosystem.slug}-map`;
  const titleId = `${mapId}-title`;
  const [expanded, setExpanded] = React.useState(false);
  const mapRef = React.useRef(null);

  function syncExpanded() {
    setExpanded([...mapRef.current.querySelectorAll('details')].every(detail => detail.open));
  }

  function toggleAll() {
    const next = !expanded;
    mapRef.current.querySelectorAll('details').forEach(detail => { detail.open = next; });
    setExpanded(next);
  }

  return (
    <section ref={mapRef} className="windows-map" id={mapId} aria-labelledby={titleId} style={{'--accent':ecosystem.accent}}>
      <div className="map-heading">
        <div>
          
          <h2 id={titleId}>Les technologies par domaine</h2>
          <p>{windowsBranches.length} domaines, {windowsBranches.reduce((count, branch) => count + branch.details.length, 0)} technologies : rôle, fonctionnement et points clés, avec un cas concret par branche.</p>
        </div>
        <button className="button secondary" onClick={toggleAll}>{expanded ? 'Réduire les détails' : 'Déployer les détails'}<ChevronDown size={16} aria-hidden="true"/></button>
      </div>

      <div className="map-root">
        <span className="map-root-icon"><TechnologyIcon name={categoryIconKeys[ecosystem.slug]} size={42}/></span>
        <div><span className="eyebrow">{ecosystem.subtitle}</span><h3>{ecosystem.title}</h3></div>
        <span className="map-root-count">12 <span>DOMAINES</span></span>
      </div>

      <div className="map-branches">
        {windowsBranches.map((branch, index) => {
          return (
            <details className="map-branch" key={branch.id} id={ecosystem.slug === 'windows-server' ? `branche-${branch.id}` : `${ecosystem.slug}-branche-${branch.id}`} onToggle={syncExpanded}>
              <summary>
                <span className="branch-top"><span className="branch-icon"><TechnologyIcon name={branchIconKeys[ecosystem.slug][branch.id]} size={32}/></span><span className="branch-number">{String(index + 1).padStart(2, '0')}</span></span>
                <h3>{branch.title}</h3>
                <span className="branch-summary">{branch.summary}</span>
                <span className="branch-action"><span className="branch-open-label">Voir les détails</span><span className="branch-close-label">Réduire</span><ChevronDown size={16} aria-hidden="true"/></span>
              </summary>
              <dl>{branch.details.map(({title, description, points, protocols, sourceIds}, technologyIndex) => (
                <div key={title}>
                  <dt><span className="technology-heading"><TechnologyIcon name={technologyIconKeys[ecosystem.slug][branch.id][technologyIndex]} size={28}/><span>{title}</span></span></dt>
                  <dd>
                    <p className="technology-description">{description}</p>
                    <ul className="technology-points">{points.map(point => {
                      const separator = point.indexOf(' : ');
                      return <li key={point}>{separator < 0 ? point : <><strong>{point.slice(0, separator)}</strong>{point.slice(separator)}</>}</li>;
                    })}</ul>
                    {ecosystem.slug === 'windows-server' && branch.id === 'active-directory' && technologyIndex === 0 && <FsmoTechnologyDetails/>}
                    <div className="technology-protocols">
                      <table>
                        <caption>Protocoles et ports — {title}</caption>
                        <thead><tr><th scope="col">Protocole / mécanisme</th><th scope="col">Transport / port</th></tr></thead>
                        <tbody>{protocols.map(([name, ports, usage]) => <React.Fragment key={name}><tr><th scope="row">{name}</th><td>{ports}</td></tr><tr className="protocol-usage"><td colSpan={2}>{usage}</td></tr></React.Fragment>)}</tbody>
                      </table>
                    </div>
                    <SourceLinks ids={sourceIds}/>
                  </dd>
                </div>
              ))}</dl>
              <div className="branch-example"><span className="eyebrow">CAS CONCRET</span><p>{branch.example}</p></div>
            </details>
          );
        })}
      </div>
      <p className="map-caption">Vue pédagogique des principaux domaines. {ecosystem.note}</p>
      <p className="protocol-note">{ecosystem.protocolNote || 'Les ports indiqués sont les ports de destination usuels, selon la configuration. Les flux de retour et les dépendances doivent aussi être pris en compte. « RPC dynamiques » désigne généralement TCP 49152–65535 sur les versions modernes de Windows Server, sauf plage ou port fixe configuré. Une technologie locale peut ne nécessiter aucun port. ESP est un protocole IP, pas le port 50. Ces repères ne constituent pas une liste de règles pare-feu à appliquer telle quelle.'}</p>
      <div className="map-sources"><span>Documentation officielle :</span>{ecosystem.sources.map(([label, url]) => <a key={label} href={url}>{label}</a>)}</div>
    </section>
  );
}
