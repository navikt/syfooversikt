import { PERSONTILDELING_ROOT } from '../../src/apiConstants';
import express from 'express';

import { ensureAuthenticated } from '../../server/authUtils';

export const mockPersontildeling = (server: express.Application) => {
  server.post(
    `${PERSONTILDELING_ROOT}/registrer`,
    ensureAuthenticated(),
    (req: express.Request, res: express.Response) => {
      res.send();
    }
  );
};
