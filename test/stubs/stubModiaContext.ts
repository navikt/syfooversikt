import nock from 'nock';
import { MODIACONTEXTHOLDER_ROOT } from '../../src/utils/apiUrlUtil';
import aktivEnhetMockData from '../../Mock/Data/aktivEnhet.json';
import axios from 'axios';

export const stubModiaContext = () => {
  axios.defaults.adapter = require('axios/lib/adapters/http');

  nock('http://localhost:80')
    .get(`${MODIACONTEXTHOLDER_ROOT}/context/aktivenhet`)
    .reply(200, {
      ...aktivEnhetMockData,
    });
};
