import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { sealCatalog, openCatalog } from '../src/ai-vault.mjs';
import { testGroups } from './fixtures/ai-catalog.mjs';

const password=crypto.randomUUID();
const encrypted=await sealCatalog(testGroups,password);
test('Chiffrement réel : 91 fiches, 8 domaines, sel et IV uniques',async()=>{
  assert.equal(testGroups.flatMap(g=>g.skills).length,91);
  assert.equal(testGroups.length,8);
  assert.deepEqual(await openCatalog(encrypted,password),testGroups);
  const second=await sealCatalog(testGroups,password);
  assert.notEqual(second.salt,encrypted.salt);assert.notEqual(second.iv,encrypted.iv);
  assert.equal(encrypted.iterations,1200000);
  assert.ok(!JSON.stringify(encrypted).includes(password));
});
test('Mot de passe erroné, altérations et paramètres inattendus refusés',async()=>{
  await assert.rejects(openCatalog(encrypted,'incorrect'),/incorrect/);
  for(const field of ['ciphertext','salt','iv']) {
    const bytes=Uint8Array.from(atob(encrypted[field]),c=>c.charCodeAt(0));bytes[0]^=1;
    await assert.rejects(openCatalog({...encrypted,[field]:btoa(String.fromCharCode(...bytes))},password));
  }
  await assert.rejects(openCatalog({...encrypted,iterations:999999999},password),/Format/);
  await assert.rejects(sealCatalog([{id:'x',name:'x',description:'x',skills:[{}]}],password));
});
test('Build statique : formulaire public, catalogue chiffré, aucun backend requis',async()=>{
  const html=await readFile(new URL('../dist/outils-ia/index.html',import.meta.url),'utf8');
  assert.match(html,/Outils IA/);assert.match(html,/noindex,follow/);
  assert.ok(!html.includes('caveman-optimize'));
  const envelope=JSON.parse(await readFile(new URL('../dist/ai-catalog.enc.json',import.meta.url),'utf8'));
  assert.equal(envelope.iterations,1200000);assert.equal(envelope.cipher,'AES-256-GCM');
  const src=await readFile(new URL('../src/AiTools.jsx',import.meta.url),'utf8');
  assert.doesNotMatch(src,/\/api\/ai-tools|localStorage|sessionStorage/);
  const sitemap=await readFile(new URL('../dist/sitemap.xml',import.meta.url),'utf8');
  assert.ok(!sitemap.includes('/outils-ia')&&!sitemap.includes('/adressage-reseau'));
});
