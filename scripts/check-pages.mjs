import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { JSDOM } from 'jsdom';
import { restorePagesPath } from '../src/pagesRouting.js';

const base=process.env.VITE_BASE_PATH || '/fullinfra/';
const index=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
for (const [,asset] of index.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)) {
  assert.ok(asset.startsWith(base),`Asset outside project: ${asset}`);
  await access(new URL(`../dist/${asset.slice(base.length)}`,import.meta.url));
}
const fallback=await readFile(new URL('../dist/404.html',import.meta.url),'utf8');
const script=fallback.match(/<script>([\s\S]*?)<\/script>/)[1];
const dom=new JSDOM('',{url:`https://fullinfra.duckdns.org${base}`});
const location={pathname:`${base}microsoft-365`,search:'?recherche=Teams',hash:'#m365-topics',replace(value){this.redirect=value;}};
runInNewContext(script,{location,sessionStorage:dom.window.sessionStorage});
assert.equal(location.redirect,base);
restorePagesPath(base,dom.window.location,dom.window.history,dom.window.sessionStorage);
assert.equal(dom.window.location.pathname,location.pathname);
assert.equal(dom.window.location.search,location.search);
assert.equal(dom.window.location.hash,location.hash);
assert.equal(dom.window.sessionStorage.getItem('infralab-pages-path'),null);
dom.window.sessionStorage.setItem('infralab-pages-path','//example.com/');
restorePagesPath(base,dom.window.location,dom.window.history,dom.window.sessionStorage);
assert.equal(dom.window.location.origin,'https://fullinfra.duckdns.org');
dom.window.close();
console.log(`OK Pages : assets ${base}, liens directs, paramètres, ancres et restauration limitée au projet.`);
