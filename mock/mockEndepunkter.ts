import { mockModiacontextholder } from './modiacontextholder/mockModiacontextholder';
import { mockSyfoperson } from './syfoperson/mockSyfoperson';
import { mockSyfoveileder } from './syfoveileder/mockSyfoveileder';
import { mockPersonoversikt } from './personoversikt/mockPersonoversikt';
import { mockPersontildeling } from './persontildeling/mockPersontildeling';
import { mockChangelogs } from './changelogs/mockChangelogs';
import { mockUnleash } from './unleash/mockUnleash';

const mockUtils = require('./mockUtils.js');
const express = require('express');
const generatedPersons = mockUtils.generatePersons(50);

const mockEndepunkter = (server: any) => {
  server.use(express.json());
  server.use(express.urlencoded());

  [
    mockModiacontextholder,
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
