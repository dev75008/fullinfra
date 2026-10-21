import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock3, Network } from 'lucide-react';
import { categories } from './data/content';
import TechnologyIcon from './TechnologyIcon';
import { categoryIconKeys } from './data/technologyIcons';

export function Logo() { return <Link to="/" className="logo" aria-label="FullInfra, accueil"><span className="logo-symbol"><Network size={22}/></span>full<span>infra<span className="logo-dot">.</span></span></Link>; }
export function CategoryCard({ category }) {
  return <Link to={`/${category.slug}`} className={`category-card ${category.color}`}>
    <div className="card-top"><span className="icon-box"><TechnologyIcon name={categoryIconKeys[category.slug]} size={48}/></span></div>
    <h3>{category.name}</h3><p>{category.description}</p>
    <div className="tags">{category.topics.map(topic => <span key={topic}>{topic}</span>)}</div>
    <div className="card-bottom">Voir les ressources <ArrowUpRight size={20} aria-hidden="true"/></div>
  </Link>;
}
export function ArticleCard({ article }) { const category = categories.find(c => c.slug === article.category); return <Link className={`article-card ${category.color}`} to={`/${article.category}/${article.slug}`}><div className={`article-art ${category.icon}`} aria-hidden="true"><TechnologyIcon className="art-icon" name={({'active-directory-fondations':'directory','hyper-v-commutateurs':'hyperv','azure-premiere-vm':'vm','powershell-inventaire':'powershell','vmware-snapshots':'server','azure-gouvernance':'resource-group'})[article.slug] || categoryIconKeys[category.slug]} size={76}/><span className="art-badge">{article.topic}</span></div><div className="article-info"><div className="article-meta"><span>{category.name}</span><span><Clock3 size={12}/> {article.minutes} min</span></div><h3>{article.title}</h3><p>{article.excerpt}</p><div className="read-link">Lire le guide <ArrowUpRight size={17}/></div></div></Link>; }
