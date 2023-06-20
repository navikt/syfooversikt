import express from 'express';

import { PERSONOVERSIKT_ROOT } from '../../src/apiConstants';

import * as mockUtils from '../mockUtils';

const personoversiktEnhet = (generatedPersons: any) => [
  ...mockUtils.personoversiktEnhet,
  ...mockUtils.generatePersonoversiktEnhetFromPersons(generatedPersons),
];

export const mockPersonoversikt = (
  server: express.Application,
  generatedPersons: any
) => {
  server.get(
    `${PERSONOVERSIKT_ROOT}/enhet/:id`,
    (req: express.Request, res: express.Response) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(personoversiktEnhet(generatedPersons)));
    }
  );
};
