import { SYFOVEILEDER_ROOT } from '../../src/apiConstants';
import express from 'express';
import { veiledereMock } from '../data/veiledereMock';
import { veilederMock } from '../data/veilederMock';

export const mockSyfoveileder = (server: express.Application) => {
  server.get(
    `${SYFOVEILEDER_ROOT}/veiledere/self`,
    (req: express.Request, res: express.Response) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(veilederMock));
    }
  );

  server.get(
    `${SYFOVEILEDER_ROOT}/veiledere`,
    (req: express.Request, res: express.Response) => {
      res.setHeader('Content-Type', 'application/json');
      const paramName = req.query.paramName;
      res.send(JSON.stringify(veiledereMock));
    }
  );
};
