# InfraLab: instructions de travail

## Design et rédaction

Les skills installés dans `C:/Users/NH/.codex/skills/` font partie du processus de travail :

- `design-taste-frontend` : critique de la composition et des éléments décoratifs.
- `ui-ux-pro-max` : navigation, formulaires, accessibilité et comportement responsive.
- `frontend-design` : cohérence et intention des modifications visuelles.
- `humanizer` : rédaction française claire, sans slogans ni affirmations ajoutées.

Lire leurs `SKILL.md` lorsque la tâche correspond à leur domaine. La direction demandée pour InfraLab reste Microsoft Support : interface claire, Segoe UI, bleu Microsoft, cartes lisibles et icônes adaptées aux technologies. Les prescriptions esthétiques génériques des skills ne remplacent pas cette préférence.

## Contenus et vérification

Les affirmations techniques Microsoft doivent rester sourcées dans Microsoft Learn en français. Pour VMware sur site, utiliser les sources officielles Broadcom / VMware, notamment la base de connaissances et la documentation technique ; le portail Education sert aux formations. Indiquer la version couverte par les matrices de ports. Préserver la distinction VMware vSphere sur site / Azure VMware Solution, AD DS / Entra ID, Hyper-V / VM Azure et IIS / App Service. Ne pas modifier les SVG Microsoft officiels.

Selon les modifications, exécuter `npm run check`, `npm run check:ui`, `npm run check:sources`, `npm run check:icons` et `npm run build`. Les tests DOM ne valident pas le rendu réel. Signaler toute absence de vérification visuelle dans un navigateur.
