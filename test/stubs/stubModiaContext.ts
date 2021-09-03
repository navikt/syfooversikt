import nock from 'nock';
import { MODIACONTEXTHOLDER_ROOT } from '../../src/utils/apiUrlUtil';
import aktivEnhetMockData from '../../Mock/Data/aktivEnhet.json';
import axios from 'axios';
import { nockBasePath } from './nockDefaults';

export const stubModiaContext = () => {
  axios.defaults.adapter = require('axios/lib/adapters/http');

  nock(nockBasePath)
    .get(`${MODIACONTEXTHOLDER_ROOT}/context/aktivenhet`)
    .reply(200, {
      ...aktivEnhetMockData,
    });
};
