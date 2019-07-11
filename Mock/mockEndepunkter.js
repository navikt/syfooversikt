const path = require('path');
const fs = require('fs');

const mockData = {};
const ENHETER = 'enheter';
const MOTEBEHOV = 'motebehov';
const PERSON_INFO = 'personInfo';
const PERSONOVERSIKT_ENHET = 'personoversiktEnhet';
const VEILEDERINFO = 'veilederinfo';
const ENHET_NAVN = 'enhetNavn';

const lastFilTilMinne = (filnavn) => {
  fs.readFile(path.join(__dirname, `/Data/${filnavn}.json`), (err, data) => {
    if (err) throw err;
    mockData[filnavn] = JSON.parse(data.toString());
  });
};

lastFilTilMinne(ENHETER);
lastFilTilMinne(MOTEBEHOV);
lastFilTilMinne(PERSON_INFO);
lastFilTilMinne(PERSONOVERSIKT_ENHET);
lastFilTilMinne(VEILEDERINFO);
lastFilTilMinne(ENHET_NAVN);

function mockForLokal(server) {
  server.post('/syfoperson/api/person/info', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(mockData[PERSON_INFO]));
  });

  server.get('/api/v1/personoversikt/enhet/:id', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(mockData[PERSONOVERSIKT_ENHET]));
  });

  server.post('/api/v1/persontildeling/registrer', (req, res) => {
    res.send();
  });

  server.get('/syfomoteadmin/api/internad/veilederinfo', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(mockData[VEILEDERINFO]));
  });

  server.get('/syfomoteadmin/api/internad/veilederinfo/enheter', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(mockData[ENHETER]));
  });

  server.get('/norg2/api/v1/enhet/:id', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(mockData[ENHET_NAVN]));
  });
}

module.exports = {
  mockForLokal,
};
