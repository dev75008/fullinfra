// Une correspondance explicite évite d’attribuer un logo cloud à un service Windows local.
export const categoryIconKeys = {'windows-server':'windows-server',virtualisation:'hyperv',azure:'azure','microsoft-365':'apps-local'};

export const branchIconKeys = {
  'windows-server': {'active-directory':'directory',reseau:'network',stockage:'files-local',securite:'shield',virtualisation:'hyperv',web:'web',maintenance:'maintenance',disponibilite:'cluster',powershell:'powershell',rds:'desktop',hybride:'hybrid',monitoring:'activity'},
  virtualisation: {hyperviseurs:'hyperv',machines:'vm-local','reseaux-virtuels':'network','stockage-virtuel':'storage-local',gestion:'settings','disponibilite-vm':'cluster',mobilite:'migration','sauvegarde-vm':'backup-local','securite-vm':'shield','automatisation-vm':'powershell','supervision-vm':'activity','hybride-vm':'hybrid'},
  azure: {identites:'entra','reseau-cloud':'vnet',calcul:'vm','stockage-cloud':'storage','securite-cloud':'defender','applications-cloud':'appservice','donnees-cloud':'sql','disponibilite-cloud':'resilience','automatisation-cloud':'automation','sauvegarde-cloud':'backup','supervision-cloud':'monitor','gouvernance-cloud':'resource-group'},
};

export const technologyIconKeys = {
  'windows-server': {
    'active-directory':['directory','policy-local','key','replication'],
    reseau:['dns-local','network','vpn-local','radius'],
    stockage:['files-local','folder-tree','quota','storage-local'],
    securite:['permissions','shield','certificate','audit'],
    virtualisation:['hyperv','network','migration','backup-local'],
    web:['web','app-pool','code','logs-local'],
    maintenance:['maintenance','checklist','backup-local','activity'],
    disponibilite:['cluster','quorum','redundancy','recovery'],
    powershell:['powershell','remote-shell','schedule','code'],
    rds:['desktop','broker','vpn-local','users'],
    hybride:['arc','filesync','hybrid','backup-local'],
    monitoring:['logs-local','activity','bell','diagnostics'],
  },
  virtualisation: {
    hyperviseurs:['hyperv','avs','cpu','cpu'],
    machines:['cpu','memory','disk-local','integration'],
    'reseaux-virtuels':['network','vlan','dns-local','route'],
    'stockage-virtuel':['storage-local','files-local','netapp','storage-local'],
    gestion:['avs','settings','permissions','template'],
    'disponibilite-vm':['cluster','avs','quorum','capacity'],
    mobilite:['migration','avs','disk-local','maintenance'],
    'sauvegarde-vm':['snapshot','backup-local','replication','recovery'],
    'securite-vm':['permissions','vlan','certificate','shield'],
    'automatisation-vm':['powershell','avs','code','checklist'],
    'supervision-vm':['server','activity','logs-local','bell'],
    'hybride-vm':['migration','arc','container-local','recovery'],
  },
  azure: {
    identites:['entra','rbac','managed-identity','mfa'],
    'reseau-cloud':['vnet','dns','gateway','private-endpoint'],
    calcul:['vm','disk','bastion','vmss'],
    'stockage-cloud':['blob','files','permissions','snapshot'],
    'securite-cloud':['nsg','firewall','keyvault','defender'],
    'applications-cloud':['appservice','functions','appgateway-frontdoor','loadbalancer'],
    'donnees-cloud':['sql','postgres','private-endpoint','database-local'],
    'disponibilite-cloud':['zones','replication','recovery','schedule'],
    'automatisation-cloud':['resource-manager','bicep','terraform','powershell'],
    'sauvegarde-cloud':['backup','backup','archive','recovery'],
    'supervision-cloud':['monitor','logs','insights','alerts'],
    'gouvernance-cloud':['resource-group','policy','tags','cost'],
  },
};
