import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { JSDOM, VirtualConsole } from 'jsdom';

const base=process.env.VITE_BASE_PATH || '/';
const dist=new URL('../dist/',import.meta.url);
const index=await readFile(new URL('index.html',dist),'utf8');
for (const [,asset] of index.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)) {
  assert.ok(asset.startsWith(base),`Asset outside project: ${asset}`);
  await access(new URL(asset.slice(base.length),dist));
}
const sitemap=new JSDOM(await readFile(new URL('sitemap.xml',dist),'utf8'),{contentType:'text/xml'});
const urls=[...sitemap.window.document.querySelectorAll('loc')].map(node=>node.textContent);
assert.equal(urls.length,21);
assert.equal(new Set(urls).size,urls.length);
const titles=new Set(),descriptions=new Set();
for(const url of urls) {
  const path=new URL(url).pathname;
  const html=await readFile(new URL(`${path.slice(1)}index.html`,dist),'utf8');
  const dom=new JSDOM(html),d=dom.window.document;
  assert.equal(d.documentElement.lang,'fr');
  assert.equal(d.querySelectorAll('h1').length,1,`${path}: single H1`);
  assert.equal(d.querySelectorAll('main').length,1);
  assert.ok(d.querySelector('#root').textContent.trim().length>300,`${path}: content must exist without JavaScript`);
  assert.equal(d.querySelectorAll('link[rel="canonical"]').length,1);
  assert.equal(d.querySelector('link[rel="canonical"]').getAttribute('href'),url);
  assert.equal(d.querySelector('meta[name="robots"]').content,'index,follow');
  assert.equal(d.querySelector('meta[property="og:url"]').content,url);
  assert.equal(d.querySelector('meta[name="twitter:card"]').content,'summary_large_image');
  assert.ok(d.title && !titles.has(d.title),`${path}: unique title`);titles.add(d.title);
  const description=d.querySelector('meta[name="description"]').content;
  assert.ok(description && !descriptions.has(description),`${path}: unique description`);descriptions.add(description);
  const schema=JSON.parse(d.getElementById('page-structured-data').textContent);
  assert.equal(schema['@context'],'https://schema.org');
  assert.ok(schema['@graph'].some(item=>item.url===url));
  for(const link of d.querySelectorAll('a[href^="/"]')) {
    const target=new URL(link.getAttribute('href'),'https://fullinfra.duckdns.org');
    assert.ok(urls.includes(`https://fullinfra.duckdns.org${target.pathname.replace(/\/+$/,'')}/`),`Unknown page link: ${target}`);
  }
  dom.window.close();
}
sitemap.window.close();
const robots=await readFile(new URL('robots.txt',dist),'utf8');
assert.ok(robots.includes('Sitemap: https://fullinfra.duckdns.org/sitemap.xml'));
assert.ok(!robots.includes('Disallow: /'));
const fallback=await readFile(new URL('404.html',dist),'utf8');
const missing=new JSDOM(fallback);
assert.equal(missing.window.document.querySelector('meta[name="robots"]').content,'noindex,follow');
assert.match(missing.window.document.querySelector('h1').textContent,/introuvable/i);
assert.ok(!fallback.includes('location.replace'));
missing.window.close();

// Execute the production bundle against the actual generated HTML, including hydration.
const asset=index.match(/src="([^"]+\.js)"/)[1];
const code=await readFile(new URL(asset.slice(base.length),dist),'utf8');
for(const route of ['/','/windows-server/','/virtualisation/','/azure/','/microsoft-365/','/adressage-reseau/','/devops/','/devops/comprendre-pipeline-ci-cd/','/adressage-reseau/calculer-sous-reseau-ipv4/','/windows-server/active-directory-fondations/','/guides/?recherche=Hyper-V','/missing-page/']) {
  const pathname=route.split('?')[0];
  const html=pathname==='/missing-page/' ? fallback : await readFile(new URL(`${pathname.slice(1)}index.html`,dist),'utf8');
  const errors=[];
  const virtualConsole=new VirtualConsole();
  virtualConsole.on('error',(...args)=>errors.push(args.join(' ')));
  virtualConsole.on('jsdomError',error=>errors.push(error.message));
  const dom=new JSDOM(html,{url:`https://fullinfra.duckdns.org${base}${route.slice(1)}`,runScripts:'outside-only',pretendToBeVisual:true,virtualConsole});
  const w=dom.window;w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};
  w.eval(code);
  await new Promise(resolve=>setTimeout(resolve,150));
  assert.deepEqual(errors,[],`${route}: hydration/runtime errors`);
  assert.equal(w.document.querySelectorAll('h1').length,1);
  if(route.includes('recherche=')) {assert.equal(w.document.querySelector('#guide-search').value,'Hyper-V');assert.equal(w.document.querySelectorAll('.article-card').length,1);}
  if(route==='/windows-server/') {
    const branch=w.document.getElementById('branche-active-directory');
    w.document.querySelector('.map-heading button').click();
    await new Promise(resolve=>setTimeout(resolve,30));
    assert.equal(branch.open,true,'Hydrated accordions must work');
  }
  if(route==='/azure/') {
    w.document.querySelector('.site-header nav a[href="/microsoft-365"]').click();
    for(let attempt=0;attempt<40 && !w.document.querySelector('link[rel="canonical"]').href.endsWith('/microsoft-365/');attempt++) await new Promise(resolve=>setTimeout(resolve,25));
    assert.equal(w.document.querySelector('link[rel="canonical"]').href,'https://fullinfra.duckdns.org/microsoft-365/');
    assert.equal(w.document.querySelectorAll('script#page-structured-data').length,1);
  }
  assert.deepEqual(errors,[],`${route}: interaction errors`);
  dom.window.close();
}
console.log(`OK SEO : ${urls.length} HTML complets, métadonnées uniques, canonicals, schémas JSON-LD, sitemap, robots, vraie 404 ; hydratation, filtres et navigation testés sur le build.`);
