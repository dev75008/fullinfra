import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, LockKeyhole, LogOut, Search, AlertCircle } from 'lucide-react';
import './ai-tools.css';

import { openCatalog } from './ai-vault.mjs';

const normalize = value => value.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLocaleLowerCase('fr').trim();

export default function AiTools() {
  const [session,setSession]=useState(null),[state,setState]=useState('locked'),[error,setError]=useState('');
  const [password,setPassword]=useState(''),[groups,setGroups]=useState([]),[domain,setDomain]=useState('all'),[query,setQuery]=useState(''),[busy,setBusy]=useState(false);
  const passwordRef=useRef(null);
  function closeSession() {setSession(null);setGroups([]);setDomain('all');setQuery('');setState('locked');}
  const generation=useRef(0);
  useEffect(()=>()=>{generation.current++;},[]);
  useEffect(()=>{if(!session)return;const timer=setTimeout(()=>{generation.current++;closeSession();setError('L’espace est verrouillé après 30 minutes.');},Math.max(0,session.expiresAt-Date.now()));return()=>clearTimeout(timer);},[session]);
  async function login(event) {
    event.preventDefault();if(busy)return;setBusy(true);setError('');
    const attempt=++generation.current, entered=password;setPassword('');
    try {
      const response=await fetch(`${import.meta.env.BASE_URL}ai-catalog.enc.json`,{cache:'no-store',credentials:'omit',signal:AbortSignal.timeout(15000)});
      if(!response.ok)throw new Error('Le catalogue chiffré est indisponible. Réessayez plus tard.');
      const catalog=await openCatalog(await response.json(),entered);
      if(attempt===generation.current){setGroups(catalog);setSession({expiresAt:Date.now()+1800000});setState('ready');}
    }catch(cause){if(attempt===generation.current){setError(cause.message);passwordRef.current?.focus();}}
    finally{if(attempt===generation.current)setBusy(false);}
  }
  function logout() {generation.current++;setBusy(false);setError('');closeSession();}
  const search=normalize(query);
  const visible=groups.filter(group=>domain==='all'||group.id===domain).map(group=>({...group,skills:group.skills.filter(skill=>normalize(`${skill.name} ${skill.summary} ${skill.usage} ${group.name}`).includes(search))})).filter(group=>group.skills.length);
  const count=visible.reduce((total,group)=>total+group.skills.length,0),total=groups.reduce((sum,group)=>sum+group.skills.length,0);
  return <main className="container listing-page ai-tools-page">
    <nav className="breadcrumb" aria-label="Fil d’Ariane"><Link to="/">Accueil</Link><ChevronRight size={14} aria-hidden="true"/><span aria-current="page">Outils IA</span></nav>
    <div className="ai-tools-heading"><div><h1>Outils IA</h1><p>Retrouvez les skills, leurs usages et les prérequis pour les utiliser dans un agent compatible.</p></div>{session&&<button className="button secondary" onClick={logout} disabled={busy}><LogOut size={17} aria-hidden="true"/> Verrouiller</button>}</div>
    {error&&<p className="ai-tools-error" role="alert"><AlertCircle size={20} aria-hidden="true"/>{error}</p>}
    {state==='locked'&&<form className="ai-login" onSubmit={login}><LockKeyhole size={32} aria-hidden="true"/><h2>Accéder aux outils IA</h2><p>Entrez le mot de passe pour déchiffrer le catalogue sur cet appareil. L’espace se verrouille après 30 minutes.</p><label htmlFor="ai-password">Mot de passe</label><input ref={passwordRef} id="ai-password" type="password" autoComplete="current-password" required maxLength={256} value={password} onChange={event=>setPassword(event.target.value)} disabled={busy}/><button className="button primary" type="submit" disabled={busy}>{busy?'Déchiffrement…':'Déverrouiller'}</button></form>}
    {state==='ready'&&<div className="ai-workspace"><nav aria-label="Filtrer les skills par domaine" className="ai-domain-navigation"><button type="button" aria-pressed={domain==='all'} onClick={()=>setDomain('all')}>Tous les domaines <span>{total}</span></button>{groups.map(group=><button key={group.id} type="button" aria-pressed={domain===group.id} onClick={()=>setDomain(group.id)}>{group.name}<span>{group.skills.length}</span></button>)}</nav><section className="ai-catalog" aria-labelledby="ai-catalog-title"><h2 id="ai-catalog-title">Catalogue des skills</h2><p className="ai-catalog-intro">Un skill fournit des instructions spécialisées à un agent IA. Ses capacités dépendent des outils, services et autorisations disponibles dans cet agent.</p><label htmlFor="ai-search">Rechercher un skill ou un usage</label><div className="ai-search-field"><Search size={20} aria-hidden="true"/><input id="ai-search" type="search" autoComplete="off" placeholder="Ex. : code, image, document, REA…" value={query} onChange={event=>setQuery(event.target.value)}/></div><p className="ai-result-count" role="status" aria-live="polite" aria-atomic="true">{count} skill{count>1?'s':''} affiché{count>1?'s':''} sur {total}</p>{visible.map(group=><section key={group.id} className="ai-skill-group" aria-labelledby={`ai-group-${group.id}`}><h3 id={`ai-group-${group.id}`}>{group.name}</h3><p>{group.description}</p><div className="ai-skill-list">{group.skills.map(skill=><details key={skill.id} className="ai-skill" name="ai-skill-details"><summary><span className="ai-skill-overview"><strong>{skill.name}</strong><span>{skill.summary}</span></span><ChevronRight size={18} aria-hidden="true"/></summary><dl><dt>Quand l’utiliser</dt><dd>{skill.usage}</dd><dt>Exemple d’utilisation</dt><dd>{skill.example}</dd><dt>Prérequis et limites</dt><dd>{skill.requirements}</dd></dl></details>)}</div></section>)}{!count&&<div className="ai-empty"><h3>Aucun skill ne correspond</h3><p>Essayez un autre terme ou effacez les filtres.</p><button className="button secondary" onClick={()=>{setQuery('');setDomain('all');}}>Effacer les filtres</button></div>}</section></div>}
  </main>;
}
