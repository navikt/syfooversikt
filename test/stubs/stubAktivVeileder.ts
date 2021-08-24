import nock from 'nock';
import { SYFOVEILEDER_ROOT } from '../../src/utils/apiUrlUtil';
import veilederInfoMockData from '../../Mock/Data/veilederInfo.json';
import axios from 'axios';

export const stubAktivVeileder = () => {
  axios.defaults.adapter = require('axios/lib/adapters/http');

  nock('http://localhost:80')
    .get(`${SYFOVEILEDER_ROOT}/v2/veileder/self`)
    .reply(200, {
      ...veilederInfoMockData,
    });
};
