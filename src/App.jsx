import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Routes, Route, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Search, Menu, X, ChevronRight, BookOpen, Clock3, Network } from 'lucide-react';
import { articles, categories } from './data/content';
import { Logo, ArticleCard } from './components';
import WindowsInfographic from './WindowsInfographic';
import WindowsArchitecture from './WindowsArchitecture';
import VirtualisationArchitecture from './VirtualisationArchitecture';
import AzureArchitecture from './AzureArchitecture';
import TechnologyInfographic from './TechnologyInfographic';
import { ecosystems } from './data/ecosystems';
import SourceLinks from './SourceLinks';
import Home from './Home';
import TechnologyIcon from './TechnologyIcon';
import VMwareSection from './VMwareSection';
import Microsoft365Section from './Microsoft365Section';
import { categoryIconKeys } from './data/technologyIcons';

function RouteEffects() {
  const { pathname, hash } = useLocation();
  const previousPath = useRef(pathname);
  useEffect(() => {
    const article = articles.find(item => pathname === `/${item.category}/${item.slug}`);
    const category = categories.find(item => pathname === '/' + item.slug);
    document.title = `${article?.title || category?.name || (pathname === '/guides' ? 'Tous les guides' : pathname === '/' ? 'Comprendre votre infrastructure' : 'Page introuvable')} — FullInfra`;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = article?.excerpt || category?.description || 'Guides Windows Server, VMware, Azure et Microsoft 365 : services, protocoles et administration.';
    if (previousPath.current !== pathname) document.getElementById('content')?.focus({preventScroll:true});
    previousPath.current = pathname;
    let target = null;
    try { target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null; } catch { /* Une ancre mal encodée ne bloque pas la navigation. */ }
    if (target) {
      if (target.tagName === 'DETAILS') target.open = true;
      target.scrollIntoView({block:'start'});
    } else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}
function Header() {
  const [open,setOpen] = useState(false);
  const toggleRef = useRef(null);
  const location = useLocation();
  useEffect(() => setOpen(false),[location.pathname,location.search,location.hash]);
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event) {
      if (event.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); }
    }
    document.addEventListener('keydown',onKeyDown);
    return () => document.removeEventListener('keydown',onKeyDown);
  },[open]);
  return <header className="site-header"><div className="container header-inner">
    <Logo/><button ref={toggleRef} className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="main-nav" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}>{open ? <X aria-hidden="true"/> : <Menu aria-hidden="true"/>}</button>
    <nav id="main-nav" className={open ? 'open' : ''} aria-label="Navigation principale" onClick={event => { if (event.target.closest('a')) setOpen(false); }}>
      <NavLink to="/" end>Accueil</NavLink>{categories.map(category => <NavLink key={category.slug} to={`/${category.slug}`}>{category.name}</NavLink>)}
      <NavLink className="mobile-guides-link" to="/guides">Tous les guides</NavLink>
    </nav><Link className="header-cta" to="/guides">Tous les guides <ArrowUpRight size={16} aria-hidden="true"/></Link>
  </div></header>;
}
function Footer() { return <footer><div className="container"><div className="footer-main"><div><Logo/><p>Guides pour administrer vos systèmes et services cloud.</p></div><div className="footer-links"><Link to="/guides">Tous les guides</Link><Link to="/">Accueil</Link>{categories.map(c => <Link key={c.slug} to={`/${c.slug}`}>{c.name}</Link>)}</div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} FullInfra. Construit pour apprendre.</span><span>Windows · Virtualisation · Azure · Microsoft 365 <span className="status-dot"/></span></div></div></footer>; }
function GuideList({ category }) {
  const [searchParams,setSearchParams] = useSearchParams();
  const query = searchParams.get('recherche') || '';
  const scopedArticles = articles.filter(article => !category || article.category === category.slug);
  const filters = category
    ? [...new Set(scopedArticles.map(article => article.topic))].map(topic => ({value:topic,label:topic}))
    : categories.map(item => ({value:item.slug,label:item.name}));
  const requestedFilter = searchParams.get('filtre') || 'all';
  const filter = filters.some(item => item.value === requestedFilter) ? requestedFilter : 'all';
  const normalize = value => value.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLocaleLowerCase('fr').trim();
  const results = scopedArticles.filter(article => (filter === 'all' || article.topic === filter || article.category === filter)
    && normalize(`${article.title} ${article.excerpt} ${article.topic} ${categories.find(item => item.slug === article.category).name}`).includes(normalize(query)));
  function updateParameter(name,value) {
    setSearchParams(previous => { const next = new URLSearchParams(previous); if (value && value !== 'all') next.set(name,value); else next.delete(name); return next; },{replace:true});
  }
  return <section id="guides-rubrique" className="guide-list" aria-labelledby="guide-list-title">
    <h2 id="guide-list-title">{category ? `Guides ${category.name}` : 'Parcourir les guides'}</h2>
    <div className="list-toolbar">
      <div className="filter-tabs" role="group" aria-label="Filtrer les guides"><button aria-pressed={filter === 'all'} className={filter === 'all' ? 'selected' : ''} onClick={() => updateParameter('filtre','all')}>Tous les guides</button>{filters.map(item => <button key={item.value} aria-pressed={filter === item.value} className={filter === item.value ? 'selected' : ''} onClick={() => updateParameter('filtre',item.value)}>{item.label}</button>)}</div>
      <div className="catalogue-search"><label htmlFor="guide-search">Rechercher un guide</label><div className="search-box"><Search size={17} aria-hidden="true"/><input id="guide-search" type="search" value={query} onChange={event => updateParameter('recherche',event.target.value)} placeholder="Un sujet, un service…"/></div></div>
    </div>
    <p className="result-count" aria-live="polite" aria-atomic="true">{results.length} guide{results.length > 1 ? 's' : ''} disponible{results.length > 1 ? 's' : ''}</p>
    <div className="article-grid">{results.map(article => <ArticleCard key={article.slug} article={article}/>)}</div>
    {results.length === 0 && <div className="empty-state"><Search size={32} aria-hidden="true"/><h3>Aucun guide ne correspond à votre recherche</h3><p>Essayez « Hyper-V », « Azure » ou « Teams », ou effacez les filtres.</p><button className="button secondary" onClick={() => setSearchParams({},{replace:true})}>Effacer la recherche et les filtres</button></div>}
  </section>;
}
function Guides() {
  const { category:slug } = useParams();
  const category = categories.find(item => item.slug === slug);
  if (slug && !category) return <NotFound/>;
  const sections = slug === 'microsoft-365'
    ? [['m365-dependencies','Infographie des dépendances'],['m365-communications','Accès et protocoles'],['m365-topics','Fiches services']]
    : slug ? [[slug === 'windows-server' ? 'windows-map' : `${slug}-map`,'Fiches technologies']] : [];
  if (slug === 'virtualisation') sections.push(['vmware-vsphere','VMware vSphere']);
  if (slug === 'windows-server') sections.unshift(['windows-architecture','Infographie de l’architecture']);
  if (slug === 'virtualisation') sections.unshift(['virtualisation-architecture','Infographie de l’architecture']);
  if (slug === 'azure') sections.unshift(['azure-architecture','Infographie de l’architecture']);
  return <main className="container listing-page">
    <nav className="breadcrumb" aria-label="Fil d’Ariane"><Link to="/">Accueil</Link><ChevronRight size={14} aria-hidden="true"/><span aria-current="page">{category?.name || 'Tous les guides'}</span></nav>
    <section className={`page-intro ${category?.color || 'green'}`}><span className="icon-box"><TechnologyIcon name={category ? categoryIconKeys[slug] : 'guides'} size={60}/></span><h1>{category?.name || 'Tous les guides'}</h1><p>{category?.description || 'Recherchez un sujet ou choisissez un environnement pour retrouver un guide.'}</p></section>
    {category && <nav className="section-navigation" aria-label="Dans cette rubrique">{[...sections,['guides-rubrique','Guides pratiques']].map(([id,label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>}
    {slug === 'windows-server' && <><WindowsArchitecture/><WindowsInfographic/></>}
    {slug === 'virtualisation' && <VirtualisationArchitecture/>}
    {slug === 'azure' && <AzureArchitecture/>}
    {ecosystems[slug] && <TechnologyInfographic key={`map-${slug}`} ecosystem={ecosystems[slug]}/>}
    {slug === 'virtualisation' && <VMwareSection/>}{slug === 'microsoft-365' && <Microsoft365Section/>}
    <GuideList key={`guides-${slug || 'all'}`} category={category}/>
  </main>;
}
function Article() { const { category: slug, article: articleSlug } = useParams(); const article = articles.find(a => a.slug === articleSlug && a.category === slug); if (!article) return <NotFound/>; const category = categories.find(c => c.slug === slug); return <main className="container article-page"><div className="breadcrumb"><Link to="/">Accueil</Link><ChevronRight size={14}/><Link to={`/${slug}`}>{category.name}</Link><ChevronRight size={14}/><span>Le guide</span></div><div className={`article-title ${category.color}`}><span className="pill">{category.name} / {article.level}</span><h1>{article.title}</h1><p>{article.excerpt}</p><div className="reading-meta"><Clock3 size={15}/> {article.minutes} min de lecture <span>·</span> {new Date(article.date + 'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}</div></div><div className="article-layout"><aside className="article-aside"><h2>Dans ce guide</h2>{article.sections.map(([title], i) => <a key={title} href={`#etape-${i}`}><span>0{i+1}</span>{title}</a>)}</aside><article className="prose"><div className="note"><BookOpen size={20}/><p>Les fonctionnalités et paramètres dépendent de votre environnement. Consultez les références du guide et testez vos changements avant le déploiement.</p></div>{article.sections.map(([title, text], i) => <section id={`etape-${i}`} key={title}><h2>{title}</h2><p>{text}</p></section>)}<SourceLinks ids={article.sourceIds}/><Link className="button secondary" to={`/${slug}`}>Tous les guides {category.name} <ArrowRight size={17}/></Link></article></div><section className="related"><h2>Explorez aussi</h2><div className="article-grid">{articles.filter(a => a.category === slug && a.slug !== article.slug).map(a => <ArticleCard article={a} key={a.slug}/>)}</div></section></main>; }
function NotFound() { return <main className="container empty-state not-found"><div className="eyebrow">ERREUR 404</div><h1>Page introuvable.</h1><p>Le lien est incorrect ou la page a été déplacée. Retrouvez les rubriques depuis l’accueil.</p><Link className="button primary" to="/">Retour à l’accueil <ArrowRight size={18}/></Link></main>; }
export default function App() { return <><RouteEffects/><a href="#content" className="skip-link">Aller au contenu</a><Header/><div id="content" tabIndex={-1}><Routes><Route path="/" element={<main><Home/></main>}/><Route path="/guides" element={<Guides/>}/><Route path="/:category" element={<Guides/>}/><Route path="/:category/:article" element={<Article/>}/><Route path="*" element={<NotFound/>}/></Routes></div><Footer/></>; }
