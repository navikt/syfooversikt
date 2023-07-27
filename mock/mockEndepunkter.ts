import express from 'express';
import { mockModiacontextholder } from './modiacontextholder/mockModiacontextholder';
import { mockSyfoperson } from './syfoperson/mockSyfoperson';
import { mockSyfoveileder } from './syfoveileder/mockSyfoveileder';
import { mockPersonoversikt } from './personoversikt/mockPersonoversikt';
import { mockPersontildeling } from './persontildeling/mockPersontildeling';
import { mockChangelogs } from './changelogs/mockChangelogs';
import { mockUnleash } from './unleash/mockUnleash';
import { mockEreg } from './ereg/mockEreg';
import { generatePersons } from './mockUtils';

const generatedPersons = generatePersons(50);

const mockEndepunkter = (server: express.Application) => {
  server.use(express.json() as any);
  server.use(express.urlencoded() as any);

  [
    mockModiacontextholder,
    mockEreg,
    mockPersonoversikt,
    mockPersontildeling,
    mockSyfoperson,
    mockSyfoveileder,
    mockChangelogs,
    mockUnleash,
  ].forEach((func) => {
    func(server, generatedPersons);
  });
};

export default mockEndepunkter;
