import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';

const server = await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try {
  const { learnSources } = await server.ssrLoadModule('/src/data/learnSources.js');
  const { broadcomSources, vmwareFlows } = await server.ssrLoadModule('/src/data/broadcomSources.js');
  const sources = {...learnSources,...broadcomSources};
  const { microsoft365Sources } = await server.ssrLoadModule('/src/data/microsoft365Sources.js');
  const { microsoft365Topics, microsoft365Flows } = await server.ssrLoadModule('/src/data/microsoft365.js');
  const { microsoft365CommunicationMap } = await server.ssrLoadModule('/src/data/microsoft365Communications.js');
  const { dependencyServices, dependencyLinks } = await server.ssrLoadModule('/src/data/microsoft365Dependencies.js');
  Object.assign(sources,microsoft365Sources);
  const { windowsBranches } = await server.ssrLoadModule('/src/data/windowsBranches.js');
  const { networkTopics, subnetExample, cidrExamples } = await server.ssrLoadModule('/src/data/networkAddressing.js');
  const { devopsTopics, devopsPipeline } = await server.ssrLoadModule('/src/data/devops.js');
  const { fsmoRoles } = await server.ssrLoadModule('/src/data/fsmo.js');
  assert.equal(fsmoRoles.length,5);
  assert.equal(new Set(fsmoRoles.map(role => role.key)).size,5);
  assert.equal(fsmoRoles.filter(role => role.scope === 'Forêt').length,2);
  assert.equal(fsmoRoles.filter(role => role.scope === 'Domaine').length,3);
  const { communicationEdges } = await server.ssrLoadModule('/src/data/windowsCommunications.js');
  const { ecosystems } = await server.ssrLoadModule('/src/data/ecosystems.js');
  const { articles } = await server.ssrLoadModule('/src/data/content.js');
  const { default:App } = await server.ssrLoadModule('/src/App.jsx');
  const evidence=JSON.parse(await readFile(new URL('../docs/learn-sources-audit.json',import.meta.url),'utf8'));
  const broadcomEvidence=JSON.parse(await readFile(new URL('../docs/broadcom-sources-audit.json',import.meta.url),'utf8'));
  evidence.sources.push(...broadcomEvidence.sources);
  const microsoft365Evidence=JSON.parse(await readFile(new URL('../docs/microsoft365-sources-audit.json',import.meta.url),'utf8'));
  evidence.sources.push(...microsoft365Evidence.sources);
  const evidenceById=Object.fromEntries(evidence.sources.map(source => [source.id,source]));
  let technologyCount=0, flowCount=0;
  const usedIds=new Set();
  function verify(ids,label) {
    assert.ok(Array.isArray(ids) && ids.length>0,`Missing source: ${label}`);
    for (const id of ids) {
      const source=sources[id];
      assert.ok(source,`Unknown source ${id}: ${label}`);
      const url=new URL(source.url);
      if (broadcomSources[id]) assert.ok(['www.broadcom.com','knowledge.broadcom.com'].includes(url.hostname));
      else { assert.equal(url.hostname,'learn.microsoft.com'); assert.ok(url.pathname.startsWith('/fr-fr/')); }
      assert.ok(evidenceById[id]?.ok,`Source retrieval failed: ${id}`);
      assert.equal(source.url,evidenceById[id].url);
      assert.ok(/^[a-f0-9]{64}$/.test(evidenceById[id].sha256));
      assert.ok(!/404|FETCH_ERROR/.test(source.title));
      usedIds.add(id);
    }
  }
  for (const [branches,edges] of [[windowsBranches,communicationEdges],...Object.values(ecosystems).map(ecosystem => [ecosystem.branches,ecosystem.edges])]) {
    for (const branch of branches) for (const technology of branch.details) {
      verify(technology.sourceIds,technology.title); technologyCount++;
    }
    for (const edge of edges) { verify(edge.sourceIds,edge.id);flowCount++; }
  }
  for (const article of articles) verify(article.sourceIds,article.title);
  assert.equal(networkTopics.length,12);
  assert.equal(new Set(networkTopics.map(topic=>topic.id)).size,12);
  for (const topic of networkTopics) verify(topic.sourceIds,topic.title);
  assert.equal(devopsTopics.length,12);
  assert.equal(new Set(devopsTopics.map(topic=>topic.id)).size,12);
  for(const topic of devopsTopics) {verify(topic.sourceIds,topic.title);assert.equal(topic.points.length,4);assert.ok(topic.example.length>50);}
  assert.equal(devopsPipeline.length,8);
  assert.equal(new Set(devopsPipeline.map(step=>step.id)).size,8);
  for(const step of devopsPipeline) assert.ok(step.input && step.check && step.output);
  const ipNumber=ip=>ip.split('.').reduce((value,octet)=>value*256+Number(octet),0);
  assert.equal(subnetExample.length,4);
  for (const [index,row] of subnetExample.entries()) {
    const start=ipNumber(row.network.split('/')[0]);
    assert.equal(start,ipNumber('192.168.10.0')+64*index);
    assert.equal(ipNumber(row.first),start+1);
    assert.equal(ipNumber(row.last),start+62);
    assert.equal(ipNumber(row.broadcast),start+63);
  }
  for (const row of cidrExamples) {
    const mask=ipNumber(row.mask);
    assert.equal(mask,2**32-2**(32-row.prefix));
    assert.equal(row.total,2**(32-row.prefix));
    assert.equal(row.hosts,row.total-2);
  }
  verify(Object.keys(broadcomSources),'Volet VMware');
  verify(Object.keys(microsoft365Sources),'Rubrique Microsoft 365');
  assert.equal(microsoft365Topics.length,12);
  assert.equal(microsoft365Flows.length,6);
  for (const topic of microsoft365Topics) {
    verify(topic.sourceIds,topic.title);
    assert.equal(topic.points.length,3);
  }
  for (const flow of microsoft365Flows) verify(flow.sourceIds,flow.label);
  assert.equal(microsoft365CommunicationMap.edges.length,24);
  for (const flow of microsoft365CommunicationMap.edges) verify(flow.sourceIds,flow.label);
  for (const service of dependencyServices) verify(service.sourceIds,service.name);
  for (const link of dependencyLinks) verify(link.sourceIds,link.label);
  assert.equal(vmwareFlows.length,6);
  assert.ok(vmwareFlows.some(row => row[1] === 'vCenter Server' && row[3] === 'TCP 902'));
  assert.ok(vmwareFlows.some(row => row[2] === 'vCenter Server' && row[3] === 'UDP 902'));
  const collectedUrls=new Set(evidence.sources.filter(source => source.ok).map(source => source.url));
  for (const path of ['/','/guides','/windows-server','/virtualisation','/azure','/microsoft-365','/adressage-reseau','/devops',...articles.map(article => `/${article.category}/${article.slug}`)]) {
    const html=renderToString(React.createElement(MemoryRouter,{initialEntries:[path]},React.createElement(App)));
    for (const [,value] of html.matchAll(/href="(https?:[^\"]+)"/g)) {
      const href=value.replaceAll('&amp;','&');
      const host=new URL(href).hostname;
      assert.ok(host === 'learn.microsoft.com' || (path.startsWith('/virtualisation') && ['www.broadcom.com','knowledge.broadcom.com'].includes(host)),`External technical source on ${path}`);
      assert.ok(collectedUrls.has(href),`Displayed reference was not retrieved: ${href}`);
    }
  }
  assert.equal(technologyCount,144);
  assert.equal(flowCount,84);
  assert.equal(articles.length,11);
  console.log(`OK sources : ${technologyCount} technologies, ${flowCount} relations, ${articles.length} articles ; ${usedIds.size} références traçables ; 12 thèmes réseau, sous-réseaux et CIDR vérifiés ; Microsoft 365 et VMware validés.`);
} finally { await server.close(); }
