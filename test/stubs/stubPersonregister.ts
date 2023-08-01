import nock from 'nock';
import { SYFOPERSON_ROOT } from '@/apiConstants';
import { personInfoMock } from '../../mock/data/personInfoMock';
import axios from 'axios';
import { nockBasePath } from './nockDefaults';

export const stubPersonregister = () => {
  axios.defaults.adapter = require('axios/lib/adapters/http');

  nock(nockBasePath)
    .post(`${SYFOPERSON_ROOT}/person/info`)
    .reply(200, () => [...personInfoMock]);
};
