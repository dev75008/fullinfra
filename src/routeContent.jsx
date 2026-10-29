import React, { lazy, Suspense } from 'react';

const loaders = {
  'windows-server': () => import('./sections/WindowsContent'),
  virtualisation: () => import('./sections/VirtualisationContent'),
  azure: () => import('./sections/AzureContent'),
  'microsoft-365': () => import('./Microsoft365Section'),
  devops: () => import('./DevopsSection'),
  'devops-classique': () => import('./DevopsClassicSection'),
  'outils-ia': () => import('./AiTools'),
};
const loaded = new Map();
const pending = new Map();

export const routeEntryKeys = {
  'windows-server':'src/sections/WindowsContent.jsx',
  virtualisation:'src/sections/VirtualisationContent.jsx',
  azure:'src/sections/AzureContent.jsx',
  'microsoft-365':'src/Microsoft365Section.jsx',
  devops:'src/DevopsSection.jsx',
  'devops-classique':'src/DevopsClassicSection.jsx',
  'outils-ia':'src/AiTools.jsx',
};

export class RouteContentBoundary extends React.Component {
  state = {failed:false};
  static getDerivedStateFromError() { return {failed:true}; }
  render() {
    return this.state.failed ? <section role="alert"><h2>La rubrique n’a pas pu être chargée</h2><p>Vérifiez votre connexion puis rechargez cette page.</p><button className="button secondary" onClick={() => window.location.reload()}>Recharger la page</button></section> : this.props.children;
  }
}

export function preloadRouteContent(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  const key = parts.length === 1 ? parts[0] : null;
  if (!loaders[key]) return Promise.resolve();
  if (!pending.has(key)) pending.set(key, loaders[key]().then(module => { loaded.set(key, module.default); }));
  return pending.get(key);
}

// Prerender and DOM tests resolve the same modules before synchronous rendering.
export function preloadAllRouteContent() {
  return Promise.all(Object.keys(loaders).map(key => preloadRouteContent(`/${key}`)));
}

const deferred = Object.fromEntries(Object.keys(loaders).map(key => [key, lazy(async () => {
  await preloadRouteContent(`/${key}`);
  return { default: loaded.get(key) };
})]));

export default function RouteContent({ slug }) {
  const Component = loaded.get(slug) || deferred[slug];
  return Component ? <RouteContentBoundary key={slug}><Suspense fallback={<p className="route-loading" role="status">Chargement de la rubrique…</p>}><Component/></Suspense></RouteContentBoundary> : null;
}
