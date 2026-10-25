import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

// Smoke test: render every content route and verify links and initial lists.
const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx');
  const { categories, articles } = await server.ssrLoadModule('/src/data/content.js');
  const { windowsBranches } = await server.ssrLoadModule('/src/data/windowsBranches.js');
  const { communicationNodes, communicationEdges, communicationScenarios, selectCommunicationEdges } = await server.ssrLoadModule('/src/data/windowsCommunications.js');
  const { ecosystems } = await server.ssrLoadModule('/src/data/ecosystems.js');
  const { selectEcosystemEdges } = await server.ssrLoadModule('/src/data/ecosystemModel.js');
  const { microsoft365CommunicationMap:m365 } = await server.ssrLoadModule('/src/data/microsoft365Communications.js');
  const { dependencyServices, dependencyLinks } = await server.ssrLoadModule('/src/data/microsoft365Dependencies.js');
  assert.equal(dependencyServices.length,20);
  assert.equal(dependencyLinks.length,36);
  const dependencyIds=new Set(dependencyServices.map(service => service.id));
  assert.equal(dependencyIds.size,20);
  assert.equal(new Set(dependencyLinks.map(link => link.id)).size,36);
  for (const link of dependencyLinks) assert.ok(dependencyIds.has(link.from) && dependencyIds.has(link.to));
  for (const service of dependencyServices) assert.ok(dependencyLinks.some(link => link.from === service.id || link.to === service.id));
  const m365Nodes=new Set(m365.nodes.map(node => node.id));
  assert.equal(m365Nodes.size,13);
  assert.equal(m365.edges.length,24);
  assert.equal(new Set(m365.edges.map(edge => edge.id)).size,24);
  for (const edge of m365.edges) {
    assert.ok(m365Nodes.has(edge.from) && m365Nodes.has(edge.to));
    assert.notEqual(edge.from,edge.to);
    assert.ok(['network','logical'].includes(edge.kind || 'network'));
  }
  for (const node of m365.nodes) assert.ok(selectEcosystemEdges(m365,'all',node.id).length > 0);
  for (const scenario of m365.scenarios) {
    assert.equal(selectEcosystemEdges(m365,scenario.id).length,scenario.edges.length);
    for (const [id] of scenario.steps) assert.ok(scenario.edges.includes(id));
  }
  const render = path => renderToString(React.createElement(MemoryRouter, { initialEntries: [path] }, React.createElement(App)));
  assert.match(render('/'), /Comprendre/);
  const windowsHtml = render('/windows-server');
  assert.ok(!windowsHtml.includes('id="communication-title"'));
  assert.equal(communicationNodes.length, 13); // Douze branches et le centre clients/admins.
  assert.equal(new Set(communicationEdges.map(edge => edge.id)).size, communicationEdges.length);
  const nodeIds = new Set(communicationNodes.map(node => node.id));
  for (const edge of communicationEdges) {
    assert.ok(nodeIds.has(edge.from) && nodeIds.has(edge.to));
    assert.ok(edge.from !== edge.to);
    assert.ok(['network', 'logical'].includes(edge.kind));
    assert.ok(edge.protocol && edge.detail.length > 40);
  }
  for (const branch of windowsBranches) {
    assert.ok(nodeIds.has(branch.id));
    const focused = selectCommunicationEdges('all', branch.id);
    assert.ok(focused.length > 0);
    assert.ok(focused.every(edge => edge.from === branch.id || edge.to === branch.id));
  }
  for (const scenario of communicationScenarios) {
    assert.equal(selectCommunicationEdges(scenario.id).length, scenario.edges.length);
    for (const [edgeId] of scenario.steps) assert.ok(scenario.edges.includes(edgeId));
    for (const node of communicationNodes) {
      assert.deepEqual(selectCommunicationEdges(scenario.id, node.id).map(edge => edge.id), selectCommunicationEdges(scenario.id).filter(edge => edge.from === node.id || edge.to === node.id).map(edge => edge.id));
    }
  }
  assert.equal(windowsBranches.length, 12);
  assert.equal((windowsHtml.match(/<details /g) || []).length, 13);
  assert.equal((windowsHtml.match(/<dt>/g) || []).length, 48);
  assert.equal((windowsHtml.match(/class="technology-points"/g) || []).length, 48);
  assert.equal((windowsHtml.match(/<li>/g) || []).length, 150);
  assert.equal((windowsHtml.match(/class="branch-example"/g) || []).length, 12);
  assert.equal((windowsHtml.match(/class="technology-protocols"/g) || []).length, 48);
  for (const branch of windowsBranches) {
    assert.ok(branch.example.length > 40);
    for (const detail of branch.details) {
      assert.equal(detail.points.length, 3);
      assert.ok(detail.points.every(point => point.length > 40));
      assert.ok(detail.protocols.length >= 2);
      for (const protocol of detail.protocols) {
        assert.equal(protocol.length, 3);
        assert.ok(protocol.every(value => typeof value === 'string' && value.length > 0));
      }
    }
  }
  for (const branch of windowsBranches) assert.ok(windowsHtml.includes(`id="branche-${branch.id}"`));
  for (const path of ['/', '/azure', '/virtualisation', '/guides']) {
    assert.ok(!render(path).includes('id="windows-map"'));
    assert.ok(!render(path).includes('id="communication-title"'));
  }
  for (const ecosystem of Object.values(ecosystems)) {
    const html = render(`/${ecosystem.slug}`);
    assert.ok(!html.includes(`id="${ecosystem.slug}-communication-title"`));
    assert.ok(html.includes(`id="${ecosystem.slug}-map"`));
    assert.ok(!html.includes('NaN') && !html.includes('undefined'));
    assert.equal((html.match(/<details /g) || []).length, 13);
    assert.equal((html.match(/<dt>/g) || []).length, 48);
    assert.equal((html.match(/<li>/g) || []).length, 150);
    assert.equal((html.match(/class="technology-protocols"/g) || []).length, 48);
    assert.equal((html.match(/class="branch-example"/g) || []).length, 12);
    assert.equal(ecosystem.nodes.length, 13);
    assert.equal(ecosystem.branches.length, 12);
    assert.equal(ecosystem.scenarios.length, 5);
    const ids = new Set(ecosystem.nodes.map(node => node.id));
    assert.equal(ids.size, 13);
    assert.equal(new Set(ecosystem.edges.map(edge => edge.id)).size, ecosystem.edges.length);
    for (const branch of ecosystem.branches) {
      assert.ok(html.includes(`id="${ecosystem.slug}-branche-${branch.id}"`));
      assert.ok(branch.example && branch.summary);
      assert.equal(branch.details.length, 4);
      const focused = selectEcosystemEdges(ecosystem, 'all', branch.id);
      assert.ok(focused.length > 0);
      assert.ok(focused.every(edge => edge.from === branch.id || edge.to === branch.id));
      for (const technology of branch.details) {
        assert.equal(technology.points.length, 3);
        assert.ok(technology.points.every(point => point.length > 30));
        assert.ok(technology.protocols.length > 0);
        for (const row of technology.protocols) {
          assert.equal(row.length, 3);
          assert.ok(row.every(cell => typeof cell === 'string' && cell.length > 0));
        }
      }
    }
    for (const edge of ecosystem.edges) {
      assert.ok(ids.has(edge.from) && ids.has(edge.to));
      assert.notEqual(edge.from, edge.to);
      assert.ok(['network','logical'].includes(edge.kind));
      assert.ok(edge.protocol && edge.detail.length > 40);
    }
    for (const scenario of ecosystem.scenarios) {
      assert.equal(selectEcosystemEdges(ecosystem, scenario.id).length, scenario.edges.length);
      for (const [edgeId] of scenario.steps) assert.ok(scenario.edges.includes(edgeId));
      for (const node of ecosystem.nodes) {
        assert.deepEqual(selectEcosystemEdges(ecosystem, scenario.id, node.id).map(edge => edge.id), selectEcosystemEdges(ecosystem, scenario.id).filter(edge => edge.from === node.id || edge.to === node.id).map(edge => edge.id));
      }
    }
    console.log(`OK : ${ecosystem.title}, 12 branches, 48 technologies, ${ecosystem.edges.length} relations et 4 scénarios.`);
  }
  assert.ok(!categories.some(category=>category.slug==='adressage-reseau'));
  assert.ok(!articles.some(article=>article.category==='adressage-reseau'));
  assert.ok(render('/adressage-reseau').includes('Page introuvable'));
  assert.ok(render('/').includes('href="/outils-ia"'));
  assert.equal((render('/guides').match(/class="article-card /g) || []).length, articles.length);
  for (const category of categories) {
    const html = render(`/${category.slug}`);
    assert.ok(html.includes(category.name));
    assert.equal((html.match(/class="article-card /g) || []).length, articles.filter(a => a.category === category.slug).length);
  }
  for (const article of articles) {
    const html = render(`/${article.category}/${article.slug}`);
    assert.ok(html.includes(article.title));
    assert.ok(html.includes('id="etape-0"'));
  }
  for (const path of ['/','/guides','/outils-ia',...categories.map(item => `/${item.slug}`),...articles.map(item => `/${item.category}/${item.slug}`)]) {
    const html=render(path);
    assert.equal((html.match(/<h1[ >]/g) || []).length,1,`One page title expected on ${path}`);
    assert.equal((html.match(/<main[ >]/g) || []).length,1,`One main landmark expected on ${path}`);
    const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size,ids.length,`Unique IDs expected on ${path}`);
    for (const [,hash] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(hash),`Missing anchor #${hash} on ${path}`);
  }
  for (const path of ['/inconnu', '/azure/inconnu', '/route/inconnue/test']) assert.ok(render(path).includes('Page introuvable'));
  console.log(`OK : accueil, catalogue, ${categories.length} rubriques, ${articles.length} articles et routes 404.`);
  console.log(`OK : carte des 12 branches, ${communicationEdges.length} relations, scénarios et filtres par branche.`);
} finally {
  await server.close();
}
