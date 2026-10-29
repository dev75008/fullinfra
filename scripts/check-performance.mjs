import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { JSDOM } from 'jsdom';
import { createServer } from 'vite';

const dist=new URL('../dist/',import.meta.url);
const base=process.env.VITE_BASE_PATH || '/';
const manifest=JSON.parse(await readFile(new URL('.vite/manifest.json',dist),'utf8'));
function dependencies(key,seen=new Set()) {
  if(seen.has(key)) return seen;
  assert.ok(manifest[key],`Unknown build entry: ${key}`);
  seen.add(key);
  for(const dependency of manifest[key].imports || []) dependencies(dependency,seen);
  return seen;
}
const initial=[...dependencies('index.html')];
const jsFiles=[...new Set(initial.map(key=>manifest[key].file))];
const cssFiles=[...new Set(initial.flatMap(key=>manifest[key].css || []))];
const sizes=async files=>{
  let bytes=0,gzipBytes=0;
  for(const file of files) {const buffer=await readFile(new URL(file,dist));bytes+=buffer.length;gzipBytes+=gzipSync(buffer).length;}
  return {bytes,gzipBytes};
};
const js=await sizes(jsFiles),css=await sizes(cssFiles);
assert.ok(js.bytes<450000,`Initial JavaScript budget exceeded: ${js.bytes} bytes`);
assert.ok(css.bytes<35000,`Initial CSS budget exceeded: ${css.bytes} bytes`);
const home=new JSDOM(await readFile(new URL('index.html',dist),'utf8'));
const initialLinks=new Set([...home.window.document.querySelectorAll('link[rel="modulepreload"]')].map(link=>link.getAttribute('href')));
for(const chunk of Object.values(manifest).filter(chunk=>chunk.isDynamicEntry)) assert.ok(!initialLinks.has(`${base}${chunk.file}`),'Home must not preload unrelated categories');
home.window.close();
const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try {
  const {routeEntryKeys}=await server.ssrLoadModule('/src/routeContent.jsx');
  assert.equal(Object.keys(routeEntryKeys).length,7);
  for(const [route,entry] of Object.entries(routeEntryKeys)) {
    const dom=new JSDOM(await readFile(new URL(`${route}/index.html`,dist),'utf8'));
    const styles=new Set([...dom.window.document.querySelectorAll('link[rel="stylesheet"]')].map(link=>link.getAttribute('href')));
    for(const key of dependencies(entry)) for(const file of manifest[key].css || []) assert.ok(styles.has(`${base}${file}`),`${route}: deferred CSS must be present in static HTML`);
    for(const image of dom.window.document.querySelectorAll('img')) {
      assert.ok(Number(image.getAttribute('width'))>0 && Number(image.getAttribute('height'))>0,`${route}: image dimensions must reserve space`);
      if(image.classList.contains('official-icon')) {assert.equal(image.getAttribute('loading'),'lazy');assert.equal(image.getAttribute('decoding'),'async');}
    }
    dom.window.close();
  }
} finally {await server.close();}
console.log(`OK performance : JS initial ${js.bytes} octets (${js.gzipBytes} gzip), CSS initial ${css.bytes} octets ; sept modules différés, styles prérendus et dimensions des images vérifiés.`);
