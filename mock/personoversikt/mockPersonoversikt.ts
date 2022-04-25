import { PERSONOVERSIKT_ROOT } from '../../src/apiConstants';

const mockUtils = require('../mockUtils.js');
const Auth = require('../../server/auth/index.js');

const personoversiktEnhet = (generatedPersons: any) => [
  ...mockUtils.personoversiktEnhet,
  ...mockUtils.generatePersonoversiktEnhetFromPersons(generatedPersons),
];

export const mockPersonoversikt = (server: any, generatedPersons: any) => {
  server.get(
    `${PERSONOVERSIKT_ROOT}/enhet/:id`,
    Auth.ensureAuthenticated(),
    (req: any, res: any) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(personoversiktEnhet(generatedPersons)));
    }
  );
};
