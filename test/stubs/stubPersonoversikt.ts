import nock from 'nock';
import { SYFOOVERSIKTSRVREST_ROOT } from '../../src/utils/apiUrlUtil';
import aktivEnhetMockData from '../../mock/data/aktivEnhet.json';
import personoversiktMockData from '../../mock/data/personoversiktEnhet.json';
import axios from 'axios';
import { nockBasePath } from './nockDefaults';

export const stubPersonoversikt = () => {
  axios.defaults.adapter = require('axios/lib/adapters/http');

  nock(nockBasePath)
    .get(
      `${SYFOOVERSIKTSRVREST_ROOT}/v2/personoversikt/enhet/${aktivEnhetMockData.aktivEnhet}`
    )
    .reply(200, () => [...personoversiktMockData]);
};
