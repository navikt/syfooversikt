import express from 'express';
import { PERSONOVERSIKT_ROOT } from '../../src/apiConstants';
import { personoversiktEnhetMock } from '../data/personoversiktEnhetMock';
import {
  generatePersonoversiktEnhetFromPersons,
  MockPerson,
} from '../mockUtils';

const personoversiktEnhet = (generatedPersons: MockPerson[]) => [
  ...personoversiktEnhetMock,
  ...generatePersonoversiktEnhetFromPersons(generatedPersons),
];

export const mockPersonoversikt = (
  server: express.Application,
  generatedPersons: MockPerson[]
) => {
  server.get(
    `${PERSONOVERSIKT_ROOT}/enhet/:id`,
    (req: express.Request, res: express.Response) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(personoversiktEnhet(generatedPersons)));
    }
  );
};
