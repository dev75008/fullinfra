import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search, BookOpen, ChevronRight } from 'lucide-react';
import { articles, categories } from './data/content';
import { CategoryCard, ArticleCard } from './components';
import TechnologyIcon from './TechnologyIcon';

export default function Home() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  function search(event) {
    event.preventDefault();
    navigate(query.trim() ? `/guides?recherche=${encodeURIComponent(query.trim())}` : '/guides');
  }
  return <>
    <section className="support-hero">
      <div className="container">
        
        <h1>Comprendre votre infrastructure.</h1>
        <p className="support-hero-description">Des réponses claires sur Windows Server, la virtualisation,<br className="desktop-break"/> Azure, Microsoft 365 et l’adressage réseau.</p>
        <label className="home-search-label" htmlFor="home-guide-search">Quel sujet souhaitez-vous explorer ?</label>
        <form className="home-search" onSubmit={search} role="search" aria-label="Rechercher dans les guides">
          <Search size={23} aria-hidden="true"/>
          <input id="home-guide-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Active Directory, VMware, Teams…"/>
          <button type="submit" aria-label="Lancer la recherche"><ArrowRight size={23}/></button>
        </form>
        <div className="hero-suggestions"><span>Pour commencer :</span><Link to="/windows-server">Windows Server</Link><Link to="/virtualisation">Virtualisation</Link><Link to="/azure">Azure</Link><Link to="/microsoft-365">Microsoft 365</Link><Link to="/adressage-reseau">Adressage réseau</Link></div>
      </div>
    </section>

    <section className="container product-shortcuts" aria-label="Accès aux technologies">
      {[
        ['windows-server','Windows Server','/windows-server'],
        ['directory','Active Directory','/windows-server#branche-active-directory'],
        ['hyperv','Hyper-V','/virtualisation'],
        ['powershell','PowerShell','/windows-server#branche-powershell'],
        ['azure','Microsoft Azure','/azure'],
        ['vm','Machines virtuelles','/azure#azure-branche-calcul'],
      ].map(([icon,label,url]) => <Link to={url} key={label}><TechnologyIcon name={icon} size={48}/><span>{label}</span><ChevronRight size={14} aria-hidden="true"/></Link>)}
    </section>

    <section className="section container" id="rubriques">
      <div className="section-heading"><div><h2>Choisissez votre environnement</h2></div><p>Retrouvez les services, leurs protocoles<br/>et les guides de chaque rubrique.</p></div>
      <div className="category-grid">{categories.map((category,index) => <CategoryCard category={category} index={index} key={category.slug}/>)}</div>
    </section>

    <section className="section guides-section"><div className="container">
      <div className="section-heading"><div><h2>Un point de départ par environnement</h2></div><Link className="text-button" to="/guides">Tous les guides <ArrowRight size={17}/></Link></div>
      <div className="article-grid featured-guides">{categories.map(category => articles.find(article => article.category === category.slug)).filter(Boolean).map(article => <ArticleCard article={article} key={article.slug}/>)}</div>
    </div></section>

    <section className="container lab-banner"><span className="banner-icon"><BookOpen size={36}/></span><div><h2>Suivez le chemin d’une communication</h2><p>Partez d’une connexion utilisateur, identifiez les services sollicités et consultez les protocoles associés.</p></div><Link className="button primary" to="/windows-server">Explorer Windows Server <ArrowRight size={18}/></Link></section>
  </>;
}
