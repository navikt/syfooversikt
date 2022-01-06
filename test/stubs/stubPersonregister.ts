import nock from 'nock';
import { SYFOPERSONREST_ROOT } from '@/utils/apiUrlUtil';
import personregisterMockData from '../../mock/data/personInfo.json';
import axios from 'axios';
import { nockBasePath } from './nockDefaults';

export const stubPersonregister = () => {
  axios.defaults.adapter = require('axios/lib/adapters/http');

  nock(nockBasePath)
    .post(`${SYFOPERSONREST_ROOT}/v2/person/info`)
    .reply(200, () => [...personregisterMockData]);
};
