import React from 'react';
import { learnSources } from './data/learnSources';
import { microsoft365Sources } from './data/microsoft365Sources';
import { broadcomSources } from './data/broadcomSources';

export default function SourceLinks({ ids = [] }) {
  const hasBroadcom = ids.some(id => broadcomSources[id]);
  const hasMicrosoft = ids.some(id => learnSources[id] || microsoft365Sources[id]);
  return <div className="learn-source-links"><span>{hasBroadcom ? (hasMicrosoft ? 'Références Microsoft Learn et Broadcom' : 'Références officielles Broadcom / VMware') : 'Références Microsoft Learn'}</span>{[...new Set(ids)].map(id => {
    const source = learnSources[id] || microsoft365Sources[id] || broadcomSources[id];
    return source ? <a key={id} href={source.url}>{source.title}</a> : null;
  })}</div>;
}
