import { PERSONTILDELING_ROOT } from '../../src/apiConstants';

const Auth = require('../../server/auth/index.js');

export const mockPersontildeling = (server: any) => {
  server.post(
    `${PERSONTILDELING_ROOT}/registrer`,
    Auth.ensureAuthenticated(),
    (req: any, res: any) => {
      res.send();
    }
  );
};
