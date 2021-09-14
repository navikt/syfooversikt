import { PERSONTILDELING_ROOT } from '../../src/apiConstants';

const Auth = require('../../server/auth/index.js');

export const mockPersontildeling = (server) => {
  server.post(
    `${PERSONTILDELING_ROOT}/registrer`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      res.send();
    }
  );
};
