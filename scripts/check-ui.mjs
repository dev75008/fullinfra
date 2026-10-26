import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { createServer } from 'vite';

// Integration tests in an isolated DOM. No connected browser/session is used.
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {url:'http://localhost/'});
Object.assign(globalThis, {window:dom.window, document:dom.window.document, HTMLElement:dom.window.HTMLElement, MouseEvent:dom.window.MouseEvent, FormData:dom.window.FormData, IS_REACT_ACT_ENVIRONMENT:true});
window.scrollTo = () => {};
window.HTMLElement.prototype.scrollIntoView = () => {};
const React = await import('react');
const { act } = React;
const { createRoot } = await import('react-dom/client');
const { MemoryRouter } = await import('react-router-dom');
const server = await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
const root = createRoot(document.getElementById('root'));
const errors = [];
const originalError = console.error;
const originalFetch = globalThis.fetch;
console.error = (...args) => {errors.push(args.map(String).join(' ')); originalError(...args);};
const click = async element => {
  assert.ok(element, 'Expected clickable element');
  await act(async () => {element.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,button:0}));});
};
try {
  const {default:App} = await server.ssrLoadModule('/src/App.jsx');
  const {ecosystems} = await server.ssrLoadModule('/src/data/ecosystems.js');
  await act(async () => {root.render(React.createElement(MemoryRouter,{initialEntries:['/']},React.createElement(App)));});
  assert.match(document.title, /Comprendre/);
  for (const slug of ['windows-server','virtualisation','azure']) {
    await click(document.querySelector(`.site-header nav a[href="/${slug}"]`));
    assert.equal(document.querySelectorAll('.communication-map').length,0,'These categories must omit communication maps');
    assert.equal(document.querySelectorAll('.windows-map').length,1);
    assert.equal(document.querySelectorAll('.map-branch').length,12);
    assert.equal(document.querySelectorAll('.fsmo-grid article').length,slug === 'windows-server' ? 5 : 0,'Five FSMO roles belong in Windows Server');
    if (slug === 'windows-server') {
      const branch=document.getElementById('branche-active-directory');
      await click(branch.querySelector('summary'));
      assert.equal(branch.open,true);
      const detail=branch.querySelector('dd .fsmo-technology-details');
      assert.ok(detail,'FSMO explanations must be inside the AD DS technology');
      assert.equal(detail.querySelectorAll('.fsmo-role-detail').length,5);
      assert.match(detail.textContent,/Get-ADDomainController/);
    }
    assert.equal(document.querySelector('.dependency-toolbar'),null,'Infographic action buttons must be absent in every category');
    assert.equal(document.querySelector('.m365-architecture-image').parentElement.tagName,'FIGURE','Infographics must not be links');
    for (const type of ['click','dblclick']) assert.equal(document.querySelector('.m365-architecture-image').dispatchEvent(new MouseEvent(type,{bubbles:true,cancelable:true})),false,'Infographic must cancel clicks');
    for (const link of document.querySelectorAll('.section-navigation a')) {
      assert.ok(document.getElementById(link.hash.slice(1)),`Unresolved section navigation: ${link.hash}`);
    }
    assert.equal(document.querySelectorAll('.vmware-section').length,slug === 'virtualisation' ? 1 : 0,'VMware on-premises content belongs in Virtualisation');
    if (slug === 'virtualisation') {
      assert.equal(document.querySelectorAll('.vmware-section tbody tr').length,6);
      assert.ok(document.querySelector('.vmware-section a[href*="broadcom.com/support/education/vmware"]'));
      assert.match(document.querySelector('.vmware-section table caption').textContent,/7.0 et 8.0/);
    }
    await click(document.querySelector('.map-heading button'));
    assert.ok([...document.querySelectorAll('.map-branch')].every(item => item.open));
    await click(document.querySelector('.map-heading button'));
    assert.ok([...document.querySelectorAll('.map-branch')].every(item => !item.open));
    console.log(`OK UI : ${slug}, infographie, branches et accordéons.`);
  }
  await click(document.querySelector('.header-cta'));
  assert.match(document.title,/Tous les guides/,'Catalogue title must describe the page');
  assert.equal(document.querySelectorAll('.article-card').length,13);
  await click(document.querySelectorAll('.filter-tabs button')[1]);
  assert.equal(document.querySelectorAll('.article-card').length,2);
  const input=document.querySelector('.search-box input');
  await act(async () => {
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set.call(input,'aucun-resultat-inventaire-xyz');
    input.dispatchEvent(new window.Event('input',{bubbles:true}));
  });
  assert.equal(document.querySelectorAll('.article-card').length,0,'Search must filter displayed content');
  await click(document.querySelector('.empty-state button'));
  assert.equal(document.querySelectorAll('.article-card').length,13,'Reset must clear search and category');
  await click(document.querySelector('.article-card'));
  assert.ok(document.querySelector('.prose'));
  assert.ok(!document.title.includes('introuvable'));
  await click(document.querySelector('.menu-toggle'));
  assert.equal(document.querySelector('.menu-toggle').getAttribute('aria-expanded'),'true');
  await click(document.querySelector('.site-header nav a[href="/"]'));
  assert.equal(document.querySelector('.menu-toggle').getAttribute('aria-expanded'),'false');
  await act(async () => {
    const homeInput=document.querySelector('.home-search input');
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set.call(homeInput,'Hyper-V');
    homeInput.dispatchEvent(new window.Event('input',{bubbles:true}));
  });
  await act(async () => {document.querySelector('.home-search').dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));});
  assert.match(document.title,/Tous les guides/);
  assert.equal(document.querySelector('.search-box input').value,'Hyper-V');
  assert.equal(document.querySelectorAll('.article-card').length,1,'Home search must transfer the query to the catalogue');
  await click(document.querySelector('.site-header nav a[href="/"]'));
  await click(document.querySelector('.product-shortcuts a[href="/windows-server#branche-active-directory"]'));
  assert.equal(document.getElementById('branche-active-directory').open,true,'Product shortcut must open its target details');
  for (const slug of ['azure','virtualisation','windows-server','azure','windows-server']) {
    await click(document.querySelector(`.site-header nav a[href="/${slug}"]`));
    assert.equal(document.querySelectorAll('.communication-map').length,0);
    assert.equal(document.querySelectorAll('.map-branch').length,12);
    assert.equal(document.querySelectorAll('.article-card').length,2);
    assert.equal(document.querySelectorAll('.technology-heading > [data-icon]').length,48);
    const ids=[...document.querySelectorAll('[id]')].map(element => element.id);
    assert.equal(new Set(ids).size,ids.length,'DOM IDs must stay unique after navigation');
  }
  await click(document.querySelector('.site-header nav a[href="/microsoft-365"]'));
  assert.match(document.title,/Microsoft 365/);
  assert.ok(document.querySelector('.dependency-infographic'));
  const architectureImage=document.querySelector('.m365-architecture-image');
  assert.ok(architectureImage);
  assert.equal(architectureImage.parentElement.tagName,'FIGURE','Microsoft 365 infographic must not be a link');
  for (const type of ['click','dblclick']) assert.equal(architectureImage.dispatchEvent(new MouseEvent(type,{bubbles:true,cancelable:true})),false,'Microsoft 365 infographic must cancel clicks');
  assert.equal(document.querySelector('.dependency-toolbar'),null,'Infographic action buttons must be removed');
  assert.ok(document.querySelector('.infographic-transcript'));
  await click(document.querySelector('.m365-network-map>summary'));
  assert.equal(document.querySelectorAll('.m365-topic-grid details').length,12);
  for (const link of document.querySelectorAll('.section-navigation a')) assert.ok(document.getElementById(link.hash.slice(1)));
  assert.equal(document.querySelectorAll('.article-card').length,2);
  assert.equal(document.querySelectorAll('.communication-map').length,1);
  assert.equal(document.querySelectorAll('.communication-node').length,13);
  assert.equal(document.querySelectorAll('.communication-flow').length,24);
  for (let index=0;index<5;index++) {
    await click(document.querySelectorAll('.communication-controls button')[index]);
    await click(document.querySelector('.communication-flow'));
    assert.ok(document.querySelector('.communication-explanation .learn-source-links a'));
  }
  await click(document.querySelector('.communication-reset'));
  await click([...document.querySelectorAll('.communication-flow')].find(item => /Transporter les médias/.test(item.textContent)));
  assert.match(document.querySelector('.communication-explanation code').textContent,/3478/);
  await click(document.querySelector('.communication-node'));
  const m365BranchLink=document.querySelector('.communication-flow-header a');
  assert.equal(m365BranchLink.hash,'#microsoft-365-administration');
  await click(m365BranchLink);
  assert.equal(document.getElementById('microsoft-365-administration').open,true);
  await click(document.querySelector('.m365-topics .section-heading button'));
  assert.ok([...document.querySelectorAll('.m365-topic-grid details')].every(item => item.open));
  await click(document.querySelector('.m365-topics .section-heading button'));
  assert.ok([...document.querySelectorAll('.m365-topic-grid details')].every(item => !item.open));
  await click(document.querySelector('.article-card'));
  assert.ok(document.querySelector('.prose a[href*="microsoft-365"]'));
  console.log('OK UI : Microsoft 365, 12 fiches, scénarios, accordéons et guide sourcé.');
  await click(document.querySelector('.site-header nav a[href="/microsoft-365"]'));
  assert.equal(document.activeElement.id,'content','Route changes should move focus to content');
  await click(document.querySelector('.menu-toggle'));
  await click(document.querySelector('.site-header nav a[href="/microsoft-365"]'));
  assert.equal(document.querySelector('.menu-toggle').getAttribute('aria-expanded'),'false','Selecting the current category must close the menu');
  await click(document.querySelector('.menu-toggle'));
  await act(async () => {document.dispatchEvent(new window.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));});
  assert.equal(document.querySelector('.menu-toggle').getAttribute('aria-expanded'),'false');
  assert.equal(document.activeElement,document.querySelector('.menu-toggle'),'Escape must restore focus to the menu button');
  await click(document.querySelector('.header-cta'));
  assert.ok(document.querySelector('label[for="guide-search"]'));
  await click(document.querySelectorAll('.filter-tabs button')[1]);
  assert.equal(document.querySelectorAll('.filter-tabs button[aria-pressed="true"]').length,1);
  assert.equal(document.querySelectorAll('.article-card').length,2);
  await click(document.querySelector('.filter-tabs button'));
  async function searchFor(value) {
    await act(async () => {
      const field=document.querySelector('#guide-search');
      Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set.call(field,value);
      field.dispatchEvent(new window.Event('input',{bubbles:true}));
    });
  }
  await searchFor('   PREMIERE MACHINE   ');
  assert.equal(document.querySelectorAll('.article-card').length,1,'Search must ignore accents, case and outer whitespace');
  await searchFor('guide-inexistant-xyz');
  await click(document.querySelector('.empty-state button'));
  assert.equal(document.querySelector('#guide-search').value,'');
  assert.equal(document.querySelectorAll('.article-card').length,13);
  await click(document.querySelector('.site-header nav a[href="/windows-server"]'));
  assert.equal(document.querySelectorAll('.filter-tabs button').length,3,'Category filters should only list topics with articles');
  console.log('OK UX : menu courant, Échap, focus, libellés, filtres annoncés, recherche sans accents et liens de section.');
  assert.equal(document.querySelector('a[href="/adressage-reseau"]'),null);
  assert.ok(document.querySelector('.site-header nav a[href="/outils-ia"]'));
  assert.ok(document.querySelector('footer a[href="/outils-ia"]'));
  await click(document.querySelector('.site-header nav a[href="/devops"]'));
  assert.match(document.title,/DevOps/);
  assert.equal(document.querySelectorAll('.devops-details article').length,12);
  assert.equal(document.querySelectorAll('.devops-example').length,12);
  assert.equal(document.querySelectorAll('#devops-pipeline tbody tr').length,8);
  assert.equal(document.querySelectorAll('.article-card').length,3);
  assert.equal(document.querySelector('.m365-architecture-image').parentElement.tagName,'FIGURE');
  assert.equal(document.querySelector('.dependency-toolbar'),null);
  for(const type of ['click','dblclick']) assert.equal(document.querySelector('.m365-architecture-image').dispatchEvent(new MouseEvent(type,{bubbles:true,cancelable:true})),false);
  for(const link of document.querySelectorAll('.section-navigation a')) assert.ok(document.getElementById(link.hash.slice(1)));
  await click(document.querySelector('.article-card'));
  assert.match(document.querySelector('h1').textContent,/CI\/CD/);
  assert.ok(document.querySelector('.prose a[href*="what-is-continuous-integration"]'));
  console.log('OK DevOps : 12 domaines, pipeline de 8 étapes, 3 guides, infographie non cliquable et navigation.');
  await click(document.querySelector('.site-header nav a[href="/devops-classique"]'));
  assert.match(document.title,/DevOps classique/);
  assert.equal(document.querySelectorAll('#classique-piliers article').length,5);
  assert.equal(document.querySelectorAll('#classique-outils article').length,8);
  assert.equal(document.querySelectorAll('.classic-cycle-details > li').length,8);
  assert.equal(document.querySelectorAll('.classic-example-steps > li').length,6);
  assert.equal(document.querySelectorAll('#classique-metiers tbody tr').length,5);
  assert.equal(document.querySelectorAll('.article-card').length,2);
  const classicImage=document.querySelector('.classic-infographic img');
  assert.equal(classicImage.closest('a,button,[role="button"]'),null);
  assert.equal(classicImage.getAttribute('tabindex'),null);
  assert.ok(!document.querySelector('.devops-classic a[href*="azure"]'));
  for(const link of document.querySelectorAll('.section-navigation a')) assert.ok(document.getElementById(link.hash.slice(1)));
  for(const link of document.querySelectorAll('.devops-classic .learn-source-links a')) assert.ok(link.href.startsWith('https://'));
  await click(document.querySelector('.article-card'));
  assert.ok(document.querySelector('.prose a[href*="docs.gitlab.com"]'));
  assert.equal(document.querySelector('link[rel="canonical"]').href,'https://fullinfra.duckdns.org/devops-classique/pipeline-independant-du-cloud/');
  console.log('OK DevOps classique : cinq piliers, huit outils, cycle, cas pratique, métiers, image sans lien et guides sourcés.');

  const {testGroups}=await import('./fixtures/ai-catalog.mjs');
  const {sealCatalog}=await import('../src/ai-vault.mjs');
  const testPassword=crypto.randomUUID(),testEnvelope=await sealCatalog(testGroups,testPassword);
  globalThis.fetch=async path=>{assert.ok(path.endsWith('ai-catalog.enc.json'));return {ok:true,json:async()=>testEnvelope};};
  const submitPassword=async value=>{
    await act(async()=>{Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set.call(document.querySelector('#ai-password'),value);document.querySelector('#ai-password').dispatchEvent(new window.Event('input',{bubbles:true}));});
    await act(async()=>document.querySelector('.ai-login').dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true})));
    for(let i=0;i<400&&document.querySelector('.ai-login button')?.disabled;i++)await act(async()=>new Promise(resolve=>setTimeout(resolve,25)));
    assert.ok(document.querySelector('.ai-workspace')||!document.querySelector('.ai-login button')?.disabled,'Decryption completed');
  };
  await click(document.querySelector('.site-header nav a[href="/outils-ia"]'));
  assert.match(document.title,/Outils IA/);
  assert.equal(document.querySelector('.ai-workspace'),null);
  assert.equal(document.querySelector('#ai-password').type,'password');
  assert.equal(document.querySelector('#ai-password').autocomplete,'current-password');
  await submitPassword('incorrect');
  assert.match(document.querySelector('[role="alert"]').textContent,/Mot de passe incorrect/);
  assert.equal(document.querySelector('.ai-workspace'),null);assert.equal(document.querySelector('#ai-password').value,'');
  await submitPassword(testPassword);
  assert.equal(document.querySelectorAll('.ai-domain-navigation button').length,9);
  assert.equal(document.querySelectorAll('.ai-skill').length,88);
  assert.equal(document.querySelectorAll('.ai-skill-group').length,8);
  assert.equal(document.querySelector('#ai-password'),null);
  assert.match(document.querySelector('.ai-result-count').textContent,/88 skills/);
  for(const skill of document.querySelectorAll('.ai-skill'))assert.equal(skill.querySelectorAll('dd').length,3);
  await click(document.querySelector('.ai-domain-navigation button:nth-child(5)'));
  assert.equal(document.querySelectorAll('.ai-skill').length,3);
  assert.match(document.querySelector('.ai-skill-list').textContent,/agent-reach/);
  assert.match(document.querySelector('.ai-skill-list').textContent,/api-anything/);
  await click(document.querySelector('.ai-domain-navigation button'));
  const search=document.querySelector('#ai-search');
  for(const name of ['graphify','api-anything','impeccable','hallmark','open-design','google-design-md','react-bits','canvas-ui','scroll-world','gsap-react','write-swift','mimic','reagent','llm4decompile','llm-decompiler','ai-code-decompile']) {
    await act(async()=>{Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set.call(search,name);search.dispatchEvent(new window.Event('input',{bubbles:true}));});
    assert.equal(document.querySelectorAll('.ai-skill').length,1);
    assert.equal(document.querySelector('.ai-skill-overview strong').textContent,testGroups.flatMap(group=>group.skills).find(skill=>skill.id===name).name);
    await click(document.querySelector('.ai-skill summary'));
    assert.equal(document.querySelector('.ai-skill').open,true);
  }
  await act(async()=>{Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set.call(search,'caveman-optimize');search.dispatchEvent(new window.Event('input',{bubbles:true}));});
  assert.equal(document.querySelectorAll('.ai-skill').length,1);
  const detail=document.querySelector('.ai-skill');
  await click(detail.querySelector('summary'));assert.equal(detail.open,true);
  assert.match(detail.querySelector('dl').textContent,/approbation explicite/);
  await act(async()=>{Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set.call(search,'aucun-skill-xyz');search.dispatchEvent(new window.Event('input',{bubbles:true}));});
  assert.equal(document.querySelectorAll('.ai-skill').length,0);assert.ok(document.querySelector('.ai-empty'));
  await click(document.querySelector('.ai-empty button'));assert.equal(document.querySelectorAll('.ai-skill').length,88);
  await click(document.querySelector('.ai-tools-heading button'));
  assert.equal(document.querySelector('.ai-workspace'),null);assert.ok(document.querySelector('#ai-password'));
  // Missing ciphertext fails closed even on a static host.
  globalThis.fetch=async()=>({ok:false,status:404});
  await submitPassword(testPassword);
  assert.equal(document.querySelector('.ai-workspace'),null);
  assert.match(document.querySelector('[role="alert"]').textContent,/catalogue chiffré est indisponible/);
  assert.ok(document.querySelector('#ai-password'));
  globalThis.fetch=originalFetch;
  console.log('OK outils IA : 88 fiches, recherche, domaines, détails, déchiffrement, verrouillage et refus si le fichier est absent.');
  await act(async () => {root.render(React.createElement(MemoryRouter,{key:'wrong-category',initialEntries:['/inconnu/azure-premiere-vm']},React.createElement(App)));});
  assert.ok(document.querySelector('.not-found'));
  assert.match(document.title,/Page introuvable/,'A known slug under the wrong category must keep its 404 title');
  assert.equal(errors.length,0,'No React runtime warnings/errors expected');
  console.log('OK UI : navigation, catalogue, filtre, article et menu.');
} finally {
  await act(async () => root.unmount());
  await server.close();
  console.error=originalError;
  globalThis.fetch=originalFetch;
  dom.window.close();
}

