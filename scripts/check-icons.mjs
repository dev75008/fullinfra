import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createServer } from 'vite';

const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try {
  const { categoryIconKeys, branchIconKeys, technologyIconKeys }=await server.ssrLoadModule('/src/data/technologyIcons.js');
  const { availableTechnologyIcons }=await server.ssrLoadModule('/src/TechnologyIcon.jsx');
  const { networkTopics }=await server.ssrLoadModule('/src/data/networkAddressing.js');
  assert.ok(availableTechnologyIcons.has(categoryIconKeys['adressage-reseau']));
  for(const topic of networkTopics) assert.ok(availableTechnologyIcons.has(topic.icon),`Missing network icon: ${topic.id}`);
  const { devopsTopics }=await server.ssrLoadModule('/src/data/devops.js');
  assert.ok(availableTechnologyIcons.has(categoryIconKeys.devops));
  for(const topic of devopsTopics) assert.ok(availableTechnologyIcons.has(topic.icon),`Missing DevOps icon: ${topic.id}`);
  const { classicCycle, classicPillars, classicTools }=await server.ssrLoadModule('/src/data/devopsClassic.js');
  assert.ok(availableTechnologyIcons.has(categoryIconKeys['devops-classique']));
  for(const item of [...classicCycle,...classicPillars,...classicTools]) assert.ok(availableTechnologyIcons.has(item.icon));
  const { windowsBranches }=await server.ssrLoadModule('/src/data/windowsBranches.js');
  const { ecosystems }=await server.ssrLoadModule('/src/data/ecosystems.js');
  let technologies=0;
  for (const [slug,branches] of [['windows-server',windowsBranches],...Object.values(ecosystems).map(item => [item.slug,item.branches])]) {
    assert.ok(availableTechnologyIcons.has(categoryIconKeys[slug]));
    for (const branch of branches) {
      assert.ok(availableTechnologyIcons.has(branchIconKeys[slug][branch.id]));
      const keys=technologyIconKeys[slug][branch.id];
      assert.equal(keys.length,branch.details.length);
      for (const key of keys) {assert.ok(availableTechnologyIcons.has(key),`Missing icon ${key}`);technologies++;}
    }
  }
  // On-premises AD DS must not be presented with the Microsoft Entra ID product logo.
  assert.notEqual(technologyIconKeys['windows-server']['active-directory'][0],technologyIconKeys.azure.identites[0]);
  const { microsoft365Topics } = await server.ssrLoadModule('/src/data/microsoft365.js');
  assert.ok(availableTechnologyIcons.has(categoryIconKeys['microsoft-365']));
  for (const topic of microsoft365Topics) assert.ok(availableTechnologyIcons.has(topic.icon),`Missing Microsoft 365 icon: ${topic.id}`);
  const manifest=JSON.parse(await readFile(new URL('../public/icons/microsoft/manifest.json',import.meta.url),'utf8'));
  for (const icon of manifest.icons) {
    const bytes=await readFile(new URL(`../public/icons/microsoft/${icon.file}`,import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'),icon.sha256,`Modified official SVG: ${icon.file}`);
    assert.ok(bytes.toString('utf8').includes('<svg'));
  }
  assert.equal(technologies,146);
  console.log(`OK icônes : 146 technologies, 36 branches et ${manifest.icons.length} fichiers Microsoft officiels intacts.`);
} finally {await server.close();}
