export const fsmoRoles = [
  {id:'schema',name:'Maître de schéma',scope:'Forêt',key:'SchemaMaster',purpose:'Autorise les modifications des classes et attributs du schéma AD DS, ensuite répliquées dans la forêt.',impact:'Une extension du schéma attend le retour du rôle. Les opérations ordinaires de l’annuaire ne s’arrêtent pas pour autant.'},
  {id:'naming',name:'Maître d’attribution des noms de domaine',scope:'Forêt',key:'DomainNamingMaster',purpose:'Contrôle l’ajout et la suppression des domaines et des partitions d’annuaire d’applications dans la forêt.',impact:'Les changements concernés dans la structure de la forêt ne peuvent pas être finalisés.'},
  {id:'rid',name:'Maître RID',scope:'Domaine',key:'RIDMaster',purpose:'Distribue aux contrôleurs de domaine des blocs d’identifiants relatifs (RID), utilisés avec le SID du domaine pour identifier les principaux de sécurité.',impact:'Les contrôleurs utilisent leurs RID disponibles. La création de nouveaux utilisateurs, groupes de sécurité ou ordinateurs est compromise lorsque leurs réserves sont épuisées.'},
  {id:'pdc',name:'Émulateur PDC',scope:'Domaine',key:'PDCEmulator',purpose:'Reçoit les changements de mot de passe en priorité, intervient dans les vérifications de mots de passe récents et les verrouillages, et sert de point préféré pour certains outils GPO.',impact:'Les opérations liées aux mots de passe, aux verrouillages et à l’administration peuvent être perturbées. Dans le domaine racine, ce rôle est aussi la référence horaire de la forêt.'},
  {id:'infrastructure',name:'Maître d’infrastructure',scope:'Domaine',key:'InfrastructureMaster',purpose:'Maintient les références aux objets d’autres domaines, notamment les références entre groupes et utilisateurs.',impact:'Les références interdomaines peuvent devenir obsolètes. Son activité dépend de la topologie des catalogues globaux ; avec la Corbeille AD activée, chaque contrôleur met à jour ses références.'},
];

export const fsmoExamples = {
  schema:'Une application exige un nouvel attribut dans l’annuaire : la modification du schéma doit passer par ce détenteur, puis être répliquée.',
  naming:'L’ajout d’un domaine enfant modifie l’espace de noms de la forêt et nécessite ce rôle. Il ne s’agit pas de créer une simple zone DNS.',
  rid:'Un contrôleur crée des comptes avec son pool local de RID. Il sollicite le maître RID pour recevoir un nouveau bloc ; celui-ci n’est donc pas contacté à chaque création.',
  pdc:'Après un changement récent de mot de passe, un autre contrôleur peut consulter l’émulateur PDC avant de rejeter une authentification. Cela ne fait pas du PDC le seul serveur qui authentifie les utilisateurs.',
  infrastructure:'Un groupe d’un domaine référence un utilisateur d’un autre domaine : le rôle maintient les informations de cette référence lorsque cela relève encore de sa responsabilité. La configuration du catalogue global et de la Corbeille AD doit être prise en compte.',
};
