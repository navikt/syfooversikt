import nock from 'nock';
import { SYFOVEILEDER_ROOT } from '../../src/utils/apiUrlUtil';
import aktivEnhetMockData from '../../Mock/Data/aktivEnhet.json';
import veiledereMockData from '../../Mock/Data/veiledere.json';
import axios from 'axios';
import { nockBasePath } from './nockDefaults';

export const stubVeiledere = () => {
  axios.defaults.adapter = require('axios/lib/adapters/http');

  nock(nockBasePath)
    .get(
      `${SYFOVEILEDER_ROOT}/v2/veiledere/enhet/${aktivEnhetMockData.aktivEnhet}`
    )
    .reply(200, () => [...veiledereMockData]);
};
