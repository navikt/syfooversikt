import { SYFOVEILEDER_ROOT } from '../../src/apiConstants';
import express from 'express';

import * as mockUtils from '../mockUtils';
import { ensureAuthenticated } from '../../server/auth';

export const mockSyfoveileder = (server: express.Application) => {
  server.get(
    `${SYFOVEILEDER_ROOT}/veileder/self`,
    ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(mockUtils.veilederInfo));
    }
  );

  server.get(
    `${SYFOVEILEDER_ROOT}/veiledere/enhet/:enhet`,
    ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify(mockUtils.veiledere));
    }
  );
};
