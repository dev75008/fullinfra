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
  assert.equal(document.querySelectorAll('.article-card').length,8);
  await click(document.querySelectorAll('.filter-tabs button')[1]);
  assert.equal(document.querySelectorAll('.article-card').length,2);
  const input=document.querySelector('.search-box input');
  await act(async () => {
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set.call(input,'aucun-resultat-inventaire-xyz');
    input.dispatchEvent(new window.Event('input',{bubbles:true}));
  });
  assert.equal(document.querySelectorAll('.article-card').length,0,'Search must filter displayed content');
  await click(document.querySelector('.empty-state button'));
  assert.equal(document.querySelectorAll('.article-card').length,8,'Reset must clear search and category');
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
  assert.ok(document.querySelector('.dependency-toolbar a[download]'));
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
  assert.equal(document.querySelectorAll('.article-card').length,8);
  await click(document.querySelector('.site-header nav a[href="/windows-server"]'));
  assert.equal(document.querySelectorAll('.filter-tabs button').length,3,'Category filters should only list topics with articles');
  console.log('OK UX : menu courant, Échap, focus, libellés, filtres annoncés, recherche sans accents et liens de section.');
  await act(async () => {root.render(React.createElement(MemoryRouter,{key:'wrong-category',initialEntries:['/inconnu/azure-premiere-vm']},React.createElement(App)));});
  assert.ok(document.querySelector('.not-found'));
  assert.match(document.title,/Page introuvable/,'A known slug under the wrong category must keep its 404 title');
  assert.equal(errors.length,0,'No React runtime warnings/errors expected');
  console.log('OK UI : navigation, catalogue, filtre, article et menu.');
} finally {
  await act(async () => root.unmount());
  await server.close();
  console.error=originalError;
  dom.window.close();
}

