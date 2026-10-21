# Validation du volet VMware

Contrôle du 19 octobre 2026. La règle de sources est étendue à la demande de l’utilisateur : Microsoft Learn pour Microsoft, sources officielles Broadcom pour VMware sur site.

## Intégration

- `/virtualisation#vmware-vsphere` : administration ESXi/vCenter, flux vMotion et HA, snapshots et formation officielle.
- `/virtualisation/vmware-snapshots` : guide des snapshots vSphere, à la place du guide AVS qui occupait cette URL historique.
- La carte existante conserve ses scénarios Hyper-V et Azure VMware Solution. Les flux vSphere sur site sont présentés dans un tableau distinct pour éviter de mélanger les responsabilités AVS et les opérations sur site.
- Les pictogrammes Lucide décrivent les fonctions. Le guide vSphere utilise un serveur générique et non le logo Azure VMware Solution.

## Sources consultées

| Source | Contenu validé |
| --- | --- |
| [VCF Learning](https://www.broadcom.com/support/education/vmware) | Formations et certifications ; accès selon droits et offres Broadcom |
| [KB 318895](https://knowledge.broadcom.com/external/article?legacyId=2039095) | Ports ESXi 7.0/8.0 et directions : HTTPS 443, TCP/UDP 902, DNS 53, vMotion TCP 8000 et HA TCP/UDP 8182 |
| [KB 432374](https://knowledge.broadcom.com/external/article/432374/esxi-host-disconnects-from-vcenter-serve.html) | Risque de déconnexion lors du filtrage des adresses autorisées pour les ports ESXi 443 et 902 |
| [KB 318825](https://knowledge.broadcom.com/external/article/318825/best-practices-for-using-vmware-snapshot.html) | Dépendance aux disques de base, conservation, croissance et consolidation des snapshots ; environnements 8.x/9.x listés dans la KB |

Récupération : Agent Reach, route Web/Jina. Captures dans `C:/Users/NH/.agent-reach/audits/sitefullinfra/broadcom/`. Le manifeste `broadcom-sources-audit.json` conserve URL, date et empreinte SHA-256.

La page Education ne fournit pas de matrice de ports. Sa FAQ mentionne des navigateurs anciens ; ces indications n’ont pas été reprises. Aucun cours nécessitant une connexion n’a été consulté.

## Limites et contrôles

Le tableau de six flux est un sous-ensemble documenté, pas une matrice complète de pare-feu. Il ne valide pas tous les flux NSX, vSAN, sauvegarde ou Lifecycle Manager. Les ports ESXi 7.0/8.0 ne sont pas extrapolés à ESX 9. Vérifier la documentation de la version et des fonctions déployées avant une configuration de production.

Les tests couvrent le rendu React, le volet VMware, la traçabilité et les directions TCP/UDP 902. Ils ne constituent pas une certification du déploiement réel. Aucun contrôle visuel dans un navigateur n’est revendiqué.
