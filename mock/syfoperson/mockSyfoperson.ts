import { SYFOPERSON_ROOT } from '../../src/apiConstants';

const mockUtils = require('../mockUtils.js');
const Auth = require('../../server/auth/index.js');

const personInfo = (generatedPersons: any) => [
  ...mockUtils.personInfo,
  ...generatedPersons,
];

export const mockSyfoperson = (server: any, generatedPersons: any) => {
  server.post(
    `${SYFOPERSON_ROOT}/person/info`,
    Auth.ensureAuthenticated(),
    (req: any, res: any) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(personInfo(generatedPersons)));
    }
  );
};
