const mockUtils = require('./mockUtils.js');

const generatedPersons = mockUtils.generatePersons(50);
const personInfo = [...mockUtils.personInfo, ...generatedPersons];
const personoversiktEnhet = [
  ...mockUtils.personoversiktEnhet,
  ...mockUtils.generatePersonoversiktEnhetFromPersons(generatedPersons),
];

function mockForLokal(server) {
  server.post('/syfoperson/api/person/info', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(personInfo));
  });

  server.get('/api/v1/personoversikt/enhet/:id', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(personoversiktEnhet));
  });

  server.post('/api/v1/persontildeling/registrer', (req, res) => {
    res.send();
  });

  server.get('/syfomoteadmin/api/internad/veilederinfo', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(mockUtils.veilederInfo));
  });

  server.get('/syfomoteadmin/api/internad/veilederinfo/enheter', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(mockUtils.enheter));
  });

  server.get('/modiacontextholder/api/context/aktivenhet', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(mockUtils.aktivEnhet));
  });

  server.get('/syfoveileder/api/veiledere/enhet/:enhet', (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    res.send(JSON.stringify(mockUtils.veiledere));
  });
}

module.exports = {
  mockForLokal,
};
