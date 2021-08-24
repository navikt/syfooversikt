import nock from 'nock';
import { SYFOPERSONREST_ROOT } from '../../src/utils/apiUrlUtil';
import personregisterMockData from '../../Mock/Data/personInfo.json';
import axios from 'axios';

export const stubPersonregister = () => {
  axios.defaults.adapter = require('axios/lib/adapters/http');

  nock('http://localhost:80')
    .post(`${SYFOPERSONREST_ROOT}/v2/person/info`)
    .reply(200, () => [...personregisterMockData]);
};
