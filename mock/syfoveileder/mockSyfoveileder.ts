import { SYFOVEILEDER_ROOT } from '../../src/apiConstants';

const mockUtils = require('../mockUtils.js');
const Auth = require('../../server/auth/index.js');

export const mockSyfoveileder = (server) => {
  server.get(
    `${SYFOVEILEDER_ROOT}/veileder/self`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(mockUtils.veilederInfo));
    }
  );

  server.get(
    `${SYFOVEILEDER_ROOT}/veiledere/enhet/:enhet`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify(mockUtils.veiledere));
    }
  );
};
