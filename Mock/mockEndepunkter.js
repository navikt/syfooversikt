const mockUtils = require('./mockUtils.js');
const mockModiacontextholder = require('./mockModiacontextholder.js');

const generatedPersons = mockUtils.generatePersons(50);
const personInfo = [...mockUtils.personInfo, ...generatedPersons];
const personoversiktEnhet = [
  ...mockUtils.personoversiktEnhet,
  ...mockUtils.generatePersonoversiktEnhetFromPersons(generatedPersons),
];

function mockForLokal(server) {
  mockModiacontextholder(server);

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

  server.get('/syfoveileder/api/v1/veileder/self', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(mockUtils.veilederInfo));
  });

  server.get('/syfoveileder/api/veiledere/enhet/:enhet', (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    res.send(JSON.stringify(mockUtils.veiledere));
  });
}

module.exports = {
  mockForLokal,
};
