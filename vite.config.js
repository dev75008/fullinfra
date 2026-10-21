import { defineConfig } from 'vite';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const base = process.env.VITE_BASE_PATH || '/';

export default defineConfig({
  base,
  plugins: [{
    name:'github-pages-routing',
    apply:'build',
    async closeBundle() {
      // Pages has no server rewrite: retain a deep link before returning to the app shell.
      const html = `<!doctype html><html lang="fr"><meta charset="utf-8"><title>InfraLab</title><script>try{sessionStorage.setItem('infralab-pages-path',location.pathname+location.search+location.hash)}catch{}location.replace(${JSON.stringify(base)});</script><p>Ouverture du site… <a href="${base}">Accueil</a></p></html>`;
      await writeFile(resolve('dist/404.html'),html);
      await writeFile(resolve('dist/.nojekyll'),'');
    },
  }],
});
