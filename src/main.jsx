import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css';
import './polish.css';
import { restorePagesPath } from './pagesRouting';

restorePagesPath(import.meta.env.BASE_URL,window.location,window.history,window.sessionStorage);
const root=document.getElementById('root');
const app=<React.StrictMode><BrowserRouter basename={import.meta.env.BASE_URL}><App /></BrowserRouter></React.StrictMode>;
const relativePath=('/'+window.location.pathname.slice(import.meta.env.BASE_URL.length)).replace(/\/+$/,'') || '/';
if(root.dataset.prerendered === 'true' && root.dataset.pagePath === relativePath && !window.location.search) hydrateRoot(root,app);
else createRoot(root).render(app);
