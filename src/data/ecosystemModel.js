import { technologyReferences, flowReferences } from './auditReferences';
import { communicationExchanges } from './communicationExchanges';

const positions = [[140,100],[380,100],[620,100],[860,100],[860,320],[860,540],[860,760],[620,760],[380,760],[140,760],[140,540],[140,320]];
const colors = ['#0067b8','#007f8a','#107c10','#a4262c','#5c2d91','#005a9e','#a35c00','#8a6d00','#744da9','#007b83','#498205','#486c85'];

export function createEcosystem(config) {
  return {
    ...config,
    branches: config.branches.map(branch => ({...branch, details:branch.details.map((technology,index) => ({...technology, sourceIds:technologyReferences[config.slug][branch.id][index]}))})),
    edges: config.edges.map(edge => ({...edge, sourceIds:flowReferences[config.slug][edge.id], exchanges:communicationExchanges[config.slug]?.[edge.id]})),
    nodes: [
      ...config.branches.map((branch,index) => ({...branch, label:branch.title, service:branch.service, color:colors[index], x:positions[index][0], y:positions[index][1]})),
      {id:'clients',label:config.clientLabel,service:'Initiateurs des demandes',icon:'clients',color:'#c3edff',x:500,y:420},
    ],
    scenarios: [{id:'all',label:'Vue d’ensemble',description:config.overview,edges:config.edges.map(edge => edge.id),steps:[]}, ...config.scenarios],
  };
}

export function selectEcosystemEdges(ecosystem, scenarioId, nodeId = null) {
  const scenario = ecosystem.scenarios.find(item => item.id === scenarioId) || ecosystem.scenarios[0];
  return ecosystem.edges.filter(edge => scenario.edges.includes(edge.id) && (!nodeId || edge.from === nodeId || edge.to === nodeId));
}

export const technology = (title, description, points, protocols) => ({title,description,points,protocols});
export const branch = (id, title, icon, service, summary, example, details) => ({id,title,icon,service,summary,example,details});
export const flow = (id, from, to, label, protocol, detail, kind = 'network') => ({id,from,to,label,protocol,detail,kind});
