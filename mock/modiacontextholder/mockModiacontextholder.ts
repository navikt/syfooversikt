import { MODIACONTEXTHOLDER_ROOT } from '../../src/apiConstants';

const Auth = require('../../server/auth/index.js');

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

export const mockModiacontextholder = (server) => {
  server.get(
    `${MODIACONTEXTHOLDER_ROOT}/decorator`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(saksbehandler));
    }
  );

  server.get(
    `${MODIACONTEXTHOLDER_ROOT}/context/aktivbruker`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(aktivBruker));
    }
  );

  server.get(
    `${MODIACONTEXTHOLDER_ROOT}/context/aktivenhet`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(aktivEnhet));
    }
  );

  server.post(
    `${MODIACONTEXTHOLDER_ROOT}/context`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      res.send().status(204);
    }
  );
};
