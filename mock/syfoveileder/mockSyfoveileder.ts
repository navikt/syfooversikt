import { SYFOVEILEDER_ROOT } from '../../src/apiConstants';
import express from 'express';

import * as mockUtils from '../mockUtils';

export const mockSyfoveileder = (server: express.Application) => {
  server.get(
    `${SYFOVEILEDER_ROOT}/veileder/self`,
    (req: express.Request, res: express.Response) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(mockUtils.veilederInfo));
    }
  );

  server.get(
    `${SYFOVEILEDER_ROOT}/veiledere/enhet/:enhet`,
    (req: express.Request, res: express.Response) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify(mockUtils.veiledere));
    }
  );
};
