import { learnSources } from './learnSources';

export function referenceTuples(ids) {
  return ids.map(id => [learnSources[id].title, learnSources[id].url]);
}
