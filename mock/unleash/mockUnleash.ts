//Enable everything for local development
import express from 'express';
import { UNLEASH_ROOT } from '../../src/apiConstants';
import { unleashMock } from './unleashMock';

export const mockUnleash = (server: express.Application) => {
  server.post(
    `${UNLEASH_ROOT}/*`,
    (req: express.Request, res: express.Response) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(unleashMock));
    }
  );
};
