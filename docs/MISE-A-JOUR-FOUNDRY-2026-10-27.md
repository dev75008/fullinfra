# Azure : intégration de Microsoft Foundry

La page produit Microsoft fournie présente Foundry comme une plateforme d’applications et d’agents IA. L’ajout conserve la distinction entre hébergement applicatif, inférence des modèles, outils, recherche documentaire et infrastructure Azure.

## Contenu ajouté

- Infographie Azure SVG et PNG HD 2400 × 2060 : ligne Microsoft Foundry avec modèles, déploiements, agents, outils MCP, RAG, évaluations et contrôles d’accès.
- Résumé accessible et texte alternatif de l’infographie actualisés ; URL de l’image versionnée pour éviter un ancien affichage en cache.
- Deux fiches supplémentaires : Microsoft Foundry dans Applications & IA, Azure AI Search dans Données & recherche. Azure conserve 12 domaines et comporte désormais 50 technologies.
- Relations documentées : appel d’un agent, récupération de contexte et télémétrie. Un scénario Foundry complète les données de communication.
- Guide `/azure/microsoft-foundry-agents-ia/`, accessible dans la rubrique Azure, le catalogue et la recherche ; métadonnées et sitemap actualisés.
- Permissions des outils, isolation réseau selon configuration, données sensibles dans les traces, préversions, régions, quotas et coûts distingués. Aucune promesse de gratuité ou de disponibilité universelle.

## Sources primaires

La page produit [Microsoft Foundry](https://azure.microsoft.com/fr-fr/products/ai-foundry) sert de point de départ. Les références techniques affichées sur le site restent Microsoft Learn en français :

- [Présentation](https://learn.microsoft.com/fr-fr/azure/foundry/what-is-foundry)
- [Foundry Agent Service](https://learn.microsoft.com/fr-fr/azure/foundry/agents/overview)
- [Configuration de l’environnement](https://learn.microsoft.com/fr-fr/azure/foundry/agents/environment-setup)
- [Réseau privé](https://learn.microsoft.com/fr-fr/azure/foundry/agents/how-to/virtual-networks)
- [Observabilité](https://learn.microsoft.com/fr-fr/azure/foundry/concepts/observability)
- [Azure AI Search](https://learn.microsoft.com/fr-fr/azure/search/search-what-is-azure-search)

Ces six pages ont été récupérées par Agent Reach / Jina Reader. Les dates, tailles et SHA256 sont enregistrés dans `learn-sources-audit.json`. Les captures textuelles sont conservées dans le cache utilisateur Agent Reach.

## Validation

Contrôles du rendu serveur, des interactions DOM, des références et de l’intégrité des icônes Microsoft réussis. Les tests vérifient notamment que Foundry est trouvable dans le catalogue et que le guide présente Agent Service. Le SVG est comparé à son générateur, également contrôlé dans le workflow de publication.

Le PNG a été régénéré avec Resvg 2.6.2, installé hors du projet, puis inspecté visuellement. Aucun débordement observé sur cette image. Le rendu responsive dans un vrai navigateur n’a pas été contrôlé : l’inventaire des navigateurs accessibles à l’outil était vide. Les tests DOM ne remplacent pas cette validation visuelle.

La mise à jour ne déploie aucune ressource Azure et ne nécessite aucun abonnement ou accès aux données d’un tenant.
