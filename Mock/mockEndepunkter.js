const mockUtils = require('./mockUtils.js');
const mockModiacontextholder = require('./mockModiacontextholder.js');
const Auth = require('../server/auth/index.js');

const generatedPersons = mockUtils.generatePersons(50);
const personInfo = [...mockUtils.personInfo, ...generatedPersons];
const personoversiktEnhet = [
  ...mockUtils.personoversiktEnhet,
  ...mockUtils.generatePersonoversiktEnhetFromPersons(generatedPersons),
];

function mockForLokal(server) {
  mockModiacontextholder(server);

  server.post('/syfoperson/api/v2/person/info', Auth.ensureAuthenticated(), (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(personInfo));
  });

  server.get('/api/v2/personoversikt/enhet/:id', Auth.ensureAuthenticated(), (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(personoversiktEnhet));
  });

  server.post('/api/v2/persontildeling/registrer', Auth.ensureAuthenticated(), (req, res) => {
    res.send();
  });

  server.get('/syfoveileder/api/v2/veileder/self', Auth.ensureAuthenticated(), (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(mockUtils.veilederInfo));
  });

  server.get('/syfoveileder/api/v2/veiledere/enhet/:enhet', Auth.ensureAuthenticated(), (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    res.send(JSON.stringify(mockUtils.veiledere));
  });
}

module.exports = {
  mockForLokal,
};
