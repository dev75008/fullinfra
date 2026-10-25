import { articles, categories } from './data/content';

export const siteUrl = 'https://fullinfra.duckdns.org';
export const contentPaths = ['/', '/guides', ...categories.map(c => `/${c.slug}`), ...articles.map(a => `/${a.category}/${a.slug}`)];
export const canonicalPath = pathname => {
  const path = pathname.replace(/\/+$/,'') || '/';
  return path === '/' ? '/' : `${path}/`;
};
const categoryTitles = {
  'adressage-reseau':'Adressage IP : IPv4, IPv6, CIDR et sous-réseaux',
  devops:'DevOps : Git, CI/CD, conteneurs, Kubernetes et IaC',
  'windows-server':'Windows Server : Active Directory, FSMO et PowerShell',
  virtualisation:'Virtualisation : Hyper-V, VMware et machines virtuelles',
  azure:'Azure : réseau, machines virtuelles et services cloud',
  'microsoft-365':'Microsoft 365 : identités, sécurité et collaboration',
};
const images = {'windows-server':'windows-server-architecture-hd.png',virtualisation:'virtualisation-architecture-hd.png',azure:'azure-architecture-hd.png','microsoft-365':'microsoft365-architecture-hd.png','adressage-reseau':'adressage-reseau-architecture-hd.png',devops:'devops-architecture-hd.png'};

export function getPageMetadata(pathname) {
  const path = pathname.replace(/\/+$/,'') || '/';
  const article = articles.find(a => path === `/${a.category}/${a.slug}`);
  const category = categories.find(c => path === `/${c.slug}` || c.slug === article?.category);
  const known = contentPaths.includes(path);
  const headline = path === '/outils-ia' ? 'Outils IA — espace protégé' : article?.title || (category ? categoryTitles[category.slug] || category.name : path === '/guides' ? 'Tous les guides infrastructure informatique' : path === '/' ? 'Comprendre votre infrastructure' : 'Page introuvable');
  const title = `${headline} — FullInfra`;
  const description = path === '/outils-ia' ? 'Catalogue protégé des skills IA : fonctions, usages, exemples et prérequis.' : article?.excerpt || category?.description || (path === '/guides' ? 'Retrouvez les guides FullInfra : Windows Server, virtualisation, Azure, Microsoft 365 et DevOps, avec leurs sources officielles.' : 'Guides et infographies pour comprendre Windows Server, la virtualisation, Azure, Microsoft 365 et DevOps.');
  const canonical = `${siteUrl}${canonicalPath(path)}`;
  const image = `${siteUrl}/${images[category?.slug] || images['windows-server']}`;
  const organization = {'@type':'Organization',name:'FullInfra',url:siteUrl};
  const page = article
    ? {'@type':'TechArticle',headline:article.title,description,url:canonical,mainEntityOfPage:canonical,inLanguage:'fr-FR',dateModified:article.date,author:organization,publisher:organization,image}
    : {'@type':path === '/' ? 'WebPage' : 'CollectionPage',name:headline,description,url:canonical,inLanguage:'fr-FR',isPartOf:{'@id':`${siteUrl}/#website`}};
  const crumbs = [{name:'Accueil',url:`${siteUrl}/`}];
  if (category) crumbs.push({name:category.name,url:`${siteUrl}/${category.slug}/`});
  if (article) crumbs.push({name:article.title,url:canonical});
  else if (path === '/guides') crumbs.push({name:'Tous les guides',url:canonical});
  const graph = [page];
  if (path === '/') graph.push({'@type':'WebSite','@id':`${siteUrl}/#website`,name:'FullInfra',url:`${siteUrl}/`,inLanguage:'fr-FR',publisher:organization});
  if (known && crumbs.length > 1) graph.push({'@type':'BreadcrumbList',itemListElement:crumbs.map((crumb,i)=>({'@type':'ListItem',position:i+1,name:crumb.name,item:crumb.url}))});
  return {title,description,canonical,image,type:article ? 'article' : 'website',robots:known ? 'index,follow' : 'noindex,follow',structuredData:known ? {'@context':'https://schema.org','@graph':graph} : null};
}

// Same metadata for the static HTML and React navigation, without duplicate tags.
export function applyPageMetadata(document, metadata) {
  document.title = metadata.title;
  function meta(attribute,key,value) {
    let node=document.head.querySelector(`meta[${attribute}="${key}"]`);
    if (!node) {node=document.createElement('meta');node.setAttribute(attribute,key);document.head.append(node);}
    node.setAttribute('content',value);
  }
  meta('name','description',metadata.description);
  meta('name','robots',metadata.robots);
  for (const [key,value] of Object.entries({title:metadata.title,description:metadata.description,url:metadata.canonical,image:metadata.image,type:metadata.type,site_name:'FullInfra',locale:'fr_FR','image:alt':'Infographie des services et de leur architecture — FullInfra'})) meta('property',`og:${key}`,value);
  for (const [key,value] of Object.entries({card:'summary_large_image',title:metadata.title,description:metadata.description,image:metadata.image})) meta('name',`twitter:${key}`,value);
  let canonical=document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {canonical=document.createElement('link');canonical.rel='canonical';document.head.append(canonical);}
  canonical.href=metadata.canonical;
  let script=document.getElementById('page-structured-data');
  if (metadata.structuredData) {
    if (!script) {script=document.createElement('script');script.id='page-structured-data';script.type='application/ld+json';document.head.append(script);}
    script.textContent=JSON.stringify(metadata.structuredData).replaceAll('<','\\u003c');
  } else script?.remove();
}
