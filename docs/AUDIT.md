# Audit du site InfraLab — 19 octobre 2026

## Périmètre et méthode

L’audit porte sur les trois rubriques, leurs 144 fiches de technologies, leurs 84 relations de communication, les scénarios et les six articles. Les noms de produits sur l’accueil ne constituent pas des sources techniques.

La seule source documentaire retenue est [Microsoft Learn, portail français](https://learn.microsoft.com/fr-fr/docs/). La procédure Agent Reach a été utilisée : diagnostic des backends, découverte avec Exa restreinte à Microsoft Learn FR, lecture des pages avec Jina Reader, cache des captures et reprise des requêtes après limitation de débit. Aucun compte ni session de navigateur n’a été utilisé. Les liens externes contenus dans les pages Microsoft n’ont pas été suivis comme sources techniques.

139 pages pertinentes ont été récupérées avec succès. 134 références sont rattachées aux fiches, relations et articles. Les captures sont conservées dans `C:/Users/NH/.agent-reach/audits/sitefullinfra/`. Le manifeste [learn-sources-audit.json](learn-sources-audit.json) contient l’URL, le titre, l’horodatage de récupération, la taille et l’empreinte SHA-256 du fichier de chaque capture. Il permet de tracer la collecte ; une empreinte de fichier ne prouve pas, à elle seule, la justesse d’une interprétation.

## Défauts de fonctionnement reproduits et corrigés

| Défaut | Correction | Preuve ajoutée |
| --- | --- | --- |
| Une carte et la liste des articles utilisaient la même clé React lors du changement de rubrique. React signalait des doublons et conservait des éléments de l’ancienne rubrique. | Clés distinctes pour les cartes et les guides. | Navigation répétée entre les trois rubriques : une seule carte, douze branches et deux articles à chaque fois ; aucun avertissement React. |
| « Détails de la branche » défilait vers un élément `<details>` encore fermé. | Le lien ouvre la fiche, place le focus sur son résumé et défile jusqu’à elle. | Vérification de l’ancre et de l’état ouvert pour chaque rubrique. |
| Le catalogue `/guides` recevait le titre « Page introuvable ». | Titre explicite « Tous les guides ». | Vérification du titre après navigation. |
| Un slug d’article connu sous une mauvaise rubrique pouvait donner le titre d’un article sur une page 404. | Recherche de l’article par son chemin complet, rubrique incluse. | Test de `/inconnu/azure-premiere-vm` : contenu et titre 404 cohérents. |
| Les temps de lecture étaient saisis sans rapport avec la longueur des courts exemples. | Calcul à partir du texte des sections, avec un minimum d’une minute. | Rendu des cartes et des articles contrôlé. |

Les contrôles antérieurs vérifiaient surtout le rendu serveur, la cohérence des données et le build. Ils ne reproduisaient pas les changements de rubrique dans un DOM actif, ce qui explique la non-détection du défaut de clés React.

## Corrections et délimitations documentaires

| Sujet | État retenu après audit | Source Microsoft Learn |
| --- | --- | --- |
| VMware générique, KVM/QEMU et ports vSphere | Les affirmations qui n’étaient pas démontrées dans le périmètre choisi ont été retirées ou remplacées. La partie VMware est bornée à Azure VMware Solution ; l’architecture Hyper-V remplace la fiche KVM. Il ne s’agit pas d’une affirmation que ces technologies externes étaient toutes incorrectes. | [Architecture AVS](https://learn.microsoft.com/fr-fr/azure/azure-vmware/architecture-private-clouds), [Architecture Hyper-V](https://learn.microsoft.com/fr-fr/windows-server/virtualization/hyper-v/architecture) |
| Gestion et migration VMware | Suppression de la matrice Broadcom et des ports 8000/902 présentés comme repères génériques. Séparation des fonctions AVS gérées et de la préparation HCX documentée par Microsoft. | [Réseau AVS](https://learn.microsoft.com/fr-fr/azure/azure-vmware/tutorial-network-checklist), [Configuration HCX](https://learn.microsoft.com/fr-fr/azure/azure-vmware/configure-vmware-hcx) |
| Stockage NFS | Distinction explicite entre l’intégration Azure NetApp Files pour AVS et les architectures de stockage Hyper-V. Un accès NFS de VM Hyper-V n’est plus suggéré par le scénario collectif. | [Stockage Hyper-V](https://learn.microsoft.com/fr-fr/windows-server/virtualization/hyper-v/storage-architecture), [Azure NetApp Files avec AVS](https://learn.microsoft.com/fr-fr/azure/azure-vmware/attach-azure-netapp-files-to-azure-vmware-solution-hosts) |
| Migration Hyper-V et Windows Server 2025 | Ajout de la contrainte Credential Guard/CredSSP et de la délégation Kerberos contrainte pour les serveurs concernés. Les modes de transport restent distincts de l’authentification. | [Configuration de migration dynamique](https://learn.microsoft.com/fr-fr/windows-server/virtualization/hyper-v/deploy/set-up-hosts-for-live-migration-without-failover-clustering) |
| WSUS | Mention de l’arrêt de son développement fonctionnel et de son maintien en support selon le cycle de vie. Distinction client → WSUS et WSUS → Microsoft Update. | [Vue d’ensemble WSUS](https://learn.microsoft.com/fr-fr/windows-server/administration/windows-server-update-services/get-started/windows-server-update-services-wsus), [Configuration WSUS](https://learn.microsoft.com/fr-fr/windows-server/administration/windows-server-update-services/deploy/2-configure-wsus) |
| SQL Database | Distinction du mode Proxy, de Redirect public et de Redirect avec endpoint privé. Les plages additionnelles ne sont pas présentées comme des ports universellement nécessaires. | [Architecture de connexion SQL](https://learn.microsoft.com/fr-fr/azure/azure-sql/database/connectivity-architecture), [SQL Private Link](https://learn.microsoft.com/fr-fr/azure/azure-sql/database/private-endpoint-overview) |
| Bastion | Détail des sauts client → Bastion puis Bastion → VM ; ajout des dépendances internes de la matrice NSG. | [Règles NSG Bastion](https://learn.microsoft.com/fr-fr/azure/bastion/bastion-nsg) |
| RDS | Distinction du transport externe vers la passerelle et du flux RDP interne vers l’hôte de session. | [Ports RDS](https://learn.microsoft.com/fr-fr/troubleshoot/windows-server/remote/ports-used-by-rds) |
| Collecte des journaux | Les exemples WEF indiquent le mode initié par la source. La collecte Windows ne repose plus sur une supposition Syslog générique commune à tous les hyperviseurs. | [Windows Event Forwarding](https://learn.microsoft.com/fr-fr/windows/security/operating-system-security/device-management/use-windows-event-forwarding-to-assist-in-intrusion-detection) |
| Article VMware | L’URL historique est conservée ; le contenu traite maintenant de sauvegarde et de reprise AVS documentées par Microsoft. | [Sauvegarde AVS](https://learn.microsoft.com/fr-fr/azure/azure-vmware/ecosystem-back-up-vms), [Reprise AVS](https://learn.microsoft.com/fr-fr/azure/azure-vmware/ecosystem-disaster-recovery-vms) |

Les autres fiches conservent leurs notions générales avec des références rattachées à chaque technologie. Les mécanismes locaux, relations logiques, ports par défaut et options de déploiement sont distingués. Le texte reste une synthèse pédagogique : il ne remplace pas la documentation d’une version ou d’un SKU précis.

## Vérifications reproductibles

```powershell
npm run check
npm run check:ui
npm run check:sources
npm run build
```

- `check` : routes, articles, 404, structure des fiches, références entre nœuds et relations, scénarios et filtrage des cartes.
- `check:ui` : montage React dans un DOM isolé, scénarios, sélection des flux, ouverture des branches, accordéons, recherche, remise à zéro des filtres, menu, titres et changements répétés de rubrique.
- `check:sources` : présence de références pour les 144 technologies, 84 relations et six articles ; domaine Microsoft Learn FR ; collecte réussie et empreinte disponible.
- `build` : compilation de production Vite.

## Limites explicites

Le contrôle UI utilise JSDOM, pas un navigateur avec moteur de mise en page. Aucun navigateur connecté n’était disponible pour contrôler les captures, le rendu visuel ou les tailles mobiles. Les règles responsive sont conservées, mais elles ne sont pas déclarées validées visuellement par cet audit.

Les cartes décrivent des domaines et des scénarios représentatifs, pas chaque serveur ou chaque paquet d’un déploiement réel. Les tableaux de sauts précisent les extrémités lorsqu’une relation résume plusieurs échanges. Les exemples ne constituent pas une politique pare-feu prête à appliquer. La documentation peut évoluer après la date des captures.

## Extension VMware du 19 octobre 2026

À la demande de l’utilisateur, les contenus VMware sur site utilisent désormais les sources officielles Broadcom. Le guide historique `vmware-snapshots` traite à nouveau des snapshots vSphere. Les constats précédents relatifs au périmètre exclusivement Microsoft décrivent l’audit antérieur. Voir [la validation VMware](VMWARE-VALIDATION.md) pour les sources et limites actuelles.
