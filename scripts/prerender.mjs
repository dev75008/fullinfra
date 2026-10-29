import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';

const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try {
  const {default:App}=await server.ssrLoadModule('/src/App.jsx');
  const { preloadAllRouteContent, routeEntryKeys } = await server.ssrLoadModule('/src/routeContent.jsx');
  await preloadAllRouteContent();
  const {contentPaths,getPageMetadata,applyPageMetadata,canonicalPath,siteUrl}=await server.ssrLoadModule('/src/seo.js');
  const {articles}=await server.ssrLoadModule('/src/data/content.js');
  const template=await readFile(resolve('dist/index.html'),'utf8');
  const manifest=JSON.parse(await readFile(resolve('dist/.vite/manifest.json'),'utf8'));
  async function page(path,file) {
    const metadata=getPageMetadata(path);
    const dom=new JSDOM(template);
    applyPageMetadata(dom.window.document,metadata);
    const parts=path.split('/').filter(Boolean);
    const entry=parts.length===1 ? routeEntryKeys[parts[0]] : null;
    const visited=new Set();
    function preload(key) {
      if(visited.has(key) || !manifest[key]) return;
      visited.add(key);
      const chunk=manifest[key];
      for(const asset of [chunk.file,...(chunk.css || [])]) {
        const href=`${server.config.base}${asset}`;
        if([...dom.window.document.querySelectorAll('link[href]')].some(link=>link.getAttribute('href')===href)) continue;
        const link=dom.window.document.createElement('link');
        link.rel=asset.endsWith('.css') ? 'stylesheet' : 'modulepreload';
        link.href=href;
        dom.window.document.head.append(link);
      }
      for(const dependency of chunk.imports || []) preload(dependency);
    }
    if(entry) preload(entry);
    const root=dom.window.document.getElementById('root');
    root.setAttribute('data-prerendered','true');
    root.setAttribute('data-page-path',path);
    root.innerHTML=renderToString(React.createElement(MemoryRouter,{initialEntries:[path]},React.createElement(App)));
    await mkdir(resolve(file,'..'),{recursive:true});
    await writeFile(file,dom.serialize());
    dom.window.close();
  }
  for(const path of contentPaths) await page(path,resolve('dist',path.slice(1),'index.html'));
  // Public locked shell only; catalogue remains encrypted until browser-side unlocking.
  await page('/outils-ia',resolve('dist/outils-ia/index.html'));
  // Unknown URLs stay actual 404 responses with useful content; no redirect to the home page.
  await page('/404',resolve('dist/404.html'));
  const xml=value=>value.replaceAll('&','&amp;').replaceAll('<','&lt;');
  const urls=contentPaths.map(path=>{
    const article=articles.find(a=>path===`/${a.category}/${a.slug}`);
    return `<url><loc>${xml(siteUrl+canonicalPath(path))}</loc>${article ? `<lastmod>${article.date}</lastmod>` : ''}</url>`;
  }).join('\n');
  await writeFile(resolve('dist/sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  await writeFile(resolve('dist/robots.txt'),`User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
  console.log(`OK SEO : ${contentPaths.length} pages HTML, métadonnées, données structurées, sitemap et robots.txt.`);
} finally {await server.close();}
