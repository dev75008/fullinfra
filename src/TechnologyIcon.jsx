import React from 'react';
import { Mail, LayoutGrid, Server, Users, Network, HardDrive, ShieldCheck, Layers3, Globe, Wrench, GitBranch, Terminal, Monitor, Cloud, Activity, Cpu, MemoryStick, FolderTree, KeyRound, FileCheck2, ClipboardList, Settings, FileCode2, ScrollText, Workflow, Clock3, Bell, SearchCheck, Shield, Route, Cable, Copy, ArchiveRestore, Archive, Blocks, Tag, Gauge, LockKeyhole, LayoutTemplate, Plug, Database, BookOpen } from 'lucide-react';

const assetKeys = new Set(['azure','vm','disk','vmss','powershell','avs','bastion','managed-identity','mfa','rbac','vnet','dns','gateway','private-endpoint','storage','files','blob','keyvault','nsg','firewall','defender','appservice','functions','appgateway','frontdoor','loadbalancer','sql','postgres','availability','automation','backup','monitor','logs','insights','alerts','policy','resource-group','cost','arc','filesync','netapp','containers','entra']);
const semanticIcons = {
  'mail-local':Mail,'apps-local':LayoutGrid,guides:BookOpen,server:Server,directory:Network,network:Network,'files-local':FolderTree,shield:ShieldCheck,hyperv:Layers3,web:Globe,maintenance:Wrench,cluster:GitBranch,desktop:Monitor,hybrid:Cloud,activity:Activity,
  key:KeyRound,'policy-local':FileCheck2,replication:Workflow,'dns-local':Globe,'vpn-local':LockKeyhole,radius:Shield,'folder-tree':FolderTree,quota:Gauge,'storage-local':HardDrive,permissions:Users,certificate:FileCheck2,audit:ClipboardList,
  migration:GitBranch,'backup-local':ArchiveRestore,'app-pool':Layers3,code:FileCode2,'logs-local':ScrollText,checklist:ClipboardList,quorum:Workflow,redundancy:Cable,recovery:ArchiveRestore,'remote-shell':Terminal,schedule:Clock3,users:Users,broker:Workflow,bell:Bell,diagnostics:SearchCheck,
  'vm-local':Monitor,settings:Settings,cpu:Cpu,memory:MemoryStick,'disk-local':HardDrive,integration:Plug,vlan:Network,route:Route,template:LayoutTemplate,capacity:Gauge,snapshot:Copy,'container-local':Blocks,'database-local':Database,zones:Blocks,resilience:GitBranch,'resource-manager':Blocks,bicep:FileCode2,terraform:Layers3,archive:Archive,tags:Tag,clients:Users,
};

export const availableTechnologyIcons = new Set([...assetKeys,...Object.keys(semanticIcons),'windows-server','appgateway-frontdoor']);

export default function TechnologyIcon({ name, size = 28, className = '' }) {
  if (name === 'appgateway-frontdoor') return <span className={`technology-icon-group ${className}`} data-icon={name} aria-hidden="true"><TechnologyIcon name="appgateway" size={size}/><TechnologyIcon name="frontdoor" size={size}/></span>;
  if (assetKeys.has(name)) return <img className={`technology-icon official-icon ${className}`} src={`${import.meta.env.BASE_URL}icons/microsoft/${name}.svg`} width={size} height={size} alt="" aria-hidden="true" data-icon={name} draggable="false"/>;
  if (name === 'windows-server') return <svg className={`technology-icon ${className}`} width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" data-icon={name}><rect x="7" y="4" width="34" height="40" rx="3" fill="#e8f3fc" stroke="#0078d4" strokeWidth="2"/><path d="M12 13H36M12 22H36M12 31H36" stroke="#0078d4" strokeWidth="2"/><circle cx="34" cy="38" r="2" fill="#0078d4"/><path d="M13 9H16M13 18H16M13 27H16" stroke="#0078d4" strokeWidth="2"/></svg>;
  const Icon = semanticIcons[name] || Server;
  return <Icon size={size} className={`technology-icon semantic-icon ${className}`} aria-hidden="true" data-icon={name || 'server'} strokeWidth={1.7}/>;
}
