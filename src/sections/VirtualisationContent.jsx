import React from 'react';
import VirtualisationArchitecture from '../VirtualisationArchitecture';
import TechnologyInfographic from '../TechnologyInfographic';
import VMwareSection from '../VMwareSection';
import { virtualisationEcosystem } from '../data/virtualisation';

export default function VirtualisationContent() {
  return <><VirtualisationArchitecture/><TechnologyInfographic ecosystem={virtualisationEcosystem}/><VMwareSection/></>;
}
