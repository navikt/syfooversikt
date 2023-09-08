import { ToggleNames } from '../src/data/unleash/types/unleash_types';
import express from 'express';
import { UNLEASH_ROOT } from '../src/apiConstants';

export const mockUnleash = (server: express.Application) => {
  server.get(
    `${UNLEASH_ROOT}/toggles`,
    (req: express.Request, res: express.Response) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(unleashMock));
    }
  );
};

export const unleashMock = Object.values(ToggleNames).reduce(
  (accumulator, toggleName) => {
    return { ...accumulator, [toggleName]: true };
  },
  {}
);
