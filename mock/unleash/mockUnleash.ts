//Enable everything for local development
import { UNLEASH_ROOT } from '../../src/apiConstants';
import { unleashMock } from './unleashMock';

export const mockUnleash = (server: any) => {
  server.post(`${UNLEASH_ROOT}/*`, (req: any, res: any) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(unleashMock));
  });
};
