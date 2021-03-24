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

function mockForLokal(server) {
  server.get('/modiacontextholder/api/decorator', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(saksbehandler));
  });

  server.get('/modiacontextholder/api/context/aktivbruker', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(aktivBruker));
  });

  server.get('/modiacontextholder/api/context/aktivenhet', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(aktivEnhet));
  });

  server.post('/modiacontextholder/api/context', (req, res) => {
    res.send().status(204);
  });
}

function mockModiacontextholder(server) {
  mockForLokal(server);
}

module.exports = mockModiacontextholder;
