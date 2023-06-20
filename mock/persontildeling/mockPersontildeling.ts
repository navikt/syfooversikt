import { PERSONTILDELING_ROOT } from '../../src/apiConstants';
import express from 'express';

export const mockPersontildeling = (server: express.Application) => {
  server.post(
    `${PERSONTILDELING_ROOT}/registrer`,
    (req: express.Request, res: express.Response) => {
      res.send();
    }
  );
};
