import nock from 'nock';
import { SYFOOVERSIKTSRVREST_ROOT } from '../../src/utils/apiUrlUtil';
import aktivEnhetMockData from '../../Mock/Data/aktivEnhet.json';
import personoversiktMockData from '../../Mock/Data/personoversiktEnhet.json';
import axios from 'axios';

export const stubPersonoversikt = () => {
  axios.defaults.adapter = require('axios/lib/adapters/http');

  nock('http://localhost:80')
    .get(
      `${SYFOOVERSIKTSRVREST_ROOT}/v2/personoversikt/enhet/${aktivEnhetMockData.aktivEnhet}`
    )
    .reply(200, () => [...personoversiktMockData]);
};
