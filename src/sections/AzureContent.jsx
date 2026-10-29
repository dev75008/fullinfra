import React from 'react';
import AzureArchitecture from '../AzureArchitecture';
import TechnologyInfographic from '../TechnologyInfographic';
import { azureEcosystem } from '../data/azure';

export default function AzureContent() {
  return <><AzureArchitecture/><TechnologyInfographic ecosystem={azureEcosystem}/></>;
}
