import express from 'express';
import { MODIACONTEXTHOLDER_ROOT } from '../../src/apiConstants';

const saksbehandler = {
  ident: 'Z999999',
  navn: 'Vetle Veileder',
  fornavn: 'Vetle',
  etternavn: 'Veileder',
  enheter: [
    {
      enhetId: '0315',
      navn: 'NAV Grünerløkka',
    },
    {
      enhetId: '0316',
      navn: 'NAV Gamle Oslo',
    },
  ],
};

const aktivBruker = {
  aktivBruker: null,
  aktivEnhet: null,
};

const aktivEnhet = {
  aktivBruker: null,
  aktivEnhet: '0316',
};

export const mockModiacontextholder = (server: express.Application) => {
  server.get(
    `${MODIACONTEXTHOLDER_ROOT}/decorator`,
    (req: express.Request, res: express.Response) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(saksbehandler));
    }
  );

  server.get(
    `${MODIACONTEXTHOLDER_ROOT}/context/aktivbruker`,
    (req: express.Request, res: express.Response) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(aktivBruker));
    }
  );

  server.get(
    `${MODIACONTEXTHOLDER_ROOT}/context/aktivenhet`,
    (req: express.Request, res: express.Response) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(aktivEnhet));
    }
  );

  server.post(
    `${MODIACONTEXTHOLDER_ROOT}/context`,
    (req: express.Request, res: express.Response) => {
      res.send().status(204);
    }
  );
};
