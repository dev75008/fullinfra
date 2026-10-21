import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css';
import './polish.css';
import { restorePagesPath } from './pagesRouting';

restorePagesPath(import.meta.env.BASE_URL,window.location,window.history,window.sessionStorage);
createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter basename={import.meta.env.BASE_URL}><App /></BrowserRouter></React.StrictMode>);
